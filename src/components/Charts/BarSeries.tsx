import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useThemeColors } from './useThemeColors';

type Props = { labels: string[]; data: number[]; height?: number };

export const BarSeries: React.FC<Props> = ({ labels, data, height = 160 }) => {
  const { info, grid, text } = useThemeColors();
  
  const chartData = labels.map((label, i) => ({
    label,
    value: data[i] ?? 0,
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={chartData} margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={grid} />
        <XAxis 
          dataKey="label" 
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
        <Bar 
          dataKey="value" 
          fill={info}
          fillOpacity={0.8}
          radius={[6, 6, 0, 0]}
          maxBarSize={22}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};
