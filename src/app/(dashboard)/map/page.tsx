'use client';

import { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Star, Eye, Thermometer, Waves } from 'lucide-react';

// 所有潜水目的地数据（38个，全部中文显示）
const DIVE_SITES = [
  // 1. 澳大利亚
  {
    id: 1,
    name: '大堡礁',
    nameEn: 'Great Barrier Reef',
    location: '澳大利亚',
    lat: -18.2871,
    lng: 147.6992,
    description: '世界最大的珊瑚礁系统，拥有超过2,900个独立礁石和900多个岛屿',
    depth: '30m',
    visibility: '20m',
    temp: '26°C',
    difficulty: '初级-高级',
    marineLife: '海龟、小丑鱼、蝠鲼、鲨鱼',
    bestSeason: '6月-10月',
    rating: 4.9,
    image: '🏝️',
    features: ['珊瑚礁', '沉船', '洞穴'],
  },
  {
    id: 2,
    name: '鳕鱼洞',
    nameEn: 'Cod Hole',
    location: '澳大利亚, 大堡礁',
    lat: -14.4167,
    lng: 145.4333,
    description: '大堡礁最著名的潜点之一，以大型马铃薯鳕鱼闻名',
    depth: '25m',
    visibility: '18m',
    temp: '26°C',
    difficulty: '中级',
    marineLife: '马铃薯鳕鱼、海龟、礁鲨',
    bestSeason: '6月-10月',
    rating: 4.8,
    image: '🐟',
    features: ['珊瑚礁', '大型鱼类'],
  },
  {
    id: 3,
    name: 'SS永加拉号沉船',
    nameEn: 'SS Yongala',
    location: '澳大利亚, 汤斯维尔',
    lat: -19.3042,
    lng: 147.6192,
    description: '澳大利亚最著名的沉船潜点，1911年沉没，保存完好',
    depth: '30m',
    visibility: '15m',
    temp: '25°C',
    difficulty: '进阶',
    marineLife: '蝠鲼、海蛇、大型石斑鱼',
    bestSeason: '7月-9月',
    rating: 4.9,
    image: '🚢',
    features: ['沉船', '大型鱼类'],
  },
  {
    id: 4,
    name: '鱼鹰礁',
    nameEn: 'Osprey Reef',
    location: '澳大利亚, 珊瑚海',
    lat: -13.9167,
    lng: 146.5833,
    description: '珊瑚海中最壮观的珊瑚礁之一，垂直陡壁深度超1000米',
    depth: '40m+',
    visibility: '30m',
    temp: '26°C',
    difficulty: '进阶',
    marineLife: '锤头鲨、灰礁鲨、蝠鲼',
    bestSeason: '6月-10月',
    rating: 4.9,
    image: '🦈',
    features: ['垂直陡壁', '鲨鱼'],
  },
  // 2. 印度尼西亚
  {
    id: 5,
    name: '拉贾安帕特群岛',
    nameEn: 'Raja Ampat',
    location: '印度尼西亚, 巴布亚省',
    lat: -0.5,
    lng: 130.0,
    description: '地球上海洋生物多样性最丰富的地区，被称为"四王群岛"',
    depth: '35m',
    visibility: '25m',
    temp: '28°C',
    difficulty: '初级-高级',
    marineLife: '须鲸、海龟、蝠鲼、极乐鸟',
    bestSeason: '10月-4月',
    rating: 5.0,
    image: '🐠',
    features: ['珊瑚礁', '生物多样性'],
  },
  {
    id: 6,
    name: '克里角',
    nameEn: 'Cape Kri',
    location: '印度尼西亚, 拉贾安帕特',
    lat: -0.45,
    lng: 130.35,
    description: '单次潜水记录海洋生物种类最多的潜点，超过300种鱼类',
    depth: '25m',
    visibility: '25m',
    temp: '28°C',
    difficulty: '中级',
    marineLife: '隆头鹦哥鱼、燕鱼、海龟',
    bestSeason: '10月-4月',
    rating: 4.9,
    image: '🐡',
    features: ['生物多样性', '珊瑚礁'],
  },
  // 3. 马尔代夫
  {
    id: 7,
    name: '马尔代夫',
    nameEn: 'Maldives',
    location: '马尔代夫',
    lat: 3.2028,
    lng: 73.2207,
    description: '印度洋上的天堂群岛，清澈海水和丰富海洋生物',
    depth: '30m',
    visibility: '30m',
    temp: '28°C',
    difficulty: '初级-中级',
    marineLife: '鲸鲨、蝠鲼、海龟、礁鲨',
    bestSeason: '11月-4月',
    rating: 4.8,
    image: '🌴',
    features: ['珊瑚礁', '大型鱼类'],
  },
  {
    id: 8,
    name: '蓝魔法',
    nameEn: 'Blue Magic',
    location: '马尔代夫, 北马累环礁',
    lat: 4.35,
    lng: 73.6,
    description: '马尔代夫最著名的蝠鲼清洁站，全年可遇蝠鲼群',
    depth: '25m',
    visibility: '25m',
    temp: '28°C',
    difficulty: '中级',
    marineLife: '蝠鲼、海龟、礁鲨',
    bestSeason: '11月-4月',
    rating: 4.8,
    image: '🦋',
    features: ['蝠鲼', '清洁站'],
  },
  {
    id: 9,
    name: '曼塔沙地',
    nameEn: 'Manta Sandy',
    location: '马尔代夫, 北马累环礁',
    lat: 4.2,
    lng: 73.5,
    description: '蝠鲼日常清洁和觅食的热点区域',
    depth: '20m',
    visibility: '22m',
    temp: '28°C',
    difficulty: '初级',
    marineLife: '蝠鲼、海龟、小丑鱼',
    bestSeason: '11月-4月',
    rating: 4.7,
    image: '🪸',
    features: ['蝠鲼', '清洁站'],
  },
  // 4. 加拉帕戈斯
  {
    id: 10,
    name: '加拉帕戈斯群岛',
    nameEn: 'Galápagos Islands',
    location: '厄瓜多尔',
    lat: -0.5,
    lng: -90.5,
    description: '达尔文进化论的灵感来源，独特的海洋生态系统',
    depth: '30m',
    visibility: '20m',
    temp: '22°C',
    difficulty: '进阶',
    marineLife: '锤头鲨群、海狮、海鬣蜥、企鹅',
    bestSeason: '6月-11月',
    rating: 5.0,
    image: '🦁',
    features: ['锤头鲨群', '独特生物'],
  },
  {
    id: 11,
    name: '达尔文拱门',
    nameEn: "Darwin's Arch",
    location: '厄瓜多尔, 加拉帕戈斯',
    lat: -0.5,
    lng: -90.5,
    description: '加拉帕戈斯最著名的潜点，标志性岩石拱门',
    depth: '35m',
    visibility: '20m',
    temp: '22°C',
    difficulty: '进阶',
    marineLife: '锤头鲨、海龟、蝠鲼',
    bestSeason: '6月-11月',
    rating: 4.9,
    image: '🌊',
    features: ['岩石拱门', '鲨鱼'],
  },
  {
    id: 12,
    name: '狼岛',
    nameEn: 'Wolf Island',
    location: '厄瓜多尔, 加拉帕戈斯',
    lat: -0.1,
    lng: -91.1,
    description: '加拉帕戈斯最偏远的潜点，锤头鲨群的天堂',
    depth: '40m',
    visibility: '25m',
    temp: '22°C',
    difficulty: '进阶',
    marineLife: '锤头鲨、海狮、海龟',
    bestSeason: '6月-11月',
    rating: 5.0,
    image: '🐋',
    features: ['锤头鲨群', '偏远'],
  },
  // 5. 埃及红海
  {
    id: 13,
    name: '红海',
    nameEn: 'Red Sea',
    location: '埃及',
    lat: 27.0,
    lng: 34.0,
    description: '世界顶级潜水目的地，拥有超过1200种鱼类和壮观的珊瑚礁',
    depth: '30m',
    visibility: '30m',
    temp: '26°C',
    difficulty: '初级-高级',
    marineLife: '海龟、海豚、拿破仑鱼、礁鲨',
    bestSeason: '10月-5月',
    rating: 4.8,
    image: '🏜️',
    features: ['珊瑚礁', '沉船'],
  },
  {
    id: 14,
    name: 'SS锡斯特莱贡号沉船',
    nameEn: 'SS Thistlegorm',
    location: '埃及, 红海',
    lat: 27.0,
    lng: 34.0,
    description: '世界最著名的沉船潜点之一，二战货轮，载有军用物资',
    depth: '30m',
    visibility: '20m',
    temp: '25°C',
    difficulty: '进阶',
    marineLife: '海龟、珊瑚、拿破仑鱼',
    bestSeason: '10月-5月',
    rating: 4.9,
    image: '⚓',
    features: ['沉船', '历史'],
  },
  {
    id: 15,
    name: '埃尔芬斯通礁',
    nameEn: 'Elphinstone Reef',
    location: '埃及, 红海',
    lat: 25.3,
    lng: 34.8,
    description: '红海最著名的离岸礁石之一，可见鲨鱼和大型鱼类',
    depth: '35m',
    visibility: '25m',
    temp: '26°C',
    difficulty: '进阶',
    marineLife: '锤头鲨、海龟、蝠鲼',
    bestSeason: '10月-5月',
    rating: 4.8,
    image: '🦈',
    features: ['离岸礁石', '鲨鱼'],
  },
  // 6. 帕劳
  {
    id: 16,
    name: '帕劳',
    nameEn: 'Palau',
    location: '帕劳',
    lat: 7.3,
    lng: 134.5,
    description: '太平洋上的潜水天堂，以水母湖和蓝角闻名',
    depth: '30m',
    visibility: '30m',
    temp: '28°C',
    difficulty: '初级-中级',
    marineLife: '金水母、海龟、鲨鱼、蝠鲼',
    bestSeason: '11月-4月',
    rating: 4.9,
    image: '🌸',
    features: ['水母湖', '蓝角'],
  },
  {
    id: 17,
    name: '蓝角',
    nameEn: 'Blue Corner',
    location: '帕劳',
    lat: 7.3,
    lng: 134.5,
    description: '帕劳最著名的潜点，急流带来的丰富营养吸引了大量海洋生物',
    depth: '30m',
    visibility: '30m',
    temp: '28°C',
    difficulty: '进阶',
    marineLife: '海龟、鲨鱼、蝠鲼、金枪鱼',
    bestSeason: '11月-4月',
    rating: 4.9,
    image: '🌐',
    features: ['急流', '大型鱼类'],
  },
  // 7. 马来西亚
  {
    id: 18,
    name: '西巴丹岛',
    nameEn: 'Sipadan',
    location: '马来西亚, 沙巴',
    lat: 4.1,
    lng: 118.6,
    description: '世界顶级潜水目的地之一，垂直陡壁直落深渊',
    depth: '40m+',
    visibility: '30m',
    temp: '27°C',
    difficulty: '进阶',
    marineLife: '海龟、鲨鱼、蝠鲼、隆头鹦哥鱼',
    bestSeason: '3月-10月',
    rating: 5.0,
    image: '🐢',
    features: ['垂直陡壁', '海龟'],
  },
  // 8. 菲律宾
  {
    id: 19,
    name: '图巴塔哈群礁',
    nameEn: 'Tubbataha Reefs',
    location: '菲律宾',
    lat: 8.95,
    lng: 119.87,
    description: 'UNESCO世界遗产，菲律宾最原始的珊瑚礁生态系统',
    depth: '30m',
    visibility: '35m',
    temp: '28°C',
    difficulty: '中级',
    marineLife: '礁鲨、海龟、蝠鲼、拿破仑鱼',
    bestSeason: '3月-6月',
    rating: 4.9,
    image: '⭐',
    features: ['UNESCO', '原始珊瑚礁'],
  },
  {
    id: 20,
    name: '鲨鱼机场',
    nameEn: 'Shark Airport',
    location: '菲律宾, 图巴塔哈',
    lat: 8.95,
    lng: 119.9,
    description: '图巴塔哈最著名的潜点，常见白鳍鲨和灰礁鲨群',
    depth: '25m',
    visibility: '30m',
    temp: '28°C',
    difficulty: '中级',
    marineLife: '白鳍鲨、灰礁鲨、海龟',
    bestSeason: '3月-6月',
    rating: 4.8,
    image: '✈️',
    features: ['鲨鱼', '清洁站'],
  },
  {
    id: 21,
    name: '莫纳尔浅滩',
    nameEn: 'Monad Shoal',
    location: '菲律宾, 马拉帕斯卡',
    lat: 11.3,
    lng: 124.1,
    description: '以长尾鲨清洁站闻名，是观鲨的最佳潜点之一',
    depth: '30m',
    visibility: '20m',
    temp: '26°C',
    difficulty: '进阶',
    marineLife: '长尾鲨、蝠鲼、海龟',
    bestSeason: '11月-5月',
    rating: 4.8,
    image: '🦈',
    features: ['长尾鲨', '清洁站'],
  },
  {
    id: 22,
    name: '沙丁鱼风暴',
    nameEn: 'Sardine Run',
    location: '菲律宾, 莫阿尔博阿尔',
    lat: 9.95,
    lng: 123.4,
    description: '数百万条沙丁鱼形成的壮丽水下风暴景象',
    depth: '15m',
    visibility: '15m',
    temp: '26°C',
    difficulty: '初级',
    marineLife: '沙丁鱼群、海龟、礁鲨',
    bestSeason: '11月-5月',
    rating: 4.7,
    image: '🐟',
    features: ['沙丁鱼风暴', '浅水'],
  },
  // 9. 加勒比海
  {
    id: 23,
    name: '博奈尔岛',
    nameEn: 'Bonaire',
    location: '加勒比海',
    lat: 12.15,
    lng: -68.27,
    description: '加勒比海最著名的岸潜目的地，被称为"潜水者的天堂"',
    depth: '25m',
    visibility: '25m',
    temp: '27°C',
    difficulty: '初级-中级',
    marineLife: '海龟、珊瑚、热带鱼',
    bestSeason: '12月-5月',
    rating: 4.7,
    image: '🏝️',
    features: ['岸潜', '珊瑚礁'],
  },
  // 10. 冰岛
  {
    id: 24,
    name: '西尔弗拉裂缝',
    nameEn: 'Silfra Fissure',
    location: '冰岛',
    lat: 64.25,
    lng: -21.13,
    description: '北美与欧亚板块之间的裂缝，世界上最清澈的水域，能见度达100米以上',
    depth: '18m',
    visibility: '100m',
    temp: '2°C',
    difficulty: '初级-中级',
    marineLife: '无鱼类，但水下景色震撼',
    bestSeason: '5月-9月',
    rating: 4.9,
    image: '❄️',
    features: ['板块裂缝', '超清水域'],
  },
  // 11. 墨西哥
  {
    id: 25,
    name: '天坑 (图卢姆)',
    nameEn: 'The Pit (Tulum)',
    location: '墨西哥, 尤卡坦半岛',
    lat: 20.15,
    lng: -87.45,
    description: '世界上最著名的洞穴潜点之一，阳光穿透水面形成壮观的光束',
    depth: '40m',
    visibility: '50m',
    temp: '25°C',
    difficulty: '进阶',
    marineLife: '洞穴生物、独特微生物',
    bestSeason: '11月-3月',
    rating: 4.8,
    image: '🕳️',
    features: ['洞穴潜水', '太阳光束'],
  },
  {
    id: 26,
    name: '安赫利塔天坑',
    nameEn: 'Angelita Cenote',
    location: '墨西哥, 尤卡坦半岛',
    lat: 20.1,
    lng: -87.3,
    description: '拥有独特硫化氢层的洞穴潜点，宛如水下河流森林',
    depth: '30m',
    visibility: '20m',
    temp: '24°C',
    difficulty: '进阶',
    marineLife: '洞穴生物',
    bestSeason: '11月-3月',
    rating: 4.8,
    image: '🌳',
    features: ['硫化氢层', '洞穴潜水'],
  },
  // 12. 日本
  {
    id: 27,
    name: '与那国岛海底遗迹',
    nameEn: 'Yonaguni Monument',
    location: '日本, 冲绳',
    lat: 24.45,
    lng: 123.0,
    description: '神秘的海底金字塔遗迹，被认为可能是史前文明遗址',
    depth: '30m',
    visibility: '20m',
    temp: '24°C',
    difficulty: '进阶',
    marineLife: '锤头鲨、海龟',
    bestSeason: '5月-10月',
    rating: 4.7,
    image: '🏛️',
    features: ['海底遗迹', '文化'],
  },
  {
    id: 28,
    name: '冲绳蓝洞',
    nameEn: 'Okinawa Blue Cave',
    location: '日本, 冲绳',
    lat: 26.3,
    lng: 127.8,
    description: '冲绳最著名的潜点，阳光照射形成独特的蓝色洞穴景象',
    depth: '18m',
    visibility: '20m',
    temp: '24°C',
    difficulty: '初级',
    marineLife: '海龟、小丑鱼、珊瑚',
    bestSeason: '5月-10月',
    rating: 4.6,
    image: '💎',
    features: ['蓝色洞穴', '阳光光束'],
  },
  // 13. 科莫多
  {
    id: 29,
    name: '城堡岩 (科莫多)',
    nameEn: 'Castle Rock (Komodo)',
    location: '印度尼西亚, 科莫多国家公园',
    lat: -8.5,
    lng: 119.5,
    description: '科莫多国家公园最壮观的潜点之一，以急流和大型鱼类闻名',
    depth: '35m',
    visibility: '20m',
    temp: '27°C',
    difficulty: '进阶',
    marineLife: '礁鲨、蝠鲼、海龟',
    bestSeason: '4月-10月',
    rating: 4.8,
    image: '🏰',
    features: ['急流', '大型鱼类'],
  },
  // 14. 其他
  {
    id: 30,
    name: '埃尔博伊莱 (索科罗)',
    nameEn: 'El Boiler (Socorro)',
    location: '墨西哥, 索科罗群岛',
    lat: 18.5,
    lng: -111.0,
    description: '索科罗群岛最著名的潜点，以巨型蝠鲼和锤头鲨群闻名',
    depth: '35m',
    visibility: '25m',
    temp: '24°C',
    difficulty: '进阶',
    marineLife: '巨型蝠鲼、锤头鲨、海豚',
    bestSeason: '11月-5月',
    rating: 4.9,
    image: '🔱',
    features: ['巨型蝠鲼', '锤头鲨'],
  },
  {
    id: 31,
    name: '蓝湖 (帕劳)',
    nameEn: 'Blue Lagoon',
    location: '帕劳',
    lat: 7.3,
    lng: 134.5,
    description: '帕劳的浅水潜水天堂，适合所有级别潜水员',
    depth: '15m',
    visibility: '25m',
    temp: '28°C',
    difficulty: '初级',
    marineLife: '小丑鱼、海龟、珊瑚',
    bestSeason: '11月-4月',
    rating: 4.5,
    image: '🏖️',
    features: ['浅水', '珊瑚礁'],
  },
  {
    id: 32,
    name: '纳潘岭礁 (莫阿尔博阿尔)',
    nameEn: 'Napaling Reef',
    location: '菲律宾, 莫阿尔博阿尔',
    lat: 9.95,
    lng: 123.4,
    description: '以陡峭的垂直崖壁和丰富的珊瑚生态闻名',
    depth: '25m',
    visibility: '20m',
    temp: '26°C',
    difficulty: '中级',
    marineLife: '海龟、珊瑚、礁鲨',
    bestSeason: '11月-5月',
    rating: 4.6,
    image: '🪸',
    features: ['垂直崖壁', '珊瑚'],
  },
  // 15. 欧洲
  {
    id: 33,
    name: '滨海自由城',
    nameEn: 'Villefranche-sur-Mer',
    location: '法国, 蔚蓝海岸',
    lat: 43.7,
    lng: 7.3,
    description: '法国蔚蓝海岸的潜水胜地，拥有清澈的地中海海水',
    depth: '20m',
    visibility: '18m',
    temp: '22°C',
    difficulty: '初级-中级',
    marineLife: '海马、海鳗、珊瑚',
    bestSeason: '5月-10月',
    rating: 4.4,
    image: '🏰',
    features: ['地中海', '历史'],
  },
  {
    id: 34,
    name: '辛纳利亚海滩 (克里特岛)',
    nameEn: 'Schinaria Beach (Crete)',
    location: '希腊, 克里特岛',
    lat: 35.0,
    lng: 26.0,
    description: '克里特岛最美丽的潜水海滩，清澈的蓝色海水',
    depth: '18m',
    visibility: '20m',
    temp: '24°C',
    difficulty: '初级',
    marineLife: '海龟、珊瑚、地中海鱼类',
    bestSeason: '5月-10月',
    rating: 4.5,
    image: '🏖️',
    features: ['海滩潜水', '地中海'],
  },
  {
    id: 35,
    name: '卡利姆诺斯岛',
    nameEn: 'Kalymnos',
    location: '希腊, 爱琴海',
    lat: 36.95,
    lng: 27.0,
    description: '爱琴海上的潜水瑰宝，以丰富的海绵和珊瑚闻名',
    depth: '22m',
    visibility: '22m',
    temp: '24°C',
    difficulty: '初级-中级',
    marineLife: '海绵、珊瑚、海马',
    bestSeason: '5月-10月',
    rating: 4.4,
    image: '🏛️',
    features: ['爱琴海', '海绵'],
  },
  // 16. 巴厘岛
  {
    id: 36,
    name: '阿梅德 (巴厘岛)',
    nameEn: 'Amed (Bali)',
    location: '印度尼西亚, 巴厘岛',
    lat: -8.35,
    lng: 115.65,
    description: '巴厘岛东部的潜水天堂，以黑沙和沉船闻名',
    depth: '20m',
    visibility: '18m',
    temp: '27°C',
    difficulty: '初级-中级',
    marineLife: '海龟、小丑鱼、礁鲨',
    bestSeason: '4月-10月',
    rating: 4.5,
    image: '🌋',
    features: ['黑沙潜水', '沉船'],
  },
  {
    id: 37,
    name: '杰梅卢克湾',
    nameEn: 'Jemeluk Bay',
    location: '印度尼西亚, 巴厘岛',
    lat: -8.35,
    lng: 115.65,
    description: '阿梅德最受欢迎的海湾潜点，适合初学者和浮潜',
    depth: '15m',
    visibility: '20m',
    temp: '27°C',
    difficulty: '初级',
    marineLife: '海龟、珊瑚、热带鱼',
    bestSeason: '4月-10月',
    rating: 4.3,
    image: '🌊',
    features: ['海湾潜水', '浮潜'],
  },
  {
    id: 38,
    name: '图兰奔 (巴厘岛)',
    nameEn: 'Tulamben (Bali)',
    location: '印度尼西亚, 巴厘岛',
    lat: -8.3,
    lng: 115.6,
    description: '巴厘岛最著名的岸潜潜点，以USAT自由号沉船闻名',
    depth: '30m',
    visibility: '20m',
    temp: '27°C',
    difficulty: '初级-进阶',
    marineLife: '海龟、礁鲨、拿破仑鱼',
    bestSeason: '4月-10月',
    rating: 4.7,
    image: '🚢',
    features: ['沉船潜水', '岸潜'],
  },
];

export default function MapPage() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const [selectedSite, setSelectedSite] = useState<typeof DIVE_SITES[0] | null>(null);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // 初始化地图
    map.current = L.map(mapContainer.current).setView([20, 0], 2);

    // 添加免费地图图层 - 修复了 attribution
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map.current);

    // 自定义图标
    const defaultIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    // 添加所有标记
    DIVE_SITES.forEach((site) => {
      L.marker([site.lat, site.lng], { icon: defaultIcon })
        .addTo(map.current!)
        .bindPopup(`
          <div class="p-2 max-w-xs">
            <h3 class="font-bold text-base text-slate-800">${site.name}</h3>
            <p class="text-sm text-slate-600">${site.location}</p>
            <p class="text-sm text-cyan-600">⭐ ${site.rating}</p>
          </div>
        `);
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  const flyToSite = (site: typeof DIVE_SITES[0]) => {
    setSelectedSite(site);
    if (map.current) {
      map.current.flyTo([site.lat, site.lng], 10, {
        duration: 1.5,
      });
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      {/* 地图 */}
      <div ref={mapContainer} className="flex-1 relative">
        <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-3 max-w-xs">
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-cyan-600" />
            <span className="text-sm font-medium text-slate-700">
              {DIVE_SITES.length} 个潜水目的地
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">点击地图上的标记查看详情</p>
        </div>
      </div>

      {/* 底部潜点列表 */}
      <div className="bg-white border-t border-gray-200 h-64 overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-slate-700 flex items-center space-x-2">
              <Waves className="h-4 w-4 text-cyan-600" />
              <span>热门潜水目的地</span>
            </h3>
            <span className="text-xs text-gray-400">{DIVE_SITES.length} 个潜点</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {DIVE_SITES.map((site) => (
              <div
                key={site.id}
                className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                  selectedSite?.id === site.id
                    ? 'border-cyan-500 bg-cyan-50'
                    : 'border-gray-200 hover:border-cyan-300'
                }`}
                onClick={() => flyToSite(site)}
              >
                <div className="flex items-start space-x-2">
                  <span className="text-xl">{site.image || '📍'}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm text-slate-700 truncate">
                        {site.name}
                      </p>
                      <div className="flex items-center space-x-1 flex-shrink-0 ml-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                        <span className="text-xs font-medium text-slate-600">{site.rating}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 truncate">{site.location}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex items-center space-x-0.5 text-xs text-gray-400">
                        <span>🌊 {site.depth}</span>
                      </div>
                      <div className="flex items-center space-x-0.5 text-xs text-gray-400">
                        <Eye className="h-3 w-3" />
                        <span>{site.visibility}</span>
                      </div>
                      <div className="flex items-center space-x-0.5 text-xs text-gray-400">
                        <Thermometer className="h-3 w-3" />
                        <span>{site.temp}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}