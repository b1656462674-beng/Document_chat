import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, Search, MoreHorizontal, Smile, Plus, Send, FileText, Image } from 'lucide-react';
import { NotepadNote, FileMessage, AdminConfig } from '../types';
import { FileCard } from './FileCard';

interface NotepadViewProps {
  notes: NotepadNote[];
  onBack: () => void;
  onAddNote: (note: NotepadNote) => void;
  onOpenPreview: (file: FileMessage) => void;
  adminConfig: AdminConfig;
}

export const NotepadView: React.FC<NotepadViewProps> = ({
  notes,
  onBack,
  onAddNote,
  onOpenPreview,
  adminConfig
}) => {
  const [inputText, setInputText] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const feedEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    feedEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [notes]);

  const handleSendText = () => {
    if (!inputText.trim()) return;
    const newNote: NotepadNote = {
      id: `np-user-${Date.now()}`,
      sender: 'me',
      type: 'text',
      content: inputText,
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    };
    onAddNote(newNote);
    setInputText('');
  };

  const simulatedFiles = [
    { name: '背词计划表.xlsx', extension: 'xlsx', size: '580 KB' },
    { name: 'HT_Voice_Memo.mp3', extension: 'mp3', size: '3.4 MB' },
    { name: '语法重点.pdf', extension: 'pdf', size: '8.2 MB' }
  ];

  const handleSelectFile = (tpl: typeof simulatedFiles[0]) => {
    setIsDrawerOpen(false);
    
    const fileMsg: FileMessage = {
      ...tpl,
      status: 'success'
    };

    const newNote: NotepadNote = {
      id: `np-user-file-${Date.now()}`,
      sender: 'me',
      type: 'file',
      file: fileMsg,
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    };

    onAddNote(newNote);
  };

  return (
    <div className="flex flex-col h-full bg-slate-100 text-slate-800 font-sans relative">
      {/* Header (Screenshot 5) */}
      <div className="flex items-center justify-between px-3 py-2 bg-white border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-1.5">
          <button onClick={onBack} className="p-1.5 hover:bg-gray-100 rounded-full transition">
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
          <div className="flex flex-col">
            <span className="font-bold text-gray-800 text-sm">记事本 (Notepad)</span>
            <span className="text-[9px] text-purple-600 font-semibold">Only visible to you</span>
          </div>
        </div>
        <div className="flex items-center gap-3.5">
          <Search className="w-4 h-4 text-gray-700 cursor-pointer" />
          <MoreHorizontal className="w-5 h-5 text-gray-700 cursor-pointer" />
        </div>
      </div>

      {/* Note list */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        {notes.map((note) => {
          const isSeparator = note.timestamp === '06/01 15:28' || note.timestamp === '12:01' || note.timestamp === '12:37';

          if (isSeparator) {
            return (
              <div key={note.id} className="text-center py-1">
                <span className="text-[10px] text-gray-400 font-medium px-2 py-0.5 rounded-full bg-gray-200/50">
                  {note.timestamp}
                </span>
              </div>
            );
          }

          if (note.content?.startsWith('Post Embed:')) {
            const title = note.content.replace('Post Embed:', '').trim();
            return (
              <div key={note.id} className="flex justify-start">
                <div className="bg-white rounded-2xl p-2.5 max-w-[85%] shadow-sm border border-gray-100 cursor-pointer hover:shadow transition">
                  <div className="flex gap-3">
                    <img 
                      src="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=100&h=100&q=80" 
                      className="w-14 h-14 rounded-xl object-cover shrink-0" 
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-800 truncate">{title}</p>
                      <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                        <span>A pretty girl with a pretty heart 💗</span>
                        <span className="text-purple-600 font-semibold text-[8px] border border-purple-200 px-1 rounded">HelloTalk</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div key={note.id} className="flex justify-end">
              <div className="max-w-[80%]">
                {note.type === 'text' ? (
                  <div className="rounded-2xl px-3.5 py-2 text-xs shadow-sm bg-purple-100 text-purple-900 border border-purple-200 rounded-tr-none select-all whitespace-pre-wrap break-words">
                    {note.content}
                  </div>
                ) : (
                  note.file && (
                    <div 
                      onClick={() => note.file && onOpenPreview(note.file)}
                      className="cursor-pointer active:scale-95 transition-transform"
                    >
                      <FileCard file={note.file} />
                    </div>
                  )
                )}
                <p className="text-[9px] text-gray-400 text-right mt-0.5 mr-1">{note.timestamp}</p>
              </div>
            </div>
          );
        })}
        <div ref={feedEndRef} />
      </div>

      {/* Input area */}
      <div className="bg-white border-t border-gray-100 shrink-0">
        <div className="px-3 py-2 flex items-center gap-2">
          <button 
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            className={`p-1.5 rounded-full transition ${isDrawerOpen ? 'bg-purple-100 text-purple-600 rotate-45' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Plus className="w-5 h-5" />
          </button>

          <div className="flex-1 bg-gray-100 rounded-full px-3.5 py-1.5 flex items-center min-w-0">
            <input
              type="text"
              placeholder="Note down thoughts or save files..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendText()}
              className="w-full text-xs text-gray-700 bg-transparent outline-none"
            />
            <Smile className="w-4 h-4 text-gray-400 cursor-pointer shrink-0 ml-1.5" />
          </div>

          {inputText.trim() ? (
            <button 
              onClick={handleSendText}
              className="p-1.5 rounded-full bg-purple-500 text-white"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button className="p-1.5 text-gray-400 hover:text-gray-600">
              <Smile className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Notepad Attach Drawer (Screenshot 5 details: 添加文件附件) */}
        {isDrawerOpen && (
          <div className="border-t border-gray-100 bg-gray-50 px-5 py-4 animate-slide-up">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">保存到记事本的文件类型:</p>
            <div className="grid grid-cols-3 gap-2">
              {simulatedFiles.map((file, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectFile(file)}
                  className="bg-white border border-gray-200 rounded-xl p-2.5 hover:border-purple-300 hover:bg-purple-50/20 text-left transition flex flex-col gap-1.5 shrink-0"
                >
                  <FileText className="w-5 h-5 text-purple-500" />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-gray-800 truncate">{file.name}</p>
                    <p className="text-[9px] text-gray-400">{file.size}</p>
                  </div>
                </button>
              ))}
            </div>
            
            <p className="text-[9px] text-gray-400 mt-3 text-center">
              记事本支持 Word、PPT、PDF、Excel、压缩包、音频等常见文件卡片的持久保存。
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
