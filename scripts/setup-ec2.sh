#!/bin/bash
set -euo pipefail

echo "=== [1/8] System Update ==="
sudo apt-get update -y && sudo apt-get upgrade -y
sudo apt-get install -y curl wget git unzip jq htop

echo "=== [2/8] Docker ==="
curl -fsSL https://get.docker.com | bash
sudo usermod -aG docker ubuntu
sudo systemctl enable docker

echo "=== [3/8] Docker Compose v2 ==="
sudo apt-get install -y docker-compose-plugin

echo "=== [4/8] .NET 8 SDK ==="
wget https://packages.microsoft.com/config/ubuntu/22.04/packages-microsoft-prod.deb
sudo dpkg -i packages-microsoft-prod.deb
sudo apt-get update -y && sudo apt-get install -y dotnet-sdk-8.0

echo "=== [5/8] Node.js 20 ==="
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

echo "=== [6/8] kubectl ==="
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl

echo "=== [7/8] Helm ==="
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

echo "=== [8/8] Security Tools ==="
# AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip && sudo ./aws/install

# ArgoCD CLI
curl -sSL -o argocd https://github.com/argoproj/argo-cd/releases/latest/download/argocd-linux-amd64
sudo install -m 555 argocd /usr/local/bin/argocd

# Trivy
wget -qO - https://aquasecurity.github.io/trivy-repo/deb/public.key | sudo apt-key add -
echo deb https://aquasecurity.github.io/trivy-repo/deb $(lsb_release -sc) main | \
  sudo tee /etc/apt/sources.list.d/trivy.list
sudo apt-get update && sudo apt-get install -y trivy

# Cosign
curl -LO "https://github.com/sigstore/cosign/releases/latest/download/cosign-linux-amd64"
sudo install -m 755 cosign-linux-amd64 /usr/local/bin/cosign

# eksctl
curl --silent --location "https://github.com/weaveworks/eksctl/releases/latest/download/eksctl_Linux_amd64.tar.gz" | tar xz -C /tmp
sudo mv /tmp/eksctl /usr/local/bin

# SonarQube kernel settings
sudo sysctl -w vm.max_map_count=262144
echo "vm.max_map_count=262144" | sudo tee -a /etc/sysctl.conf

echo "=== ✅ EC2 Setup Complete ==="
echo "Restart shell or run: newgrp docker"
