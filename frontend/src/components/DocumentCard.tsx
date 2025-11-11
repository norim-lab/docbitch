import { Download, Trash2, Edit, Eye } from 'lucide-react';
import { Document } from '../types';
import { formatFileSize, getFileIcon, getFileTypeLabel } from '../utils/fileHelpers';
import { formatDate } from '../utils/dateHelpers';

interface DocumentCardProps {
  document: Document;
  onView: (document: Document) => void;
  onEdit: (document: Document) => void;
  onDelete: (document: Document) => void;
  onDownload: (document: Document) => void;
}

export default function DocumentCard({
  document,
  onView,
  onEdit,
  onDelete,
  onDownload,
}: DocumentCardProps) {
  const tags = document.tags ? document.tags.split(',') : [];

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      {/* File Icon and Type */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="text-4xl">{getFileIcon(document.file_type)}</div>
          <div>
            <h3 className="font-semibold text-gray-900 line-clamp-1">{document.title}</h3>
            <p className="text-xs text-gray-500">{getFileTypeLabel(document.file_type)}</p>
          </div>
        </div>
      </div>

      {/* Description */}
      {document.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{document.description}</p>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Metadata */}
      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
        <span>{formatFileSize(document.file_size)}</span>
        <span>{formatDate(document.created_at)}</span>
      </div>

      {/* Folder */}
      {document.folder_name && (
        <div className="text-xs text-gray-500 mb-3">
          📁 {document.folder_name}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <button
          onClick={() => onView(document)}
          className="flex items-center space-x-1 text-primary-600 hover:text-primary-700"
        >
          <Eye size={16} />
          <span className="text-sm">Ansehen</span>
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(document)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded"
            title="Bearbeiten"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => onDownload(document)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded"
            title="Herunterladen"
          >
            <Download size={16} />
          </button>
          <button
            onClick={() => onDelete(document)}
            className="p-2 text-red-600 hover:bg-red-50 rounded"
            title="Löschen"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
