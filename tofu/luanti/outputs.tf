output "game_server_ip" {
  value = google_compute_address.luanti_game.address
  description = "The IP address for the game server. Add an A record for your domain pointing to this IP."
}

output "luanti_server_domain" {
  value = "${var.domain_name}:30000"
  description = "The domain and port for the Luanti server"
}

output "luanti_server_port" {
  value = "30000"
  description = "The port number for the Luanti server"
}
