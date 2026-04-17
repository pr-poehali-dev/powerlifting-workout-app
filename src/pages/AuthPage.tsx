import { useState } from 'react';
import { api } from '@/lib/api';
import Icon from '@/components/ui/icon';

interface AuthPageProps {
  onAuth: (token: string, user: { id: number; name: string; email: string }) => void;
}

type Mode = 'login' | 'register';

export default function AuthPage({ onAuth }: AuthPageProps) {
  const [mode, setMode] = useState<Mode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setError('');
    if (!email || !password || (mode === 'register' && !name)) {
      setError('Заполни все поля');
      return;
    }
    setLoading(true);
    const res = mode === 'register'
      ? await api.auth.register(email, password, name)
      : await api.auth.login(email, password);
    setLoading(false);

    if (res.error) {
      setError(res.error);
      return;
    }
    api.saveToken(res.token);
    onAuth(res.token, res.user);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      {/* Logo */}
      <div className="text-center mb-10">
        <div className="text-5xl mb-3">🏋️</div>
        <h1 className="text-5xl font-black text-foreground">IRON<span className="text-primary">FORCE</span></h1>
        <p className="text-muted-foreground mt-2 text-sm">Приложение пауэрлифтера</p>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm bg-card border border-border rounded-2xl p-6 space-y-4">
        {/* Mode Toggle */}
        <div className="flex gap-1 bg-muted rounded-xl p-1 mb-2">
          <button
            onClick={() => { setMode('login'); setError(''); }}
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'login' ? 'gradient-fire text-white' : 'text-muted-foreground'}`}
          >
            Войти
          </button>
          <button
            onClick={() => { setMode('register'); setError(''); }}
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'register' ? 'gradient-fire text-white' : 'text-muted-foreground'}`}
          >
            Регистрация
          </button>
        </div>

        {mode === 'register' && (
          <div>
            <label className="text-xs text-muted-foreground font-medium mb-1 block">Имя</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Иван Петров"
              className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary"
            />
          </div>
        )}

        <div>
          <label className="text-xs text-muted-foreground font-medium mb-1 block">Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@email.com"
            className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="text-xs text-muted-foreground font-medium mb-1 block">Пароль</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Минимум 6 символов"
            onKeyDown={e => e.key === 'Enter' && submit()}
            className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary"
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-destructive/10 border border-destructive/30 rounded-xl px-3 py-2">
            <Icon name="AlertCircle" size={16} className="text-destructive shrink-0" />
            <span className="text-destructive text-sm">{error}</span>
          </div>
        )}

        <button
          onClick={submit}
          disabled={loading}
          className="w-full gradient-fire text-white font-black py-4 rounded-xl text-base tracking-wide disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Загрузка...
            </>
          ) : (
            mode === 'login' ? 'ВОЙТИ' : 'ЗАРЕГИСТРИРОВАТЬСЯ'
          )}
        </button>
      </div>

      <p className="text-muted-foreground text-xs mt-6 text-center">
        Твои данные хранятся безопасно
      </p>
    </div>
  );
}
