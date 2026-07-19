'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Waves, Home, Camera, BookOpen, Map, User, LogOut } from 'lucide-react';

export default function NavBar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  if (!user) return null;

  const links = [
    { href: '/dashboard', icon: Home, label: '仪表盘' },
    { href: '/log', icon: Camera, label: '记录潜水' },
    { href: '/journal', icon: BookOpen, label: '潜水日记' },
    { href: '/map', icon: Map, label: '潜点地图' },
    { href: '/profile', icon: User, label: '个人资料' },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Waves className="h-6 w-6 text-cyan-600" />
          <span className="text-xl font-bold text-slate-800">DivingLog</span>
        </Link>
        <div className="hidden md:flex items-center gap-1">
          {links.map(({ href, icon: Icon, label }) => (
            <Link key={href} href={href} className={`px-3 py-2 rounded-lg text-sm font-medium transition ${pathname === href ? 'bg-cyan-50 text-cyan-700' : 'text-slate-600 hover:bg-slate-50'}`}>
              <Icon className="h-4 w-4 inline mr-1" />{label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-600 hidden sm:inline">{user.displayName || user.email?.split('@')[0]}</span>
          <button onClick={() => signOut()} className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1"><LogOut className="h-4 w-4" />退出</button>
        </div>
      </div>
    </nav>
  );
}
