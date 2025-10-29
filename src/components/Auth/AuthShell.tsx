import React from 'react';
import { GradientCanvas } from '@/components/Auth/GradientCanvas';
import { Card } from '@/components/Card/Card';
import '@/components/Auth/auth.scss';
import { Colors } from '../../types';

type Props = {
  brandTitle?: string;
  brandSubtitle?: string;
  panelTitle?: string;
  panelAction?: React.ReactNode;
  children: React.ReactNode;
};

export const AuthShell: React.FC<Props> = ({ panelTitle, panelAction, children }) => {
  return (
    <div className="auth-page" style={{ position: 'relative', zIndex: 1 }}>
      <GradientCanvas />
      <div className="auth__shell">
        <div className="auth__panel">
          <Card color={Colors.PRIMARY} title={panelTitle} actions={panelAction}>
            {children}
          </Card>
        </div>
      </div>
    </div>
  );
};

