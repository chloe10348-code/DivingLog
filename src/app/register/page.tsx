'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Waves, Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { register, loading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) { setError('两次输入的密码不一致'); return; }
    try {
      await register(email, password, name);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || '注册失败');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-cyan-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-lg">
        <div className="text-center mb-6">
          <Waves className="h-12 w-12 text-cyan-600 mx-auto mb-2" />
          <h1 className="text-2xl font-bold text-slate-800">DivingLog</h1>
          <p className="text-gray-500">创建你的账户</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">{error}</div>}
          <input type="text" placeholder="用户名" className="w-full px-4 py-2 border rounded-lg" value={name} onChange={(e) => setName(e.target.value)} required />
          <input type="email" placeholder="邮箱" className="w-full px-4 py-2 border rounded-lg" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="密码（至少6位）" className="w-full px-4 py-2 border rounded-lg" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <input type="password" placeholder="确认密码" className="w-full px-4 py-2 border rounded-lg" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-2 rounded-lg" disabled={loading}>
            {loading ? '注册中...' : '注册'}
          </button>
        </form>
        <p className="text-center text-sm text-slate-600 mt-4">已有账户？ <Link href="/login" className="text-cyan-600 hover:text-cyan-800 font-medium">立即登录</Link></p>
      </div>
    </div>
  );
}
