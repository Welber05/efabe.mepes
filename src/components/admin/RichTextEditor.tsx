import React, { useState, useRef } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  Heading1, 
  Heading2, 
  List, 
  ListOrdered, 
  Quote, 
  Link as LinkIcon, 
  Image as ImageIcon, 
  Film, 
  FileText, 
  Paperclip, 
  Eye, 
  Edit3, 
  Columns, 
  X, 
  Check, 
  Plus, 
  Download,
  Upload,
  AlertCircle
} from 'lucide-react';
import { RichTextRenderer } from '../common/RichTextRenderer';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  minRows?: number;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  label = 'Conteúdo da Postagem / Comunicado',
  placeholder = 'Escreva seu texto aqui. Use a barra de ferramentas acima para formatar o texto, incluir links, imagens, vídeos ou anexar documentos...',
  minRows = 6,
}) => {
  const [viewMode, setViewMode] = useState<'edit' | 'split' | 'preview'>('edit');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Dialog States
  const [activeModal, setActiveModal] = useState<'link' | 'image' | 'video' | 'file' | null>(null);

  // Link Dialog State
  const [linkText, setLinkText] = useState('');
  const [linkUrl, setLinkUrl] = useState('');

  // Image Dialog State
  const [imgUrl, setImgUrl] = useState('');
  const [imgCaption, setImgCaption] = useState('');

  // Video Dialog State
  const [videoUrl, setVideoUrl] = useState('');
  const [videoTitle, setVideoTitle] = useState('');

  // File Dialog State
  const [fileName, setFileName] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [fileType, setFileType] = useState('PDF');

  // Insert helper to insert formatted text at cursor position
  const insertTextAtCursor = (before: string, after: string = '', defaultSelectedText: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) {
      onChange(value + before + defaultSelectedText + after);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end) || defaultSelectedText;

    const replacement = before + selectedText + after;
    const newValue = value.substring(0, start) + replacement + value.substring(end);
    
    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selectedText.length
      );
    }, 50);
  };

  // Preset sample files for quick attachment
  const sampleSchoolFiles = [
    { name: 'Calendário de Alternância EFABE 2026.pdf', url: 'https://mepes.org.br/docs/calendario_2026.pdf', type: 'PDF' },
    { name: 'Matriz Curricular - Técnico Agropecuária.pdf', url: 'https://mepes.org.br/docs/matriz_agropecuaria.pdf', type: 'PDF' },
    { name: 'Ficha de Inscrição e Matrícula EFABE.docx', url: 'https://mepes.org.br/docs/ficha_inscricao.docx', type: 'DOCX' },
    { name: 'Plano de Estudo Agroecológico (Guia).pdf', url: 'https://mepes.org.br/docs/plano_de_estudo.pdf', type: 'PDF' },
  ];

  // Preset sample images for quick insertion
  const sampleImages = [
    { caption: 'Estudantes na Sessão Escola', url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80' },
    { caption: 'Prática Agrícola na Unidade', url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80' },
    { caption: 'Laboratório de Análise Agropecuária', url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80' },
  ];

  // Handlers for modals
  const handleConfirmLink = (e?: React.FormEvent | React.MouseEvent) => {
    e?.preventDefault();
    if (!linkUrl) return;
    const text = linkText.trim() || linkUrl;
    insertTextAtCursor(`[${text}](`, `)`, '');
    setActiveModal(null);
    setLinkText('');
    setLinkUrl('');
  };

  const handleConfirmImage = (e?: React.FormEvent | React.MouseEvent) => {
    e?.preventDefault();
    if (!imgUrl) return;
    const caption = imgCaption.trim();
    insertTextAtCursor(`\n![${caption}](`, `)\n`, '');
    setActiveModal(null);
    setImgUrl('');
    setImgCaption('');
  };

  const handleConfirmVideo = (e?: React.FormEvent | React.MouseEvent) => {
    e?.preventDefault();
    if (!videoUrl) return;
    const title = videoTitle.trim();
    const tag = title ? `\n[video:${videoUrl}|${title}]\n` : `\n[video:${videoUrl}]\n`;
    insertTextAtCursor(tag, '', '');
    setActiveModal(null);
    setVideoUrl('');
    setVideoTitle('');
  };

  const handleConfirmFile = (e?: React.FormEvent | React.MouseEvent) => {
    e?.preventDefault();
    if (!fileUrl) return;
    const name = fileName.trim() || 'Documento Anexo';
    const tag = `\n[file:${fileUrl}|${name}]\n`;
    insertTextAtCursor(tag, '', '');
    setActiveModal(null);
    setFileName('');
    setFileUrl('');
  };

  // Local file upload simulation for document attachments
  const handleFileUploadSimulated = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const generatedUrl = `https://mepes.org.br/downloads/${encodeURIComponent(file.name)}`;
      setFileName(file.name);
      setFileUrl(generatedUrl);
      if (file.name.endsWith('.pdf')) setFileType('PDF');
      else if (file.name.endsWith('.doc') || file.name.endsWith('.docx')) setFileType('DOCX');
      else if (file.name.endsWith('.xls') || file.name.endsWith('.xlsx')) setFileType('EXCEL');
    }
  };

  return (
    <div className="space-y-2 font-body">
      {/* Header Label and Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label className="block text-xs font-bold text-slate-800 font-heading">
          {label}
        </label>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setViewMode('edit')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
              viewMode === 'edit'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Modo de Edição Direta"
          >
            <Edit3 size={13} />
            <span>Editar</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('split')}
            className={`hidden md:flex px-2.5 py-1 rounded-lg text-xs font-bold items-center gap-1.5 transition-colors cursor-pointer ${
              viewMode === 'split'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Visualização Lado a Lado"
          >
            <Columns size={13} />
            <span>Dividido</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('preview')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
              viewMode === 'preview'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Ver Resultado Final Formatado"
          >
            <Eye size={13} />
            <span>Pré-visualizar</span>
          </button>
        </div>
      </div>

      {/* Editor Container */}
      <div className="border border-slate-300 rounded-2xl overflow-hidden bg-white shadow-xs focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500 transition-all">
        
        {/* BARRA DE CONFIGURAÇÕES E FORMATAÇÃO DE TEXTO */}
        {viewMode !== 'preview' && (
          <div className="p-2 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center gap-1 select-none">
            
            {/* Formatação Básica */}
            <div className="flex items-center gap-0.5 pr-2 border-r border-slate-200">
              <button
                type="button"
                onClick={() => insertTextAtCursor('**', '**', 'texto em negrito')}
                className="p-1.5 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
                title="Negrito (**texto**)"
              >
                <Bold size={15} />
              </button>
              <button
                type="button"
                onClick={() => insertTextAtCursor('*', '*', 'texto em itálico')}
                className="p-1.5 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
                title="Itálico (*texto*)"
              >
                <Italic size={15} />
              </button>
              <button
                type="button"
                onClick={() => insertTextAtCursor('<u>', '</u>', 'texto sublinhado')}
                className="p-1.5 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
                title="Sublinhado (<u>texto</u>)"
              >
                <Underline size={15} />
              </button>
            </div>

            {/* Cabeçalhos e Títulos */}
            <div className="flex items-center gap-0.5 px-2 border-r border-slate-200">
              <button
                type="button"
                onClick={() => insertTextAtCursor('\n# ', '\n', 'Título Principal')}
                className="p-1.5 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
                title="Título H1 (# Título)"
              >
                <Heading1 size={15} />
              </button>
              <button
                type="button"
                onClick={() => insertTextAtCursor('\n## ', '\n', 'Subtítulo do Bloco')}
                className="p-1.5 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
                title="Subtítulo H2 (## Subtítulo)"
              >
                <Heading2 size={15} />
              </button>
            </div>

            {/* Listas e Citações */}
            <div className="flex items-center gap-0.5 px-2 border-r border-slate-200">
              <button
                type="button"
                onClick={() => insertTextAtCursor('\n- ', '\n', 'Item de lista')}
                className="p-1.5 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
                title="Lista com Marcadores (- Item)"
              >
                <List size={15} />
              </button>
              <button
                type="button"
                onClick={() => insertTextAtCursor('\n> ', '\n', 'Citação ou destaque importante')}
                className="p-1.5 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
                title="Caixa de Citação (> Texto)"
              >
                <Quote size={15} />
              </button>
            </div>

            {/* BOTÕES DE MÍDIAS E ANEXOS (REQUISITADOS PELO USUÁRIO) */}
            <div className="flex items-center gap-1 pl-2">
              
              {/* Inserir Link */}
              <button
                type="button"
                onClick={() => {
                  setLinkText('');
                  setLinkUrl('');
                  setActiveModal('link');
                }}
                className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-emerald-800 border border-slate-300 rounded-lg font-bold text-xs flex items-center gap-1 cursor-pointer shadow-2xs transition-colors"
                title="Inserir Link Clicável"
              >
                <LinkIcon size={14} className="text-emerald-700" />
                <span>Link</span>
              </button>

              {/* Inserir Imagem */}
              <button
                type="button"
                onClick={() => {
                  setImgUrl('');
                  setImgCaption('');
                  setActiveModal('image');
                }}
                className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-emerald-800 border border-slate-300 rounded-lg font-bold text-xs flex items-center gap-1 cursor-pointer shadow-2xs transition-colors"
                title="Inserir Imagem com Legenda"
              >
                <ImageIcon size={14} className="text-emerald-700" />
                <span>Imagem</span>
              </button>

              {/* Inserir Vídeo */}
              <button
                type="button"
                onClick={() => {
                  setVideoUrl('');
                  setVideoTitle('');
                  setActiveModal('video');
                }}
                className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-emerald-800 border border-slate-300 rounded-lg font-bold text-xs flex items-center gap-1 cursor-pointer shadow-2xs transition-colors"
                title="Inserir Vídeo do YouTube ou MP4"
              >
                <Film size={14} className="text-emerald-700" />
                <span>Vídeo</span>
              </button>

              {/* Inserir Arquivos / Anexos */}
              <button
                type="button"
                onClick={() => {
                  setFileName('');
                  setFileUrl('');
                  setFileType('PDF');
                  setActiveModal('file');
                }}
                className="px-2.5 py-1 bg-emerald-800 hover:bg-emerald-900 text-amber-300 border border-emerald-700 rounded-lg font-bold text-xs flex items-center gap-1 cursor-pointer shadow-2xs transition-colors"
                title="Anexar Arquivo, PDF, Documento ou Planilha"
              >
                <Paperclip size={14} />
                <span>Anexar Arquivo</span>
              </button>

            </div>

          </div>
        )}

        {/* Content Body */}
        <div className={viewMode === 'split' ? 'grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200' : ''}>
          
          {/* TextArea input */}
          {(viewMode === 'edit' || viewMode === 'split') && (
            <textarea
              ref={textareaRef}
              rows={minRows}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="w-full p-4 text-xs font-body text-slate-800 focus:outline-none resize-y leading-relaxed bg-transparent"
            />
          )}

          {/* Render Preview */}
          {(viewMode === 'preview' || viewMode === 'split') && (
            <div className="p-5 bg-slate-50/70 overflow-y-auto max-h-[500px]">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 border-b border-slate-200 pb-1 flex items-center gap-1">
                <Eye size={12} /> Pré-visualização ao vivo
              </div>
              {value.trim() ? (
                <RichTextRenderer content={value} />
              ) : (
                <p className="text-xs text-slate-400 italic">O resultado formatado aparecerá aqui assim que você digitar...</p>
              )}
            </div>
          )}

        </div>

      </div>


      {/* MODAIS INTERATIVOS DE INSERÇÃO */}

      {/* 1. Modal de Inserção de Link */}
      {activeModal === 'link' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md p-6 space-y-4 relative">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-full cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <LinkIcon className="text-emerald-700" size={20} />
              <h3 className="font-extrabold text-sm text-slate-900 font-heading">Inserir Link no Texto</h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Texto do Link</label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleConfirmLink(); } }}
                  placeholder="Ex: Clique aqui para acessar a página do MEPES"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Endereço Web / URL (http/https)</label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleConfirmLink(); } }}
                  placeholder="https://www.mepes.org.br"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden font-mono"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmLink}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer"
                >
                  <Check size={14} /> Inserir Link
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* 2. Modal de Inserção de Imagem */}
      {activeModal === 'image' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg p-6 space-y-4 relative">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-full cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <ImageIcon className="text-emerald-700" size={20} />
              <h3 className="font-extrabold text-sm text-slate-900 font-heading">Inserir Imagem no Texto</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">URL da Imagem</label>
                <input
                  type="url"
                  value={imgUrl}
                  onChange={(e) => setImgUrl(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleConfirmImage(); } }}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Legenda / Descrição da Foto</label>
                <input
                  type="text"
                  value={imgCaption}
                  onChange={(e) => setImgCaption(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleConfirmImage(); } }}
                  placeholder="Ex: Aula prática de agroecologia no campo"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden"
                />
              </div>

              {/* Preset images preview */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-bold text-slate-600 block">Ou selecione uma imagem de exemplo:</span>
                <div className="grid grid-cols-3 gap-2">
                  {sampleImages.map((s, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setImgUrl(s.url);
                        setImgCaption(s.caption);
                      }}
                      className="rounded-xl overflow-hidden border border-slate-200 hover:border-emerald-500 p-1 bg-slate-50 cursor-pointer group transition-all"
                    >
                      <img src={s.url} alt={s.caption} className="w-full h-16 object-cover rounded-lg group-hover:scale-105 transition-transform" />
                      <p className="text-[9px] text-slate-600 truncate mt-1 font-medium">{s.caption}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmImage}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer"
                >
                  <Check size={14} /> Inserir Imagem
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* 3. Modal de Inserção de Vídeo */}
      {activeModal === 'video' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md p-6 space-y-4 relative">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-full cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Film className="text-emerald-700" size={20} />
              <h3 className="font-extrabold text-sm text-slate-900 font-heading">Incorporar Vídeo</h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">URL do Vídeo (YouTube, Vimeo ou MP4)</label>
                <input
                  type="text"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleConfirmVideo(); } }}
                  placeholder="Ex: https://www.youtube.com/watch?v=..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden font-mono"
                  required
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Copie e cole a URL inteira do vídeo do YouTube. O sistema criará o player automaticamente.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Título / Identificador do Vídeo (Opcional)</label>
                <input
                  type="text"
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleConfirmVideo(); } }}
                  placeholder="Ex: Documentário Pedagogia da Alternância MEPES"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmVideo}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer"
                >
                  <Check size={14} /> Incorporar Vídeo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* 4. Modal de Inserção de Arquivos Diversos / Documentos (REQUISITADO) */}
      {activeModal === 'file' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg p-6 space-y-4 relative">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-full cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Paperclip className="text-emerald-700" size={20} />
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 font-heading">Anexar Arquivo / Documento no Texto</h3>
                <p className="text-[11px] text-slate-500">Insira um documento PDF, Word, Excel ou link de download seguro</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nome do Documento / Anexo</label>
                <input
                  type="text"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleConfirmFile(); } }}
                  placeholder="Ex: Calendário Acadêmico 2026 - EFABE.pdf"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">URL / Link do Arquivo</label>
                <input
                  type="text"
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleConfirmFile(); } }}
                  placeholder="https://mepes.org.br/documentos/calendario.pdf"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden font-mono"
                  required
                />
              </div>

              {/* Simulated Upload Option */}
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 space-y-2">
                <span className="text-[11px] font-bold text-amber-900 flex items-center gap-1.5">
                  <Upload size={14} className="text-amber-700" />
                  <span>Ou selecione um arquivo do seu computador para simular anexo:</span>
                </span>
                <input
                  type="file"
                  onChange={handleFileUploadSimulated}
                  className="block w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-amber-700 file:text-white hover:file:bg-amber-800 cursor-pointer"
                />
              </div>

              {/* Sample Preset Files */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-600 block">Ou escolha um documento escolar pronto:</span>
                <div className="space-y-1 max-h-36 overflow-y-auto">
                  {sampleSchoolFiles.map((sf, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setFileName(sf.name);
                        setFileUrl(sf.url);
                        setFileType(sf.type);
                      }}
                      className="p-2 bg-slate-50 hover:bg-emerald-50 rounded-lg border border-slate-200 hover:border-emerald-300 flex items-center justify-between gap-2 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText size={14} className="text-emerald-700 shrink-0" />
                        <span className="text-xs font-bold text-slate-800 truncate">{sf.name}</span>
                      </div>
                      <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded border border-emerald-200">
                        {sf.type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmFile}
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-amber-300 font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer"
                >
                  <Paperclip size={14} /> Anexar Documento no Texto
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
