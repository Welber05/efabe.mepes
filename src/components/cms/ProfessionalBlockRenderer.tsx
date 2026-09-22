import React, { useState } from 'react';
import { AlertTriangle, ExternalLink, FileText, Play, Quote } from 'lucide-react';
import { ContentBlock } from '../../types';
import { extractDriveId, extractYouTubeId } from '../../cms/media';
import { RichTextRenderer } from '../common/RichTextRenderer';
import { useMediaUrl } from '../../cms/localFiles';

interface Props {
  block: ContentBlock;
  editorMode?: boolean;
}

const paddingY = { none: 'py-0', sm: 'py-3', md: 'py-6', lg: 'py-10', xl: 'py-16' };
const paddingX = { none: 'px-0', sm: 'px-3', md: 'px-6', lg: 'px-10' };
const radius = { none: 'rounded-none', sm: 'rounded-lg', md: 'rounded-2xl', lg: 'rounded-3xl', pill: 'rounded-full' };
const shadow = { none: '', sm: 'shadow-sm', md: 'shadow-md', lg: 'shadow-xl' };

export const ProfessionalBlockRenderer: React.FC<Props> = ({ block, editorMode = false }) => {
  const style = block.style || {};
  const className = [
    paddingY[style.paddingY || 'md'],
    paddingX[style.paddingX || 'md'],
    radius[style.borderRadius || 'md'],
    shadow[style.shadow || 'none'],
    style.textAlign === 'center' ? 'text-center' : style.textAlign === 'right' ? 'text-right' : 'text-left',
    editorMode ? 'min-h-[72px]' : '',
  ].join(' ');
  const inlineStyle: React.CSSProperties = {
    backgroundColor: style.backgroundColor || undefined,
    color: style.textColor || undefined,
    minHeight: style.minHeight || undefined,
  };
  const mediaUrl = useMediaUrl(block.mediaUrl || block.imageUrl || '');
  const [slideIndex, setSlideIndex] = useState(0);

  if (block.type === 'spacer') {
    return <div className="w-full" style={{ height: style.minHeight || 48 }} aria-hidden="true" />;
  }

  return (
    <section className={className} style={inlineStyle}>
      {block.type === 'text' && <>
        {block.title && <h2 className="text-2xl font-extrabold mb-3 font-heading">{block.title}</h2>}
        <RichTextRenderer content={block.content} />
      </>}

      {block.type === 'image' && <figure className="space-y-3">
        {mediaUrl && <img src={mediaUrl} alt={block.caption || block.title || ''} className={`w-full max-h-[620px] ${style.imageFit === 'contain' ? 'object-contain' : 'object-cover'} rounded-2xl`} />}
        {(block.title || block.caption || block.content) && <figcaption>
          {block.title && <h3 className="font-extrabold text-lg">{block.title}</h3>}
          <p className="text-sm opacity-75">{block.caption || block.content}</p>
        </figcaption>}
      </figure>}

      {block.type === 'gallery' && <div className="space-y-4">
        {block.title && <h2 className="text-2xl font-extrabold font-heading">{block.title}</h2>}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">{(block.images || []).map((url, index) => <GalleryImage key={`${url}-${index}`} url={url} alt={`${block.title || 'Galeria'} ${index + 1}`} />)}</div>
        {!block.images?.length && editorMode && <p className="text-sm text-slate-500">Adicione imagens pelo painel lateral.</p>}
      </div>}

      {block.type === 'slideshow' && <div className="space-y-4">
        {block.title && <h2 className="text-2xl font-extrabold font-heading">{block.title}</h2>}
        {!!block.images?.length && <><GalleryImage url={block.images[slideIndex % block.images.length]} alt={`${block.title || 'Slide'} ${slideIndex + 1}`} large /><div className="flex items-center justify-center gap-3"><button type="button" onClick={(event) => { event.stopPropagation(); setSlideIndex((slideIndex - 1 + block.images!.length) % block.images!.length); }} className="px-3 py-1 rounded-lg bg-emerald-700 text-white">Anterior</button><span className="text-sm">{slideIndex % block.images.length + 1} / {block.images.length}</span><button type="button" onClick={(event) => { event.stopPropagation(); setSlideIndex((slideIndex + 1) % block.images!.length); }} className="px-3 py-1 rounded-lg bg-emerald-700 text-white">Próxima</button></div></>}
        {!block.images?.length && editorMode && <p className="text-sm text-slate-500">Adicione imagens pelo painel lateral.</p>}
      </div>}

      {block.type === 'video' && (() => {
        const youtubeId = extractYouTubeId(mediaUrl);
        return <div className="space-y-3">
          {block.title && <h3 className="font-extrabold text-xl flex items-center gap-2"><Play size={20} />{block.title}</h3>}
          <div className="aspect-video overflow-hidden rounded-2xl bg-slate-950">
            {youtubeId ? <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${youtubeId}`} title={block.title || 'Vídeo'} allowFullScreen /> : <video className="w-full h-full" src={mediaUrl} controls />}
          </div>
          {block.content && <p className="text-sm opacity-75">{block.content}</p>}
        </div>;
      })()}

      {block.type === 'document' && (() => {
        const driveId = extractDriveId(mediaUrl);
        const previewUrl = driveId ? `https://drive.google.com/file/d/${driveId}/preview` : mediaUrl;
        return <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div><h3 className="font-extrabold text-lg flex items-center gap-2"><FileText size={20} />{block.title || 'Documento'}</h3>{block.content && <p className="text-sm opacity-75">{block.content}</p>}</div>
            <a href={mediaUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold flex gap-2 items-center">Abrir <ExternalLink size={14} /></a>
          </div>
          {previewUrl && <iframe src={previewUrl} title={block.title || 'Documento'} className="w-full h-[520px] rounded-2xl border border-slate-200 bg-white" />}
        </div>;
      })()}

      {block.type === 'quote' && <blockquote className="relative text-lg sm:text-xl italic font-semibold">
        <Quote className="opacity-20 absolute -top-2 -left-1" size={42} />
        <span className="relative">“{block.content}”</span>
        {(block.caption || block.title) && <footer className="mt-3 text-sm not-italic opacity-70">— {block.caption || block.title}</footer>}
      </blockquote>}

      {block.type === 'alert' && <div className="flex gap-3"><AlertTriangle className="shrink-0" style={{ color: style.accentColor || '#d97706' }} /><div>{block.title && <h3 className="font-extrabold">{block.title}</h3>}<p className="text-sm">{block.content}</p></div></div>}

      {block.type === 'features' && <div>{block.title && <h2 className="text-2xl font-extrabold mb-3">{block.title}</h2>}<RichTextRenderer content={block.content} /></div>}

      {block.type === 'button' && <a href={block.buttonUrl || '#'} target={block.openInNewTab ? '_blank' : undefined} rel={block.openInNewTab ? 'noopener noreferrer' : undefined} className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl">{block.buttonLabel || block.title || 'Saiba mais'} <ExternalLink size={15} /></a>}

      {block.type === 'columns' && <div className="grid md:grid-cols-2 gap-6"><RichTextRenderer content={block.content} />{mediaUrl && <img src={mediaUrl} alt={block.caption || ''} className="w-full h-full max-h-96 object-cover rounded-2xl" />}</div>}
    </section>
  );
};

const GalleryImage: React.FC<{ url: string; alt: string; large?: boolean }> = ({ url, alt, large }) => {
  const resolved = useMediaUrl(url);
  return resolved ? <img src={resolved} alt={alt} className={`w-full object-cover rounded-2xl ${large ? 'h-64 md:h-[460px]' : 'h-36 md:h-56'}`} /> : <div className="rounded-2xl bg-slate-100 h-36" />;
};
