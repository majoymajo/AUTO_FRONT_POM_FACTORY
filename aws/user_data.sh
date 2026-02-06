#!/bin/bash
set -e

# Update the system
sudo yum update -y

# Install Git
sudo yum install -y git

# Install Docker
sudo amazon-linux-extras install docker -y
sudo systemctl enable docker
sudo systemctl start docker

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Add ec2-user to docker group
sudo usermod -aG docker ec2-user

# Clone the repository
cd /home/ec2-user
git clone -b ${repo_branch} ${repo_url} project

# Initialize with a simple web server (NGINX) for verification
sudo yum install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
echo "<h1>Welcome to Sofkianos MVP - Amazon Linux & Repo Cloned</h1>" | sudo tee /usr/share/nginx/html/index.html
