import React from 'react';
import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Pause, Play, Settings, X, RotateCw, Wind, Volume2, VolumeX } from "lucide-react";

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

// HSL色空間でのグラデーション補間
const hslToRgb = (h: number, s: number, l: number): [number, number, number] => {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  
  if (h < 60) { r = c; g = x; b = 0; }
  else if (h < 120) { r = x; g = c; b = 0; }
  else if (h < 180) { r = 0; g = c; b = x; }
  else if (h < 240) { r = 0; g = x; b = c; }
  else if (h < 300) { r = x; g = 0; b = c; }
  else { r = c; g = 0; b = x; }
  
  return [
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255),
  ];
};

const rgbToHsl = (r: number, g: number, b: number): [number, number, number] => {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  
  return [h * 360, s, l];
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
  const [allWords, setAllWords] = useState<string[]>([]);
  const [words, setWords] = useState<FallingWord[]>([]);
  const [stars, setStars] = useState<Star[]>([]);
  const [isFallingWordsVisible, setIsFallingWordsVisible] = useState(false);
  const [isFallingWordsPaused, setIsFallingWordsPaused] = useState(false);
  const [speed, setSpeed] = useState(18000);
  const [frequency, setFrequency] = useState(1000);
  const [showSettings, setShowSettings] = useState(false);
  
  // 背景設定
  const [bgGradient, setBgGradient] = useState(['#96fbc4', '#f9f586']);
  const [bgGradientAnimated, setBgGradientAnimated] = useState(false);
  const [bgGradientAnimationDuration, setBgGradientAnimationDuration] = useState(45);
  const [starfieldVisible, setStarfieldVisible] = useState(false);
  const [meteorShowerVisible, setMeteorShowerVisible] = useState(false);
  const [customBackgroundImage, setCustomBackgroundImage] = useState<string | null>(null);
  const [imageBackgroundVisible, setImageBackgroundVisible] = useState(false);
  
  // 深呼吸設定
  const [breathingVisible, setBreathingVisible] = useState(true);
  const [breathingSpeed, setBreathingSpeed] = useState(16000);
  const [breathingOpacity, setBreathingOpacity] = useState(70);
  const [breathingMinSize, setBreathingMinSize] = useState(50);
  const [breathingMaxSize, setBreathingMaxSize] = useState(400);
  const [guideGradient, setGuideGradient] = useState(['#eecda3', '#ef629f']);
  
  // 深呼吸連動言葉表示設定
  const [breathingSyncWordsVisible, setBreathingSyncWordsVisible] = useState(true);
  const [breathingSyncWord, setBreathingSyncWord] = useState<string>('');
  const [breathingSyncWordSize, setBreathingSyncWordSize] = useState(32);
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
  
  // BGM設定
  const [bgmEnabled, setBgmEnabled] = useState(false);
  const [bgmVolume, setBgmVolume] = useState(30);
  const [bgmTrack, setBgmTrack] = useState<'wave' | 'birds' | 'crickets' | 'breathing' | 'bonfire' | 'lofi'>('wave');
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // 除外ワード設定
  const [excludeWords, setExcludeWords] = useState<string[]>([]);
  const [excludeWordInput, setExcludeWordInput] = useState('');

  const wordIdRef = useRef(0);
  const starIdRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const starIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pauseButtonRef = useRef<HTMLButtonElement>(null);
  const breathingScaleRef = useRef(0.5);
  const syncTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ポジティブワードをJSONから読み込み
  useEffect(() => {
    const loadWords = async () => {
      try {
        const response = await fetch('/positive-words.json');
        const data = await response.json();
        setAllWords(data.words || []);
      } catch (error) {
        console.error('Failed to load words:', error);
        // フォールバック
        setAllWords([
          'あなたは素晴らしい', '今この瞬間を楽しもう', '幸運が訪れる', 'できる', 'ありがとう',
          '大丈夫', 'やれば出来る', '笑顔で過ごそう', '前向きに', 'チャレンジしよう',
        ]);
      }
    };
    loadWords();
  }, []);

  // 言葉を生成
  const generateWord = (): FallingWord | null => {
    if (allWords.length === 0) return null;
    
    let text = allWords[Math.floor(Math.random() * allWords.length)];
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

  // 統合タイマー：深呼吸アニメーション＋ワード更新（B1要件1）
  const [breathingScale, setBreathingScale] = useState(0.5);
  
  useEffect(() => {
    const startTime = Date.now();
    let lastCycleUpdate = 0;
    
    // 統合タイマー：60fps（16ms）で実行
    const unifiedInterval = setInterval(() => {
      const elapsed = (Date.now() - startTime) % breathingSpeed;
      const progress = elapsed / breathingSpeed;
      const scale = 0.5 + Math.sin((progress * Math.PI * 2) - Math.PI / 2) * 0.5;
      const newScale = 0.5 + scale * 0.5;
      
      setBreathingScale(newScale);
      breathingScaleRef.current = newScale;
      
      // 深呼吸が最小サイズ（0.5）に到達したタイミングでワード更新
      if (Math.abs(elapsed - breathingSpeed / 2) < 100 && breathingWordSelectionMode === 'random' && allWords.length > 0) {
        const randomWord = allWords[Math.floor(Math.random() * allWords.length)];
        setBreathingSyncWord(processWord(randomWord, excludeWords));
      }
    }, 16); // 60fps

    return () => clearInterval(unifiedInterval);
  }, [breathingSpeed, breathingWordSelectionMode, allWords, excludeWords];

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
  }, [frequency, isFallingWordsPaused, speed, isFallingWordsVisible, excludeWords, allWords]);

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
    return Math.max(12, Math.min(48, charWidth * 1.5));
  }, [breathingSyncWord, breathingScale]);

  // 深呼吸連動言葉の文字色
  const breathingSyncWordColorMap = {
    'white': '#ffffff',
    'black': '#000000',
    'gray': '#808080',
  };

  // BGM再生制御
  useEffect(() => {
    if (!audioRef.current) return;
    
    if (bgmEnabled) {
      audioRef.current.play().catch(() => {
        // ブラウザの自動再生ポリシーで再生失敗
      });
    } else {
      audioRef.current.pause();
    }
  }, [bgmEnabled]);

  // BGMボリューム制御
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = bgmVolume / 100;
    }
  }, [bgmVolume]);

  // BGMトラック変更
  useEffect(() => {
    if (audioRef.current) {
      // Pixabayから著作権フリーのBGMを使用（実装時はURLを置き換え）
      const bgmUrls: Record<string, string> = {
        'wave': 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_1808fbf5d9.mp3',
        'birds': 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_8f0e5e8c6c.mp3',
        'crickets': 'https://cdn.pixabay.com/download/audio/2022/03/20/audio_9c1d2e3f4g.mp3',
        'breathing': 'https://cdn.pixabay.com/download/audio/2022/03/25/audio_5a6b7c8d9e.mp3',
        'bonfire': 'https://cdn.pixabay.com/download/audio/2022/04/01/audio_1f2g3h4i5j.mp3',
        'lofi': 'https://cdn.pixabay.com/download/audio/2022/04/05/audio_6k7l8m9n0o.mp3',
      };
      
      audioRef.current.src = bgmUrls[bgmTrack];
      audioRef.current.loop = true;
      
      if (bgmEnabled) {
        audioRef.current.play().catch(() => {
          // ブラウザの自動再生ポリシーで再生失敗
        });
      }
    }
  }, [bgmTrack]);

  // グラデーションアニメーション用のCSS（B1要件2）
  // HSL色空間での滑らかなグラデーション補間
  const [animatedGradient, setAnimatedGradient] = useState(`radial-gradient(circle at center in hsl longer hue, ${bgGradient[0]} 0%, ${bgGradient[1]} 100%)`);
  
  useEffect(() => {
    if (!bgGradientAnimated) {
      setAnimatedGradient(`linear-gradient(135deg, ${bgGradient[0]}, ${bgGradient[1]})`);
      return;
    }
    
    const startTime = Date.now();
    const animationInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = (elapsed % (bgGradientAnimationDuration * 1000)) / (bgGradientAnimationDuration * 1000);
      const angle = progress * 360;
      const x = 50 + 30 * Math.cos((angle * Math.PI) / 180);
      const y = 50 + 30 * Math.sin((angle * Math.PI) / 180);
      const gradient = `radial-gradient(circle at ${x}% ${y}% in hsl longer hue, ${bgGradient[0]} 0%, ${bgGradient[1]} 100%)`;
      setAnimatedGradient(gradient);
    }, 16);
    
    return () => clearInterval(animationInterval);
  }, [bgGradientAnimated, bgGradient, bgGradientAnimationDuration]);
  
  const gradientAnimationStyle = {
    background: animatedGradient,
  };

  return (
    <div className="w-full h-screen overflow-hidden relative" style={gradientAnimationStyle}>
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
                style={{ left: `${star.x}px`, top: `${star.y}px` }}
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
                initial={{ x: star.x, y: star.y, opacity: 1 }}
                animate={{ x: star.x + 200, y: window.innerHeight + 100, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: star.duration }}
                className="absolute"
              >
                <ShapeRenderer shape={star.shape} size={star.size} color="#ffffff" />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* 画像背景 */}
      {imageBackgroundVisible && customBackgroundImage && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${customBackgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: 5,
          }}
        />
      )}

      {/* 深呼吸ガイド */}
      {breathingVisible && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 15 }}>
          <motion.div
            animate={{ scale: breathingScale }}
            transition={{ type: 'tween', duration: 0 }}
            className="rounded-full"
            style={{
              width: `${breathingMaxSize}px`,
              height: `${breathingMaxSize}px`,
              background: `linear-gradient(135deg, ${guideGradient[0]}, ${guideGradient[1]})`,
              opacity: breathingOpacity / 100,
            }}
          />
        </div>
      )}

      {/* 深呼吸連動言葉 */}
      {breathingSyncWordsVisible && breathingSyncWord && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 20 }}>
          <motion.div
            animate={{ scale: breathingScale }}
            transition={{ type: 'tween', duration: 0 }}
            style={{
              fontSize: `${autoFontSize}px`,
              color: breathingSyncWordColorMap[breathingSyncWordColor],
              fontWeight: 'bold',
              textAlign: 'center',
              maxWidth: '80%',
            }}
          >
            {breathingSyncWord}
          </motion.div>
        </div>
      )}

      {/* 落ちる言葉 */}
      {isFallingWordsVisible && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 8 }}>
          <AnimatePresence>
            {words.map((word) => (
              <motion.div
                key={word.id}
                initial={{ y: -50, opacity: 1 }}
                animate={{ y: window.innerHeight + 50, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: word.duration, ease: 'linear' }}
                className="absolute"
                style={{
                  left: `${word.left}px`,
                  top: `${word.top}px`,
                  fontSize: `${word.fontSize}px`,
                  color: word.color,
                  fontWeight: 'bold',
                  whiteSpace: 'nowrap',
                }}
              >
                {word.text}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* ホーム画面左上のコントロール */}
      <div className="absolute top-4 left-4 flex gap-2 z-50">
        {/* 言葉表示 ON/OFF */}
        <button
          onClick={() => setIsFallingWordsVisible(!isFallingWordsVisible)}
          className="p-2 bg-white rounded-lg shadow-lg hover:bg-gray-100"
          title="言葉表示"
        >
          {isFallingWordsVisible ? <Play size={20} /> : <Pause size={20} />}
        </button>

        {/* 一時停止 */}
        <button
          ref={pauseButtonRef}
          onClick={() => setIsFallingWordsPaused(!isFallingWordsPaused)}
          className="p-2 bg-white rounded-lg shadow-lg hover:bg-gray-100"
          title="一時停止"
        >
          {isFallingWordsPaused ? <Play size={20} /> : <Pause size={20} />}
        </button>

        {/* 背景グラデーション色ランダム */}
        <button
          onClick={randomizeBgGradient}
          className="p-2 bg-white rounded-lg shadow-lg hover:bg-gray-100"
          title="背景色"
        >
          <RotateCw size={20} />
        </button>

        {/* 深呼吸ガイド色ランダム */}
        <button
          onClick={randomizeGuideGradient}
          className="p-2 bg-white rounded-lg shadow-lg hover:bg-gray-100"
          title="深呼吸ガイド色"
        >
          <Wind size={20} />
        </button>

        {/* BGM ON/OFF */}
        <button
          onClick={() => setBgmEnabled(!bgmEnabled)}
          className="p-2 bg-white rounded-lg shadow-lg hover:bg-gray-100"
          title="BGM"
        >
          {bgmEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
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
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="words">言葉</TabsTrigger>
              <TabsTrigger value="breathing">呼吸</TabsTrigger>
              <TabsTrigger value="background">背景</TabsTrigger>
              <TabsTrigger value="bgm">BGM</TabsTrigger>
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
                    <Label>ワード選択モード</Label>
                    <div className="flex gap-2">
                      {(['random', 'fixed'] as const).map((mode) => (
                        <Button
                          key={mode}
                          onClick={() => setBreathingWordSelectionMode(mode)}
                          variant={breathingWordSelectionMode === mode ? 'default' : 'outline'}
                          size="sm"
                        >
                          {mode === 'random' ? 'ランダム' : '固定'}
                        </Button>
                      ))}
                    </div>
                  </div>
                  {breathingWordSelectionMode === 'fixed' && (
                    <div>
                      <Label>固定ワード</Label>
                      <input
                        type="text"
                        value={breathingSyncWord}
                        onChange={(e) => setBreathingSyncWord(e.target.value)}
                        className="w-full px-2 py-1 border rounded"
                        maxLength={20}
                      />
                    </div>
                  )}
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
                <Label>グラデーション色</Label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={bgGradient[0]}
                    onChange={(e) => setBgGradient([e.target.value, bgGradient[1]])}
                    className="w-12 h-10 border rounded cursor-pointer"
                    title="グラデーション開始色"
                  />
                  <input
                    type="color"
                    value={bgGradient[1]}
                    onChange={(e) => setBgGradient([bgGradient[0], e.target.value])}
                    className="w-12 h-10 border rounded cursor-pointer"
                    title="グラデーション終了色"
                  />
                  <Button onClick={randomizeBgGradient} size="sm" variant="outline">
                    ランダム
                  </Button>
                </div>
              </div>
              <div>
                <Label>グラデーションアニメーション</Label>
                <Switch checked={bgGradientAnimated} onCheckedChange={setBgGradientAnimated} />
                {bgGradientAnimated && (
                  <div className="mt-2">
                    <Label>アニメーション時間（秒）: {bgGradientAnimationDuration}</Label>
                    <Slider value={[bgGradientAnimationDuration]} onValueChange={(v) => setBgGradientAnimationDuration(v[0])} min={30} max={60} step={5} />
                  </div>
                )}
              </div>
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

            {/* BGMタブ */}
            <TabsContent value="bgm" className="space-y-4">
              <div>
                <Label>BGM有効</Label>
                <Switch checked={bgmEnabled} onCheckedChange={setBgmEnabled} />
              </div>
              {bgmEnabled && (
                <>
                  <div>
                    <Label>ボリューム: {bgmVolume}%</Label>
                    <Slider value={[bgmVolume]} onValueChange={(v) => setBgmVolume(v[0])} min={0} max={100} step={5} />
                  </div>
                  <div>
                    <Label>トラック</Label>
                    <div className="space-y-2">
                      {(['wave', 'birds', 'crickets', 'breathing', 'bonfire', 'lofi'] as const).map((track) => (
                        <Button
                          key={track}
                          onClick={() => setBgmTrack(track)}
                          variant={bgmTrack === track ? 'default' : 'outline'}
                          className="w-full"
                          size="sm"
                        >
                          {track === 'wave' && '波音'}
                          {track === 'birds' && '野鳥の声'}
                          {track === 'crickets' && '虫の声'}
                          {track === 'breathing' && '赤ちゃんの呼吸'}
                          {track === 'bonfire' && 'たき火'}
                          {track === 'lofi' && 'Lo-Fi音楽'}
                        </Button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>
      )}

      {/* BGM音声要素 */}
      <audio ref={audioRef} crossOrigin="anonymous" />
    </div>
  );
}
