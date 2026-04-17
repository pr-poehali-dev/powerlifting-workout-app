import Icon from '@/components/ui/icon';

interface BottomNavProps {
  active: string;
  onChange: (tab: string) => void;
}

const navItems = [
  { id: 'home', label: 'Главная', icon: 'Home' },
  { id: 'workouts', label: 'Тренировки', icon: 'Dumbbell' },
  { id: 'calculator', label: 'Калькулятор', icon: 'Calculator' },
  { id: 'technique', label: 'Техника', icon: 'PlayCircle' },
  { id: 'progress', label: 'Прогресс', icon: 'TrendingUp' },
  { id: 'profile', label: 'Профиль', icon: 'User' },
];

export default function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border">
      <div className="flex items-center justify-around px-1 py-2">
        {navItems.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-all ${
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <div className={`relative ${isActive ? 'scale-110' : ''} transition-transform`}>
                {isActive && (
                  <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                )}
                <Icon name={item.icon} size={22} />
              </div>
              <span className="text-[10px] font-medium leading-none">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
