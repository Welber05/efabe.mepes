import React, { useState } from 'react';
import { Notice } from '../../types';
import { Bell, Search, Calendar, User, Pin, ChevronRight, X, Filter } from 'lucide-react';
import { RichTextRenderer } from '../common/RichTextRenderer';

interface CommunicadosViewProps {
  notices: Notice[];
}

export const CommunicadosView: React.FC<CommunicadosViewProps> = ({ notices }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [activeNotice, setActiveNotice] = useState<Notice | null>(null);

  const categories = ['Todas', 'Reuniões', 'Eventos', 'Calendário', 'Pedagógico'];

  const filteredNotices = notices.filter((notice) => {
    const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          notice.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todas' || notice.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Banner Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-950 text-white p-8 rounded-3xl shadow-lg relative overflow-hidden">
          <div className="relative z-10 space-y-2">
            <span className="inline-flex items-center gap-1.5 bg-amber-400/20 text-amber-300 text-xs font-bold px-3 py-1 rounded-full border border-amber-400/30">
              <Bell size={14} /> Canal de Comunicação Oficial
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight">Comunicados & Avisos Escolares</h1>
            <p className="text-emerald-100 text-sm max-w-2xl">
              Fique por dentro das datas de reuniões, calendários da Pedagogia da Alternância, informes pedagógicos e eventos da comunidade MEPES.
            </p>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-200 flex flex-col md:flex-row gap-4 justify-between items-center">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-3 text-slate-400" size={18} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar comunicado por palavra-chave..."
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden"
            />
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            <Filter size={16} className="text-slate-400 mr-1 hidden sm:block shrink-0" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Notices Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotices.map((notice) => (
            <div
              key={notice.id}
              onClick={() => setActiveNotice(notice)}
              className="bg-white rounded-2xl shadow-xs hover:shadow-md border border-slate-200 overflow-hidden flex flex-col justify-between transition-all cursor-pointer group hover:-translate-y-1"
            >
              <div>
                {/* Notice Image if exists */}
                {notice.imageUrl && (
                  <div className="h-44 w-full overflow-hidden relative">
                    <img
                      src={notice.imageUrl}
                      alt={notice.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {notice.pinned && (
                      <span className="absolute top-3 right-3 bg-amber-400 text-slate-900 font-extrabold text-[10px] px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                        <Pin size={12} className="fill-slate-900" /> Destaque
                      </span>
                    )}
                  </div>
                )}

                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="bg-emerald-50 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-md border border-emerald-100">
                      {notice.category}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                      <Calendar size={13} /> {notice.date}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug">
                    {notice.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {notice.content}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1">
                  <User size={13} /> {notice.author}
                </span>
                <span className="text-emerald-700 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Ler completo <ChevronRight size={14} />
                </span>
              </div>
            </div>
          ))}
        </div>

        {filteredNotices.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
            <Bell size={40} className="mx-auto text-slate-300" />
            <p className="text-slate-600 font-medium">Nenhum comunicado encontrado para a busca selecionada.</p>
            <button
              onClick={() => { setSearchTerm(''); setSelectedCategory('Todas'); }}
              className="text-emerald-700 font-bold text-xs hover:underline"
            >
              Limpar filtros de busca
            </button>
          </div>
        )}

      </div>

      {/* Modal Detail for Notice */}
      {activeNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 space-y-4 relative">
              <button
                onClick={() => setActiveNotice(null)}
                className="absolute top-4 right-4 bg-slate-100 hover:bg-slate-200 text-slate-700 p-2 rounded-full transition-colors"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-2">
                <span className="bg-emerald-100 text-emerald-900 text-xs font-bold px-3 py-1 rounded-full">
                  {activeNotice.category}
                </span>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Calendar size={13} /> Publicado em {activeNotice.date}
                </span>
              </div>

              <h2 className="text-2xl font-extrabold text-slate-900">{activeNotice.title}</h2>

              {activeNotice.imageUrl && (
                <div className="rounded-xl overflow-hidden max-h-72">
                  <img src={activeNotice.imageUrl} alt={activeNotice.title} className="w-full h-full object-cover" />
                </div>
              )}

              <div className="py-2">
                <RichTextRenderer content={activeNotice.content} />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Autor: <strong className="text-slate-800">{activeNotice.author}</strong></span>
                <button
                  onClick={() => setActiveNotice(null)}
                  className="bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs hover:bg-emerald-800"
                >
                  Fechar Comunicado
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
