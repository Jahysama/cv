{
 inputs = {
   nixpkgs.url = "github:NixOS/nixpkgs/nixos-24.05";
   devenv.url = "github:cachix/devenv";
   nixpkgs-python.url = "github:cachix/nixpkgs-python";
   nixpkgs-python.inputs.nixpkgs.follows = "nixpkgs";
 };

 nixConfig = {
   extra-trusted-public-keys = "devenv.cachix.org-1:w1cLUi8dv3hnoSPGAuibQv+f9TZLr6cv/Hm9XgU50cw=";
   extra-substituters = "https://devenv.cachix.org";
 };

 outputs = { self, nixpkgs, devenv, ... } @ inputs:
   let
     system = "x86_64-linux";
     pkgs = nixpkgs.legacyPackages.${system};
   in
   {
     packages.${system}.devenv-up = self.devShells.${system}.default.config.procfileScript;

     devShells.${system}.default = devenv.lib.mkShell {
       inherit inputs pkgs;
       modules = [
         {
           languages.python = {
             enable = true;
             version = "3.11";
             venv = {
               enable = true;
               requirements = ./requirements.txt;
             };
           };
         }
       ];
     };
   };
}
