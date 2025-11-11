import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Document, Folder, Tag } from '../types';

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: number, data: Partial<Document>) => void;
  document: Document | null;
  folders: Folder[];
  tags: Tag[];
}

export default function EditModal({ isOpen, onClose, onSave, document, folders }: EditModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [folderId, setFolderId] = useState<number | undefined>();

  useEffect(() => {
    if (document) {
      setTitle(document.title);
      setDescription(document.description || '');
      setFolderId(document.folder_id);
    }
  }, [document]);

  const handleSubmit = () => {
    if (document) {
      onSave(document.id, {
        title,
        description,
        folderId: folderId || undefined,
      });
      onClose();
    }
  };

  if (!isOpen || !document) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black opacity-50" onClick={onClose} />

        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Dokument bearbeiten</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded">
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Titel
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Dokumenttitel"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Beschreibung
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Beschreibung des Dokuments"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ordner
              </label>
              <select
                value={folderId || ''}
                onChange={(e) => setFolderId(e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Kein Ordner</option>
                {folders.map((folder) => (
                  <option key={folder.id} value={folder.id}>
                    {folder.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Dateiname:</strong> {document.file_name}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Typ:</strong> {document.file_type}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Größe:</strong> {(document.file_size / 1024).toFixed(2)} KB
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Abbrechen
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Speichern
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
