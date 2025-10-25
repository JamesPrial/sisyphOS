# How to Use the Virtual File System

## ✅ What's Been Set Up

The SisyphOS Virtual File System is fully deployed and ready to use:

1. **✅ Bucket-only backend** - Running on Raindrop cloud (no SQL database!)
2. **✅ API client** - `src/services/fileSystemAPI.js`
3. **✅ File Browser component** - `src/components/apps/FileBrowser.jsx`
4. **✅ Desktop icon** - "files.exe" with 📁 icon at position (300, 350)
5. **✅ Window routing** - Double-click opens File Browser
6. **✅ Cloud persistence** - All files stored in Raindrop bucket storage

## 🚀 How to Use It

### Step 1: Start Your SisyphOS App

```bash
cd /home/jamesprial/code/sisyphOS
npm run dev
```

Open your browser to `http://localhost:5173`

### Step 2: Open the File Browser

1. Look for the **📁 files.exe** icon on the desktop (right side, middle area)
2. **Double-click** the icon
3. The File Browser window will open!

### Step 3: Try It Out

**Upload a file:**
1. Click "📤 Upload File" button
2. Select any file from your computer (up to 5GB!)
3. Watch it appear in the list!

**Create a folder:**
1. Click "➕ New Folder" button
2. Enter a folder name
3. Double-click the folder to navigate into it

**Download a file:**
1. Find a file in the list
2. Click "⬇️ Download" button
3. The file downloads to your computer!

**Delete files/folders:**
1. Click the 🗑️ button next to any file or folder
2. Folders are deleted recursively with all contents

**Navigate folders:**
- Double-click folders to enter them
- Use "⬆️ Back to Root" to return to the top level

## 🧪 Test Data Available

The backend already contains some test data:
- **TestFolder** (empty folder)
- **test.txt** (contains "Hello from VFS!")

Try downloading test.txt to verify everything works!

## 📁 What You Can Do

- ✅ Upload files up to 5GB (images, videos, PDFs, any format!)
- ✅ Create folders and subfolders (unlimited nesting)
- ✅ Download files back to your computer
- ✅ Delete files and folders (recursive deletion)
- ✅ Navigate folder hierarchy
- ✅ **Files persist in the cloud** - they survive page refreshes
- ✅ **Share the filesystem** - Anyone with the URL sees the same files (no authentication!)

## 🌐 Architecture

**Bucket-Only Storage:**
- Metadata stored as JSON: `meta/{id}.json`
- File content: `content/{id}`
- Parent-child relationships via prefixes
- No SQL database (that was causing issues!)

**Current API URL:**
```
https://svc-01k8e379b9y5gw6aa7k4mgv0sr.01k87j6r0dgg0hzj25a7gs11c1.lmapp.run
```

## 🎨 Future Absurdist Features (Ideas)

Want to make it more SisyphOS-like? Potential additions:

1. **File Drift-Back**: Files slowly move back to root folder after organizing
2. **Quantum Files**: File contents change slightly on each download
3. **Sisyphean Search**: Search results randomize each time
4. **Growing Files**: File sizes slowly increase over time
5. **Philosophical Errors**: Show Camus quotes instead of boring error messages
6. **Collaborative Chaos**: Multiple users share the same filesystem (already true!)

## 🔧 Troubleshooting

**File Browser doesn't open:**
1. Check browser console (F12) for errors
2. Make sure `npm run dev` is running
3. Try refreshing the page

**Uploads fail:**
1. Check internet connection
2. Verify backend is running: `cd raindrop-backend && raindrop build status`
3. Check browser console for CORS errors

**Nothing appears:**
1. Open DevTools (F12) → Network tab
2. Try uploading a file
3. Look for requests to `svc-01k8e379b9y5gw6aa7k4mgv0sr.01k87j6r0dgg0hzj25a7gs11c1.lmapp.run`
4. Check for errors (should see 200 OK responses)

## 📊 Backend Status

Check if the backend is running:

```bash
cd raindrop-backend
raindrop build status
```

You should see 5 modules running:
- `_mem` - KV cache
- `annotation-bucket` - Annotations storage
- `annotation-service` - Annotations API
- `vfs-api` - VFS HTTP service ⭐
- `vfs-storage` - File storage bucket ⭐

## 🎉 That's It!

You now have a fully functional cloud-backed file system in SisyphOS!

**Features:**
- ✨ Upload, download, organize files
- ✨ Everything persists in the cloud
- ✨ Works from any browser
- ✨ Shared filesystem (no user accounts)
- ✨ Up to 5GB per file

**"One must imagine the file manager happy."** - Albert Camus (probably)
