# Custom Domain Setup (Optional)

The VFS backend is currently accessible via Raindrop's default `.lmapp.run` domain:

```
https://svc-01k8e379b9y5gw6aa7k4mgv0sr.01k87j6r0dgg0hzj25a7gs11c1.lmapp.run
```

This works perfectly! However, if you want a custom domain like `vfs.yourdomain.com`, here's how to set it up.

## Status: Not Currently Configured

We attempted to configure `vfs.jamesprial.xyz` but encountered DNS API issues with Raindrop.

## What Was Set Up

1. ✅ DNS zone created for `jamesprial.xyz`
2. ✅ Nameservers configured: `emma.ns.cloudflare.com`, `lex.ns.cloudflare.com`
3. ❌ CNAME record not created (API routing error)

## If You Want to Set Up a Custom Domain

### Option 1: Manual DNS Configuration

If you have access to Cloudflare dashboard or Raindrop web UI:

1. Create a CNAME record:
   - **Name:** `vfs`
   - **Type:** CNAME
   - **Target:** `svc-01k8e379b9y5gw6aa7k4mgv0sr.01k87j6r0dgg0hzj25a7gs11c1.lmapp.run`

2. Update frontend API URL in `src/services/fileSystemAPI.js`:
   ```javascript
   const API_URL = 'https://vfs.yourdomain.com';
   ```

### Option 2: Use the Raindrop CLI (Troubleshooting Needed)

The DNS API requires a zone ID instead of zone name:

```bash
# This command fails:
raindrop dns records create jamesprial.xyz CNAME vfs [target]

# Error: "Could not route to /client/v4/zones/jamesprial.xyz"
```

**Issue:** Need to find the zone ID (not just the zone name).

Potential solution: Check Raindrop dashboard or try:
```bash
raindrop dns list -o json
# Look for a zone ID field in the output
```

## Why Custom Domains Are Optional

The default `.lmapp.run` URL works perfectly fine:
- ✅ CORS enabled
- ✅ HTTPS with valid certificate
- ✅ Public accessibility
- ✅ No rate limits
- ✅ Full API functionality

The only difference is URL aesthetics:
- Default: `svc-01k8e379b9y5gw6aa7k4mgv0sr.01k87j6r0dgg0hzj25a7gs11c1.lmapp.run`
- Custom: `vfs.yourdomain.com`

## Current Recommendation

**Use the default URL.** It's working, tested, and requires no additional configuration.

If you need a shorter URL for sharing, consider using a URL shortener like bit.ly or creating a redirect.

---

**"One must imagine the domain configuration happy."** - Albert Camus (probably)
