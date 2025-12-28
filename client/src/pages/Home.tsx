'use client';
import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Pause, Play, Settings, X, ArrowDown, ArrowUp, RefreshCw, Trash2, Cloud, Droplets } from "lucide-react";

// ポジティブな日本語の言葉のみ
const POSITIVE_WORDS = [
  'あなたは素晴らしい', '今この瞬間を楽しもう', '幸運が訪れる', 'できる', 'ありがとう', '大丈夫', 'やれば出来る', '笑顔で過ごそう', '前向きに', 'チャレンジしよう',
  '成功する', '愛される', '幸せ', '感謝', '希望', '心が安らぐ', 'リラックス', '落ち着こう', 'やる気が出る', '元気が出る',
  '明るく', '楽しく', '優しく', '強く', '自信を持とう', '今を生きる', '最高の一日', 'ありのまま', '心配ない', 'うまくいく',
  '信じよう', '輝いている', '素敵', '美しい', '愛してる', '応援してる', '頑張って', 'ファイト', '負けないで', '勇気を出して',
  '一歩ずつ', '焦らないで', 'ゆっくりでいい', '自分らしく', '自分を信じて', '自分を大切に', '自分を愛して', '今日も良い日', '明日はもっと良くなる', 'きっと大丈夫',
  '必ずできる', 'あなたならできる', '可能性は無限', '夢は叶う', '奇跡は起こる', '運が良い', 'ツイてる', 'ラッキー', 'ハッピー', 'ピース',
  'あなたはあなたであればいい', '自分なんかダメだなんて思わない', '他人と比べなくていい', '自分の良さに気づこう', '幸せだと思えることを続けよう', '明けない夜はない',
  'やまない雨はない', '良いことが必ずやってくる', '自分で自分を褒めてあげよう', '今日がよくなかっただけ', '生まれたことに感謝', '自分らしい人生を歩もう', 'その人にしか出せない輝きがある', '自分を信じてあげよう', '自分が持っているものを大切に', '小さな幸せを実感しよう',
  '自分のやりたいようにやってみよう', 'いくつになっても可能性は無限', '過去にとらわれすぎない', '前を向いて進もう', '自分の魅力や才能に自信を持とう', '身体をいたわる時間を作ろう', '当たり前の日々の大切さを感じよう', '普通の幸せのありがたさ', '前に進んでみよう', '新しい景色が見えてくる',
  'ぶれない芯を持とう', '幸せは周りにあふれている', '助けてくれる人が近くにいる', '自分らしさを見失わない', '一人ではない', '支え合って生きている', '心を整える', '自分を好きになる', '心豊かに生きる', '希望を持ち続ける',
  'ありのままの自分を受け入れる', 'ありのままの自分を愛する', '内側から美しく輝く', '一日の始まりを丁寧に', '本当の自分を見つける', '楽しいことに想いをはせる', '感謝の気持ちを持つ', '幸せを実感する', '心を磨く', 'きっと良くなる',
  '生きているだけで価値がある', '前向きに気持ちを向上させる', '心が軽くなる', '自分の心のコップを満たす', '深呼吸しよう', '肩の力を抜こう', '今日生きていることに感謝', 'すべて上手くいっている', '自分は運がいい', '今日もいい日だった',
  'おはよう、素敵な一日を', 'おやすみ、良い夢を', '今日もお疲れ様', 'よく頑張ったね', 'えらいね', 'すごいね', 'さすがだね', '素晴らしい', '最高', '完璧',
  'あなたがいると場が和む', '一緒にいるとポジティブになれる', '癒されるよ', '笑顔が素敵だね', '気が利くよね', '気配りが上手だね', 'キラキラしているね', '行動力があるね', '誰からも好かれるタイプだよね', 'ファッションセンスがいいよね', '勇気があるね',
  '前向きで励みになる', '意見が的確だよね', '集中力があるよね', '話し上手だよね', '聞き上手だよね', '信頼しているよ', '頼りになるよ', '器が大きいね', '存在感があるね', 'センスがあるね',
  '人間味があるね', '手際がいいね', '豪快だね', 'ひとりできたんだね', '今日も元気いっぱいだね', 'お友だちに優しいところが素敵だね', 'お手伝いしてくれて助かったよ、ありがとう', 'ママ（パパ）はあなたのことが正しいと思うよ', 'チャレンジしたことがすごいんだよ', 'よく気づくことができたね',
  'ママ（パパ）はどんなことがあってもあなたを応援するからね', 'あなたがいるだけで幸せだよ', 'やればできるんだね', 'さすがだね', '最後までやり遂げたことがすごいことだよ', '諦めない姿が素敵だよ', 'みんなを元気にしてくれるね', '自分の意見を言えるのはすごいね', '努力しているのは知っているよ', 'すっかり大人になったね',
  '思い切ってやってごらん', 'がんばっているのは知っているからね', '本当に助かっているよ', 'よく気づいてくれるよね', 'がんばりすぎないことも大切だよ', '自分もあなたみたいになりたいです', '本当になんでも知っていますよね',
  '自分を責めないで', '大丈夫、あなたは一人じゃない', 'ゆっくり休んでね', 'あなたのペースでいいよ', '無理しないでね', 'いつもありがとう', '感謝しています', 'あなたの存在が宝物', 'あなたは愛されている', 'あなたは大切な人',
  'あなたの笑顔が世界を救う', 'あなたは光だ', 'あなたは希望だ', 'あなたは奇跡だ', 'あなたは美しい', 'あなたは強い', 'あなたは優しい', 'あなたは賢い', 'あなたは正しい', 'あなたは自由だ',
  'あなたの未来は明るい', 'あなたの可能性は無限大', 'あなたの夢は叶う', 'あなたの願いは届く', 'あなたの心は清らか', 'あなたの魂は輝いている', 'あなたの人生は素晴らしい', 'あなたの選択は間違っていない', 'あなたの決断を信じる', 'あなたの直感を大切に',
  '自分を許すこと', '過去は変えられないが未来は変えられる', '失敗は成功のもと', 'ピンチはチャンス', '困難を乗り越えられる力がある', '試練は成長の機会', '雨のち晴れ', '明けない夜はない', '冬は必ず春となる', '塞翁が馬',
  '一期一会を大切に', '今を生きる', '感謝の気持ちを忘れずに', '愛と光に満たされている', 'すべてはうまくいっている', '宇宙はあなたを応援している', '神様はあなたを見守っている', 'ご先祖様に感謝', '生かされていることに感謝', 'ありがとうの魔法',
  '愛してるの力', '幸せはいつも自分の心が決める', '心が変われば行動が変わる', '行動が変われば習慣が変わる', '習慣が変われば人格が変わる', '人格が変われば運命が変わる', '運命が変われば人生が変わる', '人生は一度きり', '後悔のないように生きる', '自分らしく輝く',
  '自分を大切にする時間', '心と体を休める', '深呼吸でリフレッシュ', '自然の力に癒される', '音楽の力に癒される', 'アートの力に癒される', '読書の力に癒される', '映画の力に癒される', '旅の力に癒される', '食の力に癒される',
  '笑う門には福来る', '病は気から', '健康第一', '笑顔が一番', 'ポジティブ思考', 'ネガティブな感情も大切', '感情を解放する', '泣きたいときは泣けばいい', '怒りたいときは怒ればいい', 'ありのままの自分を表現',
  '他人の評価を気にしない', '自分軸で生きる', '自分の価値は自分で決める', '自分を愛する', '自分を尊重する', '自分を信頼する', '自分を信じる', '自分を許す', '自分を褒める', '自分を励ます',
  'あなたは唯一無二の存在', 'あなたはかけがえのない存在', 'あなたは特別な存在', 'あなたは愛されるために生まれてきた', 'あなたは幸せになるために生まれてきた', 'あなたは夢を叶えるために生まれてきた', 'あなたは使命を果たすために生まれてきた', 'あなたは光を放つ存在', 'あなたは愛の塊', 'あなたは無限の可能性',
  '今日も一日お疲れ様', 'ゆっくり休んでね', '明日も頑張ろう', '無理せず自分のペースで', 'いつも応援しているよ', 'あなたの味方だよ', '困ったらいつでも頼ってね', '一人で抱え込まないで', '一緒に乗り越えよう', '大丈夫、心配ないよ',
  'あなたは強いから大丈夫', 'あなたは乗り越えられる', 'あなたは成長している', 'あなたは進化している', 'あなたは変化している', 'あなたは輝いている', 'あなたは美しい', 'あなたは素敵だ', 'あなたは最高だ', 'あなたは完璧だ',
  'あなたは天才だ', 'あなたは才能に溢れている', 'あなたは創造性に富んでいる', 'あなたはインスピレーションの源', 'あなたは希望の星', 'あなたは未来の光', 'あなたは愛の使者', 'あなたは平和の象徴', 'あなたは幸せの配達人', 'あなたは喜びの種',
];

// グラデーション配色パレット（暗い色を除外、参考サイトから追加）
const GRADIENT_PALETTES = [
  ['#FF6B6B', '#FFE66D'], ['#4ECDC4', '#44A08D'], ['#F38181', '#FFEAA7'],
  ['#74B9FF', '#A29BFE'], ['#FD79A8', '#FDCB6E'], ['#6C5CE7', '#A29BFE'],
  ['#00B894', '#55EFC4'], ['#FF7675', '#FFECB3'], ['#FD79A8', '#FF7675'],
  ['#74B9FF', '#81ECEC'], ['#55EFC4', '#FD79A8'], ['#A29BFE', '#74B9FF'],
  ['#FFEAA7', '#FF7675'], ['#DFE6E9', '#B2BEC3'], ['#F8B500', '#FF6348'],
  ['#eecda3', '#ef629f'], ['#FF9A56', '#FF6A88'], ['#FFB347', '#FFAEC9'],
  ['#96fbc4', '#f9f586'], ['#ffecd2', '#fcb69f'], ['#ff9a56', '#ff6a88'],
  ['#a8edea', '#fed6e3'], ['#ff9a56', '#ff6348'], ['#ffecd2', '#fcb69f'],
  ['#ff6e7f', '#bfe9ff'], ['#ffecd2', '#fcb69f'], ['#a1c4fd', '#c2e9fb'],
];

type ShapeType = 'dot' | 'star' | 'circle' | 'square' | 'heart' | 'snow' | 'thumbsup';

interface FallingWord {
  id: string;
  text: string;
  left: number;
  top: number;
  duration: number;
  fontSize: number;
  color: string;
}

interface Star {
  id: string;
  x: number;
  y: number;
  size: number;
  duration: number;
  shape: ShapeType;
  color?: string;
}

// 言葉を処理する関数
const processWord = (word: string, excludeWords: string[]): string => {
  let processed = word;
  
  // 匿名の名前を「あなた」に変換
  processed = processed.replace(/([◯○])([^◯○]*?)([ちゃんくん])/g, 'あなた');
  
  // 除外ワードをチェック
  for (const excludeWord of excludeWords) {
    if (excludeWord && processed.includes(excludeWord)) {
      return '';
    }
  }
  
  return processed;
};

// 色の補色を計算するヘルパー関数
const getComplementaryColor = (hex: string) => {
  if (!hex.startsWith('#')) return hex;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const compR = (255 - r).toString(16).padStart(2, '0');
  const compG = (255 - g).toString(16).padStart(2, '0');
  const compB = (255 - b).toString(16).padStart(2, '0');
  return `#${compR}${compG}${compB}`;
};

// ランダムなグラデーションペアを生成
const generateRandomGradient = () => {
  const palette = GRADIENT_PALETTES[Math.floor(Math.random() * GRADIENT_PALETTES.length)];
  return palette;
};

// シェイプを描画するコンポーネント
const ShapeRenderer = ({ shape, size, color }: { shape: ShapeType; size: number; color: string }) => {
  switch (shape) {
    case 'dot':
      return <div className="rounded-full" style={{ width: `${size}px`, height: `${size}px`, backgroundColor: color }} />;
    case 'star':
      return (
        <div style={{ fontSize: `${size}px`, color, lineHeight: '1' }}>
          ★
        </div>
      );
    case 'circle':
      return <div className="rounded-full border-2" style={{ width: `${size}px`, height: `${size}px`, borderColor: color }} />;
    case 'square':
      return <div style={{ width: `${size}px`, height: `${size}px`, backgroundColor: color }} />;
    case 'heart':
      return (
        <div style={{ fontSize: `${size}px`, color, lineHeight: '1' }}>
          ❤️
        </div>
      );
    case 'snow':
      return (
        <div style={{ fontSize: `${size}px`, color, lineHeight: '1' }}>
          ❄️
        </div>
      );
    case 'thumbsup':
      return (
        <div style={{ fontSize: `${size}px`, color, lineHeight: '1' }}>
          👍
        </div>
      );
    default:
      return <div className="rounded-full" style={{ width: `${size}px`, height: `${size}px`, backgroundColor: color }} />;
  }
};

export default function Home() {
  const [words, setWords] = useState<FallingWord[]>([]);
  const [stars, setStars] = useState<Star[]>([]);
  const [isFallingWordsVisible, setIsFallingWordsVisible] = useState(false);
  const [isFallingWordsPaused, setIsFallingWordsPaused] = useState(false);
  const [speed, setSpeed] = useState(15000);
  const [frequency, setFrequency] = useState(600);
  const [showSettings, setShowSettings] = useState(false);
  const [wordDirection, setWordDirection] = useState<'down' | 'up'>('down');
  const [wordOpacity, setWordOpacity] = useState(100);
  const [randomSpeed, setRandomSpeed] = useState(false);
  
  // 背景設定
  const [bgGradient, setBgGradient] = useState(['#96fbc4', '#f9f586']);
  const [starfieldVisible, setStarfieldVisible] = useState(false);
  const [meteorShowerVisible, setMeteorShowerVisible] = useState(false);
  const [customBackgroundImage, setCustomBackgroundImage] = useState<string | null>(null);
  const [imageBackgroundVisible, setImageBackgroundVisible] = useState(false);
  
  // 深呼吸設定
  const [breathingVisible, setBreathingVisible] = useState(true);
  const [breathingSpeed, setBreathingSpeed] = useState(10000);
  const [breathingOpacity, setBreathingOpacity] = useState(70);
  const [breathingMinSize, setBreathingMinSize] = useState(50);
  const [breathingMaxSize, setBreathingMaxSize] = useState(400);
  const [guideGradient, setGuideGradient] = useState(['#eecda3', '#ef629f']);
  
  // 深呼吸連動言葉表示設定
  const [breathingSyncWordsVisible, setBreathingSyncWordsVisible] = useState(true);
  const [breathingSyncWordsMode, setBreathingSyncWordsMode] = useState<'breathing' | 'falling'>('breathing');
  const [breathingSyncWord, setBreathingSyncWord] = useState<string>('');
  const [breathingSyncWordSize, setBreathingSyncWordSize] = useState(32);
  const [breathingWordSelectionMode, setBreathingWordSelectionMode] = useState<'random' | 'fixed'>('random');
  const [breathingSyncWordColor, setBreathingSyncWordColor] = useState<'white' | 'black' | 'gray'>('white');
  
  // 星空・流星群設定
  const [starfieldFrequency, setStarfieldFrequency] = useState(50);
  const [starfieldSize, setStarfieldSize] = useState(2);
  const [starfieldSpeed, setStarfieldSpeed] = useState(3);
  const [starfieldShape, setStarfieldShape] = useState<ShapeType>('dot');
  const [meteorFrequency, setMeteorFrequency] = useState(800);
  const [meteorSize, setMeteorSize] = useState(2);
  const [meteorSpeed, setMeteorSpeed] = useState(2);
  const [meteorShape, setMeteorShape] = useState<ShapeType>('dot');
  
  // 除外ワード設定
  const [excludeWords, setExcludeWords] = useState<string[]>([]);
  const [excludeWordInput, setExcludeWordInput] = useState('');

  const wordIdRef = useRef(0);
  const starIdRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const starIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pauseButtonRef = useRef<HTMLButtonElement>(null);

  // 言葉を生成
  const generateWord = (): FallingWord | null => {
    let text = POSITIVE_WORDS[Math.floor(Math.random() * POSITIVE_WORDS.length)];
    text = processWord(text, excludeWords);
    
    if (!text) return null;
    
    if (text.length > 20) text = text.substring(0, 20);
    
    const fontSize = Math.random() * 20 + 16;
    const colors = ['#FF1493', '#FF69B4', '#FFB6C1', '#FF6347', '#4169E1', '#20B2AA'];
    
    const wordSpeed = randomSpeed 
      ? (Math.random() * (30000 - 10000) + 10000) 
      : speed;
    
    // スマホ画面の少し上から降下
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const pauseButtonRect = pauseButtonRef.current?.getBoundingClientRect();
    const pauseButtonY = pauseButtonRect?.bottom || 60;
    
    // 停止ボタンのy軸基準で±100、x軸は-100～1000の範囲（画面内に収まるように調整）
    const minX = Math.max(-100, 0);
    const maxX = Math.min(1000, screenWidth - 50);
    const left = Math.random() * (maxX - minX) + minX;
    
    const minY = Math.max(pauseButtonY - 100, -50);
    const maxY = Math.min(pauseButtonY + 100, screenHeight * 0.3);
    const top = Math.random() * (maxY - minY) + minY;
    
    return {
      id: `word-${wordIdRef.current++}`,
      text,
      left,
      top,
      duration: wordSpeed / 1000,
      fontSize,
      color: colors[Math.floor(Math.random() * colors.length)],
    };
  };

  // 星を生成
  const generateStar = (): Star => {
    const colors = ['#ffffff', '#ffff99', '#ffccff'];
    return {
      id: `star-${starIdRef.current++}`,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: starfieldSize,
      duration: starfieldSpeed,
      shape: starfieldShape,
      color: colors[Math.floor(Math.random() * colors.length)],
    };
  };

  // 流星を生成
  const generateMeteor = (): Star => {
    const colors = ['#ffffff', '#ffff99'];
    return {
      id: `meteor-${starIdRef.current++}`,
      x: Math.random() * window.innerWidth,
      y: -50,
      size: meteorSize,
      duration: meteorSpeed,
      shape: meteorShape,
      color: colors[Math.floor(Math.random() * colors.length)],
    };
  };

  // 言葉を追加するループ
  useEffect(() => {
    if (isFallingWordsPaused || !isFallingWordsVisible) return;

    intervalRef.current = setInterval(() => {
      setWords((prev) => {
        const newWord = generateWord();
        if (!newWord) return prev;
        const newWords = [...prev, newWord];
        return newWords.length > 60 ? newWords.slice(-60) : newWords;
      });
    }, frequency);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [frequency, isFallingWordsPaused, speed, randomSpeed, isFallingWordsVisible, excludeWords]);

  // 星空モード - 常に表示
  useEffect(() => {
    if (!starfieldVisible) {
      setStars([]);
      return;
    }
    
    // 初期星を生成
    const initialStars = Array.from({ length: starfieldFrequency }, () => generateStar());
    setStars(initialStars);
  }, [starfieldVisible, starfieldFrequency, starfieldSize, starfieldSpeed, starfieldShape]);

  // 流星群モード - 常に表示
  useEffect(() => {
    if (!meteorShowerVisible) {
      setStars([]);
      return;
    }

    // 初期流星を生成
    const initialMeteors = Array.from({ length: 5 }, () => generateMeteor());
    setStars(initialMeteors);

    starIntervalRef.current = setInterval(() => {
      setStars((prev) => {
        const newMeteor = generateMeteor();
        const newStars = [...prev, newMeteor];
        return newStars.length > 30 ? newStars.slice(-30) : newStars;
      });
    }, meteorFrequency);

    return () => {
      if (starIntervalRef.current) clearInterval(starIntervalRef.current);
    };
  }, [meteorShowerVisible, meteorFrequency, meteorSize, meteorSpeed, meteorShape]);

  // 深呼吸連動言葉の初期化とランダム更新
  useEffect(() => {
    if (!breathingSyncWordsVisible || breathingWordSelectionMode !== 'random') return;

    const updateWord = () => {
      let word = POSITIVE_WORDS[Math.floor(Math.random() * POSITIVE_WORDS.length)];
      word = processWord(word, excludeWords);
      if (word) {
        setBreathingSyncWord(word);
      }
    };

    updateWord();
    const interval = setInterval(updateWord, breathingSpeed);
    return () => clearInterval(interval);
  }, [breathingSyncWordsVisible, breathingWordSelectionMode, breathingSpeed, excludeWords]);

  // 深呼吸アニメーション用のスケール計算
  const breathingScale = useMemo(() => {
    return (
      Math.sin((Date.now() % breathingSpeed) / breathingSpeed * Math.PI * 2) * 
      ((breathingMaxSize - breathingMinSize) / 2) / 100 + 1
    );
  }, [breathingSpeed, breathingMaxSize, breathingMinSize]);

  // 深呼吸連動言葉のフォントサイズ自動調整
  const autoFontSize = useMemo(() => {
    const maxWidth = (breathingMaxSize * breathingScale) * 0.8;
    const charWidth = maxWidth / 10;
    const lineHeight = charWidth * 1.2;
    return Math.min(charWidth, lineHeight);
  }, [breathingMaxSize, breathingScale]);

  // 深呼吸連動言葉の改行処理（1行10文字）
  const formattedBreathingWord = useMemo(() => {
    if (!breathingSyncWord) return '';
    const lines: string[] = [];
    for (let i = 0; i < breathingSyncWord.length; i += 10) {
      lines.push(breathingSyncWord.substring(i, i + 10));
    }
    return lines.slice(0, 2).join('\n'); // 2行までに制限
  }, [breathingSyncWord]);

  // 深呼吸連動言葉の色を取得
  const getBreathingSyncWordColor = (): string => {
    switch (breathingSyncWordColor) {
      case 'white':
        return '#ffffff';
      case 'black':
        return '#000000';
      case 'gray':
        return '#808080';
      default:
        return '#ffffff';
    }
  };

  const handleRandomizeBackground = () => {
    const newGradient = generateRandomGradient();
    setBgGradient(newGradient);
  };

  const handleRandomizeGuideGradient = () => {
    const newGradient = generateRandomGradient();
    setGuideGradient(newGradient);
  };

  const handleRandomizeStarfield = () => {
    setStarfieldFrequency(Math.floor(Math.random() * 150) + 20);
    setStarfieldSize(Math.floor(Math.random() * 8) + 1);
    setStarfieldSpeed(Math.floor(Math.random() * 4) + 1);
    const shapes: ShapeType[] = ['dot', 'star', 'circle', 'square', 'heart', 'snow', 'thumbsup'];
    setStarfieldShape(shapes[Math.floor(Math.random() * shapes.length)]);
  };

  const handleRandomizeMeteor = () => {
    setMeteorFrequency(Math.floor(Math.random() * 700) + 300);
    setMeteorSize(Math.floor(Math.random() * 8) + 1);
    setMeteorSpeed(Math.floor(Math.random() * 3) + 1);
    const shapes: ShapeType[] = ['dot', 'star', 'circle', 'square', 'heart', 'snow', 'thumbsup'];
    setMeteorShape(shapes[Math.floor(Math.random() * shapes.length)]);
  };

  const handleAddExcludeWord = () => {
    if (excludeWordInput.trim()) {
      setExcludeWords([...excludeWords, excludeWordInput.trim()]);
      setExcludeWordInput('');
    }
  };

  const handleRemoveExcludeWord = (index: number) => {
    setExcludeWords(excludeWords.filter((_, i) => i !== index));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCustomBackgroundImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{
        background: imageBackgroundVisible && customBackgroundImage
          ? `url(${customBackgroundImage})`
          : `linear-gradient(135deg, ${bgGradient[0]} 0%, ${bgGradient[1]} 100%)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* 星空モード */}
      {starfieldVisible && !meteorShowerVisible && (
        <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 10 }}>
          <AnimatePresence>
            {stars.map((star) => (
              <motion.div
                key={star.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: star.duration, repeat: Infinity }}
                className="absolute"
                style={{
                  left: `${star.x}px`,
                  top: `${star.y}px`,
                }}
              >
                <ShapeRenderer shape={star.shape} size={star.size} color={star.color || '#ffffff'} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* 流星群モード */}
      {meteorShowerVisible && !starfieldVisible && (
        <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 10 }}>
          <AnimatePresence>
            {stars.map((star) => (
              <motion.div
                key={star.id}
                initial={{ y: -50, opacity: 1 }}
                animate={{ y: window.innerHeight + 50, opacity: 0 }}
                transition={{ duration: star.duration }}
                className="absolute"
                style={{
                  left: `${star.x}px`,
                }}
              >
                <ShapeRenderer shape={star.shape} size={star.size} color={star.color || '#ffffff'} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* 言葉が降る */}
      {isFallingWordsVisible && (
        <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 20 }}>
          <AnimatePresence>
            {words.map((word) => (
              <motion.div
                key={word.id}
                initial={{
                  y: word.top,
                  x: word.left,
                  opacity: wordOpacity / 100,
                }}
                animate={{
                  y: wordDirection === 'down' ? window.innerHeight + 100 : -100,
                }}
                transition={{
                  duration: word.duration,
                  ease: 'linear',
                }}
                className="absolute whitespace-nowrap"
                style={{
                  fontSize: `${word.fontSize}px`,
                  color: word.color,
                  fontWeight: 'bold',
                  maxWidth: '200px',
                  wordWrap: 'break-word',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {word.text}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* 深呼吸ガイド */}
      {breathingVisible && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 15 }}>
          <motion.div
            animate={{
              scale: breathingScale,
            }}
            transition={{
              duration: breathingSpeed / 1000,
              ease: 'easeInOut',
              repeat: Infinity,
            }}
            className="rounded-full flex items-center justify-center"
            style={{
              width: `${breathingMaxSize}px`,
              height: `${breathingMaxSize}px`,
              background: `linear-gradient(135deg, ${guideGradient[0]} 0%, ${guideGradient[1]} 100%)`,
              opacity: breathingOpacity / 100,
            }}
          >
            {/* 深呼吸連動言葉 */}
            {breathingSyncWordsVisible && formattedBreathingWord && (
              <motion.div
                animate={{
                  scale: breathingScale,
                }}
                transition={{
                  duration: breathingSpeed / 1000,
                  ease: 'easeInOut',
                  repeat: Infinity,
                }}
                className="text-center px-4"
                style={{
                  fontSize: `${autoFontSize}px`,
                  color: getBreathingSyncWordColor(),
                  fontWeight: 'bold',
                  lineHeight: '1.3',
                  whiteSpace: 'pre-wrap',
                  maxWidth: '90%',
                }}
              >
                {formattedBreathingWord}
              </motion.div>
            )}
          </motion.div>
        </div>
      )}

      {/* コントロールパネル */}
      <div className="fixed top-4 left-4 right-4 z-30 flex gap-2">
        <button
          ref={pauseButtonRef}
          onClick={() => setIsFallingWordsVisible(!isFallingWordsVisible)}
          className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          {isFallingWordsVisible ? '言葉停止' : '言葉開始'}
        </button>
        <button
          onClick={() => setIsFallingWordsPaused(!isFallingWordsPaused)}
          disabled={!isFallingWordsVisible}
          className="p-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition disabled:opacity-50"
        >
          {isFallingWordsPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
        </button>
        <button
          onClick={handleRandomizeBackground}
          className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        >
          背景ランダム
        </button>
        <button
          onClick={handleRandomizeGuideGradient}
          className="p-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition"
        >
          ガイド色
        </button>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* 背景モード切り替え */}
      <div className="fixed top-16 left-4 z-30 flex gap-2">
        <button
          onClick={() => {
            setStarfieldVisible(!starfieldVisible);
            setMeteorShowerVisible(false);
          }}
          className={`p-2 rounded-lg transition ${starfieldVisible ? 'bg-yellow-500' : 'bg-gray-400'} text-white`}
        >
          星空
        </button>
        <button
          onClick={() => {
            setMeteorShowerVisible(!meteorShowerVisible);
            setStarfieldVisible(false);
          }}
          className={`p-2 rounded-lg transition ${meteorShowerVisible ? 'bg-yellow-500' : 'bg-gray-400'} text-white`}
        >
          流星群
        </button>
        <button
          onClick={() => setImageBackgroundVisible(!imageBackgroundVisible)}
          className={`p-2 rounded-lg transition ${imageBackgroundVisible ? 'bg-yellow-500' : 'bg-gray-400'} text-white`}
        >
          画像
        </button>
      </div>

      {/* 設定パネル */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">設定</h2>
              <button onClick={() => setShowSettings(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-6 h-6" />
              </button>
            </div>

            <Tabs defaultValue="falling" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="falling">言葉が降る</TabsTrigger>
                <TabsTrigger value="breathing">深呼吸</TabsTrigger>
                <TabsTrigger value="background">背景</TabsTrigger>
                <TabsTrigger value="exclude">除外</TabsTrigger>
              </TabsList>

              {/* 言葉が降る設定 */}
              <TabsContent value="falling" className="space-y-4">
                <div>
                  <Label>速度: {speed}ms</Label>
                  <Slider value={[speed]} onValueChange={(v) => setSpeed(v[0])} min={5000} max={30000} step={1000} />
                </div>
                <div>
                  <Label>出現頻度: {frequency}ms</Label>
                  <Slider value={[frequency]} onValueChange={(v) => setFrequency(v[0])} min={100} max={2000} step={100} />
                </div>
                <div>
                  <Label>透明度: {wordOpacity}%</Label>
                  <Slider value={[wordOpacity]} onValueChange={(v) => setWordOpacity(v[0])} min={0} max={100} step={10} />
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={randomSpeed} onCheckedChange={setRandomSpeed} />
                  <Label>ランダム速度</Label>
                </div>
                <div>
                  <Label>方向</Label>
                  <div className="flex gap-2">
                    <Button
                      variant={wordDirection === 'down' ? 'default' : 'outline'}
                      onClick={() => setWordDirection('down')}
                      className="flex-1"
                    >
                      <ArrowDown className="w-4 h-4 mr-2" />
                      下
                    </Button>
                    <Button
                      variant={wordDirection === 'up' ? 'default' : 'outline'}
                      onClick={() => setWordDirection('up')}
                      className="flex-1"
                    >
                      <ArrowUp className="w-4 h-4 mr-2" />
                      上
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {/* 深呼吸設定 */}
              <TabsContent value="breathing" className="space-y-4">
                <div className="flex items-center gap-2">
                  <Switch checked={breathingVisible} onCheckedChange={setBreathingVisible} />
                  <Label>深呼吸ガイド表示</Label>
                </div>
                <div>
                  <Label>速度: {breathingSpeed}ms</Label>
                  <Slider value={[breathingSpeed]} onValueChange={(v) => setBreathingSpeed(v[0])} min={3000} max={20000} step={1000} />
                </div>
                <div>
                  <Label>最小サイズ: {breathingMinSize}px</Label>
                  <Slider value={[breathingMinSize]} onValueChange={(v) => setBreathingMinSize(v[0])} min={30} max={200} step={10} />
                </div>
                <div>
                  <Label>最大サイズ: {breathingMaxSize}px</Label>
                  <Slider value={[breathingMaxSize]} onValueChange={(v) => setBreathingMaxSize(v[0])} min={200} max={500} step={10} />
                </div>
                <div>
                  <Label>透明度: {breathingOpacity}%</Label>
                  <Slider value={[breathingOpacity]} onValueChange={(v) => setBreathingOpacity(v[0])} min={0} max={100} step={10} />
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={breathingSyncWordsVisible} onCheckedChange={setBreathingSyncWordsVisible} />
                  <Label>言葉を表示</Label>
                </div>
                <div>
                  <Label>言葉の選択</Label>
                  <div className="flex gap-2">
                    <Button
                      variant={breathingWordSelectionMode === 'random' ? 'default' : 'outline'}
                      onClick={() => setBreathingWordSelectionMode('random')}
                      className="flex-1"
                    >
                      ランダム
                    </Button>
                    <Button
                      variant={breathingWordSelectionMode === 'fixed' ? 'default' : 'outline'}
                      onClick={() => setBreathingWordSelectionMode('fixed')}
                      className="flex-1"
                    >
                      言葉を固定
                    </Button>
                  </div>
                </div>
                <div>
                  <Label>文字色</Label>
                  <div className="flex gap-2">
                    {(['white', 'black', 'gray'] as const).map((color) => (
                      <Button
                        key={color}
                        variant={breathingSyncWordColor === color ? 'default' : 'outline'}
                        onClick={() => setBreathingSyncWordColor(color)}
                        className="flex-1"
                      >
                        {color === 'white' ? '白' : color === 'black' ? '黒' : 'グレー'}
                      </Button>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* 背景設定 */}
              <TabsContent value="background" className="space-y-4">
                <div>
                  <Label>星空設定</Label>
                  <div className="space-y-2 mt-2">
                    <div>
                      <Label>出現頻度: {starfieldFrequency}</Label>
                      <Slider value={[starfieldFrequency]} onValueChange={(v) => setStarfieldFrequency(v[0])} min={10} max={200} step={10} />
                    </div>
                    <div>
                      <Label>大きさ: {starfieldSize}px</Label>
                      <Slider value={[starfieldSize]} onValueChange={(v) => setStarfieldSize(v[0])} min={1} max={10} step={1} />
                    </div>
                    <div>
                      <Label>速度: {starfieldSpeed}s</Label>
                      <Slider value={[starfieldSpeed]} onValueChange={(v) => setStarfieldSpeed(v[0])} min={1} max={10} step={1} />
                    </div>
                    <div>
                      <Label>シェイプ</Label>
                      <select
                        value={starfieldShape}
                        onChange={(e) => setStarfieldShape(e.target.value as ShapeType)}
                        className="w-full p-2 border rounded"
                      >
                        <option value="dot">点(・)</option>
                        <option value="star">星型</option>
                        <option value="circle">丸</option>
                        <option value="square">四角</option>
                        <option value="heart">❤️</option>
                        <option value="snow">❄️</option>
                        <option value="thumbsup">👍</option>
                      </select>
                    </div>
                    <Button onClick={handleRandomizeStarfield} className="w-full">ランダム設定</Button>
                  </div>
                </div>

                <div>
                  <Label>流星群設定</Label>
                  <div className="space-y-2 mt-2">
                    <div>
                      <Label>出現頻度: {meteorFrequency}ms</Label>
                      <Slider value={[meteorFrequency]} onValueChange={(v) => setMeteorFrequency(v[0])} min={200} max={2000} step={100} />
                    </div>
                    <div>
                      <Label>大きさ: {meteorSize}px</Label>
                      <Slider value={[meteorSize]} onValueChange={(v) => setMeteorSize(v[0])} min={1} max={10} step={1} />
                    </div>
                    <div>
                      <Label>速度: {meteorSpeed}s</Label>
                      <Slider value={[meteorSpeed]} onValueChange={(v) => setMeteorSpeed(v[0])} min={1} max={10} step={1} />
                    </div>
                    <div>
                      <Label>シェイプ</Label>
                      <select
                        value={meteorShape}
                        onChange={(e) => setMeteorShape(e.target.value as ShapeType)}
                        className="w-full p-2 border rounded"
                      >
                        <option value="dot">点(・)</option>
                        <option value="star">星型</option>
                        <option value="circle">丸</option>
                        <option value="square">四角</option>
                        <option value="heart">❤️</option>
                        <option value="snow">❄️</option>
                        <option value="thumbsup">👍</option>
                      </select>
                    </div>
                    <Button onClick={handleRandomizeMeteor} className="w-full">ランダム設定</Button>
                  </div>
                </div>

                <div>
                  <Label>画像背景</Label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </TabsContent>

              {/* 除外ワード設定 */}
              <TabsContent value="exclude" className="space-y-4">
                <div>
                  <Label>除外ワードを追加</Label>
                  <div className="flex gap-2 mt-2">
                    <input
                      type="text"
                      value={excludeWordInput}
                      onChange={(e) => setExcludeWordInput(e.target.value)}
                      placeholder="除外する言葉を入力"
                      className="flex-1 p-2 border rounded"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddExcludeWord()}
                    />
                    <Button onClick={handleAddExcludeWord}>追加</Button>
                  </div>
                </div>
                <div>
                  <Label>除外ワード一覧</Label>
                  <div className="space-y-2 mt-2">
                    {excludeWords.map((word, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                        <span>{word}</span>
                        <button
                          onClick={() => handleRemoveExcludeWord(index)}
                          className="p-1 hover:bg-red-200 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}
    </div>
  );
}
