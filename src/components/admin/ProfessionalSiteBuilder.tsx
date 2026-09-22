import React, { useEffect, useMemo, useState } from 'react';
import {
  AlignCenter, AlignLeft, AlignRight, Archive, ArrowDown, ArrowUp, Check, ChevronLeft,
  Copy, Eye, EyeOff, FileText, GripVertical, Image as ImageIcon, Laptop, LayoutTemplate,
  Library, Link2, Monitor, Plus, Redo2, Save, Smartphone, Tablet, Trash2, Type, Undo2,
  Video, X,
} from 'lucide-react';
import { ContentBlock, MediaAsset, PageContent } from '../../types';
import { detectMediaKind, extractDriveId, getMediaPreviewUrl, loadMediaLibrary, saveMediaLibrary } from '../../cms/media';
import { isFirebaseConfigured } from '../../lib/firebase';
import { deleteMediaAsset, saveMediaAsset, subscribeMediaAssets, uploadMediaFile } from '../../cms/firebaseRepository';
import { ProfessionalBlockRenderer } from '../cms/ProfessionalBlockRenderer';
import { deleteLocalFile, storeLocalFile, useMediaUrl } from '../../cms/localFiles';

interface Props {
  pages: PageContent[];
  onUpdatePage: (page: PageContent) => void;
  onOpenPublicSite: () => void;
}

const templates: Array<{ type: ContentBlock['type']; label: string; icon: React.ElementType; defaults: Partial<ContentBlock> }> = [
  { type: 'text', label: 'Texto', icon: Type, defaults: { title: 'Novo título', content: 'Escreva aqui o conteúdo da seção.' } },
  { type: 'image', label: 'Imagem', icon: ImageIcon, defaults: { title: 'Imagem em destaque', content: '', imageUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=1200' } },
  { type: 'columns', label: 'Texto + imagem', icon: LayoutTemplate, defaults: { title: 'Conteúdo em duas colunas', content: 'Conte a história deste projeto com simplicidade e proximidade.', imageUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=1200' } },
  { type: 'video', label: 'Vídeo', icon: Video, defaults: { title: 'Vídeo', content: '', mediaUrl: '' } },
  { type: 'gallery', label: 'Grade de imagens', icon: ImageIcon, defaults: { title: 'Galeria de imagens', content: '', images: [] } },
  { type: 'slideshow', label: 'Slide show', icon: ImageIcon, defaults: { title: 'Apresentação de imagens', content: '', images: [] } },
  { type: 'document', label: 'Documento/PDF', icon: FileText, defaults: { title: 'Documento', content: 'Consulte ou baixe o documento completo.', mediaUrl: '' } },
  { type: 'quote', label: 'Citação', icon: Type, defaults: { content: 'Cuidando das pessoas e do mundo.', caption: 'EFABE' } },
  { type: 'alert', label: 'Aviso', icon: Archive, defaults: { title: 'Informação importante', content: 'Digite aqui o aviso.' } },
  { type: 'button', label: 'Botão', icon: Link2, defaults: { content: '', buttonLabel: 'Saiba mais', buttonUrl: '#' } },
  { type: 'spacer', label: 'Espaçamento', icon: GripVertical, defaults: { content: '', style: { minHeight: 48 } } },
];

const defaultStyle = {
  backgroundColor: '#ffffff', textColor: '#1c1c18', accentColor: '#0f5238', textAlign: 'left' as const,
  width: 'content' as const, paddingY: 'md' as const, paddingX: 'md' as const, borderRadius: 'md' as const,
  shadow: 'none' as const, imageFit: 'cover' as const,
};

export const ProfessionalSiteBuilder: React.FC<Props> = ({ pages, onUpdatePage, onOpenPublicSite }) => {
  const [selectedSlug, setSelectedSlug] = useState(pages[0]?.slug || 'home');
  const sourcePage = useMemo(() => pages.find((page) => page.slug === selectedSlug) || pages[0], [pages, selectedSlug]);
  const [draft, setDraft] = useState<PageContent>(() => ({ ...sourcePage, blocks: sourcePage?.blocks || [], status: sourcePage?.status || 'draft' }));
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(draft.blocks?.[0]?.id || null);
  const [selectedHero, setSelectedHero] = useState(!draft.blocks?.length);
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [history, setHistory] = useState<PageContent[]>([]);
  const [future, setFuture] = useState<PageContent[]>([]);
  const [media, setMedia] = useState<MediaAsset[]>(loadMediaLibrary);
  const [showMedia, setShowMedia] = useState(false);
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaName, setMediaName] = useState('');
  const [mediaSearch, setMediaSearch] = useState('');
  const [saveState, setSaveState] = useState('');
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [mediaError, setMediaError] = useState('');

  useEffect(() => {
    if (!sourcePage) return;
    setDraft({ ...sourcePage, blocks: sourcePage.blocks || [], status: sourcePage.status || 'draft' });
    setSelectedBlockId(sourcePage.blocks?.[0]?.id || null);
    setSelectedHero(!sourcePage.blocks?.length);
    setHistory([]);
    setFuture([]);
  }, [sourcePage]);

  useEffect(() => saveMediaLibrary(media), [media]);

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    return subscribeMediaAssets(
      (cloudAssets) => {
        if (!cloudAssets.length) return;
        setMedia((localAssets) => {
          const byId = new Map(localAssets.map((asset) => [asset.id, asset]));
          cloudAssets.forEach((asset) => byId.set(asset.id, asset));
          return [...byId.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        });
      },
      () => setMediaError('Não foi possível sincronizar a biblioteca com o Firebase.'),
    );
  }, []);

  const selectedBlock = draft.blocks?.find((block) => block.id === selectedBlockId) || null;
  const snapshot = () => setHistory((items) => [...items.slice(-29), structuredClone(draft)]);
  const mutateDraft = (mutator: (page: PageContent) => PageContent) => {
    snapshot();
    setFuture([]);
    setDraft((page) => mutator(page));
  };
  const mutateBlock = (patch: Partial<ContentBlock>) => {
    if (!selectedBlockId) return;
    mutateDraft((page) => ({ ...page, blocks: (page.blocks || []).map((block) => block.id === selectedBlockId ? { ...block, ...patch } : block) }));
  };
  const mutateStyle = (patch: Partial<NonNullable<ContentBlock['style']>>) => {
    if (!selectedBlock) return;
    mutateBlock({ style: { ...defaultStyle, ...selectedBlock.style, ...patch } });
  };
  const addBlock = (template: typeof templates[number]) => {
    const block: ContentBlock = {
      id: `cms-${Date.now()}`,
      type: template.type,
      title: template.defaults.title,
      content: template.defaults.content || '',
      imageUrl: template.defaults.imageUrl,
      mediaUrl: template.defaults.mediaUrl,
      images: template.defaults.images,
      caption: template.defaults.caption,
      buttonLabel: template.defaults.buttonLabel,
      buttonUrl: template.defaults.buttonUrl,
      style: { ...defaultStyle, ...template.defaults.style },
    };
    mutateDraft((page) => ({ ...page, blocks: [...(page.blocks || []), block] }));
    setSelectedBlockId(block.id);
    setSelectedHero(false);
  };
  const deleteBlock = (block: ContentBlock) => {
    if (!window.confirm(`Excluir o elemento "${block.title || block.type}" desta página? Você poderá desfazer antes de salvar.`)) return;
    mutateDraft((page) => ({ ...page, blocks: (page.blocks || []).filter((item) => item.id !== block.id) }));
    if (selectedBlockId === block.id) setSelectedBlockId(null);
  };
  const moveBlock = (id: string, direction: -1 | 1) => {
    const blocks = [...(draft.blocks || [])];
    const index = blocks.findIndex((block) => block.id === id);
    const next = index + direction;
    if (index < 0 || next < 0 || next >= blocks.length) return;
    snapshot();
    [blocks[index], blocks[next]] = [blocks[next], blocks[index]];
    setDraft({ ...draft, blocks });
  };
  const dropBlock = (targetId: string) => {
    if (!draggedId || draggedId === targetId) return;
    const blocks = [...(draft.blocks || [])];
    const from = blocks.findIndex((block) => block.id === draggedId);
    const to = blocks.findIndex((block) => block.id === targetId);
    snapshot();
    const [moved] = blocks.splice(from, 1);
    blocks.splice(to, 0, moved);
    setDraft({ ...draft, blocks });
    setDraggedId(null);
  };
  const duplicateBlock = (block: ContentBlock) => {
    const copy = { ...structuredClone(block), id: `cms-${Date.now()}`, title: block.title ? `${block.title} — cópia` : undefined };
    const index = (draft.blocks || []).findIndex((item) => item.id === block.id);
    const blocks = [...(draft.blocks || [])];
    blocks.splice(index + 1, 0, copy);
    mutateDraft((page) => ({ ...page, blocks }));
    setSelectedBlockId(copy.id);
    setSelectedHero(false);
  };
  const undo = () => {
    const previous = history.at(-1);
    if (!previous) return;
    setFuture((items) => [structuredClone(draft), ...items]);
    setDraft(previous);
    setHistory((items) => items.slice(0, -1));
  };
  const redo = () => {
    const next = future[0];
    if (!next) return;
    setHistory((items) => [...items, structuredClone(draft)]);
    setDraft(next);
    setFuture((items) => items.slice(1));
  };
  const save = (publish = false) => {
    const next = { ...draft, status: publish ? 'published' as const : 'draft' as const, publishedAt: publish ? new Date().toISOString() : draft.publishedAt, updatedAt: new Date().toISOString().split('T')[0] };
    setDraft(next);
    onUpdatePage(next);
    setSaveState(publish ? 'Página publicada com sucesso.' : 'Rascunho salvo com sucesso.');
    window.setTimeout(() => setSaveState(''), 3500);
  };
  const addMedia = async () => {
    if (!mediaUrl.trim()) return;
    const kind = detectMediaKind(mediaUrl.trim());
    const asset: MediaAsset = { id: `asset-${Date.now()}`, name: mediaName.trim() || 'Mídia sem título', url: mediaUrl.trim(), kind, driveFileId: extractDriveId(mediaUrl.trim()) || undefined, createdAt: new Date().toISOString() };
    setMedia((items) => [asset, ...items]);
    if (isFirebaseConfigured) {
      try { await saveMediaAsset(asset); } catch { setMediaError('A mídia foi salva localmente, mas não sincronizou com o Firebase.'); }
    }
    setMediaName(''); setMediaUrl('');
  };
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setMediaError('');
    try {
      setUploadProgress(0);
      const id = `asset-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const uploaded = isFirebaseConfigured ? await uploadMediaFile(file, setUploadProgress) : { url: await storeLocalFile(file, id), path: 'neste navegador' };
      const kind = file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : file.type === 'application/pdf' ? 'pdf' : 'document';
      const asset: MediaAsset = { id, name: file.name, url: uploaded.url, kind, mimeType: file.type, description: `Arquivo armazenado em ${uploaded.path}`, createdAt: new Date().toISOString() };
      setMedia((items) => [asset, ...items]);
      if (isFirebaseConfigured) await saveMediaAsset(asset);
      if (selectedBlock && (selectedBlock.type === 'image' || selectedBlock.type === 'columns' || selectedBlock.type === 'video' || selectedBlock.type === 'document')) useAsset(asset);
      if (selectedBlock && (selectedBlock.type === 'gallery' || selectedBlock.type === 'slideshow') && kind === 'image') mutateBlock({ images: [...(selectedBlock.images || []), asset.url] });
      setUploadProgress(null);
    } catch {
      setUploadProgress(null);
      setMediaError('Não foi possível guardar o arquivo. Verifique o espaço disponível no navegador ou as regras do armazenamento online.');
    } finally {
      event.target.value = '';
    }
  };
  const removeAsset = async (asset: MediaAsset) => {
    setMedia((items) => items.filter((item) => item.id !== asset.id));
    if (asset.url.startsWith('local-media:')) await deleteLocalFile(asset.url);
    if (isFirebaseConfigured) {
      try { await deleteMediaAsset(asset.id); } catch { setMediaError('O item foi removido localmente, mas a exclusão na nuvem falhou.'); }
    }
  };
  const useAsset = (asset: MediaAsset) => {
    if (!selectedBlock) return;
    if (selectedBlock.type === 'gallery' || selectedBlock.type === 'slideshow') {
      if (asset.kind !== 'image') { setMediaError('Escolha uma imagem para este elemento.'); return; }
      mutateBlock({ images: [...(selectedBlock.images || []), asset.url] });
      setShowMedia(false);
      return;
    }
    mutateBlock({ mediaUrl: asset.url, imageUrl: asset.kind === 'image' || asset.kind === 'drive' ? getMediaPreviewUrl(asset) : selectedBlock.imageUrl, mediaType: asset.kind });
    setShowMedia(false);
  };
  const filteredMedia = media.filter((asset) => `${asset.name} ${asset.kind}`.toLowerCase().includes(mediaSearch.toLowerCase()));
  const canvasWidth = viewport === 'desktop' ? 'max-w-6xl' : viewport === 'tablet' ? 'max-w-[820px]' : 'max-w-[390px]';

  return <div className="bg-[#f6f3ec] border border-[#d9d1c3] rounded-3xl overflow-hidden shadow-earth-lg min-h-[760px]">
    <div className="bg-[#0f5238] text-white px-4 py-3 flex flex-wrap items-center justify-between gap-3 border-b border-emerald-950">
      <div className="flex items-center gap-3"><div className="w-10 h-10 bg-white rounded-xl p-1"><img src={`${import.meta.env.BASE_URL}logomarca.jpeg`} className="w-full h-full object-contain" /></div><div><h2 className="font-extrabold font-heading">Construtor Profissional EFABE</h2><p className="text-[11px] text-emerald-200">Editor visual • {isFirebaseConfigured ? 'Firebase conectado' : 'modo local seguro — Firebase aguardando configuração'}</p></div></div>
      <div className="flex items-center gap-1.5">
        <button onClick={undo} disabled={!history.length} className="cms-icon-button" title="Desfazer"><Undo2 size={16}/></button>
        <button onClick={redo} disabled={!future.length} className="cms-icon-button" title="Refazer"><Redo2 size={16}/></button>
        <div className="hidden sm:flex bg-emerald-950/50 rounded-xl p-1">
          {([['desktop', Monitor], ['tablet', Tablet], ['mobile', Smartphone]] as const).map(([mode, Icon]) => <button key={mode} onClick={() => setViewport(mode)} className={`p-2 rounded-lg ${viewport === mode ? 'bg-[#e9c46a] text-[#4a2810]' : 'text-emerald-100'}`}><Icon size={15}/></button>)}
        </div>
        <button onClick={() => save(false)} className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold flex gap-2"><Save size={15}/> Salvar</button>
        <button onClick={() => save(true)} className="px-3 py-2 rounded-xl bg-[#e9c46a] hover:bg-[#dda15e] text-[#4a2810] text-xs font-extrabold flex gap-2"><Check size={15}/> Publicar</button>
        <button onClick={onOpenPublicSite} className="cms-icon-button" title="Visualizar site"><Eye size={16}/></button>
      </div>
    </div>
    {saveState && <div className="px-4 py-2 bg-emerald-100 text-emerald-900 text-xs font-bold border-b border-emerald-200">{saveState}</div>}

    <div className="grid xl:grid-cols-[250px_minmax(0,1fr)_300px] min-h-[700px]">
      <aside className="bg-white border-r border-slate-200 p-3 space-y-4">
        <div><label className="cms-label">Página em edição</label><select value={selectedSlug} onChange={(e) => setSelectedSlug(e.target.value)} className="cms-input">{pages.map((page) => <option key={page.slug} value={page.slug}>{page.title}</option>)}</select></div>
        <div className="grid grid-cols-2 gap-2">{templates.map((template) => <button key={template.type} onClick={() => addBlock(template)} className="p-2.5 rounded-xl border border-slate-200 bg-[#fcf9f2] hover:border-emerald-500 hover:bg-emerald-50 text-left transition-colors"><template.icon size={17} className="text-emerald-700 mb-1"/><span className="text-[11px] font-bold text-slate-700">{template.label}</span></button>)}</div>
        <button onClick={() => setShowMedia(true)} className="w-full px-3 py-2.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs font-extrabold flex items-center gap-2"><Library size={16}/> Biblioteca de mídia</button>
        <div className="pt-3 border-t border-slate-200"><p className="cms-label">Estrutura da página</p><div className="space-y-1.5">
          <div className={`flex items-center gap-1 rounded-xl border ${selectedHero ? 'bg-emerald-50 border-emerald-400' : 'bg-white border-slate-200'}`}>
            <button onClick={() => { setSelectedHero(true); setSelectedBlockId(null); }} className="flex-1 min-w-0 p-2 text-left text-xs font-semibold">Cabeçalho da página</button>
            <button onClick={() => mutateDraft((page) => ({ ...page, showHero: page.showHero === false }))} className="p-2 text-slate-500 hover:text-emerald-800" title={draft.showHero === false ? 'Mostrar cabeçalho' : 'Ocultar cabeçalho'} aria-label={draft.showHero === false ? 'Mostrar cabeçalho' : 'Ocultar cabeçalho'}>{draft.showHero === false ? <EyeOff size={15}/> : <Eye size={15}/>}</button>
          </div>
          {(draft.blocks || []).map((block, index) => <div key={block.id} draggable onDragStart={() => setDraggedId(block.id)} onDragOver={(e) => e.preventDefault()} onDrop={() => dropBlock(block.id)} className={`flex items-center gap-1 rounded-xl border ${selectedBlockId === block.id ? 'bg-emerald-50 border-emerald-400' : 'bg-white border-slate-200'}`}><button onClick={() => { setSelectedBlockId(block.id); setSelectedHero(false); }} className="flex-1 min-w-0 flex items-center gap-2 p-2 text-left"><GripVertical size={14} className="text-slate-400 shrink-0"/><span className="text-[10px] font-bold text-slate-500">{index + 1}</span><span className="text-xs font-semibold truncate flex-1">{block.title || templates.find((item) => item.type === block.type)?.label || block.type}</span>{block.hidden && <EyeOff size={13}/>}</button><button onClick={() => deleteBlock(block)} className="p-2 text-slate-400 hover:text-red-700" title="Excluir elemento" aria-label={`Excluir ${block.title || block.type}`}><Trash2 size={15}/></button></div>)}
        </div></div>
      </aside>

      <main className="p-4 sm:p-6 overflow-auto bg-slate-200/60">
        <div className={`${canvasWidth} mx-auto bg-white min-h-[620px] shadow-xl transition-all duration-300 overflow-hidden`} style={{ background: draft.pageBackground || '#fcf9f2' }}>
          {draft.showHero !== false && <div onClick={() => { setSelectedHero(true); setSelectedBlockId(null); }} className="relative min-h-52 flex items-end bg-slate-800 overflow-hidden cursor-pointer"><img src={draft.heroImage} className="absolute inset-0 w-full h-full object-cover opacity-55"/><div className="relative p-7 text-white"><p className="text-xs font-bold text-amber-300 uppercase tracking-wider">{draft.subtitle}</p><h1 className="text-3xl font-extrabold font-heading mt-1">{draft.title}</h1><p className="text-sm mt-2 max-w-2xl text-white/85">{draft.heroText}</p></div><button onClick={(event) => { event.stopPropagation(); mutateDraft((page) => ({ ...page, showHero: false })); }} className="absolute top-3 right-3 z-10 px-3 py-1.5 bg-white text-emerald-950 rounded-lg text-xs font-bold shadow" title="Ocultar cabeçalho"><EyeOff size={14} className="inline mr-1"/>Ocultar</button></div>}
          <div className="p-4 sm:p-6 space-y-3">
            {(draft.blocks || []).map((block) => <div key={block.id} onClick={() => { setSelectedBlockId(block.id); setSelectedHero(false); }} className={`group relative border-2 rounded-2xl transition-colors ${selectedBlockId === block.id ? 'border-emerald-500' : 'border-transparent hover:border-emerald-200'} ${block.hidden ? 'opacity-45' : ''}`}>
              <div className="absolute -top-3 right-2 z-10 flex bg-white border border-slate-200 rounded-lg shadow-md overflow-hidden"><button onClick={(e) => {e.stopPropagation(); moveBlock(block.id,-1)}} className="p-1.5" title="Mover para cima"><ArrowUp size={13}/></button><button onClick={(e) => {e.stopPropagation(); moveBlock(block.id,1)}} className="p-1.5" title="Mover para baixo"><ArrowDown size={13}/></button><button onClick={(e) => {e.stopPropagation(); duplicateBlock(block)}} className="p-1.5" title="Duplicar"><Copy size={13}/></button><button onClick={(e) => {e.stopPropagation(); deleteBlock(block)}} className="p-1.5 text-red-700" title="Excluir elemento" aria-label={`Excluir ${block.title || block.type}`}><Trash2 size={13}/></button></div>
              <ProfessionalBlockRenderer block={block} editorMode />
            </div>)}
            {!draft.blocks?.length && <div className="py-24 text-center border-2 border-dashed border-emerald-200 rounded-3xl text-slate-500"><Plus className="mx-auto mb-2 text-emerald-600"/><p className="font-bold">Adicione o primeiro bloco pelo painel lateral.</p></div>}
          </div>
        </div>
      </main>

      <aside className="bg-white border-l border-slate-200 p-4 overflow-y-auto">
        {selectedHero ? <div className="space-y-4"><h3 className="font-extrabold text-emerald-950">Cabeçalho da página</h3><p className="text-xs text-slate-500">Personalize o título e a imagem ou oculte esta seção.</p><label className="cms-label">Título</label><input value={draft.title} onChange={(event) => mutateDraft((page) => ({ ...page, title: event.target.value }))} className="cms-input"/><label className="cms-label">Subtítulo</label><input value={draft.subtitle} onChange={(event) => mutateDraft((page) => ({ ...page, subtitle: event.target.value }))} className="cms-input"/><label className="cms-label">Texto de destaque</label><textarea value={draft.heroText} onChange={(event) => mutateDraft((page) => ({ ...page, heroText: event.target.value }))} className="cms-input min-h-20"/><label className="cms-label">URL da imagem</label><input value={draft.heroImage} onChange={(event) => mutateDraft((page) => ({ ...page, heroImage: event.target.value }))} className="cms-input"/><button onClick={() => mutateDraft((page) => ({ ...page, showHero: page.showHero === false }))} className="cms-secondary-button w-full">{draft.showHero === false ? <Eye size={15}/> : <EyeOff size={15}/>} {draft.showHero === false ? 'Mostrar cabeçalho' : 'Ocultar cabeçalho'}</button></div> : !selectedBlock ? <div className="text-center py-16 text-slate-400"><ChevronLeft className="mx-auto"/><p className="text-xs mt-2">Selecione um bloco para personalizá-lo.</p></div> : <div className="space-y-4">
          <div className="flex items-center justify-between"><div><p className="cms-label">Elemento selecionado</p><h3 className="font-extrabold capitalize">{templates.find((item) => item.type === selectedBlock.type)?.label || selectedBlock.type}</h3></div><button onClick={() => mutateBlock({hidden: !selectedBlock.hidden})} className="cms-icon-button-light">{selectedBlock.hidden ? <EyeOff size={16}/> : <Eye size={16}/>}</button></div>
          {selectedBlock.type !== 'spacer' && selectedBlock.type !== 'button' && <><div><label className="cms-label">Título</label><input value={selectedBlock.title || ''} onChange={(e) => mutateBlock({title:e.target.value})} className="cms-input"/></div><div><label className="cms-label">Conteúdo / descrição</label><textarea value={selectedBlock.content} onChange={(e) => mutateBlock({content:e.target.value})} className="cms-input min-h-28"/></div></>}
          {['image','video','document','columns'].includes(selectedBlock.type) && <div><label className="cms-label">URL da mídia</label><div className="flex gap-1"><input value={selectedBlock.mediaUrl || selectedBlock.imageUrl || ''} onChange={(e) => mutateBlock({mediaUrl:e.target.value, imageUrl:selectedBlock.type === 'image' || selectedBlock.type === 'columns' ? e.target.value : selectedBlock.imageUrl})} className="cms-input"/><button onClick={() => setShowMedia(true)} className="cms-icon-button-light"><Library size={16}/></button></div></div>}
          {['gallery','slideshow'].includes(selectedBlock.type) && <div className="space-y-2"><label className="cms-label">Imagens ({selectedBlock.images?.length || 0})</label><button onClick={() => setShowMedia(true)} className="cms-secondary-button w-full"><Plus size={14}/> Adicionar imagens</button>{(selectedBlock.images || []).map((url, index) => <div key={`${url}-${index}`} className="flex items-center gap-1 text-xs"><span className="flex-1 truncate">{index + 1}. {media.find((asset) => asset.url === url)?.name || url}</span><button title="Mover acima" disabled={index === 0} onClick={() => { const images = [...(selectedBlock.images || [])]; [images[index - 1], images[index]] = [images[index], images[index - 1]]; mutateBlock({ images }); }}><ArrowUp size={14}/></button><button title="Mover abaixo" disabled={index === (selectedBlock.images?.length || 0) - 1} onClick={() => { const images = [...(selectedBlock.images || [])]; [images[index + 1], images[index]] = [images[index], images[index + 1]]; mutateBlock({ images }); }}><ArrowDown size={14}/></button><button title="Remover da galeria" onClick={() => mutateBlock({ images: (selectedBlock.images || []).filter((_, itemIndex) => itemIndex !== index) })}><Trash2 size={14}/></button></div>)}</div>}
          {selectedBlock.type === 'button' && <><div><label className="cms-label">Texto do botão</label><input value={selectedBlock.buttonLabel || ''} onChange={(e) => mutateBlock({buttonLabel:e.target.value})} className="cms-input"/></div><div><label className="cms-label">Destino</label><input value={selectedBlock.buttonUrl || ''} onChange={(e) => mutateBlock({buttonUrl:e.target.value})} className="cms-input"/></div></>}
          <div className="pt-3 border-t border-slate-200 space-y-3"><p className="cms-label">Aparência</p><div className="grid grid-cols-2 gap-2"><label className="text-[10px] font-bold">Fundo<input type="color" value={selectedBlock.style?.backgroundColor || '#ffffff'} onChange={(e) => mutateStyle({backgroundColor:e.target.value})} className="block w-full h-9 mt-1"/></label><label className="text-[10px] font-bold">Texto<input type="color" value={selectedBlock.style?.textColor || '#1c1c18'} onChange={(e) => mutateStyle({textColor:e.target.value})} className="block w-full h-9 mt-1"/></label></div>
          <div className="flex bg-slate-100 rounded-xl p-1">{([['left',AlignLeft],['center',AlignCenter],['right',AlignRight]] as const).map(([align,Icon])=><button key={align} onClick={()=>mutateStyle({textAlign:align})} className={`flex-1 p-2 rounded-lg ${selectedBlock.style?.textAlign===align?'bg-white shadow-sm text-emerald-700':''}`}><Icon size={15} className="mx-auto"/></button>)}</div>
          <div><label className="cms-label">Espaçamento vertical</label><select value={selectedBlock.style?.paddingY || 'md'} onChange={(e)=>mutateStyle({paddingY:e.target.value as any})} className="cms-input"><option value="none">Nenhum</option><option value="sm">Pequeno</option><option value="md">Médio</option><option value="lg">Grande</option><option value="xl">Extra grande</option></select></div>
          <div><label className="cms-label">Cantos</label><select value={selectedBlock.style?.borderRadius || 'md'} onChange={(e)=>mutateStyle({borderRadius:e.target.value as any})} className="cms-input"><option value="none">Retos</option><option value="sm">Suaves</option><option value="md">Arredondados</option><option value="lg">Muito arredondados</option><option value="pill">Pílula</option></select></div></div>
          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-200"><button onClick={() => duplicateBlock(selectedBlock)} className="cms-secondary-button"><Copy size={14}/> Duplicar</button><button onClick={() => deleteBlock(selectedBlock)} className="cms-danger-button"><Trash2 size={14}/> Excluir</button></div>
        </div>}
      </aside>
    </div>

    {showMedia && <div className="fixed inset-0 z-[70] bg-slate-950/70 backdrop-blur-sm p-4 flex items-center justify-center"><div className="bg-white rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl"><div className="p-5 bg-[#0f5238] text-white flex justify-between"><div><h3 className="font-extrabold text-lg">Biblioteca profissional de mídia</h3><p className="text-xs text-emerald-200">Google Drive, YouTube, PDF, documentos, imagens e vídeos</p></div><button onClick={()=>setShowMedia(false)}><X/></button></div><div className="p-5 grid lg:grid-cols-[280px_1fr] gap-5 overflow-y-auto max-h-[75vh]"><div className="space-y-3"><h4 className="font-extrabold">Adicionar mídia</h4><label className="w-full px-4 py-3 border-2 border-dashed border-emerald-300 bg-emerald-50 text-emerald-900 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"><Plus size={15}/>{uploadProgress === null ? 'Enviar arquivo' : `Enviando ${uploadProgress}%`}<input type="file" className="hidden" accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.txt" onChange={handleFileUpload} disabled={uploadProgress !== null}/></label>{uploadProgress !== null && <div className="h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-emerald-600 transition-all" style={{width:`${uploadProgress}%`}}/></div>}<div className="relative py-1 text-center text-[10px] font-bold text-slate-400">OU USE UM LINK</div><input value={mediaName} onChange={(e)=>setMediaName(e.target.value)} placeholder="Nome da mídia" className="cms-input"/><textarea value={mediaUrl} onChange={(e)=>setMediaUrl(e.target.value)} placeholder="Cole a URL do Google Drive, YouTube, PDF ou imagem" className="cms-input min-h-24"/><button onClick={addMedia} className="w-full px-4 py-2.5 bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2"><Plus size={15}/> Adicionar à biblioteca</button>{mediaError && <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-[11px] text-red-800">{mediaError}</div>}<div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900">No modo local, os arquivos ficam somente neste navegador. Para compartilhar e publicar online, configure o Firebase. Links do Drive precisam estar compartilhados.</div></div><div><input value={mediaSearch} onChange={(e)=>setMediaSearch(e.target.value)} placeholder="Pesquisar na biblioteca..." className="cms-input mb-3"/><div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">{filteredMedia.map((asset)=><div key={asset.id} className="group relative text-left border border-slate-200 rounded-2xl overflow-hidden hover:border-emerald-500 bg-white"><button onClick={()=>useAsset(asset)} className="w-full text-left"><div className="h-32 bg-slate-100 flex items-center justify-center overflow-hidden">{['image','youtube','drive'].includes(asset.kind)?<MediaThumbnail url={getMediaPreviewUrl(asset)}/>:<FileText size={38} className="text-slate-400"/>}</div><div className="p-3"><div className="text-[9px] font-extrabold uppercase text-emerald-700">{asset.kind}</div><div className="text-xs font-bold truncate">{asset.name}</div></div></button><button onClick={()=>removeAsset(asset)} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1.5 bg-red-600 text-white rounded-lg shadow"><Trash2 size={13}/></button></div>)}{!filteredMedia.length&&<div className="col-span-full py-16 text-center text-slate-400"><Library className="mx-auto mb-2"/><p className="text-xs">A biblioteca ainda está vazia.</p></div>}</div></div></div></div></div>}
  </div>;
};

const MediaThumbnail: React.FC<{ url: string }> = ({ url }) => {
  const resolved = useMediaUrl(url);
  return resolved ? <img src={resolved} alt="Miniatura da mídia" className="w-full h-full object-cover" /> : <ImageIcon size={38} className="text-slate-400" />;
};
