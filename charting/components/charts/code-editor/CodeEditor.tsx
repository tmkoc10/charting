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

// TradingView-style theme
const tradingViewTheme = EditorViewTheme.theme({
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

// Custom Algo Script highlighting - Exact TradingView Pine Script colors
const algoScriptHighlight = HighlightStyle.define([
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
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState("");

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
        syntaxHighlighting(algoScriptHighlight),
        autocompletion({ override: [algoScriptCompletion] }),
        tradingViewTheme, // Use custom TradingView theme
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

  const handleTitleClick = () => {
    setIsEditingTitle(true);
    setTempTitle(scriptTitle);
  };

  const handleTitleSave = () => {
    if (tempTitle.trim()) {
      setScriptTitle(tempTitle.trim());
    }
    setIsEditingTitle(false);
    setTempTitle("");
  };

  const handleTitleCancel = () => {
    setIsEditingTitle(false);
    setTempTitle("");
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleSave();
    } else if (e.key === 'Escape') {
      handleTitleCancel();
    }
  };

  return (
    <div className="flex flex-col h-full bg-black text-white" data-editor="true">
      {/* Header matching chart interface standards - 38px height */}
      <div className="h-[38px] bg-black border-b border-zinc-800 flex items-stretch px-0">
        {/* Left section: Traffic lights + editable title */}
        <div className="flex items-center px-4 gap-3">
          {/* Traffic light buttons matching sidebar style */}
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500 hover:bg-red-400 transition-colors cursor-pointer"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 hover:bg-yellow-400 transition-colors cursor-pointer"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-green-500 hover:bg-green-400 transition-colors cursor-pointer"></div>
          </div>

          {/* Editable script title with capsule styling */}
          <div className="flex items-center">
            {isEditingTitle ? (
              <input
                type="text"
                value={tempTitle}
                onChange={(e) => setTempTitle(e.target.value)}
                onBlur={handleTitleSave}
                onKeyDown={handleTitleKeyDown}
                className="bg-zinc-900 border border-zinc-700 text-white text-sm font-medium px-3 py-1.5 rounded-full focus:border-zinc-400 focus:outline-none min-w-[140px] shadow-sm"
                autoFocus
                maxLength={50}
              />
            ) : (
              <button
                onClick={handleTitleClick}
                className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white text-sm font-medium px-3 py-1.5 rounded-full transition-all duration-200 shadow-sm hover:shadow-md hover:scale-105 active:scale-95"
                title="Click to edit script name"
              >
                {scriptTitle}
              </button>
            )}
          </div>
        </div>

        {/* Center section: Version indicator */}
        <div className="flex-1 flex items-center justify-center">
          <span className="text-xs text-zinc-500">• Algo Script v1.0</span>
        </div>

        {/* Right section: Action buttons - responsive design */}
        <div className="flex items-center px-4 gap-2">
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-zinc-900 hover:bg-zinc-800 text-white transition-colors duration-200 rounded-md font-medium shadow-sm hover:shadow-md"
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
                ? 'bg-zinc-700 text-zinc-400 cursor-not-allowed'
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
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-zinc-900 hover:bg-zinc-800 text-white transition-colors duration-200 rounded-md font-medium shadow-sm hover:shadow-md"
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
      <div className="flex-1 relative bg-black flex gap-1">
        {/* Main editor area */}
        <div className="flex-1 relative code-editor">
          <div
            ref={editorRef}
            className="h-full w-full code-editor"
          />
        </div>

        {/* Right panel - matches sidebar width */}
        <div className="w-[52px] flex-shrink-0">
          <div className="w-full h-full bg-black border border-zinc-800 rounded flex flex-col">
            {/* Panel content */}
            <div className="flex flex-col items-center pt-3 pb-2">
              {/* Question mark icon - standalone without container */}
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-zinc-400 hover:text-zinc-300 transition-colors duration-200 cursor-pointer mb-5"
              >
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"
                  fill="currentColor"
                />
              </svg>

              {/* Horizontal divider - closer spacing for visual connection */}
              <div className="w-full flex justify-center mb-5">
                <div className="h-px w-8 bg-white"></div>
              </div>

              {/* Open book icon - standalone without container */}
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-zinc-400 hover:text-zinc-300 transition-colors duration-200 cursor-pointer mb-5"
              >
                <path
                  d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"
                  fill="currentColor"
                />
                <path
                  d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"
                  fill="currentColor"
                />
              </svg>

              {/* Horizontal divider - closer spacing for visual connection */}
              <div className="w-full flex justify-center mb-5">
                <div className="h-px w-8 bg-white"></div>
              </div>

              {/* AI logo icon - standalone without container */}
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-zinc-400 hover:text-zinc-300 transition-colors duration-200 cursor-pointer mb-5"
              >
                {/* AI text logo - bold, clean letterforms */}
                <text
                  x="12"
                  y="16"
                  textAnchor="middle"
                  fontSize="14"
                  fontWeight="700"
                  fontFamily="system-ui, -apple-system, sans-serif"
                  fill="currentColor"
                  letterSpacing="0.5"
                >
                  AI
                </text>
              </svg>

              {/* Horizontal divider - closer spacing for visual connection */}
              <div className="w-full flex justify-center mb-5">
                <div className="h-px w-8 bg-white"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Status Bar - Professional styling with responsive design */}
      <div className="h-6 bg-black border-t border-zinc-800 flex items-center justify-between px-4 text-xs">
        {/* Left side: Cursor position and version */}
        <div className="flex items-center gap-2 sm:gap-4">
          <span className="text-zinc-400 font-mono">
            Line {cursorPosition.line}, Col {cursorPosition.col}
          </span>
          <div className="w-px h-3 bg-zinc-600 hidden sm:block"></div>
          <span className="text-zinc-500 hidden sm:inline">
            Algo Script v6
          </span>
        </div>

        {/* Right side: Status information */}
        <div className="flex items-center gap-2 sm:gap-4">
          <span className="text-zinc-500 hidden sm:inline">
            {characterCount} characters
          </span>
          <div className="w-px h-3 bg-zinc-600 hidden sm:block"></div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
            <span className="text-zinc-400">Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlgoScriptEditor;