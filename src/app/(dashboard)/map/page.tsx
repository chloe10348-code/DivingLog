'use client';

import { useState, useEffect, useRef } from 'react';
import { MapPin, Star, Eye, Thermometer, Waves, Loader2 } from 'lucide-react';
import { ReviewSystem } from '@/components/ReviewSystem';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

// 所有潜水目的地数据（精简版）
const DIVE_SITES = [
  {
    id: '1',
    name: '大堡礁',
    location: '澳大利亚',
    lat: -18.2871,
    lng: 147.6992,
    description: '世界最大的珊瑚礁系统',
    depth: '30m',
    visibility: '20m',
    temp: '26°C',
    rating: 4.9,
    image: '🏝️',
  },
  {
    id: '2',
    name: '拉贾安帕特',
    location: '印度尼西亚',
    lat: -0.5,
    lng: 130.0,
    description: '海洋生物多样性最丰富的地区',
    depth: '35m',
    visibility: '25m',
    temp: '28°C',
    rating: 5.0,
    image: '🐠',
  },
  {
    id: '3',
    name: '马尔代夫',
    location: '马尔代夫',
    lat: 3.2028,
    lng: 73.2207,
    description: '印度洋上的天堂群岛',
    depth: '30m',
    visibility: '30m',
    temp: '28°C',
    rating: 4.8,
    image: '🌴',
  },
  {
    id: '4',
    name: '加拉帕戈斯',
    location: '厄瓜多尔',
    lat: -0.5,
    lng: -90.5,
    description: '达尔文进化论的灵感来源',
    depth: '30m',
    visibility: '20m',
    temp: '22°C',
    rating: 5.0,
    image: '🦁',
  },
  {
    id: '5',
    name: '红海',
    location: '埃及',
    lat: 27.0,
    lng: 34.0,
    description: '世界顶级潜水目的地',
    depth: '30m',
    visibility: '30m',
    temp: '26°C',
    rating: 4.8,
    image: '🏜️',
  },
  {
    id: '6',
    name: '帕劳',
    location: '帕劳',
    lat: 7.3,
    lng: 134.5,
    description: '太平洋上的潜水天堂',
    depth: '30m',
    visibility: '30m',
    temp: '28°C',
    rating: 4.9,
    image: '🌸',
  },
  {
    id: '7',
    name: '西巴丹岛',
    location: '马来西亚',
    lat: 4.1,
    lng: 118.6,
    description: '世界顶级潜水目的地之一',
    depth: '40m+',
    visibility: '30m',
    temp: '27°C',
    rating: 5.0,
    image: '🐢',
  },
  {
    id: '8',
    name: '图巴塔哈群礁',
    location: '菲律宾',
    lat: 8.95,
    lng: 119.87,
    description: 'UNESCO世界遗产',
    depth: '30m',
    visibility: '35m',
    temp: '28°C',
    rating: 4.9,
    image: '⭐',
  },
  {
    id: '9',
    name: '博奈尔岛',
    location: '加勒比海',
    lat: 12.15,
    lng: -68.27,
    description: '加勒比海最著名的岸潜目的地',
    depth: '25m',
    visibility: '25m',
    temp: '27°C',
    rating: 4.7,
    image: '🏝️',
  },
  {
    id: '10',
    name: '西尔弗拉裂缝',
    location: '冰岛',
    lat: 64.25,
    lng: -21.13,
    description: '北美与欧亚板块之间的裂缝',
    depth: '18m',
    visibility: '100m',
    temp: '2°C',
    rating: 4.9,
    image: '❄️',
  },
];

export default function MapPage() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const [selectedSite, setSelectedSite] = useState<any>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [L, setL] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewSiteId, setReviewSiteId] = useState<string | null>(null);
  const [reviewSiteName, setReviewSiteName] = useState('');

  // 客户端挂载后加载 leaflet
  useEffect(() => {
    setIsMounted(true);
    import('leaflet').then((module) => {
      setL(module);
      setLoading(false);
    });
  }, []);

  // 初始化地图
  useEffect(() => {
    if (!isMounted || !L || !mapContainer.current) return;
    if (typeof window === 'undefined') return;

    // 如果地图已存在，先清理
    if (map.current) {
      map.current.remove();
      map.current = null;
    }

    try {
      map.current = L.map(mapContainer.current, {
        center: [20, 0],
        zoom: 2,
        zoomControl: true,
        fadeAnimation: true,
        attributionControl: true,
      });

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

      // 添加标记
      DIVE_SITES.forEach((site) => {
        L.marker([site.lat, site.lng], { icon })
          .addTo(map.current!)
          .bindPopup(`
            <div class="p-2 max-w-xs" style="min-width:200px;">
              <h3 class="font-bold text-base text-slate-800">${site.image} ${site.name}</h3>
              <p class="text-sm text-slate-600">${site.location}</p>
              <div class="flex items-center gap-1 mt-1">
                <span class="text-yellow-500">⭐</span>
                <span class="text-sm font-medium">${site.rating}</span>
                <span class="text-xs text-gray-400 ml-2">🌊 ${site.depth}</span>
                <span class="text-xs text-gray-400">🌡️ ${site.temp}</span>
              </div>
              <p class="text-xs text-gray-500 mt-1">👁️ ${site.visibility}</p>
              <p class="text-xs text-gray-600 mt-2 line-clamp-2">${site.description}</p>
              <div class="mt-2 pt-2 border-t border-gray-100">
                <button 
                  onclick="window.__openReview('${site.id}','${site.name}')" 
                  class="text-xs text-cyan-600 hover:text-cyan-800 bg-cyan-50 px-2 py-1 rounded w-full"
                >
                  📝 查看/写评价
                </button>
              </div>
            </div>
          `);
      });

      // 暴露全局函数
      (window as any).__openReview = (siteId: string, siteName: string) => {
        setReviewSiteId(siteId);
        setReviewSiteName(siteName);
        setReviewDialogOpen(true);
      };

      // 延迟刷新地图尺寸
      setTimeout(() => {
        if (map.current) {
          map.current.invalidateSize();
        }
      }, 300);

      // 再次刷新
      setTimeout(() => {
        if (map.current) {
          map.current.invalidateSize();
        }
      }, 800);

    } catch (error) {
      console.error('地图加载失败:', error);
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [isMounted, L]);

  const flyToSite = (site: any) => {
    setSelectedSite(site);
    if (map.current) {
      map.current.flyTo([site.lat, site.lng], 10, { duration: 1.5 });
    }
  };

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
        className="flex-1 relative bg-gray-100" 
        style={{ minHeight: '400px' }}
      />
      <div className="bg-white border-t border-gray-200 h-48 overflow-y-auto p-4">
        <h3 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
          <Waves className="h-4 w-4 text-cyan-600" /> 
          热门潜水目的地
          <span className="text-xs text-gray-400 font-normal ml-2">({DIVE_SITES.length} 个)</span>
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
          {DIVE_SITES.map((site) => (
            <div
              key={site.id}
              className={`p-2 rounded-lg border cursor-pointer hover:shadow-md transition-all ${
                selectedSite?.id === site.id
                  ? 'border-cyan-500 bg-cyan-50'
                  : 'border-gray-200 hover:border-cyan-300'
              }`}
              onClick={() => flyToSite(site)}
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
      </div>

      {/* 评价对话框 */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>📝 评价 - {reviewSiteName}</DialogTitle>
          </DialogHeader>
          {reviewSiteId && (
            <ReviewSystem siteId={reviewSiteId} siteName={reviewSiteName} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
