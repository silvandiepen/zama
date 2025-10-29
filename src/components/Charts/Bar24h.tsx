import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useThemeColors } from './useThemeColors';

type Props = { data: number[] };

export const Bar24h: React.FC<Props> = ({ data }) => {
  const { info, grid, text } = useThemeColors();
  
  const chartData = Array.from({ length: 24 }, (_, i) => ({
    hour: `${i}:00`,
    requests: data[i] ?? 0,
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={chartData} margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={grid} />
        <XAxis 
          dataKey="hour" 
          stroke={text}
          tick={{ fontSize: 12 }}
          interval={2}
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
        <Bar 
          dataKey="requests" 
          fill={info}
          fillOpacity={0.8}
          radius={[6, 6, 0, 0]}
          maxBarSize={18}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};
