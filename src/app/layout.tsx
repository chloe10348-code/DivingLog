import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DivingLog',
  description: '记录每一次水下探索，追踪你的潜水旅程',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
