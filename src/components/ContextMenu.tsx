import React from 'react';
import { Bookmark, CheckSquare, Pin, Undo2 } from 'lucide-react';
import { Message } from '../types';

interface ContextMenuProps {
  message: Message;
  rect: DOMRect;
  onClose: () => void;
  onAction: (action: string) => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  message,
  rect,
  onClose,
  onAction
}) => {
  // Prevent clicks inside menu from closing it
  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div 
      className="absolute inset-0 bg-black/45 z-50 flex items-end justify-center font-sans animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-sm bg-white rounded-t-[32px] overflow-hidden shadow-2xl animate-slide-up pb-8"
        onClick={handleMenuClick}
      >
        {/* Top Circular Button Row - Match HelloTalk image layout */}
        <div className="flex items-center justify-center gap-8 py-6 px-6 border-b border-gray-100 bg-gray-50/50">
          {/* Recall Button */}
          <button
            onClick={() => onAction('recall')}
            className="flex flex-col items-center gap-1.5 focus:outline-none group"
            title="撤回消息 (Recall)"
          >
            <div className="w-14 h-14 bg-white hover:bg-gray-50 active:bg-gray-100 rounded-full flex items-center justify-center shadow-md border border-gray-100 transition-transform group-active:scale-95">
              <Undo2 className="w-6 h-6 text-gray-700" />
            </div>
            <span className="text-[10px] text-gray-500 font-bold">撤回</span>
          </button>

          {/* Favorite Button */}
          <button
            onClick={() => onAction('favorite')}
            className="flex flex-col items-center gap-1.5 focus:outline-none group"
            title="收藏消息 (Save to Favorites)"
          >
            <div className="w-14 h-14 bg-white hover:bg-gray-50 active:bg-gray-100 rounded-full flex items-center justify-center shadow-md border border-gray-100 transition-transform group-active:scale-95">
              <Bookmark className="w-6 h-6 text-gray-700" />
            </div>
            <span className="text-[10px] text-gray-500 font-bold">收藏</span>
          </button>
        </div>

        {/* Vertical Menu Options List */}
        <div className="py-2 divide-y divide-gray-50">
          {/* Pin Message Option */}
          <button
            onClick={() => onAction('pin')}
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 active:bg-gray-100 transition text-left"
          >
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                <Pin className="w-4.5 h-4.5 rotate-45" />
              </div>
              <span className="text-xs font-bold text-gray-800">
                置顶消息 (Pin Message)
              </span>
            </div>
            <svg className="w-3.5 h-3.5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Multi-select Option */}
          <button
            onClick={() => onAction('multi_select')}
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 active:bg-gray-100 transition text-left"
          >
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                <CheckSquare className="w-4.5 h-4.5" />
              </div>
              <span className="text-xs font-bold text-gray-800">
                多选消息 (Multi-select)
              </span>
            </div>
            <svg className="w-3.5 h-3.5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Informative helper label */}
        <div className="text-center pt-3">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Tap outside to dismiss</p>
        </div>
      </div>
    </div>
  );
};
