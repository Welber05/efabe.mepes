import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { MenuItem } from '../../types';
import { MAX_MENU_LEVEL, menuChildren } from '../../menu/hierarchy';

interface Props {
  items: MenuItem[];
  parentId: string;
  level?: number;
  variant: 'dropdown' | 'mega' | 'mobile';
  activeSlug: string;
  onNavigate: (slug: string) => void;
  icon?: (slug: string) => React.ReactNode;
}

export const MenuBranch: React.FC<Props> = ({ items, parentId, level = 2, variant, activeSlug, onNavigate, icon }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  if (level > MAX_MENU_LEVEL) return null;
  const children = menuChildren(items, parentId, true);
  if (!children.length) return null;

  return <div className={variant === 'dropdown' ? 'py-1' : 'space-y-1 border-l-2 border-emerald-200 pl-2 ml-1'}>
    {children.map((item) => {
      const descendants = level < MAX_MENU_LEVEL ? menuChildren(items, item.id, true) : [];
      const hasChildren = descendants.length > 0;
      const expanded = expandedId === item.id;
      return <div key={item.id} className="relative" onMouseEnter={variant === 'dropdown' ? () => setExpandedId(item.id) : undefined} onMouseLeave={variant === 'dropdown' ? () => setExpandedId(null) : undefined}>
        <div className={`flex items-center rounded-lg ${activeSlug === item.slug ? 'bg-emerald-100 text-emerald-950 font-extrabold' : 'text-slate-700 hover:bg-emerald-50'}`}>
          <button type="button" onClick={() => onNavigate(item.slug)} className={`min-w-0 flex-1 text-left flex items-center gap-2 ${variant === 'dropdown' ? 'px-3 py-2 text-xs' : variant === 'mobile' ? 'px-2 py-2 text-xs' : 'px-1.5 py-1 text-[11px]'}`}>
            {level === 2 && icon?.(item.slug)}<span className="truncate" title={item.label}>{item.label}</span>
          </button>
          {hasChildren && <button type="button" aria-label={`${expanded ? 'Recolher' : 'Expandir'} submenus de ${item.label}`} aria-expanded={variant === 'dropdown' ? expanded : true} onClick={() => setExpandedId(expanded ? null : item.id)} className="p-2 text-emerald-800"><ChevronRight size={14} className={variant === 'dropdown' && !expanded ? '' : 'rotate-90'} /></button>}
        </div>
        {hasChildren && (variant !== 'dropdown' || expanded) && <div className={variant === 'dropdown' ? 'absolute left-full top-0 w-56 rounded-xl border border-slate-200 bg-white shadow-xl z-[60]' : 'mt-1'}>
          <MenuBranch items={items} parentId={item.id} level={level + 1} variant={variant} activeSlug={activeSlug} onNavigate={onNavigate} icon={icon} />
        </div>}
      </div>;
    })}
  </div>;
};
