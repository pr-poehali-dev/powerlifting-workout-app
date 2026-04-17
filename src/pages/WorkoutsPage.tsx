import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';

const programs = [
  {
    id: 1,
    name: 'Стартовая сила',
    level: 'Новичок',
    days: 3,
    focus: 'Сила',
    color: 'from-orange-500 to-red-600',
    weeks: 12,
  },
  {
    id: 2,
    name: '5/3/1 Вендлер',
    level: 'Средний',
    days: 4,
    focus: 'Пауэрлифтинг',
    color: 'from-red-600 to-pink-700',
    weeks: 16,
  },
  {
    id: 3,
    name: 'Шейко №29',
    level: 'Продвинутый',
    days: 4,
    focus: 'Соревнования',
    color: 'from-purple-600 to-red-600',
    weeks: 8,
  },
];

const exercises = [
  { name: 'Присед со штангой', group: 'Ноги', sets: 5, reps: 5, weight: 140 },
  { name: 'Жим лёжа', group: 'Грудь', sets: 5, reps: 5, weight: 100 },
  { name: 'Становая тяга', group: 'Спина', sets: 1, reps: 5, weight: 160 },
  { name: 'Жим стоя', group: 'Плечи', sets: 5, reps: 5, weight: 70 },
  { name: 'Тяга штанги в наклоне', group: 'Спина', sets: 5, reps: 5, weight: 90 },
];

type Tab = 'programs' | 'custom';

export default function WorkoutsPage() {
  const [tab, setTab] = useState<Tab>('programs');
  const [completedSets, setCompletedSets] = useState<Record<string, boolean>>({});

  const toggleSet = (key: string) => {
    setCompletedSets(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="slide-up pb-4">
      <div className="px-4 pt-4 pb-3">
        <h1 className="text-3xl text-foreground">Тренировки</h1>
        <p className="text-muted-foreground text-sm mt-1">Программы и упражнения</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 px-4 mb-4">
        {(['programs', 'custom'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${
              tab === t
                ? 'gradient-fire text-white'
                : 'bg-card border border-border text-muted-foreground'
            }`}
          >
            {t === 'programs' ? 'Программы' : 'Сегодня'}
          </button>
        ))}
      </div>

      {tab === 'programs' && (
        <div className="px-4 space-y-3">
          {programs.map((prog) => (
            <div
              key={prog.id}
              className="bg-card border border-border rounded-2xl overflow-hidden card-glow-hover transition-all cursor-pointer"
            >
              <div className={`h-2 bg-gradient-to-r ${prog.color}`} />
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-black text-foreground text-lg">{prog.name}</h3>
                    <p className="text-muted-foreground text-sm mt-0.5">{prog.weeks} недель • {prog.days} дня в неделю</p>
                  </div>
                  <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
                    {prog.focus}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 mt-3">
                  <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
                    prog.level === 'Новичок' ? 'bg-green-500/20 text-green-400' :
                    prog.level === 'Средний' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {prog.level}
                  </span>
                  <button className="ml-auto text-primary text-sm font-bold flex items-center gap-1">
                    Начать <Icon name="ChevronRight" size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="border-2 border-dashed border-border rounded-2xl p-6 text-center">
            <Icon name="Plus" size={32} className="text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground font-medium">Создать свою программу</p>
          </div>
        </div>
      )}

      {tab === 'custom' && (
        <div className="px-4 space-y-3">
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon name="Flame" size={18} className="text-primary" />
                <span className="font-black text-foreground">День А — Приседания</span>
              </div>
              <span className="text-muted-foreground text-xs">45 мин</span>
            </div>

            {exercises.map((ex, i) => (
              <div key={i} className="px-4 py-3 border-b border-border last:border-0">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="font-bold text-foreground text-sm">{ex.name}</span>
                    <span className="ml-2 text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{ex.group}</span>
                  </div>
                  <span className="text-primary font-black">{ex.weight} кг</span>
                </div>
                <div className="flex gap-2">
                  {Array.from({ length: ex.sets }).map((_, s) => {
                    const key = `${i}-${s}`;
                    const done = completedSets[key];
                    return (
                      <button
                        key={s}
                        onClick={() => toggleSet(key)}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                          done
                            ? 'gradient-fire text-white'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {done ? '✓' : `${ex.reps}×`}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <button className="w-full gradient-fire text-white font-black py-4 rounded-2xl text-base tracking-wide">
            ЗАВЕРШИТЬ ТРЕНИРОВКУ
          </button>
        </div>
      )}
    </div>
  );
}
