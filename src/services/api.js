const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('token');
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  getAuthHeader() {
    return this.token ? { Authorization: `Bearer ${this.token}` } : {};
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...this.getAuthHeader(),
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (response.status === 401) {
        this.clearToken();
        window.location.href = '/';
        throw new Error('Session expired. Please login again.');
      }

      if (!response.ok) {
        throw new Error(data.error || `Error: ${response.status}`);
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Auth endpoints
  async register(email, password, role, industry, department) {
    const data = await this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, role, industry, department }),
    });
    if (data.data.token) {
      this.setToken(data.data.token);
    }
    return data;
  }

  async login(email, password) {
    const data = await this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data.data.token) {
      this.setToken(data.data.token);
    }
    return data;
  }

  async logout() {
    try {
      await this.request('/api/auth/logout', { method: 'POST' });
    } finally {
      this.clearToken();
    }
  }

  async getMe() {
    return this.request('/api/auth/me');
  }

  // Profile endpoints
  async getProfile() {
    return this.request('/api/profile');
  }

  async updateProfile(role, industry, department) {
    return this.request('/api/profile', {
      method: 'PUT',
      body: JSON.stringify({ role, industry, department }),
    });
  }

  async getProfileOptions() {
    return this.request('/api/profile/options');
  }

  // Content endpoints
  async listContent(filters = {}) {
    const params = new URLSearchParams();
    if (filters.type) params.append('type', filters.type);
    if (filters.role) params.append('role', filters.role);
    if (filters.industry) params.append('industry', filters.industry);
    if (filters.difficulty) params.append('difficulty', filters.difficulty);

    const query = params.toString();
    const endpoint = query ? `/api/content?${query}` : '/api/content';
    return this.request(endpoint);
  }

  async getContent(id) {
    return this.request(`/api/content/${id}`);
  }

  async searchContent(query) {
    return this.request(`/api/content/search?q=${encodeURIComponent(query)}`);
  }

  async createContent(contentData) {
    return this.request('/api/content', {
      method: 'POST',
      body: JSON.stringify(contentData),
    });
  }

  async updateContent(id, contentData) {
    return this.request(`/api/content/${id}`, {
      method: 'PUT',
      body: JSON.stringify(contentData),
    });
  }

  async deleteContent(id) {
    return this.request(`/api/content/${id}`, { method: 'DELETE' });
  }

  async isSaved(contentId) {
    return this.request(`/api/content/${contentId}/saved`);
  }

  async saveContent(contentId) {
    return this.request(`/api/content/${contentId}/save`, {
      method: 'POST',
    });
  }

  async unsaveContent(contentId) {
    return this.request(`/api/content/${contentId}/save`, {
      method: 'DELETE',
    });
  }

  async getSavedContent() {
    // Get saved content through the auth-protected list endpoint
    // For now, this would require a dedicated endpoint
    // TODO: Add GET /api/saved-content endpoint
    return this.request('/api/saved-content');
  }
}

export default new ApiClient();
