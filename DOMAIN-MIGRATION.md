# Domain Migration Announcement Templates

## Discord / Slack / LINE / Social Media

> **📢 GSO Domain Migration Complete**
>
> **New domain:** https://www.wksl.site
> **Old domain:** rosantoscs1997.com (expiring soon)
>
> All existing share links (`/s/...`) will continue to work via automatic redirect for now.
> Please update your bookmarks and shared links to the new domain.
>
> 🔗 **New home:** https://www.wksl.site
> 🔍 **Explore:** https://www.wksl.site/browse
> 📤 **Upload:** https://www.wksl.site/#upload

---

## Email Template

**Subject:** GSO Domain Change: New home at www.wksl.site

Hi there,

We're migrating GSO to a new domain: **https://www.wksl.site**

The old domain `rosantoscs1997.com` is expiring and will no longer be renewed.

**What you need to do:**
- Update any bookmarks to https://www.wksl.site
- Share links using the new domain going forward
- Existing `/s/...` share links will redirect automatically (temporarily)

**Key pages:**
- Home: https://www.wksl.site
- Explore files: https://www.wksl.site/browse
- Upload: https://www.wksl.site/#upload
- Contact: https://www.wksl.site/contact

Thanks for using GSO!
— The GSO Team

---

## SEO / Webmaster Notes

1. **Google Search Console:** Verify `www.wksl.site` property, submit new sitemap
2. **Google AdSense:** Add `www.wksl.site` to authorized sites
3. **Analytics:** Update GA4 property if domain-specific
4. **Redirects:** two layers, both permanent:
   - App-level fallback in `next.config.ts` (`redirects()` matches the old domains and the bare apex)
   - Vercel 301 redirect from `rosantoscs1997.com/*` → `www.wksl.site/*` (Vercel Dashboard)
5. **Canonical origin:** `SITE_URL` in `app/lib/seo.ts` (used as `metadataBase` in `app/layout.tsx`) is set to `https://www.wksl.site`, so OG/canonical URLs never fall back to the deployment host

---

## Quick Commands

```bash
# Generate fresh mapping CSV (requires BLOB_READ_WRITE_TOKEN)
npm run gen:mapping

# Or with token inline
BLOB_READ_WRITE_TOKEN=xxx npm run gen:mapping

# Output: share-mapping.csv with old_url,new_url pairs
```

---

## Vercel Redirect Setup (one-time)

1. Go to Vercel Dashboard → Project `gus-oxo` → Settings → Domains
2. Find `rosantoscs1997.com` → Click `...` → Edit → Redirect
3. Destination: `https://www.wksl.site`
4. Type: `301` (Permanent)
5. Save

⚠️ **Must be done BEFORE domain expires** — once DNS is removed, redirect stops working.

**App-level fallback:** `next.config.ts` also contains `redirects()` that permanently
send the old domains and the bare apex (`wksl.site`) to `https://www.wksl.site`. It only
fires if a request still reaches this deployment on those hosts, so it complements (does
not replace) the Dashboard redirect.