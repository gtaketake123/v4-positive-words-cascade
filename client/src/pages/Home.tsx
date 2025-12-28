'use client';
import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Pause, Play, Settings, X, ArrowDown, ArrowUp, RefreshCw, Trash2 } from "lucide-react";

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

// グラデーション配色パレット（暗い色を除外）
const GRADIENT_PALETTES = [
  ['#FF6B6B', '#FFE66D'], ['#4ECDC4', '#44A08D'], ['#F38181', '#FFEAA7'],
  ['#74B9FF', '#A29BFE'], ['#FD79A8', '#FDCB6E'], ['#6C5CE7', '#A29BFE'],
  ['#00B894', '#55EFC4'], ['#FF7675', '#FFECB3'], ['#FD79A8', '#FF7675'],
  ['#74B9FF', '#81ECEC'], ['#55EFC4', '#FD79A8'], ['#A29BFE', '#74B9FF'],
  ['#FFEAA7', '#FF7675'], ['#DFE6E9', '#B2BEC3'], ['#F8B500', '#FF6348'],
  ['#eecda3', '#ef629f'], ['#FF9A56', '#FF6A88'], ['#FFB347', '#FFAEC9'],
];

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

export default function Home() {
  const [words, setWords] = useState<FallingWord[]>([]);
  const [stars, setStars] = useState<Star[]>([]);
  const [isFallingWordsPaused, setIsFallingWordsPaused] = useState(false);
  const [speed, setSpeed] = useState(15000);
  const [frequency, setFrequency] = useState(600);
  const [showSettings, setShowSettings] = useState(false);
  const [wordDirection, setWordDirection] = useState<'down' | 'up'>('down');
  const [wordOpacity, setWordOpacity] = useState(100);
  const [randomSpeed, setRandomSpeed] = useState(false);
  const [fallingWordsVisible, setFallingWordsVisible] = useState(true);
  
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
    
    // 停止ボタンの位置を基準に計算
    const pauseButtonRect = pauseButtonRef.current?.getBoundingClientRect();
    const pauseY = pauseButtonRect?.top ?? 50;
    const pauseX = pauseButtonRect?.left ?? 50;
    
    // y軸：停止ボタンから上下100の範囲
    const topRange = Math.random() * 200 - 100; // -100 to 100
    const top = pauseY + topRange;
    
    // x軸：停止ボタンから左右-100～1000の範囲
    const leftRange = Math.random() * 1100 - 100; // -100 to 1000
    const left = pauseX + leftRange;
    
    return {
      id: `word-${wordIdRef.current++}`,
      text,
      left: Math.max(0, Math.min(left, window.innerWidth - 100)),
      top: Math.max(0, top),
      duration: wordSpeed / 1000,
      fontSize,
      color: colors[Math.floor(Math.random() * colors.length)],
    };
  };

  // 星を生成
  const generateStar = (): Star => {
    return {
      id: `star-${starIdRef.current++}`,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 3 + 2,
    };
  };

  // 流星を生成
  const generateMeteor = (): Star => {
    return {
      id: `meteor-${starIdRef.current++}`,
      x: Math.random() * window.innerWidth,
      y: -50,
      size: Math.random() * 2 + 0.5,
      duration: Math.random() * 2 + 1,
    };
  };

  // 言葉を追加するループ
  useEffect(() => {
    if (isFallingWordsPaused || !fallingWordsVisible || breathingSyncWordsMode === 'breathing') return;

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
  }, [frequency, isFallingWordsPaused, speed, randomSpeed, breathingSyncWordsMode, fallingWordsVisible, excludeWords]);

  // 星空モード
  useEffect(() => {
    if (!starfieldVisible) return;
    
    setStars(Array.from({ length: 50 }, () => generateStar()));
  }, [starfieldVisible]);

  // 流星群モード
  useEffect(() => {
    if (!meteorShowerVisible) return;

    starIntervalRef.current = setInterval(() => {
      setStars((prev) => {
        const newMeteor = generateMeteor();
        const newStars = [...prev, newMeteor];
        return newStars.length > 30 ? newStars.slice(-30) : newStars;
      });
    }, 800);

    return () => {
      if (starIntervalRef.current) clearInterval(starIntervalRef.current);
    };
  }, [meteorShowerVisible]);

  // 深呼吸連動言葉の初期化とランダム更新
  useEffect(() => {
    if (breathingSyncWordsVisible && breathingSyncWordsMode === 'breathing') {
      if (breathingWordSelectionMode === 'random') {
        const updateWord = () => {
          let randomWord = POSITIVE_WORDS[Math.floor(Math.random() * POSITIVE_WORDS.length)];
          randomWord = processWord(randomWord, excludeWords);
          if (randomWord) setBreathingSyncWord(randomWord);
        };
        updateWord();
        const interval = setInterval(updateWord, breathingSpeed);
        return () => clearInterval(interval);
      } else if (!breathingSyncWord) {
        setBreathingSyncWord(POSITIVE_WORDS[0]);
      }
    }
  }, [breathingSyncWordsVisible, breathingSyncWordsMode, breathingWordSelectionMode, breathingSpeed, excludeWords]);

  const removeWord = (id: string) => {
    setWords((prev) => prev.filter((w) => w.id !== id));
  };

  const removeStar = (id: string) => {
    setStars((prev) => prev.filter((s) => s.id !== id));
  };

  // 深呼吸ガイドの反対色を計算（文字色用）
  const breathingSyncWordColor = useMemo(() => {
    return getComplementaryColor(guideGradient[0]);
  }, [guideGradient]);

  // フォントサイズを自動調整
  const autoFontSize = useMemo(() => {
    const maxSize = breathingMaxSize / 2;
    return Math.min(breathingSyncWordSize, maxSize);
  }, [breathingSyncWordSize, breathingMaxSize]);

  const handleRandomizeBackgroundGradient = () => {
    const gradient = generateRandomGradient();
    setBgGradient(gradient);
  };

  const handleRandomizeGuideGradient = () => {
    const gradient = generateRandomGradient();
    setGuideGradient(gradient);
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

  const handleAddExcludeWord = () => {
    if (excludeWordInput.trim()) {
      setExcludeWords([...excludeWords, excludeWordInput.trim()]);
      setExcludeWordInput('');
    }
  };

  const handleRemoveExcludeWord = (index: number) => {
    setExcludeWords(excludeWords.filter((_, i) => i !== index));
  };

  const getBackgroundStyle = () => {
    if (imageBackgroundVisible && customBackgroundImage) {
      return {
        backgroundImage: `url(${customBackgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };
    }
    return {
      background: `linear-gradient(135deg, ${bgGradient[0]}, ${bgGradient[1]})`,
    };
  };

  return (
    <div 
      className="relative w-full h-screen overflow-hidden transition-all duration-1000"
      style={getBackgroundStyle()}
    >
      {/* 星空モード */}
      {starfieldVisible && (
        <div className="fixed inset-0 pointer-events-none z-0">
          {stars.map((star) => (
            <motion.div
              key={star.id}
              className="absolute rounded-full bg-white"
              style={{
                left: `${(star.x / window.innerWidth) * 100}%`,
                top: `${(star.y / window.innerHeight) * 100}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
              }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: star.duration, repeat: Infinity }}
            />
          ))}
        </div>
      )}

      {/* 流星群モード */}
      {meteorShowerVisible && (
        <AnimatePresence>
          {stars.map((star) => (
            <motion.div
              key={star.id}
              className="fixed rounded-full bg-white pointer-events-none z-0"
              style={{
                left: `${star.x}px`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                boxShadow: '0 0 10px rgba(255,255,255,0.8)',
              }}
              initial={{ y: star.y, opacity: 1 }}
              animate={{ y: window.innerHeight + 100, opacity: 0 }}
              transition={{ duration: star.duration, ease: 'linear' }}
              onAnimationComplete={() => removeStar(star.id)}
            />
          ))}
        </AnimatePresence>
      )}

      {/* 降ってくる言葉 */}
      {fallingWordsVisible && breathingSyncWordsMode === 'falling' && (
        <AnimatePresence>
          {words.map((word) => (
            <motion.div
              key={word.id}
              className="absolute font-semibold select-none pointer-events-none"
              style={{
                left: `${word.left}px`,
                fontSize: `${word.fontSize}px`,
                color: word.color,
                opacity: wordOpacity / 100,
                textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                zIndex: 5,
                maxWidth: '200px',
                wordWrap: 'break-word',
                whiteSpace: 'normal',
                lineHeight: '1.2',
              }}
              initial={{ y: wordDirection === 'down' ? -50 : '110vh' }}
              animate={{ y: wordDirection === 'down' ? '110vh' : -100 }}
              transition={{ duration: word.duration, ease: 'linear' }}
              onAnimationComplete={() => removeWord(word.id)}
            >
              {word.text}
            </motion.div>
          ))}
        </AnimatePresence>
      )}

      {/* 深呼吸ガイドと言葉の連動 */}
      {breathingVisible && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-10">
          <motion.div
            className="rounded-full shadow-lg flex items-center justify-center overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${guideGradient[0]}, ${guideGradient[1]})`,
              opacity: breathingOpacity / 100,
            }}
            animate={{ 
              width: [breathingMinSize, breathingMaxSize, breathingMinSize],
              height: [breathingMinSize, breathingMaxSize, breathingMinSize],
            }}
            transition={{ 
              duration: breathingSpeed / 1000, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {breathingSyncWordsVisible && breathingSyncWordsMode === 'breathing' && (
              <motion.div
                className="font-bold select-none text-center px-4"
                style={{
                  color: breathingSyncWordColor,
                  fontSize: `${autoFontSize}px`,
                  textShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}
                animate={{ 
                  scale: [breathingMinSize / breathingMaxSize, 1, breathingMinSize / breathingMaxSize],
                  opacity: [0, 1, 0],
                }}
                transition={{ 
                  duration: breathingSpeed / 1000, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {breathingSyncWord}
              </motion.div>
            )}
          </motion.div>
        </div>
      )}

      {/* コントロールボタン */}
      <div className="fixed top-6 left-6 z-50 flex gap-2">
        <Button
          ref={pauseButtonRef}
          variant="secondary"
          size="icon"
          className="w-12 h-12 rounded-xl shadow-md bg-white/90 hover:bg-white text-slate-900"
          onClick={() => setIsFallingWordsPaused(!isFallingWordsPaused)}
          title="言葉が降るのみ停止/再生"
        >
          {isFallingWordsPaused ? <Play size={20} /> : <Pause size={20} />}
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="w-12 h-12 rounded-xl shadow-md bg-white/90 hover:bg-white text-slate-900"
          onClick={handleRandomizeBackgroundGradient}
          title="背景色をランダムに変更"
        >
          <RefreshCw size={20} />
        </Button>
      </div>

      <div className="fixed top-6 right-6 z-50">
        <Button
          variant="secondary"
          size="icon"
          className="w-12 h-12 rounded-xl shadow-md bg-white/90 hover:bg-white text-slate-900"
          onClick={() => setShowSettings(true)}
        >
          <Settings size={20} />
        </Button>
      </div>

      {/* 設定パネル */}
      <AnimatePresence>
        {showSettings && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100]"
              onClick={() => setShowSettings(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 w-full max-w-md h-full bg-slate-50 shadow-2xl z-[101] flex flex-col overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 bg-white border-b">
                <h2 className="text-lg font-bold text-slate-900">設定</h2>
                <Button variant="ghost" size="icon" onClick={() => setShowSettings(false)}>
                  <X size={24} />
                </Button>
              </div>

              <Tabs defaultValue="words" className="flex-1 flex flex-col overflow-hidden">
                <TabsList className="grid grid-cols-3 w-full bg-white border-b rounded-none h-14">
                  <TabsTrigger value="words" className="rounded-none text-xs">文字</TabsTrigger>
                  <TabsTrigger value="background" className="rounded-none text-xs">背景</TabsTrigger>
                  <TabsTrigger value="breathing" className="rounded-none text-xs">深呼吸</TabsTrigger>
                </TabsList>

                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                  <TabsContent value="words" className="space-y-8 mt-0">
                    {/* 深呼吸と連動 */}
                    <div className="border-b pb-8">
                      <h3 className="text-sm font-bold text-slate-900 mb-4">深呼吸と連動</h3>
                      
                      <div className="flex items-center justify-between mb-4">
                        <Label className="text-sm font-semibold text-slate-700">表示</Label>
                        <Switch checked={breathingSyncWordsVisible} onCheckedChange={setBreathingSyncWordsVisible} />
                      </div>

                      {breathingSyncWordsVisible && (
                        <div className="space-y-6">
                          <div className="space-y-4">
                            <Label className="text-sm font-semibold text-slate-700">モード切り替え</Label>
                            <div className="grid grid-cols-2 gap-3">
                              <button
                                onClick={() => setBreathingWordSelectionMode('random')}
                                className={`h-10 rounded-lg text-sm font-semibold transition-all ${
                                  breathingWordSelectionMode === 'random'
                                    ? 'bg-slate-800 text-white'
                                    : 'bg-white text-slate-700 border border-slate-200'
                                }`}
                              >
                                ランダム
                              </button>
                              <button
                                onClick={() => setBreathingWordSelectionMode('fixed')}
                                className={`h-10 rounded-lg text-sm font-semibold transition-all ${
                                  breathingWordSelectionMode === 'fixed'
                                    ? 'bg-slate-800 text-white'
                                    : 'bg-white text-slate-700 border border-slate-200'
                                }`}
                              >
                                言葉を固定
                              </button>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <Label className="text-sm font-semibold text-slate-700">現在の言葉</Label>
                            <div className="p-4 bg-white border rounded-xl text-center text-slate-700 font-semibold">
                              {breathingSyncWord}
                            </div>
                            <Button 
                              className="w-full h-12 rounded-xl"
                              onClick={() => {
                                let randomWord = POSITIVE_WORDS[Math.floor(Math.random() * POSITIVE_WORDS.length)];
                                randomWord = processWord(randomWord, excludeWords);
                                if (randomWord) setBreathingSyncWord(randomWord);
                              }}
                            >
                              言葉を変更
                            </Button>
                          </div>

                          <div className="space-y-4">
                            <Label className="text-sm font-semibold text-slate-700">文字サイズ ({autoFontSize}px)</Label>
                            <Slider 
                              value={[breathingSyncWordSize]} 
                              min={16} 
                              max={64} 
                              step={2} 
                              onValueChange={(val) => setBreathingSyncWordSize(val[0])} 
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 言葉が降る */}
                    <div className="border-b pb-8">
                      <div className="flex items-center justify-between mb-4">
                        <Label className="text-sm font-bold text-slate-900">言葉が降る</Label>
                        <Switch checked={fallingWordsVisible} onCheckedChange={setFallingWordsVisible} />
                      </div>

                      {fallingWordsVisible && (
                        <div className="space-y-6">
                          <div className="space-y-4">
                            <Label className="text-sm font-semibold text-slate-700">速度 ({(speed / 1000).toFixed(1)}秒)</Label>
                            <Slider 
                              value={[speed]} 
                              min={10000} 
                              max={30000} 
                              step={1000} 
                              onValueChange={(val) => setSpeed(val[0])} 
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <Label className="text-sm font-semibold text-slate-700">ランダム速度 (10-30秒)</Label>
                            <Switch checked={randomSpeed} onCheckedChange={setRandomSpeed} />
                          </div>

                          <div className="space-y-4">
                            <Label className="text-sm font-semibold text-slate-700">降下方向</Label>
                            <div className="grid grid-cols-2 gap-3">
                              <Button 
                                variant={wordDirection === 'down' ? 'default' : 'outline'} 
                                className="w-full h-12 rounded-xl"
                                onClick={() => setWordDirection('down')}
                              >
                                <ArrowDown size={16} className="mr-2" /> 上から下
                              </Button>
                              <Button 
                                variant={wordDirection === 'up' ? 'default' : 'outline'} 
                                className="w-full h-12 rounded-xl"
                                onClick={() => setWordDirection('up')}
                              >
                                <ArrowUp size={16} className="mr-2" /> 下から上
                              </Button>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <Label className="text-sm font-semibold text-slate-700">文字の透明度 ({wordOpacity}%)</Label>
                            <Slider 
                              value={[wordOpacity]} 
                              min={0} 
                              max={100} 
                              onValueChange={(val) => setWordOpacity(val[0])} 
                            />
                          </div>

                          <div className="space-y-4">
                            <Label className="text-sm font-semibold text-slate-700">頻度 ({frequency}ms)</Label>
                            <Slider 
                              value={[frequency]} 
                              min={100} 
                              max={1000} 
                              step={50}
                              onValueChange={(val) => setFrequency(val[0])} 
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 除外ワード設定 */}
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 mb-4">除外ワード設定</h3>
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={excludeWordInput}
                            onChange={(e) => setExcludeWordInput(e.target.value)}
                            placeholder="除外する言葉を入力"
                            className="flex-1 px-3 py-2 border rounded-lg text-sm"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') handleAddExcludeWord();
                            }}
                          />
                          <Button 
                            className="h-10 rounded-lg"
                            onClick={handleAddExcludeWord}
                          >
                            追加
                          </Button>
                        </div>
                        <div className="space-y-2">
                          {excludeWords.map((word, idx) => (
                            <div key={idx} className="flex items-center justify-between bg-white p-2 rounded-lg">
                              <span className="text-sm text-slate-700">{word}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => handleRemoveExcludeWord(idx)}
                              >
                                <Trash2 size={14} />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="background" className="space-y-8 mt-0">
                    {/* グラデーション */}
                    <div className="space-y-4">
                      <Label className="text-sm font-bold text-slate-900">背景グラデーション</Label>
                      <div className="grid grid-cols-2 gap-3">
                        <input 
                          type="color" 
                          value={bgGradient[0]} 
                          onChange={(e) => setBgGradient([e.target.value, bgGradient[1]])}
                          className="w-full h-12 rounded-xl cursor-pointer"
                        />
                        <input 
                          type="color" 
                          value={bgGradient[1]} 
                          onChange={(e) => setBgGradient([bgGradient[0], e.target.value])}
                          className="w-full h-12 rounded-xl cursor-pointer"
                        />
                      </div>
                      <Button className="w-full" onClick={handleRandomizeBackgroundGradient}>
                        ランダムに変更
                      </Button>
                    </div>

                    {/* 星空 */}
                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between mb-4">
                        <Label className="text-sm font-semibold text-slate-700">星空</Label>
                        <Switch checked={starfieldVisible} onCheckedChange={setStarfieldVisible} />
                      </div>
                    </div>

                    {/* 流星群 */}
                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between mb-4">
                        <Label className="text-sm font-semibold text-slate-700">流星群</Label>
                        <Switch checked={meteorShowerVisible} onCheckedChange={setMeteorShowerVisible} />
                      </div>
                    </div>

                    {/* 画像 */}
                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between mb-4">
                        <Label className="text-sm font-semibold text-slate-700">画像</Label>
                        <Switch checked={imageBackgroundVisible} onCheckedChange={setImageBackgroundVisible} />
                      </div>
                      {imageBackgroundVisible && (
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="w-full text-sm"
                        />
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="breathing" className="space-y-8 mt-0">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-semibold text-slate-700">深呼吸ガイドを表示</Label>
                      <Switch checked={breathingVisible} onCheckedChange={setBreathingVisible} />
                    </div>

                    {breathingVisible && (
                      <>
                        <div className="space-y-4">
                          <Label className="text-sm font-semibold text-slate-700">速度 ({(breathingSpeed / 1000).toFixed(1)}秒)</Label>
                          <Slider 
                            value={[breathingSpeed]} 
                            min={5000} 
                            max={30000} 
                            step={1000} 
                            onValueChange={(val) => setBreathingSpeed(val[0])} 
                          />
                        </div>

                        <div className="space-y-4">
                          <Label className="text-sm font-semibold text-slate-700">透明度 ({breathingOpacity}%)</Label>
                          <Slider 
                            value={[breathingOpacity]} 
                            min={0} 
                            max={100} 
                            onValueChange={(val) => setBreathingOpacity(val[0])} 
                          />
                        </div>

                        <div className="space-y-4">
                          <Label className="text-sm font-semibold text-slate-700">収縮サイズ ({breathingMinSize}px)</Label>
                          <Slider 
                            value={[breathingMinSize]} 
                            min={0} 
                            max={500} 
                            step={50} 
                            onValueChange={(val) => setBreathingMinSize(val[0])} 
                          />
                        </div>

                        <div className="space-y-4">
                          <Label className="text-sm font-semibold text-slate-700">膨張サイズ ({breathingMaxSize}px)</Label>
                          <Slider 
                            value={[breathingMaxSize]} 
                            min={0} 
                            max={500} 
                            step={50} 
                            onValueChange={(val) => setBreathingMaxSize(val[0])} 
                          />
                        </div>

                        <div className="space-y-4">
                          <Label className="text-sm font-semibold text-slate-700">ガイド色グラデーション</Label>
                          <div className="grid grid-cols-2 gap-3">
                            <input 
                              type="color" 
                              value={guideGradient[0]} 
                              onChange={(e) => setGuideGradient([e.target.value, guideGradient[1]])}
                              className="w-full h-12 rounded-xl cursor-pointer"
                            />
                            <input 
                              type="color" 
                              value={guideGradient[1]} 
                              onChange={(e) => setGuideGradient([guideGradient[0], e.target.value])}
                              className="w-full h-12 rounded-xl cursor-pointer"
                            />
                          </div>
                          <Button className="w-full" onClick={handleRandomizeGuideGradient}>
                            ランダムに変更
                          </Button>
                        </div>
                      </>
                    )}
                  </TabsContent>
                </div>
              </Tabs>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
