import React from 'react';
import { FileText, FileSpreadsheet, Film, FileArchive, Music, FileCode, File, AlertTriangle, RefreshCw, EyeOff } from 'lucide-react';
import { FileMessage } from '../types';

interface FileCardProps {
  file: FileMessage;
  onRetry?: () => void;
  onDelete?: () => void;
  compact?: boolean;
}

export const getFileIcon = (ext: string, sizeClass: string = "w-10 h-10") => {
  const normalized = ext.toLowerCase();
  
  if (['doc', 'docx'].includes(normalized)) {
    return (
      <div className={`flex items-center justify-center rounded bg-blue-100 text-blue-600 ${sizeClass}`}>
        <FileText className="w-6 h-6" />
      </div>
    );
  }
  if (['xls', 'xlsx'].includes(normalized)) {
    return (
      <div className={`flex items-center justify-center rounded bg-green-100 text-green-600 ${sizeClass}`}>
        <FileSpreadsheet className="w-6 h-6" />
      </div>
    );
  }
  if (normalized === 'pdf') {
    return (
      <div className={`flex items-center justify-center rounded bg-red-100 text-red-600 ${sizeClass}`}>
        <FileText className="w-6 h-6 text-red-500" />
      </div>
    );
  }
  if (['ppt', 'pptx'].includes(normalized)) {
    return (
      <div className={`flex items-center justify-center rounded bg-orange-100 text-orange-600 ${sizeClass}`}>
        <FileText className="w-6 h-6 text-orange-500" />
      </div>
    );
  }
  if (['zip', 'rar', '7z'].includes(normalized)) {
    return (
      <div className={`flex items-center justify-center rounded bg-yellow-100 text-yellow-600 ${sizeClass}`}>
        <FileArchive className="w-6 h-6" />
      </div>
    );
  }
  if (['mp3', 'm4a', 'wav', 'aac'].includes(normalized)) {
    return (
      <div className={`flex items-center justify-center rounded bg-purple-100 text-purple-600 ${sizeClass}`}>
        <Music className="w-6 h-6" />
      </div>
    );
  }
  return (
    <div className={`flex items-center justify-center rounded bg-gray-100 text-gray-500 ${sizeClass}`}>
      <File className="w-6 h-6" />
    </div>
  );
};

export const FileCard: React.FC<FileCardProps> = ({ file, onRetry, onDelete, compact = false }) => {
  const { name, extension, size, status, progress } = file;

  const getStatusText = () => {
    if (status === 'uploading') return `上传中 ${progress || 0}%`;
    if (status === 'failed') return '发送失败，点击重试';
    if (status === 'risk_blocked') return '文件存在风险，无法发送';
    return size;
  };

  return (
    <div 
      className={`relative rounded-xl border border-gray-100 bg-white p-3 shadow-sm transition-all hover:shadow-md max-w-sm ${
        status === 'risk_blocked' ? 'border-red-100 bg-red-50/20' : ''
      } ${status === 'failed' ? 'border-amber-100 bg-amber-50/10' : ''}`}
    >
      <div className="flex items-start gap-3">
        {/* Left Icon Area */}
        <div className="shrink-0">
          {status === 'risk_blocked' ? (
            <div className="flex items-center justify-center w-10 h-10 rounded bg-red-100 text-red-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
          ) : (
            getFileIcon(extension)
          )}
        </div>

        {/* Center Text Area */}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-gray-800 line-clamp-2 leading-tight break-all">
            {name}
          </p>
          <p className={`text-xs mt-1 ${
            status === 'risk_blocked' ? 'text-red-500 font-semibold' : 
            status === 'failed' ? 'text-amber-600 font-semibold cursor-pointer' : 'text-gray-400'
          }`} onClick={() => status === 'failed' && onRetry && onRetry()}>
            {getStatusText()}
          </p>
        </div>

        {/* Right Actions for status */}
        {status === 'failed' && onRetry && (
          <button 
            onClick={(e) => { e.stopPropagation(); onRetry(); }} 
            className="shrink-0 p-1 rounded-full bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors"
            title="重试发送"
          >
            <RefreshCw className="w-4 h-4 animate-spin-reverse" />
          </button>
        )}
      </div>

      {/* Progress Bar for Uploading */}
      {status === 'uploading' && (
        <div className="mt-3 w-full bg-gray-100 rounded-full h-1 overflow-hidden">
          <div 
            className="bg-purple-500 h-full transition-all duration-300"
            style={{ width: `${progress || 0}%` }}
          />
        </div>
      )}
    </div>
  );
};
