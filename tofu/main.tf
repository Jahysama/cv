# Configure the Google Cloud provider
provider "google" {
  project = "your-project-id"
  region  = "us-central1"
  zone    = "us-central1-a"
}

# Create a GCP Compute Engine instance
resource "google_compute_instance" "website_instance" {
  name         = "website-instance"
  machine_type = "e2-micro"

  boot_disk {
    initialize_params {
      image = "cos-cloud/cos-stable"
    }
  }

  network_interface {
    network = "default"

    access_config {
      // Ephemeral IP
    }
  }

  metadata = {
    gce-container-declaration = <<EOF
spec:
  containers:
    - image: 'gcr.io/${var.project_id}/${var.image_name}:${var.image_tag}'
      name: website
      ports:
        - containerPort: 80
EOF
  }

  tags = ["http-server"]
}

# Allow HTTP traffic
resource "google_compute_firewall" "allow_http" {
  name    = "allow-http"
  network = "default"

  allow {
    protocol = "tcp"
    ports    = ["80"]
  }

  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["http-server"]
}

# Variables
variable "project_id" {
  description = "Your GCP project ID"
}

variable "image_name" {
  description = "Name of your Docker image"
}

variable "image_tag" {
  description = "Tag of your Docker image"
  default     = "latest"
}

# Output the external IP of the instance
output "website_url" {
  value = google_compute_instance.website_instance.network_interface[0].access_config[0].nat_ip
}
