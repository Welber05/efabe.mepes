import React, { useState } from 'react';
import { PhotoItem, PhotoCatalogCategories, GoogleDriveFolderConfig, User, DriveFolderItem } from '../../types';
import { DriveFoldersManagerModal, extractDriveFolderId } from '../common/DriveFoldersManagerModal';
import {
  Camera,
  Search,
  Filter,
  Settings,
  Plus,
  Trash2,
  Edit,
  X,
  Check,
  Calendar,
  MapPin,
  Tag,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  FolderOpen,
  Upload,
  ExternalLink,
  Globe,
  Info,
  FolderPlus
} from 'lucide-react';

interface AcervoFotograficoViewProps {
  photos: PhotoItem[];
  onAddPhoto?: (photo: PhotoItem) => void;
  onUpdatePhoto?: (photo: PhotoItem) => void;
  onDeletePhoto?: (id: string) => void;
  categories: PhotoCatalogCategories;
  onUpdateCategories?: (cats: PhotoCatalogCategories) => void;
  driveConfig?: GoogleDriveFolderConfig;
  onUpdateDriveConfig?: (config: GoogleDriveFolderConfig) => void;
  currentUser?: User | null;
}

export const formatGoogleDriveImageUrl = (url: string): string => {
  if (!url) return '';
  const trimmed = url.trim();
  if (trimmed.startsWith('data:') || trimmed.startsWith('blob:')) return trimmed;

  // Check for Google Drive file link formats
  const driveMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
                     trimmed.match(/id=([a-zA-Z0-9_-]+)/);
  if (driveMatch && driveMatch[1]) {
    const fileId = driveMatch[1];
    return `https://lh3.googleusercontent.com/d/${fileId}`;
  }
  return trimmed;
};

export const AcervoFotograficoView: React.FC<AcervoFotograficoViewProps> = ({
  photos,
  onAddPhoto,
  onUpdatePhoto,
  onDeletePhoto,
  categories,
  onUpdateCategories,
  driveConfig,
  onUpdateDriveConfig,
  currentUser
}) => {
  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('Todos');
  const [selectedEventType, setSelectedEventType] = useState('Todos');
  const [selectedLocation, setSelectedLocation] = useState('Todos');
  const [activeTab, setActiveTab] = useState<'gallery' | 'drive-embed'>('gallery');

  // Lightbox modal state (Visualização maior ao clicar)
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

  // Management Gear Modal state (Engrenagem)
  const [isGearModalOpen, setIsGearModalOpen] = useState(false);
  const [gearModalTab, setGearModalTab] = useState<'add-photo' | 'manage-categories' | 'drive-config'>('add-photo');

  // Add/Edit photo form
  const [editingPhoto, setEditingPhoto] = useState<PhotoItem | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formYear, setFormYear] = useState(categories.years[0] || '2026');
  const [formEventType, setFormEventType] = useState(categories.eventTypes[0] || 'Aulas Práticas');
  const [formLocation, setFormLocation] = useState(categories.locations[0] || 'Setor Agropecuário / Horta');
  const [formAuthor, setFormAuthor] = useState('Equipe EFABE / MEPES');

  // Category Management Inputs
  const [newYearInput, setNewYearInput] = useState('');
  const [newEventInput, setNewEventInput] = useState('');
  const [newLocationInput, setNewLocationInput] = useState('');

  // Drive Folders Config
  const allFolders: DriveFolderItem[] = driveConfig?.folders && driveConfig.folders.length > 0
    ? driveConfig.folders
    : [
        {
          id: 'f-2',
          name: 'Pasta 2: Galeria Principal de Fotos EFABE',
          url: driveConfig?.photoFolderUrl || 'https://drive.google.com/drive/folders/1EFABE_ACERVO_FOTOGRAFICO',
          folderId: driveConfig?.photoFolderId || '1EFABE_ACERVO_FOTOGRAFICO',
          category: 'fotos',
          description: 'Fotos institucionais, eventos festivos e comemorações da escola.'
        }
      ];

  const photoFolders = allFolders.filter((f) => f.category === 'fotos' || f.category === 'geral');
  const availableFolders = photoFolders.length > 0 ? photoFolders : allFolders;

  const [activeFolderId, setActiveFolderId] = useState<string>(availableFolders[0]?.id || 'f-2');

  const selectedFolder = availableFolders.find((f) => f.id === activeFolderId) || availableFolders[0];
  const currentDriveFolderId = selectedFolder
    ? (selectedFolder.folderId || extractDriveFolderId(selectedFolder.url))
    : extractDriveFolderId(driveConfig?.photoFolderUrl || '');

  const [isDriveFoldersModalOpen, setIsDriveFoldersModalOpen] = useState(false);

  // Drive Config Inputs
  const [driveUrlInput, setDriveUrlInput] = useState(driveConfig?.photoFolderUrl || '');

  // Filtered Photos
  const filteredPhotos = photos.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.author && p.author.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesYear = selectedYear === 'Todos' || p.year === selectedYear;
    const matchesEvent = selectedEventType === 'Todos' || p.eventType === selectedEventType;
    const matchesLocation = selectedLocation === 'Todos' || p.location === selectedLocation;
    return matchesSearch && matchesYear && matchesEvent && matchesLocation;
  });

  const activePhoto = activePhotoIndex !== null ? filteredPhotos[activePhotoIndex] : null;

  // Handle image upload from file input
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setFormImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenAddPhotoModal = (photoToEdit?: PhotoItem) => {
    if (photoToEdit) {
      setEditingPhoto(photoToEdit);
      setFormTitle(photoToEdit.title);
      setFormDescription(photoToEdit.description);
      setFormImageUrl(photoToEdit.imageUrl);
      setFormYear(photoToEdit.year);
      setFormEventType(photoToEdit.eventType);
      setFormLocation(photoToEdit.location);
      setFormAuthor(photoToEdit.author || 'Equipe EFABE');
    } else {
      setEditingPhoto(null);
      setFormTitle('');
      setFormDescription('');
      setFormImageUrl('');
      setFormYear(categories.years[0] || '2026');
      setFormEventType(categories.eventTypes[0] || 'Aulas Práticas');
      setFormLocation(categories.locations[0] || 'Setor Agropecuário / Horta');
      setFormAuthor('Equipe EFABE');
    }
    setGearModalTab('add-photo');
    setIsGearModalOpen(true);
  };

  const handleSavePhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const fallbackImage = 'https://images.unsplash.com/photo-1592417817098-8f3d6eb1475a?auto=format&fit=crop&q=80&w=800';
    const processedUrl = formImageUrl ? formatGoogleDriveImageUrl(formImageUrl) : fallbackImage;

    if (editingPhoto) {
      const updated: PhotoItem = {
        ...editingPhoto,
        title: formTitle,
        description: formDescription,
        imageUrl: processedUrl,
        year: formYear,
        eventType: formEventType,
        location: formLocation,
        author: formAuthor
      };
      if (onUpdatePhoto) onUpdatePhoto(updated);
    } else {
      const newPhoto: PhotoItem = {
        id: `ph-${Date.now()}`,
        title: formTitle,
        description: formDescription,
        imageUrl: processedUrl,
        date: new Date().toISOString().split('T')[0],
        year: formYear,
        eventType: formEventType,
        location: formLocation,
        author: formAuthor,
        likes: 0
      };
      if (onAddPhoto) onAddPhoto(newPhoto);
    }

    setIsGearModalOpen(false);
  };

  // Category Management Functions (Cadastro de Ano, Evento, Local)
  const handleAddYear = () => {
    if (!newYearInput.trim() || categories.years.includes(newYearInput.trim())) return;
    const updated = { ...categories, years: [newYearInput.trim(), ...categories.years] };
    if (onUpdateCategories) onUpdateCategories(updated);
    setNewYearInput('');
  };

  const handleDeleteYear = (yearToDelete: string) => {
    const updated = { ...categories, years: categories.years.filter(y => y !== yearToDelete) };
    if (onUpdateCategories) onUpdateCategories(updated);
  };

  const handleAddEventType = () => {
    if (!newEventInput.trim() || categories.eventTypes.includes(newEventInput.trim())) return;
    const updated = { ...categories, eventTypes: [...categories.eventTypes, newEventInput.trim()] };
    if (onUpdateCategories) onUpdateCategories(updated);
    setNewEventInput('');
  };

  const handleDeleteEventType = (eventToDelete: string) => {
    const updated = { ...categories, eventTypes: categories.eventTypes.filter(e => e !== eventToDelete) };
    if (onUpdateCategories) onUpdateCategories(updated);
  };

  const handleAddLocation = () => {
    if (!newLocationInput.trim() || categories.locations.includes(newLocationInput.trim())) return;
    const updated = { ...categories, locations: [...categories.locations, newLocationInput.trim()] };
    if (onUpdateCategories) onUpdateCategories(updated);
    setNewLocationInput('');
  };

  const handleDeleteLocation = (locationToDelete: string) => {
    const updated = { ...categories, locations: categories.locations.filter(l => l !== locationToDelete) };
    if (onUpdateCategories) onUpdateCategories(updated);
  };

  const handleSaveDriveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    const folderId = extractDriveFolderId(driveUrlInput);
    const newConfig: GoogleDriveFolderConfig = {
      ...driveConfig,
      photoFolderUrl: driveUrlInput,
      photoFolderId: folderId
    };
    if (onUpdateDriveConfig) onUpdateDriveConfig(newConfig);
    setIsGearModalOpen(false);
  };

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Banner Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-amber-900 text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="relative z-10 space-y-2 max-w-3xl">
            <span className="inline-flex items-center gap-1.5 bg-emerald-400/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-400/30">
              <Camera size={14} /> Memória Histórica e Fotográfica EFABE
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-heading">
              Acervo Fotográfico da Alternância
            </h1>
            <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed">
              Explore os registros fotográficos classificados por ano letivo, tipo de evento pedagógico e local de realização das atividades do MEPES.
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap items-center gap-2 shrink-0">
            {/* Engrenagem / Button de Gerenciamento exigido pelo usuário */}
            <button
              type="button"
              onClick={() => { setGearModalTab('add-photo'); setIsGearModalOpen(true); }}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <Settings size={18} className="animate-spin-slow" />
              <span>Gerenciar Acervo & Categorias</span>
            </button>

            <button
              type="button"
              onClick={() => handleOpenAddPhotoModal()}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer border border-emerald-400/30"
            >
              <Plus size={16} />
              <span>Inserir Nova Foto</span>
            </button>
          </div>
        </div>

        {/* Drive Photo Folder Status Bar if set */}
        {driveConfig?.photoFolderUrl && (
          <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-100 text-amber-900 rounded-xl">
                <FolderOpen size={20} />
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-2">
                  <span>Pasta do Google Drive de Fotos Conectada</span>
                  <span className="bg-amber-100 text-amber-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-amber-300">
                    Sincronizado
                  </span>
                </h4>
                <p className="text-xs text-slate-600 truncate max-w-md sm:max-w-xl">
                  {driveConfig.photoFolderUrl}
                </p>
              </div>
            </div>

            <a
              href={driveConfig.photoFolderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 border border-slate-200 shrink-0"
            >
              <ExternalLink size={14} />
              <span>Abrir Galeria no Drive</span>
            </a>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('gallery')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'gallery'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Camera size={15} />
              <span>Galeria de Fotos do Acervo ({photos.length})</span>
            </button>

            {currentDriveFolderId && (
              <button
                type="button"
                onClick={() => setActiveTab('drive-embed')}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === 'drive-embed'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <FolderOpen size={15} />
                <span>Fotos do Google Drive Integradas</span>
              </button>
            )}
          </div>
        </div>

        {/* TAB 1: PHOTO GALLERY WITH CLASSIFICATION SYSTEM */}
        {activeTab === 'gallery' && (
          <div className="space-y-6">
            
            {/* Multi-Dimensional Classification Filters */}
            <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  <Filter size={16} className="text-emerald-700" />
                  <span>Filtros e Classificação do Acervo Fotográfico</span>
                </h3>

                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedYear('Todos');
                    setSelectedEventType('Todos');
                    setSelectedLocation('Todos');
                  }}
                  className="text-xs text-emerald-800 font-bold hover:underline cursor-pointer"
                >
                  Limpar Todos os Filtros
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Search Input */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Buscar Texto / Legenda:
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Legenda, evento..."
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden bg-slate-50 focus:bg-white"
                    />
                  </div>
                </div>

                {/* Filter by Year (Ano) */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <Calendar size={12} className="text-emerald-700" /> Classificar por Ano:
                  </label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden bg-slate-50 focus:bg-white font-semibold"
                  >
                    <option value="Todos">Todos os Anos</option>
                    {categories.years.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>

                {/* Filter by Event Type (Tipo de Evento) */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <Tag size={12} className="text-emerald-700" /> Tipo de Evento:
                  </label>
                  <select
                    value={selectedEventType}
                    onChange={(e) => setSelectedEventType(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden bg-slate-50 focus:bg-white font-semibold"
                  >
                    <option value="Todos">Todos os Eventos</option>
                    {categories.eventTypes.map((ev) => (
                      <option key={ev} value={ev}>{ev}</option>
                    ))}
                  </select>
                </div>

                {/* Filter by Location (Local) */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <MapPin size={12} className="text-emerald-700" /> Local:
                  </label>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden bg-slate-50 focus:bg-white font-semibold"
                  >
                    <option value="Todos">Todos os Locais</option>
                    {categories.locations.map((loc) => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Photo Thumbnails Grid ("Apareça pequena na tela com um texto") */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredPhotos.map((photo, index) => (
                <div
                  key={photo.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group hover:border-emerald-300 relative"
                >
                  <div>
                    {/* Small Thumbnail Container */}
                    <div
                      onClick={() => setActivePhotoIndex(index)}
                      className="relative h-48 sm:h-52 overflow-hidden cursor-pointer bg-slate-900"
                    >
                      <img
                        src={formatGoogleDriveImageUrl(photo.imageUrl)}
                        alt={photo.title}
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1592417817098-8f3d6eb1475a?auto=format&fit=crop&q=80&w=800';
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3">
                        <span className="text-white text-[11px] font-bold bg-emerald-700/90 backdrop-blur-xs px-2.5 py-1 rounded-lg flex items-center gap-1">
                          <Maximize2 size={12} /> Clique para Ampliar
                        </span>
                      </div>

                      {/* Year badge */}
                      <span className="absolute top-2.5 left-2.5 bg-slate-900/85 text-amber-300 text-[10px] font-extrabold px-2 py-0.5 rounded-md backdrop-blur-xs border border-amber-400/30">
                        {photo.year}
                      </span>
                    </div>

                    {/* Text Label on screen below thumbnail */}
                    <div className="p-4 space-y-2">
                      <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                        <span className="bg-emerald-50 text-emerald-900 font-extrabold px-2 py-0.5 rounded-md border border-emerald-200">
                          {photo.eventType}
                        </span>
                        <span className="bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-md flex items-center gap-0.5">
                          <MapPin size={10} /> {photo.location}
                        </span>
                      </div>

                      <h4
                        onClick={() => setActivePhotoIndex(index)}
                        className="font-extrabold text-xs sm:text-sm text-slate-900 group-hover:text-emerald-800 transition-colors cursor-pointer leading-snug line-clamp-2"
                      >
                        {photo.title}
                      </h4>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {photo.description}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="p-4 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-600">{photo.date}</span>

                    {(currentUser?.role === 'admin' || currentUser) && (
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenAddPhotoModal(photo)}
                          className="p-1 text-slate-400 hover:text-emerald-700 hover:bg-slate-100 rounded-md transition-colors"
                          title="Editar Foto"
                        >
                          <Edit size={13} />
                        </button>
                        {onDeletePhoto && (
                          <button
                            type="button"
                            onClick={() => onDeletePhoto(photo.id)}
                            className="p-1 text-slate-400 hover:text-red-600 hover:bg-slate-100 rounded-md transition-colors"
                            title="Excluir Foto"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {filteredPhotos.length === 0 && (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
                <Camera size={40} className="mx-auto text-slate-300" />
                <p className="text-slate-600 font-medium text-sm">Nenhuma foto encontrada para a combinação de filtros selecionada.</p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedYear('Todos');
                    setSelectedEventType('Todos');
                    setSelectedLocation('Todos');
                  }}
                  className="text-emerald-700 font-bold text-xs hover:underline cursor-pointer"
                >
                  Resetar filtros
                </button>
              </div>
            )}

          </div>
        )}

        {/* TAB 2: GOOGLE DRIVE EMBEDDED PHOTO VIEWER WITH MULTI-FOLDER SELECTOR */}
        {activeTab === 'drive-embed' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-4 gap-4">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
                  <Globe size={20} className="text-emerald-700" />
                  <span>Pastas do Google Drive de Fotos Integradas</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Navegue diretamente nas pastas do Google Drive. Alterne entre as galerias disponíveis abaixo.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsDriveFoldersModalOpen(true)}
                  className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <FolderPlus size={15} />
                  <span>Gerenciar / Adicionar Pastas</span>
                </button>

                {selectedFolder && (
                  <a
                    href={selectedFolder.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-emerald-800 text-white font-bold text-xs rounded-xl hover:bg-emerald-900 transition-colors flex items-center gap-2"
                  >
                    <ExternalLink size={14} />
                    <span>Abrir no Drive</span>
                  </a>
                )}
              </div>
            </div>

            {/* MULTI-FOLDER SELECTOR TABS */}
            {availableFolders.length > 0 && (
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-600 block uppercase tracking-wider">
                  Selecione a galeria de fotos para visualizar (Total: {availableFolders.length} pastas):
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {availableFolders.map((folder) => {
                    const isActive = folder.id === selectedFolder?.id;
                    return (
                      <button
                        key={folder.id}
                        type="button"
                        onClick={() => setActiveFolderId(folder.id)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border ${
                          isActive
                            ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-xs'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        <FolderOpen size={16} className={isActive ? 'text-amber-950' : 'text-amber-600'} />
                        <span>{folder.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ACTIVE FOLDER DESCRIPTION */}
            {selectedFolder && selectedFolder.description && (
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-950 flex items-center gap-2">
                <Info size={16} className="text-amber-700 shrink-0" />
                <span>{selectedFolder.description}</span>
              </div>
            )}

            {/* EMBEDDED IFRAME */}
            {currentDriveFolderId ? (
              <div className="w-full h-[650px] bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
                <iframe
                  src={`https://drive.google.com/embeddedfolderview?id=${currentDriveFolderId}#grid`}
                  className="w-full h-full border-0"
                  title={`Google Drive Photo Folder Embed - ${selectedFolder?.name || 'Drive'}`}
                />
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300 space-y-3">
                <FolderOpen size={40} className="mx-auto text-slate-400" />
                <p className="text-xs text-slate-600">Nenhum ID de pasta de fotos configurado.</p>
                <button
                  type="button"
                  onClick={() => setIsDriveFoldersModalOpen(true)}
                  className="px-4 py-2 bg-emerald-800 text-white font-bold text-xs rounded-xl"
                >
                  Configurar Pastas do Google Drive
                </button>
              </div>
            )}
          </div>
        )}

      </div>

      {/* LIGHTBOX MODAL DE VISUALIZAÇÃO MAIOR EXIGIDA */}
      {activePhoto && activePhotoIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-800 w-full max-w-5xl overflow-hidden flex flex-col md:flex-row max-h-[92vh] relative">
            
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setActivePhotoIndex(null)}
              className="absolute top-4 right-4 z-20 bg-slate-900/80 hover:bg-slate-900 text-white p-2 rounded-full transition-colors border border-slate-700"
              title="Fechar Visualização"
            >
              <X size={20} />
            </button>

            {/* Navigation Arrows */}
            {filteredPhotos.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    setActivePhotoIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : filteredPhotos.length - 1))
                  }
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-slate-900/80 hover:bg-slate-900 text-white p-2.5 rounded-full transition-colors border border-slate-700"
                  title="Foto Anterior"
                >
                  <ChevronLeft size={22} />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setActivePhotoIndex((prev) => (prev !== null && prev < filteredPhotos.length - 1 ? prev + 1 : 0))
                  }
                  className="absolute right-4 md:right-[38%] top-1/2 -translate-y-1/2 z-20 bg-slate-900/80 hover:bg-slate-900 text-white p-2.5 rounded-full transition-colors border border-slate-700"
                  title="Próxima Foto"
                >
                  <ChevronRight size={22} />
                </button>
              </>
            )}

            {/* Large Image Preview ("Visualização Maior") */}
            <div className="md:w-3/5 bg-black flex items-center justify-center relative min-h-[350px] p-2">
              <img
                src={formatGoogleDriveImageUrl(activePhoto.imageUrl)}
                alt={activePhoto.title}
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1592417817098-8f3d6eb1475a?auto=format&fit=crop&q=80&w=800';
                }}
                className="w-full h-full object-contain max-h-[75vh]"
              />
            </div>

            {/* Photo Details Sidebar */}
            <div className="md:w-2/5 p-6 flex flex-col justify-between bg-white overflow-y-auto space-y-4">
              <div className="space-y-4 pr-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-amber-100 text-amber-900 font-extrabold text-xs px-3 py-1 rounded-full border border-amber-200">
                    Ano: {activePhoto.year}
                  </span>
                  <span className="bg-emerald-100 text-emerald-900 font-extrabold text-xs px-3 py-1 rounded-full border border-emerald-200">
                    {activePhoto.eventType}
                  </span>
                </div>

                <h2 className="text-xl font-extrabold text-slate-900 font-heading leading-tight">
                  {activePhoto.title}
                </h2>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-[10px] uppercase font-extrabold text-slate-400 flex items-center gap-1">
                    <Info size={12} /> Descrição Textual da Foto
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed font-body">
                    {activePhoto.description || 'Sem descrição cadastrada.'}
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <MapPin size={15} className="text-emerald-700" />
                    <strong>Local:</strong> {activePhoto.location}
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar size={15} className="text-emerald-700" />
                    <strong>Data de Registro:</strong> {activePhoto.date}
                  </div>

                  {activePhoto.author && (
                    <div className="flex items-center gap-2">
                      <Camera size={15} className="text-emerald-700" />
                      <strong>Registrado por:</strong> {activePhoto.author}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Foto {activePhotoIndex + 1} de {filteredPhotos.length}
                </span>

                <button
                  type="button"
                  onClick={() => setActivePhotoIndex(null)}
                  className="px-5 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Fechar
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ENGRENAGEM DE GERENCIAMENTO MODAL (CADASTRAR ANO, EVENTO, LOCAL E FOTOS) */}
      {isGearModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setIsGearModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="space-y-1">
              <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <Settings className="text-amber-600 animate-spin-slow" size={24} />
                <span>Engrenagem de Gerenciamento do Acervo Fotográfico</span>
              </h3>
              <p className="text-xs text-slate-600">
                Cadastre novos anos, tipos de eventos, locais, insira novas fotos e configure o Google Drive.
              </p>
            </div>

            {/* Tabs within Gear Modal */}
            <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
              <button
                type="button"
                onClick={() => setGearModalTab('add-photo')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  gearModalTab === 'add-photo'
                    ? 'bg-amber-500 text-slate-950 font-extrabold shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Plus size={15} />
                <span>Inserir/Editar Foto</span>
              </button>

              <button
                type="button"
                onClick={() => setGearModalTab('manage-categories')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  gearModalTab === 'manage-categories'
                    ? 'bg-amber-500 text-slate-950 font-extrabold shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Tag size={15} />
                <span>Cadastrar Ano, Evento, Local</span>
              </button>

              <button
                type="button"
                onClick={() => setGearModalTab('drive-config')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  gearModalTab === 'drive-config'
                    ? 'bg-amber-500 text-slate-950 font-extrabold shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <FolderOpen size={15} />
                <span>Pasta Google Drive</span>
              </button>
            </div>

            {/* GEAR SUB-TAB 1: INSERIR / EDITAR FOTO */}
            {gearModalTab === 'add-photo' && (
              <form onSubmit={handleSavePhoto} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800">
                    Título / Legenda Curta: <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="Ex: Prática de Compostagem na Horta"
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800">
                    Descrição Textual sobre a Foto: <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Descreva o contexto pedagógico, o momento registrado na foto e os participantes..."
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden"
                  />
                </div>

                {/* Selection of Registered Year, Event Type, and Location */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                      <Calendar size={13} /> Selecionar Ano:
                    </label>
                    <select
                      value={formYear}
                      onChange={(e) => setFormYear(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden bg-white"
                    >
                      {categories.years.map((y) => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                      <Tag size={13} /> Tipo de Evento:
                    </label>
                    <select
                      value={formEventType}
                      onChange={(e) => setFormEventType(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden bg-white"
                    >
                      {categories.eventTypes.map((ev) => (
                        <option key={ev} value={ev}>{ev}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                      <MapPin size={13} /> Local:
                    </label>
                    <select
                      value={formLocation}
                      onChange={(e) => setFormLocation(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden bg-white"
                    >
                      {categories.locations.map((loc) => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Image Selection / Upload */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <label className="text-xs font-bold text-slate-800">
                    Imagem da Foto (Arquivo Local ou Link do Drive/Web):
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 bg-slate-50 rounded-xl border border-dashed border-slate-300 space-y-1.5 text-center">
                      <Upload size={20} className="mx-auto text-slate-400" />
                      <span className="text-[11px] font-bold text-slate-600 block">Fazer Upload de Imagem</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileUpload}
                        className="text-[11px] text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-100 file:text-emerald-900 cursor-pointer"
                      />
                    </div>

                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-slate-600 block">Ou Cole a URL da Imagem / Google Drive:</span>
                      <input
                        type="text"
                        value={formImageUrl}
                        onChange={(e) => setFormImageUrl(e.target.value)}
                        placeholder="https://..."
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-950 space-y-1">
                    <span className="font-bold flex items-center gap-1 text-amber-900">
                      <Info size={14} /> Dica de Formatação e Envio de Fotos:
                    </span>
                    <ul className="list-disc list-inside text-[11px] space-y-0.5 text-amber-900/90 font-body">
                      <li><strong>Opção 1 (Upload Local):</strong> Clique no botão <em>"Fazer Upload de Imagem"</em> para escolher qualquer foto do seu computador.</li>
                      <li><strong>Opção 2 (Google Drive):</strong> Cole o link de compartilhamento da foto do Drive (ex: <code className="bg-amber-100 px-1 rounded">https://drive.google.com/file/d/.../view</code>). O sistema converterá automaticamente para exibição em miniatura na tela.</li>
                    </ul>
                  </div>

                  {formImageUrl && (
                    <div className="mt-2 flex items-center gap-3 p-2 bg-slate-50 border border-slate-200 rounded-xl">
                      <div className="h-16 w-20 rounded-lg overflow-hidden border border-slate-200 bg-slate-200 shrink-0">
                        <img
                          src={formatGoogleDriveImageUrl(formImageUrl)}
                          alt="Pré-visualização"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1592417817098-8f3d6eb1475a?auto=format&fit=crop&q=80&w=800';
                          }}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-xs text-slate-700 space-y-0.5">
                        <span className="font-bold text-emerald-800 block">Pré-visualização da Miniatura</span>
                        <span className="text-[11px] text-slate-500 block">A foto aparecerá nesta proporção na galeria.</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-3 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsGearModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Check size={16} />
                    <span>{editingPhoto ? 'Salvar Alterações' : 'Inserir Foto no Acervo'}</span>
                  </button>
                </div>
              </form>
            )}

            {/* GEAR SUB-TAB 2: CADASTRO DE ANO, EVENTO E LOCAL EXIGIDO */}
            {gearModalTab === 'manage-categories' && (
              <div className="space-y-6">
                
                {/* Cadastrar Anos */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                  <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar size={15} className="text-emerald-700" />
                    <span>Cadastro de Anos Letivos</span>
                  </h4>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newYearInput}
                      onChange={(e) => setNewYearInput(e.target.value)}
                      placeholder="Ex: 2027"
                      className="flex-1 px-3 py-1.5 text-xs border border-slate-200 rounded-xl outline-hidden bg-white"
                    />
                    <button
                      type="button"
                      onClick={handleAddYear}
                      className="px-3 py-1.5 bg-emerald-800 text-white text-xs font-bold rounded-xl hover:bg-emerald-900"
                    >
                      Adicionar Ano
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {categories.years.map((y) => (
                      <span
                        key={y}
                        className="bg-white border border-slate-200 text-slate-800 text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-2xs"
                      >
                        {y}
                        <button
                          type="button"
                          onClick={() => handleDeleteYear(y)}
                          className="text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                          title="Remover Ano"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Cadastrar Tipos de Eventos */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                  <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Tag size={15} className="text-emerald-700" />
                    <span>Cadastro de Tipos de Eventos Pedagógicos</span>
                  </h4>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newEventInput}
                      onChange={(e) => setNewEventInput(e.target.value)}
                      placeholder="Ex: Feira de Agroecologia"
                      className="flex-1 px-3 py-1.5 text-xs border border-slate-200 rounded-xl outline-hidden bg-white"
                    />
                    <button
                      type="button"
                      onClick={handleAddEventType}
                      className="px-3 py-1.5 bg-emerald-800 text-white text-xs font-bold rounded-xl hover:bg-emerald-900"
                    >
                      Adicionar Evento
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {categories.eventTypes.map((ev) => (
                      <span
                        key={ev}
                        className="bg-white border border-slate-200 text-slate-800 text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-2xs"
                      >
                        {ev}
                        <button
                          type="button"
                          onClick={() => handleDeleteEventType(ev)}
                          className="text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                          title="Remover Evento"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Cadastrar Locais */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                  <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin size={15} className="text-emerald-700" />
                    <span>Cadastro de Locais das Atividades</span>
                  </h4>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newLocationInput}
                      onChange={(e) => setNewLocationInput(e.target.value)}
                      placeholder="Ex: Unidade Agroindustrial"
                      className="flex-1 px-3 py-1.5 text-xs border border-slate-200 rounded-xl outline-hidden bg-white"
                    />
                    <button
                      type="button"
                      onClick={handleAddLocation}
                      className="px-3 py-1.5 bg-emerald-800 text-white text-xs font-bold rounded-xl hover:bg-emerald-900"
                    >
                      Adicionar Local
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {categories.locations.map((loc) => (
                      <span
                        key={loc}
                        className="bg-white border border-slate-200 text-slate-800 text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-2xs"
                      >
                        {loc}
                        <button
                          type="button"
                          onClick={() => handleDeleteLocation(loc)}
                          className="text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                          title="Remover Local"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* GEAR SUB-TAB 3: GOOGLE DRIVE MULTI-FOLDER CONFIG */}
            {gearModalTab === 'drive-config' && (
              <div className="space-y-4">
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-2">
                  <h4 className="font-extrabold text-xs text-amber-950 flex items-center gap-1.5">
                    <FolderOpen size={16} className="text-amber-700" />
                    <span>Configuração de Múltiplas Pastas do Google Drive</span>
                  </h4>
                  <p className="text-xs text-amber-900/90 leading-relaxed font-body">
                    Gerencie a lista de pastas (Pasta 1, Pasta 2, Pasta 3...) disponibilizadas no Acervo Fotográfico e Documental.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsGearModalOpen(false);
                      setIsDriveFoldersModalOpen(true);
                    }}
                    className="mt-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-2"
                  >
                    <FolderPlus size={16} />
                    <span>Abrir Gerenciador de Pastas do Drive</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* MODAL GERENCIADOR DE PASTAS DO DRIVE */}
      <DriveFoldersManagerModal
        isOpen={isDriveFoldersModalOpen}
        onClose={() => setIsDriveFoldersModalOpen(false)}
        driveConfig={driveConfig}
        onUpdateDriveConfig={(cfg) => {
          if (onUpdateDriveConfig) onUpdateDriveConfig(cfg);
        }}
        defaultCategory="fotos"
      />

    </div>
  );
};
