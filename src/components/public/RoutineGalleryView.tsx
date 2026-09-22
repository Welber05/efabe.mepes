import React, { useState } from 'react';
import { RoutinePhoto } from '../../types';
import { Camera, Search, Heart, User, Calendar, Filter, X, Tag } from 'lucide-react';

interface RoutineGalleryViewProps {
  photos: RoutinePhoto[];
  onLikePhoto?: (id: string) => void;
}

export const RoutineGalleryView: React.FC<RoutineGalleryViewProps> = ({
  photos,
  onLikePhoto,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [selectedTurma, setSelectedTurma] = useState('Todas');
  const [activePhoto, setActivePhoto] = useState<RoutinePhoto | null>(null);

  const categories = ['Todas', 'Aulas Práticas', 'Agroecologia', 'Vivência Comunitária', 'Laboratório', 'Projetos'];
  const turmas = ['Todas', '1º Ano - Agropecuária', '2º Ano - Téc. Agropecuária', '3º Ano - Meio Ambiente', 'Todas as Turmas'];

  const filteredPhotos = photos.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todas' || p.category === selectedCategory;
    const matchesTurma = selectedTurma === 'Todas' || p.turma === selectedTurma;
    return matchesSearch && matchesCategory && matchesTurma;
  });

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Banner Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-amber-900 text-white p-8 rounded-3xl shadow-lg relative overflow-hidden">
          <div className="relative z-10 space-y-2">
            <span className="inline-flex items-center gap-1.5 bg-emerald-400/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-400/30">
              <Camera size={14} /> Rotina e Cotidiano Escolar
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight">Galeria da Rotina Escolar</h1>
            <p className="text-emerald-100 text-sm max-w-2xl">
              Acompanhe as imagens das atividades práticas, vivências comunitárias no internato, aulas de laboratório e projetos agroecológicos dos nossos estudantes.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-200 space-y-3">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-3 text-slate-400" size={18} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por legenda ou atividade..."
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden"
              />
            </div>

            {/* Turmas Filter */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <label className="text-xs font-bold text-slate-600 shrink-0">Turma:</label>
              <select
                value={selectedTurma}
                onChange={(e) => setSelectedTurma(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-hidden w-full md:w-auto"
              >
                {turmas.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-slate-100">
            <Filter size={15} className="text-slate-400 shrink-0 mr-1" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
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

        {/* Photos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              className="bg-white rounded-2xl shadow-xs hover:shadow-lg border border-slate-200 overflow-hidden group transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div 
                  className="relative h-56 overflow-hidden cursor-pointer bg-slate-100"
                  onClick={() => setActivePhoto(photo)}
                >
                  <img
                    src={photo.imageUrl}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="text-white text-xs font-bold bg-emerald-600/90 backdrop-blur-xs px-3 py-1 rounded-full">
                      Clique para ampliar
                    </span>
                  </div>
                  <span className="absolute top-3 left-3 bg-slate-900/80 text-white text-[10px] font-bold px-2.5 py-1 rounded-md backdrop-blur-xs flex items-center gap-1">
                    <Tag size={10} /> {photo.category}
                  </span>
                </div>

                <div className="p-5 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span className="text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                      {photo.turma}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={13} /> {photo.date}
                    </span>
                  </div>

                  <h3 
                    onClick={() => setActivePhoto(photo)}
                    className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors cursor-pointer leading-snug"
                  >
                    {photo.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {photo.description}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <User size={13} strokeWidth={2.5} /> {photo.author}
                </span>

                <button
                  onClick={() => onLikePhoto && onLikePhoto(photo.id)}
                  className="flex items-center gap-1.5 text-slate-500 hover:text-red-500 transition-colors font-semibold px-2.5 py-1 rounded-lg hover:bg-red-50 cursor-pointer"
                >
                  <Heart size={15} className="fill-red-50 text-red-500" />
                  <span>{photo.likes}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredPhotos.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
            <Camera size={40} className="mx-auto text-slate-300" />
            <p className="text-slate-600 font-medium">Nenhuma foto encontrada na galeria para este filtro.</p>
            <button
              onClick={() => { setSearchTerm(''); setSelectedCategory('Todas'); setSelectedTurma('Todas'); }}
              className="text-emerald-700 font-bold text-xs hover:underline"
            >
              Resetar filtros
            </button>
          </div>
        )}

      </div>

      {/* Lightbox Modal */}
      {activePhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-800 w-full max-w-4xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
            
            {/* Image Preview */}
            <div className="md:w-3/5 bg-black flex items-center justify-center relative min-h-[300px]">
              <img src={activePhoto.imageUrl} alt={activePhoto.title} className="w-full h-full object-contain max-h-[70vh]" />
            </div>

            {/* Content Details */}
            <div className="md:w-2/5 p-6 flex flex-col justify-between bg-white overflow-y-auto relative">
              <button
                onClick={() => setActivePhoto(null)}
                className="absolute top-4 right-4 bg-slate-100 hover:bg-slate-200 text-slate-700 p-2 rounded-full transition-colors"
              >
                <X size={18} />
              </button>

              <div className="space-y-4 pr-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-emerald-100 text-emerald-900 text-xs font-bold px-3 py-1 rounded-full">
                    {activePhoto.category}
                  </span>
                  <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                    {activePhoto.turma}
                  </span>
                </div>

                <h2 className="text-xl font-extrabold text-slate-900 leading-snug">{activePhoto.title}</h2>

                <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                  {activePhoto.description}
                </p>

                <div className="pt-4 border-t border-slate-100 space-y-1 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <User size={14} className="text-emerald-700" />
                    <span>Publicado por: <strong className="text-slate-800">{activePhoto.author}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-emerald-700" />
                    <span>Data do registro: <strong className="text-slate-800">{activePhoto.date}</strong></span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => onLikePhoto && onLikePhoto(activePhoto.id)}
                  className="flex items-center gap-2 bg-red-50 text-red-600 font-bold px-4 py-2 rounded-xl text-xs hover:bg-red-100 transition-colors cursor-pointer"
                >
                  <Heart size={16} className="fill-red-500" />
                  <span>{activePhoto.likes} Curtidas</span>
                </button>

                <button
                  onClick={() => setActivePhoto(null)}
                  className="bg-slate-900 text-white font-bold px-4 py-2 rounded-xl text-xs hover:bg-slate-800"
                >
                  Fechar
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
