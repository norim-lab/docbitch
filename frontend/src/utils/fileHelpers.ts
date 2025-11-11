export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

export const getFileIcon = (mimeType: string): string => {
  if (mimeType.startsWith('image/')) return '🖼️';
  if (mimeType === 'application/pdf') return '📄';
  if (mimeType.includes('word')) return '📝';
  if (mimeType === 'text/plain') return '📃';
  return '📎';
};

export const getFileTypeLabel = (mimeType: string): string => {
  const types: Record<string, string> = {
    'application/pdf': 'PDF',
    'image/jpeg': 'JPEG Bild',
    'image/jpg': 'JPG Bild',
    'image/png': 'PNG Bild',
    'image/gif': 'GIF Bild',
    'text/plain': 'Text',
    'application/msword': 'Word Dokument',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word Dokument',
  };

  return types[mimeType] || 'Dokument';
};

export const canPreview = (mimeType: string): boolean => {
  return (
    mimeType.startsWith('image/') ||
    mimeType === 'application/pdf' ||
    mimeType === 'text/plain'
  );
};
