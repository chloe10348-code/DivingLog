'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Waves } from 'lucide-react';

// 潜点数据
const DIVE_SITES = [
  { id: 1, name: '大堡礁', location: '澳大利亚', lat: -18.2871, lng: 147.6992, rating: 4.9, image: '🏝️' },
  { id: 2, name: '拉贾安帕特', location: '印度尼西亚', lat: -0.5, lng: 130.0, rating: 5.0, image: '🐠' },
  { id: 3, name: '马尔代夫', location: '马尔代夫', lat: 3.2028, lng: 73.2207, rating: 4.8, image: '🌴' },
  { id: 4, name: '加拉帕戈斯', location: '厄瓜多尔', lat: -0.5, lng: -90.5, rating: 5.0, image: '🦁' },
  { id: 5, name: '红海', location: '埃及', lat: 27.0, lng: 34.0, rating: 4.8, image: '🏜️' },
  { id: 6, name: '帕劳', location: '帕劳', lat: 7.3, lng: 134.5, rating: 4.9, image: '🌸' },
  { id: 7, name: '西巴丹岛', location: '马来西亚', lat: 4.1, lng: 118.6, rating: 5.0, image: '🐢' },
];

// ✅ 这是实际的地图组件（使用 window 的代码都在这里）
function MapContent() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const [selectedSite, setSelectedSite] = useState<any>(null);

  useEffect(() => {
    // 确保在浏览器环境运行（双重保护）
    if (typeof window === 'undefined') return;
    if (!mapContainer.current || map.current) return;

    map.current = L.map(mapContainer.current).setView([20, 0], 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap',
    }).addTo(map.current);

    const icon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    DIVE_SITES.forEach((site) => {
      L.marker([site.lat, site.lng], { icon })
        .addTo(map.current!)
        .bindPopup(`<h3 class="font-bold">${site.name}</h3><p>${site.location}</p>`);
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  const flyToSite = (site: any) => {
    setSelectedSite(site);
    if (map.current) {
      map.current.flyTo([site.lat, site.lng], 10, { duration: 1.5 });
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      <div ref={mapContainer} className="flex-1 relative" />
      <div className="bg-white border-t border-gray-200 h-48 overflow-y-auto p-4">
        <h3 className="font-semibold text-slate-700 mb-2 flex items-center gap-2">
          <Waves className="h-4 w-4 text-cyan-600" /> 热门潜点
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {DIVE_SITES.map((site) => (
            <div
              key={site.id}
              className={`p-2 rounded-lg border cursor-pointer hover:shadow-md ${selectedSite?.id === site.id ? 'border-cyan-500 bg-cyan-50' : 'border-gray-200'}`}
              onClick={() => flyToSite(site)}
            >
              <span className="text-xl">{site.image}</span>
              <p className="text-sm font-medium truncate">{site.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ⭐⭐⭐ 关键：动态导入 + 禁用 SSR ⭐⭐⭐
// 这样 MapContent 只在浏览器端渲染，服务器端完全跳过
const MapPage = dynamic(() => Promise.resolve(MapContent), {
  ssr: false,
  loading: () => (
    <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
      <p className="text-gray-500">加载地图...</p>
    </div>
  ),
});

export default MapPage;
