"use client";

import { useState } from "react";

export type AppliedIndicator = {
  id: string;
  name: string;
  shortName: string;
  parameters: Record<string, number | string>;
  values: Record<string, number>;
  color: string;
  visible: boolean;
};

type IndicatorLegendProps = {
  indicators: AppliedIndicator[];
  onToggleVisibility: (id: string) => void;
  onRemoveIndicator: (id: string) => void;
  onEditIndicator: (id: string) => void;
};

export function IndicatorLegend({
  indicators,
  onToggleVisibility,
  onRemoveIndicator,
  onEditIndicator,
}: IndicatorLegendProps) {
  const [expandedIndicator, setExpandedIndicator] = useState<string | null>(null);

  if (indicators.length === 0) {
    return null;
  }

  const formatValue = (value: number): string => {
    if (Math.abs(value) >= 1000) {
      return value.toFixed(0);
    } else if (Math.abs(value) >= 1) {
      return value.toFixed(2);
    } else {
      return value.toFixed(4);
    }
  };

  const getParameterString = (parameters: Record<string, number | string>): string => {
    return Object.entries(parameters)
      .map(([, value]) => `${value}`)
      .join(' ');
  };

  return (
    <div className="absolute top-2 left-2 z-10 max-w-md">
      {indicators.map((indicator) => (
        <div
          key={indicator.id}
          className="mb-1 bg-black bg-opacity-80 backdrop-blur-sm border border-gray-700 border-opacity-50 rounded-lg overflow-hidden"
        >
          {/* Main indicator row */}
          <div className="flex items-center justify-between px-3 py-2 hover:bg-gray-800 hover:bg-opacity-50 transition-all duration-200">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {/* Visibility toggle */}
              <button
                onClick={() => onToggleVisibility(indicator.id)}
                className="flex-shrink-0 w-3 h-3 rounded-sm border border-gray-500 transition-all duration-200 hover:border-gray-400"
                style={{
                  backgroundColor: indicator.visible ? indicator.color : 'transparent',
                  opacity: indicator.visible ? 1 : 0.5,
                }}
              />

              {/* Indicator name and parameters */}
              <div className="flex items-center gap-1 text-sm font-medium text-white truncate">
                <span style={{ color: indicator.color }}>{indicator.shortName}</span>
                <span className="text-gray-400 text-xs">
                  {getParameterString(indicator.parameters)}
                </span>
              </div>

              {/* Current values */}
              <div className="flex items-center gap-2 text-xs">
                {Object.entries(indicator.values).map(([key, value]) => (
                  <span
                    key={key}
                    className="text-gray-300"
                    style={{ color: key === 'main' ? indicator.color : undefined }}
                  >
                    {key !== 'main' && (
                      <span className="text-gray-500 mr-1">{key}:</span>
                    )}
                    {formatValue(value)}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions menu */}
            <div className="flex items-center gap-1 ml-2">
              <button
                onClick={() => setExpandedIndicator(
                  expandedIndicator === indicator.id ? null : indicator.id
                )}
                className="p-1 text-gray-400 hover:text-white transition-colors duration-200 rounded"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`transform transition-transform duration-200 ${
                    expandedIndicator === indicator.id ? 'rotate-180' : ''
                  }`}
                >
                  <polyline points="6,9 12,15 18,9"></polyline>
                </svg>
              </button>
            </div>
          </div>

          {/* Expanded actions */}
          {expandedIndicator === indicator.id && (
            <div className="border-t border-gray-700 border-opacity-50 bg-gray-900 bg-opacity-50">
              <div className="flex items-center gap-1 px-3 py-2">
                <button
                  onClick={() => {
                    onEditIndicator(indicator.id);
                    setExpandedIndicator(null);
                  }}
                  className="flex items-center gap-1 px-2 py-1 text-xs text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-all duration-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                  Settings
                </button>

                <button
                  onClick={() => {
                    onRemoveIndicator(indicator.id);
                    setExpandedIndicator(null);
                  }}
                  className="flex items-center gap-1 px-2 py-1 text-xs text-gray-300 hover:text-red-400 hover:bg-red-900 hover:bg-opacity-30 rounded transition-all duration-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="3,6 5,6 21,6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                  Remove
                </button>

                <div className="flex-1"></div>

                <span className="text-xs text-gray-500 font-mono">
                  {indicator.name}
                </span>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// Helper function to generate indicator colors
export function getIndicatorColor(index: number): string {
  const colors = [
    '#3B82F6', // Blue
    '#10B981', // Green
    '#F59E0B', // Yellow
    '#EF4444', // Red
    '#8B5CF6', // Purple
    '#06B6D4', // Cyan
    '#F97316', // Orange
    '#84CC16', // Lime
    '#EC4899', // Pink
    '#6B7280', // Gray
  ];
  
  return colors[index % colors.length];
}

// Helper function to get short name for indicators
export function getIndicatorShortName(indicatorId: string): string {
  const shortNames: { [key: string]: string } = {
    sma: 'SMA',
    ema: 'EMA',
    wma: 'WMA',
    hma: 'HMA',
    tema: 'TEMA',
    dema: 'DEMA',
    kama: 'KAMA',
    alma: 'ALMA',
    rsi: 'RSI',
    stoch: 'STOCH',
    williams_r: '%R',
    cci: 'CCI',
    roc: 'ROC',
    momentum: 'MOM',
    macd: 'MACD',
    stoch_rsi: 'STOCH RSI',
    ultimate_osc: 'UO',
    awesome_osc: 'AO',
    ppo: 'PPO',
    bb: 'BB',
    atr: 'ATR',
    keltner: 'KC',
    donchian: 'DC',
    stddev: 'STDDEV',
    bb_width: 'BBW',
    bb_percent: '%B',
    pivot: 'PP',
    fibonacci: 'FIB',
    sar: 'SAR',
    zigzag: 'ZZ',
    support_resistance: 'S/R',
    adx: 'ADX',
    aroon: 'AROON',
    dpo: 'DPO',
    tsi: 'TSI',
    cmo: 'CMO',
    mfi: 'MFI',
    obv: 'OBV',
    ad_line: 'A/D',
    chaikin_osc: 'CHO',
    elder_ray: 'ER',
    price_channel: 'PC',
    linear_regression: 'LR',
    envelope: 'ENV',
    vwap: 'VWAP',
    ichimoku: 'ICH',
    supertrend: 'ST',
    vortex: 'VI',
    mass_index: 'MI',
    coppock: 'COP',
    know_sure_thing: 'KST',
  };
  
  return shortNames[indicatorId] || indicatorId.toUpperCase();
} 