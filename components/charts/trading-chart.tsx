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

      // Clean up indicator series before removing the chart
      indicatorSeriesRef.current.forEach((series, key) => {
        try {
          if (chartRef.current && series) {
            chartRef.current.removeSeries(series);
          }
        } catch (error) {
          console.warn(`Error removing indicator series ${key} during cleanup:`, error);
        }
      });
      indicatorSeriesRef.current.clear();

      // Remove the chart
      if (chartRef.current) {
        try {
          chartRef.current.remove();
        } catch (error) {
          console.warn('Error removing chart during cleanup:', error);
        }
        chartRef.current = null;
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
      try {
        const newChartData = getChartData(symbol, timeframe);
        const newData = newChartData.map(candle => ({
          time: Math.floor(candle.time / 1000) as any,
          open: candle.open,
          high: candle.high,
          low: candle.low,
          close: candle.close,
        }));
        seriesRef.current.setData(newData);
      } catch (error) {
        console.error('Error updating chart data:', error);
      }
    }
  }, [symbol, timeframe]);

  // Update indicators when appliedIndicators changes
  useEffect(() => {
    if (!chartRef.current) return;

    // Clear existing indicator series with proper error handling
    indicatorSeriesRef.current.forEach((series, key) => {
      try {
        // Double-check that chart and series are still valid
        if (chartRef.current && series) {
          chartRef.current.removeSeries(series);
        }
      } catch (error) {
        console.warn(`Failed to remove indicator series ${key}:`, error);
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

        // Create line series for the indicator with additional safety checks
        if (!chartRef.current) {
          console.warn(`Chart reference is null when trying to add indicator: ${indicator.name}`);
          return;
        }

        const lineSeries = chartRef.current.addSeries(LineSeries, {
          color: indicator.color,
          lineWidth: 2,
          title: indicator.shortName,
        });

        // Validate that the series was created successfully
        if (!lineSeries) {
          console.warn(`Failed to create line series for indicator: ${indicator.name}`);
          return;
        }

        // Convert indicator results to chart format
        const indicatorData = indicatorResults.map(result => {
          let value = 0;

          if (typeof result.value === 'number') {
            value = result.value;
          } else if (typeof result.value === 'object' && result.value !== null) {
            // Handle specific indicator types
            const valueObj = result.value as any;

            if (indicatorId === 'supertrend') {
              value = valueObj.supertrend || 0;
            } else if (indicatorId === 'bb') {
              value = valueObj.middle || valueObj.basis || 0;
            } else if (indicatorId === 'macd') {
              value = valueObj.macd || 0;
            } else if (indicatorId === 'stoch') {
              value = valueObj.k || 0;
            } else if (indicatorId === 'adx') {
              value = valueObj.adx || 0;
            } else {
              // Fallback: try common property names, then first value
              value = valueObj.main || valueObj.value || valueObj.close ||
                      Object.values(valueObj)[0] || 0;
            }
          }

          return {
            time: Math.floor(result.timestamp / 1000) as any,
            value: value
          };
        });

        // Set data with error handling
        try {
          lineSeries.setData(indicatorData);
          // Only store the series reference if everything succeeded
          indicatorSeriesRef.current.set(indicator.id, lineSeries);
        } catch (dataError) {
          console.error(`Error setting data for indicator ${indicator.name}:`, dataError);
          // Clean up the series if data setting failed
          try {
            if (chartRef.current && lineSeries) {
              chartRef.current.removeSeries(lineSeries);
            }
          } catch (cleanupError) {
            console.warn(`Error cleaning up failed indicator series:`, cleanupError);
          }
        }

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
