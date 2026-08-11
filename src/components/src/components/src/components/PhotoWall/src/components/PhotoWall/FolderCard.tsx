'use client';

import { Folder, getDefaultIcon } from '@/lib/photoWallData';
import { Folder as FolderIcon, Plus, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface FolderCardProps {
  folder: Folder;
  onClick: () => void;
  onEdit: (newName: string) => void;
  onDelete: () => void;
  onUpload: () => void;
}

export default function FolderCard({ folder, onClick, onEdit, onDelete, onUpload }: FolderCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(folder.name);
  const icon = getDefaultIcon(folder.iconId);

  const photoCount = folder.photos.length;

  const handleEdit = () => {
    setIsEditing(true);
    setShowMenu(false);
  };

  const handleSaveName = () => {
    if (newName.trim()) {
      onEdit(newName.trim());
    }
    setIsEditing(false);
  };

  return (
    <div className="relative group">
      <div
        onClick={onClick}
        className="cursor-pointer rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
      >
        {/* 封面 */}
        <div className="relative aspect-square">
          {folder.coverImage ? (
            <img
              src={folder.coverImage}
              alt={folder.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ background: icon.bg }}
            >
              <span className="text-6xl">{icon.emoji}</span>
            </div>
          )}
          {/* 照片数量徽章 */}
          <div className="absolute bottom-2 right-2 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
            {photoCount} 张
          </div>
          {/* 上传按钮（悬停显示） */}
          <button
            onClick={(e) => { e.stopPropagation(); onUpload(); }}
            className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm text-slate-700 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        {/* 底部信息 */}
        <div className="p-3 flex items-center justify-between">
          {isEditing ? (
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onBlur={handleSaveName}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
              className="text-sm font-medium bg-transparent border-b border-cyan-500 outline-none focus:border-cyan-600"
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span className="text-sm font-medium text-slate-700 truncate">{folder.name}</span>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
            className="p-1 hover:bg-gray-100 rounded-full transition"
          >
            <MoreVertical className="h-4 w-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* 下拉菜单 */}
      {showMenu && (
        <div className="absolute top-2 right-2 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-10 min-w-[120px]">
          <button
            onClick={() => { handleEdit(); }}
            className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-gray-50 flex items-center gap-2"
          >
            <Edit2 className="h-3 w-3" />
            重命名
          </button>
          <button
            onClick={() => { setShowMenu(false); onDelete(); }}
            className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2"
          >
            <Trash2 className="h-3 w-3" />
            删除文件夹
          </button>
        </div>
      )}
    </div>
  );
}

