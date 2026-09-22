import React, { useState } from 'react';
import { GoogleDriveFolderConfig, DriveFolderItem } from '../../types';
import { X, FolderOpen, Plus, Trash2, Edit3, ExternalLink, Check, Info, FolderPlus } from 'lucide-react';

interface DriveFoldersManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  driveConfig?: GoogleDriveFolderConfig;
  onUpdateDriveConfig: (config: GoogleDriveFolderConfig) => void;
  defaultCategory?: 'documentos' | 'fotos' | 'geral';
}

export const extractDriveFolderId = (url: string): string => {
  if (!url) return '';
  const match = url.match(/folders\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
  if (match && match[1]) return match[1];
  return url.trim();
};

export const DriveFoldersManagerModal: React.FC<DriveFoldersManagerModalProps> = ({
  isOpen,
  onClose,
  driveConfig,
  onUpdateDriveConfig,
  defaultCategory = 'documentos'
}) => {
  const folders = driveConfig?.folders || [
    {
      id: 'f-1',
      name: 'Pasta 1: Documentos Oficiais & Regimentos',
      url: driveConfig?.docFolderUrl || 'https://drive.google.com/drive/folders/1EFABE_DOCUMENTOS_OFICIAIS',
      folderId: driveConfig?.docFolderId || '1EFABE_DOCUMENTOS_OFICIAIS',
      category: 'documentos',
      description: 'Regimentos escolares, normas internas e comunicados da diretoria.'
    },
    {
      id: 'f-2',
      name: 'Pasta 2: Galeria Principal de Fotos EFABE',
      url: driveConfig?.photoFolderUrl || 'https://drive.google.com/drive/folders/1EFABE_ACERVO_FOTOGRAFICO',
      folderId: driveConfig?.photoFolderId || '1EFABE_ACERVO_FOTOGRAFICO',
      category: 'fotos',
      description: 'Fotos institucionais, eventos festivos e comemorações da escola.'
    }
  ];

  const [editingId, setEditingId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form State
  const [formName, setFormName] = useState('');
  const [formUrl, setFormUrl] = useState('');
  const [formCategory, setFormCategory] = useState<'documentos' | 'fotos' | 'geral'>(defaultCategory);
  const [formDescription, setFormDescription] = useState('');

  const [selectedFilterCategory, setSelectedFilterCategory] = useState<string>('todas');
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleOpenAdd = () => {
    setEditingId(null);
    const folderNumber = folders.length + 1;
    setFormName(`Pasta ${folderNumber}: `);
    setFormUrl('');
    setFormCategory(defaultCategory);
    setFormDescription('');
    setIsFormOpen(true);
  };

  const handleOpenEdit = (folder: DriveFolderItem) => {
    setEditingId(folder.id);
    setFormName(folder.name);
    setFormUrl(folder.url);
    setFormCategory(folder.category);
    setFormDescription(folder.description || '');
    setIsFormOpen(true);
  };

  const handleSaveFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formUrl.trim()) return;

    const folderId = extractDriveFolderId(formUrl);
    let updatedFolders: DriveFolderItem[];

    if (editingId) {
      updatedFolders = folders.map((f) =>
        f.id === editingId
          ? {
              ...f,
              name: formName.trim(),
              url: formUrl.trim(),
              folderId,
              category: formCategory,
              description: formDescription.trim()
            }
          : f
      );
    } else {
      const newFolder: DriveFolderItem = {
        id: `f-${Date.now()}`,
        name: formName.trim(),
        url: formUrl.trim(),
        folderId,
        category: formCategory,
        description: formDescription.trim()
      };
      updatedFolders = [...folders, newFolder];
    }

    // Keep legacy docFolderUrl / photoFolderUrl updated with first of each category if available
    const firstDoc = updatedFolders.find((f) => f.category === 'documentos' || f.category === 'geral');
    const firstPhoto = updatedFolders.find((f) => f.category === 'fotos' || f.category === 'geral');

    const newConfig: GoogleDriveFolderConfig = {
      ...driveConfig,
      folders: updatedFolders,
      docFolderUrl: firstDoc ? firstDoc.url : driveConfig?.docFolderUrl,
      docFolderId: firstDoc ? (firstDoc.folderId || extractDriveFolderId(firstDoc.url)) : driveConfig?.docFolderId,
      photoFolderUrl: firstPhoto ? firstPhoto.url : driveConfig?.photoFolderUrl,
      photoFolderId: firstPhoto ? (firstPhoto.folderId || extractDriveFolderId(firstPhoto.url)) : driveConfig?.photoFolderId,
    };

    onUpdateDriveConfig(newConfig);
    setIsFormOpen(false);
    setEditingId(null);
    setFeedbackMsg('Alterações salvas com sucesso!');
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  const handleDeleteFolder = (id: string) => {
    if (folders.length <= 1) {
      alert('Você precisa manter ao menos 1 pasta configurada no sistema.');
      return;
    }
    if (window.confirm('Tem certeza que deseja remover esta pasta da lista?')) {
      const updatedFolders = folders.filter((f) => f.id !== id);
      const firstDoc = updatedFolders.find((f) => f.category === 'documentos' || f.category === 'geral');
      const firstPhoto = updatedFolders.find((f) => f.category === 'fotos' || f.category === 'geral');

      const newConfig: GoogleDriveFolderConfig = {
        ...driveConfig,
        folders: updatedFolders,
        docFolderUrl: firstDoc ? firstDoc.url : driveConfig?.docFolderUrl,
        docFolderId: firstDoc ? (firstDoc.folderId || extractDriveFolderId(firstDoc.url)) : driveConfig?.docFolderId,
        photoFolderUrl: firstPhoto ? firstPhoto.url : driveConfig?.photoFolderUrl,
        photoFolderId: firstPhoto ? (firstPhoto.folderId || extractDriveFolderId(firstPhoto.url)) : driveConfig?.photoFolderId,
      };

      onUpdateDriveConfig(newConfig);
      setFeedbackMsg('Pasta removida com sucesso.');
      setTimeout(() => setFeedbackMsg(null), 3000);
    }
  };

  const filteredFolders = folders.filter((f) => {
    if (selectedFilterCategory === 'todas') return true;
    return f.category === selectedFilterCategory;
  });

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 relative my-8">
        
        {/* Header */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        <div className="space-y-1 pr-8">
          <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <FolderOpen className="text-emerald-700" size={24} />
            <span>Configurar Pastas do Google Drive</span>
          </h3>
          <p className="text-xs text-slate-600">
            Cadastre quantas pastas desejar (Pasta 1, Pasta 2, Pasta 3...). Elas ficarão disponíveis para navegação direta na tela dos Acervos.
          </p>
        </div>

        {feedbackMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2">
            <Check size={16} />
            <span>{feedbackMsg}</span>
          </div>
        )}

        {/* Action button & filter tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => setSelectedFilterCategory('todas')}
              className={`px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${
                selectedFilterCategory === 'todas'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todas ({folders.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedFilterCategory('documentos')}
              className={`px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${
                selectedFilterCategory === 'documentos'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Documentos ({folders.filter((f) => f.category === 'documentos').length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedFilterCategory('fotos')}
              className={`px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${
                selectedFilterCategory === 'fotos'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Fotos ({folders.filter((f) => f.category === 'fotos').length})
            </button>
          </div>

          {!isFormOpen && (
            <button
              type="button"
              onClick={handleOpenAdd}
              className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus size={16} />
              <span>+ Adicionar Nova Pasta</span>
            </button>
          )}
        </div>

        {/* Add/Edit Form */}
        {isFormOpen && (
          <form onSubmit={handleSaveFolder} className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
              <h4 className="font-extrabold text-sm text-emerald-950 flex items-center gap-1.5">
                <FolderPlus size={18} className="text-emerald-700" />
                <span>{editingId ? 'Editar Pasta do Google Drive' : 'Cadastrar Nova Pasta do Google Drive'}</span>
              </h4>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="text-xs text-slate-500 hover:text-slate-800 font-bold"
              >
                Cancelar
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800">
                  Nome / Título da Pasta: <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Ex: Pasta 1: Documentos Oficiais 2026"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800">
                  Destino da Pasta (Disponibilizar em):
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as 'documentos' | 'fotos' | 'geral')}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden font-medium"
                >
                  <option value="documentos">📄 Acervo Documental (Documentos)</option>
                  <option value="fotos">📷 Acervo Fotográfico (Fotos e Galerias)</option>
                  <option value="geral">🌐 Ambos os Acervos (Uso Geral)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800">
                Link Compartilhado da Pasta do Google Drive: <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formUrl}
                onChange={(e) => setFormUrl(e.target.value)}
                placeholder="https://drive.google.com/drive/folders/1ABC..."
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden font-medium"
              />
              <span className="text-[11px] text-slate-500 block">
                Cole o link que copiou do Google Drive (Ex: https://drive.google.com/drive/folders/...)
              </span>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800">
                Descrição Curta (Opcional):
              </label>
              <input
                type="text"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Ex: Contém regimentos, atas e autorizações do ano letivo."
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden font-medium"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-3.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer flex items-center gap-1"
              >
                <Check size={14} />
                <span>{editingId ? 'Atualizar Pasta' : 'Salvar Nova Pasta'}</span>
              </button>
            </div>
          </form>
        )}

        {/* List of folders */}
        <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
          {filteredFolders.map((folder, index) => {
            const folderId = folder.folderId || extractDriveFolderId(folder.url);
            return (
              <div
                key={folder.id}
                className="p-3.5 bg-slate-50 hover:bg-white border border-slate-200 rounded-2xl transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs hover:shadow-xs"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5">
                      <FolderOpen size={16} className="text-amber-600 shrink-0" />
                      <span className="truncate">{folder.name}</span>
                    </span>

                    {folder.category === 'documentos' && (
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold rounded-md">
                        Documentos
                      </span>
                    )}
                    {folder.category === 'fotos' && (
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-900 text-[10px] font-extrabold rounded-md">
                        Fotos
                      </span>
                    )}
                    {folder.category === 'geral' && (
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-extrabold rounded-md">
                        Geral
                      </span>
                    )}
                  </div>

                  {folder.description && (
                    <p className="text-[11px] text-slate-600 line-clamp-1">{folder.description}</p>
                  )}

                  <p className="text-[10px] text-slate-400 font-mono truncate">
                    ID: {folderId || 'N/D'}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                  <a
                    href={folder.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-bold"
                    title="Abrir no Google Drive"
                  >
                    <ExternalLink size={14} />
                    <span className="hidden md:inline">Abrir</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => handleOpenEdit(folder)}
                    className="p-2 bg-white hover:bg-slate-100 border border-slate-200 text-amber-700 rounded-xl transition-colors cursor-pointer"
                    title="Editar Pasta"
                  >
                    <Edit3 size={14} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteFolder(folder.id)}
                    className="p-2 bg-white hover:bg-red-50 border border-slate-200 text-red-600 rounded-xl transition-colors cursor-pointer"
                    title="Excluir Pasta"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}

          {filteredFolders.length === 0 && (
            <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-4 space-y-2">
              <FolderOpen size={32} className="mx-auto text-slate-300" />
              <p className="text-xs text-slate-500 font-medium">Nenhuma pasta cadastrada nesta categoria.</p>
              <button
                type="button"
                onClick={handleOpenAdd}
                className="text-emerald-700 font-bold text-xs hover:underline cursor-pointer"
              >
                + Cadastrar nova pasta agora
              </button>
            </div>
          )}
        </div>

        {/* Tip section */}
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-950 space-y-1">
          <div className="font-bold flex items-center gap-1 text-amber-900">
            <Info size={14} /> Como obter o link correto no Google Drive:
          </div>
          <ol className="list-decimal list-inside text-[11px] text-amber-900/90 space-y-0.5">
            <li>No Google Drive, clique com o botão direito na pasta que deseja disponibilizar.</li>
            <li>Clique em <strong>Compartilhar</strong> e mude o <em>Acesso geral</em> para <strong>"Qualquer pessoa com o link pode ver"</strong>.</li>
            <li>Clique em <strong>"Copiar link"</strong> e cole no campo acima.</li>
          </ol>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
          >
            Concluir / Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
