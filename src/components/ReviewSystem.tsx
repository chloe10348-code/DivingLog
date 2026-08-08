'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase/config';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { Star, Trash2, User, Loader2 } from 'lucide-react';

interface Review {
  id: string;
  siteId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

interface ReviewSystemProps {
  siteId: string;
  siteName: string;
}

export function ReviewSystem({ siteId, siteName }: ReviewSystemProps) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  // 加载评价
  useEffect(() => {
    loadReviews();
  }, [siteId]);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, 'reviews'),
        where('siteId', '==', siteId),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date(),
      })) as Review[];
      setReviews(data);
    } catch (error) {
      console.error('加载评价失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      alert('请先登录才能评价');
      return;
    }
    if (rating === 0) {
      alert('请选择评分');
      return;
    }
    if (!comment.trim()) {
      alert('请写评语');
      return;
    }

    setSubmitting(true);
    try {
      await addDoc(collection(db, 'reviews'), {
        siteId,
        userId: user.uid,
        userName: user.displayName || '匿名用户',
        rating,
        comment: comment.trim(),
        createdAt: serverTimestamp(),
      });
      setRating(0);
      setComment('');
      await loadReviews();
    } catch (error) {
      console.error('提交评价失败:', error);
      alert('提交失败，请稍后重试');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!confirm('确定要删除这条评价吗？')) return;
    try {
      await deleteDoc(doc(db, 'reviews', reviewId));
      await loadReviews();
    } catch (error) {
      console.error('删除评价失败:', error);
    }
  };

  // 计算平均评分
  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  return (
    <div className="mt-6 border-t pt-6">
      {/* 评分概览 */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-1">
          <span className="text-2xl font-bold text-slate-800">
            {avgRating.toFixed(1)}
          </span>
          <span className="text-yellow-500 text-xl">⭐</span>
        </div>
        <span className="text-sm text-gray-500">
          ({reviews.length} 条评价)
        </span>
      </div>

      {/* 写评价 */}
      {user && (
        <div className="bg-gray-50 rounded-xl p-4 mb-4">
          <p className="text-sm font-medium text-slate-700 mb-2">
            写评价 - {siteName}
          </p>
          <div className="flex items-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                className="text-3xl transition-transform hover:scale-110"
              >
                {star <= (hoverRating || rating) ? '⭐' : '☆'}
              </button>
            ))}
            <span className="text-sm text-gray-500 ml-2">
              {rating > 0 ? `${rating} 星` : '点击评分'}
            </span>
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="分享你的潜水体验..."
            className="w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            rows={3}
          />
          <button
            onClick={handleSubmit}
            disabled={submitting || rating === 0 || !comment.trim()}
            className="mt-2 bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded-lg disabled:opacity-50"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin inline" /> : '提交评价'}
          </button>
        </div>
      )}

      {/* 评价列表 */}
      {loading ? (
        <div className="text-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-cyan-600 mx-auto" />
        </div>
      ) : reviews.length === 0 ? (
        <p className="text-gray-500 text-sm text-center py-4">还没有评价，成为第一个评价的人！</p>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white border rounded-xl p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="font-medium text-slate-700">{review.userName}</span>
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < review.rating
                              ? 'text-yellow-500 fill-yellow-500'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{review.comment}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {review.createdAt.toLocaleDateString('zh-CN')}
                  </p>
                </div>
                {user && user.uid === review.userId && (
                  <button
                    onClick={() => handleDelete(review.id)}
                    className="text-red-400 hover:text-red-600 transition"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
