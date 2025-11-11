import { Document } from '../types';
import DocumentCard from './DocumentCard';

interface DocumentGridProps {
  documents: Document[];
  onView: (document: Document) => void;
  onEdit: (document: Document) => void;
  onDelete: (document: Document) => void;
  onDownload: (document: Document) => void;
}

export default function DocumentGrid({
  documents,
  onView,
  onEdit,
  onDelete,
  onDownload,
}: DocumentGridProps) {
  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-6xl mb-4">📁</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Keine Dokumente</h3>
        <p className="text-gray-500">Laden Sie Ihr erstes Dokument hoch</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {documents.map((document) => (
        <DocumentCard
          key={document.id}
          document={document}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
          onDownload={onDownload}
        />
      ))}
    </div>
  );
}
