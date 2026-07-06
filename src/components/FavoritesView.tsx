import React, { useState } from 'react';
import { ChevronLeft, Search, SlidersHorizontal, FileText, ChevronRight, Eye, Trash2, FolderSync } from 'lucide-react';
import { FavoriteItem, AdminConfig } from '../types';
import { getFileIcon } from './FileCard';

interface FavoritesViewProps {
  favorites: FavoriteItem[];
  onBack: () => void;
  onOpenPreview: (fileInfo: { name: string; extension: string; size: string }) => void;
  onRemoveFavorite: (id: string) => void;
  adminConfig: AdminConfig;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  favorites,
  onBack,
  onOpenPreview,
  onRemoveFavorite,
  adminConfig
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'All' | 'Translations' | 'Tapped Word' | 'Files'>('All');

  const filteredFavorites = favorites.filter(item => {
    // Search query filter
    if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    // Tab filter
    if (activeTab === 'Translations') {
      return item.type === 'translation';
    }
    if (activeTab === 'Tapped Word') {
      return item.type === 'word';
    }
    if (activeTab === 'Files') {
      return item.type === 'file';
    }
    return true; // All
  });

  // Render a standard favorite card (Screenshot 4 layout)
  const renderItemCard = (item: FavoriteItem) => {
    if (item.type === 'file') {
      return (
        <div 
          key={item.id}
          onClick={() => onOpenPreview({
            name: item.title,
            extension: item.fileExt || 'docx',
            size: item.fileSize || '20 KB'
          })}
          className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition cursor-pointer flex gap-3 relative group"
        >
          {/* File specific icon */}
          <div className="shrink-0">
            {getFileIcon(item.fileExt || 'docx', "w-11 h-11")}
          </div>

          <div className="flex-1 min-w-0">
            <span className="text-[9px] bg-purple-100 text-purple-600 font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
              文件收藏
            </span>
            <p className="text-sm font-bold text-gray-800 truncate mt-1 break-all">
              {item.title}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-xs text-gray-400">{item.fileSize}</p>
              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
              <p className="text-[10px] text-gray-400">来自: {item.sourceName}</p>
            </div>
          </div>

          <div className="flex flex-col justify-between items-end shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemoveFavorite(item.id);
              }}
              className="p-1 rounded bg-red-50 hover:bg-red-100 text-red-500 opacity-0 group-hover:opacity-100 transition duration-200"
              title="Remove"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      );
    }

    // Default layout with image on right (Screenshot 4 style)
    const images = {
      'fav-1': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&h=120&q=80',
      'fav-2': 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=120&h=120&q=80',
      'fav-3': 'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=120&h=120&q=80',
      'fav-4': 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?auto=format&fit=crop&w=120&h=120&q=80'
    };
    const imageUrl = images[item.id as keyof typeof images] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80';

    return (
      <div 
        key={item.id}
        className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex justify-between gap-3 relative group"
      >
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <p className="text-sm font-medium text-gray-800 line-clamp-3 leading-relaxed whitespace-pre-wrap break-words">
            {item.title}
          </p>
          <div className="flex items-center gap-2 mt-3 text-[10px] text-gray-400">
            <span className="font-semibold text-purple-600">@{item.sourceName}</span>
            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
            <span>{item.timestamp.split(' ')[0]}</span>
          </div>
        </div>

        <div className="shrink-0 relative overflow-hidden rounded-xl w-16 h-16 border border-gray-100">
          <img src={imageUrl} className="w-full h-full object-cover" />
          {item.id === 'fav-1' && (
            <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-white/80 flex items-center justify-center text-gray-800">
                <span className="text-[8px] pl-0.5">▶</span>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() => onRemoveFavorite(item.id)}
          className="absolute -top-1.5 -right-1.5 bg-red-100 hover:bg-red-200 text-red-600 p-1 rounded-full opacity-0 group-hover:opacity-100 transition duration-250 shadow-sm"
          title="Remove from favorites"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-800 font-sans">
      {/* Header (Screenshot 4) */}
      <div className="flex items-center justify-between px-3 py-2.5 bg-white border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-1">
          <button onClick={onBack} className="p-1.5 hover:bg-gray-100 rounded-full transition">
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
          <span className="font-bold text-gray-800 text-base">Favorites (收藏)</span>
        </div>
        <SlidersHorizontal className="w-4.5 h-4.5 text-gray-700 cursor-pointer" />
      </div>

      {/* Search Filter Box */}
      <div className="px-4 py-2.5 bg-white shrink-0">
        <div className="relative flex items-center bg-gray-100 rounded-xl px-3 py-1.5">
          <Search className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
          <input
            type="text"
            placeholder="Search favorites"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs bg-transparent outline-none text-gray-700 placeholder-gray-400"
          />
        </div>
      </div>

      {/* Tabs list (Screenshot 4: All, Translations, Tapped Word, and newly requested File Tab) */}
      <div className="px-4 py-2 bg-white border-b border-gray-100 flex gap-2 overflow-x-auto scrollbar-none shrink-0">
        {(['All', 'Translations', 'Tapped Word'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
              activeTab === tab
                ? 'bg-purple-50 text-purple-600 border border-purple-100'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200 border border-transparent'
            }`}
          >
            {tab}
          </button>
        ))}

        {/* NEW FILES TAB (if entry is enabled in config) */}
        {adminConfig.ht_collection_file_entry_enable && (
          <button
            onClick={() => setActiveTab('Files')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap flex items-center gap-1 transition ${
              activeTab === 'Files'
                ? 'bg-purple-600 text-white border border-purple-500 shadow-sm'
                : 'bg-purple-50 text-purple-600 hover:bg-purple-100 border border-purple-200/50'
            }`}
          >
            <FolderSync className="w-3.5 h-3.5 animate-pulse" />
            <span>文件 (Files)</span>
          </button>
        )}
      </div>

      {/* Content List Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {filteredFavorites.length > 0 ? (
          filteredFavorites.map(renderItemCard)
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-300 mb-3">
              <FileText className="w-8 h-8" />
            </div>
            <p className="text-sm font-semibold text-gray-500">
              {activeTab === 'Files' ? '暂无收藏文件' : '暂无收藏内容'}
            </p>
            <p className="text-xs text-gray-400 mt-1 max-w-[200px]">
              {activeTab === 'Files' 
                ? '可在聊天场景或记事本中长按文件消息，点击“Favorite”添加。' 
                : '收藏列表为空，尝试点击其他位置。'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
