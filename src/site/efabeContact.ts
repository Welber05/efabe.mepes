import { SiteHeaderFooterSettings } from '../types';

export const EFABE_ADDRESS = 'Córrego da Prata, Zona Rural, Boa Esperança - ES, CEP: 29.845.000';
export const EFABE_PHONE = '+55 27 99836-9048';
export const EFABE_EMAIL = 'efabe@hotmail.com';

/** Update only legacy MEPES contact values, leaving user customizations intact. */
export function migrateEfabeContact(settings: SiteHeaderFooterSettings): SiteHeaderFooterSettings {
  const next = { ...settings };
  if (next.footerAddress === 'Anchieta & Unidades Regionais, Espírito Santo - ES') next.footerAddress = EFABE_ADDRESS;
  if (next.footerPhone === '(28) 3536-1200 / (27) 99881-2200') next.footerPhone = EFABE_PHONE;
  if (next.footerEmail === 'contato@mepes.org.br') next.footerEmail = EFABE_EMAIL;
  if (next.footerWebsite === 'www.mepes.org.br') next.footerWebsite = '';
  if (next.homeContactPhone === 'Atendimento: (28) 3536-1200 / (27) 99881-2200') next.homeContactPhone = `Atendimento: ${EFABE_PHONE}`;
  if (next.homeContactEmail === 'secretaria@mepes.org.br') next.homeContactEmail = EFABE_EMAIL;
  if (next.homeContactAddress === 'Anchieta e Unidades EFAs no ES') next.homeContactAddress = EFABE_ADDRESS;
  if (next.homePillarsBadge === 'PILARES DO MEPES') next.homePillarsBadge = 'PILARES DA EFABE';
  return next;
}
