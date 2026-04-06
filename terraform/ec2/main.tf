# terraform/ec2/main.tf
provider "aws" {
  region = "ap-south-1"
}

resource "aws_key_pair" "trading" {
  key_name   = "trading-devops-key"
  public_key = file("~/.ssh/trading-devops-key.pub")
}

resource "aws_security_group" "trading_sg" {
  name        = "trading-app-sg"
  description = "TradingApp Security Group"

  dynamic "ingress" {
    for_each = [22, 80, 443, 3306, 8080, 8081, 9000, 9090, 3001]
    content {
      from_port   = ingress.value
      to_port     = ingress.value
      protocol    = "tcp"
      cidr_blocks = ["0.0.0.0/0"]
    }
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "trading_ec2" {
  ami                    = "ami-0f5ee92e2d63afc18"  # Ubuntu 22.04 ap-south-1
  instance_type          = "t3.large"
  key_name               = aws_key_pair.trading.key_name
  vpc_security_group_ids = [aws_security_group.trading_sg.id]

  root_block_device {
    volume_size = 30
    volume_type = "gp3"
  }

  tags = {
    Name        = "trading-devops"
    Environment = "learning"
    ManagedBy   = "terraform"
  }

  user_data = file("../../scripts/setup-ec2.sh")
}

output "ec2_public_ip" {
  value = aws_instance.trading_ec2.public_ip
}
