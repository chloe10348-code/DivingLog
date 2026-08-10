'use client';

import { MapPin, Waves } from 'lucide-react';

const DIVE_SITES = [
  { id: 1, name: '大堡礁', location: '澳大利亚', rating: 4.9, image: '🏝️' },
  { id: 2, name: '拉贾安帕特', location: '印度尼西亚', rating: 5.0, image: '🐠' },
  { id: 3, name: '马尔代夫', location: '马尔代夫', rating: 4.8, image: '🌴' },
  { id: 4, name: '加拉帕戈斯', location: '厄瓜多尔', rating: 5.0, image: '🦁' },
  { id: 5, name: '红海', location: '埃及', rating: 4.8, image: '🏜️' },
  { id: 6, name: '帕劳', location: '帕劳', rating: 4.9, image: '🌸' },
  { id: 7, name: '西巴丹岛', location: '马来西亚', rating: 5.0, image: '🐢' },
  { id: 8, name: '图巴塔哈群礁', location: '菲律宾', rating: 4.9, image: '⭐' },
];

export default function MapPage() {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <MapPin className="h-8 w-8 text-cyan-600" />
        潜点地图
      </h1>
      
      <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-8 text-center border-2 border-dashed border-cyan-300 mb-8">
        <div className="text-6xl mb-4">🗺️</div>
        <h2 className="text-xl font-semibold text-slate-700">地图加载中...</h2>
        <p className="text-gray-500 mt-2">请稍后刷新</p>
      </div>

      <h2 className="text-xl font-semibold text-slate-700 mb-4 flex items-center gap-2">
        <Waves className="h-5 w-5 text-cyan-600" />
        热门潜水目的地 ({DIVE_SITES.length} 个)
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {DIVE_SITES.map((site) => (
          <div
            key={site.id}
            className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">{site.image}</span>
              <div>
                <h3 className="font-semibold text-slate-800">{site.name}</h3>
                <p className="text-sm text-gray-500">{site.location}</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-yellow-500">⭐</span>
                  <span className="text-sm font-medium">{site.rating}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

