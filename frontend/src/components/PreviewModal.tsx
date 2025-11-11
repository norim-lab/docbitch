import { X, Download } from 'lucide-react';
import { Document } from '../types';
import { useState } from 'react';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: Document | null;
  onDownload: (document: Document) => void;
}

export default function PreviewModal({ isOpen, onClose, document, onDownload }: PreviewModalProps) {
  const [imageError, setImageError] = useState(false);

  if (!isOpen || !document) return null;

  const renderPreview = () => {
    // Image preview
    if (document.file_type.startsWith('image/')) {
      return (
        <div className="flex items-center justify-center bg-gray-100 rounded-lg p-4">
          {imageError ? (
            <div className="text-center text-gray-500">
              <p>Vorschau konnte nicht geladen werden</p>
            </div>
          ) : (
            <img
              src={`/${document.file_path}`}
              alt={document.title}
              className="max-w-full max-h-[60vh] object-contain"
              onError={() => setImageError(true)}
            />
          )}
        </div>
      );
    }

    // PDF preview
    if (document.file_type === 'application/pdf') {
      return (
        <div className="bg-gray-100 rounded-lg p-4">
          <iframe
            src={`/${document.file_path}`}
            className="w-full h-[60vh] border-0"
            title={document.title}
          />
        </div>
      );
    }

    // Text preview
    if (document.file_type === 'text/plain') {
      return (
        <div className="bg-gray-100 rounded-lg p-4">
          <iframe
            src={`/${document.file_path}`}
            className="w-full h-[60vh] border-0"
            title={document.title}
          />
        </div>
      );
    }

    // No preview available
    return (
      <div className="flex flex-col items-center justify-center bg-gray-100 rounded-lg p-8 h-[60vh]">
        <div className="text-6xl mb-4">📄</div>
        <p className="text-gray-600 mb-4">Vorschau nicht verfügbar</p>
        <button
          onClick={() => onDownload(document)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          <Download size={20} />
          <span>Herunterladen</span>
        </button>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 py-8">
        <div className="fixed inset-0 bg-black opacity-75" onClick={onClose} />

        <div className="relative bg-white rounded-lg shadow-xl max-w-5xl w-full p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{document.title}</h2>
              {document.description && (
                <p className="text-gray-600 mt-1">{document.description}</p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onDownload(document)}
                className="p-2 hover:bg-gray-100 rounded"
                title="Herunterladen"
              >
                <Download size={20} />
              </button>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded">
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Preview */}
          {renderPreview()}
        </div>
      </div>
    </div>
  );
}
