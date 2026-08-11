// 默认文件夹图标（使用 emoji + 颜色背景）
export const DEFAULT_FOLDER_ICONS = [
  { id: 'ocean', emoji: '🌊', bg: 'linear-gradient(135deg, #006994, #003d66)', label: '海洋蓝' },
  { id: 'coral', emoji: '🪸', bg: 'linear-gradient(135deg, #ff6b6b, #ee5a24)', label: '珊瑚红' },
  { id: 'marine', emoji: '🐠', bg: 'linear-gradient(135deg, #f093fb, #f5576c)', label: '热带鱼' },
  { id: 'wave', emoji: '🌊', bg: 'linear-gradient(135deg, #4facfe, #00f2fe)', label: '海浪' },
  { id: 'sunlight', emoji: '☀️', bg: 'linear-gradient(135deg, #fddb92, #d1fdff)', label: '海底光' },
  { id: 'turtle', emoji: '🐢', bg: 'linear-gradient(135deg, #11998e, #38ef7d)', label: '海龟' },
  { id: 'whale', emoji: '🐋', bg: 'linear-gradient(135deg, #2c3e6b, #4a6fa5)', label: '鲸鱼' },
  { id: 'shell', emoji: '🐚', bg: 'linear-gradient(135deg, #ffecd2, #fcb69f)', label: '贝壳' },
  { id: 'jellyfish', emoji: '🪼', bg: 'linear-gradient(135deg, #a18cd1, #fbc2eb)', label: '水母' },
  { id: 'starfish', emoji: '⭐', bg: 'linear-gradient(135deg, #f9d423, #ff4e50)', label: '海星' },
];

export interface Folder {
  id: string;
  name: string;
  iconId: string;
  coverImage?: string; // 用户自定义封面
  photos: Photo[];
  createdAt: Date;
}

export interface Photo {
  id: string;
  url: string;
  caption: string;
  uploadedAt: Date;
  userId: string;
  userName: string;
}

// 获取默认图标
export const getDefaultIcon = (iconId: string) => {
  return DEFAULT_FOLDER_ICONS.find(icon => icon.id === iconId) || DEFAULT_FOLDER_ICONS[0];
};

// 保存数据到 localStorage
export const saveFolders = (folders: Folder[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('photoWall_folders', JSON.stringify(folders));
  }
};

// 从 localStorage 加载数据
export const loadFolders = (): Folder[] => {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem('photoWall_folders');
    if (data) {
      try {
        const parsed = JSON.parse(data);
        return parsed.map((f: any) => ({
          ...f,
          createdAt: new Date(f.createdAt),
          photos: f.photos.map((p: any) => ({
            ...p,
            uploadedAt: new Date(p.uploadedAt),
          })),
        }));
      } catch (e) {
        console.error('加载数据失败:', e);
      }
    }
  }
  // 默认数据
  return [
    {
      id: '1',
      name: '我的潜水日记',
      iconId: 'ocean',
      photos: [],
      createdAt: new Date(),
    },
    {
      id: '2',
      name: '海洋生物',
      iconId: 'marine',
      photos: [],
      createdAt: new Date(),
    },
    {
      id: '3',
      name: '海底世界',
      iconId: 'coral',
      photos: [],
      createdAt: new Date(),
    },
  ];
};
