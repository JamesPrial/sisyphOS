# VFS Authentication Setup

## Environment Variable Configuration

The VFS API uses Raindrop's secret management system for the API key - NO hardcoded keys!

### How It Works

1. **Manifest Declaration**: The `raindrop.manifest` file declares the environment variable:
   ```hcl
   application "sisyphos-vfs" {
     env "VFS_API_KEY" {
       secret = true
     }
     // ... services
   }
   ```

2. **Code Access**: The TypeScript service accesses it via the `Env` interface:
   ```typescript
   const apiKey = this.env.VFS_API_KEY;
   ```

3. **Secret Storage**: The actual value is stored in Raindrop's secret system (NOT in git).

### Setting the API Key

Set the secret value using the Raindrop CLI:

```bash
cd raindrop-backend

# Set the secret (replace with your key)
raindrop build env set env:VFS_API_KEY "your-secret-key-here" -a sisyphos-vfs

# Deploy the application
raindrop build deploy
```

**Current Key**: REDACTED

### Verifying the Setup

1. After deploying, test the authentication:
   ```bash
   # This should return 401 Unauthorized
   curl https://svc-01k8e379b9y5gw6aa7k4mgv0sr.01k87j6r0dgg0hzj25a7gs11c1.lmapp.run/api/files

   # This should work (replace with your key)
   curl -H "Authorization: Bearer your-secret-key-here" \
     https://svc-01k8e379b9y5gw6aa7k4mgv0sr.01k87j6r0dgg0hzj25a7gs11c1.lmapp.run/api/files
   ```

### Security Notes

- ✅ API key is stored in environment variables (not in code)
- ✅ `.env` file is gitignored (won't be committed)
- ✅ `.env.example` shows the format (safe to commit)
- ⚠️ Use a strong, unique key for production
- ⚠️ Rotate keys regularly
- ⚠️ Never commit actual keys to version control

### Changing the API Key

1. Update the environment variable (locally and in Raindrop cloud)
2. Update the key in your frontend localStorage or re-login
3. Redeploy backend if needed

### Current Default (Development Only)

For development/demo purposes, the default key in `.env` is:
```
VFS_API_KEY=sisyphos-2024
```

**Important:** Change this for production use!
