'use client';

import { Photo } from '@/lib/photoWallData';
import { X, User, Calendar } from 'lucide-react';
import { useState } from 'react';

interface StickyWallProps {
  photos: Photo[];
  onClose: () => void;
  backgroundImage?: string;
}

export default function StickyWall({ photos, onClose, backgroundImage }: StickyWallProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  const stickyColors = [
    'bg-amber-100 rotate-[-2deg]',
    'bg-pink-100 rotate-[1deg]',
    'bg-blue-100 rotate-[-1deg]',
    'bg-green-100 rotate-[2deg]',
    'bg-purple-100 rotate-[-3deg]',
    'bg-yellow-100 rotate-[3deg]',
    'bg-rose-100 rotate-[-1deg]',
    'bg-cyan-100 rotate-[1deg]',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col">
      <div className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-sm border-b border-white/10">
        <h2 className="text-white font-semibold text-lg">📌 照片墙</h2>
        <button
          onClick={onClose}
          className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <div
        className="flex-1 overflow-y-auto p-8"
        style={{
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'url(https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1200)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {photos.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center">
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl max-w-md">
              <div className="text-6xl mb-4">📸</div>
              <h3 className="text-xl font-semibold text-slate-700">还没有照片</h3>
              <p className="text-gray-500 mt-2">上传照片到文件夹，它们会像便签一样贴在这里</p>
            </div>
          </div>
        ) : (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-6 max-w-7xl mx-auto">
            {photos.map((photo, index) => (
              <div
                key={photo.id}
                className={`mb-6 break-inside-avoid ${stickyColors[index % stickyColors.length]} rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer transform hover:scale-[1.02]`}
                onClick={() => setSelectedPhoto(photo)}
                style={{ padding: '12px 12px 20px 12px' }}
              >
                <img
                  src={photo.url}
                  alt={photo.caption}
                  className="w-full rounded-lg aspect-square object-cover"
                  loading="lazy"
                />
                <div className="mt-2 text-xs text-gray-600 line-clamp-2 px-1">
                  {photo.caption || '潜水照片'}
                </div>
                <div className="flex items-center justify-between mt-1 px-1">
                  <span className="text-[10px] text-gray-400 flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {photo.userName || '潜水员'}
                  </span>
                  <span className="text-[10px] text-gray-400 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {photo.uploadedAt?.toLocaleDateString?.('zh-CN') || '最近'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="max-w-4xl max-h-[90vh] bg-white rounded-2xl overflow-hidden flex flex-col md:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="md:w-2/3 bg-gray-100 flex items-center justify-center p-4">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.caption}
                className="max-h-[70vh] object-contain rounded-lg"
              />
            </div>
            <div className="md:w-1/3 p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">{selectedPhoto.caption || '潜水照片'}</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {selectedPhoto.userName || '潜水员'}
                  </p>
                  <p className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {selectedPhoto.uploadedAt?.toLocaleDateString?.('zh-CN') || '未知日期'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => window.open(selectedPhoto.url, '_blank')}
                className="mt-4 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition"
              >
                查看原图
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
