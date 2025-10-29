import React from 'react';

type Props = {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  strokeWidth?: number;
};

/**
 * Simple SVG line chart component.
 * @param {Object} props - Component props
 * @param {number[]} props.data - Array of data points to plot
 * @param {number} [props.width=360] - Chart width in pixels
 * @param {number} [props.height=100] - Chart height in pixels
 * @param {string} [props.color='currentColor'] - Line color
 * @param {number} [props.strokeWidth=2] - Line stroke width
 * @returns {JSX.Element | null} The rendered line chart or null if no data
 */
export const LineChart: React.FC<Props> = ({ data, width = 360, height = 100, color = 'currentColor', strokeWidth = 2 }) => {
  if (!data.length) return null;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = Math.max(max - min, 1);
  const stepX = width / Math.max(data.length - 1, 1);
  const points = data
    .map((v, i) => {
      const x = i * stepX;
      const y = height - ((v - min) / range) * height;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-label="line chart">
      <polyline fill="none" stroke={color} strokeWidth={strokeWidth} points={points} />
    </svg>
  );
};

