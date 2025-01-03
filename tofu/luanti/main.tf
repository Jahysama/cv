provider "google" {
  project = var.project_id
  region  = var.region
  zone    = var.zone
}

terraform {
  backend "gcs" {
    bucket = var.tf_state_bucket
    prefix = "terraform/state"
  }
}

# Create a persistent disk for Luanti data
resource "google_compute_disk" "luanti_data" {
  name             = "luanti-data-disk"
  type             = "pd-balanced"
  zone             = var.zone
  size             = 20 # GB
}

# Create a static IP
resource "google_compute_address" "luanti_ip" {
  name = "luanti-server-ip"
}

# Create firewall rules for Luanti and monitoring
resource "google_compute_firewall" "luanti_server" {
  name    = "allow-luanti"
  network = "default"

  allow {
    protocol = "udp"
    ports    = ["30000"] # Default Luanti port
  }

  allow {
    protocol = "tcp"
    ports    = ["9100"] # Prometheus metrics
  }

  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["luanti-server"]
}

resource "local_file" "minetest_conf" {
  filename = "minetest.conf"
  content  = <<-EOT
    server_name = ${var.domain_name}
    server_description = Super cool Egor's server
    server_address = ${google_compute_address.luanti_ip.address}
    port = 30000
    
    # Game settings
    default_game = mineclone2
    creative_mode = false
    enable_damage = true
    
    # Server list settings
    server_announce = true
    serverlist_url = servers.minetest.net
    
    # Security settings
    enable_rollback_recording = true
    disallow_empty_passwords = true
    disable_anticheat = false
    default_privs = interact, shout
    
    # Performance settings
    max_users = 15
    max_simultaneous_block_sends_per_client = 10
    max_packets_per_iteration = 1024
    time_speed = 72
    max_block_send_distance = 12
    active_block_range = 4
    server_map_save_interval = 15.3
    
    # Database settings
    enable_sqlite3 = true
    sqlite_synchronous = 0
    sqlite_journal_mode = WAL
    
    # Welcome message
    motd = Welcome to my cool server
    
    # Debug and monitoring
    enable_debug_log = true
    debug_log_level = warning
    prometheus_listener_address = 0.0.0.0:9100
  EOT
}

# Create the Compute Engine instance
resource "google_compute_instance" "luanti_server" {
  name         = "luanti-server"
  machine_type = var.machine_type
  zone         = var.zone

  attached_disk {
    source      = google_compute_disk.luanti_data.self_link
    device_name = "luanti-data-disk"
    mode        = "READ_WRITE"
  }

  boot_disk {
    initialize_params {
      image = "cos-cloud/cos-stable"
      size  = 20 # GB
    }
  }

  network_interface {
    network = "default"
    access_config {
      nat_ip = google_compute_address.luanti_ip.address
    }
  }

  metadata = {
    gce-container-declaration = yamlencode({
      spec = {
        containers = [{
          image = "warr1024/minetestserver:latest" # Base image since perf tag isn't available
          name  = "luanti"
          env = [
            {
              name  = "PORT"
              value = "30000"
            },
            {
              name  = "NAME"
              value = "Luanti @ ${var.domain_name}"
            },
            {
              name  = "SERVER_ANNOUNCE"
              value = "true"
            },
            {
              name  = "ENABLE_ROLLBACK"
              value = "true"
            },
            {
              name  = "BACKEND"
              value = "sqlite3" # Using SQLite for local storage
            },
            {
              name  = "PROMETHEUS_LISTEN_ADDR"
              value = "0.0.0.0:9100"
            }
          ]
          volumeMounts = [
            {
              name      = "luanti-data"
              mountPath = "/data" # Main data directory
            }
          ]
          ports = [
            {
              containerPort = 30000
              hostPort     = 30000
            }
          ]
        }]
        volumes = [
          {
            name = "luanti-data"
            gcePersistentDisk = {
              pdName = "luanti-data-disk"
              fsType = "ext4"
              readOnly = false
            }
          }
        ]
      }
    })
  }

  tags = ["luanti-server"]

  service_account {
    scopes = ["cloud-platform"]
  }

  allow_stopping_for_update = true
  deletion_protection       = false
}
