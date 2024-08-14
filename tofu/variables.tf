variable "project_id" {
  description = "Your GCP project ID"
  type        = string
}

variable "region" {
  description = "The region to deploy resources to"
  type        = string
  default     = "europe-west4"
}

variable "zone" {
  description = "The zone to deploy resources to"
  type        = string
  default     = "europe-west4-a"
}

variable "machine_type" {
  description = "The machine type for the Compute Engine instance"
  type        = string
  default     = "e2-micro"
}

variable "boot_disk_image" {
  description = "The boot disk image for the Compute Engine instance"
  type        = string
  default     = "cos-cloud/cos-stable"
}

variable "docker_image" {
  description = "The full name of your Docker image on Docker Hub (e.g., 'username/image:tag')"
  type        = string
  default     = "thatbagu/website"
}

variable "http_port" {
  description = "The port to allow HTTP traffic on"
  type        = number
  default     = ["80", "443"]
}

variable "tf_state_bucket" {
  description = "The name of the GCS bucket for Terraform state"
  type        = string
  default     = "tofu-state-243"
}
