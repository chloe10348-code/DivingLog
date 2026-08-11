'use client';

export default function MapPage() {
  return (
    <div className="max-w-4xl mx-auto p-8 text-center">
      <div className="text-6xl mb-6">🗺️</div>
      <h1 className="text-3xl font-bold text-slate-800 mb-4">潜点地图</h1>
      <p className="text-gray-600 mb-6">地图功能即将上线...</p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-left">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <span className="text-2xl">🏝️</span>
          <h3 className="font-semibold">大堡礁</h3>
          <p className="text-sm text-gray-500">澳大利亚</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <span className="text-2xl">🐠</span>
          <h3 className="font-semibold">拉贾安帕特</h3>
          <p className="text-sm text-gray-500">印度尼西亚</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <span className="text-2xl">🌴</span>
          <h3 className="font-semibold">马尔代夫</h3>
          <p className="text-sm text-gray-500">马尔代夫</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <span className="text-2xl">🦁</span>
          <h3 className="font-semibold">加拉帕戈斯</h3>
          <p className="text-sm text-gray-500">厄瓜多尔</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <span className="text-2xl">🏜️</span>
          <h3 className="font-semibold">红海</h3>
          <p className="text-sm text-gray-500">埃及</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <span className="text-2xl">🌸</span>
          <h3 className="font-semibold">帕劳</h3>
          <p className="text-sm text-gray-500">帕劳</p>
        </div>
      </div>
    </div>
  );
}
这样地图页面至少能显示潜点列表，不影响其他功能使用。提交后告诉我！ 🗺️

第2步：移除导航栏中的地图链接
编辑 src/components/NavBar.tsx，找到地图链接并注释掉或删除。give me the completed code
好的！这是移除地图链接后的 src/components/NavBar.tsx 完整代码：

tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  Home,
  Waves,
  BookOpen,
  User,
  LogOut,
  Menu,
  X,
  Camera,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: '仪表盘', href: '/dashboard', icon: Home },
  { name: '记录潜水', href: '/log', icon: Camera },
  { name: '潜水日记', href: '/journal', icon: BookOpen },
  // { name: '潜点地图', href: '/map', icon: Map }, // 暂时隐藏地图功能
  { name: '个人资料', href: '/profile', icon: User },
];

export default function NavBar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 如果是登录或注册页面，不显示导航栏
  if (pathname === '/login' || pathname === '/register') {
    return null;
  }

  if (!user) return null;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2 flex-shrink-0">
            <Waves className="h-6 w-6 text-cyan-600" />
            <span className="text-xl font-bold text-slate-800">DivingLog</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-cyan-50 text-cyan-700'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center gap-3">
            <span className="text-sm text-slate-600">
              {user.displayName || user.email?.split('@')[0]}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
              onClick={() => signOut()}
            >
              <LogOut className="h-4 w-4 mr-1" />
              退出
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-slate-100"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-slate-600" />
            ) : (
              <Menu className="h-6 w-6 text-slate-600" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-cyan-50 text-cyan-700'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
            <div className="pt-3 border-t border-gray-200">
              <div className="flex items-center justify-between px-3 py-2">
                <span className="text-sm text-slate-600">
                  {user.displayName || user.email?.split('@')[0]}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => signOut()}
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  退出
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
