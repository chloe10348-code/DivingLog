'use client';

import { useState, useEffect, useRef } from 'react';
import { Loader2, MapPin, Waves } from 'lucide-react';

// 潜点数据（只保留10个，减少加载压力）
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

// 简化版地图：只在客户端加载
export default function MapPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedSite, setSelectedSite] = useState<any>(null);

  useEffect(() => {
    let isMounted = true;

    const loadMap = async () => {
      try {
        const L = await import('leaflet');
        await import('leaflet/dist/leaflet.css');

        if (!isMounted || !mapRef.current) return;

        const map = L.map(mapRef.current, {
          center: [0, 120],
          zoom: 2,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '© OpenStreetMap',
        }).addTo(map);

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
            .addTo(map)
            .bindPopup(`<b>${site.image} ${site.name}</b><br>${site.location}<br>⭐ ${site.rating}`);
        });

        setTimeout(() => map.invalidateSize(), 300);
        setLoading(false);

        return () => {
          map.remove();
        };
      } catch (err) {
        console.error('地图加载失败:', err);
        setError(true);
        setLoading(false);
      }
    };

    loadMap();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] p-6">
        <div className="text-6xl mb-4">🗺️</div>
        <h2 className="text-xl font-semibold text-slate-700">地图加载失败</h2>
        <p className="text-gray-500 mt-2 text-center max-w-md">
          请刷新页面重试，或查看下方潜点列表
        </p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      <div ref={mapRef} className="flex-1 w-full bg-gray-100" style={{ minHeight: '300px' }} />
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Waves className="h-4 w-4 text-cyan-600" />
          <span className="font-medium text-slate-700">热门潜点</span>
          <span className="text-xs text-gray-400">点击标记查看详情</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {DIVE_SITES.map((site) => (
            <button
              key={site.id}
              className={`px-3 py-1 rounded-full text-sm border transition ${
                selectedSite?.id === site.id
                  ? 'bg-cyan-100 border-cyan-400 text-cyan-700'
                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
              }`}
              onClick={() => setSelectedSite(site)}
            >
              {site.image} {site.name}
            </button>
          ))}
        </div>
        {selectedSite && (
          <div className="mt-2 text-sm text-gray-600">
            📍 {selectedSite.image} {selectedSite.name} - {selectedSite.location} ⭐ {selectedSite.rating}
          </div>
        )}
      </div>
    </div>
  );
}


