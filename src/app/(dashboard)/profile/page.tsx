'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { User, Mail, Waves, Save, Loader2 } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.displayName || '');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-500">请先登录</p>
      </div>
    );
  }

  const handleSave = async () => {
    setSaving(true);
    setSuccess(false);
    try {
      // 这里可以添加保存逻辑
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('保存失败:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
        <User className="h-8 w-8 text-cyan-600" />
        个人资料
      </h1>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Waves className="h-5 w-5 text-cyan-600" />
            个人信息
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm">
              ✅ 资料保存成功！
            </div>
          )}
          <div>
            <label className="text-sm font-medium text-gray-700">邮箱</label>
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md mt-1">
              <Mail className="h-4 w-4 text-gray-400" />
              <span className="text-gray-700">{user.email}</span>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">用户名</label>
            <Input 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              placeholder="你的名字"
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">总潜水次数</label>
            <p className="text-2xl font-bold text-cyan-600 mt-1">{(user as any).totalDives || 0}</p>
          </div>
          <Button 
            onClick={handleSave} 
            className="w-full bg-cyan-600 hover:bg-cyan-700"
            disabled={saving}
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                保存中...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                保存修改
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
