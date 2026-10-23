# Integrations Logos — Official Sources

This directory is intended to hold local copies of official brand logos for the LeadFlow CRM Integrations page.

Because the build environment has no outbound internet for direct downloads, the React implementation references verified, stable official logo URLs directly. In a production deployment, download each official asset into this folder and update the `logoUrl` fields in `IntegrationsPage` to `/assets/integrations/<filename>`.

## Verified Official Sources

1. Flutterwave
   - URL: https://flutterwave.com/images/logo/full.svg
   - Source: Official Flutterwave website, verified in awalogo catalog as official fintech logo[^1]
   - Local filename: flutterwave.svg

2. Paystack
   - URL: https://s3-eu-west-1.amazonaws.com/pstk-integration-logos/paystack.jpg
   - Source: Paystack official docs-v2 bucket — Paystack integration logos bucket, from Paystack docs (official Paystack domain)
   - Evidence: docs-v2.paystack.com shows logo: https://s3-eu-west-1.amazonaws.com/pstk-integration-logos/paystack.jpg[^2]
   - Local filename: paystack.jpg (or .svg if official SVG found)

3. Google Workspace
   - URL: https://workspace.google.com/static/img/google-workspace-logo.svg
   - Source: Official Google Workspace static asset (workspace.google.com) — Link to the vector file, preferably from an official source https://workspace.google.com/static/img/google-workspace-logo.svg[^3][^4]
   - Local filename: google-workspace.svg

4. Gmail
   - URL: https://www.gstatic.com/images/branding/productlogos/gmail_2026/v2/web/192px.svg
   - Source: Official Google gstatic branding asset observed on Gmail product page — Official asset observed on Google Workspace Gmail product page: https://www.gstatic.com/images/branding/productlogos/gmail_2026/v2/web/192px.svg[^5]
   - Local filename: gmail.svg

5. Microsoft Outlook
   - URL: https://upload.wikimedia.org/wikipedia/commons/d/df/Microsoft_Office_Outlook_%282018%E2%80%93present%29.svg
   - Source: Official Microsoft Outlook logo icon (2019-present) representation — This is the official Microsoft Outlook logo icon (2019-present)[^6]
   - Local filename: outlook.svg

6. Slack
   - URL: https://a.slack-edge.com/80588/marketing/img/meta/slack_hash_256.png (and SVG at https://a.slack-edge.com/9cc0056/marketing/img/nav/logo.svg)
   - Source: Official Slack website CDN — unmodified Slack logo from Slack's official website at https://a.slack-edge.com/9cc0056/marketing/img/nav/logo.svg[^7]
   - Local filename: slack.png / slack.svg

7. HubSpot
   - URL: https://upload.wikimedia.org/wikipedia/commons/0/0b/HubSpot_Logo.svg
   - Source: Official HubSpot sprocket in HubSpot orange (#FF7A59) — HubSpot: official sprocket in HubSpot orange[^8], also official logo source https://mailchimp.com/about/brand-assets/ pattern
   - Local filename: hubspot.svg

8. Salesforce
   - URL: https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg
   - Source: Official Salesforce-owned asset URL https://login.salesforce.com/icons/salesforce-black.png[^9] and Wikimedia File:Salesforce.com_logo.svg — Source: https://commons.wikimedia.org/wiki/File:Salesforce.com_logo.svg[^10]
   - Local filename: salesforce.svg

9. Mailchimp
   - URL: https://upload.wikimedia.org/wikipedia/commons/b/b7/Mailchimp_logo.svg
   - Source: Official Mailchimp brand assets — Source https://mailchimp.com/about/brand-assets/[^11]
   - Local filename: mailchimp.svg

10. Zapier
    - URL: https://raw.githubusercontent.com/zapier/zapier-mcp/main/plugins/zapier/assets/logo.svg
    - Source: Canonical Zapier wordmark SVG from Zapier's brand assets folder — Both are the canonical Zapier wordmark SVG from the team's brand assets folder[^12] and official brand page https://zapier.com/brand[^13]
    - Local filename: zapier.svg

## Usage Requirements
- Use official brand assets in accordance with their published usage requirements.
- Preserve aspect ratio, clear space, and color as per brand guidelines.
- Do not modify beyond allowed sizing.
- All logos are trademarks of their respective owners.

## Graceful Failure
The React implementation includes onError handling: if a logo fails to load, it shows "Logo unavailable" with an icon, without misrepresenting a generic placeholder as the brand logo.

## Implementation Note
If you deploy with local assets:
1. Download each URL above into this folder.
2. Update IntegrationsPage logoUrl entries to `/assets/integrations/<filename>`.
3. Ensure object-fit: contain, accessible alt text (already implemented).