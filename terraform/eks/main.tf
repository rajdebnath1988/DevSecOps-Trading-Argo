# terraform/eks/main.tf
module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 20.0"

  cluster_name    = "trading-eks"
  cluster_version = "1.29"
  vpc_id          = module.vpc.vpc_id
  subnet_ids      = module.vpc.private_subnets

  # Public endpoint for learning; restrict in production
  cluster_endpoint_public_access = true

  eks_managed_node_groups = {
    trading_nodes = {
      instance_types = ["t3.medium"]
      capacity_type  = "SPOT"       # ~70% cheaper for learning
      min_size       = 1
      max_size       = 4
      desired_size   = 2
      disk_size      = 30

      labels = {
        role = "worker"
      }
    }
  }

  tags = {
    Environment = "learning"
    Project     = "trading-app"
  }
}
