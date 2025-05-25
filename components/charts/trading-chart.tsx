"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useRef } from "react";
import { createChart, ColorType, CandlestickSeries, LineSeries, IChartApi, ISeriesApi } from "lightweight-charts";
import { getChartData } from "@/lib/chart-data";
import { AppliedIndicator } from "./indicator-legend";
import { calculateIndicator } from "@/lib/indicators";

interface TradingChartProps {
  isCrosshairMode: boolean;
  symbol?: string;
  timeframe?: string;
  appliedIndicators?: AppliedIndicator[];
}

export function TradingChart({ isCrosshairMode, symbol = "NIFTY", timeframe = "1H", appliedIndicators = [] }: TradingChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const indicatorSeriesRef = useRef<Map<string, ISeriesApi<"Line">>>(new Map());

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Create the chart
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#000000' },
        textColor: '#d4d4d8',
        fontSize: 12,
        fontFamily: 'system-ui, -apple-system, sans-serif',
      },

      grid: {
        vertLines: { 
          color: '#27272a',
          style: 0,
          visible: true,
        },
        horzLines: { 
          color: '#27272a',
          style: 0,
          visible: true,
        },
      },
      crosshair: {
        mode: 1,
        vertLine: {
          color: '#758694',
          width: 1,
          style: 3,
          visible: true,
          labelVisible: true,
        },
        horzLine: {
          color: '#758694',
          width: 1,
          style: 3,
          visible: true,
          labelVisible: true,
        },
      },
      rightPriceScale: {
        borderColor: '#27272a',
        borderVisible: true,
        entireTextOnly: false,
        visible: true,
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        },
      },
      timeScale: {
        borderColor: '#27272a',
        borderVisible: true,
        timeVisible: true,
        secondsVisible: false,
        tickMarkFormatter: (time: any) => {
          const date = new Date(time * 1000);
          return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        },
      },
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      handleScroll: {
        mouseWheel: true,
        pressedMouseMove: true,
        horzTouchDrag: true,
        vertTouchDrag: true,
      },
      handleScale: {
        axisPressedMouseMove: true,
        mouseWheel: true,
        pinch: true,
      },
    });

    chartRef.current = chart;

    // Simple watermark hiding function
    const hideWatermarks = () => {
      setTimeout(() => {
        const watermarks = document.querySelectorAll('a[href*="tradingview.com"]');
        watermarks.forEach(watermark => {
          (watermark as HTMLElement).style.display = 'none';
        });
        
        const logoImages = document.querySelectorAll('img[src*="tradingview"]');
        logoImages.forEach(img => {
          (img as HTMLElement).style.display = 'none';
        });
      }, 50);
    };

    // Run watermark hiding
    hideWatermarks();

    // Add candlestick series using the correct v5 API
    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderDownColor: '#ef4444',
      borderUpColor: '#22c55e',
      wickDownColor: '#ef4444',
      wickUpColor: '#22c55e',
    });

    seriesRef.current = candlestickSeries;

    // Get chart data for the current symbol and timeframe
    const chartData = getChartData(symbol, timeframe);
    
    // Convert our data format to LightweightCharts format
    const sampleData = chartData.map(candle => ({
      time: Math.floor(candle.time / 1000) as any, // Convert to seconds for LightweightCharts
      open: candle.open,
      high: candle.high,
      low: candle.low,
      close: candle.close,
    }));

    candlestickSeries.setData(sampleData);

    // Hide TradingView watermark/logo
    setTimeout(() => {
      const watermarks = document.querySelectorAll('a[href*="tradingview.com"]');
      watermarks.forEach(watermark => {
        (watermark as HTMLElement).style.display = 'none';
      });
      
      // Also hide any TradingView logo images
      const logoImages = document.querySelectorAll('img[src*="tradingview"], img[alt*="TradingView"], img[alt*="tradingview"]');
      logoImages.forEach(img => {
        (img as HTMLElement).style.display = 'none';
      });
    }, 100);

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        });
      }
    };

    // Use ResizeObserver to watch for container size changes
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === chartContainerRef.current) {
          handleResize();
        }
      }
    });

    // Start observing the chart container
    if (chartContainerRef.current) {
      resizeObserver.observe(chartContainerRef.current);
    }

    // Also listen to window resize for good measure
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
      if (chartRef.current) {
        chartRef.current.remove();
      }
    };
  }, [symbol, timeframe]);

  // Update crosshair visibility when mode changes
  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.applyOptions({
        crosshair: {
          mode: 1,
          vertLine: {
            color: '#758694',
            width: 1,
            style: 3,
            visible: !isCrosshairMode,
            labelVisible: !isCrosshairMode,
          },
          horzLine: {
            color: '#758694',
            width: 1,
            style: 3,
            visible: !isCrosshairMode,
            labelVisible: !isCrosshairMode,
          },
        },
      });
    }
  }, [isCrosshairMode]);

  // Update chart data when symbol or timeframe changes
  useEffect(() => {
    if (seriesRef.current) {
      const newChartData = getChartData(symbol, timeframe);
      const newData = newChartData.map(candle => ({
        time: Math.floor(candle.time / 1000) as any,
        open: candle.open,
        high: candle.high,
        low: candle.low,
        close: candle.close,
      }));
      seriesRef.current.setData(newData);
    }
  }, [symbol, timeframe]);

  // Update indicators when appliedIndicators changes
  useEffect(() => {
    if (!chartRef.current) return;

    // Clear existing indicator series
    indicatorSeriesRef.current.forEach((series) => {
      if (chartRef.current) {
        chartRef.current.removeSeries(series);
      }
    });
    indicatorSeriesRef.current.clear();

    // Add new indicator series
    appliedIndicators.forEach((indicator) => {
      if (!indicator.visible) return;

      try {
        // Get chart data for calculations
        const chartData = getChartData(symbol, timeframe);
        
        if (chartData.length === 0) return;

        // Convert chart data to OHLC format for indicator calculation
        const ohlcData = chartData.map(candle => ({
          open: candle.open,
          high: candle.high,
          low: candle.low,
          close: candle.close,
          timestamp: candle.time
        }));

        // Extract indicator ID from the applied indicator ID (remove timestamp suffix)
        const indicatorId = indicator.id.split('_')[0];
        
        // Calculate indicator values
        const numericParameters: Record<string, number> = {};
        Object.entries(indicator.parameters).forEach(([key, value]) => {
          if (typeof value === 'number') {
            numericParameters[key] = value;
          } else if (typeof value === 'string') {
            const parsed = parseFloat(value);
            if (!isNaN(parsed)) {
              numericParameters[key] = parsed;
            }
          }
        });
        const indicatorResults = calculateIndicator(indicatorId, ohlcData, numericParameters);
        
        if (indicatorResults.length === 0) return;

        // Create line series for the indicator
        if (!chartRef.current) return;
        const lineSeries = chartRef.current.addSeries(LineSeries, {
          color: indicator.color,
          lineWidth: 2,
          title: indicator.shortName,
        });

        // Convert indicator results to chart format
        const indicatorData = indicatorResults.map(result => ({
          time: Math.floor(result.timestamp / 1000) as any,
          value: typeof result.value === 'number' ? result.value : 
                 (result.value as any).main || 
                 Object.values(result.value as any)[0] || 0
        }));

        lineSeries.setData(indicatorData);
        indicatorSeriesRef.current.set(indicator.id, lineSeries);

      } catch (error) {
        console.error(`Error adding indicator ${indicator.name} to chart:`, error);
      }
    });
  }, [appliedIndicators, symbol, timeframe]);

  return (
    <>
      {/* CSS to hide TradingView watermark */}
      <style jsx global>{`
        a[href*="tradingview.com"] {
          display: none !important;
        }
        img[src*="tradingview"] {
          display: none !important;
        }
      `}</style>
      <div className="w-full h-full bg-black border border-zinc-800 rounded relative overflow-hidden">
        {/* Lightweight Charts Container */}
        <div 
          ref={chartContainerRef} 
          className="w-full h-full"
          style={{ position: 'relative' }}
        />
      </div>
    </>
  );
}
