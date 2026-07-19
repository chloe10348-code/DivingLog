'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useDiveLogs } from '@/hooks/useDiveLogs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { 
  Waves, Calendar, Clock, MapPin, TrendingUp, Heart, 
  Compass, Camera, BookOpen, Loader2 
} from 'lucide-react';
import { format } from 'date-fns';

// 模拟数据（如果 useDiveLogs 还没准备好）
const mockDiveLogs = [
  {
    id: '1',
    diveSiteName: '大堡礁',
    date: '2026-07-15',
    maxDepth: 18,
    bottomTime: 45,
    rating: 5,
    createdAt: new Date('2026-07-15'),
  },
  {
    id: '2',
    diveSiteName: '蓝洞',
    date: '2026-07-10',
    maxDepth: 28,
    bottomTime: 38,
    rating: 4,
    createdAt: new Date('2026-07-10'),
  },
  {
    id: '3',
    diveSiteName: '沉船探险',
    date: '2026-07-05',
    maxDepth: 22,
    bottomTime: 52,
    rating: 5,
    createdAt: new Date('2026-07-05'),
  },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState('');
  const [loading, setLoading] = useState(false);
  const [diveLogs, setDiveLogs] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalDives: 0,
    totalBottomTime: 0,
    maxDepth: 0,
    averageAirConsumption: 0,
  });

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('早上好');
    else if (hour < 18) setGreeting('下午好');
    else setGreeting('晚上好');

    // 加载模拟数据（后续替换为真实的 useDiveLogs）
    setLoading(true);
    setTimeout(() => {
      setDiveLogs(mockDiveLogs);
      const totalDives = mockDiveLogs.length;
      const totalBottomTime = mockDiveLogs.reduce((sum, log) => sum + (log.bottomTime || 0), 0);
      const maxDepth = Math.max(...mockDiveLogs.map(log => log.maxDepth || 0));
      setStats({
        totalDives,
        totalBottomTime,
        maxDepth,
        averageAirConsumption: 16,
      });
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-600" />
      </div>
    );
  }

  const totalBottomTime = stats?.totalBottomTime || 0;

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* 欢迎区域 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          {greeting}，{user?.displayName || '潜水员'}！🌊
        </h1>
        <p className="text-gray-500 mt-1">
          欢迎回到 <span className="font-semibold text-cyan-600">DivingLog</span>
        </p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-cyan-700 font-medium">总潜水次数</p>
                <p className="text-3xl font-bold text-cyan-800">{stats?.totalDives || 0}</p>
              </div>
              <div className="bg-cyan-200/50 rounded-full p-3">
                <Waves className="h-6 w-6 text-cyan-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-700 font-medium">总潜水时间</p>
                <p className="text-3xl font-bold text-emerald-800">
                  {totalBottomTime > 0 ? `${Math.floor(totalBottomTime / 60)}h` : '0h'}
                </p>
              </div>
              <div className="bg-emerald-200/50 rounded-full p-3">
                <Clock className="h-6 w-6 text-emerald-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-700 font-medium">最大深度</p>
                <p className="text-3xl font-bold text-purple-800">{stats?.maxDepth || 0}m</p>
              </div>
              <div className="bg-purple-200/50 rounded-full p-3">
                <TrendingUp className="h-6 w-6 text-purple-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-rose-50 to-orange-50 border-rose-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-rose-700 font-medium">平均耗气率</p>
                <p className="text-3xl font-bold text-rose-800">
                  {stats?.averageAirConsumption || 0}L/min
                </p>
              </div>
              <div className="bg-rose-200/50 rounded-full p-3">
                <Heart className="h-6 w-6 text-rose-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 快捷操作 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Link href="/log">
          <Button className="w-full bg-cyan-600 hover:bg-cyan-700 rounded-xl py-6">
            <Camera className="h-5 w-5 mr-2" />
            记录潜水
          </Button>
        </Link>
        <Link href="/journal">
          <Button variant="outline" className="w-full rounded-xl py-6 border-cyan-200 hover:bg-cyan-50">
            <BookOpen className="h-5 w-5 mr-2" />
            写日记
          </Button>
        </Link>
        <Link href="/map">
          <Button variant="outline" className="w-full rounded-xl py-6 border-cyan-200 hover:bg-cyan-50">
            <Compass className="h-5 w-5 mr-2" />
            探索地图
          </Button>
        </Link>
        <Link href="/profile">
          <Button variant="outline" className="w-full rounded-xl py-6 border-cyan-200 hover:bg-cyan-50">
            <Calendar className="h-5 w-5 mr-2" />
            个人资料
          </Button>
        </Link>
      </div>

      {/* 最近潜水记录 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-cyan-600" />
            最近潜水记录
          </CardTitle>
        </CardHeader>
        <CardContent>
          {diveLogs.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🌊</div>
              <p className="text-gray-500">还没有潜水记录</p>
              <p className="text-sm text-gray-400 mt-1">开始你的第一次潜水吧！</p>
              <Link href="/log">
                <Button className="mt-4 bg-cyan-600 hover:bg-cyan-700 rounded-full">
                  记录第一次潜水
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {diveLogs.slice(0, 5).map((log: any) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-cyan-100 rounded-full p-3">
                      <Waves className="h-5 w-5 text-cyan-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{log.diveSiteName || '未知潜点'}</p>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {log.date || format(log.createdAt, 'yyyy-MM-dd')}
                        </span>
                        {log.maxDepth && (
                          <span>深度: {log.maxDepth}m</span>
                        )}
                        {log.bottomTime && (
                          <span>时长: {log.bottomTime}min</span>
                        )}
                      </div>
                    </div>
                  </div>
                  {log.rating && (
                    <div className="text-sm text-yellow-500">
                      {'⭐'.repeat(Math.round(log.rating || 0))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

