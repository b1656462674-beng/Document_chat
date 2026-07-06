import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, Phone, MoreHorizontal, Image, Smile, Gift, Languages, Mic, Plus, Send, X, FileText, CheckCircle2, Bookmark, Eye } from 'lucide-react';
import { Contact, Message, FileMessage, AdminConfig } from '../types';
import { FileCard } from './FileCard';
// @ts-ignore
import fileIconImg from '../assets/images/file_icon_1783336286020.jpg';

interface ChatWindowProps {
  contact: Contact;
  onBack: () => void;
  onSendMessage: (msg: Message) => void;
  onOpenPreview: (file: FileMessage) => void;
  onLongPressMessage: (message: Message, elementRect: DOMRect) => void;
  adminConfig: AdminConfig;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  contact,
  onBack,
  onSendMessage,
  onOpenPreview,
  onLongPressMessage,
  adminConfig
}) => {
  const [inputText, setInputText] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const feedEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on load or new message
  useEffect(() => {
    feedEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [contact.messages]);

  const handleSendText = () => {
    if (!inputText.trim()) return;
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'me',
      type: 'text',
      content: inputText,
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      isRead: true
    };
    onSendMessage(newMsg);
    setInputText('');
  };

  // Mock list of files for quick simulation
  const mockFilesToAttach: Omit<FileMessage, 'status'>[] = [
    { name: '文档.docx', extension: 'docx', size: '24.5 KB' },
    { name: '学习计划表_2026.xlsx', extension: 'xlsx', size: '1.2 MB' },
    { name: 'HelloTalk_Guide.pdf', extension: 'pdf', size: '5.6 MB' },
    { name: 'Audio_Lesson_01.mp3', extension: 'mp3', size: '12.8 MB' },
    { name: '资料备份.zip', extension: 'zip', size: '45.2 MB' },
    { name: '恶意软件测试包.exe_blocked', extension: 'exe', size: '320 KB' } // triggers failure/risk
  ];

  const handleSelectSimulatedFile = (fileTemplate: Omit<FileMessage, 'status'>) => {
    setIsDrawerOpen(false);
    
    if (!adminConfig.ht_file_message_enable) {
      alert('后台已关闭文件消息功能 (ht_file_message_enable = false)');
      return;
    }

    // Check size limit from admin policy
    const numericSize = parseFloat(fileTemplate.size);
    if (numericSize > adminConfig.ht_file_upload_policy.maxSizeMB) {
      alert(`文件大小超过限制：当前 ${fileTemplate.size}，限制为 ${adminConfig.ht_file_upload_policy.maxSizeMB}MB`);
      return;
    }

    // Check if zip extension is allowed
    const isZip = ['zip', 'rar', '7z'].includes(fileTemplate.extension);
    if (isZip && !adminConfig.ht_file_upload_policy.allowedZipTypes.includes(fileTemplate.extension)) {
      alert(`不支持该类型的压缩文件：.${fileTemplate.extension}`);
      return;
    }

    // Setup initial uploading state
    const fileMsg: FileMessage = {
      ...fileTemplate,
      status: 'uploading',
      progress: 10
    };

    const newMsgId = `msg-${Date.now()}`;
    const newMsg: Message = {
      id: newMsgId,
      sender: 'me',
      type: 'file',
      file: fileMsg,
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      isRead: false
    };

    onSendMessage(newMsg);

    // Simulate upload progress
    let prog = 10;
    const interval = setInterval(() => {
      prog += 30;
      if (prog >= 100) {
        clearInterval(interval);
        
        // Finalize state
        let finalStatus: 'success' | 'failed' | 'risk_blocked' = 'success';
        if (fileTemplate.name.includes('blocked')) {
          finalStatus = 'risk_blocked';
        }

        const updatedFile: FileMessage = {
          ...fileTemplate,
          status: finalStatus,
          progress: 100
        };

        const updatedMsg: Message = {
          ...newMsg,
          file: updatedFile,
          isRead: finalStatus === 'success'
        };
        onSendMessage(updatedMsg);
      } else {
        const progressFile: FileMessage = {
          ...fileTemplate,
          status: 'uploading',
          progress: prog
        };
        const progressMsg: Message = {
          ...newMsg,
          file: progressFile
        };
        onSendMessage(progressMsg);
      }
    }, 400);
  };

  // Trigger Native File Select Simulation
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleNativeFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeInMB = file.size / (1024 * 1024);
    const ext = file.name.split('.').pop() || '';
    
    const fileTemplate = {
      name: file.name,
      extension: ext,
      size: `${sizeInMB.toFixed(2)} MB`
    };

    handleSelectSimulatedFile(fileTemplate);
  };

  // Sticker item render
  const renderSticker = () => {
    return (
      <div className="flex flex-col items-end">
        {/* Visual custom vector sticker matching Screenshot 2 */}
        <div className="w-24 h-24 bg-gradient-to-tr from-purple-400 to-indigo-500 rounded-2xl flex items-center justify-center shadow-sm relative overflow-hidden group">
          <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-white animate-bounce"></div>
          <div className="absolute bottom-2 left-3 w-5 h-5 rounded-full bg-yellow-300"></div>
          {/* Cute eyes */}
          <div className="flex gap-2">
            <div className="w-3.5 h-3.5 rounded-full bg-white flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-black"></div>
            </div>
            <div className="w-3.5 h-3.5 rounded-full bg-white flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-black"></div>
            </div>
          </div>
          {/* Blush and smile */}
          <div className="absolute bottom-6 w-8 h-1.5 bg-red-400/40 rounded-full"></div>
          <span className="absolute bottom-1 right-2 text-[8px] text-white/80 uppercase font-mono">HT Stick</span>
        </div>
        <span className="text-[10px] text-gray-400 mt-1">HelloTalk Sticker</span>
      </div>
    );
  };

  // Gift item render
  const renderGift = (giftTitle: string) => {
    return (
      <div className="flex items-center gap-3 bg-gradient-to-r from-red-50 to-orange-50 border border-red-100 rounded-2xl p-3 max-w-xs shadow-sm">
        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-500 shrink-0">
          <Gift className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-bold text-red-700">{giftTitle}</p>
          <p className="text-[10px] text-red-500 mt-0.5">Gift Sent to {contact.name}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-slate-100 text-slate-800 font-sans relative">
      {/* Hidden Native File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleNativeFileChange} 
        className="hidden" 
      />

      {/* Header (Screenshot 2) */}
      <div className="flex items-center justify-between px-3 py-2 bg-white border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-1.5">
          <button onClick={onBack} className="p-1.5 hover:bg-gray-100 rounded-full transition">
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="font-bold text-gray-800 text-sm">{contact.name}</span>
              {contact.isVIP && (
                <span className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-extrabold text-[8px] px-1 py-0.5 rounded italic">
                  {contact.vipLevel || 'VIP'}
                </span>
              )}
            </div>
            <span className="text-[9px] text-gray-400">Active today</span>
          </div>
        </div>
        <div className="flex items-center gap-3.5">
          <Phone className="w-4 h-4 text-gray-700 cursor-pointer" />
          <MoreHorizontal className="w-5 h-5 text-gray-700 cursor-pointer" />
        </div>
      </div>

      {/* Message Feed */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        {contact.messages.map((msg) => {
          const isMe = msg.sender === 'me';
          const isSystemTime = msg.content?.includes('Monday') || msg.content === '14:39' || msg.content === '12:01' || msg.content === '12:37';

          if (isSystemTime) {
            return (
              <div key={msg.id} className="text-center py-1">
                <span className="text-[10px] text-gray-400 font-medium px-2 py-0.5 rounded-full bg-gray-200/50">
                  {msg.content}
                </span>
              </div>
            );
          }

          // Render Post Embed card from Screen 2
          if (msg.content?.startsWith('Post Embed:')) {
            const title = msg.content.replace('Post Embed:', '').trim();
            return (
              <div key={msg.id} className="flex justify-start">
                <div className="flex items-start gap-2 max-w-[80%]">
                  <img src={contact.avatar} className="w-8 h-8 rounded-full object-cover border border-gray-200" />
                  <div className="bg-white rounded-2xl p-2.5 shadow-sm border border-gray-100 cursor-pointer hover:shadow transition">
                    <div className="flex gap-3">
                      <img 
                        src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&h=100&q=80" 
                        className="w-14 h-14 rounded-xl object-cover shrink-0" 
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-gray-800 truncate">{title}</p>
                        <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                          <span>☀️💙</span>
                          <span className="text-purple-600 font-semibold text-[8px] border border-purple-200 px-1 rounded">HelloTalk</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}
            >
              {!isMe && (
                <img
                  src={contact.avatar}
                  alt={contact.name}
                  className="w-8 h-8 rounded-full object-cover border border-gray-200 shrink-0"
                />
              )}

              <div 
                className={`group max-w-[75%] relative`}
                onContextMenu={(e) => {
                  e.preventDefault();
                  const rect = e.currentTarget.getBoundingClientRect();
                  onLongPressMessage(msg, rect);
                }}
                onTouchStart={(e) => {
                  // Simulate touch hold for context menu
                  const touch = e.touches[0];
                  const rect = e.currentTarget.getBoundingClientRect();
                  const timer = setTimeout(() => {
                    onLongPressMessage(msg, rect);
                  }, 600);
                  e.currentTarget.setAttribute('data-touch-timer', String(timer));
                }}
                onTouchEnd={(e) => {
                  const timerId = e.currentTarget.getAttribute('data-touch-timer');
                  if (timerId) clearTimeout(Number(timerId));
                }}
              >
                {/* Content Bubble rendering depending on type */}
                {msg.type === 'text' && (
                  <div 
                    className={`rounded-2xl px-3 py-2 text-xs shadow-sm break-words select-all transition active:scale-[0.98] ${
                      isMe 
                        ? 'bg-purple-100 text-purple-900 border border-purple-200 rounded-tr-none' 
                        : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                    }`}
                  >
                    {msg.content}
                  </div>
                )}

                {msg.type === 'sticker' && renderSticker()}

                {msg.type === 'gift' && renderGift(msg.giftTitle || '')}

                {msg.type === 'file' && msg.file && (
                  <div 
                    onClick={() => msg.file && msg.file.status === 'success' && onOpenPreview(msg.file)}
                    className="cursor-pointer active:scale-95 transition-transform"
                  >
                    <FileCard 
                      file={msg.file} 
                      onRetry={() => {
                        if (msg.file) {
                          handleSelectSimulatedFile({
                            name: msg.file.name.replace('_blocked', ''),
                            extension: msg.file.extension,
                            size: msg.file.size
                          });
                        }
                      }}
                    />
                  </div>
                )}

                {/* Subtitle / Read Status (Screenshot 2 "✓ Read" label in purple) */}
                {isMe && (
                  <p className="text-[9px] text-purple-600 font-semibold text-right mt-0.5 mr-1 animate-pulse">
                    {msg.isRead ? '✓ Read' : '✓ Sent'}
                  </p>
                )}
                
                {/* Visual Hint for Prototype Instruction */}
                <span className="opacity-0 group-hover:opacity-100 absolute -top-4 right-0 text-[8px] bg-gray-800 text-white px-1.5 py-0.5 rounded pointer-events-none transition">
                  💡 长按消息查看菜单
                </span>
              </div>
            </div>
          );
        })}
        <div ref={feedEndRef} />
      </div>

      {/* Message Input Area (High Fidelity Image 2 Layout) */}
      <div className="bg-white border-t border-gray-100 shrink-0">
        <div className="px-3 py-2 flex items-center gap-2">
          {/* If drawer is NOT open, show the plus toggle and image buttons */}
          {!isDrawerOpen && (
            <>
              <button 
                onClick={() => setIsDrawerOpen(true)}
                className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition shrink-0"
              >
                <Plus className="w-5 h-5" />
              </button>
              <button className="p-1 hover:bg-gray-100 rounded text-gray-400 shrink-0">
                <Image className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Text Input - when drawer is open, it matches full-width except for mic */}
          <div className="flex-1 bg-gray-100 rounded-full px-3.5 py-1.5 flex items-center min-w-0">
            <input
              type="text"
              placeholder="Type a message..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendText()}
              className="w-full text-xs text-gray-700 bg-transparent outline-none"
            />
            {!isDrawerOpen && (
              <Smile className="w-4 h-4 text-gray-400 cursor-pointer shrink-0 ml-1.5" />
            )}
          </div>

          {/* Right side controls */}
          {inputText.trim() ? (
            <button 
              onClick={handleSendText}
              className="p-1.5 rounded-full bg-purple-500 text-white hover:bg-purple-600 transition shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          ) : (
            <div className="flex items-center gap-2 text-gray-400 shrink-0">
              {isDrawerOpen ? (
                // Only show Mic on the right of input when drawer is open (Image 2)
                <Mic className="w-4 h-4 text-gray-700 cursor-pointer hover:text-gray-900" />
              ) : (
                <>
                  <Gift className="w-4 h-4 cursor-pointer hover:text-red-500" />
                  <Languages className="w-4 h-4 cursor-pointer hover:text-purple-600" />
                  <Mic className="w-4 h-4 cursor-pointer hover:text-gray-600" />
                </>
              )}
            </div>
          )}
        </div>

        {/* Expand Drawer (Screenshot 7 / Image 2 tab grid) */}
        {isDrawerOpen && (
          <div className="border-t border-gray-100 bg-white px-5 py-4 transition-all duration-300 animate-slide-up">
            
            {/* Row of 6 horizontal icons: [X] [Image] [Smile] [Gift] [Languages] [MessageSquare] */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4 px-1">
              {/* Purple/indigo circle close button (Image 2) */}
              <button 
                onClick={() => setIsDrawerOpen(false)}
                className="w-7 h-7 bg-indigo-600 hover:bg-indigo-700 active:scale-90 text-white rounded-full flex items-center justify-center transition-transform shadow-xs shrink-0"
              >
                <X className="w-4 h-4 stroke-[3]" />
              </button>

              <button className="text-gray-400 hover:text-gray-600 transition shrink-0">
                <Image className="w-5 h-5" />
              </button>

              <button className="text-gray-400 hover:text-gray-600 transition shrink-0">
                <Smile className="w-5 h-5" />
              </button>

              <button className="text-gray-400 hover:text-gray-600 transition shrink-0">
                <Gift className="w-5 h-5" />
              </button>

              <button className="text-gray-400 hover:text-gray-600 transition shrink-0">
                <Languages className="w-5 h-5" />
              </button>

              {/* Chat/Conversation bubble icon */}
              <button className="text-gray-400 hover:text-gray-600 transition shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </button>
            </div>

            {/* Grid of 10 feature items as shown in Image 2 */}
            <div className="grid grid-cols-4 gap-y-5 gap-x-3 text-center py-2">
              {/* 1. Voice Calls */}
              <div className="flex flex-col items-center cursor-pointer group">
                <div className="w-12 h-12 rounded-[16px] bg-indigo-50 hover:bg-indigo-100 flex items-center justify-center text-indigo-600 group-hover:scale-105 transition-transform shadow-xs">
                  <Phone className="w-5 h-5 stroke-[2.5]" />
                </div>
                <span className="text-[10px] text-gray-500 mt-1 font-bold">Voice Calls</span>
              </div>

              {/* 2. Favorites */}
              <div className="flex flex-col items-center cursor-pointer group">
                <div className="w-12 h-12 rounded-[16px] bg-blue-50 hover:bg-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-105 transition-transform shadow-xs">
                  <Bookmark className="w-5 h-5 fill-current text-blue-500" />
                </div>
                <span className="text-[10px] text-gray-500 mt-1 font-bold">Favorites</span>
              </div>

              {/* 3. Paid Practice */}
              <div className="flex flex-col items-center cursor-pointer group">
                <div className="w-12 h-12 rounded-[16px] bg-amber-50 hover:bg-amber-100 flex items-center justify-center text-amber-500 group-hover:scale-105 transition-transform shadow-xs">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                <span className="text-[10px] text-gray-500 mt-1 font-bold">Paid Practice</span>
              </div>

              {/* 4. Create Plan */}
              <div className="flex flex-col items-center cursor-pointer group">
                <div className="w-12 h-12 rounded-[16px] bg-cyan-50 hover:bg-cyan-100 flex items-center justify-center text-cyan-500 group-hover:scale-105 transition-transform shadow-xs">
                  <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                </div>
                <span className="text-[10px] text-gray-500 mt-1 font-bold">Create Plan</span>
              </div>

              {/* 5. Doodle */}
              <div className="flex flex-col items-center cursor-pointer group">
                <div className="w-12 h-12 rounded-[16px] bg-rose-50 hover:bg-rose-100 flex items-center justify-center text-rose-500 group-hover:scale-105 transition-transform shadow-xs">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </div>
                <span className="text-[10px] text-gray-500 mt-1 font-bold">Doodle</span>
              </div>

              {/* 6. Introduce */}
              <div className="flex flex-col items-center cursor-pointer group">
                <div className="w-12 h-12 rounded-[16px] bg-orange-50 hover:bg-orange-100 flex items-center justify-center text-orange-500 group-hover:scale-105 transition-transform shadow-xs">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a3 3 0 100-6 3 3 0 000 6zm5 6a3 3 0 11-6 0" />
                  </svg>
                </div>
                <span className="text-[10px] text-gray-500 mt-1 font-bold">Introduce</span>
              </div>

              {/* 7. Location */}
              <div className="flex flex-col items-center cursor-pointer group">
                <div className="w-12 h-12 rounded-[16px] bg-emerald-50 hover:bg-emerald-100 flex items-center justify-center text-emerald-500 group-hover:scale-105 transition-transform shadow-xs">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="text-[10px] text-gray-500 mt-1 font-bold">Location</span>
              </div>

              {/* 8. Teach */}
              <div className="flex flex-col items-center cursor-pointer group">
                <div className="w-12 h-12 rounded-[16px] bg-pink-50 hover:bg-pink-100 flex items-center justify-center text-pink-500 group-hover:scale-105 transition-transform shadow-xs relative">
                  <span className="font-black text-sm tracking-tighter text-pink-600">Aa</span>
                </div>
                <span className="text-[10px] text-gray-500 mt-1 font-bold">Teach</span>
              </div>

              {/* 9. Mini Games */}
              <div className="flex flex-col items-center cursor-pointer group">
                <div className="w-12 h-12 rounded-[16px] bg-yellow-50 hover:bg-yellow-100 flex items-center justify-center text-yellow-500 group-hover:scale-105 transition-transform shadow-xs">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                </div>
                <span className="text-[10px] text-gray-500 mt-1 font-bold">Mini Games</span>
              </div>

              {/* 10. 文件 (Beautiful generated 3D document file icon!) */}
              {adminConfig.ht_file_message_enable && (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center cursor-pointer group justify-center"
                  title="点击唤起系统的文件list (Select File)"
                >
                  <div className="w-12 h-12 rounded-[16px] bg-slate-50 hover:bg-slate-100 flex items-center justify-center group-hover:scale-105 active:scale-95 transition-transform shadow-xs overflow-hidden border border-gray-100">
                    <img 
                      src={fileIconImg} 
                      alt="文件" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <span className="text-[10px] text-gray-500 mt-1 font-bold">文件</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
