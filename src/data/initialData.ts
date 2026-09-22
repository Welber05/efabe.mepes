import { Notice, RoutinePhoto, PageContent, User, StudentGrade, Occurrence, AlternanciaSchedule, Message, MenuItem, SiteHeaderFooterSettings, DocumentItem, PhotoItem, PhotoCatalogCategories, GoogleDriveFolderConfig } from '../types';

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  { id: 'm-1', label: 'Início', slug: 'home', order: 1, visible: true },

  { id: 'm-2', label: 'Quem Somos', slug: 'about', order: 2, visible: true },
  { id: 'm-2-1', label: 'Nossa História', slug: 'about-historia', order: 1, visible: true, parentId: 'm-2' },
  { id: 'm-2-2', label: 'Corpo Docente & Equipe', slug: 'about-equipe', order: 2, visible: true, parentId: 'm-2' },
  { id: 'm-2-3', label: 'Nossa Missão', slug: 'about-missao', order: 3, visible: true, parentId: 'm-2' },
  { id: 'm-2-4', label: 'Nossos Objetivos', slug: 'about-objetivos', order: 4, visible: true, parentId: 'm-2' },
  { id: 'm-2-5', label: 'Nossa Visão', slug: 'about-visao', order: 5, visible: true, parentId: 'm-2' },

  { id: 'm-3', label: 'A Pedagogia da Alternância', slug: 'pedagogia-alternancia', order: 3, visible: true },
  { id: 'm-3-1', label: 'Metodologia da Alternância', slug: 'metodologia-alternancia', order: 1, visible: true, parentId: 'm-3' },
  { id: 'm-3-2', label: 'Formação', slug: 'formacao', order: 2, visible: true, parentId: 'm-3' },

  { id: 'm-4', label: 'Nossa Instância Orgânica', slug: 'instancia-organica', order: 4, visible: true },
  { id: 'm-4-1', label: 'MEPES', slug: 'mepes', order: 1, visible: true, parentId: 'm-4' },
  { id: 'm-4-2', label: 'RACEFFAES', slug: 'raceffaes', order: 2, visible: true, parentId: 'm-4' },
  { id: 'm-4-3', label: 'Parcerias e Projetos', slug: 'parcerias-projetos', order: 3, visible: true, parentId: 'm-4' },

  { id: 'm-5', label: 'Parceiros de Formação', slug: 'parceiros-formacao', order: 5, visible: true },
  { id: 'm-5-1', label: 'Auto-organização do Trabalho Pedagógico', slug: 'auto-organizacao', order: 1, visible: true, parentId: 'm-5' },
  { id: 'm-5-2', label: 'APEFFABE', slug: 'apeffabe', order: 2, visible: true, parentId: 'm-5' },
  { id: 'm-5-3', label: 'AECEFFABE', slug: 'aeceffabe', order: 3, visible: true, parentId: 'm-5' },

  { id: 'm-6', label: 'Notícias', slug: 'notices', order: 6, visible: true },

  { id: 'm-7', label: 'Formandos', slug: 'formandos', order: 7, visible: true },

  { id: 'm-8', label: 'Acervo', slug: 'acervo', order: 8, visible: true },
  { id: 'm-8-1', label: 'Documentos e Matrizes', slug: 'acervo-documentos', order: 1, visible: true, parentId: 'm-8' },
  { id: 'm-8-2', label: 'Galeria de Fotos e Projetos', slug: 'acervo-galeria', order: 2, visible: true, parentId: 'm-8' },

  { id: 'm-9', label: 'Contato', slug: 'contact', order: 9, visible: true },
];

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-admin',
    name: 'Profa. Helena Schunk',
    email: 'admin@mepes.org.br',
    role: 'admin',
    cpf: '111.222.333-44',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 'usr-teacher-1',
    name: 'Prof. Carlos Eduardo Andrade',
    email: 'professor@mepes.org.br',
    role: 'teacher',
    cpf: '222.333.444-55',
    subjects: ['Agropecuária', 'Biologia Vegetal', 'Projetos Profissionais'],
    turma: '2º Ano - Téc. Agropecuária',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 'usr-parent-1',
    name: 'Mariana & Roberto Silva',
    email: 'pais@mepes.org.br',
    role: 'parent',
    cpf: '333.444.555-66',
    studentIds: ['st-01'],
    studentName: 'Lucas Silva Santos',
    turma: '2º Ano - Téc. Agropecuária',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
  }
];

export const INITIAL_PAGES: PageContent[] = [
  {
    id: 'pg-home',
    slug: 'home',
    title: 'EFABE - Formação Integral e Agroecologia',
    subtitle: 'Educando com a Pedagogia da Alternância para o desenvolvimento sustentável das comunidades rurais',
    heroText: 'Um sonho realizado há 40 anos! Promovendo a educação do campo com excelência técnica, ética e compromisso social.',
    heroImage: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=1200',
    bodyText: 'A EFABE (Escola Família Agrícola) é referência na Pedagogia da Alternância. Nossa proposta pedagógica conecta o aprendizado na escola com a vivência prática na propriedade familiar.',
    features: [
      { title: 'Pedagogia da Alternância', desc: '1 semana de permanência em regime de internato e 1 semana em família aplicando o Plano de Estudo na propriedade.', icon: 'Repeat' },
      { title: 'Ensino Técnico Integrado', desc: 'Formação em Agropecuária, Meio Ambiente e Agroindústria com diploma reconhecido e foco na sustentabilidade.', icon: 'GraduationCap' },
      { title: 'Desenvolvimento Local', desc: 'Incentivo ao empreendedorismo jovem rural, sucessão familiar sustentável e agroecologia regional.', icon: 'Sprout' },
      { title: 'Formação Humana e Cidadã', desc: 'Valores comunitários, liderança, cooperação e respeito ao meio ambiente.', icon: 'Users' }
    ],
    updatedAt: '2026-09-18'
  },
  {
    id: 'pg-about',
    slug: 'about',
    title: 'Sobre a EFABE - Escola Família Agrícola de Boa Esperança',
    subtitle: 'Uma trajetória de inovação e valorização da vida no campo',
    heroText: 'Integrando conhecimento acadêmico com a sabedoria tradicional e práticas agrícolas modernas.',
    heroImage: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb1475a?auto=format&fit=crop&q=80&w=1200',
    bodyText: 'A EFABE (Escola Família Agrícola de Boa Esperança) é referência na implantação da Pedagogia da Alternância. Nossa proposta conecta o aprendizado escolar com a vivência prática na propriedade familiar, fortalecendo as comunidades rurais.',
    updatedAt: '2026-09-18'
  },
  {
    id: 'pg-about-historia',
    slug: 'about-historia',
    title: 'Nossa História e Legado',
    subtitle: 'Quatro décadas de dedicação à educação do campo em Boa Esperança',
    heroText: 'Construindo o futuro com a força das famílias agrícolas e da agroecologia.',
    heroImage: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=1200',
    bodyText: 'A EFABE nasceu do sonho e da união das famílias rurais. A história da nossa escola é marcada pela transformação comunitária e fortalecimento da agricultura familiar.',
    updatedAt: '2026-09-18'
  },
  {
    id: 'pg-about-equipe',
    slug: 'about-equipe',
    title: 'Corpo Docente e Equipe Pedagógica',
    subtitle: 'Educadores comprometidos com a Pedagogia da Alternância',
    heroText: 'Profissionais multidisciplinares acompanhando a formação teórica e prática dos estudantes.',
    heroImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1200',
    bodyText: 'Nossa equipe é formada por engenheiros agrônomos, biólogos, pedagogos e monitores de internato que vivenciam o dia a dia da alternância.',
    updatedAt: '2026-09-18'
  },
  {
    id: 'pg-about-missao',
    slug: 'about-missao',
    title: 'Nossa Missão Institucional',
    subtitle: 'Promover a educação integral das juventudes rurais',
    heroText: 'Formar cidadãos conscientes, autônomos e tecnicamente capacitados para transformar o meio rural.',
    heroImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1200',
    bodyText: 'Nossa missão é oferecer uma educação do campo contextualizada, fundamentada na Pedagogia da Alternância, promovendo o desenvolvimento sustentável, a agroecologia e a liderança comunitária.',
    updatedAt: '2026-09-18'
  },
  {
    id: 'pg-about-objetivos',
    slug: 'about-objetivos',
    title: 'Nossos Objetivos Pedagógicos e Sociais',
    subtitle: 'Metas e princípios norteadores da formação na EFABE',
    heroText: 'Desenvolver competências técnicas e humanas integradas à vida familiar.',
    heroImage: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb1475a?auto=format&fit=crop&q=80&w=1200',
    bodyText: 'Fomentar o protagonismo juvenil rural, incentivar a sucessão familiar agroecológica e fortalecer a integração entre escola, família e comunidade.',
    updatedAt: '2026-09-18'
  },
  {
    id: 'pg-about-visao',
    slug: 'about-visao',
    title: 'Nossa Visão de Futuro',
    subtitle: 'Referência em educação do campo e transição agroecológica',
    heroText: 'Consolidar um modelo educacional do campo inovador, inclusivo e sustentável.',
    heroImage: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=1200',
    bodyText: 'Ser reconhecida como centro de excelência em Pedagogia da Alternância e práticas agrícolas sustentáveis no estado e no Brasil.',
    updatedAt: '2026-09-18'
  },

  {
    id: 'pg-pedagogia-alternancia',
    slug: 'pedagogia-alternancia',
    title: 'A Pedagogia da Alternância na EFABE',
    subtitle: 'A integração permanente entre a Sessão Escola e a Sessão Família',
    heroText: 'Uma metodologia educacional transformadora que valoriza a vivência e a pesquisa de campo.',
    heroImage: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb1475a?auto=format&fit=crop&q=80&w=1200',
    bodyText: 'A Pedagogia da Alternância estrutura a rotina escolar em ciclos alternados de estudo e prática, unindo a sabedoria das famílias rurais à formação técnica e científica.',
    updatedAt: '2026-09-18'
  },
  {
    id: 'pg-metodologia-alternancia',
    slug: 'metodologia-alternancia',
    title: 'Metodologia da Alternância e Instrumentos Pedagógicos',
    subtitle: 'Plano de Estudo, Caderneta de Campo, Colóquios e Visitas da Família',
    heroText: 'Sessão Escola no internato e Sessão Família com pesquisa orientada.',
    heroImage: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb1475a?auto=format&fit=crop&q=80&w=1200',
    bodyText: 'A cada alternância o aluno utiliza instrumentos como o Plano de Estudo (PE), o Caderno da Realidade e a Ficha de Colóquio para investigar a realidade da sua propriedade.',
    updatedAt: '2026-09-18'
  },
  {
    id: 'pg-formacao',
    slug: 'formacao',
    title: 'Cursos e Matriz Curricular Integrada',
    subtitle: 'Técnico em Agropecuária (3 Anos) e Técnico em Meio Ambiente (3 Anos)',
    heroText: 'Formação profissional integral de nível médio com diploma reconhecido e Pedagogia da Alternância.',
    heroImage: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&q=80&w=1200',
    bodyText: 'A matriz curricular dos Cursos Técnicos da EFABE integra os componentes do Ensino Médio da BNCC à formação técnica profissional da Pedagogia da Alternância.',
    blocks: [
      {
        id: 'blk-matriz-1',
        type: 'features',
        title: '1º Ano — Núcleo Básico & Introdução Agropecuária (Carga Horária: 1.200h)',
        content: 'Disciplinas & Módulos: Língua Portuguesa, Matemática, Biologia, Química, Física, História, Geografia, Solos & Nutrição de Plantas, Desenho Técnico Agrícola, Botânica.'
      },
      {
        id: 'blk-matriz-2',
        type: 'features',
        title: '2º Ano — Núcleo Intermediário & Práticas do Campo (Carga Horária: 1.200h)',
        content: 'Disciplinas & Módulos: Literatura, Matemática Aplicada, Ecologia, Zootecnia I (Bovinocultura & Aves), Cafeicultura Sustentável, Mecanização Agrícola, Agroecologia I.'
      },
      {
        id: 'blk-matriz-3',
        type: 'features',
        title: '3º Ano — Núcleo Avançado & Projeto Profissional (Carga Horária: 1.200h)',
        content: 'Disciplinas & Módulos: Redação & Comunicação, Sociologia Rural, Gestão de Propriedade Rural, Processamento Agroindustrial, Legislação Ambiental, Trabalho de Conclusão de Curso (TCC).'
      }
    ],
    updatedAt: '2026-09-18'
  },

  {
    id: 'pg-instancia-organica',
    slug: 'instancia-organica',
    title: 'Nossa Instância Orgânica e Institucional',
    subtitle: 'A articulação comunitária e representativa das EFAs',
    heroText: 'Trabalho em rede fortalecendo a educação do campo e as entidades associativas.',
    heroImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1200',
    bodyText: 'A EFABE atua de forma integrada às redes regionais e estaduais de educação do campo, garantindo gestão democrática e participativa.',
    updatedAt: '2026-09-18'
  },
  {
    id: 'pg-mepes',
    slug: 'mepes',
    title: 'MEPES - Movimento de Educação Promocional do Espírito Santo',
    subtitle: 'Pioneiro na implantação da Pedagogia da Alternância no Brasil',
    heroText: 'Mais de 50 anos promovendo a educação do campo e a cidadania rural.',
    heroImage: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=1200',
    bodyText: 'O MEPES é a instituição mantenedora e idealizadora do sistema de EFAs no Espírito Santo, unindo famílias, comunidades e poder público.',
    updatedAt: '2026-09-18'
  },
  {
    id: 'pg-raceffaes',
    slug: 'raceffaes',
    title: 'RACEFFAES - Regional das Associações dos Centros Familiares de Formação em Alternância',
    subtitle: 'Articulação das EFAs do Espírito Santo',
    heroText: 'Representação institucional e intercâmbio de experiências pedagógicas.',
    heroImage: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb1475a?auto=format&fit=crop&q=80&w=1200',
    bodyText: 'A RACEFFAES coordena as ações conjuntas entre as Escolas Famílias Agrícolas associadas do Espírito Santo.',
    updatedAt: '2026-09-18'
  },
  {
    id: 'pg-parcerias-projetos',
    slug: 'parcerias-projetos',
    title: 'Parcerias e Projetos Institucionais',
    subtitle: 'Iniciativas com entidades públicas, privadas e ONGs',
    heroText: 'Projetos de extensão rural, conservação ambiental e inovação agroecológica.',
    heroImage: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&q=80&w=1200',
    bodyText: 'Conheça nossos parceiros estratégicos que contribuem para o aprimoramento contínuo das instalações, equipamentos e projetos sociais da EFABE.',
    updatedAt: '2026-09-18'
  },

  {
    id: 'pg-parceiros-formacao',
    slug: 'parceiros-formacao',
    title: 'Parceiros de Formação e Organização Comunitária',
    subtitle: 'Organizações parceiras que garantem o funcionamento participativo da EFABE',
    heroText: 'União da comunidade, dos pais e dos educadores na gestão da escola.',
    heroImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1200',
    bodyText: 'A gestão das EFAs é participativa e comunitária, realizada com apoio direto de associações de pais, ex-alunos e conselhos comunitários.',
    updatedAt: '2026-09-18'
  },
  {
    id: 'pg-auto-organizacao',
    slug: 'auto-organizacao',
    title: 'Auto-organização do Trabalho Pedagógico',
    subtitle: 'Protagonismo dos estudantes nas tarefas diárias do internato e do campo',
    heroText: 'Divisão de responsabilidades no cotidiano escolar fortalecendo a liderança e a convivência.',
    heroImage: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb1475a?auto=format&fit=crop&q=80&w=1200',
    bodyText: 'Os alunos organizam comissões de refeitório, horta, alojamento, recreação e rituais de acolhida, vivenciando a gestão participativa.',
    updatedAt: '2026-09-18'
  },
  {
    id: 'pg-apeffabe',
    slug: 'apeffabe',
    title: 'APEFFABE - Associação dos Pais e Funcionários da EFABE',
    subtitle: 'Entidade comunitária mantenedora da EFABE',
    heroText: 'Pais e monitores gerindo democraticamente o destino e as melhorias da escola.',
    heroImage: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=1200',
    bodyText: 'A APEFFABE garante a representatividade das famílias rurais e assegura o alinhamento das decisões escolares com os anseios da comunidade.',
    updatedAt: '2026-09-18'
  },
  {
    id: 'pg-aeceffabe',
    slug: 'aeceffabe',
    title: 'AECEFFABE - Associação dos Ex-alunos do Centro Familiar de Formação em Alternância',
    subtitle: 'Mantenha-se conectado à comunidade de egressos da EFABE',
    heroText: 'Ex-alunos multiplicando as práticas agroecológicas e apoiando as novas gerações.',
    heroImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1200',
    bodyText: 'A rede de ex-alunos promove encontros, palestras, mentorias para jovens alternantes e apoio técnico a projetos comunitários.',
    updatedAt: '2026-09-18'
  },

  {
    id: 'pg-formandos',
    slug: 'formandos',
    title: 'Galeria e Registro dos Formandos EFABE',
    subtitle: 'Nossas turmas e a trajetória dos egressos no campo e nas universidades',
    heroText: 'Celebrando a conquista da diplomação técnica e a formação cidadã.',
    heroImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1200',
    bodyText: 'Confira as fotos oficiais e memórias das turmas formandas da EFABE, com seus respectivos Projetos Profissionais de Jovens (PPJs).',
    updatedAt: '2026-09-18'
  },

  {
    id: 'pg-acervo',
    slug: 'acervo',
    title: 'Acervo Institucional e Pedagógico',
    subtitle: 'Documentos, regulamentos, matrizes curriculares e memórias fotográficas',
    heroText: 'Acesso público à documentação oficial e registros históricos da EFABE.',
    heroImage: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=1200',
    bodyText: 'Nesta seção você encontra regimentos, calendários letivos, pesquisas de alternância e arquivos para download.',
    updatedAt: '2026-09-18'
  },
  {
    id: 'pg-acervo-documentos',
    slug: 'acervo-documentos',
    title: 'Documentos e Matrizes Curriculares',
    subtitle: 'Regimento Escolar, Projeto Político Pedagógico (PPP) e Matrizes de Ensino',
    heroText: 'Transparência e acesso público aos documentos institucionais.',
    heroImage: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=1200',
    bodyText: 'Faça download do Regimento Interno do Internato, Fichas de Avaliação e Regulamentos Gerais da EFABE.',
    updatedAt: '2026-09-18'
  },
  {
    id: 'pg-acervo-galeria',
    slug: 'acervo-galeria',
    title: 'Galeria de Fotos, Experimentos e Projetos',
    subtitle: 'Registros fotográficos do cotidiano na EFABE e nas propriedades familiares',
    heroText: 'A beleza da Pedagogia da Alternância capturada em imagens.',
    heroImage: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=1200',
    bodyText: 'Acompanhe as imagens das atividades práticas nos setores didáticos de horticultura, bovinocultura, cafeicultura e eventos comunitários.',
    updatedAt: '2026-09-18'
  },

  {
    id: 'pg-contact',
    slug: 'contact',
    title: 'Fale Conosco & Processo Seletivo / Matrículas',
    subtitle: 'Estamos de portas abertas para receber você e sua família',
    heroText: 'Agende uma visita guiada às nossas instalações e conheça nossa equipe pedagógica.',
    heroImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1200',
    bodyText: 'Entre em contato com nossa secretaria escolar ou preencha a ficha de pré-inscrição para as turmas de 2027.',
    updatedAt: '2026-09-18'
  }
];

export const INITIAL_NOTICES: Notice[] = [
  {
    id: 'not-1',
    title: 'Reunião Geral de Pais e Mestres - Início do 3º Trimestre',
    content: 'Convidamos todas as famílias das turmas do 1º ao 3º ano para a Reunião Trimestral de Acompanhamento da Pedagogia da Alternância. Acontecerá no auditório central às 14h com acolhida e café comunitário.',
    category: 'Reuniões' as any,
    date: '2026-09-22',
    author: 'Coordenação Pedagógica',
    targetRole: 'all',
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800',
    pinned: true,
  },
  {
    id: 'not-2',
    title: 'Dia do Campo Agroecológico: Apresentação dos Projetos de Vida (PE)',
    content: 'Os estudantes do 3º Ano apresentarão os resultados dos seus Planos de Estudo focados em sistemas agroflorestais e cafeicultura sustentável. Visitantes das comunidades parceiras são muito bem-vindos!',
    category: 'Eventos',
    date: '2026-09-28',
    author: 'Prof. Carlos Andrade',
    targetRole: 'public',
    imageUrl: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&q=80&w=800',
    pinned: false,
  },
  {
    id: 'not-3',
    title: 'Início da Sessão Família para a Turma B (2º Ano)',
    content: 'Lembramos aos pais que os alunos do 2º Ano iniciam nesta sexta-feira a Sessão Família. A Caderneta de Campo deve ser entregue preenchida no retorno para a escola no dia 05/10.',
    category: 'Calendário',
    date: '2026-09-19',
    author: 'Secretaria Escolar MEPES',
    targetRole: 'parents',
    pinned: false,
  },
  {
    id: 'not-4',
    title: 'Capacitação Docente: Uso do Sistema de Avaliação por Competências',
    content: 'Encontro com os professores para alinhamento das fichas de avaliação contínua e registros de ocorrência no portal do professor.',
    category: 'Pedagógico',
    date: '2026-09-15',
    author: 'Direção Geral',
    targetRole: 'teachers',
    pinned: false,
  }
];

export const INITIAL_ROUTINE_PHOTOS: RoutinePhoto[] = [
  {
    id: 'ph-1',
    title: 'Manejo de Solo e Produção de Compostagem Orgânica',
    description: 'Estudantes do 2º Ano Técnico realizando análise física do solo e preparação de canteiros para hortaliças agroecológicas no setor didático.',
    imageUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=800',
    date: '2026-09-17',
    turma: '2º Ano - Téc. Agropecuária',
    category: 'Aulas Práticas',
    author: 'Prof. Carlos Andrade',
    likes: 24,
  },
  {
    id: 'ph-2',
    title: 'Coleta de Sementes Nativas em Área de Reflorestamento',
    description: 'Atividade prática de ecologia e silvicultura com identificação de espécies da Mata Atlântica para o viveiro escolar.',
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800',
    date: '2026-09-16',
    turma: '3º Ano - Meio Ambiente',
    category: 'Agroecologia',
    author: 'Profa. Helena Schunk',
    likes: 19,
  },
  {
    id: 'ph-3',
    title: 'Noite Cultural e Sarau da Vida Comunitária',
    description: 'Momento de integração no internato escolar com apresentação de moinho de ideias, música caipira e leitura de poemas das regiões capixabas.',
    imageUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=800',
    date: '2026-09-14',
    turma: 'Todas as Turmas',
    category: 'Vivência Comunitária',
    author: 'Coordenação Social',
    likes: 42,
  },
  {
    id: 'ph-4',
    title: 'Laboratório de Qualidade do Leite e Derivados',
    description: 'Aula no setor de agroindústria testando acidez e teor de gordura do leite produzido no setor de bovinocultura.',
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800',
    date: '2026-09-12',
    turma: '1º Ano - Agropecuária',
    category: 'Laboratório',
    author: 'Prof. Carlos Andrade',
    likes: 31,
  }
];

export const INITIAL_STUDENT_GRADES: StudentGrade[] = [
  { studentId: 'st-01', studentName: 'Lucas Silva Santos', subject: 'Agropecuária', trimestre1: 8.8, trimestre2: 9.2, trimestre3: 9.0, faltas: 2, status: 'Aprovado' },
  { studentId: 'st-01', studentName: 'Lucas Silva Santos', subject: 'Biologia Vegetal & Botânica', trimestre1: 8.0, trimestre2: 8.5, trimestre3: 8.7, faltas: 1, status: 'Aprovado' },
  { studentId: 'st-01', studentName: 'Lucas Silva Santos', subject: 'Projetos Profissionais (PE)', trimestre1: 9.5, trimestre2: 9.8, trimestre3: 9.6, faltas: 0, status: 'Aprovado' },
  { studentId: 'st-01', studentName: 'Lucas Silva Santos', subject: 'Matemática Aplicada & Topografia', trimestre1: 7.2, trimestre2: 7.8, trimestre3: 8.0, faltas: 3, status: 'Aprovado' },
  { studentId: 'st-01', studentName: 'Lucas Silva Santos', subject: 'Língua Portuguesa e Comunicação', trimestre1: 8.5, trimestre2: 8.2, trimestre3: 8.8, faltas: 1, status: 'Aprovado' },
  { studentId: 'st-01', studentName: 'Lucas Silva Santos', subject: 'Solos & Nutrição de Plantas', trimestre1: 9.0, trimestre2: 8.8, trimestre3: 9.2, faltas: 0, status: 'Aprovado' },
  
  // Outro aluno
  { studentId: 'st-02', studentName: 'Beatriz Costa Ramos', subject: 'Agropecuária', trimestre1: 7.5, trimestre2: 8.0, trimestre3: 8.2, faltas: 4, status: 'Em Andamento' },
  { studentId: 'st-02', studentName: 'Beatriz Costa Ramos', subject: 'Biologia Vegetal & Botânica', trimestre1: 6.8, trimestre2: 7.2, trimestre3: 7.5, faltas: 2, status: 'Em Andamento' },
];

export const INITIAL_OCCURRENCES: Occurrence[] = [
  {
    id: 'occ-1',
    studentId: 'st-01',
    studentName: 'Lucas Silva Santos',
    date: '2026-09-15',
    teacherName: 'Prof. Carlos Andrade',
    title: 'Excelente desempenho na Prática Agroecológica',
    description: 'Lucas demonstrou liderança exemplar durante o manejo de compostagem orgânica e auxiliou ativamente os colegas da turma.',
    type: 'Elogio',
    readByParent: true,
  },
  {
    id: 'occ-2',
    studentId: 'st-01',
    studentName: 'Lucas Silva Santos',
    date: '2026-09-10',
    teacherName: 'Profa. Helena Schunk',
    title: 'Lembrete de Entrega da Caderneta de Campo (Sessão Família)',
    description: 'Solicitamos atenção no preenchimento do módulo 3 do Plano de Estudo sobre conservação de nascentes antes do retorno à escola.',
    type: 'Pedagógico',
    readByParent: true,
  }
];

export const INITIAL_ALTERNANCIA_SCHEDULE: AlternanciaSchedule[] = [
  {
    id: 'alt-1',
    turma: '2º Ano - Téc. Agropecuária',
    period: 'Setembro / Etapa 7',
    mode: 'Escola',
    startDate: '2026-09-14',
    endDate: '2026-09-18',
    activities: 'Permanência no internato MEPES: Aulas teóricas, laboratórios de solos, setor didático de cafeicultura e preparação do Plano de Estudo.'
  },
  {
    id: 'alt-2',
    turma: '2º Ano - Téc. Agropecuária',
    period: 'Setembro / Etapa 8',
    mode: 'Família',
    startDate: '2026-09-21',
    endDate: '2026-09-25',
    activities: 'Permanência na propriedade familiar: Aplicação da pesquisa de campo, entrevistas com produtores vizinhos e relatório de observação.'
  },
  {
    id: 'alt-3',
    turma: '2º Ano - Téc. Agropecuária',
    period: 'Outubro / Etapa 9',
    mode: 'Escola',
    startDate: '2026-09-28',
    endDate: '2026-10-02',
    activities: 'Retorno ao MEPES: Debates em grupo, socialização dos dados coletados em casa e avaliação trimestral.'
  }
];

export const INITIAL_MESSAGES: Message[] = [
  {
    id: 'msg-1',
    senderName: 'Mariana Silva (Mãe do Lucas)',
    senderRole: 'parent',
    receiverRole: 'teacher',
    subject: 'Dúvida sobre o relatório do Plano de Estudo',
    content: 'Olá Professor Carlos, bom dia! Gostaria de confirmar se no relatório da Sessão Família precisamos anexar fotos da área de irrigação da nossa propriedade. Obrigado!',
    date: '2026-09-17 09:30',
    read: true,
  },
  {
    id: 'msg-2',
    senderName: 'Prof. Carlos Andrade',
    senderRole: 'teacher',
    receiverRole: 'parent',
    subject: 'Re: Dúvida sobre o relatório do Plano de Estudo',
    content: 'Olá Mariana! Sim, fotos da área enriquecem muito o trabalho do Lucas. Podem colar no caderno ou enviar anexado. Parabéns pelo empenho de vocês!',
    date: '2026-09-17 11:15',
    read: false,
  }
];

export const INITIAL_SITE_SETTINGS: SiteHeaderFooterSettings = {
  // Cabeçalho
  schoolAcronym: 'EFABE',
  schoolBadge: 'EFA',
  schoolName: 'Escola Família Agrícola de Boa Esperança',
  headerSlogan: 'Um sonho realizado há 40 anos!',
  topBannerAnnouncement: 'EFABE - Escola Família Agrícola de Boa Esperança',
  headerQuote: '🌻 "cuidando das pessoas e do mundo"',
  logoUrl: '/logomarca.jpeg',

  // Rodapé
  footerAboutText: 'Escola Família Agrícola de Boa Esperança. Referência na formação de jovens do campo com a consolidação e vivência prática da Pedagogia da Alternância.',
  footerSlogan: '🌻 "cuidando das pessoas e do mundo"',
  footerAddress: 'Anchieta & Unidades Regionais, Espírito Santo - ES',
  footerPhone: '(28) 3536-1200 / (27) 99881-2200',
  footerEmail: 'contato@mepes.org.br',
  footerWebsite: 'www.mepes.org.br',
  footerCopyright: 'EFABE - Escola Família Agrícola de Boa Esperança. Todos os direitos reservados.',
  footerUnitsText: 'A EFABE conta com a parceria da entidade mantenedora MEPES e integra a rede de Escolas Família Agrícola no Espírito Santo.',
  footerCoursesList: [
    'Técnico em Agropecuária',
    'Técnico em Meio Ambiente e Recuperação',
    'Técnico em Agroindústria e Processamento',
    'Metodologia: Sessão Escola & Sessão Família',
    'Plano de Estudo e Pesquisa Agroecológica'
  ],

  // Títulos Personalizados das Seções do Painel Gerencial
  adminSectionTitles: {
    header: '1. CONFIGURAÇÕES DO CABEÇALHO (HEADER)',
    footer: '2. CONFIGURAÇÕES DO RODAPÉ (FOOTER)',
    menu: '3. GERENCIADOR DO MENU & ESTRUTURA',
    homeBlocks: '4. EDITAR BLOCOS DA PÁGINA PRINCIPAL (HOME)',
    pages: '5. EDITAR PÁGINAS DE CONTEÚDO (CMS)',
    notices: '6. POSTAR COMUNICADOS ESCOLARES',
    photos: '7. POSTAR FOTOS DA ROTINA ESCOLAR',
    users: '8. USUÁRIOS & PERFIS DE ACESSO',
  },

  // Blocos Editáveis da Página Principal (Home)
  homePillarsBadge: 'PILARES DO MEPES',
  homePillarsTitle: 'Educação do Campo que Transforma Vidas e Propriedades',
  homePillarsSubtitle: 'Mais do que uma escola, um movimento focado na formação humana integral e no desenvolvimento sustentável do meio rural capixaba.',
  homePillarsList: [
    { title: 'Pedagogia da Alternância', desc: '1 semana de permanência em regime de internato e 1 semana em família aplicando o Plano de Estudo na propriedade.', icon: 'Repeat' },
    { title: 'Ensino Técnico Integrado', desc: 'Formação em Agropecuária, Meio Ambiente e Agroindústria com diploma reconhecido e foco na sustentabilidade.', icon: 'GraduationCap' },
    { title: 'Desenvolvimento Local', desc: 'Incentivo ao empreendedorismo jovem rural, sucessão familiar sustentável e agroecologia regional.', icon: 'Sprout' },
    { title: 'Formação Humana e Cidadã', desc: 'Valores comunitários, liderança, cooperação e respeito ao meio ambiente.', icon: 'Users' }
  ],

  homeCoursesBadge: 'FORMAÇÃO PROFISSIONAL',
  homeCoursesTitle: 'Nossos Cursos Técnicos Integrados',
  homeCoursesList: [
    { title: 'Técnico em Agropecuária', desc: 'Aprenda solos, zootecnia, cafeicultura agroecológica, fruticultura, mecânica agrícola e gestão da propriedade rural sustentável.', tag: 'Diploma Técnico de Nível Médio', icon: 'Tractor' },
    { title: 'Técnico em Meio Ambiente', desc: 'Foco na recuperação de nascentes, gestão bacia hidrográfica, licenciamento ambiental, reflorestamento e conservação de biodiversidade.', tag: 'Foco em Sustentabilidade Rural', icon: 'Leaf' },
    { title: 'Técnico em Agroindústria', desc: 'Processamento sustentável de leite, queijos, conservas, panificação artesanal e microbiologia aplicada a alimentos com higiene sanitária.', tag: 'Valorização do Produto do Campo', icon: 'Utensils' }
  ],

  homeNoticesTitle: 'Últimos Comunicados',
  homePhotosTitle: 'Fotos da Rotina Escolar',

  // Ordem das Seções da Home
  homeSectionOrder: ['pillars', 'courses', 'notices', 'photos', 'contact'],

  // Bloco Fale Conosco (Contato / Pré-Matrícula)
  homeContactBadge: 'FALE CONOSCO',
  homeContactTitle: 'Processo Seletivo & Pré-Matrícula EFABE',
  homeContactDesc: 'Quer saber mais sobre como ingressar em nossas turmas da Pedagogia da Alternância? Preencha o formulário e nossa equipe pedagógica entrará em contato.',
  homeContactPhone: 'Atendimento: (28) 3536-1200 / (27) 99881-2200',
  homeContactEmail: 'secretaria@mepes.org.br',
  homeContactAddress: 'Anchieta e Unidades EFAs no ES',
  homeContactFormTitle: 'Ficha de Contato & Pré-Inscrição',
  homeContactButtonText: 'Enviar Pré-Inscrição',

  // Matriz Curricular
  homeMatrixCurriculumText: 'Ver matriz curricular completa',
  homeMatrixCurriculumModalContent: 'A Matriz Curricular da EFABE é estruturada em 3 séries anuais integrando o Ensino Médio Regular com a Formação Técnica Profissional em Agropecuária, Meio Ambiente e Agroindústria através da Pedagogia da Alternância (Sessão Escola e Sessão Família).',
  homeMatrixCurriculumSubjects: [
    { year: '1º Ano', title: 'Núcleo Geral & Base Agroecológica', subjects: 'Língua Portuguesa, Matemática, Biologia, Química, Física, História, Geografia, Introdução à Agropecuária, Solos e Nutrição de Plantas, Desenho Técnico e Topografia.', ch: '1.200h' },
    { year: '2º Ano', title: 'Produção Vegetal & Manejo Sustentável', subjects: 'Língua Portuguesa, Matemática, Fitotecnia (Café, Fruticultura, Hortaliças), Zootecnia I (Bovinocultura e Avicultura), Mecanização Agrícola e Construções Rurais.', ch: '1.200h' },
    { year: '3º Ano', title: 'Gestão Rural, Agrobusiness & Estágio Supervisado', subjects: 'Gestão de Propriedades Rurais, Cooperativismo, Agroindústria e Processamento, Legislação Ambiental, Projeto Profissional de Jovens (PPJ) e Estágio Curricular.', ch: '1.200h + 300h Estágio' }
  ]
};

export const INITIAL_DRIVE_CONFIG: GoogleDriveFolderConfig = {
  docFolderUrl: 'https://drive.google.com/drive/folders/1EFABE_DOCUMENTOS_OFICIAIS',
  docFolderId: '1EFABE_DOCUMENTOS_OFICIAIS',
  photoFolderUrl: 'https://drive.google.com/drive/folders/1EFABE_ACERVO_FOTOGRAFICO',
  photoFolderId: '1EFABE_ACERVO_FOTOGRAFICO',
  folders: [
    {
      id: 'f-1',
      name: 'Pasta 1: Documentos Oficials & Regimentos',
      url: 'https://drive.google.com/drive/folders/1EFABE_DOCUMENTOS_OFICIAIS',
      folderId: '1EFABE_DOCUMENTOS_OFICIAIS',
      category: 'documentos',
      description: 'Regimentos escolares, normas internas e comunicados da diretoria.'
    },
    {
      id: 'f-2',
      name: 'Pasta 2: Matrizes Curriculares & Planos de Estudo',
      url: 'https://drive.google.com/drive/folders/1EFABE_MATRIZES_E_PLANOS',
      folderId: '1EFABE_MATRIZES_E_PLANOS',
      category: 'documentos',
      description: 'Grades horárias, matrizes e planos pedagógicos por ano letivo.'
    },
    {
      id: 'f-3',
      name: 'Pasta 3: Galeria Principal de Fotos EFABE',
      url: 'https://drive.google.com/drive/folders/1EFABE_ACERVO_FOTOGRAFICO',
      folderId: '1EFABE_ACERVO_FOTOGRAFICO',
      category: 'fotos',
      description: 'Fotos institucionais, eventos festivos e comemorações da escola.'
    },
    {
      id: 'f-4',
      name: 'Pasta 4: Aulas Práticas, Horta & Agroecologia',
      url: 'https://drive.google.com/drive/folders/1EFABE_AULAS_PRATICAS_FOTOS',
      folderId: '1EFABE_AULAS_PRATICAS_FOTOS',
      category: 'fotos',
      description: 'Registros fotográficos do trabalho de campo, cultivo e zootecnia.'
    },
    {
      id: 'f-5',
      name: 'Pasta 5: Projetos Pedagógicos & PPJ',
      url: 'https://drive.google.com/drive/folders/1EFABE_PROJETOS_E_PPJ',
      folderId: '1EFABE_PROJETOS_E_PPJ',
      category: 'geral',
      description: 'Relatórios dos Projetos Profissionais dos Jovens e pesquisas.'
    }
  ]
};

export const INITIAL_ACERVO_DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc-01',
    title: 'Regimento Interno Institucional e Escolar EFABE 2026',
    description: 'Documento normativo completo detalhando o funcionamento do internato, regras de convivência, direitos e deveres dos alunos, monitores e docentes.',
    category: 'Regimentos e Normas',
    fileUrl: 'https://drive.google.com/file/d/1_Regimento_EFABE_2026/view?usp=sharing',
    driveFileId: '1_Regimento_EFABE_2026',
    fileType: 'pdf',
    fileSize: '2.8 MB',
    date: '2026-02-10'
  },
  {
    id: 'doc-02',
    title: 'Matriz Curricular Integrada — Técnico em Agropecuária',
    description: 'Grade de disciplinas da Base Nacional Comum Curricular (BNCC) e Componentes Técnicos de Agroecologia, Solos, Zootecnia e Fitotecnia.',
    category: 'Matrizes Curriculares',
    fileUrl: 'https://drive.google.com/file/d/2_Matriz_Agropecuaria/view?usp=sharing',
    driveFileId: '2_Matriz_Agropecuaria',
    fileType: 'pdf',
    fileSize: '1.4 MB',
    date: '2026-01-15'
  },
  {
    id: 'doc-03',
    title: 'Caderno Guia do Plano de Estudo (PE) na Alternância',
    description: 'Roteiro de pesquisa para os estudantes utilizarem na Sessão Família durante a realização dos trabalhos práticos nas propriedades rurais.',
    category: 'Planos de Estudo',
    fileUrl: 'https://drive.google.com/file/d/3_Plano_Estudo_Guia/view?usp=sharing',
    driveFileId: '3_Plano_Estudo_Guia',
    fileType: 'doc',
    fileSize: '950 KB',
    date: '2026-03-01'
  },
  {
    id: 'doc-04',
    title: 'Ficha de Cadastro e Matrícula de Estudante para Alternância',
    description: 'Formulário oficial para preenchimento de dados da família, localização da propriedade agrícola e autorizações de saúde no internato.',
    category: 'Formulários e Fichas',
    fileUrl: 'https://drive.google.com/file/d/4_Ficha_Matricula/view?usp=sharing',
    driveFileId: '4_Ficha_Matricula',
    fileType: 'pdf',
    fileSize: '420 KB',
    date: '2026-01-20'
  },
  {
    id: 'doc-05',
    title: 'Relatório Anual de Sustentabilidade Agroecológica e Impacto Regional',
    description: 'Apresentação dos resultados dos Projetos Profissionais dos Jovens (PPJ), produtividade das áreas experimentais e transição agroecológica.',
    category: 'Relatórios e Projetos',
    fileUrl: 'https://drive.google.com/file/d/5_Relatorio_Sustentabilidade/view?usp=sharing',
    driveFileId: '5_Relatorio_Sustentabilidade',
    fileType: 'pdf',
    fileSize: '4.5 MB',
    date: '2025-12-18'
  }
];

export const INITIAL_PHOTO_CATEGORIES: PhotoCatalogCategories = {
  years: ['2026', '2025', '2024', '2023', '2022', '2021 e Anteriores'],
  eventTypes: [
    'Dia no Campo',
    'Aulas Práticas',
    'Alternância (Sessão Escola)',
    'Alternância (Sessão Família)',
    'Formatura & Solenidades',
    'Feira Agroecológica',
    'Visita Técnica Pedagógica',
    'Projetos Profissionais (PPJ)'
  ],
  locations: [
    'Setor Agropecuário / Horta',
    'Auditório Central',
    'Propriedade Familiar Rural',
    'Laboratório de Solos e Botânica',
    'Unidade de Processamento Agroindustrial',
    'Quadra Poliesportiva / Convivência'
  ]
};

export const INITIAL_ACERVO_PHOTOS: PhotoItem[] = [
  {
    id: 'ph-01',
    title: 'Manejo Agroecológico de Solos e Compostagem Organic',
    description: 'Alunos do 2º Ano aplicando técnicas de compostagem aeróbica e enriquecimento orgânico do solo na área experimental da EFABE.',
    imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb1475a?auto=format&fit=crop&q=80&w=800',
    date: '2026-03-12',
    year: '2026',
    eventType: 'Aulas Práticas',
    location: 'Setor Agropecuário / Horta',
    turma: '2º Ano - Agropecuária',
    author: 'Prof. Carlos Eduardo',
    likes: 18
  },
  {
    id: 'ph-02',
    title: 'Solenidade de Formatura da Turma de Agropecuária',
    description: 'Cerimônia de entrega dos diplomas aos formandos com presença dos pais, lideranças do MEPES e comunidade agrícola.',
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800',
    date: '2025-12-15',
    year: '2025',
    eventType: 'Formatura & Solenidades',
    location: 'Auditório Central',
    turma: '3º Ano - Formandos',
    author: 'Equipe Pedagógica',
    likes: 34
  },
  {
    id: 'ph-03',
    title: 'Visita Técnica a Lavouras de Café Conilon Sustentável',
    description: 'Estudantes observando podas de renovação e irrigação localizada por gotejamento na propriedade da família Silva.',
    imageUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=800',
    date: '2026-02-20',
    year: '2026',
    eventType: 'Visita Técnica Pedagógica',
    location: 'Propriedade Familiar Rural',
    turma: '1º Ano - Agropecuária',
    author: 'Prof. Roberto Santos',
    likes: 22
  },
  {
    id: 'ph-04',
    title: 'Análise de pH e Textura de Solo no Laboratório',
    description: 'Sessão de laboratório durante a semana de internato para determinação da acidez do solo e recomendações de calagem.',
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800',
    date: '2025-10-08',
    year: '2025',
    eventType: 'Aulas Práticas',
    location: 'Laboratório de Solos e Botânica',
    turma: '2º Ano - Agropecuária',
    author: 'Profa. Helena Schunk',
    likes: 15
  },
  {
    id: 'ph-05',
    title: 'I Feira Agroecológica da Pedagogia da Alternância',
    description: 'Exposição de hortaliças orgânicas, derivados do leite e doces artesanais produzidos pelas famílias rurais dos estudantes.',
    imageUrl: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&q=80&w=800',
    date: '2024-11-20',
    year: '2024',
    eventType: 'Feira Agroecológica',
    location: 'Quadra Poliesportiva / Convivência',
    turma: 'Todas as Turmas',
    author: 'Coordenação MEPES',
    likes: 41
  }
];

