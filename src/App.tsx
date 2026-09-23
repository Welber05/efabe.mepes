import React, { useState, useEffect } from 'react';
import { User, PageContent, Notice, RoutinePhoto, StudentGrade, Occurrence, AlternanciaSchedule, Message, MenuItem, SiteHeaderFooterSettings, DocumentItem, PhotoItem, PhotoCatalogCategories, GoogleDriveFolderConfig } from './types';
import { 
  INITIAL_USERS, 
  INITIAL_PAGES, 
  INITIAL_NOTICES, 
  INITIAL_ROUTINE_PHOTOS, 
  INITIAL_STUDENT_GRADES, 
  INITIAL_OCCURRENCES, 
  INITIAL_ALTERNANCIA_SCHEDULE, 
  INITIAL_MESSAGES,
  INITIAL_MENU_ITEMS,
  INITIAL_SITE_SETTINGS,
  INITIAL_ACERVO_DOCUMENTS,
  INITIAL_ACERVO_PHOTOS,
  INITIAL_PHOTO_CATEGORIES,
  INITIAL_DRIVE_CONFIG
} from './data/initialData';

import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LoginModal } from './components/LoginModal';
import { PublicWebsite } from './components/public/PublicWebsite';
import { CommunicadosView } from './components/public/CommunicadosView';
import { RoutineGalleryView } from './components/public/RoutineGalleryView';
import { AcervoDocumentosView } from './components/public/AcervoDocumentosView';
import { AcervoFotograficoView } from './components/public/AcervoFotograficoView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { TeacherPortal } from './components/teacher/TeacherPortal';
import { ParentPortal } from './components/parent/ParentPortal';
import { deleteCmsPage, saveCmsPage, subscribeCmsPages } from './cms/firebaseRepository';
import { isFirebaseConfigured } from './lib/firebase';
import { firebaseAuth } from './lib/firebase';
import { signOut } from 'firebase/auth';
import { AccessArea, canAccess, canAccessAdmin } from './auth/access';
import { menuDescendantIds } from './menu/hierarchy';
import { migrateEfabeContact } from './site/efabeContact';

export default function App() {
  // Current user state with local persistence
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    return null;
  });

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<string>('home');
  const [adminInitialTab, setAdminInitialTab] = useState<string>('site-settings');

  // Login Modal state
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Site Header & Footer Settings
  const [siteSettings, setSiteSettings] = useState<SiteHeaderFooterSettings>(() => {
    const saved = localStorage.getItem('mepes_site_settings');
    if (!saved) return INITIAL_SITE_SETTINGS;
    try { return migrateEfabeContact(JSON.parse(saved) as SiteHeaderFooterSettings); }
    catch { return INITIAL_SITE_SETTINGS; }
  });

  // Dynamic Content States with localStorage persistence & automatic code sync
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem('mepes_menu_items');
    let items = INITIAL_MENU_ITEMS;
    if (saved) {
      try {
        items = JSON.parse(saved);
      } catch {
        items = INITIAL_MENU_ITEMS;
      }
    }
    // Deduplicate menu items and ensure EXACTLY ONE 'Contato' entry exists
    const seenKeys = new Set<string>();
    const deduplicated: MenuItem[] = [];

    for (const item of items) {
      const key = `${item.slug.toLowerCase().trim()}:${item.label.toLowerCase().trim()}`;
      if (!seenKeys.has(key)) {
        seenKeys.add(key);
        deduplicated.push(item);
      }
    }

    const hasAcervoParent = deduplicated.some(item => item.slug === 'acervo' || item.id === 'm-8');
    if (!hasAcervoParent) {
      deduplicated.push({ id: 'm-8', label: 'Acervo', slug: 'acervo', order: 8, visible: true });
    }

    const hasDocAcervo = deduplicated.some(item => item.slug === 'acervo-documentos');
    if (!hasDocAcervo) {
      deduplicated.push({ id: 'm-8-1', label: 'Acervo Documental', slug: 'acervo-documentos', order: 1, visible: true, parentId: 'm-8' });
    }

    const hasPhotoAcervo = deduplicated.some(item => item.slug === 'acervo-galeria');
    if (!hasPhotoAcervo) {
      deduplicated.push({ id: 'm-8-2', label: 'Acervo Fotográfico', slug: 'acervo-galeria', order: 2, visible: true, parentId: 'm-8' });
    }

    const hasContact = deduplicated.some(
      item => item.slug === 'contact' || item.label.toLowerCase().trim() === 'contato'
    );
    if (!hasContact) {
      deduplicated.push({ id: 'm-9', label: 'Contato', slug: 'contact', order: 9, visible: true });
    }

    if (JSON.stringify(deduplicated) !== saved) {
      localStorage.setItem('mepes_menu_items', JSON.stringify(deduplicated));
    }
    return deduplicated;
  });

  const [pages, setPages] = useState<PageContent[]>(() => {
    const saved = localStorage.getItem('mepes_pages');
    if (!saved) return INITIAL_PAGES;
    try {
      const parsed: PageContent[] = JSON.parse(saved);
      const hasContactPage = parsed.some(p => p.slug === 'contact' || p.id === 'pg-contact');
      if (!hasContactPage) {
        const defaultContactPage = INITIAL_PAGES.find(p => p.slug === 'contact') || {
          id: 'pg-contact',
          slug: 'contact',
          title: 'Fale Conosco & Processo Seletivo / Matrículas',
          subtitle: 'Estamos de portas abertas para receber você e sua família',
          heroText: 'Agende uma visita guiada às nossas instalações e conheça nossa equipe pedagógica.',
          heroImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1200',
          bodyText: 'Entre em contato com nossa secretaria escolar ou preencha a ficha de pré-inscrição para as turmas de 2027.',
          updatedAt: '2026-09-18'
        };
        const updated = [...parsed, defaultContactPage];
        localStorage.setItem('mepes_pages', JSON.stringify(updated));
        return updated;
      }
      return parsed;
    } catch {
      return INITIAL_PAGES;
    }
  });

  const [notices, setNotices] = useState<Notice[]>(() => {
    const saved = localStorage.getItem('mepes_notices');
    return saved ? JSON.parse(saved) : INITIAL_NOTICES;
  });

  const [routinePhotos, setRoutinePhotos] = useState<RoutinePhoto[]>(() => {
    const saved = localStorage.getItem('mepes_photos');
    return saved ? JSON.parse(saved) : INITIAL_ROUTINE_PHOTOS;
  });

  const [grades, setGrades] = useState<StudentGrade[]>(() => {
    const saved = localStorage.getItem('mepes_grades');
    return saved ? JSON.parse(saved) : INITIAL_STUDENT_GRADES;
  });

  const [occurrences, setOccurrences] = useState<Occurrence[]>(() => {
    const saved = localStorage.getItem('mepes_occurrences');
    return saved ? JSON.parse(saved) : INITIAL_OCCURRENCES;
  });

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('mepes_messages');
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('mepes_users_list');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [documents, setDocuments] = useState<DocumentItem[]>(() => {
    const saved = localStorage.getItem('mepes_acervo_documents');
    return saved ? JSON.parse(saved) : INITIAL_ACERVO_DOCUMENTS;
  });

  const [acervoPhotos, setAcervoPhotos] = useState<PhotoItem[]>(() => {
    const saved = localStorage.getItem('mepes_acervo_photos');
    return saved ? JSON.parse(saved) : INITIAL_ACERVO_PHOTOS;
  });

  const [photoCategories, setPhotoCategories] = useState<PhotoCatalogCategories>(() => {
    const saved = localStorage.getItem('mepes_photo_categories');
    return saved ? JSON.parse(saved) : INITIAL_PHOTO_CATEGORIES;
  });

  const [driveConfig, setDriveConfig] = useState<GoogleDriveFolderConfig>(() => {
    const saved = localStorage.getItem('mepes_drive_config');
    return saved ? JSON.parse(saved) : INITIAL_DRIVE_CONFIG;
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('mepes_site_settings', JSON.stringify(siteSettings));
  }, [siteSettings]);

  useEffect(() => {
    localStorage.setItem('mepes_menu_items', JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem('mepes_pages', JSON.stringify(pages));
  }, [pages]);

  useEffect(() => {
    localStorage.setItem('mepes_notices', JSON.stringify(notices));
  }, [notices]);

  useEffect(() => {
    localStorage.setItem('mepes_photos', JSON.stringify(routinePhotos));
  }, [routinePhotos]);

  useEffect(() => {
    localStorage.setItem('mepes_grades', JSON.stringify(grades));
  }, [grades]);

  useEffect(() => {
    localStorage.setItem('mepes_occurrences', JSON.stringify(occurrences));
  }, [occurrences]);

  useEffect(() => {
    localStorage.setItem('mepes_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('mepes_users_list', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('mepes_acervo_documents', JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem('mepes_acervo_photos', JSON.stringify(acervoPhotos));
  }, [acervoPhotos]);

  useEffect(() => {
    localStorage.setItem('mepes_photo_categories', JSON.stringify(photoCategories));
  }, [photoCategories]);

  useEffect(() => {
    localStorage.setItem('mepes_drive_config', JSON.stringify(driveConfig));
  }, [driveConfig]);

  // Quando o Firebase estiver configurado, o Firestore passa a ser a fonte
  // compartilhada do CMS. O localStorage continua como cache/offline fallback.
  useEffect(() => {
    if (!isFirebaseConfigured) return;
    return subscribeCmsPages(
      (cloudPages) => {
        if (!cloudPages.length) return;
        setPages((localPages) => {
          const cloudById = new Map(cloudPages.map((page) => [page.id, page]));
          const merged = localPages.map((page) => cloudById.get(page.id) || page);
          const localIds = new Set(localPages.map((page) => page.id));
          return [...merged, ...cloudPages.filter((page) => !localIds.has(page.id))];
        });
      },
      (error) => console.error('Não foi possível sincronizar as páginas do CMS:', error),
    );
  }, []);

  // Handlers for Acervo Documental & Fotografico
  const handleAddDocument = (doc: DocumentItem) => {
    setDocuments((prev) => [doc, ...prev]);
  };

  const handleUpdateDocument = (doc: DocumentItem) => {
    setDocuments((prev) => prev.map((d) => (d.id === doc.id ? doc : d)));
  };

  const handleDeleteDocument = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  const handleAddAcervoPhoto = (photo: PhotoItem) => {
    setAcervoPhotos((prev) => [photo, ...prev]);
  };

  const handleUpdateAcervoPhoto = (photo: PhotoItem) => {
    setAcervoPhotos((prev) => prev.map((p) => (p.id === photo.id ? photo : p)));
  };

  const handleDeleteAcervoPhoto = (id: string) => {
    setAcervoPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  // Handlers
  const handleSelectUser = (user: User) => {
    setCurrentUser(user);
    if (canAccessAdmin(user)) setActiveTab('admin-dashboard');
    else if (canAccess(user, 'teacher-portal')) setActiveTab('teacher-portal');
    else if (canAccess(user, 'parent-portal')) setActiveTab('parent-portal');
    else setActiveTab('home');
  };

  const handleLogout = () => {
    if (firebaseAuth) void signOut(firebaseAuth);
    setCurrentUser(null);
    setActiveTab('home');
  };

  const handleUpdatePage = (updatedPage: PageContent) => {
    setPages((prev) => prev.map((p) => (p.slug === updatedPage.slug ? updatedPage : p)));
    setMenuItems((prev) =>
      prev.map((m) => (m.slug === updatedPage.slug ? { ...m, label: updatedPage.title } : m))
    );
    if (isFirebaseConfigured) void saveCmsPage(updatedPage);
  };

  const handleAddPage = (newPage: PageContent) => {
    setPages((prev) => [...prev, newPage]);
    if (isFirebaseConfigured) void saveCmsPage(newPage);
  };

  const handleDeletePage = (slug: string) => {
    const pageToDelete = pages.find((page) => page.slug === slug);
    setPages((prev) => prev.filter((p) => p.slug !== slug));
    if (isFirebaseConfigured && pageToDelete) void deleteCmsPage(pageToDelete.id);
  };

  const handleAddMenuItem = (newItem: MenuItem) => {
    setMenuItems((prev) => [...prev, newItem]);
  };

  const handleUpdateMenuItem = (updatedItem: MenuItem) => {
    const oldItem = menuItems.find((m) => m.id === updatedItem.id);
    const oldSlug = oldItem?.slug;

    setMenuItems((prev) => prev.map((m) => (m.id === updatedItem.id ? updatedItem : m)));

    setPages((prevPages) => {
      const pageIndex = prevPages.findIndex(
        (p) => (oldSlug && p.slug === oldSlug) || p.slug === updatedItem.slug || p.id === `pg-${updatedItem.slug}`
      );

      if (pageIndex !== -1) {
        const next = [...prevPages];
        next[pageIndex] = {
          ...next[pageIndex],
          slug: updatedItem.slug,
          title: updatedItem.label,
        };
        return next;
      } else {
        const newPage: PageContent = {
          id: `pg-${updatedItem.slug}`,
          slug: updatedItem.slug,
          title: updatedItem.label,
          subtitle: `Página oficial de ${updatedItem.label} - EFABE`,
          heroText: `Seja bem-vindo à página de ${updatedItem.label} da EFABE.`,
          heroImage: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=1200',
          bodyText: `Conteúdo da página ${updatedItem.label}.`,
          blocks: [],
          updatedAt: new Date().toISOString().split('T')[0],
          isCustom: true,
        };
        return [...prevPages, newPage];
      }
    });
  };

  const handleDeleteMenuItem = (id: string) => {
    const idsToDelete = menuDescendantIds(menuItems, id);
    idsToDelete.add(id);
    const slugsToDelete = new Set(menuItems.filter((item) => idsToDelete.has(item.id)).map((item) => item.slug));
    setMenuItems((prev) => {
      return prev.filter((m) => !idsToDelete.has(m.id));
    });
    setPages((prev) => prev.filter((page) => !slugsToDelete.has(page.slug)));
    if (isFirebaseConfigured) pages.filter((page) => slugsToDelete.has(page.slug)).forEach((page) => { void deleteCmsPage(page.id); });
  };

  const handleReorderMenuItems = (reorderedSubset: MenuItem[]) => {
    setMenuItems((prev) => {
      const map = new Map(reorderedSubset.map((item) => [item.id, item]));
      return prev.map((item) => map.get(item.id) || item);
    });
  };

  const handleAddNotice = (newNotice: Notice) => {
    setNotices((prev) => [newNotice, ...prev]);
  };

  const handleUpdateNotice = (updatedNotice: Notice) => {
    setNotices((prev) => prev.map((n) => (n.id === updatedNotice.id ? updatedNotice : n)));
  };

  const handleDeleteNotice = (id: string) => {
    setNotices((prev) => prev.filter((n) => n.id !== id));
  };

  const handleAddRoutinePhoto = (newPhoto: RoutinePhoto) => {
    setRoutinePhotos((prev) => [newPhoto, ...prev]);
  };

  const handleUpdateRoutinePhoto = (updatedPhoto: RoutinePhoto) => {
    setRoutinePhotos((prev) => prev.map((p) => (p.id === updatedPhoto.id ? updatedPhoto : p)));
  };

  const handleDeleteRoutinePhoto = (id: string) => {
    setRoutinePhotos((prev) => prev.filter((p) => p.id !== id));
  };

  const handleAddUser = (newUser: User) => {
    setUsers((prev) => [...prev, newUser]);
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    setCurrentUser((current) => current?.id === updatedUser.id ? updatedUser : current);
  };

  const handleDeleteUser = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const handleLikePhoto = (id: string) => {
    setRoutinePhotos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, likes: p.likes + 1 } : p))
    );
  };

  const handleUpdateGrades = (updatedGrades: StudentGrade[]) => {
    setGrades(updatedGrades);
  };

  const handleAddOccurrence = (newOcc: Occurrence) => {
    setOccurrences((prev) => [newOcc, ...prev]);
  };

  const handleSendMessage = (newMsg: Message) => {
    setMessages((prev) => [newMsg, ...prev]);
  };

  const handleGoToAdminTab = (tabSlug?: string) => {
    if (!canAccessAdmin(currentUser) || (tabSlug && !canAccess(currentUser, tabSlug as AccessArea))) {
      setIsLoginOpen(true);
      return;
    }
    if (tabSlug) setAdminInitialTab(tabSlug);
    setActiveTab('admin-dashboard');
  };

  const protectedTab = activeTab === 'admin-dashboard' || activeTab === 'teacher-portal' || activeTab === 'parent-portal';
  const authorizedTab =
    (activeTab === 'admin-dashboard' && canAccessAdmin(currentUser)) ||
    (activeTab === 'teacher-portal' && canAccess(currentUser, 'teacher-portal')) ||
    (activeTab === 'parent-portal' && canAccess(currentUser, 'parent-portal'));

  return (
    <div className="min-h-screen flex flex-col font-sans antialiased text-slate-900 bg-slate-50 selection:bg-emerald-200 selection:text-emerald-900">
      
      {/* Navigation Header */}
      <Header
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenLogin={() => setIsLoginOpen(true)}
        onLogout={handleLogout}
        menuItems={menuItems}
        siteSettings={siteSettings}
        onGoToAdmin={handleGoToAdminTab}
      />

      {/* Main Content Render Based on activeTab */}
      <main className="flex-1">
        {protectedTab && !authorizedTab ? (
          <div className="max-w-xl mx-auto my-16 p-8 bg-white border border-emerald-100 rounded-2xl text-center shadow-sm">
            <h1 className="text-xl font-bold text-emerald-950">Acesso restrito</h1>
            <p className="text-sm text-slate-600 mt-2">Entre com sua conta para abrir este painel.</p>
            <button onClick={() => setIsLoginOpen(true)} className="mt-5 px-5 py-2.5 bg-emerald-700 text-white rounded-xl font-bold">Entrar</button>
          </div>
        ) : activeTab === 'admin-dashboard' ? (
          <AdminDashboard
            currentUser={currentUser!}
            pages={pages}
            onUpdatePage={handleUpdatePage}
            onAddPage={handleAddPage}
            onDeletePage={handleDeletePage}
            menuItems={menuItems}
            onAddMenuItem={handleAddMenuItem}
            onUpdateMenuItem={handleUpdateMenuItem}
            onDeleteMenuItem={handleDeleteMenuItem}
            onReorderMenuItems={handleReorderMenuItems}
            notices={notices}
            onAddNotice={handleAddNotice}
            onUpdateNotice={handleUpdateNotice}
            onDeleteNotice={handleDeleteNotice}
            routinePhotos={routinePhotos}
            onAddRoutinePhoto={handleAddRoutinePhoto}
            onUpdateRoutinePhoto={handleUpdateRoutinePhoto}
            onDeleteRoutinePhoto={handleDeleteRoutinePhoto}
            usersList={users}
            onAddUser={handleAddUser}
            onUpdateUser={handleUpdateUser}
            onDeleteUser={handleDeleteUser}
            onOpenPublicSite={() => setActiveTab('home')}
            siteSettings={siteSettings}
            onUpdateSiteSettings={setSiteSettings}
            initialAdminTab={adminInitialTab}
          />
        ) : activeTab === 'teacher-portal' ? (
          <TeacherPortal
            teacherUser={currentUser && currentUser.role === 'teacher' ? currentUser : users.find(u => u.role === 'teacher') || INITIAL_USERS[1]}
            grades={grades}
            onUpdateGrades={handleUpdateGrades}
            occurrences={occurrences}
            onAddOccurrence={handleAddOccurrence}
            onAddRoutinePhoto={handleAddRoutinePhoto}
            onAddNotice={handleAddNotice}
          />
        ) : activeTab === 'parent-portal' ? (
          <ParentPortal
            parentUser={currentUser && currentUser.role === 'parent' ? currentUser : users.find(u => u.role === 'parent') || INITIAL_USERS[2]}
            grades={grades}
            occurrences={occurrences}
            schedule={INITIAL_ALTERNANCIA_SCHEDULE}
            routinePhotos={routinePhotos}
            messages={messages}
            onSendMessage={handleSendMessage}
          />
        ) : activeTab === 'notices' ? (
          <CommunicadosView notices={notices} />
        ) : activeTab === 'routine' ? (
          <RoutineGalleryView photos={routinePhotos} onLikePhoto={handleLikePhoto} />
        ) : activeTab === 'acervo-documentos' ? (
          <AcervoDocumentosView
            documents={documents}
            onAddDocument={handleAddDocument}
            onUpdateDocument={handleUpdateDocument}
            onDeleteDocument={handleDeleteDocument}
            driveConfig={driveConfig}
            onUpdateDriveConfig={setDriveConfig}
            currentUser={currentUser}
          />
        ) : activeTab === 'acervo-galeria' || activeTab === 'acervo' ? (
          <AcervoFotograficoView
            photos={acervoPhotos}
            onAddPhoto={handleAddAcervoPhoto}
            onUpdatePhoto={handleUpdateAcervoPhoto}
            onDeletePhoto={handleDeleteAcervoPhoto}
            categories={photoCategories}
            onUpdateCategories={setPhotoCategories}
            driveConfig={driveConfig}
            onUpdateDriveConfig={setDriveConfig}
            currentUser={currentUser}
          />
        ) : (
          <PublicWebsite
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            pages={pages}
            notices={notices}
            routinePhotos={routinePhotos}
            onOpenLogin={() => setIsLoginOpen(true)}
            currentUser={currentUser}
            onGoToAdmin={handleGoToAdminTab}
            siteSettings={siteSettings}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        siteSettings={siteSettings}
        currentUser={currentUser}
        onGoToAdmin={handleGoToAdminTab}
      />

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        usersList={users}
        onLoginSuccess={handleSelectUser}
      />

    </div>
  );
}
