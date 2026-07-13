terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # Remote state. Configured at init time via `-backend-config` so no secrets
  # or account-specific values live in the repo. See the pipeline / README.
  backend "s3" {}
}

# Default provider — region for the S3 bucket and most resources.
provider "aws" {
  region = var.aws_region
}

# CloudFront requires ACM certificates to live in us-east-1, so we keep a
# dedicated aliased provider for the (optional) custom-domain certificate.
provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"
}
