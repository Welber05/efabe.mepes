export type Role = 'guest' | 'admin' | 'teacher' | 'parent';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  cpf?: string;
  // especificos
  subjects?: string[]; // para professores
  studentIds?: string[]; // para pais
  studentName?: string; // nome do filho principal para exibicao
  turma?: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  category: 'Geral' | 'Calendário' | 'Eventos' | 'Pedagógico' | 'Urgente';
  date: string;
  author: string;
  targetRole: 'public' | 'teachers' | 'parents' | 'all';
  imageUrl?: string;
  pinned?: boolean;
}

export interface DocumentItem {
  id: string;
  title: string;
  description: string;
  category: string;
  fileUrl: string;
  driveFileId?: string;
  fileType?: 'pdf' | 'doc' | 'xls' | 'zip' | 'drive' | 'other';
  fileSize?: string;
  date: string;
  updatedAt?: string;
}

export interface PhotoItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  driveFileId?: string;
  date: string;
  year: string;
  eventType: string;
  location: string;
  turma?: string;
  author?: string;
  likes?: number;
}

export interface PhotoCatalogCategories {
  years: string[];
  eventTypes: string[];
  locations: string[];
}

export interface DriveFolderItem {
  id: string;
  name: string;
  url: string;
  folderId?: string;
  category: 'documentos' | 'fotos' | 'geral';
  description?: string;
}

export interface GoogleDriveFolderConfig {
  docFolderUrl?: string;
  docFolderId?: string;
  photoFolderUrl?: string;
  photoFolderId?: string;
  folders?: DriveFolderItem[];
}

export interface RoutinePhoto {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  date: string;
  turma: string;
  category: 'Agroecologia' | 'Aulas Práticas' | 'Vivência Comunitária' | 'Projetos' | 'Esportes' | 'Laboratório';
  author: string;
  likes: number;
}

export interface MenuItem {
  id: string;
  label: string;
  slug: string;
  order: number;
  visible: boolean;
  isCustom?: boolean;
  icon?: string;
  parentId?: string; // ID do menu pai, se for um submenu
}

export interface ContentBlock {
  id: string;
  type: 'text' | 'image' | 'features' | 'quote' | 'alert';
  title?: string;
  content: string;
  imageUrl?: string;
  caption?: string;
  hidden?: boolean;
}

export interface PageContent {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  heroText: string;
  heroImage: string;
  bodyText: string;
  features?: { title: string; desc: string; icon: string }[];
  blocks?: ContentBlock[];
  updatedAt: string;
  isCustom?: boolean;
}

export interface StudentGrade {
  studentId: string;
  studentName: string;
  subject: string;
  trimestre1: number;
  trimestre2: number;
  trimestre3: number;
  faltas: number;
  status: 'Aprovado' | 'Em Andamento' | 'Recuperação';
}

export interface Occurrence {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  teacherName: string;
  title: string;
  description: string;
  type: 'Elogio' | 'Observação' | 'Aviso' | 'Pedagógico';
  readByParent: boolean;
}

export interface AlternanciaSchedule {
  id: string;
  turma: string;
  period: string;
  mode: 'Escola' | 'Família';
  startDate: string;
  endDate: string;
  activities: string;
}

export interface Message {
  id: string;
  senderName: string;
  senderRole: string;
  receiverRole: string;
  subject: string;
  content: string;
  date: string;
  read: boolean;
}

export interface SiteHeaderFooterSettings {
  // Cabeçalho
  schoolAcronym: string;
  schoolBadge: string;
  schoolName: string;
  headerSlogan: string;
  topBannerAnnouncement: string;
  headerQuote: string;
  logoUrl: string;

  // Rodapé
  footerAboutText: string;
  footerSlogan: string;
  footerAddress: string;
  footerPhone: string;
  footerEmail: string;
  footerWebsite: string;
  footerCopyright: string;
  footerUnitsText: string;
  footerCoursesList: string[];

  // Títulos Personalizados das Seções do Painel Gerencial
  adminSectionTitles?: Record<string, string>;

  // Blocos Editáveis da Página Principal (Home)
  homePillarsBadge?: string;
  homePillarsTitle?: string;
  homePillarsSubtitle?: string;
  homePillarsList?: { title: string; desc: string; icon: string }[];

  homeCoursesBadge?: string;
  homeCoursesTitle?: string;
  homeCoursesList?: { title: string; desc: string; tag: string; icon: string }[];

  homeNoticesTitle?: string;
  homePhotosTitle?: string;

  // Ordem e Visibilidade das Seções da Home
  homeSectionOrder?: string[];
  hiddenHomeSections?: string[];

  // Bloco Fale Conosco (Contato / Pré-Matrícula)
  homeContactBadge?: string;
  homeContactTitle?: string;
  homeContactDesc?: string;
  homeContactPhone?: string;
  homeContactEmail?: string;
  homeContactAddress?: string;
  homeContactFormTitle?: string;
  homeContactButtonText?: string;

  // Matriz Curricular
  homeMatrixCurriculumText?: string;
  homeMatrixCurriculumModalContent?: string;
  homeMatrixCurriculumSubjects?: { year: string; title: string; subjects: string; ch: string }[];
}

