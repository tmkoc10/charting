"use client";

import { useEffect, useRef } from "react";
import { createChart, ColorType, IChartApi, Time } from "lightweight-charts";
import { EquityPoint, DrawdownPoint, ChartToggleState, ViewMode } from "./types";

interface StrategyChartProps {
  equityData: EquityPoint[];
  drawdownData: DrawdownPoint[];
  buyHoldData?: EquityPoint[];
  toggleState: ChartToggleState;
  viewMode: ViewMode;
  initialCapital: number;
}

export function StrategyChart({
  equityData,
  drawdownData,
  buyHoldData,
  toggleState,
  viewMode,
  initialCapital
}: StrategyChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const equitySeriesRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const drawdownSeriesRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const buyHoldSeriesRef = useRef<any>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Create the chart
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#1a1a1a' },
        textColor: '#d4d4d8',
        fontSize: 11,
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
          bottom: 0.3,
        },
      },
      leftPriceScale: {
        borderColor: '#27272a',
        borderVisible: true,
        entireTextOnly: false,
        visible: true,
        scaleMargins: {
          top: 0.7,
          bottom: 0.1,
        },
      },
      timeScale: {
        borderColor: '#27272a',
        borderVisible: true,
        timeVisible: true,
        secondsVisible: false,
      },
      handleScroll: {
        mouseWheel: true,
        pressedMouseMove: true,
      },
      handleScale: {
        axisPressedMouseMove: true,
        mouseWheel: true,
        pinch: true,
      },
    });

    chartRef.current = chart;

    // Create equity series (area chart)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const equitySeries = (chart as any).addAreaSeries({
      topColor: 'rgba(0, 255, 204, 0.4)',
      bottomColor: 'rgba(0, 255, 204, 0.0)',
      lineColor: '#00ffcc',
      lineWidth: 2,
      priceScaleId: 'right',
      visible: toggleState.equity,
    });
    equitySeriesRef.current = equitySeries;

    // Create drawdown series (histogram)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const drawdownSeries = (chart as any).addHistogramSeries({
      color: '#8844ff',
      priceScaleId: 'left',
      visible: toggleState.drawdown,
    });
    drawdownSeriesRef.current = drawdownSeries;

    // Create buy & hold series if data exists
    if (buyHoldData && buyHoldData.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const buyHoldSeries = (chart as any).addLineSeries({
        color: '#ffaa00',
        lineWidth: 2,
        priceScaleId: 'right',
        visible: toggleState.buyHold,
      });
      buyHoldSeriesRef.current = buyHoldSeries;
    }

    // Auto-resize
    const resizeObserver = new ResizeObserver(() => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        });
      }
    });

    resizeObserver.observe(chartContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      chart.remove();
    };
  }, [buyHoldData, toggleState.equity, toggleState.drawdown, toggleState.buyHold]);

  // Update data when props change
  useEffect(() => {
    if (!equitySeriesRef.current || !drawdownSeriesRef.current) return;

    // Convert data based on view mode
    const convertValue = (value: number) => {
      if (viewMode === 'percentage') {
        return ((value - initialCapital) / initialCapital) * 100;
      }
      return value;
    };

    // Update equity data
    const equityChartData = equityData.map((point, index) => ({
      time: (Math.floor(new Date(point.time).getTime() / 1000) + index) as Time, // Add index to ensure unique times
      value: convertValue(point.value)
    }));

    // Update drawdown data
    const drawdownChartData = drawdownData.map((point, index) => ({
      time: (Math.floor(new Date(point.time).getTime() / 1000) + index) as Time, // Add index to ensure unique times
      value: viewMode === 'percentage' ? (point.value / initialCapital) * 100 : point.value,
      color: '#8844ff'
    }));

    equitySeriesRef.current.setData(equityChartData);
    drawdownSeriesRef.current.setData(drawdownChartData);

    // Update buy & hold data if available
    if (buyHoldData && buyHoldSeriesRef.current) {
      const buyHoldChartData = buyHoldData.map((point, index) => ({
        time: (Math.floor(new Date(point.time).getTime() / 1000) + index) as Time, // Add index to ensure unique times
        value: convertValue(point.value)
      }));
      buyHoldSeriesRef.current.setData(buyHoldChartData);
    }
  }, [equityData, drawdownData, buyHoldData, viewMode, initialCapital]);

  // Update series visibility
  useEffect(() => {
    if (equitySeriesRef.current) {
      equitySeriesRef.current.applyOptions({ visible: toggleState.equity });
    }
    if (drawdownSeriesRef.current) {
      drawdownSeriesRef.current.applyOptions({ visible: toggleState.drawdown });
    }
    if (buyHoldSeriesRef.current) {
      buyHoldSeriesRef.current.applyOptions({ visible: toggleState.buyHold });
    }
  }, [toggleState]);

  return (
    <div className="h-[500px] bg-zinc-900 border border-zinc-700 rounded-lg">
      <div
        ref={chartContainerRef}
        className="w-full h-full"
        style={{ position: 'relative' }}
      />
    </div>
  );
}
