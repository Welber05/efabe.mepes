import React, { useState } from 'react';
import { PageContent, Notice, RoutinePhoto, User, SiteHeaderFooterSettings } from '../../types';
import { RichTextRenderer } from '../common/RichTextRenderer';
import { 
  GraduationCap, 
  Sprout, 
  BookOpen, 
  Users, 
  Repeat, 
  ArrowRight, 
  CheckCircle2, 
  Calendar, 
  Bell, 
  Camera, 
  PhoneCall, 
  Mail, 
  MapPin, 
  Send,
  Tractor,
  Leaf,
  Utensils,
  Award,
  Quote,
  AlertTriangle,
  Edit3,
  X,
  FileText,
  FolderOpen
} from 'lucide-react';

interface PublicWebsiteProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  pages: PageContent[];
  notices: Notice[];
  routinePhotos: RoutinePhoto[];
  onOpenLogin: () => void;
  currentUser?: User | null;
  onGoToAdmin?: (pageSlug?: string) => void;
  siteSettings?: SiteHeaderFooterSettings;
}

export const PublicWebsite: React.FC<PublicWebsiteProps> = ({
  activeTab,
  setActiveTab,
  pages,
  notices,
  routinePhotos,
  onOpenLogin,
  currentUser,
  onGoToAdmin,
  siteSettings,
}) => {
  const [formSuccess, setFormSuccess] = useState(false);
  const [showMatrixModal, setShowMatrixModal] = useState(false);
  const [contactData, setContactData] = useState({
    name: '',
    email: '',
    phone: '',
    courseInterest: 'Pré-Inscrição',
    message: ''
  });

  const currentPage = pages.find((p) => p.slug === activeTab) || pages[0];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSuccess(true);
    setTimeout(() => {
      setFormSuccess(false);
      setContactData({ name: '', email: '', phone: '', courseInterest: 'Pré-Inscrição', message: '' });
    }, 4000);
  };

  const sectionOrder = siteSettings?.homeSectionOrder || ['pillars', 'courses', 'notices', 'photos', 'contact'];

  const isSectionHidden = (secKey: string) => {
    return siteSettings?.hiddenHomeSections?.includes(secKey) || false;
  };

  const renderPillarsSection = () => (
    <section key="pillars" className="py-8 sm:py-10 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-emerald-700 font-extrabold text-[10px] uppercase tracking-widest bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
            {siteSettings?.homePillarsBadge || 'Pilares do MEPES'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {siteSettings?.homePillarsTitle || 'Educação do Campo que Transforma Vidas e Propriedades'}
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm">
            {siteSettings?.homePillarsSubtitle || 'Mais do que uma escola, um movimento focado na formação humana integral e no desenvolvimento sustentável do meio rural capixaba.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {(siteSettings?.homePillarsList || currentPage.features || []).map((f, idx) => (
            <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200 hover:border-emerald-500 transition-all space-y-2 group hover:shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center group-hover:bg-emerald-700 group-hover:text-white transition-colors">
                {f.icon === 'Repeat' && <Repeat size={20} />}
                {f.icon === 'GraduationCap' && <GraduationCap size={20} />}
                {f.icon === 'Sprout' && <Sprout size={20} />}
                {f.icon === 'Users' && <Users size={20} />}
                {f.icon === 'Tractor' && <Tractor size={20} />}
                {f.icon === 'Leaf' && <Leaf size={20} />}
                {f.icon === 'Utensils' && <Utensils size={20} />}
                {f.icon === 'BookOpen' && <BookOpen size={20} />}
                {!['Repeat', 'GraduationCap', 'Sprout', 'Users', 'Tractor', 'Leaf', 'Utensils', 'BookOpen'].includes(f.icon) && <Sprout size={20} />}
              </div>
              <h3 className="font-bold text-slate-900 text-sm">{f.title}</h3>
              <p className="text-xs text-slate-600 leading-normal">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  const renderCoursesSection = () => (
    <section key="courses" className="py-8 sm:py-10 bg-emerald-50/40 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
          <div>
            <span className="text-emerald-800 font-extrabold text-[10px] uppercase tracking-widest bg-emerald-100/80 px-2.5 py-0.5 rounded-full border border-emerald-200">
              {siteSettings?.homeCoursesBadge || 'Formação Profissional'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              {siteSettings?.homeCoursesTitle || 'Nossos Cursos Técnicos Integrados'}
            </h2>
          </div>
          <button
            onClick={() => setShowMatrixModal(true)}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-xs transition-colors shrink-0"
          >
            <FileText size={15} />
            <span>{siteSettings?.homeMatrixCurriculumText || 'Ver matriz curricular completa'}</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(siteSettings?.homeCoursesList || [
            { title: 'Técnico em Agropecuária', desc: 'Aprenda solos, zootecnia, cafeicultura agroecológica, fruticultura, mecânica agrícola e gestão da propriedade rural sustentável.', tag: 'Diploma Técnico de Nível Médio', icon: 'Tractor' },
            { title: 'Técnico em Meio Ambiente', desc: 'Foco na recuperação de nascentes, gestão bacia hidrográfica, licenciamento ambiental, reflorestamento e conservação de biodiversidade.', tag: 'Foco em Sustentabilidade Rural', icon: 'Leaf' },
            { title: 'Técnico em Agroindústria', desc: 'Processamento sustentável de leite, queijos, conservas, panificação artesanal e microbiologia aplicada a alimentos com higiene sanitária.', tag: 'Valorização do Produto do Campo', icon: 'Utensils' }
          ]).map((c, idx) => (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 hover:shadow-sm transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                {c.icon === 'Tractor' && <Tractor size={22} />}
                {c.icon === 'Leaf' && <Leaf size={22} />}
                {c.icon === 'Utensils' && <Utensils size={22} />}
                {c.icon === 'Sprout' && <Sprout size={22} />}
                {c.icon === 'GraduationCap' && <GraduationCap size={22} />}
                {!['Tractor', 'Leaf', 'Utensils', 'Sprout', 'GraduationCap'].includes(c.icon) && <Tractor size={22} />}
              </div>
              <h3 className="text-lg font-bold text-slate-900">{c.title}</h3>
              <p className="text-xs text-slate-600 leading-normal">{c.desc}</p>
              <div className="pt-1 text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                <Award size={13} /> {c.tag}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  const renderNoticesSection = () => (
    <section key="notices" className="py-8 sm:py-10 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
              <Bell size={18} />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">
              {siteSettings?.homeNoticesTitle || 'Últimos Comunicados'}
            </h3>
          </div>
          <button
            onClick={() => setActiveTab('notices')}
            className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
          >
            Ver todos ({notices.length})
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {notices.slice(0, 3).map((n) => (
            <div
              key={n.id}
              onClick={() => setActiveTab('notices')}
              className="p-4 bg-slate-50 hover:bg-emerald-50/50 rounded-xl border border-slate-200 transition-colors cursor-pointer space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-extrabold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-md">
                  {n.category}
                </span>
                <span className="text-[10px] text-slate-500 flex items-center gap-1 font-medium">
                  <Calendar size={11} /> {n.date}
                </span>
              </div>
              <h4 className="font-bold text-xs sm:text-sm text-slate-900">{n.title}</h4>
              <p className="text-xs text-slate-600 line-clamp-2 leading-tight">{n.content}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  const renderPhotosSection = () => (
    <section key="photos" className="py-8 sm:py-10 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-amber-100 text-amber-800 rounded-lg">
              <Camera size={18} />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">
              {siteSettings?.homePhotosTitle || 'Fotos da Rotina Escolar'}
            </h3>
          </div>
          <button
            onClick={() => setActiveTab('routine')}
            className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
          >
            Ver Galeria Completa
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {routinePhotos.slice(0, 4).map((p) => (
            <div
              key={p.id}
              onClick={() => setActiveTab('routine')}
              className="group relative h-36 rounded-xl overflow-hidden cursor-pointer shadow-xs"
            >
              <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent p-2.5 flex flex-col justify-end">
                <span className="text-white text-xs font-bold line-clamp-1">{p.title}</span>
                <span className="text-[10px] text-emerald-300 font-medium">{p.turma}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  const renderContactSection = () => (
    <section key="contact" className="py-8 sm:py-10 bg-emerald-900 text-white" id="contato">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-5 space-y-4">
            <span className="bg-amber-400 text-emerald-950 font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase">
              {siteSettings?.homeContactBadge || 'Fale Conosco'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {siteSettings?.homeContactTitle || 'Processo Seletivo & Pré-Matrícula EFABE'}
            </h2>
            <p className="text-emerald-100 text-xs sm:text-sm leading-normal">
              {siteSettings?.homeContactDesc || 'Quer saber mais sobre como ingressar em nossas turmas da Pedagogia da Alternância? Preencha o formulário e nossa equipe pedagógica entrará em contato.'}
            </p>

            <div className="space-y-2 text-xs text-emerald-200 pt-2">
              <p className="flex items-center gap-2">
                <PhoneCall size={16} className="text-amber-400 shrink-0" />
                <span>{siteSettings?.homeContactPhone || 'Atendimento: (28) 3536-1200 / (27) 99881-2200'}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail size={16} className="text-amber-400 shrink-0" />
                <span>{siteSettings?.homeContactEmail || 'secretaria@mepes.org.br'}</span>
              </p>
              <p className="flex items-center gap-2">
                <MapPin size={16} className="text-amber-400 shrink-0" />
                <span>{siteSettings?.homeContactAddress || 'Anchieta e Unidades EFAs no ES'}</span>
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white text-slate-800 p-5 sm:p-6 rounded-2xl shadow-xl">
            {formSuccess ? (
              <div className="text-center py-8 space-y-2">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Mensagem Enviada com Sucesso!</h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Agradecemos o seu interesse na EFABE (Escola Família Agrícola de Boa Esperança). Nossa coordenação entrará em contato em breve para prestar todas as informações sobre pré-matrícula.
                </p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-3">
                <h3 className="font-extrabold text-base text-slate-900 border-b border-slate-100 pb-2">
                  {siteSettings?.homeContactFormTitle || 'Ficha de Contato & Pré-Inscrição'}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Nome Completo</label>
                    <input
                      type="text"
                      value={contactData.name}
                      onChange={(e) => setContactData({...contactData, name: e.target.value})}
                      required
                      placeholder="Seu nome"
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">E-mail</label>
                    <input
                      type="email"
                      value={contactData.email}
                      onChange={(e) => setContactData({...contactData, email: e.target.value})}
                      required
                      placeholder="seu@email.com"
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Telefone / WhatsApp</label>
                    <input
                      type="text"
                      value={contactData.phone}
                      onChange={(e) => setContactData({...contactData, phone: e.target.value})}
                      required
                      placeholder="(27) 99999-0000"
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Assunto / Motivo do Contato</label>
                    <select
                      value={contactData.courseInterest}
                      onChange={(e) => setContactData({...contactData, courseInterest: e.target.value})}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-hidden font-medium"
                    >
                      <option value="Pré-Inscrição">Pré-Inscrição</option>
                      <option value="Transferência">Transferência</option>
                      <option value="Documentos">Documentos</option>
                      <option value="Informações Gerais">Informações Gerais</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Sua Mensagem ou Dúvida</label>
                  <textarea
                    rows={2}
                    value={contactData.message}
                    onChange={(e) => setContactData({...contactData, message: e.target.value})}
                    placeholder="Conte-nos de qual município você é e se tem interesse no regime de internato alternado..."
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-hidden"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 text-xs cursor-pointer"
                >
                  <Send size={15} />
                  <span>{siteSettings?.homeContactButtonText || 'Enviar Pré-Inscrição'}</span>
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      
      {/* Dynamic Hero Section */}
      <section className="relative bg-[#0f5238] text-white overflow-hidden font-body">
        {/* Background Image with Dark Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={currentPage.heroImage}
            alt={currentPage.title}
            className="w-full h-full object-cover opacity-20 scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f5238] via-[#0f5238]/95 to-[#1b4332]/90" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            <div className="lg:col-span-8 space-y-3.5">
              <div className="inline-flex items-center gap-2 bg-[#e9c46a] text-[#4a2810] px-3.5 py-1 rounded-full font-extrabold text-[11px] tracking-wide shadow-xs font-heading">
                <img src="/logomarca.jpeg" alt="EFA Logo" className="w-4 h-4 object-contain rounded-full bg-white p-0.5" referrerPolicy="no-referrer" />
                <span>EFABE - Escola Família Agrícola de Boa Esperança</span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight font-heading">
                {currentPage.title}
              </h1>

              <p className="text-[#f6f3ec] text-sm sm:text-base max-w-2xl font-light leading-snug font-body">
                {currentPage.subtitle}
              </p>

              {/* Hero buttons removed per user request */}
            </div>

            {/* Side Card Highlight */}
            <div className="lg:col-span-4 bg-[#1b4332]/90 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-[#2d6a4f] text-white space-y-3 shadow-earth-lg">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white p-1 border-2 border-[#e9c46a] shadow-xs flex items-center justify-center shrink-0">
                  <img src="/logomarca.jpeg" alt="Logo Emblem" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-[#e9c46a] font-heading">Pedagogia da Alternância</h3>
                  <p className="text-[11px] text-emerald-200 font-body">40 Anos educando o campo</p>
                </div>
              </div>

              <div className="space-y-2 text-xs text-emerald-100 pt-2.5 border-t border-emerald-800/80 font-body">
                <div className="flex items-start gap-2">
                  <CheckCircle2 size={15} className="text-[#e9c46a] shrink-0 mt-0.5" />
                  <span><strong>1 Semana na Escola (Internato):</strong> Aulas teóricas, laboratórios, projetos e convivência.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 size={15} className="text-[#e9c46a] shrink-0 mt-0.5" />
                  <span><strong>1 Semana na Família (Campo):</strong> Aplicação do Plano de Estudo na propriedade.</span>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('about')}
                className="w-full bg-[#0f5238] hover:bg-[#002114] text-[#e9c46a] border border-[#e9c46a]/40 font-bold py-2 rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 font-heading cursor-pointer"
              >
                <span>Saber Mais Sobre a Proposta</span>
                <ArrowRight size={13} />
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* Institutional Quote Banner (DESIGN.md) */}
      {!isSectionHidden('quoteBanner') && (
        <section className="py-4 bg-[#e9c46a]/15 border-y border-[#6b4226]/15">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-[#fcf9f2] border-l-4 border-[#6b4226] shadow-xs">
              <div className="w-14 h-14 shrink-0 rounded-xl overflow-hidden bg-white p-1 border border-[#e9c46a] shadow-xs flex items-center justify-center">
                <img src="/logomarca.jpeg" alt="Logo EFABE" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
              </div>
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-[10px] font-extrabold text-[#6b4226] uppercase tracking-wider font-heading">
                  Pedagogia da Alternância & Agroecologia • 40 Anos
                </span>
                <blockquote className="text-base sm:text-lg font-bold italic font-heading text-[#0f5238]">
                  "cuidando das pessoas e do mundo"
                </blockquote>
                <p className="text-xs text-[#404943] font-body leading-normal">
                  EFABE (Escola Família Agrícola de Boa Esperança) — Formação humana, técnica e comunitária promovendo o desenvolvimento sustentável das famílias do campo capixaba (Mantenedora: MEPES).
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Quick Access to Acervo Banners */}
      {!isSectionHidden('acervoBanner') && (
        <section className="py-6 bg-emerald-900 text-white border-b border-emerald-800">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center md:text-left">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300 bg-amber-400/20 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                  Acesso Rápido aos Arquivos
                </span>
                <h3 className="text-lg font-extrabold font-heading text-white">
                  Acervo Documental & Fotográfico Integrados com Google Drive
                </h3>
                <p className="text-xs text-emerald-100 max-w-xl">
                  Acesse os documentos normativos, matrizes curriculares, regulamentos e a galeria de fotos organizadas por ano, evento e local.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveTab('acervo-documentos')}
                  className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer border border-emerald-500/40"
                >
                  <FolderOpen size={16} className="text-amber-300" />
                  <span>Acervo Documental</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('acervo-galeria')}
                  className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Camera size={16} />
                  <span>Acervo Fotográfico</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* RENDERIZAÇÃO ORDENADA DAS SEÇÕES DA HOME (REORDENÁVEL NO GERENCIAL) */}
      {activeTab === 'home' && (
        <>
          {sectionOrder.map((secKey) => {
            if (isSectionHidden(secKey)) return null;
            if (secKey === 'pillars') return renderPillarsSection();
            if (secKey === 'courses') return renderCoursesSection();
            if (secKey === 'notices') return renderNoticesSection();
            if (secKey === 'photos') return renderPhotosSection();
            if (secKey === 'contact') return renderContactSection();
            return null;
          })}
        </>
      )}

      {/* Visão QUEM SOMOS (se activeTab === 'about') */}
      {activeTab === 'about' && (
        <section className="py-8 sm:py-10 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="space-y-3">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">A História e Proposta do MEPES</h2>
              <p className="text-slate-700 text-xs sm:text-sm leading-normal">
                {currentPage.bodyText}
              </p>
            </div>

            <div className="p-4 sm:p-5 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-3">
              <h3 className="text-lg font-bold text-emerald-950">A Pedagogia da Alternância na Prática</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-normal text-slate-700">
                <div className="bg-white p-4 rounded-xl border border-emerald-100 space-y-1.5">
                  <div className="font-bold text-emerald-800 text-xs sm:text-sm flex items-center gap-2">
                    <BookOpen size={16} /> Sessão Escola (Internato)
                  </div>
                  <p>
                    Durante uma semana inteira, os estudantes permanecem no centro educativo MEPES. Vivenciam aulas teóricas e laboratórios, participam da limpeza, organização da cozinha, reuniões de turma e esportes.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-emerald-100 space-y-1.5">
                  <div className="font-bold text-emerald-800 text-xs sm:text-sm flex items-center gap-2">
                    <Sprout size={16} /> Sessão Família (Comunidade)
                  </div>
                  <p>
                    Na semana seguinte, retornam para sua casa e propriedade rural. Aplicam o Plano de Estudo (PE), realizam pesquisas com produtores locais e colaboram nas atividades familiares de produção.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Visão CURSOS (se activeTab === 'courses') */}
      {activeTab === 'courses' && (
        <section className="py-8 sm:py-10 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="space-y-2 border-b border-slate-200 pb-4">
              <span className="text-emerald-800 font-extrabold text-[10px] uppercase tracking-widest bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Organização Pedagógica EFABE / MEPES
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading flex items-center gap-2">
                <GraduationCap className="text-emerald-700" size={32} />
                <span>Matriz Curricular dos Cursos Técnicos Integrados</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-body">
                {siteSettings?.homeMatrixCurriculumModalContent || 'A matriz curricular dos Cursos Técnicos da EFABE integra os componentes do Ensino Médio da BNCC à formação técnica profissional da Pedagogia da Alternância.'}
              </p>
            </div>

            {/* Anos / Séries da Matriz Curricular */}
            <div className="space-y-4">
              {(siteSettings?.homeMatrixCurriculumSubjects || [
                { year: '1º Ano', title: 'Núcleo Básico & Introdução Agropecuária', subjects: 'Língua Portuguesa, Matemática, Biologia, Química, Física, História, Geografia, Solos & Nutrição de Plantas, Desenho Técnico Agrícola, Botânica', ch: '1.200 horas' },
                { year: '2º Ano', title: 'Núcleo Intermediário & Práticas do Campo', subjects: 'Literatura, Matemática Aplicada, Ecologia, Zootecnia I (Bovinocultura & Aves), Cafeicultura Sustentável, Mecanização Agrícola, Agroecologia I', ch: '1.200 horas' },
                { year: '3º Ano', title: 'Núcleo Avançado & Projeto Profissional', subjects: 'Redação & Comunicação, Sociologia Rural, Gestão de Propriedade Rural, Processamento Agroindustrial, Legislação Ambiental, Trabalho de Conclusão de Curso (TCC)', ch: '1.200 horas' }
              ]).map((item, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 hover:border-emerald-300 transition-colors shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-emerald-700 text-white font-extrabold text-xs rounded-lg">{item.year}</span>
                      <h4 className="font-extrabold text-base text-slate-900">{item.title}</h4>
                    </div>
                    <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-200 self-start sm:self-auto">
                      Carga Horária: {item.ch}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-body">
                    <strong className="text-emerald-900">Disciplinas & Módulos:</strong> {item.subjects}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SEÇÃO DINÂMICA DE CONTEÚDO E BLOCOS (Para páginas customizadas ou qualquer página com blocos extras) */}
      {(currentPage.isCustom || (currentPage.blocks && currentPage.blocks.length > 0) || (activeTab !== 'home' && activeTab !== 'about' && activeTab !== 'courses' && activeTab !== 'notices' && activeTab !== 'routine' && activeTab !== 'contact')) && (
        <section className="py-8 sm:py-10 bg-slate-50 border-t border-slate-200">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
            
            {/* Texto principal da página se houver */}
            {currentPage.bodyText && (
              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">{currentPage.title}</h2>
                <RichTextRenderer content={currentPage.bodyText} />
              </div>
            )}

            {/* Renderização dos Blocos Adicionais */}
            {currentPage.blocks && currentPage.blocks.length > 0 && (
              <div className="space-y-4 pt-1">
                {currentPage.blocks.filter((blk) => !blk.hidden).map((blk) => (
                  <div key={blk.id}>
                    {blk.type === 'text' && (
                      <div className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1.5">
                        {blk.title && <h3 className="font-extrabold text-base text-slate-900">{blk.title}</h3>}
                        <RichTextRenderer content={blk.content} />
                      </div>
                    )}

                    {blk.type === 'image' && (
                      <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-xs">
                        {blk.imageUrl && (
                          <img src={blk.imageUrl} alt={blk.title || 'Imagem do conteúdo'} className="w-full max-h-[400px] object-cover" />
                        )}
                        {(blk.title || blk.content) && (
                          <div className="p-4 bg-slate-50 border-t border-slate-100">
                            {blk.title && <h4 className="font-bold text-xs sm:text-sm text-slate-900 mb-1">{blk.title}</h4>}
                            {blk.content && <p className="text-xs text-slate-600 leading-normal">{blk.content}</p>}
                          </div>
                        )}
                      </div>
                    )}

                    {blk.type === 'features' && (
                      <div className="p-4 sm:p-5 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1.5">
                        <h3 className="font-extrabold text-base text-emerald-950 flex items-center gap-2">
                          <Award size={18} className="text-emerald-700" />
                          {blk.title || 'Destaque Especial'}
                        </h3>
                        <p className="text-emerald-900 text-xs sm:text-sm leading-normal whitespace-pre-line">{blk.content}</p>
                      </div>
                    )}

                    {blk.type === 'quote' && (
                      <div className="p-5 bg-emerald-950 text-white rounded-2xl space-y-2 relative overflow-hidden shadow-xs">
                        <Quote size={28} className="text-amber-400 opacity-30 absolute top-3 right-3" />
                        <p className="text-sm sm:text-base italic font-light text-emerald-100 relative z-10">"{blk.content}"</p>
                        {(blk.caption || blk.title) && (
                          <div className="pt-1.5 border-t border-emerald-800 text-[11px] text-amber-300 font-bold relative z-10">
                            — {blk.caption || blk.title}
                          </div>
                        )}
                      </div>
                    )}

                    {blk.type === 'alert' && (
                      <div className="p-4 sm:p-5 bg-amber-50 border-2 border-amber-300 rounded-2xl space-y-1.5">
                        <h3 className="font-extrabold text-amber-950 text-sm sm:text-base flex items-center gap-2">
                          <AlertTriangle size={18} className="text-amber-600" />
                          {blk.title || 'Aviso / Nota de Destaque'}
                        </h3>
                        <p className="text-amber-900 text-xs sm:text-sm leading-normal whitespace-pre-line">{blk.content}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

          </div>
        </section>
      )}

      {/* Se activeTab !== 'home', renderiza o bloco Fale Conosco no rodapé da página */}
      {activeTab !== 'home' && renderContactSection()}

      {/* MODAL MATRIZ CURRICULAR COMPLETA */}
      {showMatrixModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 md:p-8 space-y-6 relative">
            <button
              onClick={() => setShowMatrixModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
              title="Fechar Modal"
            >
              <X size={20} />
            </button>

            <div className="space-y-2 border-b border-slate-200 pb-4">
              <span className="text-emerald-800 font-extrabold text-[10px] uppercase tracking-widest bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Organização Pedagógica EFABE / MEPES
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900 font-heading flex items-center gap-2">
                <GraduationCap className="text-emerald-700" size={28} />
                <span>Matriz Curricular dos Cursos Técnicos Integrados</span>
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-body">
                {siteSettings?.homeMatrixCurriculumModalContent || 'A matriz curricular dos Cursos Técnicos da EFABE integra os componentes do Ensino Médio da BNCC à formação técnica profissional da Pedagogia da Alternância.'}
              </p>
            </div>

            {/* Anos / Séries da Matriz */}
            <div className="space-y-4">
              {(siteSettings?.homeMatrixCurriculumSubjects || [
                { year: '1º Ano', title: 'Núcleo Básico & Introdução Agropecuária', subjects: 'Língua Portuguesa, Matemática, Biologia, Química, Física, História, Geografia, Solos & Nutrição de Plantas, Desenho Técnico Agrícola, Botânica', ch: '1.200 horas' },
                { year: '2º Ano', title: 'Núcleo Intermediário & Práticas do Campo', subjects: 'Literatura, Matemática Aplicada, Ecologia, Zootecnia I (Bovinocultura & Aves), Cafeicultura Sustentável, Mecanização Agrícola, Agroecologia I', ch: '1.200 horas' },
                { year: '3º Ano', title: 'Núcleo Avançado & Projeto Profissional', subjects: 'Redação & Comunicação, Sociologia Rural, Gestão de Propriedade Rural, Processamento Agroindustrial, Legislação Ambiental, Trabalho de Conclusão de Curso (TCC)', ch: '1.200 horas' }
              ]).map((item, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 hover:border-emerald-300 transition-colors">
                  <div className="flex items-center justify-between gap-2 border-b border-slate-200 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 bg-emerald-700 text-white font-extrabold text-xs rounded-lg">{item.year}</span>
                      <h4 className="font-extrabold text-sm text-slate-900">{item.title}</h4>
                    </div>
                    <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200 shrink-0">
                      Carga Horária: {item.ch}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-body">
                    <strong className="text-emerald-900">Disciplinas & Módulos:</strong> {item.subjects}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setShowMatrixModal(false)}
                className="px-6 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
