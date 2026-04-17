import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { api } from '@/lib/api';
import type { AppUser } from './Index';

const lifts = ['Присед', 'Жим', 'Тяга', 'Сумма'];

const data: Record<string, { date: string; weight: number }[]> = {
  'Присед': [
    { date: '01.01', weight: 120 },
    { date: '15.01', weight: 127 },
    { date: '01.02', weight: 130 },
    { date: '15.02', weight: 135 },
    { date: '01.03', weight: 140 },
    { date: '15.03', weight: 145 },
    { date: '01.04', weight: 152 },
    { date: '15.04', weight: 158 },
    { date: '01.05', weight: 162 },
    { date: '15.05', weight: 168 },
    { date: '01.06', weight: 175 },
    { date: '15.06', weight: 180 },
  ],
  'Жим': [
    { date: '01.01', weight: 80 },
    { date: '15.01', weight: 85 },
    { date: '01.02', weight: 87 },
    { date: '15.02', weight: 90 },
    { date: '01.03', weight: 92 },
    { date: '15.03', weight: 95 },
    { date: '01.04', weight: 97 },
    { date: '15.04', weight: 100 },
    { date: '01.05', weight: 102 },
    { date: '15.05', weight: 107 },
    { date: '01.06', weight: 112 },
    { date: '15.06', weight: 120 },
  ],
  'Тяга': [
    { date: '01.01', weight: 140 },
    { date: '15.01', weight: 145 },
    { date: '01.02', weight: 150 },
    { date: '15.02', weight: 155 },
    { date: '01.03', weight: 160 },
    { date: '15.03', weight: 162 },
    { date: '01.04', weight: 168 },
    { date: '15.04', weight: 175 },
    { date: '01.05', weight: 178 },
    { date: '15.05', weight: 185 },
    { date: '01.06', weight: 192 },
    { date: '15.06', weight: 200 },
  ],
  'Сумма': [
    { date: '01.01', weight: 340 },
    { date: '15.01', weight: 357 },
    { date: '01.02', weight: 367 },
    { date: '15.02', weight: 380 },
    { date: '01.03', weight: 392 },
    { date: '15.03', weight: 402 },
    { date: '01.04', weight: 417 },
    { date: '15.04', weight: 433 },
    { date: '01.05', weight: 442 },
    { date: '15.05', weight: 460 },
    { date: '01.06', weight: 479 },
    { date: '15.06', weight: 500 },
  ],
};

function MiniChart({ points }: { points: { date: string; weight: number }[] }) {
  const max = Math.max(...points.map(p => p.weight));
  const min = Math.min(...points.map(p => p.weight));
  const range = max - min || 1;
  const w = 100 / (points.length - 1);

  const svgPoints = points.map((p, i) => {
    const x = i * w;
    const y = 100 - ((p.weight - min) / range) * 80 - 10;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg viewBox="0 0 100 100" className="w-full h-28" preserveAspectRatio="none">
      <defs>
        <linearGradient id="chartGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="hsl(18 100% 55%)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="hsl(18 100% 55%)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={`0,100 ${svgPoints} 100,100`}
        fill="url(#chartGrad)"
      />
      <polyline
        points={svgPoints}
        fill="none"
        stroke="hsl(18 100% 55%)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {points.map((p, i) => {
        const x = i * w;
        const y = 100 - ((p.weight - min) / range) * 80 - 10;
        return i === points.length - 1 ? (
          <circle key={i} cx={x} cy={y} r="3" fill="hsl(18 100% 55%)" />
        ) : null;
      })}
    </svg>
  );
}

const achievements = [
  { icon: '🏆', title: 'Первые 100 кг в жиме', date: '15.04', done: true },
  { icon: '💪', title: 'Сумма 500 кг', date: '15.06', done: true },
  { icon: '⚡', title: 'Тяга 200 кг', date: '15.06', done: true },
  { icon: '🎯', title: 'Присед 200 кг', date: '—', done: false },
  { icon: '🔥', title: 'Wilks 400+', date: '—', done: false },
];

function AddRecordForm({ onAdded }: { onAdded: () => void }) {
  const [open, setOpen] = useState(false);
  const [lift, setLift] = useState('squat');
  const [weight, setWeight] = useState('');
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!weight) return;
    setSaving(true);
    await api.records.add(lift, Number(weight));
    setSaving(false);
    setWeight('');
    setOpen(false);
    onAdded();
  };

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="w-full gradient-fire text-white font-black py-4 rounded-2xl text-sm tracking-wide flex items-center justify-center gap-2">
        <Icon name="Plus" size={18} />
        ДОБАВИТЬ РЕЗУЛЬТАТ
      </button>
    );
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
      <h3 className="font-black text-foreground">Новый результат</h3>
      <select
        value={lift}
        onChange={e => setLift(e.target.value)}
        className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary"
      >
        <option value="squat">Присед</option>
        <option value="bench">Жим лёжа</option>
        <option value="deadlift">Становая тяга</option>
      </select>
      <input
        type="number"
        value={weight}
        onChange={e => setWeight(e.target.value)}
        placeholder="Вес (кг)"
        className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary"
      />
      <div className="flex gap-2">
        <button onClick={() => setOpen(false)} className="flex-1 bg-muted border border-border text-muted-foreground font-bold py-3 rounded-xl text-sm">
          Отмена
        </button>
        <button onClick={save} disabled={saving} className="flex-1 gradient-fire text-white font-black py-3 rounded-xl text-sm">
          {saving ? 'Сохраняю...' : 'Сохранить'}
        </button>
      </div>
    </div>
  );
}

interface ProgressPageProps {
  user: AppUser;
}

export default function ProgressPage({ user: _user }: ProgressPageProps) {
  const [selectedLift, setSelectedLift] = useState('Присед');
  const [liveHistory, setLiveHistory] = useState<{ lift: string; weight: number; date: string }[]>([]);

  useEffect(() => {
    api.records.getAll().then(res => {
      if (res.history) setLiveHistory(res.history);
    }).catch(() => {});
  }, []);

  const liftKey: Record<string, string> = { 'Присед': 'squat', 'Жим': 'bench', 'Тяга': 'deadlift' };
  const currentKey = liftKey[selectedLift];

  const filteredHistory = currentKey
    ? liveHistory.filter(r => r.lift === currentKey).map(r => ({ date: r.date.slice(5).replace('-', '.'), weight: r.weight }))
    : [];

  const points = filteredHistory.length >= 2 ? filteredHistory : data[selectedLift];
  const first = points[0].weight;
  const last = points[points.length - 1].weight;
  const gain = last - first;

  return (
    <div className="slide-up pb-4">
      <div className="px-4 pt-4 pb-3">
        <h1 className="text-3xl text-foreground">Прогресс</h1>
        <p className="text-muted-foreground text-sm mt-1">Динамика за 6 месяцев</p>
      </div>

      {/* Lift Tabs */}
      <div className="flex gap-1 px-4 mb-4 overflow-x-auto">
        {lifts.map((lift) => (
          <button
            key={lift}
            onClick={() => setSelectedLift(lift)}
            className={`shrink-0 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              selectedLift === lift
                ? 'gradient-fire text-white'
                : 'bg-card border border-border text-muted-foreground'
            }`}
          >
            {lift}
          </button>
        ))}
      </div>

      <div className="px-4 space-y-4">
        {/* Chart Card */}
        <div className="bg-card border border-border rounded-2xl p-4">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-black text-foreground text-lg">{selectedLift}</h3>
            <div className="flex items-center gap-1 text-green-400 font-bold text-sm">
              <Icon name="TrendingUp" size={16} />
              +{gain} кг
            </div>
          </div>
          <div className="flex items-baseline gap-1 mb-3">
            <span className="text-4xl font-black text-primary">{last}</span>
            <span className="text-muted-foreground font-medium">кг</span>
            <span className="text-muted-foreground text-sm ml-2">личный рекорд</span>
          </div>
          <MiniChart points={points} />
          <div className="flex justify-between mt-1">
            {points.filter((_, i) => i % 2 === 0).map((p, i) => (
              <span key={i} className="text-[10px] text-muted-foreground">{p.date}</span>
            ))}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-card border border-border rounded-xl p-3 text-center">
            <div className="text-xl font-black text-foreground">{first}</div>
            <div className="text-xs text-muted-foreground mt-0.5">Старт</div>
          </div>
          <div className="bg-card border border-border rounded-xl p-3 text-center">
            <div className="text-xl font-black text-primary">{last}</div>
            <div className="text-xs text-muted-foreground mt-0.5">Сейчас</div>
          </div>
          <div className="bg-card border border-border rounded-xl p-3 text-center">
            <div className="text-xl font-black text-green-400">+{gain}</div>
            <div className="text-xs text-muted-foreground mt-0.5">Прирост</div>
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <span className="font-black text-foreground">Достижения</span>
          </div>
          {achievements.map((ach, i) => (
            <div key={i} className={`flex items-center gap-3 px-4 py-3 border-b border-border last:border-0 ${!ach.done ? 'opacity-40' : ''}`}>
              <span className="text-2xl">{ach.icon}</span>
              <div className="flex-1">
                <div className="font-bold text-sm text-foreground">{ach.title}</div>
                <div className="text-xs text-muted-foreground">{ach.done ? `Получено ${ach.date}` : 'Ещё не выполнено'}</div>
              </div>
              {ach.done && <Icon name="CheckCircle" size={18} className="text-green-400" />}
            </div>
          ))}
        </div>

        {/* Add Record */}
        <AddRecordForm onAdded={() => {
          api.records.getAll().then(res => { if (res.history) setLiveHistory(res.history); });
        }} />
      </div>
    </div>
  );
}