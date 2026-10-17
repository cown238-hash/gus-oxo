# Domain Migration Announcement Templates

## Discord / Slack / LINE / Social Media

> **📢 GSO Domain Migration Complete**
>
> **New domain:** https://wksl.site
> **Old domain:** rosantoscs1997.com (expiring soon)
>
> All existing share links (`/s/...`) will continue to work via automatic redirect for now.
> Please update your bookmarks and shared links to the new domain.
>
> 🔗 **New home:** https://wksl.site
> 🔍 **Explore:** https://wksl.site/browse
> 📤 **Upload:** https://wksl.site/#upload

---

## Email Template

**Subject:** GSO Domain Change: New home at wksl.site

Hi there,

We're migrating GSO to a new domain: **https://wksl.site**

The old domain `rosantoscs1997.com` is expiring and will no longer be renewed.

**What you need to do:**
- Update any bookmarks to https://wksl.site
- Share links using the new domain going forward
- Existing `/s/...` share links will redirect automatically (temporarily)

**Key pages:**
- Home: https://wksl.site
- Explore files: https://wksl.site/browse
- Upload: https://wksl.site/#upload
- Contact: https://wksl.site/contact

Thanks for using GSO!
— The GSO Team

---

## SEO / Webmaster Notes

1. **Google Search Console:** Verify `wksl.site` property, submit new sitemap
2. **Google AdSense:** Add `wksl.site` to authorized sites
3. **Analytics:** Update GA4 property if domain-specific
4. **Redirects:** two layers, both 301:
   - App-level fallback in `next.config.ts` (`redirects()` matches the old/www hosts)
   - Vercel 301 redirect from `rosantoscs1997.com/*` → `wksl.site/*` (Vercel Dashboard)
5. **Canonical origin:** `metadataBase` in `app/layout.tsx` is set to `https://wksl.site`, so OG/canonical URLs never fall back to the deployment host

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
3. Destination: `https://wksl.site`
4. Type: `301` (Permanent)
5. Save

⚠️ **Must be done BEFORE domain expires** — once DNS is removed, redirect stops working.

**App-level fallback:** `next.config.ts` also contains `redirects()` that 301 the old
and `www` hosts to `https://wksl.site`. It only fires if a request still reaches this
deployment on those hosts, so it complements (does not replace) the Dashboard redirect.