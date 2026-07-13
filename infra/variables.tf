variable "aws_region" {
  description = "AWS region for the S3 bucket."
  type        = string
  default     = "eu-west-2"
}

variable "project" {
  description = "Short project name, used to build resource names and tags."
  type        = string
  default     = "tsc-tools"
}

variable "environment" {
  description = "Deployment environment (e.g. prod, staging). Part of resource names."
  type        = string
  default     = "prod"
}

variable "bucket_name" {
  description = "Globally-unique S3 bucket name for the app's static assets (hero images live under a hero/ prefix). Leave empty to auto-generate from project/environment plus a random suffix."
  type        = string
  default     = ""
}

variable "price_class" {
  description = "CloudFront price class. PriceClass_100 = NA + EU only (cheapest), PriceClass_All = global."
  type        = string
  default     = "PriceClass_100"

  validation {
    condition     = contains(["PriceClass_100", "PriceClass_200", "PriceClass_All"], var.price_class)
    error_message = "price_class must be one of PriceClass_100, PriceClass_200, PriceClass_All."
  }
}

variable "default_ttl" {
  description = "Default CloudFront cache TTL in seconds."
  type        = number
  default     = 86400 # 1 day
}

variable "max_ttl" {
  description = "Maximum CloudFront cache TTL in seconds."
  type        = number
  default     = 604800 # 7 days
}

# --- Optional custom domain -------------------------------------------------
# Leave domain_aliases empty to serve from the default *.cloudfront.net domain
# with the default CloudFront certificate (no ACM cert required).

variable "domain_aliases" {
  description = "Optional custom domain(s) for the distribution, e.g. [\"cdn.example.com\"]. Requires acm_certificate_arn."
  type        = list(string)
  default     = []
}

variable "acm_certificate_arn" {
  description = "Bring-your-own: ARN of an existing ACM certificate in us-east-1 covering domain_aliases. Leave empty to have Terraform create one (see create_certificate)."
  type        = string
  default     = ""
}

variable "create_certificate" {
  description = "Create a new ACM certificate (in us-east-1) for domain_aliases instead of supplying acm_certificate_arn. Ignored if acm_certificate_arn is set or domain_aliases is empty."
  type        = bool
  default     = false
}

variable "route53_zone_id" {
  description = "Route 53 hosted zone ID for domain_aliases. If set alongside create_certificate, the cert is DNS-validated automatically. If empty, you must add the validation records manually (see acm_validation_records output)."
  type        = string
  default     = ""
}

variable "tags" {
  description = "Additional tags applied to all resources."
  type        = map(string)
  default     = {}
}
