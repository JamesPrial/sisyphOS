// Virtual File System API Client
// Using Raindrop-provided domain (bucket-only architecture)
const API_URL = 'https://svc-01k8e379b9y5gw6aa7k4mgv0sr.01k87j6r0dgg0hzj25a7gs11c1.lmapp.run';

// Get API key from localStorage
const getApiKey = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('vfs_api_key');
  }
  return null;
};

// Add API key as query parameter to avoid CORS preflight
const addApiKeyParam = (url) => {
  const apiKey = getApiKey();
  if (!apiKey) return url;
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}api_key=${encodeURIComponent(apiKey)}`;
};

export const fileSystemAPI = {
  async getEscalation() {
    const url = addApiKeyParam(`${API_URL}/api/escalation`);
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to get escalation');
    return response.json();
  },

  async updateEscalation(interactions) {
    const url = addApiKeyParam(`${API_URL}/api/escalation`);
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ interactions }),
    });
    if (!response.ok) throw new Error('Failed to update escalation');
    return response.json();
  },

  async listFiles(parentId = null) {
    const baseUrl = parentId ? `${API_URL}/api/files?parent_id=${parentId}` : `${API_URL}/api/files`;
    const url = addApiKeyParam(baseUrl);
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to list files');
    return response.json();
  },

  async uploadFile(file, parentId = null) {
    const formData = new FormData();
    formData.append('file', file);
    if (parentId) formData.append('parent_id', parentId);
    const url = addApiKeyParam(`${API_URL}/api/files`);
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to upload file');
    return response.json();
  },

  async downloadFile(fileId) {
    const url = addApiKeyParam(`${API_URL}/api/files/${fileId}/content`);
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to download file');
    return response.blob();
  },

  async deleteFile(fileId) {
    const url = addApiKeyParam(`${API_URL}/api/files/${fileId}`);
    const response = await fetch(url, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete file');
    return response.json();
  },

  async createFolder(name, parentId = null) {
    const url = addApiKeyParam(`${API_URL}/api/folders`);
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, parent_id: parentId }),
    });
    if (!response.ok) throw new Error('Failed to create folder');
    return response.json();
  },

  async deleteFolder(folderId) {
    const url = addApiKeyParam(`${API_URL}/api/folders/${folderId}`);
    const response = await fetch(url, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete folder');
    return response.json();
  },

  async searchFiles(query) {
    const url = addApiKeyParam(`${API_URL}/api/files/search`);
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });
    if (!response.ok) throw new Error('Search failed');
    return response.json();
  },

  async renameFile(fileId, newName) {
    const url = addApiKeyParam(`${API_URL}/api/files/${fileId}/rename`);
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: newName }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to rename file');
    }
    return data;
  },

  async checkRespawns() {
    const url = addApiKeyParam(`${API_URL}/api/respawn-check`);
    const response = await fetch(url);
    if (!response.ok) throw new Error('Respawn check failed');
    return response.json();
  },
};
