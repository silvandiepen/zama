import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { useThemeColors } from './useThemeColors';

type Props = { data: number[] };

export const Line14d: React.FC<Props> = ({ data }) => {
  const { primary, grid, text } = useThemeColors();
  
  const chartData = Array.from({ length: 14 }, (_, i) => ({
    day: `D-${13 - i}`,
    requests: data[i] ?? 0,
  }));

  return (
    <ResponsiveContainer width="100%" height={180}>
      <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
        <defs>
          <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={primary} stopOpacity={0.8}/>
            <stop offset="95%" stopColor={primary} stopOpacity={0.1}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={grid} />
        <XAxis 
          dataKey="day" 
          stroke={text}
          tick={{ fontSize: 12 }}
        />
        <YAxis 
          stroke={text}
          tick={{ fontSize: 12 }}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'var(--color-surface-secondary)',
            border: '1px solid var(--color-border-primary)',
            borderRadius: 'var(--border-radius-s)',
            color: 'var(--color-foreground)'
          }}
          labelStyle={{ color: 'var(--color-foreground)' }}
        />
        <Area 
          type="monotone" 
          dataKey="requests" 
          stroke={primary}
          strokeWidth={2}
          fill="url(#colorGradient)"
          dot={{ fill: primary, strokeWidth: 0, r: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};
