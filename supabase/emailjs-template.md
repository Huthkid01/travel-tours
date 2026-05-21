# EmailJS Template Setup

Create two templates in EmailJS dashboard.

## Application notification template

**Template ID:** use in `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID`

**Suggested variables:**

| Variable | Description |
|----------|-------------|
| `application_id` | UUID |
| `service_name` | Selected service |
| `full_name` | Customer name |
| `customer_email` | Email |
| `customer_phone` | Phone |
| `country` | Country |
| `address` | Address |
| `purpose` | Purpose |
| `notes` | Additional notes |
| `uploaded_files` | File links (newline separated) |
| `payment_reference` | Payment ref |
| `payment_status` | paid / pending |
| `paymentAmount` | Formatted amount |

**Sample body:**

```
New Application — {{service_name}}

Customer: {{full_name}}
Email: {{customer_email}}
Phone: {{customer_phone}}
Country: {{country}}
Address: {{address}}
Purpose: {{purpose}}
Notes: {{notes}}

Files:
{{uploaded_files}}

Payment: {{payment_reference}} ({{payment_status}}) — {{paymentAmount}}
Application ID: {{application_id}}
Submitted: {{timestamp}}
```

## Contact form template

**Template ID:** `NEXT_PUBLIC_EMAILJS_CONTACT_TEMPLATE_ID`

Variables: `customer_name`, `customer_email`, `customer_phone`, `subject`, `message`
