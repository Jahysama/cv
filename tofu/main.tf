# Configure the Google Cloud provider
provider "google" {
  project = var.project_id
  region  = var.region
  zone    = var.zone
}

# Configure the GCS backend
terraform {
  backend "gcs" {
    bucket = var.tf_state_bucket
    prefix = "terraform/state"
  }
}

# Create a GCP Compute Engine instance
resource "google_compute_instance" "website_instance" {
  name         = local.instance_name
  machine_type = var.machine_type

  boot_disk {
    initialize_params {
      image = var.boot_disk_image
    }
  }

  network_interface {
    network = "default"

    access_config {
      nat_ip = google_compute_address.static_ip.address
    }
  }

  metadata = {
    gce-container-declaration = templatefile("${path.module}/container-spec.yaml", {
      docker_image = var.docker_image
    })
  }

  tags = ["http-server"]
}

# Create a static IP address
resource "google_compute_address" "static_ip" {
  name = local.static_ip_name
}

# Allow HTTP traffic
resource "google_compute_firewall" "allow_http" {
  name    = local.firewall_rule_name
  network = "default"

  allow {
    protocol = "tcp"
    ports    = var.http_port
  }

  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["http-server"]
}
