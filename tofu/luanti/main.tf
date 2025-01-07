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
resource "google_compute_address" "luanti_game" {
  name         = "luanti-game-ip"
  region       = var.region
  address_type = "EXTERNAL"
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

resource "google_compute_instance_group" "luanti" {
  name        = "luanti-instance-group"
  description = "Luanti servers instance group"
  zone        = var.zone

  instances = [
    google_compute_instance.luanti_server.id,
  ]

  named_port {
    name = "game"
    port = 30000
  }
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
          securityContext = {
          privileged = true  # Add this to ensure proper permissions
        }
        args = ["--gameid", "mineclone2", "--config", "/home/app/.minetest/minetest.conf"]
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

resource "google_compute_http_health_check" "luanti" {
  name               = "luanti-health-check"
  port               = 30000
  check_interval_sec = 5
  timeout_sec        = 5
}

resource "google_compute_target_pool" "luanti" {
  name = "luanti-target-pool"
  
  instances = [
    "${var.zone}/${google_compute_instance.luanti_server.name}"
  ]

  health_checks = [
    google_compute_http_health_check.luanti.name
  ]
}

resource "google_compute_forwarding_rule" "luanti" {
  name        = "luanti-forwarding-rule"
  region      = var.region
  target      = google_compute_target_pool.luanti.id
  ip_address  = google_compute_address.luanti_game.address
  port_range  = "30000"
}
