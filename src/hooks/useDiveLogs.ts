'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot, Unsubscribe, getDocs, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import type { DiveLog } from '@/types/dive-log';

export function useDiveLogs(userId: string | undefined) {
  const [diveLogs, setDiveLogs] = useState<DiveLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setDiveLogs([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const q = query(
      collection(db, 'diveLogs'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe: Unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const logs: DiveLog[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        } as DiveLog));
        setDiveLogs(logs);
        setIsLoading(false);
      },
      (err) => {
        console.error('Error fetching dive logs:', err);
        setError('获取潜水记录失败');
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  return { diveLogs, isLoading, error };
}

export function useRecentDiveLogs(userId: string | undefined, count: number = 5) {
  const [recentLogs, setRecentLogs] = useState<DiveLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setRecentLogs([]);
      setIsLoading(false);
      return;
    }

    const fetchRecentLogs = async () => {
      setIsLoading(true);
      try {
        const q = query(
          collection(db, 'diveLogs'),
          where('userId', '==', userId),
          orderBy('createdAt', 'desc'),
          limit(count)
        );
        const snapshot = await getDocs(q);
        const logs: DiveLog[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        } as DiveLog));
        setRecentLogs(logs);
      } catch (error) {
        console.error('Error fetching recent dive logs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentLogs();
  }, [userId, count]);

  return { recentLogs, isLoading };
}
