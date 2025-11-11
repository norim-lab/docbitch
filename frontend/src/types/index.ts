export interface Document {
  id: number;
  title: string;
  description?: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  folder_id?: number;
  folder_name?: string;
  tags?: string;
  created_at: string;
  updated_at: string;
}

export interface Folder {
  id: number;
  name: string;
  description?: string;
  color: string;
  document_count: number;
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: number;
  name: string;
  color: string;
  usage_count?: number;
  created_at: string;
}

export interface UploadProgress {
  fileName: string;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  error?: string;
}
