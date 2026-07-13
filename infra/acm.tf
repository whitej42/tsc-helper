# ACM certificate for the CloudFront custom domain.
#
# CloudFront certs MUST live in us-east-1, hence the aws.us_east_1 provider.
# Three mutually-exclusive modes, resolved in local.certificate_arn (main.tf):
#
#   1. acm_certificate_arn set  -> bring your own cert, nothing created here.
#   2. create_certificate=true + route53_zone_id set -> cert created AND
#      DNS-validated automatically via Route 53.
#   3. create_certificate=true, no route53_zone_id -> cert created but you must
#      add the DNS validation records yourself (see the acm_validation_records
#      output); apply will not complete the CloudFront cert wiring until valid.

locals {
  manage_certificate = var.acm_certificate_arn == "" && var.create_certificate && local.use_custom_domain
  auto_validate      = local.manage_certificate && var.route53_zone_id != ""
}

resource "aws_acm_certificate" "hero" {
  count    = local.manage_certificate ? 1 : 0
  provider = aws.us_east_1

  domain_name               = var.domain_aliases[0]
  subject_alternative_names = slice(var.domain_aliases, 1, length(var.domain_aliases))
  validation_method         = "DNS"

  tags = local.common_tags

  lifecycle {
    create_before_destroy = true
  }
}

# --- Auto DNS validation via Route 53 (mode 2) ------------------------------

resource "aws_route53_record" "acm_validation" {
  for_each = local.auto_validate ? {
    for dvo in aws_acm_certificate.hero[0].domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      type   = dvo.resource_record_type
      record = dvo.resource_record_value
    }
  } : {}

  zone_id         = var.route53_zone_id
  name            = each.value.name
  type            = each.value.type
  records         = [each.value.record]
  ttl             = 60
  allow_overwrite = true
}

resource "aws_acm_certificate_validation" "hero" {
  count    = local.auto_validate ? 1 : 0
  provider = aws.us_east_1

  certificate_arn         = aws_acm_certificate.hero[0].arn
  validation_record_fqdns = [for r in aws_route53_record.acm_validation : r.fqdn]
}
