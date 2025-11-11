import { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import DocumentGrid from './components/DocumentGrid';
import UploadModal from './components/UploadModal';
import EditModal from './components/EditModal';
import PreviewModal from './components/PreviewModal';
import { documentApi, folderApi, tagApi } from './services/api';
import { Document, Folder, Tag } from './types';

export default function App() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<number | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  // Load documents when folder or search changes
  useEffect(() => {
    loadDocuments();
  }, [selectedFolderId, searchQuery]);

  const loadData = async () => {
    try {
      const [foldersRes, tagsRes] = await Promise.all([
        folderApi.getAll(),
        tagApi.getAll(),
      ]);
      setFolders(foldersRes.data);
      setTags(tagsRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Fehler beim Laden der Daten');
    } finally {
      setLoading(false);
    }
  };

  const loadDocuments = async () => {
    try {
      const filters: { folderId?: number; search?: string } = {};
      if (selectedFolderId) filters.folderId = selectedFolderId;
      if (searchQuery) filters.search = searchQuery;

      const response = await documentApi.getAll(filters);
      setDocuments(response.data);
    } catch (error) {
      console.error('Error loading documents:', error);
    }
  };

  const handleUpload = async (
    files: File[],
    metadata: { title?: string; description?: string; folderId?: number; tags?: number[] }
  ) => {
    for (const file of files) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        if (metadata.title) formData.append('title', metadata.title);
        if (metadata.description) formData.append('description', metadata.description);
        if (metadata.folderId) formData.append('folderId', metadata.folderId.toString());
        if (metadata.tags) formData.append('tags', JSON.stringify(metadata.tags));

        await documentApi.upload(formData);
      } catch (error) {
        console.error('Error uploading file:', error);
        alert(`Fehler beim Hochladen von ${file.name}`);
      }
    }

    loadDocuments();
    loadData(); // Reload to update folder counts
  };

  const handleEdit = async (id: number, data: Partial<Document>) => {
    try {
      await documentApi.update(id, data);
      loadDocuments();
      loadData();
    } catch (error) {
      console.error('Error updating document:', error);
      alert('Fehler beim Aktualisieren des Dokuments');
    }
  };

  const handleDelete = async (document: Document) => {
    if (!confirm(`Möchten Sie "${document.title}" wirklich löschen?`)) return;

    try {
      await documentApi.delete(document.id);
      loadDocuments();
      loadData();
    } catch (error) {
      console.error('Error deleting document:', error);
      alert('Fehler beim Löschen des Dokuments');
    }
  };

  const handleDownload = async (document: Document) => {
    try {
      const response = await documentApi.download(document.id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', document.file_name);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading document:', error);
      alert('Fehler beim Herunterladen des Dokuments');
    }
  };

  const handleView = (document: Document) => {
    setSelectedDocument(document);
    setIsPreviewModalOpen(true);
  };

  const handleEditClick = (document: Document) => {
    setSelectedDocument(document);
    setIsEditModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-gray-600">Laden...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onMenuClick={() => setIsSidebarOpen(true)}
        onUploadClick={() => setIsUploadModalOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="flex">
        <Sidebar
          folders={folders}
          tags={tags}
          selectedFolderId={selectedFolderId}
          onFolderSelect={setSelectedFolderId}
          onCreateFolder={() => alert('Ordner-Erstellung noch nicht implementiert')}
          onCreateTag={() => alert('Tag-Erstellung noch nicht implementiert')}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <DocumentGrid
            documents={documents}
            onView={handleView}
            onEdit={handleEditClick}
            onDelete={handleDelete}
            onDownload={handleDownload}
          />
        </main>
      </div>

      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleUpload}
        folders={folders}
        tags={tags}
      />

      <EditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleEdit}
        document={selectedDocument}
        folders={folders}
        tags={tags}
      />

      <PreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        document={selectedDocument}
        onDownload={handleDownload}
      />
    </div>
  );
}
