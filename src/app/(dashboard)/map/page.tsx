'use client';

import { useState } from 'react';
import { MapPin, Waves, ExternalLink } from 'lucide-react';

const DIVE_SITES = [
  // ===== 大洋洲 =====
  {
    id: 1,
    name: '大堡礁',
    location: '澳大利亚',
    lat: -18.2871,
    lng: 147.6992,
    rating: 4.9,
    image: '🏝️',
    description: '世界最大的珊瑚礁系统，拥有超过2,900个独立礁石和900多个岛屿',
  },
  {
    id: 2,
    name: '鳕鱼洞',
    location: '澳大利亚, 大堡礁',
    lat: -14.4167,
    lng: 145.4333,
    rating: 4.8,
    image: '🐟',
    description: '大堡礁最著名的潜点之一，以大型马铃薯鳕鱼闻名',
  },
  {
    id: 3,
    name: 'SS永加拉号沉船',
    location: '澳大利亚, 汤斯维尔',
    lat: -19.3042,
    lng: 147.6192,
    rating: 4.9,
    image: '🚢',
    description: '澳大利亚最著名的沉船潜点，1911年沉没，保存完好',
  },
  {
    id: 4,
    name: '鱼鹰礁',
    location: '澳大利亚, 珊瑚海',
    lat: -13.9167,
    lng: 146.5833,
    rating: 4.9,
    image: '🦈',
    description: '珊瑚海中最壮观的珊瑚礁之一，垂直陡壁深度超1000米',
  },
  {
    id: 5,
    name: '彩虹礁',
    location: '澳大利亚, 珊瑚海',
    lat: -18.0,
    lng: 146.0,
    rating: 4.7,
    image: '🌈',
    description: '以色彩斑斓的珊瑚和丰富的热带鱼闻名',
  },
  // ===== 东南亚 =====
  {
    id: 6,
    name: '拉贾安帕特群岛',
    location: '印度尼西亚, 巴布亚',
    lat: -0.5,
    lng: 130.0,
    rating: 5.0,
    image: '🐠',
    description: '地球上海洋生物多样性最丰富的地区，被称为"四王群岛"',
  },
  {
    id: 7,
    name: '克里角',
    location: '印度尼西亚, 拉贾安帕特',
    lat: -0.45,
    lng: 130.35,
    rating: 4.9,
    image: '🐡',
    description: '单次潜水记录海洋生物种类最多的潜点，超过300种鱼类',
  },
  {
    id: 8,
    name: '城堡岩 (科莫多)',
    location: '印度尼西亚, 科莫多',
    lat: -8.5,
    lng: 119.5,
    rating: 4.8,
    image: '🏰',
    description: '科莫多国家公园最壮观的潜点之一，以急流和大型鱼类闻名',
  },
  {
    id: 9,
    name: '阿梅德 (巴厘岛)',
    location: '印度尼西亚, 巴厘岛',
    lat: -8.35,
    lng: 115.65,
    rating: 4.5,
    image: '🌋',
    description: '巴厘岛东部的潜水天堂，以黑沙和沉船闻名',
  },
  {
    id: 10,
    name: '图兰奔 (巴厘岛)',
    location: '印度尼西亚, 巴厘岛',
    lat: -8.3,
    lng: 115.6,
    rating: 4.7,
    image: '🚢',
    description: '巴厘岛最著名的岸潜潜点，以USAT自由号沉船闻名',
  },
  {
    id: 11,
    name: '杰梅卢克湾',
    location: '印度尼西亚, 巴厘岛',
    lat: -8.35,
    lng: 115.65,
    rating: 4.3,
    image: '🌊',
    description: '阿梅德最受欢迎的海湾潜点，适合初学者和浮潜',
  },
  {
    id: 12,
    name: '西巴丹岛',
    location: '马来西亚, 沙巴',
    lat: 4.1,
    lng: 118.6,
    rating: 5.0,
    image: '🐢',
    description: '世界顶级潜水目的地之一，垂直陡壁直落深渊',
  },
  {
    id: 13,
    name: '图巴塔哈群礁',
    location: '菲律宾',
    lat: 8.95,
    lng: 119.87,
    rating: 4.9,
    image: '⭐',
    description: 'UNESCO世界遗产，菲律宾最原始的珊瑚礁生态系统',
  },
  {
    id: 14,
    name: '鲨鱼机场',
    location: '菲律宾, 图巴塔哈',
    lat: 8.95,
    lng: 119.9,
    rating: 4.8,
    image: '✈️',
    description: '图巴塔哈最著名的潜点，常见白鳍鲨和灰礁鲨群',
  },
  {
    id: 15,
    name: '莫纳尔浅滩',
    location: '菲律宾, 马拉帕斯卡',
    lat: 11.3,
    lng: 124.1,
    rating: 4.8,
    image: '🦈',
    description: '以长尾鲨清洁站闻名，是观鲨的最佳潜点之一',
  },
  {
    id: 16,
    name: '沙丁鱼风暴',
    location: '菲律宾, 莫阿尔博阿尔',
    lat: 9.95,
    lng: 123.4,
    rating: 4.7,
    image: '🐟',
    description: '数百万条沙丁鱼形成的壮丽水下风暴景象',
  },
  {
    id: 17,
    name: '纳潘岭礁',
    location: '菲律宾, 莫阿尔博阿尔',
    lat: 9.95,
    lng: 123.4,
    rating: 4.6,
    image: '🪸',
    description: '以陡峭的垂直崖壁和丰富的珊瑚生态闻名',
  },
  {
    id: 18,
    name: '蓝洞',
    location: '泰国, 安达曼海',
    lat: 7.5,
    lng: 98.5,
    rating: 4.7,
    image: '🔵',
    description: '安达曼海最著名的潜点，水下洞穴系统壮观',
  },
  {
    id: 19,
    name: '斯米兰群岛',
    location: '泰国, 安达曼海',
    lat: 8.5,
    lng: 97.5,
    rating: 4.8,
    image: '🏝️',
    description: '泰国最顶级的潜水目的地，以清澈海水和丰富海洋生物闻名',
  },
  {
    id: 20,
    name: '诗巴丹',
    location: '马来西亚, 沙巴',
    lat: 4.1,
    lng: 118.6,
    rating: 5.0,
    image: '🐢',
    description: '世界顶级潜水目的地之一，海龟和鲨鱼的天堂',
  },
  // ===== 南亚/印度洋 =====
  {
    id: 21,
    name: '马尔代夫',
    location: '马尔代夫',
    lat: 3.2028,
    lng: 73.2207,
    rating: 4.8,
    image: '🌴',
    description: '印度洋上的天堂群岛，清澈海水和丰富海洋生物',
  },
  {
    id: 22,
    name: '蓝魔法',
    location: '马尔代夫, 北马累环礁',
    lat: 4.35,
    lng: 73.6,
    rating: 4.8,
    image: '🦋',
    description: '马尔代夫最著名的蝠鲼清洁站，全年可遇蝠鲼群',
  },
  {
    id: 23,
    name: '曼塔沙地',
    location: '马尔代夫, 北马累环礁',
    lat: 4.2,
    lng: 73.5,
    rating: 4.7,
    image: '🪸',
    description: '蝠鲼日常清洁和觅食的热点区域',
  },
  {
    id: 24,
    name: '斯里兰卡观鲸点',
    location: '斯里兰卡, 亭可马里',
    lat: 8.5,
    lng: 81.0,
    rating: 4.6,
    image: '🐋',
    description: '世界著名的观鲸地点，可遇蓝鲸和抹香鲸',
  },
  // ===== 太平洋 =====
  {
    id: 25,
    name: '帕劳',
    location: '帕劳',
    lat: 7.3,
    lng: 134.5,
    rating: 4.9,
    image: '🌸',
    description: '太平洋上的潜水天堂，以水母湖和蓝角闻名',
  },
  {
    id: 26,
    name: '蓝角',
    location: '帕劳',
    lat: 7.3,
    lng: 134.5,
    rating: 4.9,
    image: '🌐',
    description: '帕劳最著名的潜点，急流带来的丰富营养吸引了大量海洋生物',
  },
  {
    id: 27,
    name: '蓝湖 (帕劳)',
    location: '帕劳',
    lat: 7.3,
    lng: 134.5,
    rating: 4.5,
    image: '🏖️',
    description: '帕劳的浅水潜水天堂，适合所有级别潜水员',
  },
  {
    id: 28,
    name: '所罗门群岛',
    location: '所罗门群岛',
    lat: -8.0,
    lng: 160.0,
    rating: 4.6,
    image: '🏝️',
    description: '太平洋上未经开发的潜水宝地，二战沉船和历史遗迹',
  },
  // ===== 中美洲/加勒比海 =====
  {
    id: 29,
    name: '加拉帕戈斯群岛',
    location: '厄瓜多尔',
    lat: -0.5,
    lng: -90.5,
    rating: 5.0,
    image: '🦁',
    description: '达尔文进化论的灵感来源，独特的海洋生态系统',
  },
  {
    id: 30,
    name: '达尔文拱门',
    location: '厄瓜多尔, 加拉帕戈斯',
    lat: -0.5,
    lng: -90.5,
    rating: 4.9,
    image: '🌊',
    description: '加拉帕戈斯最著名的潜点，标志性岩石拱门',
  },
  {
    id: 31,
    name: '狼岛',
    location: '厄瓜多尔, 加拉帕戈斯',
    lat: -0.1,
    lng: -91.1,
    rating: 5.0,
    image: '🐋',
    description: '加拉帕戈斯最偏远的潜点，锤头鲨群的天堂',
  },
  {
    id: 32,
    name: '博奈尔岛',
    location: '加勒比海',
    lat: 12.15,
    lng: -68.27,
    rating: 4.7,
    image: '🏝️',
    description: '加勒比海最著名的岸潜目的地，被称为"潜水者的天堂"',
  },
  {
    id: 33,
    name: '开曼群岛',
    location: '加勒比海, 开曼',
    lat: 19.3,
    lng: -81.3,
    rating: 4.6,
    image: '🏝️',
    description: '加勒比海最著名的潜水目的地之一，以清澈海水和沉船闻名',
  },
  // ===== 非洲/红海 =====
  {
    id: 34,
    name: '红海',
    location: '埃及',
    lat: 27.0,
    lng: 34.0,
    rating: 4.8,
    image: '🏜️',
    description: '世界顶级潜水目的地，拥有超过1200种鱼类和壮观的珊瑚礁',
  },
  {
    id: 35,
    name: 'SS锡斯特莱贡号沉船',
    location: '埃及, 红海',
    lat: 27.0,
    lng: 34.0,
    rating: 4.9,
    image: '⚓',
    description: '世界最著名的沉船潜点之一，二战货轮，载有军用物资',
  },
  {
    id: 36,
    name: '埃尔芬斯通礁',
    location: '埃及, 红海',
    lat: 25.3,
    lng: 34.8,
    rating: 4.8,
    image: '🦈',
    description: '红海最著名的离岸礁石之一，可见鲨鱼和大型鱼类',
  },
  // ===== 欧洲/地中海 =====
  {
    id: 37,
    name: '滨海自由城',
    location: '法国, 蔚蓝海岸',
    lat: 43.7,
    lng: 7.3,
    rating: 4.4,
    image: '🏰',
    description: '法国蔚蓝海岸的潜水胜地，拥有清澈的地中海海水',
  },
  {
    id: 38,
    name: '辛纳利亚海滩 (克里特岛)',
    location: '希腊, 克里特岛',
    lat: 35.0,
    lng: 26.0,
    rating: 4.5,
    image: '🏖️',
    description: '克里特岛最美丽的潜水海滩，清澈的蓝色海水',
  },
  {
    id: 39,
    name: '卡利姆诺斯岛',
    location: '希腊, 爱琴海',
    lat: 36.95,
    lng: 27.0,
    rating: 4.4,
    image: '🏛️',
    description: '爱琴海上的潜水瑰宝，以丰富的海绵和珊瑚闻名',
  },
  // ===== 北美洲 =====
  {
    id: 40,
    name: '佛罗里达群岛',
    location: '美国, 佛罗里达',
    lat: 24.5,
    lng: -81.7,
    rating: 4.3,
    image: '🌊',
    description: '美国最著名的潜水目的地之一，以珊瑚礁和沉船闻名',
  },
  // ===== 南美洲 =====
  {
    id: 41,
    name: '费尔南多·迪诺罗尼亚',
    location: '巴西',
    lat: -3.85,
    lng: -32.43,
    rating: 4.7,
    image: '🐬',
    description: '巴西最著名的潜水目的地，以海豚和清澈海水闻名',
  },
  // ===== 亚洲其他 =====
  {
    id: 42,
    name: '与那国岛海底遗迹',
    location: '日本, 冲绳',
    lat: 24.45,
    lng: 123.0,
    rating: 4.7,
    image: '🏛️',
    description: '神秘的海底金字塔遗迹，被认为可能是史前文明遗址',
  },
  {
    id: 43,
    name: '冲绳蓝洞',
    location: '日本, 冲绳',
    lat: 26.3,
    lng: 127.8,
    rating: 4.6,
    image: '💎',
    description: '冲绳最著名的潜点，阳光照射形成独特的蓝色洞穴景象',
  },
  // ===== 极地/特殊 =====
  {
    id: 44,
    name: '西尔弗拉裂缝',
    location: '冰岛',
    lat: 64.25,
    lng: -21.13,
    rating: 4.9,
    image: '❄️',
    description: '北美与欧亚板块之间的裂缝，世界上最清澈的水域，能见度达100米以上',
  },
];

export default function MapPage() {
  const [selectedSite, setSelectedSite] = useState<any>(null);

  const getGoogleMapsUrl = (lat: number, lng: number) => {
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  };

  const mapCenter = selectedSite 
    ? `${selectedSite.lat},${selectedSite.lng}` 
    : '0,120';
  const mapZoom = selectedSite ? 10 : 3;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <MapPin className="h-8 w-8 text-cyan-600" />
        潜点地图
        <span className="text-sm text-gray-400 font-normal ml-2">
          ({DIVE_SITES.length} 个目的地)
        </span>
      </h1>

      {/* Google Maps 嵌入 */}
      <div className="rounded-2xl overflow-hidden shadow-lg mb-6 bg-gray-100" style={{ height: '450px' }}>
        <iframe
          src={`https://maps.google.com/maps?q=${mapCenter}&z=${mapZoom}&output=embed`}
          className="w-full h-full border-0"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="潜水地图"
        />
      </div>

      {/* 潜点列表 */}
      <h2 className="text-lg font-semibold text-slate-700 mb-3 flex items-center gap-2">
        <Waves className="h-5 w-5 text-cyan-600" />
        热门潜水目的地
        <span className="text-sm text-gray-400 font-normal ml-2">点击查看位置</span>
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {DIVE_SITES.map((site) => (
          <div
            key={site.id}
            className={`bg-white rounded-xl p-3 border-2 cursor-pointer transition-all hover:shadow-md ${
              selectedSite?.id === site.id
                ? 'border-cyan-500 shadow-md bg-cyan-50'
                : 'border-gray-200 hover:border-cyan-300'
            }`}
            onClick={() => setSelectedSite(site)}
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">{site.image}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-800 text-sm truncate">{site.name}</h3>
                <p className="text-xs text-gray-500 truncate">{site.location}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-yellow-500 text-xs">⭐</span>
                  <span className="text-xs font-medium">{site.rating}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 选中潜点的详情 */}
      {selectedSite && (
        <div className="mt-4 p-4 bg-cyan-50 rounded-xl border border-cyan-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <span className="text-2xl mr-2">{selectedSite.image}</span>
            <span className="font-semibold text-slate-800">{selectedSite.name}</span>
            <span className="text-gray-500 ml-2">{selectedSite.location}</span>
            <span className="ml-2 text-yellow-500">⭐ {selectedSite.rating}</span>
            <p className="text-sm text-gray-600 mt-1">{selectedSite.description}</p>
          </div>
          <a
            href={getGoogleMapsUrl(selectedSite.lat, selectedSite.lng)}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition flex-shrink-0"
          >
            <ExternalLink className="h-4 w-4" />
            在 Google Maps 打开
          </a>
        </div>
      )}

      {!selectedSite && (
        <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200 text-center text-gray-500 text-sm">
          👆 点击上方潜点查看位置
        </div>
      )}
    </div>
  );
}



