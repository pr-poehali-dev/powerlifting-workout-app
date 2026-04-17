import { useState } from 'react';
import Icon from '@/components/ui/icon';

type CalcTab = '1rm' | 'wilks' | 'ipf';

function calc1RM(weight: number, reps: number): number {
  if (reps === 1) return weight;
  return Math.round(weight * (1 + reps / 30));
}

function calcWilks(total: number, bodyweight: number, isMale: boolean): number {
  const mCoef = [-216.0475144, 16.2606339, -0.002388645, -0.00113732, 7.01863e-6, -1.291e-8];
  const fCoef = [594.31747775582, -27.23842536447, 0.82112226871, -0.00930733913, 4.731582e-5, -9.054e-8];
  const coef = isMale ? mCoef : fCoef;
  const bw = bodyweight;
  const denom = coef[0] + coef[1]*bw + coef[2]*bw**2 + coef[3]*bw**3 + coef[4]*bw**4 + coef[5]*bw**5;
  return Math.round((total / denom) * 500 * 10) / 10;
}

function calcIPF(total: number, bodyweight: number, isMale: boolean): number {
  const a = isMale ? 1199.72839 : 610.32796;
  const b = isMale ? 1025.18162 : 1045.59282;
  const c = isMale ? 0.009210601 : 0.03048956;
  const gl = a - b * Math.exp(-c * bodyweight);
  return Math.round((total / gl * 100) * 10) / 10;
}

export default function CalculatorPage() {
  const [tab, setTab] = useState<CalcTab>('1rm');
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [bw, setBw] = useState('');
  const [squat, setSquat] = useState('');
  const [bench, setBench] = useState('');
  const [deadlift, setDeadlift] = useState('');
  const [isMale, setIsMale] = useState(true);

  const rm = weight && reps ? calc1RM(Number(weight), Number(reps)) : null;
  const total = Number(squat) + Number(bench) + Number(deadlift);
  const wilks = total && bw ? calcWilks(total, Number(bw), isMale) : null;
  const ipf = total && bw ? calcIPF(total, Number(bw), isMale) : null;

  const tabs: { id: CalcTab; label: string }[] = [
    { id: '1rm', label: '1RM' },
    { id: 'wilks', label: 'Wilks' },
    { id: 'ipf', label: 'IPF Points' },
  ];

  return (
    <div className="slide-up pb-4">
      <div className="px-4 pt-4 pb-3">
        <h1 className="text-3xl text-foreground">Калькулятор</h1>
        <p className="text-muted-foreground text-sm mt-1">Расчёт силовых показателей</p>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-1 px-4 mb-4 bg-card border border-border rounded-2xl mx-4 p-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${
              tab === t.id ? 'gradient-fire text-white' : 'text-muted-foreground'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="px-4 space-y-4">
        {tab === '1rm' && (
          <>
            <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
              <h3 className="font-black text-foreground text-lg">Максимум за 1 повтор</h3>
              <p className="text-muted-foreground text-sm">Введи рабочий вес и количество повторений</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground font-medium mb-1 block">Вес (кг)</label>
                  <input
                    type="number"
                    value={weight}
                    onChange={e => setWeight(e.target.value)}
                    placeholder="100"
                    className="w-full bg-muted border border-border rounded-xl px-3 py-3 text-foreground text-base font-bold focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-medium mb-1 block">Повторения</label>
                  <input
                    type="number"
                    value={reps}
                    onChange={e => setReps(e.target.value)}
                    placeholder="5"
                    className="w-full bg-muted border border-border rounded-xl px-3 py-3 text-foreground text-base font-bold focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
            </div>

            {rm && (
              <div className="gradient-fire rounded-2xl p-6 text-center">
                <p className="text-white/70 text-sm font-bold uppercase tracking-wider mb-1">Твой 1RM</p>
                <div className="text-6xl font-black text-white">{rm}</div>
                <div className="text-white/80 text-lg font-bold">кг</div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  {[60, 70, 80, 85, 90, 95].map(pct => (
                    <div key={pct} className="bg-white/10 rounded-xl py-2">
                      <div className="text-white font-black">{Math.round(rm * pct / 100)}</div>
                      <div className="text-white/60 text-xs">{pct}%</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {(tab === 'wilks' || tab === 'ipf') && (
          <>
            <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
              <h3 className="font-black text-foreground text-lg">
                {tab === 'wilks' ? 'Коэффициент Wilks' : 'IPF Points'}
              </h3>

              <div className="flex gap-2">
                <button
                  onClick={() => setIsMale(true)}
                  className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${isMale ? 'gradient-fire text-white' : 'bg-muted text-muted-foreground'}`}
                >
                  Мужчины
                </button>
                <button
                  onClick={() => setIsMale(false)}
                  className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${!isMale ? 'gradient-fire text-white' : 'bg-muted text-muted-foreground'}`}
                >
                  Женщины
                </button>
              </div>

              <div>
                <label className="text-xs text-muted-foreground font-medium mb-1 block">Собственный вес (кг)</label>
                <input
                  type="number"
                  value={bw}
                  onChange={e => setBw(e.target.value)}
                  placeholder="93"
                  className="w-full bg-muted border border-border rounded-xl px-3 py-3 text-foreground text-base font-bold focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'Присед', val: squat, set: setSquat },
                  { label: 'Жим', val: bench, set: setBench },
                  { label: 'Тяга', val: deadlift, set: setDeadlift },
                ].map(({ label, val, set }) => (
                  <div key={label}>
                    <label className="text-xs text-muted-foreground font-medium mb-1 block">{label} (кг)</label>
                    <input
                      type="number"
                      value={val}
                      onChange={e => set(e.target.value)}
                      placeholder="0"
                      className="w-full bg-muted border border-border rounded-xl px-3 py-3 text-foreground text-base font-bold focus:outline-none focus:border-primary"
                    />
                  </div>
                ))}
              </div>

              {total > 0 && (
                <div className="flex items-center justify-between border-t border-border pt-3">
                  <span className="text-muted-foreground text-sm font-medium">Сумма:</span>
                  <span className="text-primary font-black text-lg">{total} кг</span>
                </div>
              )}
            </div>

            {tab === 'wilks' && wilks && (
              <div className="gradient-fire rounded-2xl p-6 text-center">
                <p className="text-white/70 text-sm font-bold uppercase tracking-wider mb-1">Wilks Score</p>
                <div className="text-6xl font-black text-white">{wilks}</div>
                <div className="mt-4 bg-white/10 rounded-xl p-3 text-sm text-white/80">
                  {wilks < 200 ? 'Новичок' : wilks < 300 ? 'Любитель' : wilks < 400 ? 'Продвинутый' : wilks < 500 ? 'Элита' : 'Мировой уровень'}
                </div>
              </div>
            )}

            {tab === 'ipf' && ipf && (
              <div className="gradient-fire rounded-2xl p-6 text-center">
                <p className="text-white/70 text-sm font-bold uppercase tracking-wider mb-1">IPF GL Points</p>
                <div className="text-6xl font-black text-white">{ipf}</div>
                <div className="mt-4 bg-white/10 rounded-xl p-3 text-sm text-white/80">
                  {ipf < 50 ? 'Региональный уровень' : ipf < 70 ? 'Национальный уровень' : ipf < 85 ? 'Международный уровень' : 'Мировой топ'}
                </div>
              </div>
            )}
          </>
        )}

        {/* Info Card */}
        <div className="bg-card border border-border rounded-2xl p-4 flex gap-3">
          <Icon name="Info" size={18} className="text-primary shrink-0 mt-0.5" />
          <p className="text-muted-foreground text-xs leading-relaxed">
            {tab === '1rm'
              ? 'Формула Эпли: 1RM = Вес × (1 + Повторения / 30). Используется для планирования нагрузки.'
              : tab === 'wilks'
              ? 'Wilks — стандартный коэффициент для сравнения спортсменов разных весовых категорий.'
              : 'IPF GL Points — официальная система рейтинга Международной федерации пауэрлифтинга.'}
          </p>
        </div>
      </div>
    </div>
  );
}
