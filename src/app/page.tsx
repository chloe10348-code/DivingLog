'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Waves, Compass, User } from 'lucide-react';

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-cyan-900 to-blue-900 -z-10" />
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Waves className="h-16 w-16 text-white/90" />
          <h1 className="text-6xl md:text-7xl font-bold text-white tracking-wide drop-shadow-lg">
            DivingLog - Test
          </h1>
        </div>
        <p className="text-xl md:text-2xl text-white/80 mb-8 drop-shadow-md">
          记录每一次潜水，珍藏每一刻回忆
        </p>

        {user ? (
          <Link href="/dashboard">
            <button className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white border border-white/30 px-8 py-6 text-lg rounded-full flex items-center gap-2">
              <Compass className="h-5 w-5" />
              进入仪表盘
            </button>
          </Link>
        ) : (
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/login">
              <button className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white border border-white/30 px-8 py-6 text-lg rounded-full flex items-center gap-2">
                <User className="h-5 w-5" />
                登录
              </button>
            </Link>
            <Link href="/register">
              <button className="bg-white/30 backdrop-blur-md hover:bg-white/40 text-white border border-white/30 px-8 py-6 text-lg rounded-full">
                注册
              </button>
            </Link>
          </div>
        )}

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="text-3xl mb-2">📊</div>
            <h3 className="text-white font-semibold text-lg">记录潜水</h3>
            <p className="text-white/70 text-sm">追踪深度、时长、温度等数据</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="text-3xl mb-2">📓</div>
            <h3 className="text-white font-semibold text-lg">潜水日记</h3>
            <p className="text-white/70 text-sm">记录你的故事，珍藏你的照片</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="text-3xl mb-2">🗺️</div>
            <h3 className="text-white font-semibold text-lg">潜点地图</h3>
            <p className="text-white/70 text-sm">探索全球最佳潜水目的地</p>
          </div>
        </div>
      </div>
    </div>
  );
}
