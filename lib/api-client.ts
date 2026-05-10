import { auth } from './firebase';

class ApiClient {
  private async getAuthHeaders() {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (auth.currentUser) {
      const token = await auth.currentUser.getIdToken();
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  async verifyAuth(token: string) {
    const response = await fetch('/api/auth/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) return null;
    return response.json();
  }

  async fetch(url: string, options: RequestInit = {}) {
    const headers = {
      ...(await this.getAuthHeaders()),
      ...options.headers,
    };
    
    const response = await fetch(url, { ...options, headers });
    if (!response.ok) {
      let message = 'An error occurred';
      try {
        const errorData = await response.json();
        message = errorData.error || message;
      } catch (e) {}
      throw new Error(message);
    }
    
    // For 204 No Content or blob responses
    if (response.status === 204) return null;
    
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }
    
    return response.blob();
  }
}

export const apiClient = new ApiClient();
