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
    ports    = ["30000"]  # Default Luanti port
  }

  allow {
    protocol = "tcp"
    ports    = ["9100"]  # Prometheus metrics
  }

  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["luanti-server"]
}

# Create a persistent disk for Luanti data
resource "google_compute_disk" "luanti_data" {
  name = "luanti-data-disk"
  type = "pd-balanced"
  zone = var.zone
  size = 20  # GB

  # Enable higher IOPS for better database performance
  provisioned_iops = 1000
}
resource "google_compute_instance" "minetest_server" {
  name         = "minetest-server"
  machine_type = var.machine_type
  zone         = var.zone

  boot_disk {
    initialize_params {
      image = "cos-cloud/cos-stable"
      size  = 20  # GB
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
          image = "warr1024/minetestserver:latest-perf"  # Using performance monitoring enabled version
          name  = "minetest"
          env = [
            {
              name  = "PORT"
              value = "30000"
            },
            {
              name  = "NAME"
              value = "Minetest @ ${var.domain_name}"
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
              value = "sqlite3"  # Using SQLite for local storage
            },
            {
              name  = "PROMETHEUS_LISTEN_ADDR"
              value = "0.0.0.0:9100"
            }
          ]
          volumeMounts = [
            {
              name      = "luanti-data"
              mountPath = "/data"  # Main data directory
            },
            {
              name      = "luanti-perf"
              mountPath = "/perf"  # Performance data directory
            }
          ]
          ports = [
            {
              containerPort = 30000
              hostPort     = 30000
            },
            {
              containerPort = 9100  # Prometheus metrics
              hostPort     = 9100
            }
          ]
          securityContext = {
            capabilities = {
              add = ["PERFMON"]  # Required for performance monitoring
            }
          }
        }]
        volumes = [
          {
            name = "luanti-data"
            gcePersistentDisk = {
              pdName = google_compute_disk.luanti_data.name
              fsType = "ext4"
            }
          },
          {
            name = "luanti-perf"
            hostPath = {
              path = "/var/lib/luanti-perf"
              type = "DirectoryOrCreate"
            }
          }
        ]
      }
    })
  }

  tags = ["minetest-server"]

  # Ensure the instance can be gracefully stopped
  deletion_protection = false
  allow_stopping_for_update = true

  service_account {
    scopes = ["cloud-platform"]
  }
}
