import React, { useState } from 'react';
import { Contact, FavoriteItem, NotepadNote, AdminConfig, Message, FileMessage } from '../types';
import { ChatList } from './ChatList';
import { ChatWindow } from './ChatWindow';
import { ContextMenu } from './ContextMenu';
import { FavoritesView } from './FavoritesView';
import { NotepadView } from './NotepadView';
import { FilePreview } from './FilePreview';
import { Laptop, Phone, ShieldCheck, RefreshCcw, Sliders, Share2, AlertTriangle, ToggleLeft, ToggleRight, Settings2, Info } from 'lucide-react';

interface MainFrameProps {
  contacts: Contact[];
  favorites: FavoriteItem[];
  notes: NotepadNote[];
  adminConfig: AdminConfig;
  onUpdateContacts: (c: Contact[]) => void;
  onUpdateFavorites: (f: FavoriteItem[]) => void;
  onUpdateNotes: (n: NotepadNote[]) => void;
  onUpdateAdminConfig: (cfg: AdminConfig) => void;
}

export const MainFrame: React.FC<MainFrameProps> = ({
  contacts,
  favorites,
  notes,
  adminConfig,
  onUpdateContacts,
  onUpdateFavorites,
  onUpdateNotes,
  onUpdateAdminConfig
}) => {
  // Navigation & view states
  const [currentScreen, setCurrentScreen] = useState<'chat_list' | 'chat_window' | 'favorites' | 'notepad' | 'preview'>('chat_list');
  const [selectedContactId, setSelectedContactId] = useState<string>('lila');
  
  // File preview helper
  const [previewFile, setPreviewFile] = useState<FileMessage | { name: string; extension: string; size: string } | null>(null);

  // Context Menu state (for long press)
  const [activeContextMenu, setActiveContextMenu] = useState<{
    message: Message;
    rect: DOMRect;
  } | null>(null);

  // External Share simulation overlay
  const [externalShareFile, setExternalShareFile] = useState<{
    name: string;
    extension: string;
    size: string;
  } | null>(null);

  // Interactive Toast
  const [toast, setToast] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const handleSendMessage = (msg: Message) => {
    const updated = contacts.map(c => {
      if (c.id === selectedContactId) {
        // If message already exists (it's an edit), update it
        const index = c.messages.findIndex(m => m.id === msg.id);
        let newMessages = [...c.messages];
        if (index > -1) {
          newMessages[index] = msg;
        } else {
          newMessages.push(msg);
        }
        return { ...c, messages: newMessages };
      }
      return c;
    });
    onUpdateContacts(updated);
  };

  const handleAddNotepadNote = (note: NotepadNote) => {
    onUpdateNotes([...notes, note]);
  };

  const handleFavoriteAction = (fileInfo: { name: string; extension: string; size: string }) => {
    // Add to favorites state
    const alreadyFav = favorites.some(fav => fav.title === fileInfo.name);
    if (alreadyFav) {
      triggerToast('⚠️ 文件已存在于收藏夹中');
      return;
    }

    const newFav: FavoriteItem = {
      id: `fav-${Date.now()}`,
      type: 'file',
      title: fileInfo.name,
      fileSize: fileInfo.size,
      fileExt: fileInfo.extension,
      sourceName: currentScreen === 'chat_window' ? 'lila' : '我',
      timestamp: new Date().toISOString()
    };

    onUpdateFavorites([...favorites, newFav]);
  };

  const handleShareToPartner = (fileInfo: { name: string; extension: string; size: string }) => {
    // Inject a simulated sent file message to lila
    const newMsg: Message = {
      id: `msg-shared-${Date.now()}`,
      sender: 'me',
      type: 'file',
      file: {
        name: fileInfo.name,
        extension: fileInfo.extension,
        size: fileInfo.size,
        status: 'success'
      },
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      isRead: true
    };

    const updated = contacts.map(c => {
      if (c.id === 'lila') {
        return { ...c, messages: [...c.messages, newMsg] };
      }
      return c;
    });
    onUpdateContacts(updated);
    triggerToast('已成功快捷转发给语伴: lila');
  };

  // Handle Context Menu (Screenshot 3 choices)
  const handleContextMenuAction = (actionId: string) => {
    if (!activeContextMenu) return;
    const msg = activeContextMenu.message;
    setActiveContextMenu(null);

    if (actionId === 'favorite') {
      if (msg.type === 'file' && msg.file) {
        handleFavoriteAction({
          name: msg.file.name,
          extension: msg.file.extension,
          size: msg.file.size
        });
        triggerToast('⭐️ 已保存到收藏');
      } else {
        // Text favorite
        const newFav: FavoriteItem = {
          id: `fav-${Date.now()}`,
          type: 'text',
          title: msg.content || '',
          sourceName: msg.sender === 'me' ? '我' : 'lila',
          timestamp: new Date().toISOString()
        };
        onUpdateFavorites([...favorites, newFav]);
        triggerToast('⭐️ 文字已保存到收藏');
      }
    } else if (actionId === 'copy') {
      navigator.clipboard?.writeText(msg.content || '');
      triggerToast('📋 已复制文本内容');
    } else if (actionId === 'recall') {
      const updated = contacts.map(c => {
        if (c.id === selectedContactId) {
          return { ...c, messages: c.messages.filter(m => m.id !== msg.id) };
        }
        return c;
      });
      onUpdateContacts(updated);
      triggerToast('↩️ 消息已撤回');
    } else {
      triggerToast(`💡 模拟执行操作: ${actionId}`);
    }
  };

  // Simulate sharing from system files/Safari directly to HelloTalk (Screenshot 8 / PRD "外部分享文件")
  const triggerExternalShareSimulation = (fileName: string, ext: string, size: string) => {
    setExternalShareFile({ name: fileName, extension: ext, size });
  };

  const handleSendSimulatedFileFromPanel = (fileName: string, ext: string, size: string) => {
    if (!adminConfig.ht_file_message_enable) {
      triggerToast('❌ 后台已关闭文件消息功能');
      return;
    }

    // Check size limit from admin policy
    const numericSize = parseFloat(size);
    if (numericSize > adminConfig.ht_file_upload_policy.maxSizeMB) {
      triggerToast(`⚠️ 文件超过 ${adminConfig.ht_file_upload_policy.maxSizeMB}MB 大小限制`);
      return;
    }

    // Check if zip extension is allowed
    const isZip = ['zip', 'rar', '7z'].includes(ext);
    if (isZip && !adminConfig.ht_file_upload_policy.allowedZipTypes.includes(ext)) {
      triggerToast(`⚠️ 不支持 .${ext} 压缩格式`);
      return;
    }

    // Setup initial uploading state
    const fileMsg: FileMessage = {
      name: fileName,
      extension: ext,
      size,
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

    handleSendMessage(newMsg);
    setCurrentScreen('chat_window');
    triggerToast('⏳ 正在聊天中上传模拟文件...');

    // Simulate upload progress
    let prog = 10;
    const interval = setInterval(() => {
      prog += 30;
      if (prog >= 100) {
        clearInterval(interval);
        
        // Finalize state
        let finalStatus: 'success' | 'failed' | 'risk_blocked' = 'success';
        if (fileName.includes('blocked')) {
          finalStatus = 'risk_blocked';
        }

        const updatedFile: FileMessage = {
          name: fileName,
          extension: ext,
          size,
          status: finalStatus,
          progress: 100
        };

        const updatedMsg: Message = {
          ...newMsg,
          file: updatedFile,
          isRead: finalStatus === 'success'
        };
        handleSendMessage(updatedMsg);
        triggerToast(finalStatus === 'risk_blocked' ? '🚫 风控检测：安全风险已拦截' : '✅ 模拟文件上传成功！');
      } else {
        const progressFile: FileMessage = {
          name: fileName,
          extension: ext,
          size,
          status: 'uploading',
          progress: prog
        };
        const progressMsg: Message = {
          ...newMsg,
          file: progressFile
        };
        handleSendMessage(progressMsg);
      }
    }, 400);
  };

  const handleCompleteExternalShare = (target: 'lila' | 'notepad' | 'favorites') => {
    if (!externalShareFile) return;

    if (target === 'lila') {
      const newMsg: Message = {
        id: `msg-ext-${Date.now()}`,
        sender: 'me',
        type: 'file',
        file: {
          name: externalShareFile.name,
          extension: externalShareFile.extension,
          size: externalShareFile.size,
          status: 'success'
        },
        timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
        isRead: true
      };
      
      const updated = contacts.map(c => {
        if (c.id === 'lila') {
          return { ...c, messages: [...c.messages, newMsg] };
        }
        return c;
      });
      onUpdateContacts(updated);
      setSelectedContactId('lila');
      setCurrentScreen('chat_window');
      triggerToast('✈️ 外部分享成功：已发给 lila');
    } else if (target === 'notepad') {
      const newNote: NotepadNote = {
        id: `np-ext-${Date.now()}`,
        sender: 'me',
        type: 'file',
        file: {
          name: externalShareFile.name,
          extension: externalShareFile.extension,
          size: externalShareFile.size,
          status: 'success'
        },
        timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
      };
      onUpdateNotes([...notes, newNote]);
      setCurrentScreen('notepad');
      triggerToast('📓 外部分享成功：已存入记事本');
    } else {
      handleFavoriteAction(externalShareFile);
      setCurrentScreen('favorites');
    }

    setExternalShareFile(null);
  };

  // Find selected contact object
  const activeContact = contacts.find(c => c.id === selectedContactId) || contacts[0];

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 max-w-7xl mx-auto items-stretch justify-center h-[92vh]">
      
      {/* 1. LEFT PANEL: HIGH FIDELITY SIMULATED DEVICE (PHONE FRAME) */}
      <div className="flex-1 max-w-[400px] w-full flex flex-col items-center justify-center relative shrink-0">
        
        {/* Real Phone Container Frame */}
        <div className="w-[375px] h-[760px] bg-slate-950 rounded-[50px] p-3.5 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] border-4 border-slate-800 flex flex-col overflow-hidden relative">
          
          {/* Phone Speaker Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-5.5 bg-slate-950 rounded-b-2xl z-50 flex items-center justify-center gap-1.5">
            <div className="w-12 h-1 bg-slate-800 rounded-full"></div>
            <div className="w-2 h-2 bg-slate-900 rounded-full"></div>
          </div>

          {/* Interactive Screen Container */}
          <div className="w-full h-full bg-white rounded-[38px] overflow-hidden flex flex-col relative pt-4 select-none">
            
            {/* Screen Toast Alert overlay */}
            {toast && (
              <div className="absolute top-14 left-1/2 -translate-x-1/2 bg-gray-900/95 text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow-lg z-50 animate-bounce text-center max-w-[80%] whitespace-nowrap overflow-hidden text-ellipsis">
                {toast}
              </div>
            )}

            {/* Simulated Status Bar */}
            <div className="bg-white px-5 pt-1.5 pb-1 flex justify-between items-center text-[10px] text-gray-700 font-bold font-sans shrink-0">
              <span>18:33</span>
              <div className="flex items-center gap-1.5">
                <span>5G</span>
                <div className="w-5 h-2.5 border border-gray-700 rounded-sm p-0.5 flex items-center">
                  <div className="h-full w-4 bg-gray-700 rounded-2xs"></div>
                </div>
              </div>
            </div>

            {/* SCREEN ROUTING */}
            <div className="flex-1 overflow-hidden relative">
              {currentScreen === 'chat_list' && (
                <ChatList 
                  contacts={contacts} 
                  onSelectContact={(id) => {
                    setSelectedContactId(id);
                    setCurrentScreen('chat_window');
                  }}
                  onOpenNotepad={() => setCurrentScreen('notepad')}
                  onOpenFavorites={() => setCurrentScreen('favorites')}
                  activeTab="All"
                  notes={notes}
                />
              )}

              {currentScreen === 'chat_window' && (
                <ChatWindow 
                  contact={activeContact}
                  onBack={() => setCurrentScreen('chat_list')}
                  onSendMessage={handleSendMessage}
                  onOpenPreview={(file) => {
                    setPreviewFile(file);
                    setCurrentScreen('preview');
                  }}
                  onLongPressMessage={(msg, rect) => {
                    setActiveContextMenu({ message: msg, rect });
                  }}
                  adminConfig={adminConfig}
                />
              )}

              {currentScreen === 'favorites' && (
                <FavoritesView 
                  favorites={favorites}
                  onBack={() => setCurrentScreen('chat_list')}
                  onOpenPreview={(fileInfo) => {
                    setPreviewFile(fileInfo);
                    setCurrentScreen('preview');
                  }}
                  onRemoveFavorite={(id) => {
                    onUpdateFavorites(favorites.filter(f => f.id !== id));
                    triggerToast('已取消收藏');
                  }}
                  adminConfig={adminConfig}
                />
              )}

              {currentScreen === 'notepad' && (
                <NotepadView 
                  notes={notes}
                  onBack={() => setCurrentScreen('chat_list')}
                  onAddNote={handleAddNotepadNote}
                  onOpenPreview={(file) => {
                    setPreviewFile(file);
                    setCurrentScreen('preview');
                  }}
                  adminConfig={adminConfig}
                />
              )}

              {currentScreen === 'preview' && previewFile && (
                <FilePreview 
                  file={previewFile}
                  onBack={() => {
                    setPreviewFile(null);
                    // Return to previous screen
                    setCurrentScreen(currentScreen === 'preview' ? 'chat_window' : currentScreen);
                  }}
                  onFavorite={handleFavoriteAction}
                  onShareToPartner={handleShareToPartner}
                  adminConfig={adminConfig}
                />
              )}

              {/* Context Long Press Menu Overlay (Screenshot 3) */}
              {activeContextMenu && (
                <ContextMenu 
                  message={activeContextMenu.message}
                  rect={activeContextMenu.rect}
                  onClose={() => setActiveContextMenu(null)}
                  onAction={handleContextMenuAction}
                />
              )}

              {/* Simulated OS Share Sheet Overlay (PRD "外部分享文件到 HelloTalk") */}
              {externalShareFile && (
                <div className="absolute inset-0 bg-black/60 z-50 flex flex-col justify-end p-4 animate-fade-in font-sans">
                  <div className="bg-white rounded-3xl p-5 space-y-4 max-w-sm mx-auto w-full animate-slide-up">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-2">
                        <Share2 className="w-5 h-5 text-blue-500 animate-pulse" />
                        <div>
                          <h4 className="text-xs font-extrabold text-gray-800 uppercase tracking-wide">系统分享：文件至 HelloTalk</h4>
                          <p className="text-[10px] text-gray-500 mt-0.5">{externalShareFile.name} ({externalShareFile.size})</p>
                        </div>
                      </div>
                      <button onClick={() => setExternalShareFile(null)} className="text-gray-400 text-xs font-bold hover:text-gray-600">关闭</button>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-3 border border-gray-100">
                      <p className="text-[10px] text-gray-400 font-bold uppercase mb-2">选择保存/发送目的地:</p>
                      <div className="space-y-2">
                        {adminConfig.ht_external_share_targets.chat && (
                          <button 
                            onClick={() => handleCompleteExternalShare('lila')}
                            className="w-full flex items-center justify-between p-2.5 bg-white hover:bg-purple-50 rounded-xl border border-gray-100 hover:border-purple-300 transition text-left text-xs font-bold text-gray-700"
                          >
                            <span>💬 单聊/群聊 (发送给 lila)</span>
                            <span className="text-[8px] bg-purple-100 text-purple-600 px-1 rounded uppercase font-semibold">Active</span>
                          </button>
                        )}
                        {adminConfig.ht_external_share_targets.notepad && (
                          <button 
                            onClick={() => handleCompleteExternalShare('notepad')}
                            className="w-full flex items-center justify-between p-2.5 bg-white hover:bg-purple-50 rounded-xl border border-gray-100 hover:border-purple-300 transition text-left text-xs font-bold text-gray-700"
                          >
                            <span>📓 个人记事本 (Notepad)</span>
                            <span className="text-[8px] bg-purple-100 text-purple-600 px-1 rounded uppercase font-semibold">Active</span>
                          </button>
                        )}
                        {adminConfig.ht_external_share_targets.favorites && (
                          <button 
                            onClick={() => handleCompleteExternalShare('favorites')}
                            className="w-full flex items-center justify-between p-2.5 bg-white hover:bg-purple-50 rounded-xl border border-gray-100 hover:border-purple-300 transition text-left text-xs font-bold text-gray-700"
                          >
                            <span>⭐️ 集中收藏夹 (Favorites)</span>
                            <span className="text-[8px] bg-purple-100 text-purple-600 px-1 rounded uppercase font-semibold">Active</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. RIGHT PANEL: INTERACTIVE CONFIGURATION & SIMULATION CONTROLS */}
      <div className="flex-1 bg-white rounded-3xl border border-gray-200/80 p-5 shadow-sm overflow-y-auto flex flex-col gap-5">
        
        {/* Title area */}
        <div>
          <div className="flex items-center gap-2 text-purple-600 font-bold text-sm uppercase tracking-wider">
            <Sliders className="w-4 h-4" />
            <span>HelloTalk 核心交互与模拟测试后台</span>
          </div>
          <h1 className="text-xl font-extrabold text-gray-900 mt-1 leading-tight">
            留存-聊天场景支持文件上传/收藏功能
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            本高保真 Demo 完全支持聊天、记事本、收藏三大场景在各种风控配置、多语言、外部分享等业务场景下的高精度渲染，助您快速交付体验。
          </p>
        </div>

        {/* Quick View Switches */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-gray-100">
          <h3 className="text-xs font-extrabold text-gray-700 uppercase mb-3 flex items-center gap-1.5">
            <Settings2 className="w-3.5 h-3.5 text-blue-500" />
            <span>快速切换手机画面 (模拟页面)</span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { id: 'chat_list', label: '图1: HT 聊天主页' },
              { id: 'chat_window', label: '图2 & 7: 单聊/文件发送页' },
              { id: 'favorites', label: '图4: 收藏列表 (新增文件)' },
              { id: 'notepad', label: '图5: 记事本' },
              { id: 'preview_doc', label: '图6: 文档详情预览' }
            ].map((scr) => (
              <button
                key={scr.id}
                onClick={() => {
                  if (scr.id === 'preview_doc') {
                    setPreviewFile({ name: '文档.docx', extension: 'docx', size: '24.5 KB', status: 'success' });
                    setCurrentScreen('preview');
                  } else {
                    setCurrentScreen(scr.id as any);
                  }
                }}
                className={`py-2 px-2.5 text-[11px] font-bold rounded-xl transition text-center shadow-sm ${
                  (currentScreen === scr.id || (scr.id === 'preview_doc' && currentScreen === 'preview'))
                    ? 'bg-purple-600 text-white'
                    : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-100'
                }`}
              >
                {scr.label}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Simulated Events */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-gray-100">
          <h3 className="text-xs font-extrabold text-gray-700 uppercase mb-2.5 flex items-center gap-1.5">
            <Share2 className="w-3.5 h-3.5 text-purple-500" />
            <span>外部分享与极限场景模拟 (Simulator Actions)</span>
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase mb-1.5">1. 从其他应用分享文件到 HelloTalk (External Share):</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => triggerExternalShareSimulation('雅思考试精选要点.pdf', 'pdf', '4.2 MB')}
                  className="bg-white hover:bg-purple-50 hover:border-purple-200 border border-gray-200 px-3 py-1.5 rounded-xl text-[10px] font-bold text-gray-700 flex items-center gap-1.5 shadow-xs transition"
                >
                  📁 分享：PDF 试卷
                </button>
                <button
                  onClick={() => triggerExternalShareSimulation('美式发音训练.mp3', 'mp3', '8.5 MB')}
                  className="bg-white hover:bg-purple-50 hover:border-purple-200 border border-gray-200 px-3 py-1.5 rounded-xl text-[10px] font-bold text-gray-700 flex items-center gap-1.5 shadow-xs transition"
                >
                  🎵 分享：语音包
                </button>
                <button
                  onClick={() => triggerExternalShareSimulation('HT_Setup.rar', 'rar', '35 MB')}
                  className="bg-white hover:bg-purple-50 hover:border-purple-200 border border-gray-200 px-3 py-1.5 rounded-xl text-[10px] font-bold text-gray-700 flex items-center gap-1.5 shadow-xs transition"
                >
                  📦 分享：压缩包
                </button>
              </div>
            </div>

            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase mb-1.5">2. 极限状态模拟 (风控拦截与上传失败):</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleSendSimulatedFileFromPanel('恶意风险脚本.exe_blocked', 'exe', '320 KB')}
                  className="bg-red-50 hover:bg-red-100 border border-red-100 px-3 py-1.5 rounded-xl text-[10px] font-bold text-red-700 flex items-center gap-1.5 transition"
                >
                  ⚠️ 模拟上传：风控风险包
                </button>
                <button
                  onClick={() => {
                    // Send a failed message directly
                    const failedMsg: Message = {
                      id: `msg-fail-${Date.now()}`,
                      sender: 'me',
                      type: 'file',
                      file: {
                        name: '雅思高分写作技巧.pdf',
                        extension: 'pdf',
                        size: '4.8 MB',
                        status: 'failed'
                      },
                      timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
                    };
                    const updated = contacts.map(c => {
                      if (c.id === 'lila') {
                        return { ...c, messages: [...c.messages, failedMsg] };
                      }
                      return c;
                    });
                    onUpdateContacts(updated);
                    setCurrentScreen('chat_window');
                    triggerToast('已在与 lila 的聊天中生成上传失败消息');
                  }}
                  className="bg-amber-50 hover:bg-amber-100 border border-amber-100 px-3 py-1.5 rounded-xl text-[10px] font-bold text-amber-700 flex items-center gap-1.5 transition"
                >
                  ⚡️ 模拟：网络超时发送失败
                </button>
              </div>
            </div>

            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase mb-1.5">3. 快捷模拟聊天内发送文件 (Mock Client Send File):</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleSendSimulatedFileFromPanel('文档.docx', 'docx', '24.5 KB')}
                  className="bg-white hover:bg-purple-50 border border-gray-200 hover:border-purple-200 p-2 rounded-xl text-left flex items-center gap-2 transition"
                >
                  <span className="text-blue-500 font-bold text-xs">DOCX</span>
                  <div>
                    <p className="text-[9px] font-black text-gray-800">文档.docx</p>
                    <p className="text-[8px] text-gray-400">24.5 KB</p>
                  </div>
                </button>
                <button
                  onClick={() => handleSendSimulatedFileFromPanel('学习计划表_2026.xlsx', 'xlsx', '1.2 MB')}
                  className="bg-white hover:bg-purple-50 border border-gray-200 hover:border-purple-200 p-2 rounded-xl text-left flex items-center gap-2 transition"
                >
                  <span className="text-emerald-500 font-bold text-xs">XLSX</span>
                  <div>
                    <p className="text-[9px] font-black text-gray-800">学习计划表_2026.xlsx</p>
                    <p className="text-[8px] text-gray-400">1.2 MB</p>
                  </div>
                </button>
                <button
                  onClick={() => handleSendSimulatedFileFromPanel('HelloTalk_Guide.pdf', 'pdf', '5.6 MB')}
                  className="bg-white hover:bg-purple-50 border border-gray-200 hover:border-purple-200 p-2 rounded-xl text-left flex items-center gap-2 transition"
                >
                  <span className="text-red-500 font-bold text-xs">PDF</span>
                  <div>
                    <p className="text-[9px] font-black text-gray-800">HelloTalk_Guide.pdf</p>
                    <p className="text-[8px] text-gray-400">5.6 MB</p>
                  </div>
                </button>
                <button
                  onClick={() => handleSendSimulatedFileFromPanel('Audio_Lesson_01.mp3', 'mp3', '12.8 MB')}
                  className="bg-white hover:bg-purple-50 border border-gray-200 hover:border-purple-200 p-2 rounded-xl text-left flex items-center gap-2 transition"
                >
                  <span className="text-purple-500 font-bold text-xs">MP3</span>
                  <div>
                    <p className="text-[9px] font-black text-gray-800">Audio_Lesson_01.mp3</p>
                    <p className="text-[8px] text-gray-400">12.8 MB</p>
                  </div>
                </button>
                <button
                  onClick={() => handleSendSimulatedFileFromPanel('资料备份.zip', 'zip', '45.2 MB')}
                  className="bg-white hover:bg-purple-50 border border-gray-200 hover:border-purple-200 p-2 rounded-xl text-left flex items-center gap-2 transition col-span-2"
                >
                  <span className="text-amber-500 font-bold text-xs">ZIP</span>
                  <div>
                    <p className="text-[9px] font-black text-gray-800">资料备份.zip (不支持站内解压)</p>
                    <p className="text-[8px] text-gray-400">45.2 MB</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Administration Configurations (PRD values) */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-gray-100">
          <h3 className="text-xs font-extrabold text-gray-700 uppercase mb-3 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-emerald-500" />
            <span>PRD 后台开关控制柜 (Admin Configs)</span>
          </h3>
          <div className="space-y-3 text-xs font-semibold text-gray-700">
            
            {/* ht_file_message_enable */}
            <div className="flex items-center justify-between py-1 border-b border-gray-100">
              <div>
                <p className="text-[11px] font-bold text-gray-800">1. ht_file_message_enable</p>
                <p className="text-[9px] text-gray-400 font-normal">开启/关闭站内聊天、记事本等所有文件消息发送</p>
              </div>
              <button 
                onClick={() => onUpdateAdminConfig({ ...adminConfig, ht_file_message_enable: !adminConfig.ht_file_message_enable })}
                className="text-gray-500 hover:text-purple-600 transition"
              >
                {adminConfig.ht_file_message_enable ? (
                  <ToggleRight className="w-8 h-8 text-purple-600" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-gray-300" />
                )}
              </button>
            </div>

            {/* ht_collection_file_entry_enable */}
            <div className="flex items-center justify-between py-1 border-b border-gray-100">
              <div>
                <p className="text-[11px] font-bold text-gray-800">2. ht_collection_file_entry_enable</p>
                <p className="text-[9px] text-gray-400 font-normal">收藏模块是否展示多语言“文件”子Tab入口</p>
              </div>
              <button 
                onClick={() => onUpdateAdminConfig({ ...adminConfig, ht_collection_file_entry_enable: !adminConfig.ht_collection_file_entry_enable })}
                className="text-gray-500 hover:text-purple-600 transition"
              >
                {adminConfig.ht_collection_file_entry_enable ? (
                  <ToggleRight className="w-8 h-8 text-purple-600" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-gray-300" />
                )}
              </button>
            </div>

            {/* downloadEnabled */}
            <div className="flex items-center justify-between py-1">
              <div>
                <p className="text-[11px] font-bold text-gray-800">3. ht_file_preview_policy.downloadEnabled</p>
                <p className="text-[9px] text-gray-400 font-normal">文件详情预览页右上角是否支持下载并存储</p>
              </div>
              <button 
                onClick={() => onUpdateAdminConfig({ 
                  ...adminConfig, 
                  ht_file_preview_policy: {
                    ...adminConfig.ht_file_preview_policy,
                    downloadEnabled: !adminConfig.ht_file_preview_policy.downloadEnabled
                  }
                })}
                className="text-gray-500 hover:text-purple-600 transition"
              >
                {adminConfig.ht_file_preview_policy.downloadEnabled ? (
                  <ToggleRight className="w-8 h-8 text-purple-600" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-gray-300" />
                )}
              </button>
            </div>

          </div>
        </div>

        {/* Explanatory Info Card */}
        <div className="bg-purple-50 rounded-2xl p-4 border border-purple-100 flex gap-3 text-xs text-purple-700 shrink-0">
          <Info className="w-5 h-5 shrink-0 mt-0.5 text-purple-500" />
          <div className="space-y-1">
            <p className="font-extrabold text-purple-900">💡 演示技巧说明：</p>
            <ul className="list-disc pl-4 space-y-1 text-purple-800 font-medium">
              <li>点击<b>单聊/文件发送页</b>，然后点击输入框左侧的 <b>“+”</b> 号，可以查看新增的<b>【文件】</b>图标或在快速列表中添加文件卡片。</li>
              <li>在单聊或记事本中<b>长按任何气泡或文件卡片</b>，可唤起<b>高保真长按选项单</b>（Reply, Favorite等）。</li>
              <li>点击单聊中成功发送的文件，将进入<b>高保真文档预览页</b>，包含下载、分享、收藏等下拉指令。</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
};
