'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Waves,
  Save,
  Upload,
  X,
  Wind,
  Thermometer,
  Eye,
  Droplets,
  Weight,
  Star,
  ShieldAlert,
  Calendar,
} from 'lucide-react';
import { collection, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase/config';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Rating } from '@/components/ui/rating';
import { Badge } from '@/components/ui/badge';
import { diveLogSchema, type DiveLogInput } from '@/lib/validations/dive-log';

const MAX_PHOTOS = 5;
const DIVE_TYPES = [
  { value: 'reef', label: '礁石' },
  { value: 'wreck', label: '沉船' },
  { value: 'cave', label: '洞穴' },
  { value: 'drift', label: '放流' },
  { value: 'night', label: '夜潜' },
  { value: 'deep', label: '深潜' },
];

export default function LogDivePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [photoPreviewUrls, setPhotoPreviewUrls] = useState<string[]>([]);
  const [airConsumption, setAirConsumption] = useState<number | null>(null);
  const [uploadedFileNames, setUploadedFileNames] = useState<string[]>([]);

  const form = useForm<DiveLogInput>({
    resolver: zodResolver(diveLogSchema),
    defaultValues: {
      date: new Date(),
      diveSiteName: '',
      diveType: 'reef',
      buddyName: '',
      maxDepth: 0,
      bottomTime: 0,
      waterTemp: 25,
      visibility: 10,
      startPressure: 200,
      endPressure: 50,
      tankSize: 12,
      weight: 0,
      notes: '',
      photos: [],
      rating: 5,
      safetyChecks: {
        buddyCheck: false,
        gearCheck: false,
        buoyancyCheck: false,
        emergencyPlan: false,
        divePlan: false,
      },
    },
  });

  const watchStartPressure = form.watch('startPressure');
  const watchEndPressure = form.watch('endPressure');
  const watchBottomTime = form.watch('bottomTime');
  const watchTankSize = form.watch('tankSize');

  // 自动计算耗气率
  useEffect(() => {
    if (watchStartPressure && watchEndPressure && watchBottomTime && watchTankSize) {
      const pressureUsed = watchStartPressure - watchEndPressure;
      if (pressureUsed > 0 && watchBottomTime > 0) {
        const sacRate = (pressureUsed * watchTankSize) / watchBottomTime;
        setAirConsumption(parseFloat(sacRate.toFixed(1)));
      } else {
        setAirConsumption(null);
      }
    }
  }, [watchStartPressure, watchEndPressure, watchBottomTime, watchTankSize]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (photoPreviewUrls.length + files.length > MAX_PHOTOS) {
      alert(`最多上传 ${MAX_PHOTOS} 张照片`);
      return;
    }

    setUploading(true);
    try {
      const newPreviews = await Promise.all(
        files.map((file) => {
          return new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          });
        })
      );
      // 保存文件名用于上传
      const newFileNames = files.map(f => f.name);
      setUploadedFileNames([...uploadedFileNames, ...newFileNames]);
      setPhotoPreviewUrls([...photoPreviewUrls, ...newPreviews]);
    } catch (error) {
      console.error('Error previewing photos:', error);
    } finally {
      setUploading(false);
      // 重置input
      e.target.value = '';
    }
  };

  const removePhoto = (index: number) => {
    const newPreviewUrls = [...photoPreviewUrls];
    newPreviewUrls.splice(index, 1);
    setPhotoPreviewUrls(newPreviewUrls);
    const newFileNames = [...uploadedFileNames];
    newFileNames.splice(index, 1);
    setUploadedFileNames(newFileNames);
  };

  const uploadPhotosToFirebase = async (userId: string): Promise<string[]> => {
    const uploadedUrls: string[] = [];

    for (let i = 0; i < photoPreviewUrls.length; i++) {
      try {
        // 使用时间戳创建唯一文件名
        const fileExtension = uploadedFileNames[i]?.split('.').pop() || 'jpg';
        const fileName = `${Date.now()}-${i}.${fileExtension}`;
        const photoRef = ref(storage, `divelogs/${userId}/${fileName}`);
        
        // 从 base64 创建 Blob
        const response = await fetch(photoPreviewUrls[i]);
        const blob = await response.blob();
        
        const uploadTask = uploadBytesResumable(photoRef, blob);
        await uploadTask;
        const downloadUrl = await getDownloadURL(photoRef);
        uploadedUrls.push(downloadUrl);
      } catch (error) {
        console.error('Error uploading photo:', error);
        // 如果上传失败，使用预览 URL 作为备用
        uploadedUrls.push(photoPreviewUrls[i]);
      }
    }

    return uploadedUrls;
  };

  const onSubmit = async (data: DiveLogInput) => {
    if (!user) {
      alert('请先登录');
      return;
    }

    setSaving(true);
    try {
      // 上传照片
      const photoUrls = await uploadPhotosToFirebase(user.uid);

      // 保存到 Firestore
      const diveLogData = {
        ...data,
        userId: user.uid,
        photos: photoUrls,
        isPublic: false,
        airConsumption,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, 'diveLogs'), diveLogData);

      // 更新用户总潜水次数
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        totalDives: (user as any).totalDives + 1 || 1,
      });

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        router.push('/journal');
      }, 2000);
    } catch (error) {
      console.error('Error saving dive log:', error);
      alert('保存失败，请检查网络连接后重试');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-5xl px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2 mb-2">
          <Waves className="h-8 w-8 text-cyan-600" />
          记录潜水
        </h1>
        <p className="text-gray-600">记录你的每一次水下探索</p>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm mb-6">
          ✅ 潜水记录保存成功！即将跳转到日记列表...
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* 基本信息 */}
          <Card>
            <CardHeader>
              <CardTitle>基本信息</CardTitle>
              <CardDescription>潜水的基本信息</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      日期
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                        onChange={(e) => field.onChange(new Date(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="diveSiteName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>潜点名称</FormLabel>
                    <FormControl>
                      <Input placeholder="例如：大堡礁" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="diveType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>潜水类型</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="选择潜水类型" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {DIVE_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="buddyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>潜伴（可选）</FormLabel>
                    <FormControl>
                      <Input placeholder="潜伴姓名" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* 潜水数据 */}
          <Card>
            <CardHeader>
              <CardTitle>潜水数据</CardTitle>
              <CardDescription>记录潜水的详细数据</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="maxDepth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Wind className="h-4 w-4" />
                      最大深度（米）
                    </FormLabel>
                    <FormControl>
                      <Input type="number" min="0" max="200" placeholder="0" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bottomTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>潜水时长（分钟）</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" max="600" placeholder="0" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="waterTemp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Thermometer className="h-4 w-4" />
                      水温（°C）
                    </FormLabel>
                    <FormControl>
                      <Input type="number" min="-5" max="45" placeholder="25" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="visibility"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      能见度（米）
                    </FormLabel>
                    <FormControl>
                      <Input type="number" min="0" max="100" placeholder="10" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Weight className="h-4 w-4" />
                      配重（kg）
                    </FormLabel>
                    <FormControl>
                      <Input type="number" min="0" max="50" placeholder="0" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* 气压和耗气率 */}
          <Card>
            <CardHeader>
              <CardTitle>气压与耗气率</CardTitle>
              <CardDescription>记录气瓶气压，自动计算耗气率</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="startPressure"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Droplets className="h-4 w-4" />
                      起始气压（bar）
                    </FormLabel>
                    <FormControl>
                      <Input type="number" min="0" max="400" placeholder="200" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endPressure"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>结束气压（bar）</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" max="400" placeholder="50" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tankSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>气瓶大小（升）</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" max="20" placeholder="12" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {airConsumption !== null && (
                <div className="md:col-span-3">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-blue-900 mb-2">实时耗气率计算</h3>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="secondary" className="text-lg px-3 py-1">
                        {airConsumption} L/min
                      </Badge>
                      <span className="text-sm text-blue-700">
                        （压力差 {(watchStartPressure - watchEndPressure)} bar × {watchTankSize} 升）÷ {watchBottomTime} 分钟
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 备注和评分 */}
          <Card>
            <CardHeader>
              <CardTitle>备注与评分</CardTitle>
              <CardDescription>记录你的潜水体验</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>备注（潜水日记）</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="记录这次潜水的体验、看到的海洋生物、遇到的有趣事情..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      评分
                    </FormLabel>
                    <FormControl>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => field.onChange(star)}
                            className="text-3xl"
                          >
                            {star <= (field.value || 0) ? '⭐' : '☆'}
                          </button>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* 照片上传 */}
          <Card>
            <CardHeader>
              <CardTitle>照片上传</CardTitle>
              <CardDescription>最多上传 {MAX_PHOTOS} 张照片</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {photoPreviewUrls.map((url, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden border">
                    <img src={url} alt={`预览 ${index + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}

                {photoPreviewUrls.length < MAX_PHOTOS && (
                  <label className="flex items-center justify-center aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-cyan-500 cursor-pointer transition-colors">
                    <div className="flex flex-col items-center gap-2 text-gray-500">
                      <Upload className="h-8 w-8" />
                      <span className="text-sm">{uploading ? '上传中...' : '上传照片'}</span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handlePhotoUpload}
                      disabled={uploading}
                    />
                  </label>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 安全检查清单 */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-700">
                <ShieldAlert className="h-5 w-5" />
                安全检查清单
              </CardTitle>
              <CardDescription className="text-red-600">
                请确认以下安全项目全部完成后再提交
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="safetyChecks.buddyCheck"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>与潜伴互相检查装备</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="safetyChecks.gearCheck"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>检查个人装备完整可用</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="safetyChecks.buoyancyCheck"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>检查浮力控制装置</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="safetyChecks.emergencyPlan"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>了解应急预案</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="safetyChecks.divePlan"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>了解潜水计划</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* 提交按钮 */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="secondary" onClick={() => router.back()}>
              取消
            </Button>
            <Button type="submit" disabled={saving} className="w-full md:w-auto">
              {saving ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                  保存中...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  保存记录
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
