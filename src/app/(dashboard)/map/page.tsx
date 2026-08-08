'use client';

import { useState } from 'react';
import { MapPin, Star, Waves } from 'lucide-react';

// 潜点数据（精简）
const DIVE_SITES = [
  { id: 1, name: '大堡礁', location: '澳大利亚', lat: -18.2871, lng: 147.6992, rating: 4.9, image: '🏝️' },
  { id: 2, name: '拉贾安帕特', location: '印度尼西亚', lat: -0.5, lng: 130.0, rating: 5.0, image: '🐠' },
  { id: 3, name: '马尔代夫', location: '马尔代夫', lat: 3.2028, lng: 73.2207, rating: 4.8, image: '🌴' },
  { id: 4, name: '加拉帕戈斯', location: '厄瓜多尔', lat: -0.5, lng: -90.5, rating: 5.0, image: '🦁' },
  { id: 5, name: '红海', location: '埃及', lat: 27.0, lng: 34.0, rating: 4.8, image: '🏜️' },
  { id: 6, name: '帕劳', location: '帕劳', lat: 7.3, lng: 134.5, rating: 4.9, image: '🌸' },
  { id: 7, name: '西巴丹岛', location: '马来西亚', lat: 4.1, lng: 118.6, rating: 5.0, image: '🐢' },
  { id: 8, name: '图巴塔哈群礁', location: '菲律宾', lat: 8.95, lng: 119.87, rating: 4.9, image: '⭐' },
];

export default function MapPage() {
  const [selectedSite, setSelectedSite] = useState<any>(null);

  // 构建 Google Maps 嵌入 URL
  const mapCenter = selectedSite 
    ? `${selectedSite.lat},${selectedSite.lng}` 
    : '0,0';
  const mapZoom = selectedSite ? 10 : 2;
  const mapMarkers = selectedSite 
    ? `&markers=color:red%7C${selectedSite.lat},${selectedSite.lng}` 
    : '';

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      {/* Google Maps 嵌入 */}
      <div className="flex-1 relative bg-gray-100">
        <iframe
          src={`https://maps.google.com/maps?q=${mapCenter}&z=${mapZoom}&output=embed${mapMarkers}`}
          className="w-full h-full border-0"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="潜水地图"
        />
      </div>

      {/* 底部潜点列表 */}
      <div className="bg-white border-t border-gray-200 h-48 overflow-y-auto p-4">
        <h3 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
          <Waves className="h-4 w-4 text-cyan-600" /> 
          热门潜水目的地
          <span className="text-xs text-gray-400 font-normal ml-2">({DIVE_SITES.length} 个)</span>
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
          {DIVE_SITES.map((site) => (
            <div
              key={site.id}
              className={`p-2 rounded-lg border cursor-pointer hover:shadow-md transition-all ${
                selectedSite?.id === site.id
                  ? 'border-cyan-500 bg-cyan-50'
                  : 'border-gray-200 hover:border-cyan-300'
              }`}
              onClick={() => setSelectedSite(site)}
            >
              <div className="flex items-center gap-1">
                <span className="text-lg">{site.image}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-slate-700 truncate">{site.name}</p>
                  <p className="text-xs text-gray-500 truncate">{site.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        {selectedSite && (
          <div className="mt-3 p-2 bg-cyan-50 rounded-lg text-sm text-cyan-700">
            📍 当前查看: {selectedSite.image} {selectedSite.name} - {selectedSite.location}
            <span className="ml-2 text-yellow-500">⭐ {selectedSite.rating}</span>
          </div>
        )}
      </div>
    </div>
  );
}

