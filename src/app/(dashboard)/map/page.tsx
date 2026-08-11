'use client';

import { useState } from 'react';
import { MapPin, Waves, ExternalLink } from 'lucide-react';

// 潜点数据（带真实坐标）
const DIVE_SITES = [
  { id: 1, name: '大堡礁', location: '澳大利亚', lat: -18.2871, lng: 147.6992, rating: 4.9, image: '🏝️', description: '世界最大的珊瑚礁系统' },
  { id: 2, name: '拉贾安帕特', location: '印度尼西亚', lat: -0.5, lng: 130.0, rating: 5.0, image: '🐠', description: '海洋生物多样性最丰富的地区' },
  { id: 3, name: '马尔代夫', location: '马尔代夫', lat: 3.2028, lng: 73.2207, rating: 4.8, image: '🌴', description: '印度洋上的天堂群岛' },
  { id: 4, name: '加拉帕戈斯', location: '厄瓜多尔', lat: -0.5, lng: -90.5, rating: 5.0, image: '🦁', description: '达尔文进化论的灵感来源' },
  { id: 5, name: '红海', location: '埃及', lat: 27.0, lng: 34.0, rating: 4.8, image: '🏜️', description: '世界顶级潜水目的地' },
  { id: 6, name: '帕劳', location: '帕劳', lat: 7.3, lng: 134.5, rating: 4.9, image: '🌸', description: '太平洋上的潜水天堂' },
  { id: 7, name: '西巴丹岛', location: '马来西亚', lat: 4.1, lng: 118.6, rating: 5.0, image: '🐢', description: '世界顶级潜水目的地之一' },
  { id: 8, name: '图巴塔哈群礁', location: '菲律宾', lat: 8.95, lng: 119.87, rating: 4.9, image: '⭐', description: 'UNESCO世界遗产' },
  { id: 9, name: '博奈尔岛', location: '加勒比海', lat: 12.15, lng: -68.27, rating: 4.7, image: '🏝️', description: '加勒比海最著名的岸潜目的地' },
  { id: 10, name: '西尔弗拉裂缝', location: '冰岛', lat: 64.25, lng: -21.13, rating: 4.9, image: '❄️', description: '北美与欧亚板块之间的裂缝' },
];

export default function MapPage() {
  const [selectedSite, setSelectedSite] = useState<any>(null);

  // 构建 Google Maps 链接
  const getGoogleMapsUrl = (lat: number, lng: number, name: string) => {
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  };

  // 当前地图中心
  const mapCenter = selectedSite 
    ? `${selectedSite.lat},${selectedSite.lng}` 
    : '0,120';
  const mapZoom = selectedSite ? 10 : 3;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <MapPin className="h-8 w-8 text-cyan-600" />
        潜点地图
        <span className="text-sm text-gray-400 font-normal ml-2">
          ({DIVE_SITES.length} 个目的地)
        </span>
      </h1>

      {/* Google Maps 嵌入 */}
      <div className="rounded-2xl overflow-hidden shadow-lg mb-6 bg-gray-100" style={{ height: '450px' }}>
        <iframe
          src={`https://maps.google.com/maps?q=${mapCenter}&z=${mapZoom}&output=embed`}
          className="w-full h-full border-0"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="潜水地图"
        />
      </div>

      {/* 潜点列表 */}
      <h2 className="text-lg font-semibold text-slate-700 mb-3 flex items-center gap-2">
        <Waves className="h-5 w-5 text-cyan-600" />
        热门潜水目的地
        <span className="text-sm text-gray-400 font-normal ml-2">点击查看位置</span>
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {DIVE_SITES.map((site) => (
          <div
            key={site.id}
            className={`bg-white rounded-xl p-3 border-2 cursor-pointer transition-all hover:shadow-md ${
              selectedSite?.id === site.id
                ? 'border-cyan-500 shadow-md bg-cyan-50'
                : 'border-gray-200 hover:border-cyan-300'
            }`}
            onClick={() => setSelectedSite(site)}
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">{site.image}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-800 text-sm truncate">{site.name}</h3>
                <p className="text-xs text-gray-500 truncate">{site.location}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-yellow-500 text-xs">⭐</span>
                  <span className="text-xs font-medium">{site.rating}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 选中潜点的详情 */}
      {selectedSite && (
        <div className="mt-4 p-4 bg-cyan-50 rounded-xl border border-cyan-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <span className="text-2xl mr-2">{selectedSite.image}</span>
            <span className="font-semibold text-slate-800">{selectedSite.name}</span>
            <span className="text-gray-500 ml-2">{selectedSite.location}</span>
            <span className="ml-2 text-yellow-500">⭐ {selectedSite.rating}</span>
            <p className="text-sm text-gray-600 mt-1">{selectedSite.description}</p>
          </div>
          <a
            href={getGoogleMapsUrl(selectedSite.lat, selectedSite.lng, selectedSite.name)}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition flex-shrink-0"
          >
            <ExternalLink className="h-4 w-4" />
            在 Google Maps 打开
          </a>
        </div>
      )}

      {!selectedSite && (
        <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200 text-center text-gray-500 text-sm">
          👆 点击上方潜点查看位置
        </div>
      )}
    </div>
  );
}


