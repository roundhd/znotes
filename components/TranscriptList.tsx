import React, { useEffect, useRef } from 'react';
import { TranscriptSegment } from '../types';

interface TranscriptListProps {
  segments: TranscriptSegment[];
  currentTime: number;
  autoScroll: boolean;
  onSeek: (time: number) => void;
}

const TranscriptList: React.FC<TranscriptListProps> = ({ 
  segments, 
  currentTime, 
  autoScroll,
  onSeek 
}) => {
  const activeRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Find active segment index
  const activeIndex = segments.findIndex(
    (seg) => currentTime >= seg.start && currentTime < (seg.start + seg.duration)
  );

  useEffect(() => {
    if (autoScroll && activeRef.current && containerRef.current) {
      activeRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest'
      });
    }
  }, [activeIndex, autoScroll]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      ref={containerRef}
      className="flex-1 overflow-y-auto p-4 space-y-4 pb-20 scroll-smooth"
    >
      {segments.length === 0 ? (
        <div className="text-center text-gray-400 mt-10">
          <p>No video detected or transcript unavailable.</p>
          <p className="text-sm mt-2">Open a YouTube video to begin.</p>
        </div>
      ) : (
        segments.map((segment, index) => {
          const isActive = index === activeIndex;
          
          return (
            <div
              key={segment.id}
              ref={isActive ? activeRef : null}
              onClick={() => onSeek(segment.start)}
              className={`
                group relative p-3 rounded-lg transition-all duration-200 cursor-pointer border
                ${isActive 
                  ? 'bg-brand-50 border-brand-200 shadow-sm' 
                  : 'bg-white border-transparent hover:bg-gray-50 hover:border-gray-200'
                }
              `}
            >
              <div className="flex gap-3">
                <div className={`
                  text-xs font-mono pt-1 min-w-[40px]
                  ${isActive ? 'text-brand-600 font-bold' : 'text-gray-400 group-hover:text-gray-500'}
                `}>
                  {formatTime(segment.start)}
                </div>
                <div className={`
                  text-sm leading-relaxed
                  ${isActive ? 'text-slate-800 font-medium' : 'text-slate-600'}
                `}>
                  {segment.text}
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default TranscriptList;
