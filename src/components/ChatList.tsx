import React, { useState } from 'react';
import { Search, Plus, ChevronDown, BellOff, Volume2, BookOpen, Gamepad, Languages, Compass, User, NotebookTabs, FolderKanban } from 'lucide-react';
import { Contact, NotepadNote } from '../types';

interface ChatListProps {
  contacts: Contact[];
  onSelectContact: (contactId: string) => void;
  onOpenNotepad: () => void;
  onOpenFavorites: () => void;
  activeTab: string;
  notes: NotepadNote[];
}

export const ChatList: React.FC<ChatListProps> = ({
  contacts,
  onSelectContact,
  onOpenNotepad,
  onOpenFavorites,
  activeTab,
  notes
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'All' | 'Archives' | 'Online' | 'Unread'>('All');

  // Top quick-access HelloTalk courses & games (Screenshot 1)
  const quickApps = [
    { name: 'All Courses', icon: BookOpen, color: 'bg-blue-500' },
    { name: 'Play', icon: Volume2, color: 'bg-emerald-500' },
    { name: 'AI Translation', icon: Languages, color: 'bg-cyan-500' },
    { name: 'Words Fishing', icon: Gamepad, color: 'bg-orange-400' },
  ];

  // Helper to get last message preview
  const getMessagePreview = (contact: Contact) => {
    if (contact.messages.length === 0) return 'No messages';
    const lastMsg = contact.messages[contact.messages.length - 1];
    if (lastMsg.type === 'file' && lastMsg.file) {
      return `[文件] ${lastMsg.file.name}`;
    }
    if (lastMsg.type === 'sticker') {
      return '😊 Stickers';
    }
    if (lastMsg.type === 'gift') {
      return '🎁 Gift sent!';
    }
    return lastMsg.content || '';
  };

  const filteredContacts = contacts.filter(contact => {
    // Search filter
    if (searchQuery && !contact.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    // Tab filter
    if (filterTab === 'Online') {
      return contact.id === 'lin-fan' || contact.id === 'rose'; // Simulated online
    }
    if (filterTab === 'Unread') {
      return (contact.unreadCount ?? 0) > 0;
    }
    return true;
  });

  // Get last note preview details
  const lastNote = notes.length > 0 ? notes[notes.length - 1] : null;
  const lastNoteText = lastNote 
    ? (lastNote.type === 'file' ? `[文件] ${lastNote.file?.name}` : lastNote.content) 
    : '无内容';
  const lastNoteTime = lastNote ? lastNote.timestamp : '18:33';

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-800 font-sans">
      {/* HelloTalk Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-lg font-black text-gray-800 tracking-tight">Language Talks</span>
          <span className="bg-purple-100 text-purple-700 font-extrabold text-[8px] px-1 py-0.5 rounded-md">PRO</span>
        </div>
        <div className="flex items-center gap-3">
          <Plus className="w-5 h-5 text-gray-700 cursor-pointer" />
        </div>
      </div>

      {/* Course shortcuts (Screenshot 1 top icons) */}
      <div className="bg-white px-4 py-3 border-b border-gray-50">
        <div className="flex justify-between items-center text-center">
          {quickApps.map((app, index) => (
            <div key={index} className="flex flex-col items-center cursor-pointer group">
              <div className={`w-11 h-11 rounded-2xl ${app.color} text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform`}>
                <app.icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] text-gray-500 mt-1.5 font-medium whitespace-nowrap">{app.name}</span>
            </div>
          ))}
          <div className="flex flex-col items-center cursor-pointer group">
            <div className="w-11 h-11 rounded-2xl bg-gray-100 text-gray-500 flex items-center justify-center shadow-sm group-hover:bg-gray-200 transition-colors">
              <ChevronDown className="w-5 h-5" />
            </div>
            <span className="text-[10px] text-gray-500 mt-1.5 font-medium">More</span>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-4 py-2 bg-white">
        <div className="relative flex items-center bg-gray-100 rounded-xl px-3 py-1.5">
          <Search className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-sm bg-transparent outline-none text-gray-700 placeholder-gray-400"
          />
        </div>
      </div>

      {/* Filter Tabs (Screenshot 1: All, Archives, Online, Unread) */}
      <div className="px-4 py-2 bg-white border-b border-gray-100 overflow-x-auto scrollbar-none flex gap-2">
        {(['All', 'Archives', 'Online', 'Unread'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilterTab(tab)}
            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition ${
              filterTab === tab
                ? 'bg-purple-100 text-purple-600'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Chat List Items */}
      <div className="flex-1 overflow-y-auto">
        <div className="divide-y divide-gray-100 bg-white">
          {/* Synthesized Notepad Row - Image 1 style */}
          {filterTab === 'All' && !searchQuery && (
            <div
              onClick={onOpenNotepad}
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition-colors border-b border-gray-100"
            >
              {/* Custom Hot-pink / Magenta-red Notepad Icon matching user's Image 1 */}
              <div className="w-12 h-12 bg-[#ff0a54] rounded-[16px] flex items-center justify-center shrink-0 shadow-xs relative overflow-hidden">
                <div className="w-[24px] h-[28px] bg-white rounded-[6px] flex flex-col justify-center items-center gap-1 p-1">
                  <div className="w-3.5 h-1 bg-[#ff0a54] rounded-full"></div>
                  <div className="w-3.5 h-1 bg-[#ff0a54] rounded-full"></div>
                  <div className="w-3.5 h-1 bg-[#ff0a54] rounded-full"></div>
                </div>
              </div>

              {/* Name & Last Message Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="font-bold text-gray-800 text-sm">记事本 (Notepad)</span>
                    <span className="text-[9px] text-purple-600 font-semibold bg-purple-50 px-1.5 rounded">仅自己可见</span>
                  </div>
                  <span className="text-[10px] text-gray-400 shrink-0">
                    {lastNoteTime}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-0.5">
                  <p className="text-xs text-gray-500 truncate max-w-[85%] font-medium">
                    {lastNoteText}
                  </p>
                </div>
              </div>
            </div>
          )}

          {filteredContacts.map((contact) => {
            const lastMsg = contact.messages[contact.messages.length - 1];
            return (
              <div
                key={contact.id}
                onClick={() => onSelectContact(contact.id)}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition-colors"
              >
                {/* Avatar with Status badge */}
                <div className="relative shrink-0">
                  <img
                    src={contact.avatar}
                    alt={contact.name}
                    className="w-12 h-12 rounded-full object-cover border border-gray-100"
                  />
                  {contact.flag && (
                    <span className="absolute bottom-0 right-0 text-sm bg-white rounded-full leading-none p-0.5 shadow-sm border border-gray-100">
                      {contact.flag}
                    </span>
                  )}
                  {/* Online indicator dot for certain users */}
                  {(contact.id === 'lin-fan' || contact.id === 'rose') && (
                    <span className="absolute top-0 left-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                  )}
                </div>

                {/* Name & Last Message Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="font-bold text-gray-800 text-sm truncate">{contact.name}</span>
                      {contact.isVIP && (
                        <span className="shrink-0 bg-gradient-to-r from-orange-400 to-amber-500 text-white font-extrabold text-[9px] px-1 py-0.5 rounded italic">
                          {contact.vipLevel || 'VIP'}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-gray-400 shrink-0">
                      {contact.lastSeen}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-0.5">
                    <p className="text-xs text-gray-500 truncate max-w-[85%]">
                      {getMessagePreview(contact)}
                    </p>
                    
                    {/* Unread Badge / Status */}
                    {contact.unreadCount && contact.unreadCount > 0 ? (
                      <span className="min-w-4 h-4 rounded-full bg-purple-500 text-white font-bold text-[9px] flex items-center justify-center px-1">
                        {contact.unreadCount > 99 ? '99+' : contact.unreadCount}
                      </span>
                    ) : contact.id === 'live-voiceroom' ? (
                      <BellOff className="w-3.5 h-3.5 text-gray-300" />
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Simulated Phone Navigation Tab Bar */}
      <div className="bg-white border-t border-gray-100 py-1.5 px-4 flex justify-between text-center select-none shrink-0">
        <div className="flex flex-col items-center flex-1 text-purple-600 cursor-pointer">
          <div className="relative">
            <Compass className="w-5 h-5 text-purple-600" />
            <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[8px] px-1 rounded-full font-bold">99+</span>
          </div>
          <span className="text-[9px] font-semibold mt-0.5">HelloTalk</span>
        </div>
        <div className="flex flex-col items-center flex-1 text-gray-400 hover:text-gray-600 cursor-pointer">
          <User className="w-5 h-5" />
          <span className="text-[9px] mt-0.5">Connect</span>
        </div>
        <div className="flex flex-col items-center flex-1 text-gray-400 hover:text-gray-600 cursor-pointer">
          <Compass className="w-5 h-5" />
          <span className="text-[9px] mt-0.5">Moments</span>
        </div>
        <div className="flex flex-col items-center flex-1 text-gray-400 hover:text-gray-600 cursor-pointer">
          <Volume2 className="w-5 h-5" />
          <span className="text-[9px] mt-0.5">Voiceroom</span>
        </div>
        <div className="flex flex-col items-center flex-1 text-gray-400 hover:text-gray-600 cursor-pointer">
          <User className="w-5 h-5" />
          <span className="text-[9px] mt-0.5">Me</span>
        </div>
      </div>
    </div>
  );
};
