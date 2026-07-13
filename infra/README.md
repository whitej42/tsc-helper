# infra/ — Hero asset CDN (S3 + CloudFront)

Terraform for the hero-image CDN used by the home page. It creates:

- A **private** S3 bucket (public access blocked, encrypted, versioned) holding the hero JPGs.
- A **CloudFront** distribution that serves the bucket over HTTPS, using an **Origin Access Control** so the bucket is only reachable through CloudFront — never directly.

The React app points at this via `REACT_APP_HERO_BASE_URL` (see the `hero_base_url` output).

## Layout

| File | Purpose |
|------|---------|
| `versions.tf` | Provider + Terraform version constraints, S3 remote-state backend. |
| `variables.tf` | Input variables (all have sensible defaults). |
| `main.tf` | S3 bucket, bucket policy, OAC, CloudFront distribution. |
| `outputs.tf` | Bucket name, distribution ID, and the base URL for the app. |
| `terraform.tfvars.example` | Copy to `terraform.tfvars` for local runs. |

## One-time bootstrap (remote state)

The backend stores state in S3 with DynamoDB locking. These must exist **before** the first `init` (Terraform can't create its own backend). Create once, per AWS account:

```bash
aws s3api create-bucket --bucket my-tfstate-bucket --region eu-west-2 \
  --create-bucket-configuration LocationConstraint=eu-west-2
aws s3api put-bucket-versioning --bucket my-tfstate-bucket \
  --versioning-configuration Status=Enabled
aws dynamodb create-table --table-name my-tf-locks \
  --attribute-definitions AttributeName=LockID,AttributeType=S \
  --key-schema AttributeName=LockID,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST --region eu-west-2
```

## Running locally

```bash
cd infra
cp terraform.tfvars.example terraform.tfvars   # edit as needed

terraform init \
  -backend-config="bucket=my-tfstate-bucket" \
  -backend-config="key=hero-cdn/terraform.tfstate" \
  -backend-config="region=eu-west-2" \
  -backend-config="dynamodb_table=my-tf-locks" \
  -backend-config="encrypt=true"

terraform plan
terraform apply
```

Then upload the images and read the base URL:

```bash
aws s3 sync ../src/assets/images/hero/ "s3://$(terraform output -raw bucket_name)/hero/" \
  --cache-control "public, max-age=604800"

terraform output -raw hero_base_url   # -> set REACT_APP_HERO_BASE_URL to "<this>/hero"
```

## CI/CD pipeline

`.github/workflows/infra.yml` runs `plan` on pull requests and `apply` on push to `main`
(only when `infra/**` changes). It authenticates to AWS via **GitHub OIDC** — no static
access keys are stored. The workflow requests a short-lived token (`id-token: write`) and
assumes the deployer role. It is otherwise configured **entirely through environment
variables** — nothing account-specific is committed.

### Required GitHub **Variables**

| Variable | Example | Purpose |
|----------|---------|---------|
| `AWS_ROLE_TO_ASSUME` | `arn:aws:iam::212892117339:role/TerraformPipelineDeployerRole` | IAM role assumed via OIDC to manage S3 + CloudFront. |
| `AWS_REGION` | `eu-west-2` | Region for the bucket + provider. |
| `TF_BACKEND_BUCKET` | `my-tfstate-bucket` | Remote-state bucket (from bootstrap). |
| `TF_BACKEND_KEY` | `hero-cdn/terraform.tfstate` | State object key. |
| `TF_BACKEND_REGION` | `eu-west-2` | Region of the state bucket. |
| `TF_BACKEND_DYNAMODB_TABLE` | `my-tf-locks` | Lock table (from bootstrap). |

### Optional GitHub **Variables** (Terraform inputs)

| Variable | Maps to | Default |
|----------|---------|---------|
| `TF_VAR_PROJECT` | `var.project` | `tsc-tools` |
| `TF_VAR_ENVIRONMENT` | `var.environment` | `prod` |
| `TF_VAR_BUCKET_NAME` | `var.bucket_name` | auto-generated |
| `TF_VAR_PRICE_CLASS` | `var.price_class` | `PriceClass_100` |
| `TF_VAR_DOMAIN_ALIASES` | `var.domain_aliases` | `[]` — use HCL list syntax, e.g. `["cdn.example.com"]` |
| `TF_VAR_ACM_CERTIFICATE_ARN` | `var.acm_certificate_arn` | `""` (BYO cert; must be in **us-east-1**) |
| `TF_VAR_CREATE_CERTIFICATE` | `var.create_certificate` | `false` — set `true` to have TF create the cert |
| `TF_VAR_ROUTE53_ZONE_ID` | `var.route53_zone_id` | `""` — set for automatic DNS validation |

## Custom domain

Leave `domain_aliases` empty to serve from the default `*.cloudfront.net` domain with the
default certificate — no cert needed.

To use your own domain you need an ACM certificate **in us-east-1** covering that hostname.
A cert managed by Amplify cannot be reused here — it's owned by the Amplify service — so
this stack gets its own. Pick one:

**A. Bring your own cert** — request it in ACM (us-east-1) yourself, then set:
```hcl
domain_aliases      = ["cdn.tsc-tools.example.com"]
acm_certificate_arn = "arn:aws:acm:us-east-1:...:certificate/..."
```

**B. Let Terraform create it** (`acm.tf`):
```hcl
domain_aliases     = ["cdn.tsc-tools.example.com"]
create_certificate = true
route53_zone_id    = "Z0123..."   # optional
```
- With `route53_zone_id`: the cert is DNS-validated **automatically** and apply completes end to end.
- Without it: the cert is created but you must add the DNS records from the
  `acm_validation_records` output to your provider, then re-run apply.

Finally, point a DNS `CNAME`/alias for your hostname at the `cloudfront_domain_name` output.
