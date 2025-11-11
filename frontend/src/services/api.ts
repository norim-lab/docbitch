import axios from 'axios';
import { Document, Folder, Tag } from '../types';

// Determine API URL based on environment
const getApiUrl = () => {
  // If VITE_API_URL is set, use it
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // In development, use Vite proxy
  if (import.meta.env.DEV) {
    return '/api';
  }

  // In production, use same origin
  return '/api';
};

const api = axios.create({
  baseURL: getApiUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Document API
export const documentApi = {
  getAll: (filters?: { folderId?: number; search?: string }) => {
    return api.get<Document[]>('/documents', { params: filters });
  },

  getById: (id: number) => {
    return api.get<Document>(`/documents/${id}`);
  },

  upload: (formData: FormData, onProgress?: (progress: number) => void) => {
    return api.post<Document>('/documents', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });
  },

  update: (id: number, data: Partial<Document>) => {
    return api.put<Document>(`/documents/${id}`, data);
  },

  delete: (id: number) => {
    return api.delete(`/documents/${id}`);
  },

  download: (id: number) => {
    return api.get(`/documents/${id}/download`, {
      responseType: 'blob',
    });
  },

  addTags: (id: number, tagIds: number[]) => {
    return api.post<Document>(`/documents/${id}/tags`, { tagIds });
  },

  removeTags: (id: number, tagIds: number[]) => {
    return api.delete<Document>(`/documents/${id}/tags`, { data: { tagIds } });
  },
};

// Folder API
export const folderApi = {
  getAll: () => {
    return api.get<Folder[]>('/folders');
  },

  getById: (id: number) => {
    return api.get<Folder>(`/folders/${id}`);
  },

  create: (data: Omit<Folder, 'id' | 'document_count' | 'created_at' | 'updated_at'>) => {
    return api.post<Folder>('/folders', data);
  },

  update: (id: number, data: Partial<Folder>) => {
    return api.put<Folder>(`/folders/${id}`, data);
  },

  delete: (id: number) => {
    return api.delete(`/folders/${id}`);
  },
};

// Tag API
export const tagApi = {
  getAll: () => {
    return api.get<Tag[]>('/tags');
  },

  getById: (id: number) => {
    return api.get<Tag>(`/tags/${id}`);
  },

  create: (data: Omit<Tag, 'id' | 'usage_count' | 'created_at'>) => {
    return api.post<Tag>('/tags', data);
  },

  update: (id: number, data: Partial<Tag>) => {
    return api.put<Tag>(`/tags/${id}`, data);
  },

  delete: (id: number) => {
    return api.delete(`/tags/${id}`);
  },
};

export default api;
