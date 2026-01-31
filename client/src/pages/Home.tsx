'use client';
import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Pause, Play, Settings, X, RotateCw, Wind, Palette, Sparkles } from "lucide-react";

// ポジティブな日本語の言葉のみ
const POSITIVE_WORDS = [
  'あなたは素晴らしい', '今この瞬間を楽しもう', '幸運が訪れる', 'できる', 'ありがとう', '大丈夫', 'やれば出来る', '笑顔で過ごそう', '前向きに', 'チャレンジしよう',
  '成功する', '愛される', '幸せ', '感謝', '希望', '心が安らぐ', 'リラックス', '落ち着こう', 'やる気が出る', '元気が出る',
  '明るく', '楽しく', '優しく', '強く', '自信を持とう', '今を生きる', '最高の一日', 'ありのまま', '心配ない', 'うまくいく',
  '信じよう', '輝いている', '素敵', '美しい', '愛してる', '応援してる', '頑張って', 'ファイト', '負けないで', '勇気を出して',
  '一歩ずつ', '焦らないで', 'ゆっくりでいい', '自分らしく', '自分を信じて', '自分を大切に', '自分を愛して', '今日も良い日', '明日はもっと良くなる', 'きっと大丈夫',
  '必ずできる', 'あなたならできる', '可能性は無限', '夢は叶う', '奇跡は起こる', '運が良い', 'ツイてる', 'ラッキー', 'ハッピー', 'ピース',
];

// グラデーション配色パレット
const GRADIENT_PALETTES = [
  ['#FF6B6B', '#FFE66D'], ['#4ECDC4', '#44A08D'], ['#F38181', '#FFEAA7'],
  ['#74B9FF', '#A29BFE'], ['#FD79A8', '#FDCB6E'], ['#6C5CE7', '#A29BFE'],
  ['#00B894', '#55EFC4'], ['#FF7675', '#FFECB3'], ['#FD79A8', '#FF7675'],
  ['#74B9FF', '#81ECEC'], ['#55EFC4', '#FD79A8'], ['#A29BFE', '#74B9FF'],
  ['#FFEAA7', '#FF7675'], ['#DFE6E9', '#B2BEC3'], ['#F8B500', '#FF6348'],
  ['#eecda3', '#ef629f'], ['#FF9A56', '#FF6A88'], ['#FFB347', '#FFAEC9'],
  ['#a1c4fd', '#c2e9fb'], ['#ffecd2', '#fcb69f'], ['#ff9a56', '#ff6a88'],
  ['#ffd89b', '#19547b'], ['#fa709a', '#fee140'], ['#30cfd0', '#330867'],
  ['#a8edea', '#fed6e3'], ['#ff9a9e', '#fecfef'],
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

// ランダムなグラデーションペアを生成
const generateRandomGradient = () => {
  const palette = GRADIENT_PALETTES[Math.floor(Math.random() * GRADIENT_PALETTES.length)];
  return palette;
};

// シェイプを描画するコンポーネント
const ShapeRenderer = ({ shape, size, color }: { shape: ShapeType; size: number; color: string }) => {
  switch (shape) {
    case 'dot':
      return <div className="rounded-full" style={{ width: `<LaTex>${size}px`, height: `$</LaTex>{size}px`, backgroundColor: color }} />;
    case 'star':
      return (
        <div style={{ fontSize: `<LaTex>${size}px`, color, lineHeight: '1' }}>
          ★
        </div>
      );
    case 'circle':
      return <div className="rounded-full border-2" style={{ width: `$</LaTex>{size}px`, height: `<LaTex>${size}px`, borderColor: color }} />;
    case 'square':
      return <div style={{ width: `$</LaTex>{size}px`, height: `<LaTex>${size}px`, backgroundColor: color }} />;
    case 'heart':
      return (
        <div style={{ fontSize: `$</LaTex>{size}px`, color, lineHeight: '1' }}>
          ❤️
        </div>
      );
    case 'snow':
      return (
        <div style={{ fontSize: `<LaTex>${size}px`, color, lineHeight: '1' }}>
          ❄️
        </div>
      );
    case 'thumbsup':
      return (
        <div style={{ fontSize: `$</LaTex>{size}px`, color, lineHeight: '1' }}>
          👍
        </div>
      );
    default:
      return <div className="rounded-full" style={{ width: `<LaTex>${size}px`, height: `$</LaTex>{size}px`, backgroundColor: color }} />;
  }
};

export default function Home() {
  const [words, setWords] = useState<FallingWord[]>([]);
  const [stars, setStars] = useState<Star[]>([]);
  const [isFallingWordsVisible, setIsFallingWordsVisible] = useState(false);
  const [isFallingWordsPaused, setIsFallingWordsPaused] = useState(false);
  const [speed, setSpeed] = useState(15000);
  const [frequency, setFrequency] = useState(300);
  const [showSettings, setShowSettings] = useState(false);
  
  // 背景設定
  const [bgGradient, setBgGradient] = useState(['#96fbc4', '#f9f586']);
  const [starfieldVisible, setStarfieldVisible] = useState(false);
  const [meteorShowerVisible, setMeteorShowerVisible] = useState(false);
  const [customBackgroundImage, setCustomBackgroundImage] = useState<string | null>(null);
  const [imageBackgroundVisible, setImageBackgroundVisible] = useState(false);
  
  // 深呼吸設定
  const [breathingVisible, setBreathingVisible] = useState(true);
  const [breathingSpeed, setBreathingSpeed] = useState(18000);
  const [breathingOpacity, setBreathingOpacity] = useState(70);
  const [breathingMinSize, setBreathingMinSize] = useState(50);
  const [breathingMaxSize, setBreathingMaxSize] = useState(400);
  const [guideGradient, setGuideGradient] = useState(['#eecda3', '#ef629f']);
  
  // 深呼吸連動言葉表示設定
  const [breathingSyncWordsVisible, setBreathingSyncWordsVisible] = useState(true);
  const [breathingSyncWord, setBreathingSyncWord] = useState<string>('');
  const [breathingSyncWordSize, setBreathingSyncWordSize] = useState(32);
  const [wordFallingSpeed, setWordFallingSpeed] = useState(1000);
  const [breathingWordSelectionMode, setBreathingWordSelectionMode] = useState<'random' | 'fixed'>('random');
  const [breathingSyncWordColor, setBreathingSyncWordColor] = useState<'white' | 'black' | 'gray'>('white');
  
  // 星空・流星群設定
  const [starfieldFrequency, setStarfieldFrequency] = useState(100);
  const [starfieldSize, setStarfieldSize] = useState(2);
  const [starfieldShape, setStarfieldShape] = useState<ShapeType>('dot');
  const [starfieldSpeed, setStarfieldSpeed] = useState(4);
  const [meteorFrequency, setMeteorFrequency] = useState(400);
  const [meteorSize, setMeteorSize] = useState(4);
  const [meteorShape, setMeteorShape] = useState<ShapeType>('dot');
  const [meteorSpeed, setMeteorSpeed] = useState(8);
  
  // 除外ワード設定
  const [excludeWords, setExcludeWords] = useState<string[]>([]);
  const [excludeWordInput, setExcludeWordInput] = useState('');

  const wordIdRef = useRef(0);
  const starIdRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const starIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pauseButtonRef = useRef<HTMLButtonElement>(null);
  const breathingScaleRef = useRef(1);

  // 言葉を生成
  const generateWord = (): FallingWord | null => {
    let text = POSITIVE_WORDS[Math.floor(Math.random() * POSITIVE_WORDS.length)];
    text = processWord(text, excludeWords);
    
    if (!text) return null;
    
    if (text.length > 20) text = text.substring(0, 20);
    
    const fontSize = Math.random() * 20 + 16;
    const colors = ['#FF1493', '#FF69B4', '#FFB6C1', '#FF6347', '#4169E1', '#20B2AA'];
    
    const wordSpeed = speed;
    
    // スマホ画面内に収まるように調整（pauseButtonRef基準）
    const screenWidth = window.innerWidth;
    const pauseButtonRect = pauseButtonRef.current?.getBoundingClientRect();
    const pauseButtonY = pauseButtonRect?.top || 60;
    
    // y軸：pauseButtonY ± 100
    const topMin = Math.max(0, pauseButtonY - 100);
    const topMax = Math.min(window.innerHeight * 0.5, pauseButtonY + 100);
    const top = Math.random() * (topMax - topMin) + topMin;
    
    // x軸：画面内に収まるように調整
    const left = Math.random() * Math.max(screenWidth - 100, 100);
    
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
    return {
      id: `star-${starIdRef.current++}`,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: starfieldSize,
      duration: starfieldSpeed,
      shape: starfieldShape,
    };
  };

  // 流星を生成
  const generateMeteor = (): Star => {
    return {
      id: `meteor-${starIdRef.current++}`,
      x: Math.random() * window.innerWidth,
      y: -50,
      size: meteorSize,
      duration: meteorSpeed,
      shape: meteorShape,
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
  }, [frequency, isFallingWordsPaused, speed, isFallingWordsVisible, excludeWords]);

  // 星空モード
  useEffect(() => {
    if (!starfieldVisible) {
      setStars([]);
      return;
    }
    
    setStars(Array.from({ length: starfieldFrequency }, () => generateStar()));
    
    const starInterval = setInterval(() => {
      setStars((prev) => {
        const newStar = generateStar();
        const newStars = [...prev, newStar];
        return newStars.length > starfieldFrequency * 2 ? newStars.slice(-starfieldFrequency) : newStars;
      });
    }, Math.random() * 1000 + 500);
    
    return () => clearInterval(starInterval);
  }, [starfieldVisible, starfieldFrequency, starfieldSize, starfieldShape, starfieldSpeed]);

  // 流星群モード
  useEffect(() => {
    if (!meteorShowerVisible) {
      setStars([]);
      return;
    }

    setStars(Array.from({ length: 3 }, () => generateMeteor()));

    const meteorInterval = setInterval(() => {
      setStars((prev) => {
        const newMeteor = generateMeteor();
        const newStars = [...prev, newMeteor];
        return newStars.length > 30 ? newStars.slice(-30) : newStars;
      });
    }, Math.random() * meteorFrequency + 200);

    return () => clearInterval(meteorInterval);
  }, [meteorShowerVisible, meteorFrequency, meteorSize, meteorShape, meteorSpeed]);

  // 深呼吸連動言葉の初期化とランダム更新（深呼吸速度と完全に同期）
  useEffect(() => {
    if (!breathingSyncWordsVisible) {
      setBreathingSyncWord('');
      return;
    }

    // 初回の言葉を設定
    const updateBreathingWord = () => {
      if (breathingWordSelectionMode === 'random') {
        const randomWord = POSITIVE_WORDS[Math.floor(Math.random() * POSITIVE_WORDS.length)];
        setBreathingSyncWord(processWord(randomWord, excludeWords));
      }
    };

    updateBreathingWord();

    // 深呼吸速度と完全に同期するタイマー
    // 深呼吸ガイドが最小になるタイミング（breathingSpeed / 2）で言葉を切り替え
    const interval = setInterval(() => {
      updateBreathingWord();
    }, breathingSpeed);

    return () => clearInterval(interval);
  }, [breathingSyncWordsVisible, breathingWordSelectionMode, breathingSpeed, excludeWords]);

  // 深呼吸アニメーション
  const [breathingScale, setBreathingScale] = useState(0.5);
  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTime) % breathingSpeed;
      const progress = elapsed / breathingSpeed;
      const scale = 0.5 + Math.sin((progress * Math.PI * 2) - Math.PI / 2) * 0.5;
      setBreathingScale(0.5 + scale * 0.5);
      breathingScaleRef.current = 0.5 + scale * 0.5;
    }, 16);

    return () => clearInterval(interval);
  }, [breathingSpeed]);

  // 深呼吸ガイドの色をランダムに変更
  const randomizeGuideGradient = () => {
    const palette = generateRandomGradient();
    setGuideGradient(palette);
  };

  // 背景グラデーションをランダムに変更
  const randomizeBgGradient = () => {
    const palette = generateRandomGradient();
    setBgGradient(palette);
  };

  // 深呼吸連動言葉の自動フォントサイズ調整
  const autoFontSize = useMemo(() => {
    if (!breathingSyncWord) return 32;
    const maxWidth = 300 * breathingScale;
    const charWidth = maxWidth / breathingSyncWord.length;
    const baseSize = Math.max(12, Math.min(48, charWidth * 1.5));
    // 呼吸スケールに部分的に同期（最小70%、最大100%）
    const scaledSize = baseSize * (0.7 + breathingScale * 0.3);
    return scaledSize;
  }, [breathingSyncWord, breathingScale]);

  // 深呼吸連動言葉の文字色
  const breathingSyncWordColorMap = {
    'white': '#ffffff',
    'black': '#000000',
    'gray': '#808080',
  };

  return (
    <div className="w-full h-screen overflow-hidden relative" style={{
      background: `linear-gradient(135deg, <LaTex>${bgGradient[0]}, $</LaTex>{bgGradient[1]})`,
    }}>
      {/* 星空モード */}
      {starfieldVisible && (
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 10 }}>
          <AnimatePresence>
            {stars.map((star) => (
              <motion.div
                key={star.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: star.duration, repeat: Infinity }}
                className="absolute"
                style={{ left: `<LaTex>${star.x}px`, top: `$</LaTex>{star.y}px` }}
              >
                <ShapeRenderer shape={star.shape} size={star.size} color="#ffffff" />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* 流星群モード */}
      {meteorShowerVisible && (
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 10 }}>
          <AnimatePresence>
            {stars.map((star) => (
              <motion.div
                key={star.id}
                initial={{ y: -50, opacity: 1 }}
                animate={{ y: window.innerHeight + 50, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: star.duration }}
                className="absolute"
                style={{ left: `${star.x}px` }}
              >
                <ShapeRenderer shape={star.shape} size={star.size} color="#ffffff" />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* 背景画像モード */}
      {imageBackgroundVisible && customBackgroundImage && (
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: `url(${customBackgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.7,
        }} />
      )}

      {/* 言葉が降る */}
      {isFallingWordsVisible && (
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 20 }}>
          <AnimatePresence>
            {words.map((word) => (
              <motion.div
                key={word.id}
                initial={{ y: word.top, opacity: 1 }}
                animate={{ y: window.innerHeight }}
                exit={{ opacity: 0 }}
                transition={{ duration: word.duration }}
                className="absolute font-bold"
                style={{
                  left: `<LaTex>${word.left}px`,
                  fontSize: `$</LaTex>{word.fontSize}px`,
                  color: word.color,
                  whiteSpace: 'nowrap',
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
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            animate={{ scale: breathingScale }}
            transition={{ duration: 0.1 }}
            className="rounded-full flex items-center justify-center text-center"
            style={{
              width: `<LaTex>${breathingMinSize + (breathingMaxSize - breathingMinSize) * breathingScale}px`,
              height: `$</LaTex>{breathingMinSize + (breathingMaxSize - breathingMinSize) * breathingScale}px`,
              background: `linear-gradient(135deg, <LaTex>${guideGradient[0]}, $</LaTex>{guideGradient[1]})`,
              opacity: breathingOpacity / 100,
            }}
          >
            {breathingSyncWordsVisible && breathingSyncWord && (
              <motion.div
                animate={{ opacity: breathingScale }}
                style={{
                  fontSize: `${autoFontSize}px`,
                  color: breathingSyncWordColorMap[breathingSyncWordColor],
                  maxWidth: '90%',
                  wordWrap: 'break-word',
                  lineHeight: '1.2',
                }}
              >
                {breathingSyncWord}
              </motion.div>
            )}
          </motion.div>
        </div>
      )}

      {/* ホーム画面左上のコントロールボタン */}
      <div className="absolute top-4 left-4 flex gap-2 z-50">
        {/* 言葉が降るON/OFF */}
        <button
          ref={pauseButtonRef}
          onClick={() => setIsFallingWordsVisible(!isFallingWordsVisible)}
          className="p-2 bg-white rounded-lg shadow-lg hover:bg-gray-100"
          title="言葉が降る"
        >
          {isFallingWordsVisible ? <Pause size={20} /> : <Play size={20} />}
        </button>

        {/* 背景グラデーションランダム */}
        <button
          onClick={randomizeBgGradient}
          className="p-2 bg-white rounded-lg shadow-lg hover:bg-gray-100"
          title="背景グラデーション"
        >
          <Palette size={20} />
        </button>

        {/* 深呼吸ガイド色ランダム */}
        <button
          onClick={randomizeGuideGradient}
          className="p-2 bg-white rounded-lg shadow-lg hover:bg-gray-100"
          title="深呼吸ガイド色"
        >
          <Sparkles size={20} />
        </button>
      </div>

      {/* ホーム画面右上の設定ボタン */}
      <div className="absolute top-4 right-4 z-50">
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 bg-white rounded-lg shadow-lg hover:bg-gray-100"
          title="設定"
        >
          <Settings size={20} />
        </button>
      </div>

      {/* 設定パネル */}
      {showSettings && (
        <div className="absolute top-16 right-4 w-96 bg-white rounded-lg shadow-2xl p-6 max-h-96 overflow-y-auto z-50">
          <Tabs defaultValue="words" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="words">言葉</TabsTrigger>
              <TabsTrigger value="breathing">呼吸</TabsTrigger>
              <TabsTrigger value="background">背景</TabsTrigger>
            </TabsList>

            {/* 言葉タブ */}
            <TabsContent value="words" className="space-y-4">
              <div>
                <Label>速度（ms）: {speed}</Label>
                <Slider value={[speed]} onValueChange={(v) => setSpeed(v[0])} min={5000} max={30000} step={1000} />
              </div>
              <div>
                <Label>出現頻度（ms）: {frequency}</Label>
                <Slider value={[frequency]} onValueChange={(v) => setFrequency(v[0])} min={100} max={1000} step={50} />
              </div>
              <div>
                <Label>除外ワード</Label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={excludeWordInput}
                    onChange={(e) => setExcludeWordInput(e.target.value)}
                    placeholder="除外ワードを入力"
                    className="flex-1 px-2 py-1 border rounded"
                  />
                  <Button onClick={() => {
                    if (excludeWordInput) {
                      setExcludeWords([...excludeWords, excludeWordInput]);
                      setExcludeWordInput('');
                    }
                  }} size="sm">追加</Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {excludeWords.map((word, idx) => (
                    <div key={idx} className="bg-red-100 px-2 py-1 rounded text-sm flex items-center gap-1">
                      {word}
                      <X size={14} className="cursor-pointer" onClick={() => setExcludeWords(excludeWords.filter((_, i) => i !== idx))} />
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* 呼吸タブ */}
            <TabsContent value="breathing" className="space-y-4">
              <div>
                <Label>深呼吸速度（ms）: {breathingSpeed}</Label>
                <Slider value={[breathingSpeed]} onValueChange={(v) => setBreathingSpeed(v[0])} min={5000} max={30000} step={1000} />
              </div>
              <div>
                <Label>深呼吸と連動</Label>
                <Switch checked={breathingSyncWordsVisible} onCheckedChange={setBreathingSyncWordsVisible} />
              </div>
              {breathingSyncWordsVisible && (
                <>
                  <div>
                    <Label>文字色</Label>
                    <div className="flex gap-2">
                      {(['white', 'black', 'gray'] as const).map((color) => (
                        <Button
                          key={color}
                          onClick={() => setBreathingSyncWordColor(color)}
                          variant={breathingSyncWordColor === color ? 'default' : 'outline'}
                          size="sm"
                        >
                          {color}
                        </Button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </TabsContent>

            {/* 背景タブ */}
            <TabsContent value="background" className="space-y-4">
              <div>
                <Label>星空</Label>
                <Switch checked={starfieldVisible} onCheckedChange={setStarfieldVisible} />
                {starfieldVisible && (
                  <div className="space-y-2 mt-2">
                    <div>
                      <Label>出現数: {starfieldFrequency}</Label>
                      <Slider value={[starfieldFrequency]} onValueChange={(v) => setStarfieldFrequency(v[0])} min={10} max={200} step={10} />
                    </div>
                    <div>
                      <Label>大きさ: {starfieldSize}</Label>
                      <Slider value={[starfieldSize]} onValueChange={(v) => setStarfieldSize(v[0])} min={1} max={10} step={1} />
                    </div>
                    <div>
                      <Label>速度（秒）: {starfieldSpeed}</Label>
                      <Slider value={[starfieldSpeed]} onValueChange={(v) => setStarfieldSpeed(v[0])} min={1} max={10} step={1} />
                    </div>
                  </div>
                )}
              </div>
              <div>
                <Label>流星群</Label>
                <Switch checked={meteorShowerVisible} onCheckedChange={setMeteorShowerVisible} />
                {meteorShowerVisible && (
                  <div className="space-y-2 mt-2">
                    <div>
                      <Label>出現頻度（ms）: {meteorFrequency}</Label>
                      <Slider value={[meteorFrequency]} onValueChange={(v) => setMeteorFrequency(v[0])} min={200} max={2000} step={100} />
                    </div>
                    <div>
                      <Label>大きさ: {meteorSize}</Label>
                      <Slider value={[meteorSize]} onValueChange={(v) => setMeteorSize(v[0])} min={1} max={10} step={1} />
                    </div>
                    <div>
                      <Label>速度（秒）: {meteorSpeed}</Label>
                      <Slider value={[meteorSpeed]} onValueChange={(v) => setMeteorSpeed(v[0])} min={1} max={10} step={1} />
                    </div>
                  </div>
                )}
              </div>
              <div>
                <Label>画像背景</Label>
                <Switch checked={imageBackgroundVisible} onCheckedChange={setImageBackgroundVisible} />
                {imageBackgroundVisible && (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          setCustomBackgroundImage(event.target?.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="mt-2 w-full"
                  />
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
