'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase/config';
import { 
  collection, query, where, getDocs, addDoc, deleteDoc, doc, orderBy, 
  updateDoc, serverTimestamp 
} from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Plus, X, Calendar, MapPin, Heart, Loader2, 
  Sparkles, Edit2, Trash2, Camera, Waves,
  Search, Clock, Award, Flame
} from 'lucide-react';
import { format, formatDistanceToNow, differenceInDays } from 'date-fns';
import dynamic from 'next/dynamic';

// 动态导入日历组件（避免SSR问题）
const CalendarComponent = dynamic(
  () => import('react-calendar').then((mod) => mod.default),
  { ssr: false }
);

import 'react-calendar/dist/Calendar.css';

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  photos: string[];
  location: string;
  mood?: string;
  date: string;
  userId: string;
  createdAt: Date;
  likes?: number;
  tags?: string[];
  photoCaptions?: { [key: string]: string };
  bottomTime?: number;
}

const MOOD_OPTIONS = [
  { emoji: '😊', label: '开心' },
  { emoji: '🤩', label: '惊喜' },
  { emoji: '😌', label: '平静' },
  { emoji: '🤗', label: '感恩' },
  { emoji: '😅', label: '刺激' },
  { emoji: '🥰', label: '幸福' },
];

const TAG_OPTIONS = ['珊瑚礁', '沉船', '洞穴', '夜潜', '放流', '深潜', '海洋生物', '摄影'];

export default function JournalPage() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [location, setLocation] = useState('');
  const [mood, setMood] = useState('');
  const [bottomTime, setBottomTime] = useState<number>(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [photoCaptions, setPhotoCaptions] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (user) {
      loadEntries();
    }
  }, [user]);

  const loadEntries = async () => {
    if (!user) return;
    try {
      const q = query(
        collection(db, 'journal'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date(),
      })) as JournalEntry[];
      setEntries(data);
    } catch (error) {
      console.error('加载日记失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user || !title.trim() || !content.trim()) return;
    setSaving(true);
    try {
      const entryData = {
        title: title.trim(),
        content: content.trim(),
        location: location.trim(),
        mood,
        tags: selectedTags,
        photos: photoUrls,
        photoCaptions: photoCaptions,
        bottomTime: bottomTime,
        date: format(new Date(), 'yyyy-MM-dd'),
        userId: user.uid,
        createdAt: serverTimestamp(),
        likes: 0,
      };

      if (editingId) {
        await updateDoc(doc(db, 'journal', editingId), entryData);
      } else {
        await addDoc(collection(db, 'journal'), entryData);
      }
      
      resetForm();
      setIsOpen(false);
      await loadEntries();
    } catch (error) {
      console.error('保存日记失败:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这篇日记吗？')) return;
    try {
      await deleteDoc(doc(db, 'journal', id));
      await loadEntries();
    } catch (error) {
      console.error('删除失败:', error);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      const index = photoUrls.length;
      reader.onload = () => {
        setPhotoUrls((prev) => [...prev, reader.result as string]);
        setPhotoCaptions((prev) => ({ ...prev, [index]: '' }));
      };
      reader.readAsDataURL(file);
    });
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setLocation('');
    setMood('');
    setBottomTime(0);
    setSelectedTags([]);
    setPhotoUrls([]);
    setPhotoCaptions({});
    setEditingId(null);
  };

  const openEditor = (entry?: JournalEntry) => {
    if (entry) {
      setEditingId(entry.id);
      setTitle(entry.title);
      setContent(entry.content);
      setLocation(entry.location || '');
      setMood(entry.mood || '');
      setBottomTime(entry.bottomTime || 0);
      setSelectedTags(entry.tags || []);
      setPhotoUrls(entry.photos || []);
      setPhotoCaptions(entry.photoCaptions || {});
    } else {
      resetForm();
    }
    setIsOpen(true);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const totalBottomTime = entries.reduce((sum, entry) => sum + (entry.bottomTime || 0), 0);
  const totalHours = Math.floor(totalBottomTime / 60);
  const totalMinutes = totalBottomTime % 60;
  const diveDays = entries.filter(e => e.bottomTime && e.bottomTime > 0).length;
  const firstDiveDate = entries.length > 0 ? entries[entries.length - 1].createdAt : null;
  const daysSinceFirstDive = firstDiveDate ? differenceInDays(new Date(), firstDiveDate) : 0;

  const entriesByDate = entries.reduce((acc, entry) => {
    const dateKey = entry.date || format(entry.createdAt, 'yyyy-MM-dd');
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(entry);
    return acc;
  }, {} as { [key: string]: JournalEntry[] });

  const diveDates = new Set(Object.keys(entriesByDate));

  const filteredEntries = entries.filter((entry) => {
    const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          entry.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = !selectedDate || entry.date === format(selectedDate, 'yyyy-MM-dd');
    return matchesSearch && matchesDate;
  });

  const allPhotos = entries.flatMap(entry => 
    (entry.photos || []).map((photo) => ({
      url: photo,
      date: entry.date || format(entry.createdAt, 'yyyy-MM-dd'),
      caption: entry.photoCaptions?.[photo] || entry.content,
      entryTitle: entry.title,
    }))
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50/30 p-6">
      <div className="max-w-7xl mx-auto">
        {/* 头部 */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Waves className="h-8 w-8 text-cyan-600" />
                <Sparkles className="h-4 w-4 text-yellow-500 absolute -top-1 -right-1 animate-pulse" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                潜水日记
              </h1>
            </div>
            <p className="text-gray-500 mt-1 ml-11">
              记录每一次水下冒险，珍藏每一刻美好回忆
            </p>
          </div>
          <Button
            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 rounded-full px-6 shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={() => openEditor()}
          >
            <Plus className="h-4 w-4 mr-2" />
            写日记
          </Button>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-sm">
            <p className="text-2xl font-bold text-cyan-600">{entries.length}</p>
            <p className="text-sm text-gray-500">📓 总日记</p>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-sm">
            <p className="text-2xl font-bold text-cyan-600">{allPhotos.length}</p>
            <p className="text-sm text-gray-500">📸 照片总数</p>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-sm">
            <p className="text-2xl font-bold text-cyan-600">{diveDays}</p>
            <p className="text-sm text-gray-500">🌊 潜水天数</p>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-sm">
            <p className="text-2xl font-bold text-cyan-600">
              {entries.reduce((sum, e) => sum + (e.likes || 0), 0)}
            </p>
            <p className="text-sm text-gray-500">❤️ 总点赞</p>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-sm">
            <p className="text-2xl font-bold text-cyan-600">
              {totalHours}h {totalMinutes}m
            </p>
            <p className="text-sm text-gray-500">⏱️ 总潜水时间</p>
          </div>
        </div>

        {/* 日历 + 筛选区 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="h-5 w-5 text-cyan-600" />
                <h3 className="font-semibold text-slate-700">潜水日历</h3>
                <span className="text-xs text-gray-400 ml-auto">
                  🟢 {diveDates.size} 天有记录
                </span>
              </div>
              {typeof window !== 'undefined' && (
                <CalendarComponent
                  onChange={(value: any) => {
                    if (value instanceof Date) {
                      setSelectedDate(value);
                    }
                  }}
                  value={selectedDate}
                  tileClassName={({ date }: { date: Date }) => {
                    const dateStr = format(date, 'yyyy-MM-dd');
                    if (diveDates.has(dateStr)) {
                      return 'bg-cyan-100 text-cyan-700 rounded-full font-bold';
                    }
                    return '';
                  }}
                  className="border-0 w-full"
                />
              )}
              {selectedDate && (
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    📅 {format(selectedDate, 'yyyy年MM月dd日')}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-cyan-600"
                    onClick={() => setSelectedDate(null)}
                  >
                    清除筛选
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                className="pl-9 rounded-full bg-white/80 border-cyan-200 focus:border-cyan-400"
                placeholder="搜索日记..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {filteredEntries.length === 0 ? (
              <div className="text-center py-12 bg-white/60 backdrop-blur-sm rounded-3xl border-2 border-dashed border-cyan-200">
                <div className="text-5xl mb-3">🌊</div>
                <h3 className="text-xl font-semibold text-slate-700">
                  {entries.length === 0 ? '还没有潜水日记' : '没有匹配的日记'}
                </h3>
                <p className="text-gray-500 text-sm mt-1">
                  {entries.length === 0 
                    ? '开始记录你的第一次潜水冒险吧！'
                    : '试试调整搜索或日期筛选'}
                </p>
                {entries.length === 0 && (
                  <Button
                    className="mt-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 rounded-full px-6 shadow-lg"
                    onClick={() => openEditor()}
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    写第一篇日记
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {filteredEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="group bg-white/80 backdrop-blur-sm rounded-xl border border-white/50 hover:shadow-lg transition-all duration-300 overflow-hidden"
                  >
                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-bold text-slate-800 truncate">
                              {entry.title}
                            </h3>
                            {entry.bottomTime && entry.bottomTime > 0 && (
                              <span className="flex-shrink-0 px-2 py-0.5 bg-cyan-100 text-cyan-700 text-xs rounded-full">
                                ⏱️ {entry.bottomTime}min
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {entry.date || format(entry.createdAt, 'yyyy-MM-dd')}
                            </span>
                            {entry.location && (
                              <span className="flex items-center gap-1 truncate">
                                <MapPin className="h-3 w-3 flex-shrink-0" />
                                <span className="truncate">{entry.location}</span>
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            className="p-1.5 rounded-full hover:bg-cyan-100 text-cyan-600"
                            onClick={() => openEditor(entry)}
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            className="p-1.5 rounded-full hover:bg-red-100 text-red-500"
                            onClick={() => handleDelete(entry.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      {entry.mood && (
                        <div className="mt-1">
                          <span className="px-2 py-0.5 bg-cyan-50 rounded-full text-cyan-700 text-xs">
                            {MOOD_OPTIONS.find(m => m.label === entry.mood)?.emoji} {entry.mood}
                          </span>
                        </div>
                      )}

                      <p className="text-slate-700 text-sm mt-2 line-clamp-2">
                        {entry.content}
                      </p>

                      {entry.photos && entry.photos.length > 0 && (
                        <div className="flex gap-1 mt-2">
                          {entry.photos.slice(0, 3).map((photo, idx) => (
                            <div key={idx} className="w-12 h-12 rounded-lg overflow-hidden">
                              <img src={photo} alt="" className="w-full h-full object-cover" />
                            </div>
                          ))}
                          {entry.photos.length > 3 && (
                            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-xs text-gray-500">
                              +{entry.photos.length - 3}
                            </div>
                          )}
                        </div>
                      )}

                      {entry.tags && entry.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {entry.tags.map((tag) => (
                            <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 底部统计板 */}
        <div className="mt-8 bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-600 rounded-3xl p-6 text-white shadow-xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 rounded-full p-4">
                <Clock className="h-8 w-8" />
              </div>
              <div>
                <p className="text-white/70 text-sm">总潜水时间</p>
                <p className="text-3xl font-bold">
                  {totalHours > 0 ? `${totalHours}小时` : ''} {totalMinutes > 0 ? `${totalMinutes}分钟` : '0分钟'}
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="text-center">
                <p className="text-white/70 text-sm">潜水天数</p>
                <p className="text-2xl font-bold flex items-center justify-center gap-1">
                  <Award className="h-5 w-5 text-yellow-300" />
                  {diveDays} 天
                </p>
              </div>
              <div className="text-center">
                <p className="text-white/70 text-sm">总日记数</p>
                <p className="text-2xl font-bold">{entries.length}</p>
              </div>
              <div className="text-center">
                <p className="text-white/70 text-sm">潜水生涯</p>
                <p className="text-2xl font-bold flex items-center justify-center gap-1">
                  <Flame className="h-5 w-5 text-orange-300" />
                  {daysSinceFirstDive > 0 ? `${daysSinceFirstDive}天` : '新手上路'}
                </p>
              </div>
              <div className="text-center">
                <p className="text-white/70 text-sm">平均每次</p>
                <p className="text-2xl font-bold">
                  {diveDays > 0 ? `${Math.round(totalBottomTime / diveDays)}分钟` : '-'}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-white/70 mb-1">
              <span>潜水总时长</span>
              <span>{totalBottomTime} 分钟</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2.5">
              <div 
                className="bg-white/90 rounded-full h-2.5 transition-all duration-1000"
                style={{ width: `${Math.min((totalBottomTime / 1000) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* 对话框 */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-sm rounded-3xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                {editingId ? '✏️ 编辑日记' : '✍️ 写一篇潜水日记'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-5 mt-4">
              <Input
                placeholder="标题..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-lg font-medium border-cyan-200 rounded-xl"
              />
              
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  className="pl-10 rounded-xl border-cyan-200"
                  placeholder="潜水地点（可选）"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">潜水时长（分钟）</label>
                <Input
                  type="number"
                  placeholder="输入潜水时长..."
                  value={bottomTime || ''}
                  onChange={(e) => setBottomTime(parseInt(e.target.value) || 0)}
                  className="rounded-xl border-cyan-200"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">今天的心情</label>
                <div className="flex flex-wrap gap-2">
                  {MOOD_OPTIONS.map((option) => (
                    <button
                      key={option.label}
                      className={`px-3 py-1.5 rounded-full text-sm transition-all duration-200 ${
                        mood === option.label
                          ? 'bg-cyan-100 text-cyan-700 ring-2 ring-cyan-400'
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }`}
                      onClick={() => setMood(mood === option.label ? '' : option.label)}
                    >
                      {option.emoji} {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <Textarea
                placeholder="写下你的潜水故事..."
                className="min-h-[120px] rounded-xl border-cyan-200 resize-none"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">标签</label>
                <div className="flex flex-wrap gap-2">
                  {TAG_OPTIONS.map((tag) => (
                    <button
                      key={tag}
                      className={`px-3 py-1.5 rounded-full text-sm transition-all duration-200 ${
                        selectedTags.includes(tag)
                          ? 'bg-purple-100 text-purple-700 ring-2 ring-purple-400'
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }`}
                      onClick={() => toggleTag(tag)}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="cursor-pointer inline-flex items-center gap-2 text-cyan-600 hover:text-cyan-700 font-medium">
                  <Camera className="h-5 w-5" />
                  <span>上传照片</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
                <p className="text-xs text-gray-400 mt-1">支持 JPG, PNG, GIF 格式</p>
                {photoUrls.length > 0 && (
                  <div className="mt-3 space-y-3">
                    {photoUrls.map((url, index) => (
                      <div key={index} className="border rounded-xl p-3 bg-gray-50/50">
                        <div className="flex gap-3">
                          <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                            <img src={url} alt="" className="w-full h-full object-cover" />
                            <button
                              className="absolute -top-1 -right-1 bg-black/60 text-white rounded-full p-1"
                              onClick={() => {
                                setPhotoUrls(prev => prev.filter((_, i) => i !== index));
                              }}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                          <div className="flex-1">
                            <Input
                              placeholder="这张照片的感想..."
                              value={photoCaptions[index] || ''}
                              onChange={(e) => setPhotoCaptions(prev => ({ ...prev, [index]: e.target.value }))}
                              className="text-sm border-cyan-200 rounded-lg"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 rounded-xl shadow-lg"
                  onClick={handleSave}
                  disabled={saving || !title.trim() || !content.trim()}
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      保存中...
                    </>
                  ) : (
                    '💾 保存日记'
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="rounded-xl"
                  onClick={() => {
                    resetForm();
                    setIsOpen(false);
                  }}
                >
                  取消
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

