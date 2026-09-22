import React, { useState } from 'react';
import { ExternalLink, Download, FileText, Image as ImageIcon, Film, Paperclip, FileSpreadsheet, Eye, X } from 'lucide-react';

interface RichTextRendererProps {
  content: string;
  className?: string;
}

export const RichTextRenderer: React.FC<RichTextRendererProps> = ({ content, className = '' }) => {
  const [activeImageModal, setActiveImageModal] = useState<string | null>(null);

  if (!content) return null;

  // Helper to extract YouTube video ID
  const getYouTubeEmbedUrl = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
  };

  // Helper to check file extension
  const getFileTypeInfo = (url: string, name: string) => {
    const ext = url.split('.').pop()?.toLowerCase() || name.split('.').pop()?.toLowerCase() || '';
    if (ext.includes('pdf')) return { type: 'PDF', color: 'bg-red-100 text-red-800 border-red-200' };
    if (ext.includes('doc') || ext.includes('docx')) return { type: 'DOCX', color: 'bg-blue-100 text-blue-800 border-blue-200' };
    if (ext.includes('xls') || ext.includes('xlsx')) return { type: 'EXCEL', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
    if (ext.includes('zip') || ext.includes('rar')) return { type: 'ZIP', color: 'bg-amber-100 text-amber-800 border-amber-200' };
    return { type: 'ARQUIVO', color: 'bg-slate-100 text-slate-800 border-slate-200' };
  };

  // Process paragraphs
  const paragraphs = content.split(/\n\s*\n/);

  return (
    <div className={`space-y-4 text-slate-800 font-body leading-relaxed ${className}`}>
      {paragraphs.map((paragraph, pIdx) => {
        const trimmed = paragraph.trim();
        if (!trimmed) return null;

        // 1. YouTube Video Embed check
        const ytEmbed = getYouTubeEmbedUrl(trimmed);
        if (ytEmbed) {
          return (
            <div key={pIdx} className="my-4 rounded-2xl overflow-hidden shadow-md border border-slate-200 bg-black aspect-video max-w-3xl mx-auto">
              <iframe
                src={ytEmbed}
                title="Vídeo Incorporado"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          );
        }

        // 2. Custom Video Tag or Embed Syntax check: [video:URL] or [video:URL|Título]
        if (trimmed.startsWith('[video:') && trimmed.endsWith(']')) {
          const videoInfo = trimmed.slice(7, -1);
          const [videoUrl, videoTitle] = videoInfo.split('|');
          const ytMatch = getYouTubeEmbedUrl(videoUrl);

          return (
            <div key={pIdx} className="my-4 space-y-2 max-w-3xl">
              {videoTitle && (
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 font-heading">
                  <Film size={15} className="text-emerald-700" />
                  <span>{videoTitle}</span>
                </div>
              )}
              {ytMatch ? (
                <div className="rounded-2xl overflow-hidden shadow-md border border-slate-200 bg-black aspect-video">
                  <iframe
                    src={ytMatch}
                    title={videoTitle || 'Vídeo'}
                    className="w-full h-full border-0"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="rounded-2xl overflow-hidden shadow-md border border-slate-200 bg-black">
                  <video src={videoUrl} controls className="w-full max-h-[450px]">
                    Seu navegador não suporta reprodução direta de vídeos.
                  </video>
                </div>
              )}
            </div>
          );
        }

        // 3. File attachment syntax check: [file:URL|Nome do Arquivo] or [file:URL]
        if (trimmed.startsWith('[file:') && trimmed.endsWith(']')) {
          const fileData = trimmed.slice(6, -1);
          const [fileUrl, fileName] = fileData.split('|');
          const displayName = fileName || 'Documento Anexo EFABE';
          const fileInfo = getFileTypeInfo(fileUrl, displayName);

          return (
            <div key={pIdx} className="my-3 p-4 bg-emerald-50/70 hover:bg-emerald-100/80 rounded-2xl border border-emerald-200/80 flex items-center justify-between gap-4 transition-colors group">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <FileText size={20} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border uppercase ${fileInfo.color}`}>
                      {fileInfo.type}
                    </span>
                    <h5 className="font-bold text-xs text-slate-900 group-hover:text-emerald-900 transition-colors truncate">
                      {displayName}
                    </h5>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">
                    Clique no botão ao lado para abrir ou fazer o download seguro do documento
                  </p>
                </div>
              </div>

              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shrink-0 shadow-xs transition-transform active:scale-95 cursor-pointer"
              >
                <Download size={14} />
                <span className="hidden sm:inline">Baixar Arquivo</span>
              </a>
            </div>
          );
        }

        // 4. Standalone Image syntax: ![alt](url)
        const imgMarkdownRegex = /^!\[(.*?)\]\((.*?)\)$/;
        const imgMatch = trimmed.match(imgMarkdownRegex);
        if (imgMatch) {
          const altText = imgMatch[1];
          const imgUrl = imgMatch[2];
          return (
            <div key={pIdx} className="my-4 space-y-2">
              <div
                onClick={() => setActiveImageModal(imgUrl)}
                className="rounded-2xl overflow-hidden shadow-md border border-slate-200 group relative cursor-pointer"
              >
                <img
                  src={imgUrl}
                  alt={altText || 'Imagem do comunicado'}
                  className="w-full max-h-[500px] object-cover group-hover:scale-102 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-2">
                  <Eye size={18} />
                  <span>Clique para ampliar a imagem</span>
                </div>
              </div>
              {altText && (
                <p className="text-center text-xs text-slate-500 italic font-body">
                  📷 {altText}
                </p>
              )}
            </div>
          );
        }

        // 5. Titles (Headings: # H1, ## H2, ### H3)
        if (trimmed.startsWith('# ')) {
          return (
            <h2 key={pIdx} className="text-2xl font-extrabold text-slate-900 font-heading pt-3 border-b border-slate-200 pb-1.5">
              {renderFormattedText(trimmed.slice(2))}
            </h2>
          );
        }
        if (trimmed.startsWith('## ')) {
          return (
            <h3 key={pIdx} className="text-xl font-bold text-emerald-950 font-heading pt-2">
              {renderFormattedText(trimmed.slice(3))}
            </h3>
          );
        }
        if (trimmed.startsWith('### ')) {
          return (
            <h4 key={pIdx} className="text-lg font-bold text-slate-800 font-heading pt-1">
              {renderFormattedText(trimmed.slice(4))}
            </h4>
          );
        }

        // 6. Blockquote (Citação: > texto)
        if (trimmed.startsWith('> ')) {
          return (
            <blockquote key={pIdx} className="p-4 my-3 bg-amber-50/80 border-l-4 border-amber-500 rounded-r-2xl text-slate-800 text-sm font-medium italic">
              {renderFormattedText(trimmed.slice(2))}
            </blockquote>
          );
        }

        // 7. Bullet Lists (- item ou * item)
        if (trimmed.split('\n').every(line => line.trim().startsWith('- ') || line.trim().startsWith('* '))) {
          const listItems = trimmed.split('\n').map(l => l.trim().slice(2));
          return (
            <ul key={pIdx} className="list-disc list-inside space-y-1.5 my-3 pl-2 text-sm text-slate-700">
              {listItems.map((item, iIdx) => (
                <li key={iIdx}>{renderFormattedText(item)}</li>
              ))}
            </ul>
          );
        }

        // 8. Standard paragraph
        return (
          <p key={pIdx} className="text-sm leading-relaxed text-slate-700 whitespace-pre-line">
            {renderFormattedText(trimmed)}
          </p>
        );
      })}

      {/* Fullscreen Image Modal */}
      {activeImageModal && (
        <div
          onClick={() => setActiveImageModal(null)}
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl">
            <button
              onClick={() => setActiveImageModal(null)}
              className="absolute top-3 right-3 bg-slate-900/80 hover:bg-black text-white p-2 rounded-full cursor-pointer transition-colors z-10"
            >
              <X size={20} />
            </button>
            <img src={activeImageModal} alt="Imagem Ampliada" className="w-full h-full object-contain" />
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to render bold, italic, underline, links, and inline file links
function renderFormattedText(text: string): React.ReactNode {
  if (!text) return null;

  // Split links [Text](Url)
  const linkRegex = /\[(.*?)\]\((.*?)\)/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    const label = match[1];
    const url = match[2];

    // Check if it's a file link icon
    const isFile = label.includes('📎') || label.includes('📄') || url.endsWith('.pdf') || url.endsWith('.docx');

    parts.push(
      <a
        key={match.index}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-1 font-bold transition-colors underline ${
          isFile
            ? 'text-emerald-800 bg-emerald-100 hover:bg-emerald-200 px-2 py-0.5 rounded-md no-underline text-xs'
            : 'text-emerald-700 hover:text-emerald-900'
        }`}
      >
        {isFile && <Paperclip size={12} className="shrink-0" />}
        <span>{label}</span>
        {!isFile && <ExternalLink size={12} className="shrink-0 opacity-70" />}
      </a>
    );

    lastIndex = linkRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  // Next, parse HTML-like tags or Markdown (**bold**, *italic*, <u>underline</u>)
  return parts.map((part, idx) => {
    if (typeof part !== 'string') return part;

    // Process bold **text**
    const boldParts = part.split(/(\*\*.*?\*\*)/g);
    return boldParts.map((bPart, bIdx) => {
      if (bPart.startsWith('**') && bPart.endsWith('**')) {
        return <strong key={bIdx} className="font-extrabold text-slate-900">{bPart.slice(2, -2)}</strong>;
      }

      // Process italic *text*
      const italicParts = bPart.split(/(\*.*?\*)/g);
      return italicParts.map((iPart, iIdx) => {
        if (iPart.startsWith('*') && iPart.endsWith('*')) {
          return <em key={iIdx} className="italic text-slate-800">{iPart.slice(1, -1)}</em>;
        }

        // Process underline <u>text</u>
        const underlineParts = iPart.split(/(<u>.*?<\/u>)/g);
        return underlineParts.map((uPart, uIdx) => {
          if (uPart.startsWith('<u>') && uPart.endsWith('</u>')) {
            return <u key={uIdx} className="underline decoration-emerald-600 decoration-2">{uPart.slice(3, -4)}</u>;
          }
          return uPart;
        });
      });
    });
  });
}
