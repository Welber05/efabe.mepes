import React, { useRef, useState } from 'react';
import { User, MenuItem, SiteHeaderFooterSettings } from '../types';
import { canAccess, canAccessAdmin } from '../auth/access';
import { publicAssetUrl } from '../lib/publicAsset';
import { MenuBranch } from './menu/MenuBranch';
import { menuDescendantIds } from '../menu/hierarchy';
import { 
  GraduationCap, 
  UserCheck, 
  LogIn, 
  LogOut, 
  BookOpen, 
  Camera, 
  Bell, 
  ShieldCheck, 
  Users, 
  Home, 
  PhoneCall, 
  Menu, 
  X,
  ChevronDown,
  Globe,
  FileText,
  FolderOpen,
  Sliders
} from 'lucide-react';

interface HeaderProps {
  currentUser: User | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenLogin: () => void;
  onLogout: () => void;
  menuItems: MenuItem[];
  siteSettings?: SiteHeaderFooterSettings;
  onGoToAdmin?: (tabSlug: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  activeTab,
  setActiveTab,
  onOpenLogin,
  onLogout,
  menuItems,
  siteSettings,
  onGoToAdmin,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [hoveredMenuPath, setHoveredMenuPath] = useState<string[]>([]);
  const [flyoutTops, setFlyoutTops] = useState<number[]>([]);
  const menuBodyRef = useRef<HTMLDivElement>(null);

  // Fallback defaults
  const settings = siteSettings || {
    schoolAcronym: 'EFABE',
    schoolBadge: 'EFA',
    schoolName: 'Escola Família Agrícola de Boa Esperança',
    headerSlogan: 'Um sonho realizado há 40 anos!',
    topBannerAnnouncement: 'EFABE - Escola Família Agrícola de Boa Esperança',
    headerQuote: '🌻 "cuidando das pessoas e do mundo"',
    logoUrl: '/logomarca.jpeg',
    footerAboutText: '',
    footerSlogan: '',
    footerAddress: '',
    footerPhone: '',
    footerEmail: '',
    footerWebsite: '',
    footerCopyright: '',
    footerUnitsText: '',
    footerCoursesList: [],
  };

  // Filter visible top-level items and sort by order
  const topLevelMenuItems = menuItems
    .filter((m) => !m.parentId && m.visible)
    .sort((a, b) => a.order - b.order);

  const getSubMenuItems = (parentId: string) => {
    return menuItems
      .filter((m) => m.parentId === parentId && m.visible)
      .sort((a, b) => a.order - b.order);
  };

  const menuColumns: MenuItem[][] = [topLevelMenuItems];
  for (const id of hoveredMenuPath.slice(0, 4)) {
    const children = getSubMenuItems(id);
    if (!children.length) break;
    menuColumns.push(children);
  }

  const revealMenuChildren = (item: MenuItem, depth: number, row: HTMLElement) => {
    setHoveredMenuPath((path) => path[depth] === item.id && path.length === depth + 1 ? path : [...path.slice(0, depth), item.id]);
    const body = menuBodyRef.current;
    const children = getSubMenuItems(item.id);
    if (!body || !children.length) return;
    const bodyTop = body.getBoundingClientRect().top;
    const rowTop = row.getBoundingClientRect().top - bodyTop;
    const estimatedHeight = Math.min(420, children.length * 34 + 16);
    const availableHeight = window.innerHeight - bodyTop - 12;
    const top = Math.max(0, Math.min(rowTop, availableHeight - estimatedHeight));
    setFlyoutTops((tops) => tops[depth] === top ? tops : [...tops.slice(0, depth), top]);
  };

  const getMenuIcon = (slug: string) => {
    switch (slug) {
      case 'home':
        return <Home size={16} />;
      case 'about':
        return <BookOpen size={16} />;
      case 'courses':
        return <GraduationCap size={16} />;
      case 'notices':
        return <Bell size={16} />;
      case 'routine':
      case 'acervo-galeria':
        return <Camera size={16} />;
      case 'acervo':
      case 'acervo-documentos':
        return <FolderOpen size={16} />;
      case 'contact':
        return <PhoneCall size={16} />;
      default:
        return <FileText size={16} />;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-xs px-2.5 py-0.5 rounded-full font-medium"><ShieldCheck size={12} /> Admin (Gestor)</span>;
      case 'teacher':
        return <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full font-medium"><BookOpen size={12} /> Professor(a)</span>;
      case 'parent':
        return <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-xs px-2.5 py-0.5 rounded-full font-medium"><Users size={12} /> Pai / Responsável</span>;
      default:
        return null;
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-emerald-100 shadow-xs">
      {/* Top Banner Bar */}
      <div className="bg-[#0f5238] text-emerald-50 text-xs py-2 px-4 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-3">
            <span className="font-extrabold tracking-wide text-[#e9c46a] flex items-center gap-1.5 text-sm font-heading">
              <GraduationCap size={16} /> {settings.topBannerAnnouncement}
            </span>
            {settings.headerSlogan && (
              <span className="hidden sm:inline border-l border-emerald-800/60 pl-3 text-emerald-200/90 text-[11px] font-body">
                {settings.headerSlogan}
              </span>
            )}
          </div>

          <div className="flex items-center gap-4">
            {settings.headerQuote && (
              <span className="hidden md:inline text-[#f6f3ec] text-[11px] font-medium bg-[#1b4332] px-2.5 py-0.5 rounded-full border border-emerald-700/50">
                {settings.headerQuote}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => setActiveTab('home')} 
            className="flex items-center gap-3.5 cursor-pointer group py-2"
          >
            <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-white shadow-md border-2 border-[#e9c46a] group-hover:scale-105 transition-transform flex items-center justify-center p-0.5">
              <img 
                src={publicAssetUrl(settings.logoUrl)} 
                alt={settings.schoolName} 
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-[#1c1c18] font-heading group-hover:text-[#0f5238] transition-colors">
                  {settings.schoolAcronym}
                </span>
                {settings.schoolBadge && (
                  <span className="bg-[#e9c46a]/30 text-[#765a05] text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-[#e9c46a]/60 font-heading">
                    {settings.schoolBadge}
                  </span>
                )}
              </div>
              <p className="text-xs text-[#404943] font-medium font-body">
                {settings.schoolName}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Cluster: Green Home Button (Left) + CMS Menu Items (Middle) + 3-Lines Menu (Right) */}
          <div className="hidden lg:flex items-center gap-2">
            {/* 1. Botão Verde (Casinha com Girassol) à ESQUERDA */}
            <button
              onClick={() => setActiveTab('home')}
              title="Home page"
              aria-label="Home page"
              className="relative group bg-[#006837] hover:bg-[#0f5238] active:scale-95 text-white px-3 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer border border-emerald-600/60 shrink-0"
            >
              <div className="relative flex items-center justify-center">
                <Home size={19} className="text-white shrink-0 stroke-[2.2]" />
                <span className="text-base leading-none select-none -ml-1 -mb-0.5 filter drop-shadow-xs">🌻</span>
              </div>

              {/* Hover Legend / Tooltip */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1 bg-slate-900 text-white text-[11px] font-bold rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-lg z-50">
                Home page
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-b-slate-900" />
              </div>
            </button>

            {/* 2. Links direcionais fixados no meio da faixa branca: Quem Somos, Acervo, Contato */}
            <nav className="flex items-center gap-1 font-body">
              {(() => {
                const inlineTargets = [
                  { slug: 'about', label: 'Quem Somos' },
                  { slug: 'acervo', label: 'Acervo' },
                  { slug: 'contact', label: 'Contato' },
                ];

                return inlineTargets.map((target) => {
                  const cmsItem = topLevelMenuItems.find(
                    (m) =>
                      m.slug.toLowerCase() === target.slug.toLowerCase() ||
                      m.label.toLowerCase().includes(target.label.toLowerCase()) ||
                      (target.slug === 'about' && (m.slug === 'about' || m.slug === 'quem-somos')) ||
                      (target.slug === 'notices' && (m.slug === 'notices' || m.slug === 'comunicados')) ||
                      (target.slug === 'acervo' && (m.slug === 'acervo')) ||
                      (target.slug === 'contact' && (m.slug === 'contact' || m.slug === 'contato'))
                  );

                  const label = cmsItem ? cmsItem.label : target.label;
                  const slug = cmsItem ? cmsItem.slug : target.slug;
                  const itemId = cmsItem ? cmsItem.id : target.slug;
                  const subItems = cmsItem ? getSubMenuItems(cmsItem.id) : [];
                  const hasSub = subItems.length > 0;
                  const isSubActive = cmsItem ? [...menuDescendantIds(menuItems, cmsItem.id)].some((id) => menuItems.find((item) => item.id === id)?.slug === activeTab) : false;

                  if (hasSub) {
                    return (
                      <div key={itemId} className="relative group">
                        <button
                          onClick={() => setActiveTab(slug)}
                          className={`px-3 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                            activeTab === slug || isSubActive
                              ? 'bg-emerald-100/90 text-[#0f5238] font-extrabold shadow-xs border border-emerald-200'
                              : 'text-slate-700 hover:text-[#0f5238] hover:bg-emerald-50/80'
                          }`}
                        >
                          {getMenuIcon(slug)}
                          <span>{label}</span>
                          <ChevronDown size={14} className="text-slate-400 group-hover:text-emerald-700 transition-transform group-hover:rotate-180" />
                        </button>

                        {/* Submenu Dropdown */}
                        <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-150 transform origin-top-left group-hover:translate-y-0 translate-y-1 z-50">
                          <div className="px-3.5 py-1 text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider border-b border-slate-100 mb-1 font-heading">
                            {label}
                          </div>
                          <MenuBranch items={menuItems} parentId={itemId} variant="dropdown" activeSlug={activeTab} onNavigate={setActiveTab} icon={getMenuIcon} />
                        </div>
                      </div>
                    );
                  }

                  return (
                    <button
                      key={itemId}
                      onClick={() => setActiveTab(slug)}
                      className={`px-3 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        activeTab === slug
                          ? 'bg-emerald-100/90 text-[#0f5238] font-extrabold shadow-xs border border-emerald-200'
                          : 'text-slate-700 hover:text-[#0f5238] hover:bg-emerald-50/80'
                      }`}
                    >
                      {getMenuIcon(slug)}
                      <span>{label}</span>
                    </button>
                  );
                });
              })()}
            </nav>

            {/* 3. Menu Completo (Três Linhas Empilhadas) à DIREITA */}
            <div className="relative group shrink-0" onMouseLeave={() => setHoveredMenuPath([])}>
              <button
                onClick={() => { setMegaMenuOpen(!megaMenuOpen); setHoveredMenuPath([]); }}
                className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer border shadow-xs ${
                  megaMenuOpen
                    ? 'bg-[#006837] text-white border-emerald-700 ring-2 ring-emerald-500'
                    : 'bg-slate-100 text-slate-800 hover:bg-emerald-50 hover:text-[#0f5238] border-slate-200 hover:border-emerald-300'
                }`}
                title="Menu Completo do Site"
                aria-label="Abrir Menu Completo"
              >
                <Menu size={20} className="stroke-[2.5]" />
                <span className="text-xs font-extrabold tracking-wide uppercase font-heading">Menu</span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${megaMenuOpen ? 'rotate-180' : 'group-hover:rotate-180'}`} />
              </button>

              {/* Mega-Menu Panel on Hover or Click */}
              <div className={`absolute top-full right-0 mt-2 w-[300px] bg-white rounded-3xl shadow-2xl border border-slate-200/90 p-5 z-50 transition-opacity duration-200 ${
                megaMenuOpen
                  ? 'opacity-100 pointer-events-auto translate-y-0'
                  : 'opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto translate-y-1'
              }`}>
                {/* Header of Mega Menu */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-emerald-100 text-[#0f5238] rounded-xl">
                      <Menu size={18} />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900 font-heading">Menu Completo do Site</h3>
                      <p className="text-[11px] text-slate-500">Navegue por todas as seções e páginas da EFABE</p>
                    </div>
                  </div>
                </div>

                {/* Only the first level appears initially; each hovered item reveals one next level. */}
                <div className="relative" ref={menuBodyRef}>
                  {menuColumns.map((column, depth) => <div key={depth} style={depth ? { right: `calc(100% + ${(depth - 1) * 170}px)`, top: flyoutTops[depth - 1] ?? 0 } : undefined} className={`${depth ? 'absolute w-[170px] shadow-xl' : 'w-full'} max-h-[420px] bg-slate-50/95 rounded-2xl border border-slate-200/80 p-2 overflow-y-auto`}>
                    {column.map((item) => {
                      const children = depth < 4 ? getSubMenuItems(item.id) : [];
                      const selected = hoveredMenuPath[depth] === item.id;
                      return <div key={item.id} className={`flex items-center rounded-xl ${selected || activeTab === item.slug ? 'bg-emerald-100 text-emerald-950' : 'hover:bg-white text-slate-800'}`} onMouseEnter={(event) => revealMenuChildren(item, depth, event.currentTarget)}>
                        <button type="button" onClick={() => { setActiveTab(item.slug); setMegaMenuOpen(false); setHoveredMenuPath([]); }} className="min-w-0 flex-1 flex items-center gap-2 px-2 py-2 text-left text-xs font-semibold">
                          {depth === 0 && getMenuIcon(item.slug)}<span className="truncate" title={item.label}>{item.label}</span>
                        </button>
                        {!!children.length && <button type="button" onClick={(event) => revealMenuChildren(item, depth, event.currentTarget.parentElement!)} title={`Abrir submenus de ${item.label}`} aria-label={`Abrir submenus de ${item.label}`} className="p-2 text-emerald-800"><ChevronDown size={13} className="-rotate-90" /></button>}
                      </div>;
                    })}
                  </div>)}
                </div>

                {/* Seção de Login / Acesso Restrito no rodapé do Menu Completo */}
                <div className="mt-4 pt-3 border-t border-slate-200/90 flex items-center justify-between bg-slate-50/90 -mx-5 -mb-5 p-4 rounded-b-3xl font-body">
                  {currentUser ? (
                    <div className="flex items-center justify-between w-full gap-3">
                      <div className="flex items-center gap-2.5">
                        {currentUser.avatar ? (
                          <img src={currentUser.avatar} alt={currentUser.name} className="w-9 h-9 rounded-full object-cover border-2 border-emerald-600 shadow-xs" />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-emerald-700 text-white font-extrabold flex items-center justify-center text-sm shadow-xs">
                            {currentUser.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <div className="text-xs font-extrabold text-slate-900 leading-tight">{currentUser.name}</div>
                          <div className="text-[10px] text-emerald-800 font-extrabold uppercase">
                            {currentUser.role === 'admin' ? 'Administrador (Gestor)' : currentUser.role === 'teacher' ? 'Professor(a)' : 'Pai / Responsável'}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {canAccessAdmin(currentUser) && (
                          <button
                            onClick={() => {
                              setActiveTab('admin-dashboard');
                              setMegaMenuOpen(false);
                            }}
                            className="px-3.5 py-2 bg-[#006837] hover:bg-[#0f5238] text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-xs cursor-pointer border border-emerald-700"
                          >
                            <ShieldCheck size={15} /> Painel de Gestão do Site
                          </button>
                        )}

                        {canAccess(currentUser, 'teacher-portal') && (
                          <button
                            onClick={() => {
                              setActiveTab('teacher-portal');
                              setMegaMenuOpen(false);
                            }}
                            className="px-3.5 py-2 bg-blue-800 hover:bg-blue-900 text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-xs cursor-pointer border border-blue-900"
                          >
                            <BookOpen size={15} /> Portal do Professor
                          </button>
                        )}

                        {canAccess(currentUser, 'parent-portal') && (
                          <button
                            onClick={() => {
                              setActiveTab('parent-portal');
                              setMegaMenuOpen(false);
                            }}
                            className="px-3.5 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-xs cursor-pointer border border-amber-800"
                          >
                            <Users size={15} /> Portal do Aluno / Pais
                          </button>
                        )}

                        <button
                          onClick={() => {
                            onLogout();
                            setMegaMenuOpen(false);
                          }}
                          className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                          title="Sair do sistema"
                        >
                          <LogOut size={16} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between w-full">
                      <button type="button" onClick={() => { onOpenLogin(); setMegaMenuOpen(false); }} className="flex items-center gap-2.5 cursor-pointer" aria-label="Login">
                        <div className="p-2 bg-emerald-100 text-[#0f5238] rounded-xl shrink-0">
                          <LogIn size={18} />
                        </div>
                        <span className="text-xs font-extrabold text-slate-900 font-heading">Sair</span>
                      </button>

                      <button
                        onClick={() => {
                          onOpenLogin();
                          setMegaMenuOpen(false);
                        }}
                        className="px-4 py-2 bg-[#006837] hover:bg-[#0f5238] text-white rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-xs cursor-pointer border border-emerald-600 transition-all hover:scale-105"
                      >
                        <span>Acesso</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* Mobile Actions: Green Home Page Button with White House & Sunflower */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => {
                setActiveTab('home');
                setMobileMenuOpen(false);
              }}
              title="Home page"
              aria-label="Home page"
              className="relative group bg-[#006837] hover:bg-[#0f5238] active:scale-95 text-white px-3 py-1.5 rounded-xl transition-all shadow-xs flex items-center gap-1 cursor-pointer border border-emerald-600/60"
            >
              <div className="relative flex items-center justify-center">
                <Home size={18} className="text-white shrink-0 stroke-[2.2]" />
                <span className="text-sm leading-none select-none -ml-1 -mb-0.5 filter drop-shadow-xs">🌻</span>
              </div>

              {/* Hover Legend / Tooltip */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1 bg-slate-900 text-white text-[10px] font-bold rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-lg z-50">
                Home page
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-b-slate-900" />
              </div>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg">
          {topLevelMenuItems.map((item) => {
            const subItems = getSubMenuItems(item.id);
            const hasSub = subItems.length > 0;

            return (
              <div key={item.id} className="space-y-1">
                <button
                  onClick={() => { setActiveTab(item.slug); setMobileMenuOpen(false); }}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium flex items-center justify-between cursor-pointer ${
                    activeTab === item.slug ? 'bg-emerald-50 text-emerald-800 font-bold' : 'text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {getMenuIcon(item.slug)}
                    <span>{item.label}</span>
                  </div>
                  {hasSub && <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">{subItems.length} sub</span>}
                </button>

                {hasSub && <div className="pl-3"><MenuBranch items={menuItems} parentId={item.id} variant="mobile" activeSlug={activeTab} onNavigate={(slug) => { setActiveTab(slug); setMobileMenuOpen(false); }} icon={getMenuIcon} /></div>}
              </div>
            );
          })}

          <div className="pt-3 border-t border-slate-200">
            {currentUser ? (
              <div className="space-y-2">
                <div className="p-3 bg-slate-50 rounded-lg flex items-center justify-between">
                  <div>
                    <div className="font-bold text-sm text-slate-800">{currentUser.name}</div>
                    <div className="text-xs text-slate-500">{currentUser.email}</div>
                  </div>
                  {getRoleBadge(currentUser.role)}
                </div>
                {canAccessAdmin(currentUser) && (
                  <button
                    onClick={() => { setActiveTab('admin-dashboard'); setMobileMenuOpen(false); }}
                    className="w-full bg-emerald-800 text-white font-bold py-2 px-3 rounded-lg text-sm flex items-center justify-center gap-2"
                  >
                    <ShieldCheck size={18} /> Painel de Gestão do Site
                  </button>
                )}
                {canAccess(currentUser, 'teacher-portal') && (
                  <button
                    onClick={() => { setActiveTab('teacher-portal'); setMobileMenuOpen(false); }}
                    className="w-full bg-blue-800 text-white font-bold py-2 px-3 rounded-lg text-sm flex items-center justify-center gap-2"
                  >
                    <BookOpen size={18} /> Portal do Professor
                  </button>
                )}
                {canAccess(currentUser, 'parent-portal') && (
                  <button
                    onClick={() => { setActiveTab('parent-portal'); setMobileMenuOpen(false); }}
                    className="w-full bg-amber-700 text-white font-bold py-2 px-3 rounded-lg text-sm flex items-center justify-center gap-2"
                  >
                    <Users size={18} /> Portal do Aluno / Pais
                  </button>
                )}
                <button
                  onClick={() => { onLogout(); setMobileMenuOpen(false); }}
                  className="w-full text-red-600 font-medium py-2 rounded-lg text-sm border border-red-200 hover:bg-red-50 flex items-center justify-center gap-2"
                >
                  <LogOut size={16} /> Sair
                </button>
              </div>
            ) : (
              <button
                onClick={() => { onOpenLogin(); setMobileMenuOpen(false); }}
                className="w-full bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-lg text-sm flex items-center justify-center gap-2"
              >
                <LogIn size={18} /> Entrar na Área Restrita
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
