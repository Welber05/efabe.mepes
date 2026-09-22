import React, { useState } from 'react';
import { DocumentItem, GoogleDriveFolderConfig, User, DriveFolderItem } from '../../types';
import { DriveFoldersManagerModal, extractDriveFolderId } from '../common/DriveFoldersManagerModal';
import {
  FileText,
  Search,
  Download,
  ExternalLink,
  FolderOpen,
  Plus,
  Trash2,
  Edit,
  Settings,
  X,
  Check,
  File,
  FileCode,
  FileSpreadsheet,
  Globe,
  Info,
  FolderPlus
} from 'lucide-react';

interface AcervoDocumentosViewProps {
  documents: DocumentItem[];
  onAddDocument?: (doc: DocumentItem) => void;
  onUpdateDocument?: (doc: DocumentItem) => void;
  onDeleteDocument?: (id: string) => void;
  driveConfig?: GoogleDriveFolderConfig;
  onUpdateDriveConfig?: (config: GoogleDriveFolderConfig) => void;
  currentUser?: User | null;
}

export const AcervoDocumentosView: React.FC<AcervoDocumentosViewProps> = ({
  documents,
  onAddDocument,
  onUpdateDocument,
  onDeleteDocument,
  driveConfig,
  onUpdateDriveConfig,
  currentUser
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [activeTab, setActiveTab] = useState<'catalog' | 'drive-embed'>('catalog');

  // Modals state
  const [isDriveModalOpen, setIsDriveModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<DocumentItem | null>(null);

  // Folders list
  const allFolders: DriveFolderItem[] = driveConfig?.folders && driveConfig.folders.length > 0
    ? driveConfig.folders
    : [
        {
          id: 'f-1',
          name: 'Pasta 1: Documentos Oficiais & Regimentos',
          url: driveConfig?.docFolderUrl || 'https://drive.google.com/drive/folders/1EFABE_DOCUMENTOS_OFICIAIS',
          folderId: driveConfig?.docFolderId || '1EFABE_DOCUMENTOS_OFICIAIS',
          category: 'documentos',
          description: 'Regimentos escolares, normas internas e comunicados da diretoria.'
        }
      ];

  const docFolders = allFolders.filter((f) => f.category === 'documentos' || f.category === 'geral');
  const availableFolders = docFolders.length > 0 ? docFolders : allFolders;

  const [activeFolderId, setActiveFolderId] = useState<string>(availableFolders[0]?.id || 'f-1');

  const selectedFolder = availableFolders.find((f) => f.id === activeFolderId) || availableFolders[0];
  const currentFolderId = selectedFolder
    ? (selectedFolder.folderId || extractDriveFolderId(selectedFolder.url))
    : extractDriveFolderId(driveConfig?.docFolderUrl || '');

  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formCategory, setFormCategory] = useState('Regimentos e Normas');
  const [formFileUrl, setFormFileUrl] = useState('');
  const [formFileType, setFormFileType] = useState<'pdf' | 'doc' | 'xls' | 'zip' | 'drive' | 'other'>('pdf');
  const [formFileSize, setFormFileSize] = useState('1.5 MB');

  const categories = [
    'Todas',
    'Regimentos e Normas',
    'Matrizes Curriculares',
    'Planos de Estudo',
    'Formulários e Fichas',
    'Relatórios e Projetos'
  ];

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todas' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleOpenAddModal = (doc?: DocumentItem) => {
    if (doc) {
      setEditingDoc(doc);
      setFormTitle(doc.title);
      setFormDescription(doc.description);
      setFormCategory(doc.category);
      setFormFileUrl(doc.fileUrl);
      setFormFileType(doc.fileType || 'pdf');
      setFormFileSize(doc.fileSize || '1 MB');
    } else {
      setEditingDoc(null);
      setFormTitle('');
      setFormDescription('');
      setFormCategory('Regimentos e Normas');
      setFormFileUrl('');
      setFormFileType('pdf');
      setFormFileSize('1.2 MB');
    }
    setIsAddModalOpen(true);
  };

  const handleSaveDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    if (editingDoc) {
      const updated: DocumentItem = {
        ...editingDoc,
        title: formTitle,
        description: formDescription,
        category: formCategory,
        fileUrl: formFileUrl || 'https://drive.google.com',
        fileType: formFileType,
        fileSize: formFileSize,
        updatedAt: new Date().toISOString().split('T')[0]
      };
      if (onUpdateDocument) onUpdateDocument(updated);
    } else {
      const newDoc: DocumentItem = {
        id: `doc-${Date.now()}`,
        title: formTitle,
        description: formDescription,
        category: formCategory,
        fileUrl: formFileUrl || 'https://drive.google.com',
        fileType: formFileType,
        fileSize: formFileSize,
        date: new Date().toISOString().split('T')[0]
      };
      if (onAddDocument) onAddDocument(newDoc);
    }

    setIsAddModalOpen(false);
  };

  const getFileIcon = (type?: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="text-red-600" size={24} />;
      case 'doc':
        return <File className="text-blue-600" size={24} />;
      case 'xls':
        return <FileSpreadsheet className="text-emerald-600" size={24} />;
      case 'drive':
        return <FolderOpen className="text-amber-500" size={24} />;
      default:
        return <FileCode className="text-slate-600" size={24} />;
    }
  };

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Banner Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="relative z-10 space-y-2 max-w-3xl">
            <span className="inline-flex items-center gap-1.5 bg-emerald-400/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-400/30">
              <FolderOpen size={14} /> Repositório Oficial EFABE
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-heading">
              Acervo Documental & Matrizes Curriculares
            </h1>
            <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed">
              Consulte e baixe os documentos oficiais, regimentos escolares, matrizes de disciplinas, planos de estudo da alternância e formulários compartilhados.
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsDriveModalOpen(true)}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer border border-emerald-400/30"
            >
              <Settings size={16} />
              <span>Configurar Pasta Google Drive</span>
            </button>

            <button
              type="button"
              onClick={() => handleOpenAddModal()}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus size={16} />
              <span>Inserir Documento</span>
            </button>
          </div>
        </div>

        {/* Folder Link / Google Drive Status Bar */}
        {driveConfig?.docFolderUrl && (
          <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-xl">
                <FolderOpen size={20} />
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-2">
                  <span>Pasta Compartilhada no Google Drive Conectada</span>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-300">
                    Sincronizado
                  </span>
                </h4>
                <p className="text-xs text-slate-600 truncate max-w-md sm:max-w-xl">
                  {driveConfig.docFolderUrl}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
              <a
                href={driveConfig.docFolderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 border border-slate-200"
              >
                <ExternalLink size={14} />
                <span>Abrir no Drive</span>
              </a>
            </div>
          </div>
        )}

        {/* Main View Tabs */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('catalog')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'catalog'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <FileText size={15} />
              <span>Catálogo com Descrições ({documents.length})</span>
            </button>

            {currentFolderId && (
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
                <span>Visualizador Direto da Pasta do Drive</span>
              </button>
            )}
          </div>
        </div>

        {/* TAB 1: CATALOG WITH TEXT DESCRIPTIONS */}
        {activeTab === 'catalog' && (
          <div className="space-y-6">
            
            {/* Search & Category Filter */}
            <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-200 space-y-3">
              <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full md:w-96">
                  <Search className="absolute left-3.5 top-3 text-slate-400" size={18} />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Pesquisar por título ou texto da descrição..."
                    className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden bg-slate-50 focus:bg-white"
                  />
                </div>

                <span className="text-xs font-bold text-slate-500">
                  Exibindo {filteredDocs.length} de {documents.length} documentos
                </span>
              </div>

              {/* Category Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-slate-100">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-emerald-800 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Document Cards List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group space-y-4 hover:border-emerald-300 relative"
                >
                  <div className="space-y-3">
                    {/* Header line with icon & category */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="p-2.5 bg-slate-100 rounded-xl shrink-0 group-hover:bg-emerald-50 transition-colors">
                        {getFileIcon(doc.fileType)}
                      </div>
                      
                      <div className="flex items-center gap-1.5 flex-wrap justify-end">
                        <span className="bg-emerald-50 text-emerald-900 border border-emerald-200 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                          {doc.category}
                        </span>
                        
                        {(currentUser?.role === 'admin' || currentUser) && (
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleOpenAddModal(doc)}
                              className="p-1 text-slate-400 hover:text-emerald-700 hover:bg-slate-100 rounded-md transition-colors"
                              title="Editar Documento"
                            >
                              <Edit size={14} />
                            </button>
                            {onDeleteDocument && (
                              <button
                                type="button"
                                onClick={() => onDeleteDocument(doc.id)}
                                className="p-1 text-slate-400 hover:text-red-600 hover:bg-slate-100 rounded-md transition-colors"
                                title="Excluir Documento"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="font-extrabold text-base text-slate-900 group-hover:text-emerald-800 transition-colors leading-snug">
                      {doc.title}
                    </h3>

                    {/* Textual Description Required by User */}
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
                      <div className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 flex items-center gap-1">
                        <Info size={11} /> Descrição Detalhada
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed font-body">
                        {doc.description || 'Sem descrição cadastrada.'}
                      </p>
                    </div>
                  </div>

                  {/* Metadata and Action Buttons */}
                  <div className="pt-3 border-t border-slate-100 space-y-3">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold">
                      <span>Tamanho: {doc.fileSize || '1 MB'}</span>
                      <span>Postado em: {doc.date}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <Download size={14} />
                        <span>Baixar</span>
                      </a>

                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 border border-slate-200"
                      >
                        <ExternalLink size={14} />
                        <span>Abrir Drive</span>
                      </a>
                    </div>
                  </div>

                </div>
              ))}
            </div>

            {filteredDocs.length === 0 && (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
                <FileText size={40} className="mx-auto text-slate-300" />
                <p className="text-slate-600 font-medium text-sm">Nenhum documento encontrado para este filtro.</p>
                <button
                  type="button"
                  onClick={() => { setSearchTerm(''); setSelectedCategory('Todas'); }}
                  className="text-emerald-700 font-bold text-xs hover:underline cursor-pointer"
                >
                  Limpar pesquisa
                </button>
              </div>
            )}

          </div>
        )}

        {/* TAB 2: GOOGLE DRIVE EMBEDDED VIEWER WITH MULTI-FOLDER SELECTOR */}
        {activeTab === 'drive-embed' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-4 gap-4">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
                  <Globe size={20} className="text-emerald-700" />
                  <span>Pastas do Google Drive Integradas</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Navegue diretamente nas pastas compartilhadas do Google Drive. Alterne entre as pastas abaixo.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsDriveModalOpen(true)}
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
                  Selecione a pasta para visualizar (Total: {availableFolders.length} pastas):
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
                            ? 'bg-emerald-800 text-white border-emerald-900 shadow-xs'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        <FolderOpen size={16} className={isActive ? 'text-amber-300' : 'text-amber-600'} />
                        <span>{folder.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ACTIVE FOLDER DESCRIPTION */}
            {selectedFolder && selectedFolder.description && (
              <div className="p-3 bg-emerald-50/60 border border-emerald-200/80 rounded-xl text-xs text-emerald-950 flex items-center gap-2">
                <Info size={16} className="text-emerald-700 shrink-0" />
                <span>{selectedFolder.description}</span>
              </div>
            )}

            {/* EMBEDDED IFRAME */}
            {currentFolderId ? (
              <div className="w-full h-[650px] bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
                <iframe
                  src={`https://drive.google.com/embeddedfolderview?id=${currentFolderId}#list`}
                  className="w-full h-full border-0"
                  title={`Google Drive Folder Embed - ${selectedFolder?.name || 'Drive'}`}
                />
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300 space-y-3">
                <FolderOpen size={40} className="mx-auto text-slate-400" />
                <p className="text-xs text-slate-600">Nenhum ID válido de pasta encontrado para este item.</p>
                <button
                  type="button"
                  onClick={() => setIsDriveModalOpen(true)}
                  className="px-4 py-2 bg-emerald-800 text-white font-bold text-xs rounded-xl"
                >
                  Configurar Pastas do Google Drive
                </button>
              </div>
            )}
          </div>
        )}

      </div>

      {/* MODAL GERENCIAR PASTAS DO GOOGLE DRIVE */}
      <DriveFoldersManagerModal
        isOpen={isDriveModalOpen}
        onClose={() => setIsDriveModalOpen(false)}
        driveConfig={driveConfig}
        onUpdateDriveConfig={(cfg) => {
          if (onUpdateDriveConfig) onUpdateDriveConfig(cfg);
        }}
        defaultCategory="documentos"
      />

      {/* MODAL CADASTRAR / EDITAR DOCUMENTO */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="space-y-1">
              <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <FileText className="text-emerald-700" size={22} />
                <span>{editingDoc ? 'Editar Documento do Acervo' : 'Inserir Novo Documento'}</span>
              </h3>
              <p className="text-xs text-slate-600">
                Preencha o título, a descrição textual detalhada e o link do arquivo.
              </p>
            </div>

            <form onSubmit={handleSaveDocument} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800">
                  Título do Documento: <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Ex: Regimento Escolar EFABE 2026"
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden"
                />
              </div>

              {/* Textual Description Required Field */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800">
                  Descrição Textual sobre o Arquivo: <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Descreva detalhadamente o conteúdo deste documento, seu objetivo pedagógico ou normativo..."
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800">Categoria:</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden bg-white"
                  >
                    {categories.filter(c => c !== 'Todas').map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800">Tipo de Arquivo:</label>
                  <select
                    value={formFileType}
                    onChange={(e) => setFormFileType(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden bg-white"
                  >
                    <option value="pdf">PDF (.pdf)</option>
                    <option value="doc">Word / Documento (.docx)</option>
                    <option value="xls">Excel / Planilha (.xlsx)</option>
                    <option value="drive">Link do Google Drive</option>
                    <option value="other">Outro Formato</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800">Link do Arquivo (URL / Drive):</label>
                  <input
                    type="text"
                    value={formFileUrl}
                    onChange={(e) => setFormFileUrl(e.target.value)}
                    placeholder="https://drive.google.com/file/d/..."
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800">Tamanho Estimado:</label>
                  <input
                    type="text"
                    value={formFileSize}
                    onChange={(e) => setFormFileSize(e.target.value)}
                    placeholder="Ex: 2.5 MB"
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Check size={16} />
                  <span>{editingDoc ? 'Salvar Alterações' : 'Confirmar Inserção'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
