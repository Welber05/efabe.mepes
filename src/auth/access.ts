import { Role, User } from '../types';

export const ACCESS_AREAS = [
  { id: 'professional-builder', label: 'Construtor profissional' },
  { id: 'site-settings', label: 'Cabeçalho e rodapé' },
  { id: 'home-blocks', label: 'Página inicial' },
  { id: 'menu', label: 'Menu do site' },
  { id: 'pages', label: 'Páginas e blocos' },
  { id: 'notices', label: 'Comunicados' },
  { id: 'routine', label: 'Fotos da rotina' },
  { id: 'users', label: 'Usuários e permissões' },
  { id: 'teacher-portal', label: 'Portal do professor' },
  { id: 'parent-portal', label: 'Portal dos pais' },
] as const;

export type AccessArea = typeof ACCESS_AREAS[number]['id'];

export const ADMIN_AREAS: AccessArea[] = ACCESS_AREAS.slice(0, 8).map((area) => area.id);

export function defaultAreasForRole(role: Role): AccessArea[] {
  if (role === 'admin') return [...ADMIN_AREAS];
  if (role === 'teacher') return ['teacher-portal'];
  if (role === 'parent') return ['parent-portal'];
  return [];
}

export function canAccess(user: User | null | undefined, area: AccessArea): boolean {
  if (!user) return false;
  return (user.allowedAreas ?? defaultAreasForRole(user.role)).includes(area);
}

export function canAccessAdmin(user: User | null | undefined): boolean {
  return ADMIN_AREAS.some((area) => canAccess(user, area));
}
