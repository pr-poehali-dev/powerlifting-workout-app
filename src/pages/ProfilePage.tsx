import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';

const friends = [
  { name: 'Алексей М.', squat: 250, bench: 180, deadlift: 290, total: 720, category: '-93', avatar: 'A' },
  { name: 'Дмитрий К.', squat: 230, bench: 170, deadlift: 280, total: 680, category: '-83', avatar: 'Д' },
  { name: 'Сергей В.', squat: 200, bench: 145, deadlift: 240, total: 585, category: '-74', avatar: 'С' },
  { name: 'Игорь П.', squat: 210, bench: 155, deadlift: 250, total: 615, category: '-83', avatar: 'И' },
];

const me = {
  name: 'Ты',
  squat: 180,
  bench: 120,
  deadlift: 200,
  total: 500,
  category: '-93',
  wilks: 312,
  avatar: 'Я',
  trainings: 48,
  streak: 12,
};

type SocialTab = 'compare' | 'feed' | 'community';

const feed = [
  { user: 'Алексей М.', action: 'Установил рекорд', detail: 'Присед 252 кг 🏆', time: '2 ч назад' },
  { user: 'Дмитрий К.', action: 'Завершил тренировку', detail: 'День Б — 5/3/1', time: '5 ч назад' },
  { user: 'Сергей В.', action: 'Достижение', detail: 'Wilks 300+ 💪', time: '1 день назад' },
];

export default function ProfilePage() {
  const [socialTab, setSocialTab] = useState<SocialTab>('compare');
  const [sortBy, setSortBy] = useState<'total' | 'squat' | 'bench' | 'deadlift'>('total');

  const sorted = [...friends, { ...me, isMe: true }].sort((a, b) => b[sortBy] - a[sortBy]);

  return (
    <div className="slide-up pb-4">
      {/* Profile Header */}
      <div className="gradient-fire mx-4 mt-4 rounded-2xl p-5">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-black text-white">
            {me.avatar}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-black text-white">Мой профиль</h2>
            <p className="text-white/70 text-sm">Категория -{me.category} кг • Wilks {me.wilks}</p>
          </div>
          <button className="bg-white/20 rounded-xl p-2">
            <Icon name="Settings" size={18} className="text-white" />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="bg-white/10 rounded-xl p-2 text-center">
            <div className="text-xl font-black text-white">{me.total}</div>
            <div className="text-white/60 text-xs">кг сумма</div>
          </div>
          <div className="bg-white/10 rounded-xl p-2 text-center">
            <div className="text-xl font-black text-white">{me.trainings}</div>
            <div className="text-white/60 text-xs">тренировок</div>
          </div>
          <div className="bg-white/10 rounded-xl p-2 text-center">
            <div className="text-xl font-black text-white">{me.streak}</div>
            <div className="text-white/60 text-xs">🔥 дней подряд</div>
          </div>
        </div>
      </div>

      {/* My PRs */}
      <div className="px-4 mt-4">
        <h2 className="text-2xl text-foreground mb-3">Мои рекорды</h2>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Присед', value: me.squat },
            { label: 'Жим', value: me.bench },
            { label: 'Тяга', value: me.deadlift },
          ].map((item) => (
            <div key={item.label} className="bg-card border border-border rounded-xl p-3 text-center">
              <div className="text-2xl font-black text-primary">{item.value}</div>
              <div className="text-xs text-muted-foreground">кг</div>
              <div className="text-sm text-foreground font-medium mt-0.5">{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Social Section */}
      <div className="px-4 mt-4">
        <h2 className="text-2xl text-foreground mb-3">Социальное</h2>

        {/* Social Tabs */}
        <div className="flex gap-1 bg-card border border-border rounded-2xl p-1 mb-4">
          {([
            { id: 'compare', label: 'Сравнение' },
            { id: 'feed', label: 'Лента' },
            { id: 'community', label: 'Сообщество' },
          ] as { id: SocialTab; label: string }[]).map((t) => (
            <button
              key={t.id}
              onClick={() => setSocialTab(t.id)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                socialTab === t.id ? 'gradient-fire text-white' : 'text-muted-foreground'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {socialTab === 'compare' && (
          <div className="space-y-3">
            {/* Sort */}
            <div className="flex gap-2 overflow-x-auto">
              {(['total', 'squat', 'bench', 'deadlift'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSortBy(s)}
                  className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    sortBy === s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {s === 'total' ? 'Сумма' : s === 'squat' ? 'Присед' : s === 'bench' ? 'Жим' : 'Тяга'}
                </button>
              ))}
            </div>

            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              {sorted.map((user, i) => {
                const isMe = 'isMe' in user && user.isMe;
                return (
                  <div
                    key={user.name}
                    className={`flex items-center gap-3 px-4 py-3 border-b border-border last:border-0 ${isMe ? 'bg-primary/5 border-l-2 border-l-primary' : ''}`}
                  >
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${
                      i === 0 ? 'bg-energy text-black' : 'bg-muted text-muted-foreground'
                    }`}>
                      {i + 1}
                    </div>
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center font-bold text-xs text-foreground">
                      {user.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`font-bold text-sm ${isMe ? 'text-primary' : 'text-foreground'}`}>
                        {user.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {user.squat}/{user.bench}/{user.deadlift}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-black text-foreground">{user[sortBy]}</div>
                      <div className="text-xs text-muted-foreground">кг</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {socialTab === 'feed' && (
          <div className="space-y-3">
            {feed.map((item, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-4 flex gap-3">
                <div className="w-10 h-10 rounded-full gradient-fire flex items-center justify-center font-black text-white text-sm shrink-0">
                  {item.user[0]}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-foreground text-sm">{item.user}</span>
                    <span className="text-muted-foreground text-xs">{item.action}</span>
                  </div>
                  <p className="text-foreground font-medium text-sm mt-0.5">{item.detail}</p>
                  <p className="text-muted-foreground text-xs mt-1">{item.time}</p>
                </div>
              </div>
            ))}
            <button className="w-full border border-dashed border-border rounded-2xl py-4 text-muted-foreground text-sm font-medium">
              Загрузить ещё
            </button>
          </div>
        )}

        {socialTab === 'community' && (
          <div className="space-y-3">
            <div className="bg-card border border-border rounded-2xl p-5 text-center">
              <div className="text-4xl mb-2">🌍</div>
              <h3 className="font-black text-foreground text-lg mb-1">Мировой рейтинг</h3>
              <p className="text-muted-foreground text-sm mb-4">Сравни себя со спортсменами со всего мира по Wilks коэффициенту</p>
              <Badge className="bg-muted text-muted-foreground border-border text-xs mb-4 block w-fit mx-auto">
                Твой Wilks: {me.wilks} • Топ ~35%
              </Badge>
              <button className="w-full gradient-fire text-white font-bold py-3 rounded-xl text-sm">
                ВОЙТИ В МИРОВОЙ ТОП
              </button>
            </div>

            <div className="bg-card border border-border rounded-2xl p-4">
              <h3 className="font-black text-foreground mb-3">Найти друзей</h3>
              <input
                type="text"
                placeholder="Поиск по имени или нику..."
                className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground text-sm focus:outline-none focus:border-primary"
              />
              <button className="w-full mt-3 bg-secondary border border-border text-foreground font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2">
                <Icon name="UserPlus" size={16} />
                Пригласить из контактов
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
