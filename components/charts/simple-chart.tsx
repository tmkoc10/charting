"use client";

import { useEffect, useRef, useState } from "react";
import { getChartData, formatPrice, formatVolume, type CandlestickData } from "@/lib/chart-data";

type SimpleChartProps = {
  symbol: string;
  timeframe: string;
  className?: string;
};

export function SimpleChart({ symbol, timeframe, className = "" }: SimpleChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [data, setData] = useState<CandlestickData[]>([]);
  const [hoveredCandle, setHoveredCandle] = useState<CandlestickData | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Load data when symbol or timeframe changes
  useEffect(() => {
    const chartData = getChartData(symbol, timeframe);
    setData(chartData);
  }, [symbol, timeframe]);

  // Draw chart
  useEffect(() => {
    if (!canvasRef.current || data.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const width = rect.width;
    const height = rect.height;
    const padding = { top: 20, right: 80, bottom: 60, left: 20 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    // Clear canvas
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, width, height);

    // Calculate price range
    const prices = data.flatMap(d => [d.high, d.low]);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice;
    const priceBuffer = priceRange * 0.1; // 10% buffer

    // Calculate volume range
    const maxVolume = Math.max(...data.map(d => d.volume));

    // Helper functions
    const getX = (index: number) => padding.left + (index / (data.length - 1)) * chartWidth;
    const getY = (price: number) => padding.top + ((maxPrice + priceBuffer - price) / (priceRange + 2 * priceBuffer)) * chartHeight;
    const getVolumeHeight = (volume: number) => (volume / maxVolume) * 60; // Max 60px height for volume

    // Draw grid lines
    ctx.strokeStyle = "#1f2937";
    ctx.lineWidth = 1;
    
    // Horizontal grid lines (price levels)
    for (let i = 0; i <= 5; i++) {
      const price = minPrice + (priceRange * i) / 5;
      const y = getY(price);
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
      
      // Price labels
      ctx.fillStyle = "#6b7280";
      ctx.font = "11px monospace";
      ctx.textAlign = "left";
      ctx.fillText(formatPrice(price, symbol), width - padding.right + 5, y + 4);
    }

    // Vertical grid lines (time)
    for (let i = 0; i < data.length; i += 12) { // Every 12 hours (daily markers)
      const x = getX(i);
      ctx.beginPath();
      ctx.moveTo(x, padding.top);
      ctx.lineTo(x, height - padding.bottom);
      ctx.stroke();
      
      // Date labels
      const date = new Date(data[i].time);
      ctx.fillStyle = "#6b7280";
      ctx.font = "10px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(
        date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        x,
        height - padding.bottom + 15
      );
    }

    // Draw volume bars
    data.forEach((candle, index) => {
      const x = getX(index);
      const volumeHeight = getVolumeHeight(candle.volume);
      const barWidth = Math.max(1, chartWidth / data.length * 0.6);
      
      ctx.fillStyle = candle.close >= candle.open ? "#059669" : "#dc2626";
      ctx.globalAlpha = 0.3;
      ctx.fillRect(
        x - barWidth / 2,
        height - padding.bottom - volumeHeight,
        barWidth,
        volumeHeight
      );
    });
    ctx.globalAlpha = 1;

    // Draw candlesticks
    data.forEach((candle, index) => {
      const x = getX(index);
      const openY = getY(candle.open);
      const closeY = getY(candle.close);
      const highY = getY(candle.high);
      const lowY = getY(candle.low);
      
      const isGreen = candle.close >= candle.open;
      const color = isGreen ? "#10b981" : "#ef4444";
      const candleWidth = Math.max(2, chartWidth / data.length * 0.8);
      
      // Draw wick
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, highY);
      ctx.lineTo(x, lowY);
      ctx.stroke();
      
      // Draw body
      ctx.fillStyle = color;
      const bodyHeight = Math.abs(closeY - openY);
      const bodyY = Math.min(openY, closeY);
      
      if (bodyHeight < 1) {
        // Doji - draw a line
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x - candleWidth / 2, openY);
        ctx.lineTo(x + candleWidth / 2, openY);
        ctx.stroke();
      } else {
        ctx.fillRect(x - candleWidth / 2, bodyY, candleWidth, bodyHeight);
      }
    });

    // Draw crosshair if hovering
    if (hoveredCandle) {
      const index = data.findIndex(d => d.time === hoveredCandle.time);
      if (index !== -1) {
        const x = getX(index);
        const y = getY(hoveredCandle.close);
        
        // Vertical line
        ctx.strokeStyle = "#6b7280";
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(x, padding.top);
        ctx.lineTo(x, height - padding.bottom);
        ctx.stroke();
        
        // Horizontal line
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(width - padding.right, y);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

  }, [data, symbol, hoveredCandle]);

  // Handle mouse move for crosshair and tooltip
  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || data.length === 0) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    
    setMousePos({ x: event.clientX, y: event.clientY });

    const padding = { top: 20, right: 80, bottom: 60, left: 20 };
    const chartWidth = rect.width - padding.left - padding.right;
    
    // Find closest candle
    const relativeX = x - padding.left;
    const candleIndex = Math.round((relativeX / chartWidth) * (data.length - 1));
    
    if (candleIndex >= 0 && candleIndex < data.length) {
      setHoveredCandle(data[candleIndex]);
    } else {
      setHoveredCandle(null);
    }
  };

  const handleMouseLeave = () => {
    setHoveredCandle(null);
  };

  return (
    <div className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      />
      
      {/* Tooltip */}
      {hoveredCandle && (
        <div
          className="fixed z-50 bg-black border border-gray-600 rounded-lg p-3 text-xs text-white shadow-lg pointer-events-none"
          style={{
            left: mousePos.x + 10,
            top: mousePos.y - 10,
            transform: mousePos.x > window.innerWidth - 200 ? 'translateX(-100%)' : 'none'
          }}
        >
          <div className="font-semibold mb-1">
            {new Date(hoveredCandle.time).toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1">
            <div>O: {formatPrice(hoveredCandle.open, symbol)}</div>
            <div>H: {formatPrice(hoveredCandle.high, symbol)}</div>
            <div>L: {formatPrice(hoveredCandle.low, symbol)}</div>
            <div>C: {formatPrice(hoveredCandle.close, symbol)}</div>
            <div className="col-span-2">Vol: {formatVolume(hoveredCandle.volume)}</div>
          </div>
        </div>
      )}
      
      {/* Chart Info */}
      <div className="absolute top-4 left-4 text-white text-sm">
        <div className="font-semibold">{symbol}</div>
        <div className="text-gray-400 text-xs">{timeframe} • {data.length} candles</div>
        <div className="text-xs text-gray-500 mt-1">
          May 1-5, 2025 • 12 hours/day
        </div>
      </div>
    </div>
  );
} 