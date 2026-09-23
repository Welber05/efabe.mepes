import React from 'react';
import { GraduationCap, MapPin, Phone, Mail, Globe, Heart, Edit3 } from 'lucide-react';
import { SiteHeaderFooterSettings, User } from '../types';
import { publicAssetUrl } from '../lib/publicAsset';
import { EFABE_ADDRESS, EFABE_EMAIL, EFABE_PHONE } from '../site/efabeContact';

interface FooterProps {
  siteSettings?: SiteHeaderFooterSettings;
  currentUser?: User | null;
  onGoToAdmin?: (tabSlug: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  siteSettings,
  currentUser,
  onGoToAdmin,
}) => {
  const settings = siteSettings || {
    schoolAcronym: 'EFABE',
    schoolBadge: 'EFA',
    schoolName: 'Escola Família Agrícola de Boa Esperança',
    headerSlogan: 'Um sonho realizado há 40 anos!',
    topBannerAnnouncement: 'EFABE - Escola Família Agrícola de Boa Esperança',
    headerQuote: '🌻 "cuidando das pessoas e do mundo"',
    logoUrl: '/logomarca.jpeg',
    footerAboutText: 'Escola Família Agrícola de Boa Esperança. Referência na formação de jovens do campo com a consolidação e vivência prática da Pedagogia da Alternância.',
    footerSlogan: '🌻 "cuidando das pessoas e do mundo"',
    footerAddress: EFABE_ADDRESS,
    footerPhone: EFABE_PHONE,
    footerEmail: EFABE_EMAIL,
    footerWebsite: '',
    footerCopyright: 'EFABE - Escola Família Agrícola de Boa Esperança. Todos os direitos reservados.',
    footerUnitsText: 'A EFABE conta com a parceria da entidade mantenedora MEPES e integra a rede de Escolas Família Agrícola no Espírito Santo.',
    footerCoursesList: [
      'Técnico em Agropecuária',
      'Técnico em Meio Ambiente e Recuperação',
      'Técnico em Agroindústria e Processamento',
      'Metodologia: Sessão Escola & Sessão Família',
      'Plano de Estudo e Pesquisa Agroecológica'
    ]
  };

  return (
    <footer className="bg-[#122a1f] text-[#f6f3ec] pt-12 pb-8 border-t-4 border-[#e9c46a] font-body relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-emerald-900/60">
          
          {/* Coluna 1: Sobre EFABE */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white p-0.5 border border-[#e9c46a] shadow-md flex items-center justify-center shrink-0">
                <img
                  src={publicAssetUrl(settings.logoUrl)}
                  alt={settings.schoolName}
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <span className="text-lg font-bold text-white tracking-tight font-heading block">
                  {settings.schoolAcronym}
                </span>
                <span className="text-xs text-[#e9c46a] font-semibold font-body">
                  {settings.schoolName}
                </span>
              </div>
            </div>
            <p className="text-xs text-[#e5e2db] leading-relaxed">
              {settings.footerAboutText}
            </p>
            {settings.footerSlogan && (
              <div className="pt-1 text-xs text-[#e9c46a] font-bold flex items-center gap-1.5">
                <span>{settings.footerSlogan}</span>
              </div>
            )}
          </div>

          {/* Coluna 2: Cursos e Pedagogia */}
          <div className="space-y-3">
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase border-b border-slate-800 pb-2">
              Ensino & Cursos
            </h3>
            <ul className="space-y-2 text-xs">
              {settings.footerCoursesList?.map((courseItem, idx) => (
                <li key={idx} className="hover:text-emerald-400 transition-colors">
                  {courseItem}
                </li>
              ))}
            </ul>
          </div>

          {/* Coluna 3: Rede de Escolas EFAs */}
          <div className="space-y-3">
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase border-b border-slate-800 pb-2">
              Unidades & Parcerias
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {settings.footerUnitsText}
            </p>
          </div>

          {/* Coluna 4: Contato & Localização */}
          <div className="space-y-3">
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase border-b border-slate-800 pb-2">
              Contato Sede / Unidade
            </h3>
            <div className="space-y-2 text-xs">
              {settings.footerAddress && (
                <p className="flex items-start gap-2">
                  <MapPin size={16} className="text-amber-400 shrink-0 mt-0.5" />
                  <span>{settings.footerAddress}</span>
                </p>
              )}
              {settings.footerPhone && (
                <p className="flex items-center gap-2">
                  <Phone size={16} className="text-amber-400 shrink-0" />
                  <span>{settings.footerPhone}</span>
                </p>
              )}
              {settings.footerEmail && (
                <p className="flex items-center gap-2">
                  <Mail size={16} className="text-amber-400 shrink-0" />
                  <span>{settings.footerEmail}</span>
                </p>
              )}
              {settings.footerWebsite && (
                <p className="flex items-center gap-2">
                  <Globe size={16} className="text-amber-400 shrink-0" />
                  <span>{settings.footerWebsite}</span>
                </p>
              )}
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} {settings.footerCopyright}</p>
          
          <div className="flex items-center gap-4">
            <p className="flex items-center gap-1">
              Desenvolvido para a comunidade escolar com <Heart size={12} className="text-red-500 fill-red-500" /> e Pedagogia da Alternância.
            </p>

            {currentUser?.role === 'admin' && onGoToAdmin && (
              <button
                onClick={() => onGoToAdmin('site-settings')}
                className="inline-flex items-center gap-1 text-[11px] bg-emerald-800 hover:bg-emerald-700 text-amber-300 px-2.5 py-1 rounded-md font-bold transition-colors cursor-pointer border border-emerald-700"
                title="Editar informações do Rodapé no Painel CMS"
              >
                <Edit3 size={12} />
                <span>Editar Rodapé</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
