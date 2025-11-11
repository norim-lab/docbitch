import { Folder, Tag, Plus, X } from 'lucide-react';
import { Folder as FolderType, Tag as TagType } from '../types';

interface SidebarProps {
  folders: FolderType[];
  tags: TagType[];
  selectedFolderId?: number;
  onFolderSelect: (folderId?: number) => void;
  onCreateFolder: () => void;
  onCreateTag: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({
  folders,
  tags,
  selectedFolderId,
  onFolderSelect,
  onCreateFolder,
  onCreateTag,
  isOpen,
  onClose,
}: SidebarProps) {
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-30
          w-64 bg-white border-r border-gray-200
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="h-full overflow-y-auto p-4">
          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="lg:hidden absolute top-4 right-4 p-2 rounded-md text-gray-600 hover:bg-gray-100"
          >
            <X size={20} />
          </button>

          {/* All Documents */}
          <div className="mb-6">
            <button
              onClick={() => {
                onFolderSelect(undefined);
                onClose();
              }}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                selectedFolderId === undefined
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Folder size={20} />
              <span className="font-medium">Alle Dokumente</span>
            </button>
          </div>

          {/* Folders */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-gray-500 uppercase">Ordner</h2>
              <button
                onClick={onCreateFolder}
                className="p-1 rounded hover:bg-gray-100"
                title="Neuer Ordner"
              >
                <Plus size={16} className="text-gray-600" />
              </button>
            </div>
            <div className="space-y-1">
              {folders.map((folder) => (
                <button
                  key={folder.id}
                  onClick={() => {
                    onFolderSelect(folder.id);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                    selectedFolderId === folder.id
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: folder.color }}
                    />
                    <span className="truncate">{folder.name}</span>
                  </div>
                  <span className="text-xs text-gray-500">{folder.document_count}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-gray-500 uppercase">Tags</h2>
              <button
                onClick={onCreateTag}
                className="p-1 rounded hover:bg-gray-100"
                title="Neuer Tag"
              >
                <Plus size={16} className="text-gray-600" />
              </button>
            </div>
            <div className="space-y-1">
              {tags.map((tag) => (
                <div
                  key={tag.id}
                  className="flex items-center justify-between px-3 py-2 text-sm"
                >
                  <div className="flex items-center space-x-2">
                    <Tag size={16} style={{ color: tag.color }} />
                    <span className="text-gray-700">{tag.name}</span>
                  </div>
                  {tag.usage_count !== undefined && (
                    <span className="text-xs text-gray-500">{tag.usage_count}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
