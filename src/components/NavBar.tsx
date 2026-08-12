'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage, LANGUAGES } from '@/context/LanguageContext';
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
  Globe,
  Map,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'dashboard', href: '/dashboard', icon: Home },
  { name: 'log_dive', href: '/log', icon: Camera },
  { name: 'journal', href: '/journal', icon: BookOpen },
  { name: 'map', href: '/map', icon: Map },
  { name: 'profile', href: '/profile', icon: User },
];

export default function NavBar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  if (pathname === '/login' || pathname === '/register') {
    return null;
  }

  if (!user) return null;

  const currentLanguage = LANGUAGES.find(l => l.code === language);

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
                  {t(item.name)}
                </Link>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center gap-3">
            {/* 语言切换下拉菜单 */}
            <div className="relative">
              <button
                onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition text-sm font-medium text-slate-600"
              >
                <Globe className="h-4 w-4" />
                {currentLanguage?.flag} {currentLanguage?.name}
              </button>
              {showLanguageMenu && (
                <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50 min-w-[180px] max-h-96 overflow-y-auto">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setShowLanguageMenu(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-3 ${
                        language === lang.code ? 'bg-cyan-50 text-cyan-700' : 'text-slate-700'
                      }`}
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <span>{lang.name}</span>
                      {language === lang.code && (
                        <span className="ml-auto text-cyan-600">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
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
              {t('logout')}
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
                  {t(item.name)}
                </Link>
              );
            })}
            <div className="pt-3 border-t border-gray-200">
              <div className="flex items-center justify-between px-3 py-2">
                {/* 移动端语言切换 - 国旗按钮 */}
                <div className="flex flex-wrap gap-1">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                      }}
                      className={`px-2 py-1 rounded text-sm transition ${
                        language === lang.code
                          ? 'bg-cyan-100 ring-2 ring-cyan-400'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                      title={lang.name}
                    >
                      {lang.flag}
                    </button>
                  ))}
                </div>
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
                  {t('logout')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}


