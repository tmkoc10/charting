'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { EditorState } from '@codemirror/state';
import { EditorView, keymap, lineNumbers } from '@codemirror/view';
import { basicSetup } from 'codemirror';
import { oneDark } from '@codemirror/theme-one-dark';
import { indentWithTab } from '@codemirror/commands';
import { syntaxHighlighting, HighlightStyle } from '@codemirror/language';
import { tags } from '@lezer/highlight';
import { autocompletion } from '@codemirror/autocomplete';
import { javascript } from '@codemirror/lang-javascript';
import { EditorView as EditorViewTheme } from '@codemirror/view';
import { Input } from '@/components/ui/input';

// Algo Script keywords for autocomplete
const algoScriptKeywords = [
  'indicator', 'strategy', 'input', 'plot', 'plotshape', 'sma', 'ema', 'rsi', 'macd',
  'crossover', 'crossunder', 'alert', 'close', 'open', 'high', 'low', 'volume',
  'color.red', 'color.green', 'color.blue', 'shape.triangleup', 'shape.triangledown',
  'location.abovebar', 'location.belowbar', 'size.small', 'size.normal'
];

// Simple autocomplete function
const algoScriptCompletion = (context: any) => {
  const word = context.matchBefore(/\w*/);
  if (!word || (word.from === word.to && !context.explicit)) {
    return null;
  }

  return {
    from: word.from,
    options: algoScriptKeywords
      .filter(keyword => keyword.toLowerCase().includes(word.text.toLowerCase()))
      .map(keyword => ({
        label: keyword,
        type: 'keyword',
        info: `Algo Script keyword: ${keyword}`
      }))
  };
};

// TradingView-style dark theme
const tradingViewDarkTheme = EditorViewTheme.theme({
  '@keyframes blink': {
    '0%, 50%': { opacity: '1' },
    '51%, 100%': { opacity: '0' }
  },
  '&': {
    color: '#d1d4dc',
    backgroundColor: '#000000',
    fontSize: '14px',
    fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
  },
  '.cm-content': {
    padding: '16px',
    caretColor: '#ffffff',
    lineHeight: '1.5',
  },
  '.cm-focused .cm-cursor': {
    borderLeftColor: '#ffffff',
    borderLeftWidth: '2px',
    animation: 'blink 1s step-end infinite',
  },
  '.cm-cursor': {
    borderLeftColor: '#ffffff',
    borderLeftWidth: '2px',
    animation: 'blink 1s step-end infinite',
  },
  '.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': {
    backgroundColor: '#264f78',
  },
  '.cm-panels': {
    backgroundColor: '#000000',
    color: '#d1d4dc',
  },
  '.cm-panels.cm-panels-top': {
    borderBottom: '1px solid #2a2e39',
  },
  '.cm-panels.cm-panels-bottom': {
    borderTop: '1px solid #2a2e39',
  },
  '.cm-searchMatch': {
    backgroundColor: '#72a1ff59',
    outline: '1px solid #457dff',
  },
  '.cm-searchMatch.cm-searchMatch-selected': {
    backgroundColor: '#6199ff2f',
  },
  '.cm-activeLine': {
    backgroundColor: '#2a2e39',
  },
  '.cm-selectionMatch': {
    backgroundColor: '#72a1ff59',
  },
  '.cm-matchingBracket, .cm-nonmatchingBracket': {
    backgroundColor: '#bad0f847',
    outline: '1px solid #515a6b',
  },
  '.cm-gutters': {
    backgroundColor: '#000000',
    color: '#858585',
    border: 'none',
    borderRight: '1px solid #2a2e39',
  },
  '.cm-activeLineGutter': {
    backgroundColor: '#2a2e39',
  },
  '.cm-foldPlaceholder': {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#ddd',
  },
  '.cm-tooltip': {
    border: 'none',
    backgroundColor: '#353a46',
    color: '#d1d4dc',
  },
  '.cm-tooltip .cm-tooltip-arrow:before': {
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  '.cm-tooltip .cm-tooltip-arrow:after': {
    borderTopColor: '#353a46',
    borderBottomColor: '#353a46',
  },
  '.cm-tooltip-autocomplete': {
    '& > ul > li[aria-selected]': {
      backgroundColor: '#2962ff',
      color: '#ffffff',
    },
  },
}, { dark: true });

// TradingView-style light theme
const tradingViewLightTheme = EditorViewTheme.theme({
  '@keyframes blink': {
    '0%, 50%': { opacity: '1' },
    '51%, 100%': { opacity: '0' }
  },
  '&': {
    color: '#333333',
    backgroundColor: '#ffffff',
    fontSize: '14px',
    fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
  },
  '.cm-content': {
    padding: '16px',
    caretColor: '#000000',
    lineHeight: '1.5',
  },
  '.cm-focused .cm-cursor': {
    borderLeftColor: '#000000',
    borderLeftWidth: '2px',
    animation: 'blink 1s step-end infinite',
  },
  '.cm-cursor': {
    borderLeftColor: '#000000',
    borderLeftWidth: '2px',
    animation: 'blink 1s step-end infinite',
  },
  '.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': {
    backgroundColor: '#add6ff',
  },
  '.cm-panels': {
    backgroundColor: '#ffffff',
    color: '#333333',
  },
  '.cm-panels.cm-panels-top': {
    borderBottom: '1px solid #e1e4e8',
  },
  '.cm-panels.cm-panels-bottom': {
    borderTop: '1px solid #e1e4e8',
  },
  '.cm-searchMatch': {
    backgroundColor: '#fff2cc',
    outline: '1px solid #ffd33d',
  },
  '.cm-searchMatch.cm-searchMatch-selected': {
    backgroundColor: '#ffd33d',
  },
  '.cm-activeLine': {
    backgroundColor: '#f5f5f5',
  },
  '.cm-selectionMatch': {
    backgroundColor: '#fff2cc',
  },
  '.cm-matchingBracket, .cm-nonmatchingBracket': {
    backgroundColor: '#e6f3ff',
    outline: '1px solid #b3d9ff',
  },
  '.cm-gutters': {
    backgroundColor: '#ffffff',
    color: '#6e7681',
    border: 'none',
    borderRight: '1px solid #e1e4e8',
  },
  '.cm-activeLineGutter': {
    backgroundColor: '#f5f5f5',
  },
  '.cm-foldPlaceholder': {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#666',
  },
  '.cm-tooltip': {
    border: '1px solid #e1e4e8',
    backgroundColor: '#ffffff',
    color: '#333333',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  '.cm-tooltip .cm-tooltip-arrow:before': {
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  '.cm-tooltip .cm-tooltip-arrow:after': {
    borderTopColor: '#ffffff',
    borderBottomColor: '#ffffff',
  },
  '.cm-tooltip-autocomplete': {
    '& > ul > li[aria-selected]': {
      backgroundColor: '#0366d6',
      color: '#ffffff',
    },
  },
}, { dark: false });

// Custom Algo Script highlighting - Dark theme colors
const algoScriptDarkHighlight = HighlightStyle.define([
  { tag: tags.keyword, color: '#569cd6', fontWeight: 'bold' }, // Blue keywords like 'indicator', 'strategy'
  { tag: tags.string, color: '#ce9178' }, // Orange strings
  { tag: tags.comment, color: '#6a9955', fontStyle: 'italic' }, // Green comments
  { tag: tags.number, color: '#b5cea8' }, // Light green numbers
  { tag: tags.function(tags.variableName), color: '#dcdcaa', fontWeight: 'bold' }, // Yellow functions
  { tag: tags.variableName, color: '#9cdcfe' }, // Light blue variables
  { tag: tags.operator, color: '#d4d4d4' }, // White operators
  { tag: tags.bracket, color: '#ffd700' }, // Gold brackets
  { tag: tags.punctuation, color: '#d4d4d4' }, // White punctuation
  { tag: tags.bool, color: '#569cd6' }, // Blue booleans
  { tag: tags.null, color: '#569cd6' }, // Blue null/na
  { tag: tags.invalid, color: '#f44747', textDecoration: 'underline' }, // Red errors
  { tag: tags.propertyName, color: '#9cdcfe' }, // Light blue properties
  { tag: tags.typeName, color: '#4ec9b0' }, // Teal type names
]);

// Custom Algo Script highlighting - Light theme colors
const algoScriptLightHighlight = HighlightStyle.define([
  { tag: tags.keyword, color: '#0000ff', fontWeight: 'bold' }, // Blue keywords like 'indicator', 'strategy'
  { tag: tags.string, color: '#a31515' }, // Red strings
  { tag: tags.comment, color: '#008000', fontStyle: 'italic' }, // Green comments
  { tag: tags.number, color: '#098658' }, // Dark green numbers
  { tag: tags.function(tags.variableName), color: '#795e26', fontWeight: 'bold' }, // Brown functions
  { tag: tags.variableName, color: '#001080' }, // Dark blue variables
  { tag: tags.operator, color: '#000000' }, // Black operators
  { tag: tags.bracket, color: '#0431fa' }, // Blue brackets
  { tag: tags.punctuation, color: '#000000' }, // Black punctuation
  { tag: tags.bool, color: '#0000ff' }, // Blue booleans
  { tag: tags.null, color: '#0000ff' }, // Blue null/na
  { tag: tags.invalid, color: '#cd3131', textDecoration: 'underline' }, // Red errors
  { tag: tags.propertyName, color: '#001080' }, // Dark blue properties
  { tag: tags.typeName, color: '#267f99' }, // Teal type names
]);

interface AlgoScriptEditorProps {
  value: string;
  onChange: (value: string) => void;
  theme?: 'light' | 'dark';
  readOnly?: boolean;
  autoFocus?: boolean;
  onRun?: () => void;
  onSave?: () => void;
  onPublish?: () => void;
}

const AlgoScriptEditor: React.FC<AlgoScriptEditorProps> = ({
  value,
  onChange,
  theme = 'dark',
  readOnly = false,
  autoFocus = true,
  onRun,
  onSave,
  onPublish,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ line: 1, col: 1 });
  const [characterCount, setCharacterCount] = useState(0);
  const [scriptTitle, setScriptTitle] = useState("Untitled Script");

  const defaultAlgoScript = `// This Algo Script® code is subject to the terms of the Mozilla Public License 2.0 at https://mozilla.org/MPL/2.0/
// © takac1023

//@version=5
indicator("My script")
plot(close)`;

  useEffect(() => {
    if (editorRef.current && !viewRef.current) {
      const extensions = [
        basicSetup,
        lineNumbers(),
        keymap.of([indentWithTab]),
        javascript(),
        syntaxHighlighting(theme === 'dark' ? algoScriptDarkHighlight : algoScriptLightHighlight),
        autocompletion({ override: [algoScriptCompletion] }),
        theme === 'dark' ? tradingViewDarkTheme : tradingViewLightTheme, // Use theme-appropriate editor theme
      ];

      if (readOnly) {
        extensions.push(EditorState.readOnly.of(true));
        extensions.push(EditorView.editable.of(false));
      }

      extensions.push(
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            const newValue = update.state.doc.toString();
            onChange(newValue);
            setCharacterCount(newValue.length);
          }

          // Update cursor position
          if (update.selectionSet) {
            const pos = update.state.selection.main.head;
            const line = update.state.doc.lineAt(pos);
            setCursorPosition({
              line: line.number,
              col: pos - line.from + 1
            });
          }
        })
      );

      // Prevent keyboard events from bubbling up to parent components
      extensions.push(
        EditorView.domEventHandlers({
          keydown: (event) => {
            // Stop propagation to prevent parent keyboard shortcuts
            event.stopPropagation();
            return false; // Let CodeMirror handle the event
          }
        })
      );

      const startState = EditorState.create({
        doc: value || defaultAlgoScript,
        extensions,
      });

      const view = new EditorView({
        state: startState,
        parent: editorRef.current,
      });

      viewRef.current = view;

      // Auto-focus the editor to show blinking cursor and position at end
      if (autoFocus) {
        setTimeout(() => {
          if (view && view.dom) {
            view.focus();
            // Position cursor at the end of the document
            const docLength = view.state.doc.length;
            view.dispatch({
              selection: { anchor: docLength, head: docLength },
              scrollIntoView: true
            });
          }
        }, 100);
      }
    }

    return () => {
      if (viewRef.current) {
        viewRef.current.destroy();
        viewRef.current = null;
      }
    };
  }, [theme, readOnly]);

  useEffect(() => {
    if (viewRef.current && value !== viewRef.current.state.doc.toString()) {
      viewRef.current.dispatch({
        changes: {
          from: 0,
          to: viewRef.current.state.doc.length,
          insert: value || defaultAlgoScript,
        },
      });
    }
  }, [value, defaultAlgoScript]);

  // Initialize character count
  useEffect(() => {
    const initialValue = value || defaultAlgoScript;
    setCharacterCount(initialValue.length);
  }, []);

  // Auto-focus when component becomes visible
  useEffect(() => {
    if (!autoFocus) return;

    const focusEditor = () => {
      if (viewRef.current && viewRef.current.dom) {
        setTimeout(() => {
          if (viewRef.current) {
            viewRef.current.focus();
            // Position cursor at the end of the document
            const docLength = viewRef.current.state.doc.length;
            viewRef.current.dispatch({
              selection: { anchor: docLength, head: docLength },
              scrollIntoView: true
            });
          }
        }, 150);
      }
    };

    // Focus when component mounts and editor is ready
    const timer = setTimeout(focusEditor, 200);

    return () => clearTimeout(timer);
  }, [autoFocus]);

  const handleRun = async () => {
    if (onRun) {
      setIsRunning(true);
      try {
        await onRun();
      } finally {
        setTimeout(() => setIsRunning(false), 1000);
      }
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave();
    }
  };

  const handlePublish = () => {
    if (onPublish) {
      onPublish();
    }
  };



  return (
    <div className={`flex flex-col h-full ${
      theme === 'dark'
        ? 'bg-black text-white'
        : 'bg-white text-black'
    }`} data-editor="true">
      {/* Header matching chart interface standards - 44px height for enhanced presence */}
      <div className={`h-[44px] flex items-stretch px-0 ${
        theme === 'dark'
          ? 'bg-black border-b border-zinc-800'
          : 'bg-white border-b border-zinc-300'
      }`}>
        {/* Left section: Traffic lights + editable title */}
        <div className="flex items-center px-4 gap-3">
          {/* Traffic light buttons matching sidebar style */}
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500 hover:bg-red-400 transition-colors cursor-pointer"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 hover:bg-yellow-400 transition-colors cursor-pointer"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-green-500 hover:bg-green-400 transition-colors cursor-pointer"></div>
          </div>

          {/* Script title input using shadcn Input component */}
          <div className="flex items-center">
            <Input
              type="text"
              value={scriptTitle}
              onChange={(e) => setScriptTitle(e.target.value)}
              className={`text-sm font-medium h-8 min-w-[140px] max-w-[200px] rounded-none shadow-sm ${
                theme === 'dark'
                  ? 'bg-zinc-900 border-zinc-700 text-white focus:border-zinc-400'
                  : 'bg-zinc-100 border-zinc-300 text-black focus:border-zinc-500'
              }`}
              placeholder="Script name"
              maxLength={50}
            />
          </div>
        </div>

        {/* Center section: Version indicator - Much larger with enhanced presence */}
        <div className="flex-1 flex items-center justify-center px-12 py-2">
          <span className={`text-base font-semibold ${
            theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'
          }`}>• Algo Script v1.0</span>
        </div>

        {/* Right section: Action buttons - responsive design */}
        <div className="flex items-center px-4 gap-2">
          <button
            onClick={handleSave}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs transition-colors duration-200 rounded-md font-medium shadow-sm hover:shadow-md ${
              theme === 'dark'
                ? 'bg-zinc-900 hover:bg-zinc-800 text-white'
                : 'bg-zinc-100 hover:bg-zinc-200 text-black'
            }`}
            title="Save script"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span className="hidden sm:inline">Save</span>
          </button>

          <button
            onClick={handleRun}
            disabled={isRunning}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs transition-all duration-200 rounded-md font-medium shadow-sm hover:shadow-md ${
              isRunning
                ? (theme === 'dark' ? 'bg-zinc-700 text-zinc-400 cursor-not-allowed' : 'bg-zinc-300 text-zinc-500 cursor-not-allowed')
                : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 active:scale-95'
            }`}
            title={isRunning ? "Running..." : "Add script to chart"}
          >
            {isRunning ? (
              <>
                <svg className="w-3 h-3 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="hidden sm:inline">Running...</span>
              </>
            ) : (
              <>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="hidden sm:inline">Add to chart</span>
              </>
            )}
          </button>

          <button
            onClick={handlePublish}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs transition-colors duration-200 rounded-md font-medium shadow-sm hover:shadow-md ${
              theme === 'dark'
                ? 'bg-zinc-900 hover:bg-zinc-800 text-white'
                : 'bg-zinc-100 hover:bg-zinc-200 text-black'
            }`}
            title="Publish strategy"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            <span className="hidden sm:inline">Publish strategy</span>
          </button>
        </div>
      </div>

      {/* Editor container with right panel */}
      <div className={`flex-1 relative flex gap-1 ${
        theme === 'dark' ? 'bg-black' : 'bg-white'
      }`}>
        {/* Main editor area */}
        <div className="flex-1 relative code-editor">
          <div
            ref={editorRef}
            className="h-full w-full code-editor"
          />
        </div>

        {/* Right panel - matches sidebar width */}
        <div className="w-[52px] flex-shrink-0">
          <div className={`w-full h-full rounded flex flex-col ${
            theme === 'dark'
              ? 'bg-black border border-zinc-800'
              : 'bg-white border border-zinc-300'
          }`}>
            {/* Panel content - Enhanced professional styling */}
            <div className="flex flex-col items-center pt-4 pb-3">
              {/* Question mark icon - Enhanced hollow/outline style */}
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={`transition-all duration-300 cursor-pointer mb-6 hover:scale-110 ${
                  theme === 'dark'
                    ? 'text-zinc-400 hover:text-zinc-200'
                    : 'text-zinc-500 hover:text-zinc-700'
                }`}
              >
                {/* Question mark shape - hollow outline style */}
                <path
                  d="M7.5 7.5C7.5 5.01472 9.51472 3 12 3C14.4853 3 16.5 5.01472 16.5 7.5C16.5 9.5 15 10.5 13.5 11.5C12.5 12.1667 12 12.5 12 13.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
                {/* Question mark dot */}
                <circle
                  cx="12"
                  cy="18"
                  r="1"
                  fill="currentColor"
                />
              </svg>

              {/* Open book icon - Enhanced hollow/outline style */}
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={`transition-all duration-300 cursor-pointer mb-6 hover:scale-110 ${
                  theme === 'dark'
                    ? 'text-zinc-400 hover:text-zinc-200'
                    : 'text-zinc-500 hover:text-zinc-700'
                }`}
              >
                {/* Book pages - hollow outline style */}
                <path
                  d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
                <path
                  d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
                {/* Book spine */}
                <path
                  d="M12 7v14"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              {/* AI logo icon - Matching main sidebar design exactly */}
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={`transition-all duration-300 cursor-pointer hover:scale-110 ${
                  theme === 'dark'
                    ? 'text-zinc-400 hover:text-zinc-200'
                    : 'text-zinc-500 hover:text-zinc-700'
                }`}
              >
                {/* Letter "A" - hollow outline with transparent center */}
                <path
                  d="M3 20L7.5 6H8.5L13 20H11.2L10.1 17H5.9L4.8 20H3ZM6.5 15H9.5L8 10.5L6.5 15Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
                {/* Letter "I" - hollow outline with transparent center */}
                <path
                  d="M16 6H21V8H19V18H21V20H16V18H18V8H16V6Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Status Bar - Professional styling with responsive design */}
      <div className={`h-6 flex items-center justify-between px-4 text-xs ${
        theme === 'dark'
          ? 'bg-black border-t border-zinc-800'
          : 'bg-white border-t border-zinc-300'
      }`}>
        {/* Left side: Cursor position and version */}
        <div className="flex items-center gap-2 sm:gap-4">
          <span className={`font-mono ${
            theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'
          }`}>
            Line {cursorPosition.line}, Col {cursorPosition.col}
          </span>
          <div className={`w-px h-3 hidden sm:block ${
            theme === 'dark' ? 'bg-zinc-600' : 'bg-zinc-400'
          }`}></div>
          <span className={`hidden sm:inline ${
            theme === 'dark' ? 'text-zinc-500' : 'text-zinc-600'
          }`}>
            Algo Script v6
          </span>
        </div>

        {/* Right side: Status information */}
        <div className="flex items-center gap-2 sm:gap-4">
          <span className={`hidden sm:inline ${
            theme === 'dark' ? 'text-zinc-500' : 'text-zinc-600'
          }`}>
            {characterCount} characters
          </span>
          <div className={`w-px h-3 hidden sm:block ${
            theme === 'dark' ? 'bg-zinc-600' : 'bg-zinc-400'
          }`}></div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
            <span className={`${
              theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'
            }`}>Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlgoScriptEditor;