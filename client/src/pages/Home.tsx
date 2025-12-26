'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Pause, Play, Settings, X, ArrowDown, ArrowUp, Upload } from "lucide-react";

// ポジティブな日本語の言葉のみ（大幅に拡充）
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
  '人間味があるね', '手際がいいね', '豪快だね', 'ひとりできたんだね', '今日も元気いっぱいだね', 'お友だちに優しいところが素敵だね', 'お手伝いしてくれて助かったよ、ありがとう', 'ママ（パパ）は◯◯ちゃんのことが正しいと思うよ', 'チャレンジしたことがすごいんだよ', 'よく気づくことができたね',
  'ママ（パパ）はどんなことがあっても◯◯ちゃんを応援するからね', '◯◯ちゃんがいるだけで幸せだよ', 'やればできるんだね', 'さすがだね', '最後までやり遂げたことがすごいことだよ', '諦めない姿が素敵だよ', 'みんなを元気にしてくれるね', '自分の意見を言えるのはすごいね', '努力しているのは知っているよ', 'すっかり大人になったね',
  '思い切ってやってごらん', 'がんばっているのは知っているからね', '本当に助かっているよ', 'よく気づいてくれるよね', 'がんばりすぎないことも大切だよ', '自分も◯◯さんみたいになりたいです', '本当になんでも知っていますよね',
  '人はしばしば不合理で、非論理的で、自己中心的です。それでも許しなさい。', '人にやさしくすると、人はあなたに何か隠された動機があるはずだ、と非難するかもしれません。それでも人にやさしくしなさい。', '成功をすると、不実な友と、本当の敵を得てしまうことでしょう。それでも成功しなさい。', '正直で誠実であれば、人はあなたをだますかもしれません。それでも正直に誠実でいなさい。', '歳月を費やして作り上げたものが、一晩で壊されてしまうことになるかもしれません。それでも作り続けなさい。', '心を穏やかにし幸福を見つけると、妬まれるかもしれません。それでも幸福でいなさい。', '今日善い行いをしても、次の日には忘れられるでしょう。それでも善を行いを続けなさい。', '持っている一番いいものを分け与えても、決して十分ではないでしょう。それでも一番いいものを分け与えなさい。',
  '束縛があるからこそ、私は飛べるのだ。悲しみがあるからこそ、私は高く舞い上がれるのだ。逆境があるからこそ、私は走れるのだ。涙があるからこそ、私は前に進めるのだ。',
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

interface FallingWord {
  id: string;
  text: string;
  left: number;
  top: number;
  duration: number;
  fontSize: number;
  color: string;
}

export default function Home() {
  const [words, setWords] = useState<FallingWord[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(15000);
  const [frequency, setFrequency] = useState(600);
  const [showSettings, setShowSettings] = useState(false);
  const [wordDirection, setWordDirection] = useState<'down' | 'up'>('down');
  const [wordOpacity, setWordOpacity] = useState(100);
  const [randomSpeed, setRandomSpeed] = useState(false);
  
  // 背景設定
  const [backgroundMode, setBackgroundMode] = useState<'gradient-auto' | 'gradient-fixed' | 'white' | 'black' | 'image'>('gradient-auto');
  const [customBackgroundImage, setCustomBackgroundImage] = useState<string | null>(null);
  
  // 深呼吸設定
  const [breathingVisible, setBreathingVisible] = useState(false);
  const [breathingSpeed, setBreathingSpeed] = useState(10000);
  const [breathingOpacity, setBreathingOpacity] = useState(70);
  const [breathingMinSize, setBreathingMinSize] = useState(50);
  const [breathingMaxSize, setBreathingMaxSize] = useState(400);
  const [breathingColor, setBreathingColor] = useState('#FF69B4');
  
  // 深呼吸連動言葉表示設定
  const [breathingSyncWordsVisible, setBreathingSyncWordsVisible] = useState(false);
  const [breathingSyncWordsMode, setBreathingSyncWordsMode] = useState<'breathing' | 'falling'>('falling');
  const [breathingSyncWord, setBreathingSyncWord] = useState<string>('');
  const [breathingSyncWordSize, setBreathingSyncWordSize] = useState(32);
  const [breathingSyncWordColor, setBreathingSyncWordColor] = useState('#FF69B4');

  const wordIdRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 言葉を生成
  const generateWord = (): FallingWord => {
    const text = POSITIVE_WORDS[Math.floor(Math.random() * POSITIVE_WORDS.length)];
    const fontSize = Math.random() * 20 + 16;
    const colors = ['#FF1493', '#FF69B4', '#FFB6C1', '#FF6347', '#4169E1', '#20B2AA'];
    
    const wordSpeed = randomSpeed 
      ? (Math.random() * (30000 - 10000) + 10000) 
      : speed;
    
    const windowHeight = window.innerHeight;
    const randomTop = Math.random() * (windowHeight / 2) - 100;
    
    return {
      id: `word-${wordIdRef.current++}`,
      text,
      left: Math.random() * 90 + 5,
      top: randomTop,
      duration: wordSpeed / 1000,
      fontSize,
      color: colors[Math.floor(Math.random() * colors.length)],
    };
  };

  // 言葉を追加するループ
  useEffect(() => {
    if (isPaused || breathingSyncWordsMode === 'breathing') return;

    intervalRef.current = setInterval(() => {
      setWords((prev) => {
        const newWords = [...prev, generateWord()];
        return newWords.length > 60 ? newWords.slice(-60) : newWords;
      });
    }, frequency);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [frequency, isPaused, speed, randomSpeed, breathingSyncWordsMode]);

  // 深呼吸連動言葉の初期化
  useEffect(() => {
    if (breathingSyncWordsVisible && breathingSyncWordsMode === 'breathing') {
      const randomWord = POSITIVE_WORDS[Math.floor(Math.random() * POSITIVE_WORDS.length)];
      setBreathingSyncWord(randomWord);
    }
  }, [breathingSyncWordsVisible, breathingSyncWordsMode]);

  const removeWord = (id: string) => {
    setWords((prev) => prev.filter((w) => w.id !== id));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCustomBackgroundImage(event.target?.result as string);
        setBackgroundMode('image');
      };
      reader.readAsDataURL(file);
    }
  };

  const getBackgroundStyle = () => {
    if (backgroundMode === 'white') return { backgroundColor: '#FFFFFF' };
    if (backgroundMode === 'black') return { backgroundColor: '#000000' };
    if (backgroundMode === 'image' && customBackgroundImage) {
      return {
        backgroundImage: `url(${customBackgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };
    }
    return {};
  };

  return (
    <div 
      className={`relative w-full h-screen overflow-hidden transition-all duration-1000 ${backgroundMode === 'gradient-auto' ? 'animate-gradient-bg' : ''}`}
      style={getBackgroundStyle()}
    >
      {/* 降ってくる言葉 */}
      {breathingSyncWordsMode === 'falling' && (
        <AnimatePresence>
          {words.map((word) => (
            <motion.div
              key={word.id}
              className="absolute whitespace-nowrap font-semibold select-none pointer-events-none"
              style={{
                left: `${word.left}%`,
                top: `${word.top}px`,
                fontSize: `${word.fontSize}px`,
                color: word.color,
                opacity: wordOpacity / 100,
                textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                zIndex: 5,
              }}
              initial={wordDirection === 'down' ? { y: 0, opacity: 1 } : { y: 0, opacity: 1 }}
              animate={wordDirection === 'down' ? { y: '110vh', opacity: 0 } : { y: -window.innerHeight - 100, opacity: 0 }}
              transition={{ duration: word.duration, ease: 'linear' }}
              onAnimationComplete={() => removeWord(word.id)}
            >
              {word.text}
            </motion.div>
          ))}
        </AnimatePresence>
      )}

      {/* 深呼吸ガイド */}
      {breathingVisible && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-10">
          <motion.div
            key={`breathing-${breathingSpeed}-${breathingMinSize}-${breathingMaxSize}`}
            className="rounded-full shadow-lg"
            style={{
              backgroundColor: breathingColor,
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
          />
        </div>
      )}

      {/* 深呼吸連動言葉表示 */}
      {breathingSyncWordsVisible && breathingSyncWordsMode === 'breathing' && breathingVisible && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-20">
          <motion.div
            key={`breathing-word-${breathingSpeed}`}
            className="absolute whitespace-nowrap font-semibold select-none text-center px-4"
            style={{
              color: breathingSyncWordColor,
              textShadow: '0 2px 8px rgba(0,0,0,0.2)',
            }}
            animate={{ 
              fontSize: [breathingSyncWordSize * 0.6, breathingSyncWordSize, breathingSyncWordSize * 0.6],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{ 
              duration: breathingSpeed / 1000, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {breathingSyncWord}
          </motion.div>
        </div>
      )}

      {/* コントロールボタン */}
      <div className="fixed top-6 left-6 z-50">
        <Button
          variant="secondary"
          size="icon"
          className="w-12 h-12 rounded-xl shadow-md bg-white/90 hover:bg-white text-slate-900"
          onClick={() => setIsPaused(!isPaused)}
        >
          {isPaused ? <Play size={20} /> : <Pause size={20} />}
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
              className="fixed top-0 right-0 w-full max-w-md h-full bg-slate-50 shadow-2xl z-[101] flex flex-col"
            >
              <div className="flex items-center justify-between p-6 bg-white border-b">
                <h2 className="text-lg font-bold text-slate-900">設定</h2>
                <Button variant="ghost" size="icon" onClick={() => setShowSettings(false)}>
                  <X size={24} />
                </Button>
              </div>

              <Tabs defaultValue="words" className="flex-1 flex flex-col overflow-hidden">
                <TabsList className="grid grid-cols-3 w-full bg-white border-b rounded-none h-14">
                  <TabsTrigger value="words" className="data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none text-xs">文字</TabsTrigger>
                  <TabsTrigger value="background" className="data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none text-xs">背景</TabsTrigger>
                  <TabsTrigger value="breathing" className="data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none text-xs">深呼吸</TabsTrigger>
                </TabsList>

                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                  <TabsContent value="words" className="space-y-8 mt-0">
                    {/* 深呼吸連動言葉表示設定 - 文字タブの上部に統合 */}
                    <div className="border-b pb-8">
                      <h3 className="text-sm font-bold text-slate-900 mb-4">深呼吸連動設定</h3>
                      
                      <div className="flex items-center justify-between mb-4">
                        <Label className="text-sm font-semibold text-slate-700">深呼吸連動言葉を表示</Label>
                        <Switch checked={breathingSyncWordsVisible} onCheckedChange={setBreathingSyncWordsVisible} />
                      </div>

                      {breathingSyncWordsVisible && (
                        <>
                          <div className="space-y-4 mb-4">
                            <Label className="text-sm font-semibold text-slate-700">表示モード</Label>
                            <Select value={breathingSyncWordsMode} onValueChange={(val: any) => setBreathingSyncWordsMode(val)}>
                              <SelectTrigger className="w-full h-12 rounded-xl bg-white">
                                <SelectValue placeholder="モードを選択" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="falling">言葉が降る</SelectItem>
                                <SelectItem value="breathing">深呼吸と連動</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {breathingSyncWordsMode === 'breathing' && (
                            <>
                              <div className="space-y-4 mb-4">
                                <Label className="text-sm font-semibold text-slate-700">文字サイズ ({breathingSyncWordSize}px)</Label>
                                <Slider 
                                  value={[breathingSyncWordSize]} 
                                  min={16} 
                                  max={64} 
                                  step={2} 
                                  onValueChange={(val) => setBreathingSyncWordSize(val[0])} 
                                />
                              </div>

                              <div className="space-y-4 mb-4">
                                <Label className="text-sm font-semibold text-slate-700">色</Label>
                                <div className="flex gap-3">
                                  <input 
                                    type="color" 
                                    value={breathingSyncWordColor} 
                                    onChange={(e) => setBreathingSyncWordColor(e.target.value)}
                                    className="w-12 h-12 rounded-xl cursor-pointer border-none"
                                  />
                                  <div className="flex-1 flex items-center px-4 bg-white border rounded-xl text-sm text-slate-600">
                                    {breathingSyncWordColor.toUpperCase()}
                                  </div>
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
                                    const randomWord = POSITIVE_WORDS[Math.floor(Math.random() * POSITIVE_WORDS.length)];
                                    setBreathingSyncWord(randomWord);
                                  }}
                                >
                                  言葉を変更
                                </Button>
                              </div>
                            </>
                          )}
                        </>
                      )}
                    </div>

                    {/* 従来の文字設定 */}
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
                  </TabsContent>

                  <TabsContent value="background" className="space-y-8 mt-0">
                    <div className="space-y-4">
                      <Label className="text-sm font-semibold text-slate-700">背景モード</Label>
                      <Select value={backgroundMode} onValueChange={(val: any) => setBackgroundMode(val)}>
                        <SelectTrigger className="w-full h-12 rounded-xl bg-white">
                          <SelectValue placeholder="モードを選択" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gradient-auto">グラデーション（アニメーション）</SelectItem>
                          <SelectItem value="gradient-fixed">グラデーション（固定）</SelectItem>
                          <SelectItem value="white">白単色</SelectItem>
                          <SelectItem value="black">黒単色</SelectItem>
                          <SelectItem value="image">カスタム画像</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {backgroundMode === 'image' && (
                      <div className="space-y-4">
                        <Label className="text-sm font-semibold text-slate-700">画像をアップロード</Label>
                        <div 
                          className="border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 bg-white cursor-pointer hover:border-blue-400 transition-colors"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Upload className="text-slate-400" size={32} />
                          <span className="text-sm text-slate-500">クリックして画像を選択</span>
                          <input 
                            ref={fileInputRef} 
                            type="file" 
                            className="hidden" 
                            accept="image/*" 
                            onChange={handleImageUpload} 
                          />
                        </div>
                      </div>
                    )}
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
                          <Label className="text-sm font-semibold text-slate-700">色</Label>
                          <div className="flex gap-3">
                            <input 
                              type="color" 
                              value={breathingColor} 
                              onChange={(e) => setBreathingColor(e.target.value)}
                              className="w-12 h-12 rounded-xl cursor-pointer border-none"
                            />
                            <div className="flex-1 flex items-center px-4 bg-white border rounded-xl text-sm text-slate-600">
                              {breathingColor.toUpperCase()}
                            </div>
                          </div>
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
