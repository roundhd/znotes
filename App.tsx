import React, { useState, useEffect, useCallback } from 'react';
import { Icons } from './constants';
import TranscriptList from './components/TranscriptList';
import { TranscriptSegment, MessageType } from './types';
import { generateMockTranscript } from './services/mockDataService';

declare const chrome: any;

const App: React.FC = () => {
  const [segments, setSegments] = useState<TranscriptSegment[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [autoScroll, setAutoScroll] = useState(true);
  const [videoId, setVideoId] = useState<string | null>(null);

  // Listen for messages from content script
  useEffect(() => {
    // Initial mock data load
    setSegments(generateMockTranscript(1200));

    // Message Listener
    const handleMessage = (message: any, sender: any, sendResponse: any) => {
      if (message.type === MessageType.VIDEO_UPDATE) {
        setCurrentTime(message.payload.currentTime);
        // If video ID changed, we would re-fetch transcript here
        if (message.payload.videoId && message.payload.videoId !== videoId) {
            setVideoId(message.payload.videoId);
            // In a real app, fetchRealTranscript(message.payload.videoId)
            setSegments(generateMockTranscript(Math.floor(Math.random() * 500) + 300));
        }
      }
    };

    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
      chrome.runtime.onMessage.addListener(handleMessage);
      
      // Request initial status
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs: any) => {
        if (tabs[0]?.id) {
            chrome.tabs.sendMessage(tabs[0].id, { type: MessageType.REQUEST_STATUS }).catch(() => {
                // Ignore errors if content script isn't ready
            });
        }
      });
    }

    return () => {
      if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
        chrome.runtime.onMessage.removeListener(handleMessage);
      }
    };
  }, [videoId]);

  const handleCopyTranscript = () => {
    const allText = segments.map(s => `[${s.start}] ${s.text}`).join('\n');
    navigator.clipboard.writeText(allText);
    // Could add a toast notification here
  };

  const handleSeek = (time: number) => {
    // Send message to content script to seek video
    if (typeof chrome !== 'undefined' && chrome.tabs) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs: any) => {
            if (tabs[0]?.id) {
                chrome.tabs.sendMessage(tabs[0].id, { 
                    type: 'SEEK_VIDEO', 
                    payload: { time } 
                });
            }
        });
    }
    // Temporarily disable autoscroll so user can read what they clicked
    setAutoScroll(false);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="px-4 py-3 bg-white border-b border-gray-200 sticky top-0 z-10 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <Icons.Logo className="w-6 h-6" />
          <h1 className="font-semibold text-slate-800 text-lg tracking-tight">Transcript<span className="text-brand-600">Sync</span></h1>
        </div>
        <div className="flex items-center gap-1">
            <button className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors" title="Settings">
                <div className="w-1 h-1 bg-current rounded-full mb-0.5"></div>
                <div className="w-1 h-1 bg-current rounded-full mb-0.5"></div>
                <div className="w-1 h-1 bg-current rounded-full"></div>
            </button>
        </div>
      </header>

      {/* Toolbar */}
      <div className="px-4 py-2 bg-white border-b border-gray-100 flex items-center justify-between">
        <div className="flex gap-2">
            <button 
                onClick={() => setAutoScroll(!autoScroll)}
                className={`
                    flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all
                    ${autoScroll 
                        ? 'bg-brand-50 text-brand-700 border border-brand-200' 
                        : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
                    }
                `}
            >
                <Icons.Scroll className={`w-3.5 h-3.5 ${autoScroll ? 'animate-pulse' : ''}`} />
                {autoScroll ? 'Auto-scroll On' : 'Auto-scroll Off'}
            </button>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={handleCopyTranscript}
                className="p-1.5 text-gray-500 hover:text-brand-600 hover:bg-brand-50 rounded-md transition-colors"
                title="Copy Transcript"
            >
                <Icons.Copy className="w-4 h-4" />
            </button>
            <button 
                className="p-1.5 text-gray-500 hover:text-brand-600 hover:bg-brand-50 rounded-md transition-colors"
                title="Translate (Coming Soon)"
            >
                <Icons.Translate className="w-4 h-4" />
            </button>
        </div>
      </div>

      {/* Main Content */}
      <TranscriptList 
        segments={segments}
        currentTime={currentTime}
        autoScroll={autoScroll}
        onSeek={handleSeek}
      />
      
      {/* Footer / CTA Area */}
      <div className="p-4 bg-white border-t border-gray-200">
        <button className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-lg shadow-sm transition-all flex items-center justify-center gap-2">
            <span>Summarize with AI</span>
            <span className="px-1.5 py-0.5 bg-brand-500 rounded text-[10px] uppercase tracking-wider">Pro</span>
        </button>
      </div>
    </div>
  );
};

export default App;