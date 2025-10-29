import React, { useState } from 'react';
import { Button } from '@/components/Button';
import { Size } from '@/types';
import { useLocation } from 'react-router-dom';
import { useToast } from '@/store/toast';
import { AuthShell } from '@/components/Auth/AuthShell';
import { LoginForm } from '@/components/Auth/LoginForm';
import { RegisterForm } from '@/components/Auth/RegisterForm';
import { useBemm } from '../utils/bemm';

export const SignIn: React.FC = () => {
  const location = useLocation();
  const { addToast } = useToast();
  const [mode, setMode] = useState<'login' | 'register'>(location.pathname.endsWith('/register') ? 'register' : 'login');
  const bemm = useBemm('auth');

  const panelAction = (
    <Button
      size={Size.SMALL}
      onClick={() => {
        const newMode = mode === 'login' ? 'register' : 'login';
        // Only switch local mode to avoid route remount and flicker
        setMode(newMode);
      }}
      variant="ghost"
      icon={mode === 'login' ? 'user' : 'play'}
      tooltip={mode === 'login' ? 'Switch to Register' : 'Switch to Login'}
    >
      {mode === 'login' ? 'Register' : 'Login'}
    </Button>
  );

  return (
    <AuthShell panelTitle={mode === 'login' ? 'Login' : 'Register'} panelAction={panelAction}>
      {mode === 'login' ? (
        <LoginForm />
      ) : (
        <RegisterForm onBackToLogin={() => setMode('login')} />
      )}

      <fieldset className={bemm('social-login')}>
        <legend>Or continue with</legend>
        <div className="auth__social-icons" role="group" aria-label="Social sign-in" style={{ justifyContent: 'center' }}>
          <Button iconOnly style={{ '--button-color': '#4285F4', '--button-text': '#fff' } as React.CSSProperties} aria-label="Sign in with Google" onClick={() => addToast({ title: 'Google', message: 'Signed in with Google (mock)', variant: 'info' })} customIcon={<svg viewBox="0 0 210 210" aria-hidden><path fill="currentColor" d="M0,105C0,47.103,47.103,0,105,0c23.383,0,45.515,7.523,64.004,21.756l-24.4,31.696C133.172,44.652,119.477,40,105,40  c-35.841,0-65,29.159-65,65s29.159,65,65,65c28.867,0,53.398-18.913,61.852-45H105V85h105v20c0,57.897-47.103,105-105,105  S0,162.897,0,105z"/></svg>} />
          <Button iconOnly style={{ '--button-color': '#0A0A0A', '--button-text': '#fff' } as React.CSSProperties} aria-label="Sign in with Apple" onClick={() => addToast({ title: 'Apple', message: 'Signed in with Apple (mock)', variant: 'info' })} customIcon={<svg viewBox="0 0 24 24" fill="#fff" aria-hidden><path d="M16.365 1.43c0 1.14-.418 2.03-1.253 2.77-.837.74-1.85 1.13-3.04 1.17-.06-1.1.37-2.02 1.28-2.77.9-.76 1.96-1.19 3.01-1.17zM21.5 17.12c-.36.84-.8 1.61-1.34 2.33-.65.89-1.18 1.5-1.6 1.84-.64.59-1.33.9-2.08.93-.53 0-1.18-.15-1.95-.47-.78-.31-1.49-.47-2.13-.47-.68 0-1.4.16-2.18.47-.78.32-1.41.48-1.89.49-.73.03-1.43-.29-2.09-.95-.45-.41-1.01-1.06-1.67-1.97-.72-.98-1.31-2.1-1.76-3.37-.49-1.4-.73-2.76-.73-4.06 0-1.5.33-2.79.98-3.88.52-.9 1.22-1.62 2.11-2.16.89-.55 1.84-.83 2.86-.85.56 0 1.29.18 2.17.53.88.35 1.45.53 1.71.53.18 0 .79-.2 1.82-.59 1-.36 1.85-.5 2.52-.43 1.86.15 3.25.88 4.17 2.2-1.65 1-2.47 2.4-2.47 4.21 0 1.39.5 2.56 1.49 3.51.45.44.96.78 1.54 1.03-.13.39-.27.77-.44 1.15z"/></svg>} />
          <Button iconOnly style={{ '--button-color': '#24292E', '--button-text': '#fff' } as React.CSSProperties} aria-label="Sign in with GitHub" onClick={() => addToast({ title: 'GitHub', message: 'Signed in with GitHub (mock)', variant: 'info' })} customIcon={<svg viewBox="0 0 24 24" fill="#fff" aria-hidden><path d="M12 .5a11.5 11.5 0 0 0-3.63 22.42c.57.1.78-.24.78-.55l-.02-2.16c-3.2.7-3.87-1.54-3.87-1.54-.52-1.3-1.28-1.64-1.28-1.64-1.05-.72.08-.7.08-.7 1.16.08 1.78 1.2 1.78 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.76.4-1.27.72-1.56-2.56-.29-5.26-1.28-5.26-5.7 0-1.26.45-2.3 1.2-3.11-.12-.29-.52-1.46.12-3.04 0 0 .98-.32 3.2 1.19a11 11 0 0 1 5.82 0c2.22-1.5 3.2-1.19 3.2-1.19.64 1.58.24 2.75.12 3.04.75.81 1.2 1.85 1.2 3.11 0 4.43-2.7 5.4-5.28 5.68.42.36.78 1.07.78 2.16l-.02 3.2c0 .31.2.66.79.55A11.5 11.5 0 0 0 12 .5z"/></svg>} />
        </div>
      </fieldset>
    </AuthShell>
  );
}
