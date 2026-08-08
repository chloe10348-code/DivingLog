'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function MapPage() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let map: any = null;
    let isMounted = true;

    const loadMap = async () => {
      try {
        // 动态导入 leaflet
        const L = await import('leaflet');
        await import('leaflet/dist/leaflet.css');

        if (!isMounted || !mapContainer.current) return;

        // 创建地图
        map = L.map(mapContainer.current, {
          center: [20, 0],
          zoom: 2,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '© OpenStreetMap',
        }).addTo(map);

        // 添加一个测试标记
        const icon = L.icon({
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        });

        L.marker([20, 0], { icon })
          .addTo(map)
          .bindPopup('📍 地图加载成功！');

        setLoading(false);

        // 刷新地图尺寸
        setTimeout(() => {
          if (map) map.invalidateSize();
        }, 500);

      } catch (error) {
        console.error('地图加载失败:', error);
        setLoading(false);
      }
    };

    loadMap();

    return () => {
      isMounted = false;
      if (map) {
        map.remove();
        map = null;
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-600" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      <div 
        ref={mapContainer} 
        className="flex-1 w-full bg-gray-100" 
        style={{ minHeight: '500px' }}
      />
      <div className="bg-white border-t border-gray-200 p-4 text-center text-sm text-gray-500">
        🗺️ 地图加载成功！点击标记查看详情
      </div>
    </div>
  );
}
