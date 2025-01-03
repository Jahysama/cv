output "luanti_server_ip" {
  value = google_compute_address.luanti_ip.address
  description = "The public IP address of the Luanti server"
}

output "luanti_server_domain" {
  value = "${var.domain_name}:30000"
  description = "The domain and port for the Luanti server"
}

output "luanti_server_port" {
  value = "30000"
  description = "The port number for the Luanti server"
}
