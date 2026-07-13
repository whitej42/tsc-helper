output "bucket_name" {
  description = "Name of the S3 bucket holding the app's static assets."
  value       = aws_s3_bucket.hero.id
}

output "bucket_arn" {
  description = "ARN of the app assets bucket."
  value       = aws_s3_bucket.hero.arn
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID (used for cache invalidations)."
  value       = aws_cloudfront_distribution.hero.id
}

output "cloudfront_domain_name" {
  description = "Default *.cloudfront.net domain for the distribution."
  value       = aws_cloudfront_distribution.hero.domain_name
}

output "certificate_arn" {
  description = "ARN of the ACM certificate used by the distribution (BYO or created)."
  value       = local.certificate_arn
}

output "acm_validation_records" {
  description = "DNS validation records to add manually when create_certificate=true but no route53_zone_id is provided. Empty otherwise."
  value = local.manage_certificate && !local.auto_validate ? [
    for dvo in aws_acm_certificate.hero[0].domain_validation_options : {
      name  = dvo.resource_record_name
      type  = dvo.resource_record_type
      value = dvo.resource_record_value
    }
  ] : []
}

output "hero_base_url" {
  description = "Base URL to set as REACT_APP_HERO_BASE_URL. Uses the custom domain if configured, otherwise the CloudFront domain."
  value       = local.use_custom_domain ? "https://${var.domain_aliases[0]}" : "https://${aws_cloudfront_distribution.hero.domain_name}"
}
