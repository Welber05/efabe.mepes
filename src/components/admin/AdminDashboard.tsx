import React, { useState, useEffect } from 'react';
import { PageContent, Notice, RoutinePhoto, User, MenuItem, ContentBlock, SiteHeaderFooterSettings } from '../../types';
import { RichTextEditor } from './RichTextEditor';
import { ProfessionalSiteBuilder } from './ProfessionalSiteBuilder';
import { ACCESS_AREAS, AccessArea, canAccess, defaultAreasForRole } from '../../auth/access';
import { publicAssetUrl } from '../../lib/publicAsset';
import { 
  ShieldCheck, 
  Edit3, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Bell, 
  Camera, 
  FileText, 
  Users, 
  Save, 
  Globe, 
  Eye, 
  EyeOff,
  ArrowUp,
  ArrowDown,
  Menu as MenuIcon,
  Layers,
  Quote,
  AlertTriangle,
  Image as ImageIcon,
  FolderPlus,
  Calendar,
  CornerDownRight,
  ChevronRight,
  Sliders,
  Layout,
  Building2,
  Phone,
  Mail,
  MapPin,
  Tractor,
  Leaf,
  Utensils,
  Sprout,
  GraduationCap,
  Repeat,
  Award,
  Search,
  ArrowLeft,
  ExternalLink,
  Sparkles,
  Filter,
  Check,
  X
} from 'lucide-react';

interface AdminDashboardProps {
  currentUser: User;
  pages: PageContent[];
  onUpdatePage: (updated: PageContent) => void;
  onAddPage: (newPage: PageContent) => void;
  onDeletePage: (slug: string) => void;
  menuItems: MenuItem[];
  onAddMenuItem: (item: MenuItem) => void;
  onUpdateMenuItem: (item: MenuItem) => void;
  onDeleteMenuItem: (id: string) => void;
  onReorderMenuItems: (items: MenuItem[]) => void;
  notices: Notice[];
  onAddNotice: (notice: Notice) => void;
  onUpdateNotice?: (notice: Notice) => void;
  onDeleteNotice: (id: string) => void;
  routinePhotos: RoutinePhoto[];
  onAddRoutinePhoto: (photo: RoutinePhoto) => void;
  onUpdateRoutinePhoto?: (photo: RoutinePhoto) => void;
  onDeleteRoutinePhoto: (id: string) => void;
  usersList: User[];
  onAddUser?: (user: User) => void;
  onUpdateUser?: (user: User) => void;
  onDeleteUser?: (id: string) => void;
  onOpenPublicSite: () => void;
  siteSettings?: SiteHeaderFooterSettings;
  onUpdateSiteSettings?: (updated: SiteHeaderFooterSettings) => void;
  initialAdminTab?: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  pages,
  onUpdatePage,
  onAddPage,
  onDeletePage,
  menuItems,
  onAddMenuItem,
  onUpdateMenuItem,
  onDeleteMenuItem,
  onReorderMenuItems,
  notices,
  onAddNotice,
  onUpdateNotice,
  onDeleteNotice,
  routinePhotos,
  onAddRoutinePhoto,
  onUpdateRoutinePhoto,
  onDeleteRoutinePhoto,
  usersList,
  onAddUser,
  onUpdateUser,
  onDeleteUser,
  onOpenPublicSite,
  siteSettings,
  onUpdateSiteSettings,
  initialAdminTab,
}) => {
  const [activeTab, setActiveTab] = useState<string>(() =>
    initialAdminTab && canAccess(currentUser, initialAdminTab as AccessArea)
      ? initialAdminTab
      : ACCESS_AREAS.find((area) => canAccess(currentUser, area.id))?.id || 'site-settings');

  // Site Header/Footer Settings state
  const [siteForm, setSiteForm] = useState<SiteHeaderFooterSettings>(() => siteSettings || {
    schoolAcronym: 'EFABE',
    schoolBadge: 'EFA',
    schoolName: 'Escola Família Agrícola de Boa Esperança',
    headerSlogan: 'Um sonho realizado há 40 anos!',
    topBannerAnnouncement: 'EFABE - Escola Família Agrícola de Boa Esperança',
    headerQuote: '🌻 "cuidando das pessoas e do mundo"',
    logoUrl: '/logomarca.jpeg',
    footerAboutText: 'Escola Família Agrícola de Boa Esperança. Referência na formação de jovens do campo com a consolidação e vivência prática da Pedagogia da Alternância.',
    footerSlogan: '🌻 "cuidando das pessoas e do mundo"',
    footerAddress: 'Anchieta & Unidades Regionais, Espírito Santo - ES',
    footerPhone: '(28) 3536-1200 / (27) 99881-2200',
    footerEmail: 'contato@mepes.org.br',
    footerWebsite: 'www.mepes.org.br',
    footerCopyright: 'EFABE - Escola Família Agrícola de Boa Esperança. Todos os direitos reservados.',
    footerUnitsText: 'O MEPES coordena e apoia diversas unidades de Escolas Família Agrícola em todo o estado do Espírito Santo, incluindo Anchieta, Olivânia, Castelo, Colatina, São Gabriel da Palha e Jaguaré.',
    footerCoursesList: [
      'Técnico em Agropecuária Sustentável',
      'Técnico em Meio Ambiente e Recuperação',
      'Técnico em Agroindústria e Processamento',
      'Metodologia: Sessão Escola & Sessão Família',
      'Plano de Estudo e Pesquisa Agroecológica'
    ]
  });

  const [siteSuccessMsg, setSiteSuccessMsg] = useState('');
  const [coursesText, setCoursesText] = useState((siteSettings?.footerCoursesList || []).join('\n'));

  // Títulos Personalizados das Seções do Painel Gerencial
  const defaultSectionTitles: Record<string, string> = {
    header: '1. CONFIGURAÇÕES DO CABEÇALHO (HEADER)',
    footer: '2. CONFIGURAÇÕES DO RODAPÉ (FOOTER)',
    menu: '3. GERENCIADOR DO MENU & ESTRUTURA',
    homeBlocks: '4. EDITAR BLOCOS DA PÁGINA PRINCIPAL (HOME)',
    pages: '5. EDITAR PÁGINAS DE CONTEÚDO (CMS)',
    notices: '6. POSTAR COMUNICADOS ESCOLARES',
    photos: '7. POSTAR FOTOS DA ROTINA ESCOLAR',
    users: '8. USUÁRIOS & PERFIS DE ACESSO',
  };

  const [sectionTitles, setSectionTitles] = useState<Record<string, string>>(() => {
    return siteSettings?.adminSectionTitles || defaultSectionTitles;
  });

  const [editingSectionKey, setEditingSectionKey] = useState<string | null>(null);
  const [tempSectionTitle, setTempSectionTitle] = useState<string>('');

  const handleStartEditSectionTitle = (key: string, currentTitle: string) => {
    setEditingSectionKey(key);
    setTempSectionTitle(currentTitle);
  };

  const handleSaveSectionTitle = (key: string) => {
    if (!tempSectionTitle.trim()) return;
    const updatedTitles = {
      ...sectionTitles,
      [key]: tempSectionTitle.trim(),
    };
    setSectionTitles(updatedTitles);
    setEditingSectionKey(null);

    const updatedSettings: SiteHeaderFooterSettings = {
      ...siteForm,
      adminSectionTitles: updatedTitles,
    };
    setSiteForm(updatedSettings);
    if (onUpdateSiteSettings) {
      onUpdateSiteSettings(updatedSettings);
    }
  };

  const renderSectionHeader = (key: string, fallbackDefaultTitle: string, homeSecKey?: string) => {
    const title = sectionTitles[key] || fallbackDefaultTitle;
    const isEditing = editingSectionKey === key;
    const isHidden = homeSecKey ? hiddenHomeSections.includes(homeSecKey) : false;

    return (
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3 mb-6 p-3.5 rounded-2xl transition-colors ${
        isHidden ? 'bg-red-50/80 border-red-200' : 'bg-amber-50/70 border-amber-200'
      }`}>
        <div className="flex items-center gap-2 flex-1 flex-wrap">
          <div className={`p-1.5 rounded-lg shadow-2xs ${isHidden ? 'bg-red-600 text-white' : 'bg-amber-600 text-white'}`}>
            <Layout size={16} />
          </div>
          {isEditing ? (
            <div className="flex items-center gap-2 flex-1 max-w-xl">
              <input
                type="text"
                value={tempSectionTitle}
                onChange={(e) => setTempSectionTitle(e.target.value)}
                className="w-full px-3 py-1.5 text-xs font-bold border-2 border-amber-600 rounded-xl focus:outline-hidden bg-white text-slate-900"
                autoFocus
              />
              <button
                type="button"
                onClick={() => handleSaveSectionTitle(key)}
                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0 shadow-2xs"
              >
                <Save size={13} />
                <span>Salvar</span>
              </button>
              <button
                type="button"
                onClick={() => setEditingSectionKey(null)}
                className="px-2.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold cursor-pointer shrink-0"
              >
                X
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-extrabold text-xs sm:text-sm uppercase tracking-wider text-slate-900 font-heading">
                {title}
              </h3>
              {isHidden && (
                <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 font-extrabold text-[10px] border border-red-200 flex items-center gap-1">
                  <EyeOff size={11} /> 🙈 BLOCO OCULTO NA HOME
                </span>
              )}
              <button
                type="button"
                onClick={() => handleStartEditSectionTitle(key, title)}
                className="p-1 text-amber-700 hover:text-amber-900 hover:bg-amber-200/80 rounded-md transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-bold"
                title="Editar nome desta seção no Painel Gerencial"
              >
                <Edit3 size={15} />
                <span className="hidden md:inline font-normal text-[10px] text-amber-800">(Editar Título)</span>
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {homeSecKey && (
            <button
              type="button"
              onClick={() => toggleHomeSectionVisibility(homeSecKey)}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 cursor-pointer shadow-2xs transition-all ${
                isHidden
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-emerald-700 hover:bg-emerald-800 text-white'
              }`}
              title={isHidden ? 'Clique para tornar este bloco visível na Home' : 'Clique para ocultar este bloco na Home'}
            >
              {isHidden ? (
                <>
                  <EyeOff size={14} />
                  <span>Exibir Bloco na Home</span>
                </>
              ) : (
                <>
                  <Eye size={14} />
                  <span>Ocultar Bloco na Home</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    );
  };

  // State for Home Page Blocks
  const [homePillarsBadge, setHomePillarsBadge] = useState(siteSettings?.homePillarsBadge || 'PILARES DO MEPES');
  const [homePillarsTitle, setHomePillarsTitle] = useState(siteSettings?.homePillarsTitle || 'Educação do Campo que Transforma Vidas e Propriedades');
  const [homePillarsSubtitle, setHomePillarsSubtitle] = useState(siteSettings?.homePillarsSubtitle || 'Mais do que uma escola, um movimento focado na formação humana integral e no desenvolvimento sustentável do meio rural capixaba.');
  const [homePillarsList, setHomePillarsList] = useState(siteSettings?.homePillarsList || [
    { title: 'Pedagogia da Alternância', desc: '1 semana de permanência em regime de internato e 1 semana em família aplicando o Plano de Estudo na propriedade.', icon: 'Repeat' },
    { title: 'Ensino Técnico Integrado', desc: 'Formação em Agropecuária, Meio Ambiente e Agroindústria com diploma reconhecido e foco na sustentabilidade.', icon: 'GraduationCap' },
    { title: 'Desenvolvimento Local', desc: 'Incentivo ao empreendedorismo jovem rural, sucessão familiar sustentável e agroecologia regional.', icon: 'Sprout' },
    { title: 'Formação Humana e Cidadã', desc: 'Valores comunitários, liderança, cooperação e respeito ao meio ambiente.', icon: 'Users' }
  ]);

  const [homeCoursesBadge, setHomeCoursesBadge] = useState(siteSettings?.homeCoursesBadge || 'FORMAÇÃO PROFISSIONAL');
  const [homeCoursesTitle, setHomeCoursesTitle] = useState(siteSettings?.homeCoursesTitle || 'Nossos Cursos Técnicos Integrados');
  const [homeCoursesList, setHomeCoursesList] = useState(siteSettings?.homeCoursesList || [
    { title: 'Técnico em Agropecuária', desc: 'Aprenda solos, zootecnia, cafeicultura agroecológica, fruticultura, mecânica agrícola e gestão da propriedade rural sustentável.', tag: 'Diploma Técnico de Nível Médio', icon: 'Tractor' },
    { title: 'Técnico em Meio Ambiente', desc: 'Foco na recuperação de nascentes, gestão bacia hidrográfica, licenciamento ambiental, reflorestamento e conservação de biodiversidade.', tag: 'Foco em Sustentabilidade Rural', icon: 'Leaf' },
    { title: 'Técnico em Agroindústria', desc: 'Processamento sustentável de leite, queijos, conservas, panificação artesanal e microbiologia aplicada a alimentos com higiene sanitária.', tag: 'Valorização do Produto do Campo', icon: 'Utensils' }
  ]);

  const [homeNoticesTitle, setHomeNoticesTitle] = useState(siteSettings?.homeNoticesTitle || 'Últimos Comunicados');
  const [homePhotosTitle, setHomePhotosTitle] = useState(siteSettings?.homePhotosTitle || 'Fotos da Rotina Escolar');

  // Home Section Order and Visibility
  const [homeSectionOrder, setHomeSectionOrder] = useState<string[]>(siteSettings?.homeSectionOrder || ['pillars', 'courses', 'notices', 'photos', 'contact']);
  const [hiddenHomeSections, setHiddenHomeSections] = useState<string[]>(siteSettings?.hiddenHomeSections || []);

  const toggleHomeSectionVisibility = (secKey: string) => {
    if (hiddenHomeSections.includes(secKey)) {
      setHiddenHomeSections(hiddenHomeSections.filter((s) => s !== secKey));
    } else {
      setHiddenHomeSections([...hiddenHomeSections, secKey]);
    }
  };

  // Fale Conosco State
  const [homeContactBadge, setHomeContactBadge] = useState(siteSettings?.homeContactBadge || 'FALE CONOSCO');
  const [homeContactTitle, setHomeContactTitle] = useState(siteSettings?.homeContactTitle || 'Processo Seletivo & Pré-Matrícula EFABE');
  const [homeContactDesc, setHomeContactDesc] = useState(siteSettings?.homeContactDesc || 'Quer saber mais sobre como ingressar em nossas turmas da Pedagogia da Alternância? Preencha o formulário e nossa equipe pedagógica entrará em contato.');
  const [homeContactPhone, setHomeContactPhone] = useState(siteSettings?.homeContactPhone || 'Atendimento: (28) 3536-1200 / (27) 99881-2200');
  const [homeContactEmail, setHomeContactEmail] = useState(siteSettings?.homeContactEmail || 'secretaria@mepes.org.br');
  const [homeContactAddress, setHomeContactAddress] = useState(siteSettings?.homeContactAddress || 'Anchieta e Unidades EFAs no ES');
  const [homeContactFormTitle, setHomeContactFormTitle] = useState(siteSettings?.homeContactFormTitle || 'Ficha de Contato & Pré-Inscrição');
  const [homeContactButtonText, setHomeContactButtonText] = useState(siteSettings?.homeContactButtonText || 'Enviar Pré-Inscrição');

  // Matriz Curricular State
  const [homeMatrixCurriculumText, setHomeMatrixCurriculumText] = useState(siteSettings?.homeMatrixCurriculumText || 'Ver matriz curricular completa');
  const [homeMatrixCurriculumModalContent, setHomeMatrixCurriculumModalContent] = useState(siteSettings?.homeMatrixCurriculumModalContent || 'A Matriz Curricular da EFABE é estruturada em 3 séries anuais integrando o Ensino Médio Regular com a Formação Técnica Profissional em Agropecuária, Meio Ambiente e Agroindústria através da Pedagogia da Alternância (Sessão Escola e Sessão Família).');
  const [homeMatrixCurriculumSubjects, setHomeMatrixCurriculumSubjects] = useState<{ year: string; title: string; subjects: string; ch: string }[]>(siteSettings?.homeMatrixCurriculumSubjects || [
    { year: '1º Ano', title: 'Núcleo Geral & Base Agroecológica', subjects: 'Língua Portuguesa, Matemática, Biologia, Química, Física, História, Geografia, Introdução à Agropecuária, Solos e Nutrição de Plantas, Desenho Técnico e Topografia.', ch: '1.200h' },
    { year: '2º Ano', title: 'Produção Vegetal & Manejo Sustentável', subjects: 'Língua Portuguesa, Matemática, Fitotecnia (Café, Fruticultura, Hortaliças), Zootecnia I (Bovinocultura e Avicultura), Mecanização Agrícola e Construções Rurais.', ch: '1.200h' },
    { year: '3º Ano', title: 'Gestão Rural, Agrobusiness & Estágio Supervisado', subjects: 'Gestão de Propriedades Rurais, Cooperativismo, Agroindústria e Processamento, Legislação Ambiental, Projeto Profissional de Jovens (PPJ) e Estágio Curricular.', ch: '1.200h + 300h Estágio' }
  ]);

  const [newMatrixYear, setNewMatrixYear] = useState('');
  const [newMatrixTitle, setNewMatrixTitle] = useState('');
  const [newMatrixSubjects, setNewMatrixSubjects] = useState('');
  const [newMatrixCh, setNewMatrixCh] = useState('');

  const [homeSuccessMsg, setHomeSuccessMsg] = useState('');

  // Item additions & edits for home blocks
  const [newPillarTitle, setNewPillarTitle] = useState('');
  const [newPillarDesc, setNewPillarDesc] = useState('');
  const [newPillarIcon, setNewPillarIcon] = useState('Sprout');

  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseDesc, setNewCourseDesc] = useState('');
  const [newCourseTag, setNewCourseTag] = useState('');
  const [newCourseIcon, setNewCourseIcon] = useState('Tractor');

  // Reordering helpers
  const movePillarUp = (idx: number) => {
    if (idx <= 0) return;
    const updated = [...homePillarsList];
    const temp = updated[idx];
    updated[idx] = updated[idx - 1];
    updated[idx - 1] = temp;
    setHomePillarsList(updated);
  };

  const movePillarDown = (idx: number) => {
    if (idx >= homePillarsList.length - 1) return;
    const updated = [...homePillarsList];
    const temp = updated[idx];
    updated[idx] = updated[idx + 1];
    updated[idx + 1] = temp;
    setHomePillarsList(updated);
  };

  const moveCourseUp = (idx: number) => {
    if (idx <= 0) return;
    const updated = [...homeCoursesList];
    const temp = updated[idx];
    updated[idx] = updated[idx - 1];
    updated[idx - 1] = temp;
    setHomeCoursesList(updated);
  };

  const moveCourseDown = (idx: number) => {
    if (idx >= homeCoursesList.length - 1) return;
    const updated = [...homeCoursesList];
    const temp = updated[idx];
    updated[idx] = updated[idx + 1];
    updated[idx + 1] = temp;
    setHomeCoursesList(updated);
  };

  const moveSectionUp = (idx: number) => {
    if (idx <= 0) return;
    const updated = [...homeSectionOrder];
    const temp = updated[idx];
    updated[idx] = updated[idx - 1];
    updated[idx - 1] = temp;
    setHomeSectionOrder(updated);
  };

  const moveSectionDown = (idx: number) => {
    if (idx >= homeSectionOrder.length - 1) return;
    const updated = [...homeSectionOrder];
    const temp = updated[idx];
    updated[idx] = updated[idx + 1];
    updated[idx + 1] = temp;
    setHomeSectionOrder(updated);
  };

  // Sync siteForm if siteSettings prop changes
  useEffect(() => {
    if (siteSettings) {
      setSiteForm(siteSettings);
      if (siteSettings.footerCoursesList) {
        setCoursesText(siteSettings.footerCoursesList.join('\n'));
      }
    }
  }, [siteSettings]);

  useEffect(() => {
    if (initialAdminTab && canAccess(currentUser, initialAdminTab as AccessArea)) {
      setActiveTab(initialAdminTab);
    }
  }, [initialAdminTab, currentUser]);

  const handleSaveSiteSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const coursesList = coursesText
      .split('\n')
      .map((c) => c.trim())
      .filter((c) => c.length > 0);

    const updated: SiteHeaderFooterSettings = {
      ...siteForm,
      footerCoursesList: coursesList,
    };

    if (onUpdateSiteSettings) {
      onUpdateSiteSettings(updated);
    }
    setSiteSuccessMsg('Personalização do site salva e aplicada em todo o sistema!');
    setTimeout(() => setSiteSuccessMsg(''), 4000);
  };


  // Menu item addition & submenu state
  const [newMenuLabel, setNewMenuLabel] = useState('');
  const [newMenuSlug, setNewMenuSlug] = useState('');
  const [selectedParentId, setSelectedParentId] = useState<string>(''); // '' = Menu Principal
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  const [menuSuccessMsg, setMenuSuccessMsg] = useState('');

  // Page Management Extended State
  const [pageViewMode, setPageViewMode] = useState<'list' | 'edit'>('list');
  const [pageSearchQuery, setPageSearchQuery] = useState('');
  const [pageCategoryFilter, setPageCategoryFilter] = useState<'all' | 'standard' | 'custom'>('all');

  // Create Page Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newPageTitle, setNewPageTitle] = useState('');
  const [newPageSlug, setNewPageSlug] = useState('');
  const [newPageSubtitle, setNewPageSubtitle] = useState('');
  const [newPageHeroText, setNewPageHeroText] = useState('');
  const [newPageHeroImage, setNewPageHeroImage] = useState('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=1200');
  const [newPageBodyText, setNewPageBodyText] = useState('');
  const [createMenuItemAlso, setCreateMenuItemAlso] = useState(true);
  const [newMenuParentId, setNewMenuParentId] = useState('');

  // Live preview box toggle
  const [showLivePreview, setShowLivePreview] = useState(false);

  // Preset Hero Images
  const sampleHeroImages = [
    { label: 'Campo & Agropecuária', url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=1200' },
    { label: 'Horta & Cultivo', url: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb12765?auto=format&fit=crop&q=80&w=1200' },
    { label: 'Escola & Alunos', url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1200' },
    { label: 'Laboratório & Ciência', url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=1200' },
    { label: 'Biblioteca & Estudos', url: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=1200' },
    { label: 'Trator & Tecnologia', url: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&q=80&w=1200' },
  ];

  // Helper to generate friendly slug
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleOpenCreatePageModal = () => {
    setNewPageTitle('');
    setNewPageSlug('');
    setNewPageSubtitle('');
    setNewPageHeroText('');
    setNewPageHeroImage('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=1200');
    setNewPageBodyText('');
    setCreateMenuItemAlso(true);
    setNewMenuParentId('');
    setIsCreateModalOpen(true);
  };

  const handleCreateNewPageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPageTitle.trim()) return;

    const slug = newPageSlug.trim() ? generateSlug(newPageSlug) : generateSlug(newPageTitle);
    
    // Check if slug already exists
    if (pages.some((p) => p.slug === slug)) {
      alert(`A página com a URL /${slug} já existe. Por favor, especifique outro título ou slug.`);
      return;
    }

    const newPageObj: PageContent = {
      id: `pg-${slug}-${Date.now()}`,
      slug,
      title: newPageTitle.trim(),
      subtitle: newPageSubtitle.trim() || `Página oficial sobre ${newPageTitle.trim()} - EFABE`,
      heroText: newPageHeroText.trim() || `Seja bem-vindo à página de ${newPageTitle.trim()} da EFABE.`,
      heroImage: newPageHeroImage || 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=1200',
      bodyText: newPageBodyText || `<p>Bem-vindo à página de <strong>${newPageTitle.trim()}</strong> da EFABE. Conteúdo referente às nossas ações e vivências práticas na Pedagogia da Alternância.</p>`,
      blocks: [],
      updatedAt: new Date().toISOString().split('T')[0],
      isCustom: true,
    };

    onAddPage(newPageObj);

    if (createMenuItemAlso) {
      const newMenu: MenuItem = {
        id: `menu-${slug}-${Date.now()}`,
        label: newPageTitle.trim(),
        slug,
        order: menuItems.length + 1,
        visible: true,
        parentId: newMenuParentId || undefined,
      };
      onAddMenuItem(newMenu);
    }

    setIsCreateModalOpen(false);

    // Jump straight into edit mode for this new page
    handlePageSelect(slug);
    setPageViewMode('edit');
    setSaveSuccessMsg(`Nova página "${newPageTitle}" criada com sucesso! Você já pode personalizá-la.`);
  };

  const handleConfirmDeletePage = (slug: string, title: string) => {
    if (confirm(`Tem certeza que deseja excluir permanentemente a página "${title}" (/${slug})?\n\nEsta ação removerá todo o conteúdo da página do site público.`)) {
      onDeletePage(slug);
      
      // Also delete menu item if exists
      const menuAssoc = menuItems.find((m) => m.slug === slug);
      if (menuAssoc) {
        onDeleteMenuItem(menuAssoc.id);
      }

      if (selectedPageSlug === slug) {
        handlePageSelect('home');
        setPageViewMode('list');
      }
    }
  };

  // Page Editing state
  const [selectedPageSlug, setSelectedPageSlug] = useState<string>('home');
  const currentPageToEdit = pages.find((p) => p.slug === selectedPageSlug) || pages[0] || {
    id: 'pg-home',
    slug: 'home',
    title: 'Início',
    subtitle: '',
    heroText: '',
    heroImage: '',
    bodyText: '',
    blocks: [],
    updatedAt: '',
  };
  
  const [editTitle, setEditTitle] = useState(currentPageToEdit.title);
  const [editSubtitle, setEditSubtitle] = useState(currentPageToEdit.subtitle);
  const [editHeroText, setEditHeroText] = useState(currentPageToEdit.heroText);
  const [editHeroImage, setEditHeroImage] = useState(currentPageToEdit.heroImage);
  const [editBodyText, setEditBodyText] = useState(currentPageToEdit.bodyText);
  const [editBlocks, setEditBlocks] = useState<ContentBlock[]>(currentPageToEdit.blocks || []);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Block addition state
  const [newBlockType, setNewBlockType] = useState<ContentBlock['type']>('text');
  const [newBlockTitle, setNewBlockTitle] = useState('');
  const [newBlockContent, setNewBlockContent] = useState('');
  const [newBlockImageUrl, setNewBlockImageUrl] = useState('');
  const [newBlockCaption, setNewBlockCaption] = useState('');

  // User CRUD state
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<'admin' | 'teacher' | 'parent' | 'guest'>('teacher');
  const [newUserAreas, setNewUserAreas] = useState<AccessArea[]>(defaultAreasForRole('teacher'));
  const [newUserSubjects, setNewUserSubjects] = useState('');
  const [newUserAvatar, setNewUserAvatar] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userSuccessMsg, setUserSuccessMsg] = useState('');

  const handleCreateOrUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      const updated: User = {
        ...editingUser,
        name: newUserName,
        email: newUserEmail,
        role: newUserRole,
        allowedAreas: newUserAreas,
        subjects: newUserSubjects ? newUserSubjects.split(',').map((s) => s.trim()) : editingUser.subjects,
        avatar: newUserAvatar || editingUser.avatar,
      };
      if (onUpdateUser) onUpdateUser(updated);
      setEditingUser(null);
      setUserSuccessMsg('Usuário atualizado com sucesso!');
    } else {
      const newU: User = {
        id: `usr-${Date.now()}`,
        name: newUserName,
        email: newUserEmail,
        role: newUserRole,
        allowedAreas: newUserAreas,
        subjects: newUserSubjects ? newUserSubjects.split(',').map((s) => s.trim()) : undefined,
        avatar: newUserAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      };
      if (onAddUser) onAddUser(newU);
      setUserSuccessMsg('Novo usuário cadastrado com sucesso!');
    }
    setNewUserName('');
    setNewUserEmail('');
    setNewUserSubjects('');
    setNewUserAvatar('');
    setNewUserAreas(defaultAreasForRole(newUserRole));
    setTimeout(() => setUserSuccessMsg(''), 3000);
  };

  const handleStartEditUser = (u: User) => {
    setEditingUser(u);
    setNewUserName(u.name);
    setNewUserEmail(u.email);
    setNewUserRole(u.role);
    setNewUserAreas(u.allowedAreas ?? defaultAreasForRole(u.role));
    setNewUserSubjects(u.subjects ? u.subjects.join(', ') : '');
    setNewUserAvatar(u.avatar || '');
  };

  // Handle page slug switch
  const handlePageSelect = (slug: string) => {
    setSelectedPageSlug(slug);
    const target = pages.find((p) => p.slug === slug) || pages[0];
    if (target) {
      setEditTitle(target.title);
      setEditSubtitle(target.subtitle);
      setEditHeroText(target.heroText);
      setEditHeroImage(target.heroImage);
      setEditBodyText(target.bodyText);
      setEditBlocks(target.blocks || []);
    }
    setSaveSuccessMsg('');
  };

  const handleSavePage = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: PageContent = {
      ...currentPageToEdit,
      title: editTitle,
      subtitle: editSubtitle,
      heroText: editHeroText,
      heroImage: editHeroImage,
      bodyText: editBodyText,
      blocks: editBlocks,
      updatedAt: new Date().toISOString().split('T')[0],
    };
    onUpdatePage(updated);
    setSaveSuccessMsg('Página salva e atualizada com sucesso no site público!');
    setTimeout(() => setSaveSuccessMsg(''), 4000);
  };

  // Add block to current page
  const handleAddBlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlockContent && newBlockType !== 'image') return;

    const newBlock: ContentBlock = {
      id: `blk-${Date.now()}`,
      type: newBlockType,
      title: newBlockTitle || undefined,
      content: newBlockContent,
      imageUrl: newBlockImageUrl || undefined,
      caption: newBlockCaption || undefined,
    };

    const updated = [...editBlocks, newBlock];
    setEditBlocks(updated);
    setNewBlockTitle('');
    setNewBlockContent('');
    setNewBlockImageUrl('');
    setNewBlockCaption('');
  };

  const handleRemoveBlock = (blockId: string) => {
    setEditBlocks((prev) => prev.filter((b) => b.id !== blockId));
  };

  // Inline editing state for blocks
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const [editingBlockTitle, setEditingBlockTitle] = useState('');
  const [editingBlockContent, setEditingBlockContent] = useState('');
  const [editingBlockImageUrl, setEditingBlockImageUrl] = useState('');
  const [editingBlockCaption, setEditingBlockCaption] = useState('');
  const [editingBlockType, setEditingBlockType] = useState<ContentBlock['type']>('text');

  const handleStartEditBlock = (blk: ContentBlock) => {
    setEditingBlockId(blk.id);
    setEditingBlockType(blk.type);
    setEditingBlockTitle(blk.title || '');
    setEditingBlockContent(blk.content);
    setEditingBlockImageUrl(blk.imageUrl || '');
    setEditingBlockCaption(blk.caption || '');
  };

  const handleSaveEditBlock = () => {
    if (!editingBlockId) return;
    const updated = editBlocks.map((b) => {
      if (b.id === editingBlockId) {
        return {
          ...b,
          type: editingBlockType,
          title: editingBlockTitle || undefined,
          content: editingBlockContent,
          imageUrl: editingBlockImageUrl || undefined,
          caption: editingBlockCaption || undefined,
        };
      }
      return b;
    });
    setEditBlocks(updated);
    setEditingBlockId(null);
  };

  const handleGoToEditPageFromMenu = (slug: string, label: string) => {
    let targetPage = pages.find((p) => p.slug === slug);
    if (!targetPage) {
      const newPage: PageContent = {
        id: `pg-${slug}`,
        slug,
        title: label,
        subtitle: `Página oficial sobre ${label} - EFABE`,
        heroText: `Seja bem-vindo à seção de ${label} da EFABE (Escola Família Agrícola de Boa Esperança).`,
        heroImage: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=1200',
        bodyText: `Conteúdo referente a ${label}. Você pode personalizar este texto, alterar a imagem do cabeçalho e adicionar novos blocos com fotos, vídeos e formulários.`,
        blocks: [],
        updatedAt: new Date().toISOString().split('T')[0],
        isCustom: true,
      };
      onAddPage(newPage);
      targetPage = newPage;
    }

    setActiveTab('pages');
    setPageViewMode('edit');
    setSelectedPageSlug(slug);
    setEditTitle(targetPage.title);
    setEditSubtitle(targetPage.subtitle);
    setEditHeroText(targetPage.heroText);
    setEditHeroImage(targetPage.heroImage);
    setEditBodyText(targetPage.bodyText);
    setEditBlocks(targetPage.blocks || []);
    setSaveSuccessMsg('');
  };

  const handleMoveBlock = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= editBlocks.length) return;
    const newArr = [...editBlocks];
    const [moved] = newArr.splice(index, 1);
    newArr.splice(targetIndex, 0, moved);
    setEditBlocks(newArr);
  };

  // Add or update menu item & corresponding page
  const handleAddMenuSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMenuLabel) return;

    const slug = newMenuSlug.trim()
      ? newMenuSlug.toLowerCase().replace(/[^a-z0-9-]/g, '-')
      : newMenuLabel.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');

    if (editingMenuItem) {
      const updated: MenuItem = {
        ...editingMenuItem,
        label: newMenuLabel,
        slug,
        parentId: selectedParentId || undefined,
      };
      onUpdateMenuItem(updated);
      setEditingMenuItem(null);
      setMenuSuccessMsg(`Item de menu "${updated.label}" atualizado com sucesso!`);
    } else {
      // Check duplicate slug
      if (menuItems.some((m) => m.slug === slug)) {
        alert('Já existe um item de menu ou submenu com esse identificador/slug!');
        return;
      }

      const newItem: MenuItem = {
        id: `m-${Date.now()}`,
        label: newMenuLabel,
        slug,
        order: menuItems.filter((m) => (m.parentId || '') === selectedParentId).length + 1,
        visible: true,
        isCustom: true,
        parentId: selectedParentId || undefined,
      };

      const newPage: PageContent = {
        id: `pg-${slug}`,
        slug,
        title: newMenuLabel,
        subtitle: selectedParentId
          ? `Subseção oficial de ${newMenuLabel} - EFABE`
          : `Página oficial sobre ${newMenuLabel} - EFABE`,
        heroText: `Seja bem-vindo à seção de ${newMenuLabel} da EFABE (Escola Família Agrícola de Boa Esperança).`,
        heroImage: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=1200',
        bodyText: `Conteúdo referente a ${newMenuLabel}. Você pode editar este texto, alterar as imagens e adicionar novos blocos através do painel de controle.`,
        blocks: [],
        updatedAt: new Date().toISOString().split('T')[0],
        isCustom: true,
      };

      onAddMenuItem(newItem);
      onAddPage(newPage);
      setMenuSuccessMsg(`${selectedParentId ? 'Submenu' : 'Item de menu'} "${newItem.label}" e página criados com sucesso!`);
    }

    setNewMenuLabel('');
    setNewMenuSlug('');
    setSelectedParentId('');
    setTimeout(() => setMenuSuccessMsg(''), 4000);
  };

  const handleStartEditMenuItem = (item: MenuItem) => {
    setEditingMenuItem(item);
    setNewMenuLabel(item.label);
    setNewMenuSlug(item.slug);
    setSelectedParentId(item.parentId || '');
  };

  const handleCancelEditMenuItem = () => {
    setEditingMenuItem(null);
    setNewMenuLabel('');
    setNewMenuSlug('');
    setSelectedParentId('');
  };

  // Menu reordering (works for level 1, submenus level 2, and 3ª via level 3)
  const handleMoveMenuItem = (group: MenuItem[], index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= group.length) return;

    const newGroup = [...group];
    const [moved] = newGroup.splice(index, 1);
    newGroup.splice(targetIdx, 0, moved);

    const updatedSubset = newGroup.map((item, idx) => ({
      ...item,
      order: idx + 1,
    }));

    if (onReorderMenuItems) {
      onReorderMenuItems(updatedSubset);
    } else {
      updatedSubset.forEach((item) => onUpdateMenuItem(item));
    }
  };

  // Notice form state
  const [newNoticeTitle, setNewNoticeTitle] = useState('');
  const [newNoticeContent, setNewNoticeContent] = useState('');
  const [newNoticeCategory, setNewNoticeCategory] = useState<'Geral' | 'Calendário' | 'Eventos' | 'Pedagógico' | 'Urgente'>('Geral');
  const [newNoticeImg, setNewNoticeImg] = useState('');
  const [newNoticePinned, setNewNoticePinned] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);

  const handleStartEditNotice = (n: Notice) => {
    setEditingNotice(n);
    setNewNoticeTitle(n.title);
    setNewNoticeCategory(n.category);
    setNewNoticeImg(n.imageUrl || '');
    setNewNoticeContent(n.content);
    setNewNoticePinned(n.pinned || false);
  };

  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoticeTitle || !newNoticeContent) return;

    if (editingNotice) {
      const updated: Notice = {
        ...editingNotice,
        title: newNoticeTitle,
        category: newNoticeCategory,
        content: newNoticeContent,
        imageUrl: newNoticeImg || undefined,
        pinned: newNoticePinned,
      };
      if (onUpdateNotice) onUpdateNotice(updated);
      setEditingNotice(null);
    } else {
      const newN: Notice = {
        id: `not-${Date.now()}`,
        title: newNoticeTitle,
        content: newNoticeContent,
        category: newNoticeCategory,
        date: new Date().toISOString().split('T')[0],
        author: 'Administrador MEPES',
        targetRole: 'public',
        imageUrl: newNoticeImg || undefined,
        pinned: newNoticePinned,
      };
      onAddNotice(newN);
    }

    setNewNoticeTitle('');
    setNewNoticeContent('');
    setNewNoticeImg('');
    setNewNoticePinned(false);
  };

  // Routine photo form state
  const [newPhotoTitle, setNewPhotoTitle] = useState('');
  const [newPhotoDesc, setNewPhotoDesc] = useState('');
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoTurma, setNewPhotoTurma] = useState('2º Ano - Téc. Agropecuária');
  const [newPhotoCat, setNewPhotoCat] = useState<'Agroecologia' | 'Aulas Práticas' | 'Vivência Comunitária' | 'Projetos' | 'Esportes' | 'Laboratório'>('Aulas Práticas');
  const [editingPhoto, setEditingPhoto] = useState<RoutinePhoto | null>(null);

  const handleStartEditPhoto = (p: RoutinePhoto) => {
    setEditingPhoto(p);
    setNewPhotoTitle(p.title);
    setNewPhotoDesc(p.description);
    setNewPhotoUrl(p.imageUrl);
    setNewPhotoTurma(p.turma);
    setNewPhotoCat(p.category);
  };

  const handleCreatePhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhotoTitle || !newPhotoUrl) return;

    if (editingPhoto) {
      const updated: RoutinePhoto = {
        ...editingPhoto,
        title: newPhotoTitle,
        description: newPhotoDesc,
        imageUrl: newPhotoUrl,
        turma: newPhotoTurma,
        category: newPhotoCat,
      };
      if (onUpdateRoutinePhoto) onUpdateRoutinePhoto(updated);
      setEditingPhoto(null);
    } else {
      const newP: RoutinePhoto = {
        id: `ph-${Date.now()}`,
        title: newPhotoTitle,
        description: newPhotoDesc,
        imageUrl: newPhotoUrl,
        date: new Date().toISOString().split('T')[0],
        turma: newPhotoTurma,
        category: newPhotoCat,
        author: 'Administração MEPES',
        likes: 0,
      };
      onAddRoutinePhoto(newP);
    }

    setNewPhotoTitle('');
    setNewPhotoDesc('');
    setNewPhotoUrl('');
  };

  return (
    <div className="py-8 bg-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Top Admin Header */}
        <div className="bg-[#0f5238] text-white p-6 rounded-3xl shadow-earth-lg flex flex-col md:flex-row md:items-center justify-between gap-4 font-body border border-emerald-800">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white p-1 border-2 border-[#e9c46a] shadow-md flex items-center justify-center shrink-0">
              <img src={`${import.meta.env.BASE_URL}logomarca.jpeg`} alt="EFA MEPES Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-[#1b4332] text-[#e9c46a] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase border border-[#e9c46a]/30 font-heading">
                  Painel Administrativo CMS
                </span>
                <span className="text-xs text-amber-200 font-medium font-body">EFABE • Um sonho realizado há 40 anos!</span>
              </div>
              <h1 className="text-2xl font-extrabold font-heading text-white tracking-tight">Gerenciamento Geral do Website</h1>
            </div>
          </div>

          <button
            onClick={onOpenPublicSite}
            className="bg-[#e9c46a] hover:bg-[#dda15e] text-[#4a2810] font-bold px-5 py-2.5 rounded-xl transition-all text-xs flex items-center gap-2 cursor-pointer shadow-earth font-heading"
          >
            <Globe size={16} />
            <span>Visualizar Website Público</span>
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500 font-medium">Itens no Menu</div>
              <div className="text-2xl font-black text-slate-900">{menuItems.length}</div>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl">
              <MenuIcon size={20} />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500 font-medium">Páginas de Conteúdo</div>
              <div className="text-2xl font-black text-slate-900">{pages.length}</div>
            </div>
            <div className="p-3 bg-blue-50 text-blue-700 rounded-xl">
              <FileText size={20} />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500 font-medium">Comunicados Publicados</div>
              <div className="text-2xl font-black text-slate-900">{notices.length}</div>
            </div>
            <div className="p-3 bg-amber-50 text-amber-700 rounded-xl">
              <Bell size={20} />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500 font-medium">Fotos na Rotina</div>
              <div className="text-2xl font-black text-slate-900">{routinePhotos.length}</div>
            </div>
            <div className="p-3 bg-purple-50 text-purple-700 rounded-xl">
              <Camera size={20} />
            </div>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
          {ACCESS_AREAS.filter((area) => !['teacher-portal', 'parent-portal'].includes(area.id) && canAccess(currentUser, area.id)).map((area) => (
            <button
              key={area.id}
              onClick={() => setActiveTab(area.id)}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer shrink-0 ${activeTab === area.id
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-emerald-50 border border-slate-200'}`}
            >
              {area.label}
            </button>
          ))}
        </div>

        {activeTab === 'professional-builder' && canAccess(currentUser, 'professional-builder') && (
          <ProfessionalSiteBuilder
            pages={pages}
            onUpdatePage={onUpdatePage}
            onOpenPublicSite={onOpenPublicSite}
          />
        )}

        {/* TAB 0: PERSONALIZAÇÃO COMPLETA DO SITE (CABEÇALHO & RODAPÉ) */}
        {activeTab === 'site-settings' && canAccess(currentUser, 'site-settings') && (
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 font-heading flex items-center gap-2.5">
                  <Sliders className="text-amber-600" size={24} />
                  <span>Personalização Global do Site</span>
                </h2>
                <p className="text-xs text-slate-500 font-body mt-1">
                  Altere os textos, logomarca, contatos, frases e links do Cabeçalho e do Rodapé. As alterações são aplicadas instantaneamente em todas as páginas.
                </p>
              </div>

              <button
                type="button"
                onClick={onOpenPublicSite}
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded-xl font-bold text-xs border border-emerald-200 cursor-pointer transition-colors"
              >
                <Eye size={15} /> Ver Site Público
              </button>
            </div>

            {siteSuccessMsg && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center gap-2.5 shadow-xs">
                <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                <span>{siteSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveSiteSettings} className="space-y-8">
              
              {/* SEÇÃO 1: CABEÇALHO */}
              <div className="space-y-4">
                {renderSectionHeader('header', '1. CONFIGURAÇÕES DO CABEÇALHO (HEADER)')}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {/* Logomarca URL */}
                  <div className="lg:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      URL / Caminho da Logomarca
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        value={siteForm.logoUrl}
                        onChange={(e) => setSiteForm({ ...siteForm, logoUrl: e.target.value })}
                        placeholder="/logomarca.jpeg ou https://..."
                        className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden font-mono"
                      />
                      {siteForm.logoUrl && (
                        <div className="w-10 h-10 rounded-xl border border-slate-200 p-1 bg-white shrink-0 flex items-center justify-center overflow-hidden">
                          <img src={publicAssetUrl(siteForm.logoUrl)} alt="Preview Logo" className="w-full h-full object-contain" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Sigla */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Sigla Curta da Escola
                    </label>
                    <input
                      type="text"
                      value={siteForm.schoolAcronym}
                      onChange={(e) => setSiteForm({ ...siteForm, schoolAcronym: e.target.value })}
                      placeholder="Ex: EFABE"
                      className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden font-bold"
                    />
                  </div>

                  {/* Selo/Badge */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Selo da Sigla (Badge Amarelo)
                    </label>
                    <input
                      type="text"
                      value={siteForm.schoolBadge}
                      onChange={(e) => setSiteForm({ ...siteForm, schoolBadge: e.target.value })}
                      placeholder="Ex: EFA"
                      className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden"
                    />
                  </div>

                  {/* Nome Completo da Escola */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nome Completo da Escola / Instituição
                    </label>
                    <input
                      type="text"
                      value={siteForm.schoolName}
                      onChange={(e) => setSiteForm({ ...siteForm, schoolName: e.target.value })}
                      placeholder="Ex: Escola Família Agrícola de Boa Esperança"
                      className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden"
                    />
                  </div>

                  {/* Topo Banner Anúncio Principal */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Título da Barra Superior Verde
                    </label>
                    <input
                      type="text"
                      value={siteForm.topBannerAnnouncement}
                      onChange={(e) => setSiteForm({ ...siteForm, topBannerAnnouncement: e.target.value })}
                      placeholder="Ex: EFABE - Escola Família Agrícola de Boa Esperança"
                      className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden"
                    />
                  </div>

                  {/* Sub-slogan do Topo */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Sub-slogan da Barra Superior
                    </label>
                    <input
                      type="text"
                      value={siteForm.headerSlogan}
                      onChange={(e) => setSiteForm({ ...siteForm, headerSlogan: e.target.value })}
                      placeholder="Ex: Um sonho realizado há 40 anos!"
                      className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden"
                    />
                  </div>

                  {/* Lema/Frase do Topo */}
                  <div className="md:col-span-3">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Lema ou Frase de Destaque no Topo
                    </label>
                    <input
                      type="text"
                      value={siteForm.headerQuote}
                      onChange={(e) => setSiteForm({ ...siteForm, headerQuote: e.target.value })}
                      placeholder='Ex: 🌻 "cuidando das pessoas e do mundo"'
                      className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden"
                    />
                  </div>
                </div>
              </div>


              {/* SEÇÃO 2: RODAPÉ */}
              <div className="space-y-4 pt-4 border-t border-slate-200">
                {renderSectionHeader('footer', '2. CONFIGURAÇÕES DO RODAPÉ (FOOTER)')}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  
                  {/* Texto Institucional "Sobre" */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Texto Resumo "Sobre a Escola"
                    </label>
                    <textarea
                      rows={3}
                      value={siteForm.footerAboutText}
                      onChange={(e) => setSiteForm({ ...siteForm, footerAboutText: e.target.value })}
                      placeholder="Descrição institucional curta..."
                      className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden"
                    />
                  </div>

                  {/* Frase do Rodapé */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Frase/Lema do Rodapé
                    </label>
                    <input
                      type="text"
                      value={siteForm.footerSlogan}
                      onChange={(e) => setSiteForm({ ...siteForm, footerSlogan: e.target.value })}
                      placeholder='Ex: 🌻 "cuidando das pessoas e do mundo"'
                      className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden"
                    />
                  </div>

                  {/* Endereço */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Endereço / Localização
                    </label>
                    <input
                      type="text"
                      value={siteForm.footerAddress}
                      onChange={(e) => setSiteForm({ ...siteForm, footerAddress: e.target.value })}
                      placeholder="Ex: Anchieta & Unidades Regionais, ES"
                      className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden"
                    />
                  </div>

                  {/* Telefone */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Telefones de Contato
                    </label>
                    <input
                      type="text"
                      value={siteForm.footerPhone}
                      onChange={(e) => setSiteForm({ ...siteForm, footerPhone: e.target.value })}
                      placeholder="Ex: (28) 3536-1200 / (27) 99881-2200"
                      className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden"
                    />
                  </div>

                  {/* E-mail */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      E-mail de Contato
                    </label>
                    <input
                      type="text"
                      value={siteForm.footerEmail}
                      onChange={(e) => setSiteForm({ ...siteForm, footerEmail: e.target.value })}
                      placeholder="Ex: contato@mepes.org.br"
                      className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden"
                    />
                  </div>

                  {/* Website */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Website Oficial
                    </label>
                    <input
                      type="text"
                      value={siteForm.footerWebsite}
                      onChange={(e) => setSiteForm({ ...siteForm, footerWebsite: e.target.value })}
                      placeholder="Ex: www.mepes.org.br"
                      className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden"
                    />
                  </div>

                  {/* Texto de Unidades / Parcerias */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Texto do Bloco "Unidades & Parcerias"
                    </label>
                    <textarea
                      rows={3}
                      value={siteForm.footerUnitsText}
                      onChange={(e) => setSiteForm({ ...siteForm, footerUnitsText: e.target.value })}
                      placeholder="Informações sobre unidades parceiras..."
                      className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden"
                    />
                  </div>

                  {/* Copyright */}
                  <div className="md:col-span-3">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Texto do Copyright (Rodapé Inferior)
                    </label>
                    <input
                      type="text"
                      value={siteForm.footerCopyright}
                      onChange={(e) => setSiteForm({ ...siteForm, footerCopyright: e.target.value })}
                      placeholder="Ex: EFABE - Escola Família Agrícola de Boa Esperança. Todos os direitos reservados."
                      className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden"
                    />
                  </div>

                  {/* Lista de Cursos e Linhas */}
                  <div className="md:col-span-3">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Lista de Cursos & Destaques do Rodapé (um por linha)
                    </label>
                    <textarea
                      rows={5}
                      value={coursesText}
                      onChange={(e) => setCoursesText(e.target.value)}
                      placeholder="Técnico em Agropecuária Sustentável&#10;Técnico em Meio Ambiente&#10;Metodologia da Alternância"
                      className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden font-mono"
                    />
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      Escreva cada curso ou modalidade em uma linha separada.
                    </span>
                  </div>

                </div>
              </div>

              {/* Botão Salvar Geral */}
              <div className="pt-4 border-t border-slate-200 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#0f5238] hover:bg-[#1b4332] text-white font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-earth transition-all font-heading"
                >
                  <Save size={16} />
                  <span>Salvar Toda a Personalização do Site</span>
                </button>
              </div>

            </form>
          </div>
        )}

        {/* TAB 0.5: BLOCOS DA PÁGINA PRINCIPAL (HOME) */}
        {activeTab === 'home-blocks' && canAccess(currentUser, 'home-blocks') && (
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 font-heading flex items-center gap-2.5">
                  <Layout className="text-emerald-700" size={24} />
                  <span>Edição de Todos os Blocos da Página Principal (Home)</span>
                </h2>
                <p className="text-xs text-slate-500 font-body mt-1">
                  Gerencie a ordem das seções, pilares, cursos, matriz curricular, comunicados e a área Fale Conosco.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const updatedSettings: SiteHeaderFooterSettings = {
                    ...siteForm,
                    homePillarsBadge,
                    homePillarsTitle,
                    homePillarsSubtitle,
                    homePillarsList,
                    homeCoursesBadge,
                    homeCoursesTitle,
                    homeCoursesList,
                    homeNoticesTitle,
                    homePhotosTitle,
                    homeSectionOrder,
                    hiddenHomeSections,
                    homeContactBadge,
                    homeContactTitle,
                    homeContactDesc,
                    homeContactPhone,
                    homeContactEmail,
                    homeContactAddress,
                    homeContactFormTitle,
                    homeContactButtonText,
                    homeMatrixCurriculumText,
                    homeMatrixCurriculumModalContent,
                    homeMatrixCurriculumSubjects
                  };
                  setSiteForm(updatedSettings);
                  if (onUpdateSiteSettings) onUpdateSiteSettings(updatedSettings);
                  setHomeSuccessMsg('Todas as alterações dos blocos da Home foram salvas e aplicadas!');
                  setTimeout(() => setHomeSuccessMsg(''), 4000);
                }}
                className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs transition-colors shrink-0"
              >
                <Save size={16} /> Salvar Todos os Blocos da Home
              </button>
            </div>

            {homeSuccessMsg && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fade-in">
                <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                <span>{homeSuccessMsg}</span>
              </div>
            )}

            {/* SEÇÃO 0: REORDENAR SEÇÕES DA PÁGINA PRINCIPAL */}
            <div className="bg-amber-50/60 p-6 rounded-2xl border border-amber-200 space-y-4">
              <div className="flex items-center justify-between border-b border-amber-200/80 pb-3">
                <div>
                  <h3 className="font-extrabold text-sm uppercase tracking-wider text-amber-950 flex items-center gap-2">
                    <Sliders size={18} className="text-amber-700" />
                    <span>Organizar Ordem das Seções da Home</span>
                  </h3>
                  <p className="text-xs text-amber-800 mt-0.5">
                    Use as setas para mover as seções para cima ou para baixo conforme a prioridade desejada na página inicial.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1">
                {homeSectionOrder.map((secKey, idx) => {
                  const secLabels: Record<string, { title: string; color: string }> = {
                    pillars: { title: '1. Pilares do MEPES', color: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
                    courses: { title: '2. Formação Profissional', color: 'bg-blue-100 text-blue-900 border-blue-300' },
                    notices: { title: '3. Últimos Comunicados', color: 'bg-amber-100 text-amber-900 border-amber-300' },
                    photos: { title: '4. Galeria de Fotos', color: 'bg-purple-100 text-purple-900 border-purple-300' },
                    contact: { title: '5. Bloco Fale Conosco', color: 'bg-teal-100 text-teal-900 border-teal-300' }
                  };
                  const label = secLabels[secKey] || { title: secKey, color: 'bg-slate-100 text-slate-900 border-slate-300' };
                  const isHidden = hiddenHomeSections.includes(secKey);

                  return (
                    <div key={secKey} className={`p-3 rounded-xl border ${isHidden ? 'bg-slate-200/80 border-slate-300 opacity-75' : label.color} flex flex-col justify-between gap-2 shadow-2xs`}>
                      <div className="flex items-center justify-between gap-1">
                        <span className={`font-bold text-xs ${isHidden ? 'line-through text-slate-600' : ''}`}>{label.title}</span>
                        {isHidden && (
                          <span className="text-[9px] font-extrabold bg-red-200 text-red-900 px-1.5 py-0.5 rounded">
                            Oculto
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between gap-1 pt-1 border-t border-black/10">
                        <button
                          type="button"
                          onClick={() => toggleHomeSectionVisibility(secKey)}
                          className={`px-2 py-0.5 rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                            isHidden
                              ? 'bg-red-100 text-red-800 hover:bg-red-200'
                              : 'bg-emerald-200/80 text-emerald-900 hover:bg-emerald-300'
                          }`}
                          title={isHidden ? 'Exibir Seção na Home' : 'Ocultar Seção na Home'}
                        >
                          {isHidden ? <EyeOff size={12} /> : <Eye size={12} />}
                          <span>{isHidden ? 'Oculto' : 'Visível'}</span>
                        </button>

                        <div className="flex items-center gap-0.5">
                          <button
                            type="button"
                            onClick={() => moveSectionUp(idx)}
                            disabled={idx === 0}
                            className="p-1 hover:bg-black/10 rounded disabled:opacity-30 cursor-pointer"
                            title="Mover para cima"
                          >
                            <ArrowUp size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveSectionDown(idx)}
                            disabled={idx === homeSectionOrder.length - 1}
                            className="p-1 hover:bg-black/10 rounded disabled:opacity-30 cursor-pointer"
                            title="Mover para baixo"
                          >
                            <ArrowDown size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Banners Fixos Adicionais da Home */}
              <div className="pt-3 border-t border-amber-200/80 space-y-2">
                <span className="text-[11px] font-extrabold uppercase text-amber-900 block">
                  Banners Especiais da Página Inicial (Exibir / Ocultar)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { key: 'quoteBanner', label: 'Banner de Citação (EFABE 40 Anos / Frase MEPES)' },
                    { key: 'acervoBanner', label: 'Banner de Acesso Rápido aos Acervos Drive' }
                  ].map((banner) => {
                    const isHidden = hiddenHomeSections.includes(banner.key);
                    return (
                      <div key={banner.key} className={`p-3 rounded-xl border flex items-center justify-between gap-2 shadow-2xs ${
                        isHidden ? 'bg-slate-200/80 border-slate-300 opacity-75' : 'bg-amber-100/70 border-amber-300 text-amber-950'
                      }`}>
                        <span className={`text-xs font-bold ${isHidden ? 'line-through text-slate-600' : ''}`}>
                          {banner.label}
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleHomeSectionVisibility(banner.key)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shrink-0 ${
                            isHidden
                              ? 'bg-red-600 text-white hover:bg-red-700'
                              : 'bg-emerald-700 text-white hover:bg-emerald-800'
                          }`}
                          title={isHidden ? 'Exibir Banner' : 'Ocultar Banner'}
                        >
                          {isHidden ? <EyeOff size={13} /> : <Eye size={13} />}
                          <span>{isHidden ? 'Banner Oculto' : 'Banner Visível'}</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* SEÇÃO 1: BLOCO PILARES DO MEPES */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-6">
              {renderSectionHeader('homePillars', '1. BLOCO PILARES DO MEPES', 'pillars')}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Badge / Tag da Seção</label>
                  <input
                    type="text"
                    value={homePillarsBadge}
                    onChange={(e) => setHomePillarsBadge(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Título da Seção de Pilares</label>
                  <input
                    type="text"
                    value={homePillarsTitle}
                    onChange={(e) => setHomePillarsTitle(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Subtítulo Explicativo</label>
                  <input
                    type="text"
                    value={homePillarsSubtitle}
                    onChange={(e) => setHomePillarsSubtitle(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900"
                  />
                </div>
              </div>

              {/* Lista de Cartões de Pilares */}
              <div className="space-y-3 pt-2">
                <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider flex items-center justify-between">
                  <span>Cartões dos Pilares (Edição & Ordenação)</span>
                  <span className="text-emerald-700 text-[11px] font-bold">{homePillarsList.length} itens</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {homePillarsList.map((pilar, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-xl border-2 border-emerald-100 hover:border-emerald-400 space-y-3 shadow-2xs relative group transition-colors">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 flex-1">
                          <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-extrabold shrink-0">{idx + 1}</span>
                          <input
                            type="text"
                            value={pilar.title}
                            onChange={(e) => {
                              const updated = [...homePillarsList];
                              updated[idx].title = e.target.value;
                              setHomePillarsList(updated);
                            }}
                            placeholder="Título do Pilar"
                            className="w-full px-2.5 py-1 text-xs font-bold border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-slate-50 focus:bg-white text-slate-900"
                          />
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => movePillarUp(idx)}
                            disabled={idx === 0}
                            className="p-1 hover:bg-slate-100 text-slate-600 rounded disabled:opacity-30 cursor-pointer"
                            title="Mover pilar para cima"
                          >
                            <ArrowUp size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => movePillarDown(idx)}
                            disabled={idx === homePillarsList.length - 1}
                            className="p-1 hover:bg-slate-100 text-slate-600 rounded disabled:opacity-30 cursor-pointer"
                            title="Mover pilar para baixo"
                          >
                            <ArrowDown size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setHomePillarsList(homePillarsList.filter((_, i) => i !== idx))}
                            className="text-slate-400 hover:text-red-600 p-1 rounded-md cursor-pointer ml-1"
                            title="Excluir Pilar"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      <textarea
                        rows={2}
                        value={pilar.desc}
                        onChange={(e) => {
                          const updated = [...homePillarsList];
                          updated[idx].desc = e.target.value;
                          setHomePillarsList(updated);
                        }}
                        placeholder="Descrição detalhada do pilar..."
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-slate-50 focus:bg-white text-slate-700 leading-relaxed"
                      />

                      <div className="flex items-center justify-between gap-2 pt-1">
                        <div className="flex items-center gap-1.5">
                          <label className="text-[10px] font-bold text-slate-500 uppercase">Ícone:</label>
                          <select
                            value={pilar.icon}
                            onChange={(e) => {
                              const updated = [...homePillarsList];
                              updated[idx].icon = e.target.value;
                              setHomePillarsList(updated);
                            }}
                            className="px-2 py-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg cursor-pointer"
                          >
                            <option value="Repeat">Repeat (Alternância)</option>
                            <option value="GraduationCap">GraduationCap (Ensino Técnico)</option>
                            <option value="Sprout">Sprout (Agroecologia)</option>
                            <option value="Users">Users (Comunidade)</option>
                            <option value="Tractor">Tractor (Campo)</option>
                            <option value="Leaf">Leaf (Sustentabilidade)</option>
                            <option value="Utensils">Utensils (Agroindústria)</option>
                          </select>
                        </div>
                        <span className="text-[10px] text-emerald-700 font-medium">✏️ Editável</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Adicionar Novo Pilar */}
                <div className="bg-white p-4 rounded-xl border-2 border-dashed border-emerald-200 space-y-3 mt-4">
                  <h5 className="font-bold text-xs text-emerald-900 flex items-center gap-1.5">
                    <Plus size={15} /> Adicionar Novo Cartão de Pilar
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="Título do Pilar (ex: Gestão Rural)"
                      value={newPillarTitle}
                      onChange={(e) => setNewPillarTitle(e.target.value)}
                      className="px-3 py-1.5 border border-slate-300 rounded-xl text-xs bg-slate-50"
                    />
                    <input
                      type="text"
                      placeholder="Descrição do Pilar"
                      value={newPillarDesc}
                      onChange={(e) => setNewPillarDesc(e.target.value)}
                      className="px-3 py-1.5 border border-slate-300 rounded-xl text-xs bg-slate-50 md:col-span-2"
                    />
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1">Ícone Ilustrativo</label>
                      <select
                        value={newPillarIcon}
                        onChange={(e) => setNewPillarIcon(e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-xl text-xs bg-slate-50"
                      >
                        <option value="Repeat">Repeat (Alternância)</option>
                        <option value="GraduationCap">GraduationCap (Ensino Técnico)</option>
                        <option value="Sprout">Sprout (Agroecologia)</option>
                        <option value="Users">Users (Comunidade)</option>
                        <option value="Tractor">Tractor (Campo)</option>
                        <option value="Leaf">Leaf (Sustentabilidade)</option>
                        <option value="Utensils">Utensils (Agroindústria)</option>
                      </select>
                    </div>
                    <div className="md:col-span-2 flex items-end">
                      <button
                        type="button"
                        onClick={() => {
                          if (!newPillarTitle.trim()) return;
                          setHomePillarsList([...homePillarsList, { title: newPillarTitle, desc: newPillarDesc, icon: newPillarIcon }]);
                          setNewPillarTitle('');
                          setNewPillarDesc('');
                        }}
                        className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Plus size={14} /> Adicionar Pilar à Lista
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SEÇÃO 2: BLOCO CURSOS TÉCNICOS INTEGRADOS */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-6">
              {renderSectionHeader('homeCourses', '2. BLOCO CURSOS TÉCNICOS INTEGRADOS', 'courses')}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Badge / Tag dos Cursos</label>
                  <input
                    type="text"
                    value={homeCoursesBadge}
                    onChange={(e) => setHomeCoursesBadge(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Título do Bloco de Cursos</label>
                  <input
                    type="text"
                    value={homeCoursesTitle}
                    onChange={(e) => setHomeCoursesTitle(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900"
                  />
                </div>
              </div>

              {/* Lista de Cursos na Home */}
              <div className="space-y-3 pt-2">
                <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider flex items-center justify-between">
                  <span>Cartões de Cursos (Edição & Ordenação)</span>
                  <span className="text-emerald-700 text-[11px] font-bold">{homeCoursesList.length} cursos</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {homeCoursesList.map((curso, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-xl border-2 border-emerald-100 hover:border-emerald-400 space-y-3 shadow-2xs relative transition-colors">
                      <div className="flex items-center justify-between gap-2">
                        <input
                          type="text"
                          value={curso.title}
                          onChange={(e) => {
                            const updated = [...homeCoursesList];
                            updated[idx].title = e.target.value;
                            setHomeCoursesList(updated);
                          }}
                          placeholder="Nome do Curso"
                          className="w-full px-2.5 py-1 text-xs font-bold border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-slate-50 focus:bg-white text-slate-900"
                        />
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => moveCourseUp(idx)}
                            disabled={idx === 0}
                            className="p-1 hover:bg-slate-100 text-slate-600 rounded disabled:opacity-30 cursor-pointer"
                            title="Mover curso para cima"
                          >
                            <ArrowUp size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveCourseDown(idx)}
                            disabled={idx === homeCoursesList.length - 1}
                            className="p-1 hover:bg-slate-100 text-slate-600 rounded disabled:opacity-30 cursor-pointer"
                            title="Mover curso para baixo"
                          >
                            <ArrowDown size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setHomeCoursesList(homeCoursesList.filter((_, i) => i !== idx))}
                            className="text-slate-400 hover:text-red-600 p-1 rounded-md cursor-pointer ml-1"
                            title="Excluir Curso"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      <input
                        type="text"
                        value={curso.tag}
                        onChange={(e) => {
                          const updated = [...homeCoursesList];
                          updated[idx].tag = e.target.value;
                          setHomeCoursesList(updated);
                        }}
                        placeholder="Destaque / Habilitação (ex: Diploma Técnico)"
                        className="w-full px-2.5 py-1 text-[11px] font-bold border border-amber-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500 bg-amber-50 text-amber-900"
                      />

                      <textarea
                        rows={3}
                        value={curso.desc}
                        onChange={(e) => {
                          const updated = [...homeCoursesList];
                          updated[idx].desc = e.target.value;
                          setHomeCoursesList(updated);
                        }}
                        placeholder="Descrição do curso..."
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-slate-50 focus:bg-white text-slate-700 leading-relaxed"
                      />

                      <div className="flex items-center justify-between gap-2 pt-1">
                        <div className="flex items-center gap-1.5">
                          <label className="text-[10px] font-bold text-slate-500 uppercase">Ícone:</label>
                          <select
                            value={curso.icon}
                            onChange={(e) => {
                              const updated = [...homeCoursesList];
                              updated[idx].icon = e.target.value;
                              setHomeCoursesList(updated);
                            }}
                            className="px-2 py-1 text-[11px] font-bold text-slate-800 bg-slate-100 border border-slate-300 rounded-lg cursor-pointer"
                          >
                            <option value="Tractor">Tractor (Agropecuária)</option>
                            <option value="Leaf">Leaf (Meio Ambiente)</option>
                            <option value="Utensils">Utensils (Agroindústria)</option>
                            <option value="Sprout">Sprout (Agroecologia)</option>
                            <option value="GraduationCap">GraduationCap (Geral)</option>
                          </select>
                        </div>
                        <span className="text-[10px] text-emerald-700 font-medium">✏️ Editável</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Adicionar Novo Curso na Home */}
                <div className="bg-white p-4 rounded-xl border-2 border-dashed border-emerald-200 space-y-3 mt-4">
                  <h5 className="font-bold text-xs text-emerald-900 flex items-center gap-1.5">
                    <Plus size={15} /> Adicionar Novo Curso à Home
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Nome do Curso (ex: Técnico em Agroecologia)"
                      value={newCourseTitle}
                      onChange={(e) => setNewCourseTitle(e.target.value)}
                      className="px-3 py-1.5 border border-slate-300 rounded-xl text-xs bg-slate-50"
                    />
                    <input
                      type="text"
                      placeholder="Destaque / Habilitação (ex: Diploma Técnico de Nível Médio)"
                      value={newCourseTag}
                      onChange={(e) => setNewCourseTag(e.target.value)}
                      className="px-3 py-1.5 border border-slate-300 rounded-xl text-xs bg-slate-50"
                    />
                    <textarea
                      placeholder="Descrição resumida do curso"
                      rows={2}
                      value={newCourseDesc}
                      onChange={(e) => setNewCourseDesc(e.target.value)}
                      className="px-3 py-1.5 border border-slate-300 rounded-xl text-xs bg-slate-50 md:col-span-2"
                    />
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1">Ícone</label>
                      <select
                        value={newCourseIcon}
                        onChange={(e) => setNewCourseIcon(e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-xl text-xs bg-slate-50"
                      >
                        <option value="Tractor">Tractor (Agropecuária)</option>
                        <option value="Leaf">Leaf (Meio Ambiente)</option>
                        <option value="Utensils">Utensils (Agroindústria)</option>
                        <option value="Sprout">Sprout (Agroecologia)</option>
                        <option value="GraduationCap">GraduationCap (Geral)</option>
                      </select>
                    </div>
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() => {
                          if (!newCourseTitle.trim()) return;
                          setHomeCoursesList([...homeCoursesList, { title: newCourseTitle, desc: newCourseDesc, tag: newCourseTag, icon: newCourseIcon }]);
                          setNewCourseTitle('');
                          setNewCourseDesc('');
                          setNewCourseTag('');
                        }}
                        className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Plus size={14} /> Adicionar Curso
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SEÇÃO 3: EDITAR MATRIZ CURRICULAR */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-6">
              {renderSectionHeader('homeMatrix', '3. GERENCIADOR DA MATRIZ CURRICULAR')}

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Texto do Botão de Chamada da Matriz Curricular na Home</label>
                  <input
                    type="text"
                    value={homeMatrixCurriculumText}
                    onChange={(e) => setHomeMatrixCurriculumText(e.target.value)}
                    placeholder="Ver matriz curricular completa"
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Descrição / Resumo da Matriz Curricular</label>
                  <textarea
                    rows={3}
                    value={homeMatrixCurriculumModalContent}
                    onChange={(e) => setHomeMatrixCurriculumModalContent(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 leading-relaxed"
                  />
                </div>

                {/* Tabela / Anos de Disciplinas da Matriz */}
                <div className="space-y-3 pt-2">
                  <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider flex items-center justify-between">
                    <span>Séries e Disciplinas da Matriz Curricular</span>
                    <span className="text-emerald-700 text-[11px] font-bold">{homeMatrixCurriculumSubjects.length} séries</span>
                  </h4>

                  <div className="space-y-3">
                    {homeMatrixCurriculumSubjects.map((item, idx) => (
                      <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 space-y-3 shadow-2xs">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2 w-full sm:w-auto">
                            <input
                              type="text"
                              value={item.year}
                              onChange={(e) => {
                                const updated = [...homeMatrixCurriculumSubjects];
                                updated[idx].year = e.target.value;
                                setHomeMatrixCurriculumSubjects(updated);
                              }}
                              placeholder="Série (ex: 1º Ano)"
                              className="w-28 px-2.5 py-1 text-xs font-extrabold border border-emerald-300 rounded-lg bg-emerald-50 text-emerald-900"
                            />
                            <input
                              type="text"
                              value={item.title}
                              onChange={(e) => {
                                const updated = [...homeMatrixCurriculumSubjects];
                                updated[idx].title = e.target.value;
                                setHomeMatrixCurriculumSubjects(updated);
                              }}
                              placeholder="Título da Série"
                              className="flex-1 sm:w-64 px-2.5 py-1 text-xs font-bold border border-slate-300 rounded-lg bg-slate-50 text-slate-900"
                            />
                          </div>

                          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                            <input
                              type="text"
                              value={item.ch}
                              onChange={(e) => {
                                const updated = [...homeMatrixCurriculumSubjects];
                                updated[idx].ch = e.target.value;
                                setHomeMatrixCurriculumSubjects(updated);
                              }}
                              placeholder="Carga Horária (ex: 1.200h)"
                              className="w-32 px-2.5 py-1 text-xs font-bold border border-amber-300 rounded-lg bg-amber-50 text-amber-900 text-right"
                            />
                            <button
                              type="button"
                              onClick={() => setHomeMatrixCurriculumSubjects(homeMatrixCurriculumSubjects.filter((_, i) => i !== idx))}
                              className="p-1.5 text-slate-400 hover:text-red-600 rounded-md cursor-pointer"
                              title="Excluir Série da Matriz"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 mb-1">Disciplinas e Componentes Curriculares</label>
                          <textarea
                            rows={2}
                            value={item.subjects}
                            onChange={(e) => {
                              const updated = [...homeMatrixCurriculumSubjects];
                              updated[idx].subjects = e.target.value;
                              setHomeMatrixCurriculumSubjects(updated);
                            }}
                            placeholder="Separe as disciplinas por vírgula..."
                            className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-slate-50 focus:bg-white text-slate-800 leading-relaxed"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Adicionar Série na Matriz */}
                  <div className="bg-white p-4 rounded-xl border-2 border-dashed border-emerald-200 space-y-3 mt-3">
                    <h5 className="font-bold text-xs text-emerald-900 flex items-center gap-1.5">
                      <Plus size={15} /> Adicionar Nova Série / Módulo à Matriz
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <input
                        type="text"
                        placeholder="Série (ex: Módulo Especial)"
                        value={newMatrixYear}
                        onChange={(e) => setNewMatrixYear(e.target.value)}
                        className="px-3 py-1.5 border border-slate-300 rounded-xl text-xs bg-slate-50"
                      />
                      <input
                        type="text"
                        placeholder="Título (ex: Formação Específica)"
                        value={newMatrixTitle}
                        onChange={(e) => setNewMatrixTitle(e.target.value)}
                        className="px-3 py-1.5 border border-slate-300 rounded-xl text-xs bg-slate-50"
                      />
                      <input
                        type="text"
                        placeholder="Carga Horária (ex: 800h)"
                        value={newMatrixCh}
                        onChange={(e) => setNewMatrixCh(e.target.value)}
                        className="px-3 py-1.5 border border-slate-300 rounded-xl text-xs bg-slate-50"
                      />
                      <textarea
                        placeholder="Disciplinas..."
                        rows={2}
                        value={newMatrixSubjects}
                        onChange={(e) => setNewMatrixSubjects(e.target.value)}
                        className="px-3 py-1.5 border border-slate-300 rounded-xl text-xs bg-slate-50 sm:col-span-3"
                      />
                      <div className="sm:col-span-3 flex justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            if (!newMatrixYear.trim()) return;
                            setHomeMatrixCurriculumSubjects([
                              ...homeMatrixCurriculumSubjects,
                              { year: newMatrixYear, title: newMatrixTitle, subjects: newMatrixSubjects, ch: newMatrixCh }
                            ]);
                            setNewMatrixYear('');
                            setNewMatrixTitle('');
                            setNewMatrixSubjects('');
                            setNewMatrixCh('');
                          }}
                          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer"
                        >
                          <Plus size={14} /> Adicionar Série à Matriz
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SEÇÃO 4: EDITAR BLOCO FALE CONOSCO (PROCESSO SELETIVO & PRÉ-MATRÍCULA) */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-6">
              {renderSectionHeader('homeContact', '4. BLOCO FALE CONOSCO (PROCESSO SELETIVO & PRÉ-MATRÍCULA)', 'contact')}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Badge / Tag do Bloco</label>
                  <input
                    type="text"
                    value={homeContactBadge}
                    onChange={(e) => setHomeContactBadge(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Título Principal</label>
                  <input
                    type="text"
                    value={homeContactTitle}
                    onChange={(e) => setHomeContactTitle(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Texto Explicativo de Apresentação</label>
                  <textarea
                    rows={2}
                    value={homeContactDesc}
                    onChange={(e) => setHomeContactDesc(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Telefones / Atendimento (Exibido no Bloco Verde)</label>
                  <input
                    type="text"
                    value={homeContactPhone}
                    onChange={(e) => setHomeContactPhone(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">E-mail de Contato</label>
                  <input
                    type="text"
                    value={homeContactEmail}
                    onChange={(e) => setHomeContactEmail(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Endereço / Unidades Exibidas no Bloco</label>
                  <input
                    type="text"
                    value={homeContactAddress}
                    onChange={(e) => setHomeContactAddress(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Título da Ficha / Formulário</label>
                  <input
                    type="text"
                    value={homeContactFormTitle}
                    onChange={(e) => setHomeContactFormTitle(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Texto do Botão de Envio</label>
                  <input
                    type="text"
                    value={homeContactButtonText}
                    onChange={(e) => setHomeContactButtonText(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* SEÇÃO 5: BLOCO COMUNICADOS E FOTOS */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-6">
              {renderSectionHeader('homeMedia', '5. BLOCO COMUNICADOS & FOTOS DA ROTINA')}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Título da Seção de Comunicados na Home</label>
                  <input
                    type="text"
                    value={homeNoticesTitle}
                    onChange={(e) => setHomeNoticesTitle(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Título da Seção de Fotos na Home</label>
                  <input
                    type="text"
                    value={homePhotosTitle}
                    onChange={(e) => setHomePhotosTitle(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  const updatedSettings: SiteHeaderFooterSettings = {
                    ...siteForm,
                    homePillarsBadge,
                    homePillarsTitle,
                    homePillarsSubtitle,
                    homePillarsList,
                    homeCoursesBadge,
                    homeCoursesTitle,
                    homeCoursesList,
                    homeNoticesTitle,
                    homePhotosTitle,
                    homeSectionOrder,
                    hiddenHomeSections,
                    homeContactBadge,
                    homeContactTitle,
                    homeContactDesc,
                    homeContactPhone,
                    homeContactEmail,
                    homeContactAddress,
                    homeContactFormTitle,
                    homeContactButtonText,
                    homeMatrixCurriculumText,
                    homeMatrixCurriculumModalContent,
                    homeMatrixCurriculumSubjects
                  };
                  setSiteForm(updatedSettings);
                  if (onUpdateSiteSettings) onUpdateSiteSettings(updatedSettings);
                  setHomeSuccessMsg('Alterações salvas e publicadas no site!');
                  setTimeout(() => setHomeSuccessMsg(''), 4000);
                }}
                className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Save size={18} /> Salvar e Publicar Alterações na Home
              </button>
            </div>
          </div>
        )}

        {/* TAB 1: GERENCIADOR DO MENU PRINCIPAL E SUBMENUS */}
        {activeTab === 'menu' && canAccess(currentUser, 'menu') && (
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-3xl border border-slate-200">
              {renderSectionHeader('menu', '3. GERENCIADOR DO MENU & ESTRUTURA')}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Form criar ou editar item de menu / submenu / pagina */}
            <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
              <h2 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FolderPlus size={18} className="text-emerald-700" />
                  <span>{editingMenuItem ? 'Editar Item do Menu' : 'Adicionar Menu ou Submenu'}</span>
                </div>
                {editingMenuItem && (
                  <button
                    type="button"
                    onClick={handleCancelEditMenuItem}
                    className="text-xs text-slate-500 hover:text-slate-800 underline font-medium"
                  >
                    Cancelar
                  </button>
                )}
              </h2>

              <p className="text-xs text-slate-500">
                Crie um item principal ou selecione um <strong>Menu Pai</strong> para criar um <strong>Submenu</strong> suspenso. Uma página correspondente será gerada automaticamente.
              </p>

              {menuSuccessMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600" />
                  <span>{menuSuccessMsg}</span>
                </div>
              )}

              <form onSubmit={handleAddMenuSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Localização no Menu (Menu Pai)</label>
                  <select
                    value={selectedParentId}
                    onChange={(e) => setSelectedParentId(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden font-medium bg-slate-50"
                  >
                    <option value="">📌 Menu Principal (Item de 1º Nível)</option>
                    {menuItems
                      .filter((m) => !m.parentId)
                      .sort((a, b) => a.order - b.order)
                      .map((p) => {
                        const level2Items = menuItems
                          .filter((s) => s.parentId === p.id)
                          .sort((a, b) => a.order - b.order);

                        return (
                          <React.Fragment key={p.id}>
                            <option value={p.id}>
                              ↳ Submenu de 2º Nível sob: {p.label}
                            </option>
                            {level2Items.map((s2) => (
                              <option key={s2.id} value={s2.id}>
                                &nbsp;&nbsp;&nbsp;&nbsp;↳ 3ª Via / Sub-submenu sob: {s2.label}
                              </option>
                            ))}
                          </React.Fragment>
                        );
                      })}
                  </select>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    {selectedParentId
                      ? `Este item aparecerá no menu suspenso (dropdown) de "${menuItems.find((m) => m.id === selectedParentId)?.label}".`
                      : 'Este item aparecerá diretamente na barra de navegação principal.'}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nome do Item / Submenu (Label)</label>
                  <input
                    type="text"
                    value={newMenuLabel}
                    onChange={(e) => setNewMenuLabel(e.target.value)}
                    placeholder="Ex: Nossa História, Projeto de Vida, Biblioteca..."
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Identificador da Rota / Slug (Opcional)</label>
                  <input
                    type="text"
                    value={newMenuSlug}
                    onChange={(e) => setNewMenuSlug(e.target.value)}
                    placeholder="Ex: historia, projeto-vida..."
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden"
                  />
                  <span className="text-[10px] text-slate-400">Deixe em branco para gerar automaticamente.</span>
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    {editingMenuItem ? <Save size={16} /> : <Plus size={16} />}
                    <span>
                      {editingMenuItem
                        ? 'Salvar Alterações'
                        : selectedParentId
                        ? 'Criar Submenu & Página'
                        : 'Criar Item de Menu Principal'}
                    </span>
                  </button>

                  {editingMenuItem && (
                    <button
                      type="button"
                      onClick={handleCancelEditMenuItem}
                      className="px-4 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-2.5 rounded-xl text-xs cursor-pointer"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Lista Hierárquica e Reordenação de Menus e Submenus */}
            <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">
                    Estrutura de Menus & Submenus
                  </h2>
                  <p className="text-xs text-slate-500">Organização hierárquica do site da EFABE</p>
                </div>
                <span className="text-xs text-slate-500 font-medium">Use as setas para reordenar</span>
              </div>

              <div className="space-y-3">
                {menuItems
                  .filter((m) => !m.parentId)
                  .sort((a, b) => a.order - b.order)
                  .map((parentItem, pIdx, parentArray) => {
                    const subItems = menuItems
                      .filter((s) => s.parentId === parentItem.id)
                      .sort((a, b) => a.order - b.order);

                    return (
                      <div key={parentItem.id} className="space-y-1.5">
                        {/* Parent Item Card */}
                        <div
                          className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 transition-colors ${
                            parentItem.visible ? 'bg-slate-50 border-slate-200' : 'bg-slate-100/70 border-slate-200 opacity-60'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {/* Reorder Buttons Level 1 */}
                            <div className="flex flex-col gap-0.5">
                              <button
                                disabled={pIdx === 0}
                                onClick={() => handleMoveMenuItem(parentArray, pIdx, 'up')}
                                className="text-slate-500 hover:text-emerald-700 disabled:opacity-30 p-0.5 rounded cursor-pointer"
                                title="Mover para cima"
                              >
                                <ArrowUp size={14} />
                              </button>
                              <button
                                disabled={pIdx === parentArray.length - 1}
                                onClick={() => handleMoveMenuItem(parentArray, pIdx, 'down')}
                                className="text-slate-500 hover:text-emerald-700 disabled:opacity-30 p-0.5 rounded cursor-pointer"
                                title="Mover para baixo"
                              >
                                <ArrowDown size={14} />
                              </button>
                            </div>

                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-extrabold text-xs text-slate-900 notranslate" translate="no">{parentItem.label}</span>
                                {subItems.length > 0 && (
                                  <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                                    {subItems.length} submenu{subItems.length > 1 ? 's' : ''}
                                  </span>
                                )}
                                {parentItem.isCustom && (
                                  <span className="text-[9px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.5 rounded">
                                    Customizado
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-slate-500 font-mono notranslate" translate="no">Rota: /{parentItem.slug}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 flex-wrap">
                            {/* Personalize Page Content Button */}
                            <button
                              onClick={() => handleGoToEditPageFromMenu(parentItem.slug, parentItem.label)}
                              className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-100 text-amber-950 border border-amber-300 hover:bg-amber-200 transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
                              title={`Personalizar texto, imagens e blocos da página ${parentItem.label}`}
                            >
                              <FileText size={12} className="text-amber-700" />
                              <span>✏️ Personalizar Página</span>
                            </button>

                            {/* Quick Add Submenu */}
                            <button
                              onClick={() => {
                                setSelectedParentId(parentItem.id);
                                setNewMenuLabel('');
                                setNewMenuSlug('');
                                setEditingMenuItem(null);
                              }}
                              className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors flex items-center gap-1 cursor-pointer"
                              title="Adicionar submenu sob este item"
                            >
                              <Plus size={12} />
                              <span>Submenu</span>
                            </button>

                            {/* Edit Item */}
                            <button
                              onClick={() => handleStartEditMenuItem(parentItem)}
                              className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-slate-100 rounded-lg"
                              title="Editar item"
                            >
                              <Edit3 size={14} />
                            </button>

                            {/* Toggle Visibility */}
                            <button
                              onClick={() => onUpdateMenuItem({ ...parentItem, visible: !parentItem.visible })}
                              className={`px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer ${
                                parentItem.visible
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-slate-200 text-slate-600'
                              }`}
                              title={parentItem.visible ? 'Ocultar no site' : 'Exibir no site'}
                            >
                              {parentItem.visible ? <Eye size={13} /> : <EyeOff size={13} />}
                            </button>

                            {/* Delete Item (All Level 1 Items) */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (confirm(`Deseja realmente remover o item de menu "${parentItem.label}" e seus submenus?`)) {
                                  onDeleteMenuItem(parentItem.id);
                                  onDeletePage(parentItem.slug);
                                }
                              }}
                              className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 cursor-pointer"
                              title="Excluir item de menu"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>

                        {/* Nested Submenu List (Level 2 & Level 3) */}
                        {subItems.length > 0 && (
                          <div className="pl-6 space-y-2 border-l-2 border-emerald-200 ml-4 py-1">
                            {subItems.map((subItem, sIdx) => {
                              const subSubItems = menuItems
                                .filter((ss) => ss.parentId === subItem.id)
                                .sort((a, b) => a.order - b.order);

                              return (
                                <div key={subItem.id} className="space-y-1.5">
                                  <div
                                    className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 transition-colors ${
                                      subItem.visible ? 'bg-emerald-50/50 border-emerald-100' : 'bg-slate-100/70 border-slate-200 opacity-60'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2">
                                      {/* Reorder Buttons Level 2 */}
                                      <div className="flex flex-col gap-0.5">
                                        <button
                                          disabled={sIdx === 0}
                                          onClick={() => handleMoveMenuItem(subItems, sIdx, 'up')}
                                          className="text-emerald-600 hover:text-emerald-800 disabled:opacity-20 p-0.5 rounded cursor-pointer"
                                          title="Mover submenu para cima"
                                        >
                                          <ArrowUp size={12} />
                                        </button>
                                        <button
                                          disabled={sIdx === subItems.length - 1}
                                          onClick={() => handleMoveMenuItem(subItems, sIdx, 'down')}
                                          className="text-emerald-600 hover:text-emerald-800 disabled:opacity-20 p-0.5 rounded cursor-pointer"
                                          title="Mover submenu para baixo"
                                        >
                                          <ArrowDown size={12} />
                                        </button>
                                      </div>

                                      <CornerDownRight size={14} className="text-emerald-600 shrink-0" />
                                      <div>
                                        <div className="flex items-center gap-2">
                                          <span className="font-bold text-xs text-slate-800 notranslate" translate="no">{subItem.label}</span>
                                          {subSubItems.length > 0 && (
                                            <span className="text-[8px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded-full">
                                              {subSubItems.length} sub-subitem{subSubItems.length > 1 ? 's' : ''} (3ª via)
                                            </span>
                                          )}
                                          {subItem.isCustom && (
                                            <span className="text-[8px] bg-blue-100 text-blue-800 font-bold px-1 rounded">
                                              Custom
                                            </span>
                                          )}
                                        </div>
                                        <span className="text-[10px] text-slate-500 font-mono notranslate" translate="no">Rota: /{subItem.slug}</span>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-1 flex-wrap">
                                      {/* Personalize Page Content Button for Submenu */}
                                      <button
                                        type="button"
                                        onClick={() => handleGoToEditPageFromMenu(subItem.slug, subItem.label)}
                                        className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-950 border border-amber-300 hover:bg-amber-200 transition-colors flex items-center gap-1 cursor-pointer"
                                        title={`Personalizar página ${subItem.label}`}
                                      >
                                        <FileText size={11} className="text-amber-800" />
                                        <span>✏️ Personalizar</span>
                                      </button>

                                      {/* Quick Add 3rd Level Sub-submenu */}
                                      <button
                                        onClick={() => {
                                          setSelectedParentId(subItem.id);
                                          setNewMenuLabel('');
                                          setNewMenuSlug('');
                                          setEditingMenuItem(null);
                                        }}
                                        className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 transition-colors flex items-center gap-1 cursor-pointer"
                                        title="Adicionar sub-submenu (3ª via) sob este item"
                                      >
                                        <Plus size={11} />
                                        <span>3ª Via</span>
                                      </button>

                                      {/* Edit Submenu */}
                                      <button
                                        onClick={() => handleStartEditMenuItem(subItem)}
                                        className="p-1 text-slate-600 hover:text-emerald-700 hover:bg-slate-100 rounded-lg"
                                        title="Editar submenu"
                                      >
                                        <Edit3 size={13} />
                                      </button>

                                      {/* Toggle Visibility */}
                                      <button
                                        onClick={() => onUpdateMenuItem({ ...subItem, visible: !subItem.visible })}
                                        className={`px-2 py-0.5 rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer ${
                                          subItem.visible
                                            ? 'bg-emerald-100 text-emerald-800'
                                            : 'bg-slate-200 text-slate-600'
                                        }`}
                                        title={subItem.visible ? 'Ocultar' : 'Exibir'}
                                      >
                                        {subItem.visible ? <Eye size={12} /> : <EyeOff size={12} />}
                                      </button>

                                      {/* Delete Submenu */}
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          if (confirm(`Deseja remover o submenu "${subItem.label}" e seus sub-itens?`)) {
                                            onDeleteMenuItem(subItem.id);
                                            onDeletePage(subItem.slug);
                                          }
                                        }}
                                        className="text-slate-400 hover:text-red-600 p-1 rounded-lg hover:bg-red-50 cursor-pointer"
                                        title="Excluir submenu"
                                      >
                                        <Trash2 size={13} />
                                      </button>
                                    </div>
                                  </div>

                                  {/* Level 3 items (3ª Via) */}
                                  {subSubItems.length > 0 && (
                                    <div className="pl-6 space-y-1 border-l-2 border-amber-300 ml-4 py-0.5">
                                      {subSubItems.map((ssItem, ssIdx) => (
                                        <div
                                          key={ssItem.id}
                                          className={`p-2 rounded-lg border flex items-center justify-between gap-2 transition-colors ${
                                            ssItem.visible ? 'bg-amber-50/40 border-amber-200/60' : 'bg-slate-100/70 border-slate-200 opacity-60'
                                          }`}
                                        >
                                          <div className="flex items-center gap-2">
                                            {/* Reorder Buttons Level 3 */}
                                            <div className="flex flex-col gap-0.5">
                                              <button
                                                disabled={ssIdx === 0}
                                                onClick={() => handleMoveMenuItem(subSubItems, ssIdx, 'up')}
                                                className="text-amber-700 hover:text-amber-900 disabled:opacity-20 p-0.5 rounded cursor-pointer"
                                                title="Mover para cima"
                                              >
                                                <ArrowUp size={11} />
                                              </button>
                                              <button
                                                disabled={ssIdx === subSubItems.length - 1}
                                                onClick={() => handleMoveMenuItem(subSubItems, ssIdx, 'down')}
                                                className="text-amber-700 hover:text-amber-900 disabled:opacity-20 p-0.5 rounded cursor-pointer"
                                                title="Mover para baixo"
                                              >
                                                <ArrowDown size={11} />
                                              </button>
                                            </div>

                                            <CornerDownRight size={12} className="text-amber-700 shrink-0" />
                                            <div>
                                              <div className="flex items-center gap-1.5">
                                                <span className="font-semibold text-[11px] text-slate-900">{ssItem.label}</span>
                                                <span className="text-[8px] bg-amber-200 text-amber-900 font-extrabold px-1 rounded">
                                                  3ª Via
                                                </span>
                                              </div>
                                              <span className="text-[9px] text-slate-500 font-mono">Rota: /{ssItem.slug}</span>
                                            </div>
                                          </div>

                                          <div className="flex items-center gap-1 flex-wrap">
                                            <button
                                              type="button"
                                              onClick={() => handleGoToEditPageFromMenu(ssItem.slug, ssItem.label)}
                                              className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-200 text-amber-950 border border-amber-300 hover:bg-amber-300 transition-colors flex items-center gap-0.5 cursor-pointer"
                                              title={`Personalizar página ${ssItem.label}`}
                                            >
                                              <FileText size={10} className="text-amber-900" />
                                              <span>✏️ Personalizar</span>
                                            </button>

                                            <button
                                              onClick={() => handleStartEditMenuItem(ssItem)}
                                              className="p-1 text-slate-600 hover:text-amber-800 hover:bg-amber-100/50 rounded-md"
                                              title="Editar item da 3ª via"
                                            >
                                              <Edit3 size={12} />
                                            </button>

                                            <button
                                              onClick={() => onUpdateMenuItem({ ...ssItem, visible: !ssItem.visible })}
                                              className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1 cursor-pointer ${
                                                ssItem.visible
                                                  ? 'bg-amber-200 text-amber-900'
                                                  : 'bg-slate-200 text-slate-600'
                                              }`}
                                              title={ssItem.visible ? 'Ocultar' : 'Exibir'}
                                            >
                                              {ssItem.visible ? <Eye size={11} /> : <EyeOff size={11} />}
                                            </button>

                                            <button
                                              onClick={() => {
                                                if (confirm(`Deseja remover "${ssItem.label}"?`)) {
                                                  onDeleteMenuItem(ssItem.id);
                                                  onDeletePage(ssItem.slug);
                                                }
                                              }}
                                              className="text-slate-400 hover:text-red-600 p-1 rounded-md hover:bg-red-50"
                                              title="Excluir item da 3ª via"
                                            >
                                              <Trash2 size={12} />
                                            </button>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}

                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>

            </div>
          </div>
        )}

        {/* TAB 2: EDITAR PÁGINAS & BLOCOS (CMS & GERENCIADOR GERAL) */}
        {activeTab === 'pages' && canAccess(currentUser, 'pages') && (
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200 space-y-6">
            
            {renderSectionHeader('pages', '5. GERENCIADOR DE PÁGINAS DO SITE (CMS)')}

            {/* Top Bar Navigation for Pages: List View vs Edit View & Create Button */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                  <FileText className="text-emerald-700" size={22} />
                  <span>Gerenciador Geral de Páginas da EFABE</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Crie, edite, organize e remova qualquer página do site institucional.
                </p>
              </div>

              <div className="flex items-center gap-2.5 flex-wrap">
                <div className="bg-slate-100 p-1 rounded-2xl border border-slate-200 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setPageViewMode('list')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
                      pageViewMode === 'list'
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <Layers size={14} />
                    <span>Lista de Páginas ({pages.length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPageViewMode('edit')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
                      pageViewMode === 'edit'
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <Edit3 size={14} />
                    <span>Editor de Conteúdo</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleOpenCreatePageModal}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-xs transition-all cursor-pointer shrink-0"
                >
                  <Plus size={16} />
                  <span>Criar Nova Página</span>
                </button>
              </div>
            </div>

            {saveSuccessMsg && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center gap-2">
                <CheckCircle2 size={18} className="text-emerald-600" />
                <span>{saveSuccessMsg}</span>
              </div>
            )}

            {/* MODO 1: LISTA E QUADRO DE PÁGINAS (GRID CARDS) */}
            {pageViewMode === 'list' && (
              <div className="space-y-6">
                
                {/* Search and Category Filters */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                  <div className="relative flex-1">
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={pageSearchQuery}
                      onChange={(e) => setPageSearchQuery(e.target.value)}
                      placeholder="Buscar por título, URL slug ou subtítulo..."
                      className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden font-medium"
                    />
                    {pageSearchQuery && (
                      <button
                        type="button"
                        onClick={() => setPageSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xs"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 overflow-x-auto pb-1 sm:pb-0">
                    <button
                      type="button"
                      onClick={() => setPageCategoryFilter('all')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                        pageCategoryFilter === 'all'
                          ? 'bg-slate-900 text-white'
                          : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
                      }`}
                    >
                      Todas ({pages.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setPageCategoryFilter('standard')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                        pageCategoryFilter === 'standard'
                          ? 'bg-amber-600 text-white'
                          : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
                      }`}
                    >
                      📌 Padrão do Sistema ({pages.filter((p) => !p.isCustom).length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setPageCategoryFilter('custom')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                        pageCategoryFilter === 'custom'
                          ? 'bg-emerald-700 text-white'
                          : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
                      }`}
                    >
                      🌿 Criadas por Menus ({pages.filter((p) => p.isCustom).length})
                    </button>
                  </div>
                </div>

                {/* Grid of Pages */}
                {(() => {
                  const filtered = pages.filter((p) => {
                    const matchesSearch =
                      p.title.toLowerCase().includes(pageSearchQuery.toLowerCase()) ||
                      p.slug.toLowerCase().includes(pageSearchQuery.toLowerCase()) ||
                      (p.subtitle && p.subtitle.toLowerCase().includes(pageSearchQuery.toLowerCase()));

                    if (pageCategoryFilter === 'standard') return matchesSearch && !p.isCustom;
                    if (pageCategoryFilter === 'custom') return matchesSearch && p.isCustom;
                    return matchesSearch;
                  });

                  if (filtered.length === 0) {
                    return (
                      <div className="p-12 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-300 space-y-3">
                        <FileText size={36} className="mx-auto text-slate-400" />
                        <h3 className="text-sm font-extrabold text-slate-800">Nenhuma página encontrada</h3>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto">
                          Não encontramos resultados para a busca "{pageSearchQuery}". Tente limpar o filtro ou crie uma nova página.
                        </p>
                        <button
                          type="button"
                          onClick={handleOpenCreatePageModal}
                          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer mt-2"
                        >
                          <Plus size={14} />
                          <span>Criar Nova Página Agora</span>
                        </button>
                      </div>
                    );
                  }

                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {filtered.map((p) => (
                        <div
                          key={p.id || p.slug}
                          className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between group"
                        >
                          <div>
                            {/* Card Hero Preview */}
                            <div className="relative h-36 bg-slate-800 overflow-hidden">
                              <img
                                src={p.heroImage || 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=800'}
                                alt={p.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=800';
                                }}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                              <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                                <span
                                  className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-xs ${
                                    p.isCustom
                                      ? 'bg-emerald-600 text-white'
                                      : 'bg-amber-500 text-slate-950'
                                  }`}
                                >
                                  {p.isCustom ? '🌿 Personalizada' : '📌 Padrão'}
                                </span>

                                <span className="text-[10px] font-mono font-bold bg-slate-900/90 text-amber-300 px-2 py-0.5 rounded-lg border border-slate-700">
                                  /{p.slug}
                                </span>
                              </div>

                              <div className="absolute bottom-2.5 left-3 right-3 text-white">
                                <h3 className="font-extrabold text-sm leading-tight text-amber-100 drop-shadow-xs line-clamp-1">
                                  {p.title}
                                </h3>
                              </div>
                            </div>

                            {/* Card Details */}
                            <div className="p-4 space-y-2.5">
                              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                                {p.subtitle || p.heroText || 'Sem subtítulo cadastrado.'}
                              </p>

                              <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-500 border-t border-slate-100 pt-2.5">
                                <span className="flex items-center gap-1 text-slate-700">
                                  <Layers size={13} className="text-emerald-700" />
                                  <span>{p.blocks?.length || 0} bloco(s)</span>
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1 text-slate-500">
                                  <Calendar size={13} />
                                  <span>{p.updatedAt || 'Recente'}</span>
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Card Actions Footer */}
                          <div className="p-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                handlePageSelect(p.slug);
                                setPageViewMode('edit');
                              }}
                              className="flex-1 py-2 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                            >
                              <Edit3 size={13} />
                              <span>Editar Página</span>
                            </button>

                            <button
                              type="button"
                              onClick={onOpenPublicSite}
                              className="p-2 bg-white hover:bg-slate-200 text-slate-700 rounded-xl text-xs border border-slate-300 transition-colors cursor-pointer"
                              title="Visualizar no site"
                            >
                              <Globe size={14} className="text-emerald-700" />
                            </button>

                            {p.isCustom && (
                              <button
                                type="button"
                                onClick={() => handleConfirmDeletePage(p.slug, p.title)}
                                className="p-2 bg-white hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-xl text-xs border border-slate-300 hover:border-red-200 transition-colors cursor-pointer"
                                title="Excluir página"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            )}

            {/* MODO 2: EDITOR ROBUSTO DE CONTEÚDO E BLOCOS */}
            {pageViewMode === 'edit' && (
              <div className="space-y-6">
                
                {/* Editor Header Navigation Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-emerald-50/80 p-4 rounded-2xl border border-emerald-200">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setPageViewMode('list')}
                      className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1 border border-slate-300 transition-colors cursor-pointer shadow-2xs"
                    >
                      <ArrowLeft size={14} />
                      <span>Voltar para Lista</span>
                    </button>

                    <div>
                      <span className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-800 block">
                        Editando Página:
                      </span>
                      <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                        <span>{currentPageToEdit.title}</span>
                        <span className="text-xs font-mono font-normal text-emerald-700">
                          (/{currentPageToEdit.slug})
                        </span>
                      </h3>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <select
                      value={selectedPageSlug}
                      onChange={(e) => handlePageSelect(e.target.value)}
                      className="px-3 py-1.5 bg-white border border-emerald-600 rounded-xl text-xs font-bold text-slate-900 outline-hidden"
                    >
                      <optgroup label="📌 Páginas Padrão">
                        {pages.filter((p) => !p.isCustom).map((p) => (
                          <option key={p.id} value={p.slug}>📄 {p.title}</option>
                        ))}
                      </optgroup>
                      <optgroup label="🌿 Páginas Personalizadas">
                        {pages.filter((p) => p.isCustom).map((p) => (
                          <option key={p.id} value={p.slug}>✏️ {p.title}</option>
                        ))}
                      </optgroup>
                    </select>

                    <button
                      type="button"
                      onClick={() => setShowLivePreview(!showLivePreview)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-colors cursor-pointer ${
                        showLivePreview
                          ? 'bg-amber-500 text-slate-950 border-amber-600 font-extrabold'
                          : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      <Eye size={14} />
                      <span>{showLivePreview ? 'Ocultar Prévia' : 'Pré-visualizar Página'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={onOpenPublicSite}
                      className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1 border border-slate-300 cursor-pointer"
                    >
                      <Globe size={14} className="text-emerald-700" />
                      <span>Ver no Site</span>
                    </button>
                  </div>
                </div>

                {/* PAINEL DE PRÉ-VISUALIZAÇÃO EM TEMPO REAL (LIVE PREVIEW BOX) */}
                {showLivePreview && (
                  <div className="p-6 bg-slate-900 rounded-3xl border-4 border-amber-400 space-y-6 shadow-xl text-slate-100">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-2">
                        <Sparkles size={18} className="text-amber-400" />
                        <h3 className="text-xs font-extrabold text-amber-300 uppercase tracking-wider">
                          Pré-visualização em Tempo Real (Como o público enxerga a página)
                        </h3>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">EFABE Public View</span>
                    </div>

                    {/* Banner Hero Preview */}
                    <div className="relative rounded-2xl overflow-hidden min-h-[160px] bg-slate-800 flex items-center p-6 border border-slate-700">
                      <img
                        src={editHeroImage}
                        alt="Hero Preview"
                        className="absolute inset-0 w-full h-full object-cover opacity-35"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=1200';
                        }}
                      />
                      <div className="relative z-10 space-y-2 max-w-2xl">
                        <span className="text-[10px] uppercase font-extrabold bg-amber-400 text-slate-950 px-2.5 py-1 rounded-full">
                          {editSubtitle || 'EFABE - Escola Família Agrícola'}
                        </span>
                        <h2 className="text-2xl font-black text-white drop-shadow-md">
                          {editTitle || 'Título da Página'}
                        </h2>
                        <p className="text-xs text-amber-100/90 font-medium leading-relaxed">
                          {editHeroText || 'Descrição de introdução'}
                        </p>
                      </div>
                    </div>

                    {/* Body Text Preview */}
                    <div className="bg-white text-slate-900 p-6 rounded-2xl shadow-sm space-y-4">
                      <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider border-b pb-2">
                        Apresentação Principal
                      </h4>
                      <div
                        className="prose prose-sm max-w-none text-slate-800 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: editBodyText || '<p><em>Nenhum texto principal cadastrado.</em></p>' }}
                      />
                    </div>

                    {/* Blocks Preview */}
                    {editBlocks.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-xs font-extrabold text-amber-300 uppercase tracking-wider">
                          Blocos de Conteúdo Adicionais ({editBlocks.length})
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {editBlocks.map((b, i) => (
                            <div key={b.id || i} className="p-4 bg-slate-800/90 rounded-2xl border border-slate-700 space-y-2 text-xs">
                              <span className="text-[10px] font-bold text-amber-400 uppercase px-2 py-0.5 bg-slate-900 rounded">
                                Bloco #{i + 1}: {b.type}
                              </span>
                              {b.title && <h5 className="font-extrabold text-white text-sm">{b.title}</h5>}
                              <div
                                className="text-slate-300 line-clamp-3"
                                dangerouslySetInnerHTML={{ __html: b.content.replace(/<[^>]+>/g, ' ') }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* FORMULÁRIO COMPLETO DE EDIÇÃO DA PÁGINA */}
                <form onSubmit={handleSavePage} className="space-y-6">
                  
                  {/* SEÇÃO 1: CABEÇALHO & HERO BANNER */}
                  <div className="p-5 bg-slate-50 rounded-3xl border border-slate-200 space-y-4">
                    <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider text-emerald-800 flex items-center gap-2 border-b border-slate-200 pb-2">
                      <Layout size={16} />
                      <span>1. Configurações de Identificação & Banner Hero</span>
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Título Principal da Página
                        </label>
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden font-extrabold"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Subtítulo / Slogan da Seção
                        </label>
                        <input
                          type="text"
                          value={editSubtitle}
                          onChange={(e) => setEditSubtitle(e.target.value)}
                          className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden font-bold"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        URL da Imagem de Destaque do Banner (Hero Image)
                      </label>
                      <input
                        type="text"
                        value={editHeroImage}
                        onChange={(e) => setEditHeroImage(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden font-mono"
                        required
                      />

                      {/* Quick Presets for Images */}
                      <div className="mt-2.5">
                        <span className="text-[11px] font-bold text-slate-600 block mb-1.5">
                          💡 Escolha uma imagem de exemplo rápida (Unsplash):
                        </span>
                        <div className="flex items-center gap-2 flex-wrap">
                          {sampleHeroImages.map((img, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setEditHeroImage(img.url)}
                              className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-300 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer"
                            >
                              📷 {img.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Texto de Introdução / Destaque no Banner (Hero Text)
                      </label>
                      <input
                        type="text"
                        value={editHeroText}
                        onChange={(e) => setEditHeroText(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden"
                        required
                      />
                    </div>
                  </div>

                  {/* SEÇÃO 2: CORPO PRINCIPAL DE TEXTO DA PÁGINA */}
                  <div className="p-5 bg-slate-50 rounded-3xl border border-slate-200 space-y-3">
                    <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider text-emerald-800 flex items-center gap-2 border-b border-slate-200 pb-2">
                      <FileText size={16} />
                      <span>2. Apresentação Principal e Conteúdo da Página</span>
                    </h3>

                    <RichTextEditor
                      label="Texto Formatado de Apresentação"
                      value={editBodyText}
                      onChange={setEditBodyText}
                      placeholder="Escreva a apresentação da página. Você pode formatar o texto, inserir imagens, links, vídeos do YouTube, tabelas ou listas..."
                      minRows={7}
                    />
                  </div>

                  {/* SEÇÃO 3: BLOCOS DE CONTEÚDO DINÂMICOS */}
                  <div className="p-5 bg-slate-50 rounded-3xl border border-slate-200 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider text-emerald-800 flex items-center gap-2">
                        <Layers size={16} />
                        <span>3. Blocos de Conteúdo Adicionais ({editBlocks.length})</span>
                      </h3>
                    </div>

                    {/* Lista de Blocos Cadastrados */}
                    {editBlocks.length > 0 ? (
                      <div className="space-y-3">
                        {editBlocks.map((blk, idx) => (
                          <div key={blk.id}>
                            {editingBlockId === blk.id ? (
                              <div className="p-5 bg-amber-50/80 rounded-2xl border-2 border-amber-300 space-y-3 shadow-xs">
                                <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                                  <h4 className="font-extrabold text-xs text-amber-950 flex items-center gap-1.5">
                                    <Edit3 size={14} className="text-amber-800" />
                                    <span>Editando Bloco #{idx + 1} ({blk.title || 'Sem título'})</span>
                                  </h4>
                                  <button
                                    type="button"
                                    onClick={() => setEditingBlockId(null)}
                                    className="text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
                                  >
                                    Cancelar
                                  </button>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  <div>
                                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Tipo de Bloco</label>
                                    <select
                                      value={editingBlockType}
                                      onChange={(e) => setEditingBlockType(e.target.value as any)}
                                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden font-bold"
                                    >
                                      <option value="text">Texto / Parágrafo Adicional</option>
                                      <option value="image">Imagem com Legenda</option>
                                      <option value="features">Cartão de Destaque</option>
                                      <option value="quote">Depoimento / Citação</option>
                                      <option value="alert">Caixa de Alerta / Nota Especial</option>
                                    </select>
                                  </div>

                                  <div>
                                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Título do Bloco</label>
                                    <input
                                      type="text"
                                      value={editingBlockTitle}
                                      onChange={(e) => setEditingBlockTitle(e.target.value)}
                                      placeholder="Título do bloco..."
                                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden font-bold"
                                    />
                                  </div>
                                </div>

                                {(editingBlockType === 'image' || editingBlockType === 'text') && (
                                  <div>
                                    <label className="block text-[11px] font-bold text-slate-700 mb-1">URL da Imagem</label>
                                    <input
                                      type="text"
                                      value={editingBlockImageUrl}
                                      onChange={(e) => setEditingBlockImageUrl(e.target.value)}
                                      placeholder="https://images.unsplash.com/..."
                                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden font-mono"
                                    />
                                  </div>
                                )}

                                <div>
                                  {editingBlockType === 'text' ? (
                                    <RichTextEditor
                                      label="Conteúdo / Texto do Bloco"
                                      value={editingBlockContent}
                                      onChange={setEditingBlockContent}
                                      placeholder="Conteúdo do bloco..."
                                      minRows={4}
                                    />
                                  ) : (
                                    <>
                                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                                        {editingBlockType === 'quote' ? 'Frase / Depoimento' : editingBlockType === 'image' ? 'Legenda da Imagem' : 'Conteúdo do Bloco'}
                                      </label>
                                      <textarea
                                        rows={3}
                                        value={editingBlockContent}
                                        onChange={(e) => setEditingBlockContent(e.target.value)}
                                        className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden"
                                      />
                                    </>
                                  )}
                                </div>

                                {editingBlockType === 'quote' && (
                                  <div>
                                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Autor do Depoimento</label>
                                    <input
                                      type="text"
                                      value={editingBlockCaption}
                                      onChange={(e) => setEditingBlockCaption(e.target.value)}
                                      placeholder="Ex: Ex-aluno e Produtor Rural"
                                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden"
                                    />
                                  </div>
                                )}

                                <div className="flex items-center gap-2 pt-2">
                                  <button
                                    type="button"
                                    onClick={handleSaveEditBlock}
                                    className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                                  >
                                    <CheckCircle2 size={14} />
                                    <span>Salvar Alterações no Bloco</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setEditingBlockId(null)}
                                    className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-3 py-2 rounded-xl text-xs cursor-pointer"
                                  >
                                    Cancelar
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="p-4 bg-white rounded-2xl border border-slate-200 flex items-start justify-between gap-4 hover:border-slate-300 transition-colors">
                                <div className="flex items-start gap-3">
                                  <div className="flex flex-col gap-1 pt-1">
                                    <button
                                      type="button"
                                      disabled={idx === 0}
                                      onClick={() => handleMoveBlock(idx, 'up')}
                                      className="text-slate-400 hover:text-emerald-700 disabled:opacity-30 cursor-pointer p-0.5"
                                      title="Mover para cima"
                                    >
                                      <ArrowUp size={14} />
                                    </button>
                                    <button
                                      type="button"
                                      disabled={idx === editBlocks.length - 1}
                                      onClick={() => handleMoveBlock(idx, 'down')}
                                      className="text-slate-400 hover:text-emerald-700 disabled:opacity-30 cursor-pointer p-0.5"
                                      title="Mover para baixo"
                                    >
                                      <ArrowDown size={14} />
                                    </button>
                                  </div>

                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
                                        {blk.type === 'text' && 'Parágrafo / Texto'}
                                        {blk.type === 'image' && 'Imagem com Legenda'}
                                        {blk.type === 'features' && 'Cartão de Destaque'}
                                        {blk.type === 'quote' && 'Citação / Depoimento'}
                                        {blk.type === 'alert' && 'Caixa de Alerta'}
                                      </span>
                                      {blk.title && <h4 className="font-bold text-xs text-slate-900">{blk.title}</h4>}
                                    </div>
                                    <div
                                      className="text-xs text-slate-600 line-clamp-2 max-w-xl"
                                      dangerouslySetInnerHTML={{ __html: blk.content.replace(/<[^>]+>/g, ' ') }}
                                    />
                                    {blk.imageUrl && (
                                      <div className="text-[10px] text-emerald-700 font-mono truncate max-w-md">
                                        Imagem: {blk.imageUrl}
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() => handleStartEditBlock(blk)}
                                    className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg cursor-pointer"
                                    title="Editar este bloco"
                                  >
                                    <Edit3 size={15} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveBlock(blk.id)}
                                    className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 cursor-pointer"
                                    title="Remover bloco"
                                  >
                                    <Trash2 size={15} />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 italic p-4 bg-white rounded-2xl border border-dashed border-slate-300">
                        Esta página ainda não possui blocos adicionais. Adicione o primeiro bloco abaixo.
                      </p>
                    )}

                    {/* Form Adicionar Bloco */}
                    <div className="p-5 bg-emerald-50/60 rounded-3xl border border-emerald-200 space-y-3">
                      <h4 className="font-bold text-xs text-emerald-950 flex items-center gap-1.5">
                        <Plus size={16} className="text-emerald-700" />
                        <span>Adicionar Novo Bloco de Conteúdo</span>
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">Tipo de Bloco</label>
                          <select
                            value={newBlockType}
                            onChange={(e) => setNewBlockType(e.target.value as any)}
                            className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden font-bold"
                          >
                            <option value="text">Texto / Parágrafo Adicional</option>
                            <option value="image">Imagem com Legenda</option>
                            <option value="features font-bold">Cartão de Destaque</option>
                            <option value="quote">Depoimento / Citação</option>
                            <option value="alert">Caixa de Alerta / Nota Especial</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">Título do Bloco (Opcional)</label>
                          <input
                            type="text"
                            value={newBlockTitle}
                            onChange={(e) => setNewBlockTitle(e.target.value)}
                            placeholder="Ex: Nossos Valores, Instalações..."
                            className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden"
                          />
                        </div>
                      </div>

                      {(newBlockType === 'image' || newBlockType === 'text') && (
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">URL da Imagem</label>
                          <input
                            type="text"
                            value={newBlockImageUrl}
                            onChange={(e) => setNewBlockImageUrl(e.target.value)}
                            placeholder="https://images.unsplash.com/..."
                            className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden font-mono"
                          />
                        </div>
                      )}

                      <div>
                        {newBlockType === 'text' ? (
                          <RichTextEditor
                            label="Conteúdo / Texto do Bloco"
                            value={newBlockContent}
                            onChange={setNewBlockContent}
                            placeholder="Digite as informações detalhadas do bloco. Use a barra para formatar texto, links, vídeos e anexos..."
                            minRows={4}
                          />
                        ) : (
                          <>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">
                              {newBlockType === 'quote' ? 'Frase / Depoimento' : newBlockType === 'image' ? 'Legenda da Imagem' : 'Conteúdo / Texto do Bloco'}
                            </label>
                            <textarea
                              rows={3}
                              value={newBlockContent}
                              onChange={(e) => setNewBlockContent(e.target.value)}
                              placeholder="Digite as informações detalhadas do bloco..."
                              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden"
                            />
                          </>
                        )}
                      </div>

                      {newBlockType === 'quote' && (
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">Autor do Depoimento</label>
                          <input
                            type="text"
                            value={newBlockCaption}
                            onChange={(e) => setNewBlockCaption(e.target.value)}
                            placeholder="Ex: Ex-aluno e Produtor Rural - Turma 2022"
                            className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden"
                          />
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={handleAddBlock}
                        className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        <Plus size={14} />
                        <span>Inserir Bloco na Lista</span>
                      </button>
                    </div>
                  </div>

                  {/* Actions Bar Footer */}
                  <div className="pt-4 flex items-center justify-between border-t border-slate-200">
                    {currentPageToEdit.isCustom ? (
                      <button
                        type="button"
                        onClick={() => handleConfirmDeletePage(currentPageToEdit.slug, currentPageToEdit.title)}
                        className="text-red-600 font-bold hover:bg-red-50 px-3.5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer border border-red-200 transition-colors"
                      >
                        <Trash2 size={15} />
                        <span>Excluir Esta Página</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-medium">
                        * Páginas padrão do sistema não podem ser excluídas, apenas editadas.
                      </span>
                    )}

                    <button
                      type="submit"
                      className="bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold px-6 py-3 rounded-xl text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
                    >
                      <Save size={16} />
                      <span>Salvar Todas as Alterações da Página</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* MODAL DE CRIAÇÃO DE NOVA PÁGINA */}
            {isCreateModalOpen && (
              <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
                <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-slate-200 shadow-2xl space-y-5 my-8">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
                        <FolderPlus size={20} />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-lg text-slate-900">Criar Nova Página para o Site</h3>
                        <p className="text-xs text-slate-500">
                          Preencha as informações básicas para publicar uma nova página no sistema EFABE.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsCreateModalOpen(false)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 cursor-pointer"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <form onSubmit={handleCreateNewPageSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Título da Página *
                        </label>
                        <input
                          type="text"
                          value={newPageTitle}
                          onChange={(e) => {
                            setNewPageTitle(e.target.value);
                            if (!newPageSlug) {
                              setNewPageSlug(generateSlug(e.target.value));
                            }
                          }}
                          placeholder="Ex: Conselho Escolar"
                          className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden font-extrabold"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          URL Amigável (Slug da Página)
                        </label>
                        <div className="flex items-center">
                          <span className="px-3 py-2 bg-slate-100 border border-r-0 border-slate-300 rounded-l-xl text-xs font-mono text-slate-500">
                            /
                          </span>
                          <input
                            type="text"
                            value={newPageSlug}
                            onChange={(e) => setNewPageSlug(generateSlug(e.target.value))}
                            placeholder="conselho-escolar"
                            className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-r-xl focus:ring-2 focus:ring-emerald-500 outline-hidden font-mono"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Subtítulo / Slogan da Página
                      </label>
                      <input
                        type="text"
                        value={newPageSubtitle}
                        onChange={(e) => setNewPageSubtitle(e.target.value)}
                        placeholder="Ex: Órgão colegiado deliberativo e comunitário da EFABE"
                        className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Texto de Introdução no Banner (Hero Text)
                      </label>
                      <input
                        type="text"
                        value={newPageHeroText}
                        onChange={(e) => setNewPageHeroText(e.target.value)}
                        placeholder="Ex: Conheça os membros e as decisões do Conselho de Escola da EFABE."
                        className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        URL da Imagem de Destaque (Banner Hero)
                      </label>
                      <input
                        type="text"
                        value={newPageHeroImage}
                        onChange={(e) => setNewPageHeroImage(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden font-mono"
                      />

                      <div className="mt-2">
                        <span className="text-[11px] font-bold text-slate-500 block mb-1">
                          Fotos sugeridas para o cabeçalho:
                        </span>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {sampleHeroImages.slice(0, 4).map((img, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => setNewPageHeroImage(img.url)}
                              className="px-2 py-0.5 bg-slate-100 hover:bg-emerald-50 text-slate-700 text-[10px] font-medium border border-slate-300 rounded-md cursor-pointer"
                            >
                              📷 {img.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={createMenuItemAlso}
                          onChange={(e) => setCreateMenuItemAlso(e.target.checked)}
                          className="w-4 h-4 text-emerald-700 rounded border-slate-300 focus:ring-emerald-500"
                        />
                        <span className="text-xs font-bold text-emerald-950">
                          Adicionar esta página automaticamente ao Menu de Navegação do Site
                        </span>
                      </label>

                      {createMenuItemAlso && (
                        <div className="pl-6 pt-1">
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Posição no Menu:
                          </label>
                          <select
                            value={newMenuParentId}
                            onChange={(e) => setNewMenuParentId(e.target.value)}
                            className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden font-medium"
                          >
                            <option value="">📌 Menu Principal (Item do Topo)</option>
                            {menuItems.map((m) => (
                              <option key={m.id} value={m.id}>
                                📂 Dentro de: {m.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-200">
                      <button
                        type="button"
                        onClick={() => setIsCreateModalOpen(false)}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                      >
                        Cancelar
                      </button>

                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-md cursor-pointer"
                      >
                        <Sparkles size={15} />
                        <span>Criar Página & Começar a Editar</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

          </div>
        )}

        {/* TAB 3: COMUNICADOS */}
        {activeTab === 'notices' && canAccess(currentUser, 'notices') && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Form criar / editar comunicado */}
            <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <Edit3 size={18} className="text-emerald-700" />
                  <span>{editingNotice ? 'Editar Comunicado' : 'Publicar Novo Comunicado'}</span>
                </h2>
                {editingNotice && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingNotice(null);
                      setNewNoticeTitle('');
                      setNewNoticeContent('');
                      setNewNoticeImg('');
                      setNewNoticePinned(false);
                    }}
                    className="text-xs text-slate-500 hover:text-slate-800 underline font-medium cursor-pointer"
                  >
                    Cancelar Edição
                  </button>
                )}
              </div>

              <form onSubmit={handleCreateNotice} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Título do Comunicado</label>
                  <input
                    type="text"
                    value={newNoticeTitle}
                    onChange={(e) => setNewNoticeTitle(e.target.value)}
                    placeholder="Ex: Reunião do 3º Trimestre"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Categoria</label>
                  <select
                    value={newNoticeCategory}
                    onChange={(e) => setNewNoticeCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden"
                  >
                    <option value="Geral">Geral</option>
                    <option value="Reuniões">Reuniões</option>
                    <option value="Calendário">Calendário</option>
                    <option value="Eventos">Eventos</option>
                    <option value="Pedagógico">Pedagógico</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">URL da Imagem (Opcional)</label>
                  <input
                    type="text"
                    value={newNoticeImg}
                    onChange={(e) => setNewNoticeImg(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden"
                  />
                </div>

                <div>
                  <RichTextEditor
                    label="Conteúdo Completo do Comunicado / Postagem"
                    value={newNoticeContent}
                    onChange={setNewNoticeContent}
                    placeholder="Escreva todas as informações do comunicado. Use a barra de ferramentas para formatar o texto, inserir links, imagens, vídeos ou anexar documentos..."
                    minRows={7}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="pinned"
                    checked={newNoticePinned}
                    onChange={(e) => setNewNoticePinned(e.target.checked)}
                    className="rounded-md text-emerald-600 focus:ring-emerald-500"
                  />
                  <label htmlFor="pinned" className="text-xs font-semibold text-slate-700">Fixar no topo do site</label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <Save size={15} />
                  <span>{editingNotice ? 'Salvar Alterações do Comunicado' : 'Publicar Comunicado'}</span>
                </button>
              </form>
            </div>

            {/* Lista de Comunicados existentes */}
            <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
              <h2 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-2 flex items-center justify-between">
                <span>Comunicados Ativos ({notices.length})</span>
                <span className="text-xs font-normal text-slate-500">Clique no ícone de lápis para editar</span>
              </h2>

              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {notices.map((n) => (
                  <div key={n.id} className={`p-4 rounded-2xl border flex items-start justify-between gap-3 transition-colors ${
                    editingNotice?.id === n.id ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-300' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-md">
                          {n.category}
                        </span>
                        {n.pinned && (
                          <span className="text-[9px] font-extrabold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md">
                            📌 Fixado
                          </span>
                        )}
                        <span className="text-[10px] text-slate-500 flex items-center gap-1">
                          <Calendar size={11} /> {n.date}
                        </span>
                      </div>
                      <h4 className="font-bold text-xs text-slate-900">{n.title}</h4>
                      <p className="text-[11px] text-slate-600 line-clamp-2">{n.content}</p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleStartEditNotice(n)}
                        className="text-slate-600 hover:text-emerald-700 bg-white border border-slate-200 p-1.5 rounded-lg hover:bg-emerald-50 transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-bold"
                        title="Editar comunicado"
                      >
                        <Edit3 size={14} />
                        <span className="hidden sm:inline">Editar</span>
                      </button>
                      <button
                        onClick={() => onDeleteNotice(n.id)}
                        className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                        title="Excluir comunicado"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 4: ROTINA ESCOLAR (FOTOS) */}
        {activeTab === 'routine' && canAccess(currentUser, 'routine') && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Form adicionar / editar foto */}
            <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <Camera size={18} className="text-amber-600" />
                  <span>{editingPhoto ? 'Editar Foto da Rotina' : 'Postar Foto na Rotina Escolar'}</span>
                </h2>
                {editingPhoto && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingPhoto(null);
                      setNewPhotoTitle('');
                      setNewPhotoDesc('');
                      setNewPhotoUrl('');
                    }}
                    className="text-xs text-slate-500 hover:text-slate-800 underline font-medium cursor-pointer"
                  >
                    Cancelar Edição
                  </button>
                )}
              </div>

              <form onSubmit={handleCreatePhoto} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Título da Atividade</label>
                  <input
                    type="text"
                    value={newPhotoTitle}
                    onChange={(e) => setNewPhotoTitle(e.target.value)}
                    placeholder="Ex: Aula prática de horticultura"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">URL da Imagem</label>
                  <input
                    type="text"
                    value={newPhotoUrl}
                    onChange={(e) => setNewPhotoUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Turma</label>
                    <select
                      value={newPhotoTurma}
                      onChange={(e) => setNewPhotoTurma(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden"
                    >
                      <option value="1º Ano - Agropecuária">1º Ano - Agropecuária</option>
                      <option value="2º Ano - Téc. Agropecuária">2º Ano - Téc. Agropecuária</option>
                      <option value="3º Ano - Meio Ambiente">3º Ano - Meio Ambiente</option>
                      <option value="Todas as Turmas">Todas as Turmas</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Categoria</label>
                    <select
                      value={newPhotoCat}
                      onChange={(e) => setNewPhotoCat(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden"
                    >
                      <option value="Aulas Práticas">Aulas Práticas</option>
                      <option value="Agroecologia">Agroecologia</option>
                      <option value="Vivência Comunitária">Vivência Comunitária</option>
                      <option value="Laboratório">Laboratório</option>
                      <option value="Projetos">Projetos</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Legenda / Relato Curto</label>
                  <textarea
                    rows={3}
                    value={newPhotoDesc}
                    onChange={(e) => setNewPhotoDesc(e.target.value)}
                    placeholder="Descreva a vivência dos alunos..."
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <Save size={15} />
                  <span>{editingPhoto ? 'Salvar Alterações da Foto' : 'Publicar Foto na Galeria'}</span>
                </button>
              </form>
            </div>

            {/* Lista de fotos */}
            <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
              <h2 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-2">
                Galeria da Rotina Publicada ({routinePhotos.length})
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-1">
                {routinePhotos.map((p) => (
                  <div key={p.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-2">
                    <div className="h-32 rounded-xl overflow-hidden relative">
                      <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" />
                      <div className="absolute top-2 right-2 flex items-center gap-1">
                        <button
                          onClick={() => handleStartEditPhoto(p)}
                          className="bg-slate-900/80 text-white hover:text-emerald-300 p-1.5 rounded-full cursor-pointer shadow-xs"
                          title="Editar foto"
                        >
                          <Edit3 size={13} />
                        </button>
                        <button
                          onClick={() => onDeleteRoutinePhoto(p.id)}
                          className="bg-slate-900/80 text-white hover:text-red-400 p-1.5 rounded-full cursor-pointer shadow-xs"
                          title="Excluir foto"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                    <div>
                      <span className="text-[9px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md">
                        {p.turma}
                      </span>
                      <h4 className="font-bold text-xs text-slate-900 mt-1 line-clamp-1">{p.title}</h4>
                      <p className="text-[10px] text-slate-500 line-clamp-2">{p.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 5: USUÁRIOS (GERENCIAMENTO E ACESSO RESTRITO) */}
        {activeTab === 'users' && canAccess(currentUser, 'users') && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Form Cadastrar / Editar Usuário */}
            <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2 font-heading">
                  <Users size={20} className="text-[#0f5238]" />
                  <span>{editingUser ? 'Editar Cadastro de Usuário' : 'Novo Cadastramento de Acesso'}</span>
                </h2>
                {editingUser && (
                  <button
                    onClick={() => {
                      setEditingUser(null);
                      setNewUserName('');
                      setNewUserEmail('');
                      setNewUserSubjects('');
                      setNewUserAvatar('');
                      setNewUserAreas(defaultAreasForRole('teacher'));
                    }}
                    className="text-xs text-slate-500 hover:text-slate-800 underline cursor-pointer"
                  >
                    Cancelar Edição
                  </button>
                )}
              </div>

              {userSuccessMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-700" />
                  <span>{userSuccessMsg}</span>
                </div>
              )}

              <form onSubmit={handleCreateOrUpdateUser} className="space-y-3 font-body">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nome Completo</label>
                  <input
                    type="text"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    placeholder="Ex: Prof. Carlos Eduardo Souza"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">E-mail de Login</label>
                  <input
                    type="email"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    placeholder="carlos.souza@mepes.org.br"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Perfil de Acesso</label>
                    <select
                      value={newUserRole}
                      onChange={(e) => {
                        const role = e.target.value as User['role'];
                        setNewUserRole(role);
                        setNewUserAreas(defaultAreasForRole(role));
                      }}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden font-semibold"
                    >
                      <option value="teacher">Professor(a)</option>
                      <option value="parent">Pai / Mãe / Responsável</option>
                      <option value="admin">Administrador (Gestor)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Avatar / Foto (URL)</label>
                    <input
                      type="text"
                      value={newUserAvatar}
                      onChange={(e) => setNewUserAvatar(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Disciplinas ou Filhos / Turmas (Separados por vírgula)</label>
                  <input
                    type="text"
                    value={newUserSubjects}
                    onChange={(e) => setNewUserSubjects(e.target.value)}
                    placeholder="Ex: Agroecologia, Zootecnia ou Filho: Mateus Souza - 2º Ano"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden"
                  />
                </div>

                <fieldset className="p-3 rounded-2xl border border-emerald-200 bg-emerald-50/50">
                  <legend className="px-1 text-xs font-extrabold text-emerald-950">Áreas permitidas</legend>
                  <p className="text-[11px] text-slate-600 mb-3">Clique nas áreas que esta pessoa poderá acessar.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {ACCESS_AREAS.map((area) => (
                      <label key={area.id} className="flex items-center gap-2 p-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newUserAreas.includes(area.id)}
                          onChange={(event) => setNewUserAreas((areas) => event.target.checked
                            ? [...areas, area.id]
                            : areas.filter((id) => id !== area.id))}
                          className="accent-emerald-700"
                        />
                        {area.label}
                      </label>
                    ))}
                  </div>
                </fieldset>

                <button
                  type="submit"
                  className="w-full bg-[#0f5238] hover:bg-[#1b4332] text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-earth font-heading"
                >
                  <Save size={15} />
                  <span>{editingUser ? 'Salvar Alterações do Usuário' : 'Cadastrar Novo Usuário'}</span>
                </button>
              </form>
            </div>

            {/* Lista de Usuários Cadastrados */}
            <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
              <h2 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-2 flex items-center justify-between font-heading">
                <span>Usuários Cadastrados ({usersList.length})</span>
                <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Acesso Restrito Ativo
                </span>
              </h2>

              <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
                {usersList.map((u) => (
                  <div key={u.id} className="p-4 bg-[#fcf9f2] border border-slate-200 rounded-2xl flex items-center justify-between gap-3 shadow-xs">
                    <div className="flex items-center gap-3">
                      <img src={u.avatar} alt={u.name} className="w-11 h-11 rounded-full object-cover border-2 border-[#e9c46a]" />
                      <div className="space-y-0.5">
                        <div className="font-bold text-xs text-slate-900 flex items-center gap-2">
                          <span>{u.name}</span>
                          <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                            u.role === 'admin' ? 'bg-purple-100 text-purple-900' :
                            u.role === 'teacher' ? 'bg-blue-100 text-blue-900' : 'bg-amber-100 text-amber-900'
                          }`}>
                            {u.role === 'admin' ? 'Gestor' : u.role === 'teacher' ? 'Professor' : 'Responsável'}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 font-body">{u.email}</div>
                        <div className="text-[10px] text-emerald-800 font-semibold">
                          {(u.allowedAreas ?? defaultAreasForRole(u.role)).length} área(s) permitida(s)
                        </div>
                        {u.subjects && u.subjects.length > 0 && (
                          <div className="text-[10px] text-emerald-800 font-medium">
                            {u.subjects.join(' • ')}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleStartEditUser(u)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-800 hover:bg-emerald-50 transition-colors cursor-pointer"
                        title="Editar usuário"
                      >
                        <Edit3 size={15} />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Remover o usuário "${u.name}" do sistema?`)) {
                            if (onDeleteUser) onDeleteUser(u.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Excluir usuário"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
