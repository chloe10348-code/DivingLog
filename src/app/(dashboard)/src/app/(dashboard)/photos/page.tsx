'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import {
  Folder,
  loadFolders,
  saveFolders,
  getDefaultIcon,
  DEFAULT_FOLDER_ICONS,
  type Photo,
} from '@/lib/photoWallData';
import FolderCard from '@/components/PhotoWall/FolderCard';
import StickyWall from '@/components/PhotoWall/StickyWall';
import { Plus, Images, Upload, X, Camera } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function PhotosPage() {
  const { user } = useAuth();
  const [folders, setFolders] = useState<Folder[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedIconId, setSelectedIconId] = useState('ocean');
  const [showWall, setShowWall] = useState(false);
  const [wallPhotos, setWallPhotos] = useState<Photo[]>([]);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [targetFolderId, setTargetFolderId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const data = loadFolders();
    setFolders(data);
  }, []);

  const saveFoldersData = (newFolders: Folder[]) => {
    setFolders(newFolders);
    saveFolders(newFolders);
  };

  const createFolder = () => {
    if (!newFolderName.trim()) return;
    const newFolder: Folder = {
      id: Date.now().toString(),
      name: newFolderName.trim(),
      iconId: selectedIconId,
      photos: [],
      createdAt: new Date(),
    };
    saveFoldersData([...folders, newFolder]);
    setNewFolderName('');
    setShowCreateDialog(false);
  };

  const deleteFolder = (folderId: string) => {
    if (!confirm('确定要删除这个文件夹吗？')) return;
    saveFoldersData(folders.filter(f => f.id !== folderId));
  };

  const renameFolder = (folderId: string, newName: string) => {
    saveFoldersData(
      folders.map(f =>
        f.id === folderId ? { ...f, name: newName } : f
      )
    );
  };

  const handleUpload = (folderId: string) => {
    setTargetFolderId(folderId);
    setShowUploadDialog(true);
  };

  const uploadPhotos = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !targetFolderId || !user) return;

    setUploading(true);
    try {
      const newPhotos: Photo[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        const url = await new Promise<string>((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
        newPhotos.push({
          id: Date.now() + '-' + i,
          url,
          caption: file.name.split('.')[0] || '潜水照片',
          uploadedAt: new Date(),
          userId: user.uid,
          userName: user.displayName || '我',
        });
      }

      saveFoldersData(
        folders.map(f =>
          f.id === targetFolderId
            ? { ...f, photos: [...f.photos, ...newPhotos] }
            : f
        )
      );
      setShowUploadDialog(false);
      setTargetFolderId(null);
    } catch (error) {
      console.error('上传失败:', error);
    } finally {
      setUploading(false);
    }
  };

  const openPhotoWall = () => {
    const allPhotos = folders.flatMap(f => f.photos);
    setWallPhotos(allPhotos);
    setShowWall(true);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* 顶部 */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
            📸 照片墙
          </h1>
          <p className="text-gray-500 mt-1">管理你的潜水照片，创建专属相册</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={openPhotoWall}
            className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition shadow-lg hover:shadow-xl"
          >
            <Images className="h-5 w-5" />
            查看照片墙
            <span className="bg-white/20 text-xs px-2 py-0.5 rounded-full">
              {folders.reduce((sum, f) => sum + f.photos.length, 0)}
            </span>
          </button>
          <button
            onClick={() => setShowCreateDialog(true)}
            className="bg-white border-2 border-dashed border-cyan-300 hover:border-cyan-400 text-cyan-700 px-4 py-2 rounded-xl flex items-center gap-2 transition"
          >
            <Plus className="h-5 w-5" />
            新建文件夹
          </button>
        </div>
      </div>

      {/* 文件夹列表 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {folders.map((folder) => (
          <FolderCard
            key={folder.id}
            folder={folder}
            onClick={() => {
              // 点击文件夹进入详情（可以后续扩展）
            }}
            onEdit={(newName) => renameFolder(folder.id, newName)}
            onDelete={() => deleteFolder(folder.id)}
            onUpload={() => handleUpload(folder.id)}
          />
        ))}
        {/* 新建文件夹卡片 */}
        <div
          className="aspect-square rounded-2xl border-2 border-dashed border-gray-300 hover:border-cyan-400 flex flex-col items-center justify-center cursor-pointer transition group"
          onClick={() => setShowCreateDialog(true)}
        >
          <div className="text-4xl mb-2 text-gray-300 group-hover:text-cyan-400 transition">+</div>
          <span className="text-sm text-gray-400 group-hover:text-cyan-500 transition">新建文件夹</span>
        </div>
      </div>

      {/* 创建文件夹对话框 */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>📁 新建文件夹</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <Input
              placeholder="文件夹名称"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              className="border-cyan-200 focus:border-cyan-400"
            />
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">选择封面图标</label>
              <div className="grid grid-cols-5 gap-2">
                {DEFAULT_FOLDER_ICONS.map((icon) => (
                  <button
                    key={icon.id}
                    className={`aspect-square rounded-xl flex flex-col items-center justify-center gap-0.5 border-2 transition ${
                      selectedIconId === icon.id
                        ? 'border-cyan-500 bg-cyan-50'
                        : 'border-gray-200 hover:border-cyan-300'
                    }`}
                    onClick={() => setSelectedIconId(icon.id)}
                  >
                    <span className="text-2xl">{icon.emoji}</span>
                    <span className="text-[8px] text-gray-400">{icon.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <Button
              onClick={createFolder}
              className="w-full bg-cyan-600 hover:bg-cyan-700"
              disabled={!newFolderName.trim()}
            >
              创建文件夹
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 上传对话框 */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>📤 上传照片</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <label className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-cyan-400 transition block">
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={uploadPhotos}
                disabled={uploading}
              />
              <div className="flex flex-col items-center gap-2">
                <Camera className="h-10 w-10 text-gray-400" />
                <span className="text-sm text-gray-500">
                  {uploading ? '上传中...' : '点击选择照片'}
                </span>
                <span className="text-xs text-gray-400">支持多张上传</span>
              </div>
            </label>
          </div>
        </DialogContent>
      </Dialog>

      {/* 照片墙全屏视图 */}
      {showWall && (
        <StickyWall
          photos={wallPhotos}
          onClose={() => setShowWall(false)}
        />
      )}
    </div>
  );
}
