"use client";

export type AppliedIndicator = {
  id: string;
  name: string;
  shortName: string;
  parameters: Record<string, number | string>;
  values: Record<string, number>;
  color: string;
  visible: boolean;
  sourceCode?: string;
};

type IndicatorLegendProps = {
  indicators: AppliedIndicator[];
  onToggleVisibility: (id: string) => void;
  onRemoveIndicator: (id: string) => void;
  onEditIndicator: (id: string) => void;
  onOpenCodeEditor: (indicatorId: string) => void;
};

export function IndicatorLegend({
  indicators,
  onToggleVisibility,
  onRemoveIndicator,
  onEditIndicator,
  onOpenCodeEditor,
}: IndicatorLegendProps) {
  if (indicators.length === 0) {
    return null;
  }

  const getParameterString = (parameters: Record<string, number | string>): string => {
    return Object.entries(parameters)
      .map(([, value]) => `${value}`)
      .join(' ');
  };

  return (
    <div className="absolute top-3 left-3 z-[5] flex flex-col gap-1">
      {indicators.map((indicator) => {
        return (
          <div
            key={indicator.id}
            className="flex items-center bg-black/80 backdrop-blur-sm border border-zinc-800/50 rounded px-2 py-1 shadow-sm"
            style={{ height: '28px' }} // Compact height matching chart interface standards
          >
            {/* Indicator color dot */}
            <div
              className="w-2 h-2 rounded-full mr-2 flex-shrink-0"
              style={{ backgroundColor: indicator.color }}
            />

            {/* Indicator info - compact single line */}
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {/* Full indicator name and parameters */}
              <span className="text-white text-xs font-medium">
                {indicator.name}
              </span>
              <span className="text-zinc-400 text-xs">
                {getParameterString(indicator.parameters)}
              </span>
            </div>

            {/* Control buttons - compact horizontal layout */}
            <div className="flex items-center gap-0.5 ml-2 flex-shrink-0">
              {/* 1. Eye Icon (Visibility Toggle) */}
              <button
                onClick={() => onToggleVisibility(indicator.id)}
                className={`p-1 transition-colors duration-150 rounded hover:bg-zinc-700/50 ${
                  indicator.visible ? 'text-white' : 'text-zinc-500'
                }`}
                title={indicator.visible ? "Hide indicator" : "Show indicator"}
              >
                {indicator.visible ? (
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
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                ) : (
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
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                )}
              </button>

              {/* 2. Settings Icon */}
              <button
                onClick={() => onEditIndicator(indicator.id)}
                className="p-1 text-white hover:bg-zinc-700/50 transition-colors duration-150 rounded"
                title="Indicator settings"
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
                >
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>
              </button>

              {/* 3. Curly Bracket Icon (Code Editor) */}
              <button
                onClick={() => onOpenCodeEditor(indicator.id)}
                className="p-1 text-white hover:bg-zinc-700/50 transition-colors duration-150 rounded"
                title="View source code"
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
                >
                  <path d="M7 4a2 2 0 0 0-2 2v3a2 2 0 0 1-2 2 2 2 0 0 1 2 2v3a2 2 0 0 0 2 2"></path>
                  <path d="M17 4a2 2 0 0 1 2 2v3a2 2 0 0 0 2 2 2 2 0 0 0-2 2v3a2 2 0 0 1-2 2"></path>
                </svg>
              </button>

              {/* 4. Delete Icon */}
              <button
                onClick={() => onRemoveIndicator(indicator.id)}
                className="p-1 text-white hover:text-red-400 hover:bg-red-900/30 transition-colors duration-150 rounded"
                title="Remove indicator"
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
                >
                  <polyline points="3,6 5,6 21,6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>

              {/* 5. Three Dots Menu (Placeholder) */}
              <button
                className="p-1 text-zinc-600 cursor-not-allowed opacity-50"
                title="More options (coming soon)"
                disabled
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
                >
                  <circle cx="12" cy="12" r="1"></circle>
                  <circle cx="19" cy="12" r="1"></circle>
                  <circle cx="5" cy="12" r="1"></circle>
                </svg>
              </button>
            </div>
          </div>
        );
      })}
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

// Helper function to get source code for indicators
export function getIndicatorSourceCode(indicatorId: string): string {
  const sourceCodes: { [key: string]: string } = {
    sma: `// Simple Moving Average
//@version=5
indicator("Simple Moving Average", shorttitle="SMA", overlay=true)

length = input.int(20, title="Length", minval=1)
src = input(close, title="Source")

sma_value = ta.sma(src, length)
plot(sma_value, title="SMA", color=color.blue, linewidth=2)`,

    ema: `// Exponential Moving Average
//@version=5
indicator("Exponential Moving Average", shorttitle="EMA", overlay=true)

length = input.int(20, title="Length", minval=1)
src = input(close, title="Source")

ema_value = ta.ema(src, length)
plot(ema_value, title="EMA", color=color.green, linewidth=2)`,

    rsi: `// Relative Strength Index
//@version=5
indicator("Relative Strength Index", shorttitle="RSI")

length = input.int(14, title="Length", minval=1)
src = input(close, title="Source")

rsi_value = ta.rsi(src, length)
plot(rsi_value, title="RSI", color=color.purple, linewidth=2)

hline(70, "Overbought", color=color.red, linestyle=hline.style_dashed)
hline(50, "Middle", color=color.gray, linestyle=hline.style_dotted)
hline(30, "Oversold", color=color.green, linestyle=hline.style_dashed)`,

    bb: `// Bollinger Bands
//@version=5
indicator("Bollinger Bands", shorttitle="BB", overlay=true)

length = input.int(20, title="Length", minval=1)
src = input(close, title="Source")
mult = input.float(2.0, title="StdDev", minval=0.001, maxval=50)

basis = ta.sma(src, length)
dev = mult * ta.stdev(src, length)
upper = basis + dev
lower = basis - dev

plot(basis, title="Basis", color=color.orange, linewidth=2)
p1 = plot(upper, title="Upper", color=color.blue, linewidth=1)
p2 = plot(lower, title="Lower", color=color.blue, linewidth=1)
fill(p1, p2, title="Background", color=color.new(color.blue, 95))`,

    macd: `// MACD
//@version=5
indicator("MACD", shorttitle="MACD")

fast_length = input.int(12, title="Fast Length", minval=1)
slow_length = input.int(26, title="Slow Length", minval=1)
signal_length = input.int(9, title="Signal Length", minval=1)
src = input(close, title="Source")

fast_ma = ta.ema(src, fast_length)
slow_ma = ta.ema(src, slow_length)
macd_line = fast_ma - slow_ma
signal_line = ta.ema(macd_line, signal_length)
histogram = macd_line - signal_line

plot(macd_line, title="MACD", color=color.blue, linewidth=2)
plot(signal_line, title="Signal", color=color.red, linewidth=2)
plot(histogram, title="Histogram", color=color.gray, style=plot.style_histogram)

hline(0, "Zero Line", color=color.gray, linestyle=hline.style_dashed)`,

    stoch: `// Stochastic
//@version=5
indicator("Stochastic", shorttitle="STOCH")

k_period = input.int(14, title="%K Length", minval=1)
d_period = input.int(3, title="%D Smoothing", minval=1)

k = ta.stoch(close, high, low, k_period)
d = ta.sma(k, d_period)

plot(k, title="%K", color=color.blue, linewidth=2)
plot(d, title="%D", color=color.red, linewidth=2)

hline(80, "Overbought", color=color.red, linestyle=hline.style_dashed)
hline(50, "Middle", color=color.gray, linestyle=hline.style_dotted)
hline(20, "Oversold", color=color.green, linestyle=hline.style_dashed)`,

    atr: `// Average True Range
//@version=5
indicator("Average True Range", shorttitle="ATR")

length = input.int(14, title="Length", minval=1)

atr_value = ta.atr(length)
plot(atr_value, title="ATR", color=color.orange, linewidth=2)`,

    williams_r: `// Williams %R
//@version=5
indicator("Williams %R", shorttitle="%R")

length = input.int(14, title="Length", minval=1)

williams_r = ta.wpr(length)
plot(williams_r, title="Williams %R", color=color.purple, linewidth=2)

hline(-20, "Overbought", color=color.red, linestyle=hline.style_dashed)
hline(-50, "Middle", color=color.gray, linestyle=hline.style_dotted)
hline(-80, "Oversold", color=color.green, linestyle=hline.style_dashed)`,

    cci: `// Commodity Channel Index
//@version=5
indicator("Commodity Channel Index", shorttitle="CCI")

length = input.int(20, title="Length", minval=1)
src = input(hlc3, title="Source")

cci_value = ta.cci(src, length)
plot(cci_value, title="CCI", color=color.blue, linewidth=2)

hline(100, "Overbought", color=color.red, linestyle=hline.style_dashed)
hline(0, "Zero Line", color=color.gray, linestyle=hline.style_dotted)
hline(-100, "Oversold", color=color.green, linestyle=hline.style_dashed)`,

    supertrend: `// SuperTrend
//@version=5
indicator("SuperTrend", shorttitle="ST", overlay=true)

atrPeriod = input.int(10, title="ATR Length", minval=1)
factor = input.float(3.0, title="Factor", minval=0.01, step=0.01)

[supertrend, direction] = ta.supertrend(factor, atrPeriod)

upTrend = plot(direction < 0 ? supertrend : na, title="Up Trend", color=color.green, linewidth=2, style=plot.style_linebr)
downTrend = plot(direction > 0 ? supertrend : na, title="Down Trend", color=color.red, linewidth=2, style=plot.style_linebr)

bodyMiddle = plot((open + close) / 2, display=display.none)
fill(bodyMiddle, upTrend, color.new(color.green, 90), fillgaps=false)
fill(bodyMiddle, downTrend, color.new(color.red, 90), fillgaps=false)`,

    wma: `// Weighted Moving Average
//@version=5
indicator("Weighted Moving Average", shorttitle="WMA", overlay=true)

length = input.int(20, title="Length", minval=1)
src = input(close, title="Source")

wma_value = ta.wma(src, length)
plot(wma_value, title="WMA", color=color.orange, linewidth=2)`,

    hma: `// Hull Moving Average
//@version=5
indicator("Hull Moving Average", shorttitle="HMA", overlay=true)

length = input.int(20, title="Length", minval=1)
src = input(close, title="Source")

hma_value = ta.hma(src, length)
plot(hma_value, title="HMA", color=color.yellow, linewidth=2)`,

    adx: `// Average Directional Index
//@version=5
indicator("Average Directional Index", shorttitle="ADX")

adxlen = input.int(14, title="DI Length", minval=1)
dilen = input.int(14, title="ADX Smoothing", minval=1)

[diplus, diminus, adx] = ta.dmi(adxlen, dilen)

plot(diplus, title="+DI", color=color.green, linewidth=2)
plot(diminus, title="-DI", color=color.red, linewidth=2)
plot(adx, title="ADX", color=color.blue, linewidth=2)

hline(25, "Trend Strength Threshold", color=color.gray, linestyle=hline.style_dashed)`
  };

  return sourceCodes[indicatorId] || `// ${indicatorId.toUpperCase()} Indicator
//@version=5
indicator("${indicatorId.toUpperCase()}", shorttitle="${getIndicatorShortName(indicatorId)}")

// Source code for this indicator is not available yet
plot(close, title="${getIndicatorShortName(indicatorId)}", color=color.blue)`;
}