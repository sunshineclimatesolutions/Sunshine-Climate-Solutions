# Access and Ownership

How SCS platform access is structured, how to grant or revoke it safely, and how to onboard or
offboard an agency **without handing over primary ownership**.

**Hard rule: never commit passwords, recovery codes, authentication tokens, personal account
emails, payment details, donor information or confidential customer records to this
repository.** This document records account *types* and permission *procedures* only.

Last reviewed: **October 1, 2026**

## Account map (types, not identifiers)

| Platform / service | Account type | Typical required role | Notes |
| --- | --- | --- | --- |
| GitHub repository | Owner-controlled GitHub account/org (`sunshineclimatesolutions`) | Admin (owner); Write (developers); Read (reviewers) | `main` deploys to production — write access is production access |
| Cloudflare (hosting/DNS) | Owner-controlled Cloudflare account | Administrator (owner only) | Contains DNS incl. Google Workspace MX/SPF/DKIM and an unrelated AI subdomain tunnel — never delegate casually |
| Google Search Console | Domain property; originally verified by the owner's personal Google account; SCS business Google account has been granted ownership | Owner (full) / Restricted (agencies) | Do not create a duplicate property. Personal account identifiers must never be recorded here |
| Google Analytics 4 | Owner-controlled Google account | Administrator (owner); Analyst/Viewer (agencies) | Measurement `G-EQ9CBESN23` |
| Google Tag Manager | Owner-controlled Google account | Administrator (owner); Edit/Publish (trusted staff); Read (agencies) | Container `GTM-MBGJ8SLD`; publishing affects live analytics |
| Google Business Profile | Owner-controlled Google account | Owner/Manager (owner); Manager or Communications (staff/agency) | Business facts stay governed by `business.ts` |
| Bing Webmaster Tools / Bing Places | Owner-controlled Microsoft account | Administrator (owner); delegated users per platform | Bing Places syncs from GBP |
| Apple Business Connect | Owner-controlled Apple account | Administrator (owner) | Status pending owner confirmation |
| Web3Forms | Owner-controlled Web3Forms account | Owner only (key rotation) | The site-side access key is public by design; the account itself is not |
| Umami Cloud | Owner-controlled Umami account | Administrator (owner); Viewer (analytics help) | Cookieless analytics |
| Social profiles (Facebook, Instagram, TikTok, YouTube, X, Nextdoor, Yelp, Gab, Parler) | Owner-controlled accounts | Admin/Manager (owner); page roles per platform (staff/agency) | Profile URLs live in `business.ts` |
| GoFundMe / GiveSendGo | Owner-controlled campaign accounts | Owner only | Donation/donor data never enters the repository or website analytics |
| Domain registration | Owner-controlled registrar/Cloudflare | Owner only | Do not change nameservers without explicit authorization |

If a platform is not listed here, it is not part of the documented SCS operating system — do
not invent accounts, integrations or credentials.

## Permission principles

1. **Least privilege.** Give the minimum role that allows the work (viewer/analyst by default;
   edit/publish only where needed).
2. **No shared primary credentials.** Never share the owner's main account password. Use
   platform-native user invitations, roles, or agency accounts.
3. **Two-factor authentication** stays enabled on owner accounts; do not disable or bypass it.
4. **Named accounts.** Every person/agency gets their own user identity so access can be
   revoked individually.
5. **Owner verifies independently.** After any grant, the owner confirms the change in the
   platform's user/access screen (never rely on a screenshot alone for lasting access).
6. **Document the change.** Access changes should be noted in the owner's private records —
   never in this repository with personal identifiers.

## Onboarding an agency without giving away ownership

1. Decide the platforms and the minimum roles (usually: GA4 Viewer/Analyst; GTM Read or Edit
   without Publish; GSC Restricted; GBP Manager; social page roles; Cloudflare/GitHub usually
   **not** granted).
2. Invite the agency's own account through each platform's user management — never share
   credentials.
3. Keep **primary ownership** (Cloudflare, domain, GBP owner, GA4/GTM Administrator, GitHub
   Admin) with the owner.
4. Confirm the agency can do its work with the granted role; escalate only if genuinely needed.
5. Record what was granted, to whom (by role/agency name), and when — in the owner's private
   records.

## Revoking contractor/agency access at engagement end

1. Remove the user from each platform's user-management screen (GitHub, Cloudflare, Google
   properties, Bing, social platforms, Web3Forms, Umami, fundraising platforms).
2. Rotate any credential the contractor could have seen (Web3Forms key, API tokens) — the
   Web3Forms key is site-visible by design, but rotate if abuse is suspected and update
   `business.ts` / the Cloudflare environment variable.
3. Review recent changes: GTM versions (roll back if needed), GA4 configuration, GBP edits,
   GitHub commits/branches, Cloudflare deployments.
4. Revoke any personal access tokens or deploy keys issued to the contractor.
5. Confirm with the owner that no access remains.

## What must never be stored in this repository

- Passwords, recovery codes, 2FA secrets, API tokens, private keys, DPAPI material.
- Personal account email addresses or account-recovery information.
- Donor identities, donation amounts, or fundraiser payout details.
- Customer names, addresses, phone numbers, emails or form submissions.
- Payment/bank details.

If confidential material must be stored for operations, the owner keeps it in their approved
private location and grants access through platform user management — this repository only
describes the procedure.

## Related documentation

- Platform status: `docs/operations/PLATFORM-STATUS.md`
- Automation inventory: `docs/operations/AUTOMATION-REGISTER.md`
- Maintenance cadence (including periodic access review): `docs/operations/MAINTENANCE-SCHEDULE.md`
- Agent rules (never push/deploy without approval): `AGENTS.md`
