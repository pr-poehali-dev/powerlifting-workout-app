import { useState } from 'react';
import Icon from '@/components/ui/icon';

const lifts = [
  {
    id: 'squat',
    name: 'Присед',
    icon: '🏋️',
    color: 'from-orange-500 to-red-600',
    tips: [
      { title: 'Постановка стоп', desc: 'Ширина чуть шире плеч, носки развёрнуты 30-45°. Найди позицию, комфортную для твоей анатомии.' },
      { title: 'Гриф на спине', desc: 'Хайбар — на трапециях, ниже. Лоубар — на задней дельте, ниже. Лоубар позволяет взять больший вес.' },
      { title: 'Начало движения', desc: 'Сделай глубокий вдох, надавить животом (пояс Вальсальвы). Отвести таз назад и вниз.' },
      { title: 'Глубина', desc: 'Складка бедра ниже колена — параллель. Большинство федераций требуют не менее параллели.' },
      { title: 'Подъём', desc: 'Толкай пол от себя, держи грудь вверх. Не позволяй коленям заваливаться внутрь.' },
    ],
    mistakes: ['Наклон вперёд на подъёме', 'Завал коленей внутрь', 'Подъём на носках', 'Неполная глубина'],
  },
  {
    id: 'bench',
    name: 'Жим',
    icon: '💪',
    color: 'from-red-600 to-pink-700',
    tips: [
      { title: 'Положение на скамье', desc: 'Глаза под грифом. Сведи лопатки и прижми к скамье. Создай арку — только не нарушай правила федерации.' },
      { title: 'Хват', desc: 'Большой палец охватывает гриф (не "безымянный хват"). Запястья прямые, гриф в основании ладони.' },
      { title: 'Опускание', desc: 'Контролируемо опускай на нижнюю часть груди. Локти под углом 45-75° к телу.' },
      { title: 'Команда "Жим"', desc: 'Штанга касается груди, пауза по команде судьи, затем мощный жим вверх и чуть назад.' },
      { title: 'Ноги', desc: 'Стопы полностью на полу (или на подставке). Жёсткая база — больший жим.' },
    ],
    mistakes: ['Отрыв таза от скамьи', 'Отскок от груди', 'Слишком широкий хват', 'Разгибание запястий'],
  },
  {
    id: 'deadlift',
    name: 'Тяга',
    icon: '⚡',
    color: 'from-purple-600 to-red-600',
    tips: [
      { title: 'Исходная позиция', desc: 'Гриф над серединой стопы. Ноги на ширине бёдер. Взяться за гриф чуть шире ног.' },
      { title: 'Захват', desc: 'Разнохват увеличивает удержание. Лямки разрешены в некоторых федерациях. Магнезия — везде.' },
      { title: 'Начало тяги', desc: 'Опусти бёдра, выпрями спину, грудь вверх. Штанга у голеней. Напряги спину ДО отрыва.' },
      { title: 'Подъём', desc: 'Толкай пол — как в приседе. Штанга ведётся по ногам. Бёдра и плечи поднимаются вместе.' },
      { title: 'Фиксация', desc: 'В верхней точке: плечи назад, бёдра выведены вперёд. Не гипер-экстензия поясницы.' },
    ],
    mistakes: ['Округление нижней спины', 'Отрыв за спину', 'Штанга уходит вперёд', 'Нет фиксации наверху'],
  },
];

export default function TechniquePage() {
  const [selected, setSelected] = useState(lifts[0]);
  const [openTip, setOpenTip] = useState<number | null>(null);

  return (
    <div className="slide-up pb-4">
      <div className="px-4 pt-4 pb-3">
        <h1 className="text-3xl text-foreground">Техника</h1>
        <p className="text-muted-foreground text-sm mt-1">Три соревновательных движения</p>
      </div>

      {/* Lift Selector */}
      <div className="flex gap-3 px-4 mb-4">
        {lifts.map((lift) => (
          <button
            key={lift.id}
            onClick={() => { setSelected(lift); setOpenTip(null); }}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
              selected.id === lift.id
                ? `bg-gradient-to-r ${lift.color} text-white`
                : 'bg-card border border-border text-muted-foreground'
            }`}
          >
            {lift.icon} {lift.name}
          </button>
        ))}
      </div>

      <div className="px-4 space-y-3">
        {/* Hero */}
        <div className={`bg-gradient-to-r ${selected.color} rounded-2xl p-5`}>
          <div className="text-5xl mb-2">{selected.icon}</div>
          <h2 className="text-2xl font-black text-white">{selected.name} со штангой</h2>
          <p className="text-white/70 text-sm mt-1">Пошаговая техника выполнения для пауэрлифтинга</p>
        </div>

        {/* Tips */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <span className="font-black text-foreground">Ключевые точки</span>
          </div>
          {selected.tips.map((tip, i) => (
            <div key={i} className="border-b border-border last:border-0">
              <button
                onClick={() => setOpenTip(openTip === i ? null : i)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left"
              >
                <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-black flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                <span className="flex-1 font-bold text-foreground text-sm">{tip.title}</span>
                <Icon
                  name="ChevronDown"
                  size={16}
                  className={`text-muted-foreground transition-transform ${openTip === i ? 'rotate-180' : ''}`}
                />
              </button>
              {openTip === i && (
                <div className="px-4 pb-3 pl-13">
                  <p className="text-muted-foreground text-sm leading-relaxed pl-9">{tip.desc}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Mistakes */}
        <div className="bg-card border border-border rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Icon name="AlertTriangle" size={18} className="text-destructive" />
            <span className="font-black text-foreground">Частые ошибки</span>
          </div>
          <div className="space-y-2">
            {selected.mistakes.map((m, i) => (
              <div key={i} className="flex items-center gap-3 bg-destructive/10 border border-destructive/20 rounded-xl px-3 py-2">
                <Icon name="X" size={14} className="text-destructive shrink-0" />
                <span className="text-sm text-foreground">{m}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Video Placeholder */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="aspect-video bg-muted flex flex-col items-center justify-center gap-3">
            <div className="w-16 h-16 rounded-full gradient-fire flex items-center justify-center">
              <Icon name="Play" size={24} className="text-white ml-1" />
            </div>
            <p className="text-muted-foreground text-sm font-medium">Разбор техники {selected.name}</p>
            <p className="text-muted-foreground text-xs">Видео в разработке</p>
          </div>
        </div>
      </div>
    </div>
  );
}
