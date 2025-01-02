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

variable "tf_state_bucket" {
  description = "The name of the GCS bucket for Terraform state"
  type        = string
  default     = "tofu-state-243"
}

variable "machine_type" {
  description = "The machine type for the Compute Engine instance"
  type        = string
  default     = "e2-medium"
}

variable "domain_name" {
  description = "The domain name for the server"
  type        = string
  default     = "kosaretsky.co.uk"
}

