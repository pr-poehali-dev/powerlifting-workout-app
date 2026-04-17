import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';

const quotes = [
  'ЖИМ. ПРИСЕД. ТЯГА. ПОВТОРИ.',
  'СЛАБОСТЬ — ЭТО ВЫБОР.',
  'БАР НЕ ВРЁТ.',
  'КАЖДЫЙ КГ — ЭТО ПОБЕДА.',
];

const todayWorkout = {
  name: 'День А — Присед + Жим',
  exercises: [
    { name: 'Присед', sets: '5×5', weight: '140 кг' },
    { name: 'Жим лёжа', sets: '5×5', weight: '100 кг' },
    { name: 'Тяга штанги', sets: '1×5', weight: '160 кг' },
  ],
};

const stats = [
  { label: 'Присед', value: '180', unit: 'кг' },
  { label: 'Жим', value: '120', unit: 'кг' },
  { label: 'Тяга', value: '200', unit: 'кг' },
  { label: 'Сумма', value: '500', unit: 'кг' },
];

const leaderboard = [
  { rank: 1, name: 'Алексей М.', total: 720, category: '-93 кг' },
  { rank: 2, name: 'Дмитрий К.', total: 680, category: '-83 кг' },
  { rank: 3, name: 'Ты', total: 500, category: '-93 кг', isMe: true },
];

export default function HomePage() {
  const quote = quotes[Math.floor(Date.now() / 86400000) % quotes.length];

  return (
    <div className="slide-up space-y-4 pb-4">
      {/* Hero Banner */}
      <div className="gradient-fire rounded-2xl p-6 mx-4 mt-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-2 right-4 text-8xl font-black text-white">⚡</div>
        </div>
        <p className="text-xs font-bold uppercase tracking-widest text-white/70 mb-1">Мотивация дня</p>
        <h1 className="text-3xl font-black text-white leading-tight">{quote}</h1>
        <div className="mt-4 flex items-center gap-2">
          <span className="pulse-dot inline-block w-2 h-2 rounded-full bg-white" />
          <span className="text-white/80 text-sm font-medium">Тренировка запланирована на сегодня</span>
        </div>
      </div>

      {/* Personal Records */}
      <div className="px-4">
        <h2 className="text-2xl text-foreground mb-3">Мои рекорды</h2>
        <div className="grid grid-cols-4 gap-2">
          {stats.map((s) => (
            <div key={s.label} className="bg-card border border-border rounded-xl p-3 text-center card-glow-hover transition-all">
              <div className="text-xl font-black text-primary leading-none">{s.value}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">{s.unit}</div>
              <div className="text-[11px] text-foreground mt-1 font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Today's Workout */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-2xl text-foreground">Сегодня</h2>
          <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">Запланировано</Badge>
        </div>
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center gap-2">
            <Icon name="Dumbbell" size={18} className="text-primary" />
            <span className="font-bold text-foreground">{todayWorkout.name}</span>
          </div>
          {todayWorkout.exercises.map((ex, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-3 border-b border-border last:border-0">
              <span className="text-foreground font-medium">{ex.name}</span>
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground text-sm">{ex.sets}</span>
                <span className="text-primary font-bold">{ex.weight}</span>
              </div>
            </div>
          ))}
          <div className="px-4 py-3">
            <button className="w-full gradient-fire text-white font-bold py-3 rounded-xl text-sm tracking-wide">
              НАЧАТЬ ТРЕНИРОВКУ
            </button>
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-2xl text-foreground">Сообщество</h2>
          <button className="text-primary text-sm font-medium">Все →</button>
        </div>
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          {leaderboard.map((user) => (
            <div
              key={user.rank}
              className={`flex items-center gap-3 px-4 py-3 border-b border-border last:border-0 ${user.isMe ? 'bg-primary/5' : ''}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${
                user.rank === 1 ? 'bg-energy text-black' :
                user.rank === 2 ? 'bg-muted text-muted-foreground' :
                'bg-muted text-muted-foreground'
              }`}>
                {user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : '#3'}
              </div>
              <div className="flex-1">
                <div className={`font-bold text-sm ${user.isMe ? 'text-primary' : 'text-foreground'}`}>
                  {user.name} {user.isMe && <span className="text-xs text-muted-foreground">(ты)</span>}
                </div>
                <div className="text-xs text-muted-foreground">{user.category}</div>
              </div>
              <div className="text-right">
                <div className="font-black text-foreground">{user.total}</div>
                <div className="text-xs text-muted-foreground">кг сумма</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
