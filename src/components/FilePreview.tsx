import React, { useState } from 'react';
import { X, MoreHorizontal, Download, Share2, Bookmark, FolderHeart, AlertCircle, Play, Pause, RefreshCcw, CheckCircle } from 'lucide-react';
import { FileMessage, AdminConfig } from '../types';
import { getFileIcon } from './FileCard';

interface FilePreviewProps {
  file: FileMessage | { name: string; extension: string; size: string };
  onBack: () => void;
  onFavorite?: (file: { name: string; extension: string; size: string }) => void;
  onShareToPartner?: (file: { name: string; extension: string; size: string }) => void;
  adminConfig: AdminConfig;
}

export const FilePreview: React.FC<FilePreviewProps> = ({
  file,
  onBack,
  onFavorite,
  onShareToPartner,
  adminConfig
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(30);
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const ext = file.extension.toLowerCase();
  const isAudio = ['mp3', 'm4a', 'wav', 'aac'].includes(ext);
  const isZip = ['zip', 'rar', '7z'].includes(ext);
  const isDoc = ['doc', 'docx', 'pdf', 'xls', 'xlsx', 'ppt', 'pptx'].includes(ext);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const handleDownload = () => {
    setIsMenuOpen(false);
    if (!adminConfig.ht_file_preview_policy.downloadEnabled) {
      showToast('后台已关闭下载功能');
      return;
    }

    setDownloadProgress(0);
    let prog = 0;
    const interval = setInterval(() => {
      prog += 20;
      setDownloadProgress(prog);
      if (prog >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setDownloadProgress(null);
          showToast('已下载到本地');
        }, 300);
      }
    }, 200);
  };

  const handleShare = () => {
    setIsMenuOpen(false);
    if (onShareToPartner) {
      onShareToPartner({ name: file.name, extension: file.extension, size: file.size });
      showToast('分享成功！');
    }
  };

  const handleCollect = () => {
    setIsMenuOpen(false);
    if (onFavorite) {
      onFavorite({ name: file.name, extension: file.extension, size: file.size });
      showToast('已成功收藏文件');
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white font-sans relative">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-gray-800 border border-gray-700 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-xl flex items-center gap-1.5 z-50 animate-fade-in">
          <CheckCircle className="w-4 h-4 text-green-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Download Progress Banner */}
      {downloadProgress !== null && (
        <div className="absolute top-16 left-4 right-4 bg-gray-800/95 border border-purple-500/30 text-white p-3.5 rounded-xl shadow-xl z-50 flex flex-col gap-2 animate-slide-up">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5 text-purple-400 animate-bounce" />
              正在下载文件...
            </span>
            <span className="font-mono text-purple-400">{downloadProgress}%</span>
          </div>
          <div className="w-full bg-gray-700 h-1 rounded-full overflow-hidden">
            <div className="bg-purple-500 h-full transition-all duration-200" style={{ width: `${downloadProgress}%` }} />
          </div>
        </div>
      )}

      {/* Header (Screenshot 6 style) */}
      <div className="flex items-center justify-between px-3 py-2.5 bg-slate-900 border-b border-gray-800 shrink-0 z-10">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="p-1 hover:bg-gray-800 rounded-full transition text-gray-300">
            <X className="w-5 h-5" />
          </button>
          <span className="font-bold text-gray-200 text-sm max-w-[200px] truncate">{file.name}</span>
        </div>
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)} 
          className="p-1 hover:bg-gray-800 rounded-full text-gray-300 transition"
        >
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Main Preview Content */}
      <div className="flex-1 bg-slate-950 flex flex-col items-center justify-center p-6 overflow-y-auto relative">
        
        {/* Render Word / Doc View (Screenshot 6 with realistic essay template) */}
        {ext.includes('doc') && (
          <div className="w-full max-w-sm bg-white rounded-xl shadow-2xl p-6 text-gray-800 min-h-[360px] flex flex-col animate-scale-up border border-gray-100 relative">
            <div className="absolute top-3 right-3 text-[9px] font-bold text-blue-500 border border-blue-200 bg-blue-50 px-1.5 py-0.5 rounded uppercase">
              Word Document
            </div>
            <h1 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3 mt-2">
              HelloTalk 留存功能：聊天场景文件支持.docx
            </h1>
            <div className="text-[10px] text-gray-600 mt-4 leading-relaxed space-y-3.5 flex-1 overflow-y-auto scrollbar-thin">
              <p className="font-semibold text-gray-800">
                学好外语的核心秘诀是什么？ (The Secret to Language Mastery)
              </p>
              <p>
                学术大家普遍认为，社会文化精英的摇篮。每伴于两校校园，每个人都能感受到它们别具一格的人文魅力和精神内涵。
              </p>
              <p>
                这两所学校从来不缺名家，更不乏成功人士，正是以这些人作为代表的一代代清华人、北大人，将两校精神薪火相传，并不断为其注入新的生机与活力，使其精神更加丰富和隽永。
              </p>
              <p>
                细品清华、北大的精神，我们不难发现，它其实就是一系列经典而深刻的人生哲学。是价值观和人生观的集中体现。在这些人生哲学中，包含着事业成功的方向、为人处世的原则、对人生意义的感悟——可以说，人生哲学几乎涵盖了我们生活的各个方面。这些闪着...
              </p>
            </div>
            <div className="text-center text-[9px] text-gray-400 border-t border-gray-100 pt-2.5 mt-2 shrink-0">
              Page 1 of 3 • {file.size}
            </div>
          </div>
        )}

        {/* Render Excel Sheet View */}
        {ext.includes('xls') && (
          <div className="w-full max-w-sm bg-white rounded-xl shadow-2xl p-5 text-gray-800 animate-scale-up border border-gray-100">
            <div className="flex justify-between items-center border-b border-gray-100 pb-2 mb-3">
              <span className="text-xs font-bold text-gray-900 flex items-center gap-1">
                <span className="w-2.5 h-2.5 bg-green-500 rounded-full"></span>
                英语核心词汇精选.xlsx
              </span>
              <span className="text-[8px] bg-green-100 text-green-700 font-extrabold px-1 rounded uppercase">Excel</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-[9px] text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-gray-600 font-bold border-b border-gray-200">
                    <th className="p-1.5">No.</th>
                    <th className="p-1.5">Word</th>
                    <th className="p-1.5">Meaning</th>
                    <th className="p-1.5">Example</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700 font-medium">
                  <tr>
                    <td className="p-1.5 text-gray-400">1</td>
                    <td className="p-1.5 font-bold text-purple-600">Cognizant</td>
                    <td className="p-1.5">有认识的/晓得的</td>
                    <td className="p-1.5 text-gray-500">He is cognizant of risks</td>
                  </tr>
                  <tr>
                    <td className="p-1.5 text-gray-400">2</td>
                    <td className="p-1.5 font-bold text-purple-600">Ameliorate</td>
                    <td className="p-1.5">改善/提高</td>
                    <td className="p-1.5 text-gray-500">Steps to ameliorate...</td>
                  </tr>
                  <tr>
                    <td className="p-1.5 text-gray-400">3</td>
                    <td className="p-1.5 font-bold text-purple-600">Acumen</td>
                    <td className="p-1.5">敏锐/聪明</td>
                    <td className="p-1.5 text-gray-500">Exceptional business...</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-[8px] text-gray-400 text-center mt-4">Row 1-150 out of 250 rows rendered</p>
          </div>
        )}

        {/* Render PDF View */}
        {ext === 'pdf' && (
          <div className="w-full max-w-sm bg-gray-100 rounded-xl shadow-2xl p-4 text-gray-800 min-h-[350px] flex flex-col items-center justify-between animate-scale-up relative">
            <div className="absolute top-2.5 right-2.5 text-[8px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-extrabold uppercase tracking-wide">
              PDF Preview
            </div>
            <div className="w-full bg-white flex-1 rounded-lg border border-gray-200 p-4 shadow-inner flex flex-col">
              <div className="flex items-center gap-2 border-b pb-2 mb-3">
                <div className="w-6 h-6 rounded bg-red-100 text-red-500 flex items-center justify-center font-bold text-[8px]">PDF</div>
                <span className="text-[10px] font-bold text-gray-800">HelloTalk_Guide.pdf</span>
              </div>
              <div className="flex-1 space-y-2 text-[9px] text-gray-500">
                <div className="h-3.5 bg-gray-200 rounded w-1/3"></div>
                <div className="h-2.5 bg-gray-100 rounded w-full"></div>
                <div className="h-2.5 bg-gray-100 rounded w-full"></div>
                <div className="h-2.5 bg-gray-100 rounded w-4/5"></div>
                <div className="h-10 bg-gray-100 rounded-lg w-full flex items-center justify-center text-[8px] font-semibold text-gray-400">
                  📷 [Embedded Guide Infographics Image]
                </div>
                <div className="h-2.5 bg-gray-100 rounded w-full"></div>
              </div>
            </div>
            <p className="text-[9px] text-gray-400 mt-2">Preview Powered by LanguageClass Reader</p>
          </div>
        )}

        {/* Render Audio Playback Waveform View (Highly Interactive!) */}
        {isAudio && (
          <div className="w-full max-w-xs bg-slate-900 border border-slate-800 rounded-3xl p-5 flex flex-col items-center gap-4 animate-scale-up">
            <div className="w-14 h-14 rounded-full bg-purple-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-purple-500/20">
              <FolderHeart className="w-7 h-7" />
            </div>
            <div className="text-center">
              <p className="text-xs font-bold text-gray-100">{file.name}</p>
              <p className="text-[10px] text-purple-400 mt-1">语音播放器 ({file.size})</p>
            </div>

            {/* Waveform Visualization */}
            <div className="w-full flex items-end gap-1.5 h-14 px-3">
              {[20, 40, 30, 60, 80, 50, 70, 45, 90, 65, 30, 55, 80, 40, 25, 45, 75, 60, 30, 20].map((barHeight, idx) => {
                const isActive = idx < audioProgress / 5;
                return (
                  <div 
                    key={idx}
                    className={`flex-1 rounded-full transition-all duration-300 ${isActive ? 'bg-purple-500 h-full' : 'bg-slate-700 h-[25%]'}`}
                    style={{ height: isActive ? `${barHeight}%` : undefined }}
                  />
                );
              })}
            </div>

            {/* Play Slider Controls */}
            <div className="w-full flex items-center justify-between text-[9px] text-gray-400 px-1 shrink-0">
              <span>0:14</span>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={audioProgress}
                onChange={(e) => setAudioProgress(Number(e.target.value))}
                className="w-3/5 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
              <span>0:45</span>
            </div>

            {/* Control buttons */}
            <div className="flex items-center justify-center gap-5">
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-3.5 rounded-full bg-purple-500 hover:bg-purple-600 text-white shrink-0 shadow-lg shadow-purple-500/15 transition active:scale-95"
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
              </button>
            </div>
          </div>
        )}

        {/* Render ZIP File Warnings (Screenshot 3 instructions: 不在HT内解压) */}
        {isZip && (
          <div className="w-full max-w-xs bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col items-center text-center gap-4 animate-scale-up">
            <div className="w-14 h-14 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-500 shrink-0">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-100">{file.name}</p>
              <p className="text-[10px] text-gray-400 mt-1">压缩文件 • {file.size}</p>
            </div>

            <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800">
              <p className="text-xs text-gray-300 leading-relaxed font-semibold">
                🔒 HelloTalk 内不直接提供压缩包解压或预览内部内容。
              </p>
              <p className="text-[10px] text-gray-500 mt-2 leading-relaxed">
                为保证数据安全与风控合规，文件已走服务端扫描。请点击下方按钮调用系统或其他应用程序打开和提取。
              </p>
            </div>

            <button 
              onClick={() => showToast('已调起外部应用...')}
              className="w-full py-2.5 bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:from-purple-600 hover:to-indigo-700 font-bold text-xs rounded-xl transition shadow-lg active:scale-98"
            >
              使用其他应用打开此文件
            </button>
          </div>
        )}

        {/* Render Unsupported / Placeholder fallback */}
        {!isAudio && !isZip && !isDoc && (
          <div className="text-center py-10">
            <div className="w-14 h-14 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-7 h-7 text-gray-400" />
            </div>
            <p className="text-sm font-bold">暂不支持预览此文件</p>
            <p className="text-xs text-gray-500 mt-1">{file.name}</p>
          </div>
        )}
      </div>

      {/* "Forward to" Slide-Up Bottom Menu (Screenshot 2 / Image 2) */}
      {isMenuOpen && (
        <div 
          className="absolute inset-0 bg-black/55 z-40 flex items-end justify-center font-sans animate-fade-in"
          onClick={() => setIsMenuOpen(false)}
        >
          <div 
            className="w-full max-w-sm bg-white rounded-t-[32px] overflow-hidden p-5 shadow-2xl animate-slide-up text-left border-t border-gray-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header row */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-full text-gray-500 transition"
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>
              <h3 className="text-sm font-black text-gray-950">Forward to</h3>
              <div className="w-8"></div> {/* Spacer for symmetry */}
            </div>

            {/* Horizontal Contacts Picker */}
            <div className="flex gap-4 overflow-x-auto pb-5 pt-1 px-1 scrollbar-none snap-x">
              {/* 1. Notepad */}
              <div 
                onClick={() => {
                  setIsMenuOpen(false);
                  showToast('📁 已存入 记事本');
                }}
                className="flex flex-col items-center gap-1.5 cursor-pointer shrink-0 snap-start"
              >
                <div className="w-12 h-12 bg-[#ff0a54] rounded-[16px] flex items-center justify-center shadow-sm hover:scale-105 active:scale-95 transition-transform">
                  <div className="w-[20px] h-[24px] bg-white rounded-[5px] flex flex-col justify-center items-center gap-0.5 p-0.5">
                    <div className="w-3 h-0.5 bg-[#ff0a54] rounded-full"></div>
                    <div className="w-3 h-0.5 bg-[#ff0a54] rounded-full"></div>
                    <div className="w-3 h-0.5 bg-[#ff0a54] rounded-full"></div>
                  </div>
                </div>
                <span className="text-[10px] text-gray-700 font-bold tracking-tight">Notepad</span>
              </div>

              {/* 2. Live & Voiceroom */}
              <div 
                onClick={() => {
                  setIsMenuOpen(false);
                  showToast('🎤 已分享至 Live & Voiceroom');
                }}
                className="flex flex-col items-center gap-1.5 cursor-pointer shrink-0 snap-start"
              >
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center relative shadow-sm hover:scale-105 active:scale-95 transition-transform">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                  {/* Green badge check */}
                  <div className="absolute -bottom-0.5 -right-0.5 w-4.5 h-4.5 bg-[#2ec4b6] border-2 border-white rounded-full flex items-center justify-center text-white">
                    <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <span className="text-[10px] text-gray-700 font-bold tracking-tight">Live & Voic...</span>
              </div>

              {/* 3. HelloTalk团队 */}
              <div 
                onClick={() => {
                  setIsMenuOpen(false);
                  showToast('👥 已分享给 HelloTalk 团队');
                }}
                className="flex flex-col items-center gap-1.5 cursor-pointer shrink-0 snap-start"
              >
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center shadow-sm relative overflow-hidden hover:scale-105 active:scale-95 transition-transform border border-gray-100">
                  <img 
                    src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=80&h=80&q=80" 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-purple-500/10"></div>
                </div>
                <span className="text-[10px] text-gray-700 font-bold tracking-tight">HelloTalk团队</span>
              </div>

              {/* 4. Martin lewis */}
              <div 
                onClick={() => {
                  setIsMenuOpen(false);
                  showToast('✈️ 已分享给语伴 Martin lewis');
                }}
                className="flex flex-col items-center gap-1.5 cursor-pointer shrink-0 snap-start"
              >
                <div className="w-12 h-12 rounded-full relative shadow-sm hover:scale-105 active:scale-95 transition-transform">
                  <img 
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&h=80&q=80" 
                    className="w-full h-full object-cover rounded-full border border-gray-150" 
                  />
                  {/* Malta Flag badge */}
                  <span className="absolute -bottom-1 -right-1 text-xs">🇲🇹</span>
                </div>
                <span className="text-[10px] text-gray-700 font-bold tracking-tight">Martin lewis</span>
              </div>

              {/* 5. 武学 */}
              <div 
                onClick={() => {
                  setIsMenuOpen(false);
                  showToast('✈️ 已分享给语伴 武学');
                }}
                className="flex flex-col items-center gap-1.5 cursor-pointer shrink-0 snap-start"
              >
                <div className="w-12 h-12 rounded-full relative shadow-sm hover:scale-105 active:scale-95 transition-transform">
                  <img 
                    src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=80&h=80&q=80" 
                    className="w-full h-full object-cover rounded-full border border-gray-150" 
                  />
                  {/* S. Korea Flag badge */}
                  <span className="absolute -bottom-1 -right-1 text-xs">🇰🇷</span>
                </div>
                <span className="text-[10px] text-gray-700 font-bold tracking-tight">武学</span>
              </div>
            </div>

            {/* Actions Card layout */}
            <div className="mt-2 bg-gray-50 border border-gray-150 rounded-2xl overflow-hidden divide-y divide-gray-100 shadow-2xs">
              {/* Send to Chat */}
              <button 
                onClick={handleShare}
                className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-gray-100/60 active:bg-gray-150/40 transition text-left"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                    <Share2 className="w-4.5 h-4.5" />
                  </div>
                  <span className="text-xs font-bold text-gray-800">Sent to Chat</span>
                </div>
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Download */}
              <button 
                onClick={handleDownload}
                className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-gray-100/60 active:bg-gray-150/40 transition text-left"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <Download className="w-4.5 h-4.5" />
                  </div>
                  <span className="text-xs font-bold text-gray-800">Download</span>
                </div>
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
