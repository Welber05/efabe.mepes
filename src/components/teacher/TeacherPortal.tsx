import React, { useState } from 'react';
import { User, StudentGrade, Occurrence, RoutinePhoto, Notice } from '../../types';
import { 
  BookOpen, 
  Award, 
  CheckCircle2, 
  Plus, 
  Calendar, 
  UserCheck, 
  FileText, 
  AlertTriangle, 
  Save, 
  Camera,
  MessageSquare,
  Bell
} from 'lucide-react';

interface TeacherPortalProps {
  teacherUser: User;
  grades: StudentGrade[];
  onUpdateGrades: (updatedGrades: StudentGrade[]) => void;
  occurrences: Occurrence[];
  onAddOccurrence: (occ: Occurrence) => void;
  onAddRoutinePhoto: (photo: RoutinePhoto) => void;
  onAddNotice?: (notice: Notice) => void;
}

export const TeacherPortal: React.FC<TeacherPortalProps> = ({
  teacherUser,
  grades,
  onUpdateGrades,
  occurrences,
  onAddOccurrence,
  onAddRoutinePhoto,
  onAddNotice,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'grades' | 'occurrences' | 'photo' | 'notice'>('grades');
  const [selectedTurma, setSelectedTurma] = useState('2º Ano - Téc. Agropecuária');

  // Grades local state for editing
  const [localGrades, setLocalGrades] = useState<StudentGrade[]>(grades);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Notice / Comunicado Form
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeContent, setNoticeContent] = useState('');
  const [noticeCategory, setNoticeCategory] = useState<'Geral' | 'Calendário' | 'Eventos' | 'Pedagógico' | 'Urgente'>('Pedagógico');

  const handlePostNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle || !noticeContent) return;

    if (onAddNotice) {
      const newNotice: Notice = {
        id: `not-${Date.now()}`,
        title: noticeTitle,
        content: noticeContent,
        category: noticeCategory,
        author: teacherUser.name,
        date: new Date().toISOString().split('T')[0],
        targetRole: 'public',
        pinned: false,
      };
      onAddNotice(newNotice);
      setNoticeTitle('');
      setNoticeContent('');
      setSaveSuccessMsg('Notícia / Comunicado publicado no mural escolar!');
      setTimeout(() => setSaveSuccessMsg(''), 4000);
    }
  };

  const handleGradeChange = (studentId: string, subject: string, field: 'trimestre1' | 'trimestre2' | 'trimestre3' | 'faltas', value: number) => {
    setLocalGrades((prev) =>
      prev.map((g) => {
        if (g.studentId === studentId && g.subject === subject) {
          const updated = { ...g, [field]: value };
          // Calculate average
          const avg = (updated.trimestre1 + updated.trimestre2 + updated.trimestre3) / 3;
          updated.status = avg >= 7.0 ? 'Aprovado' : avg >= 5.0 ? 'Em Andamento' : 'Recuperação';
          return updated;
        }
        return g;
      })
    );
  };

  const handleSaveAllGrades = () => {
    onUpdateGrades(localGrades);
    setSaveSuccessMsg('Boletim da turma atualizado e notas salvas com sucesso!');
    setTimeout(() => setSaveSuccessMsg(''), 4000);
  };

  // Occurrence form
  const [occStudentName, setOccStudentName] = useState('Lucas Silva Santos');
  const [occTitle, setOccTitle] = useState('');
  const [occDesc, setOccDesc] = useState('');
  const [occType, setOccType] = useState<'Elogio' | 'Observação' | 'Aviso' | 'Pedagógico'>('Pedagógico');

  const handleCreateOccurrence = (e: React.FormEvent) => {
    e.preventDefault();
    if (!occTitle || !occDesc) return;

    const newOcc: Occurrence = {
      id: `occ-${Date.now()}`,
      studentId: 'st-01',
      studentName: occStudentName,
      date: new Date().toISOString().split('T')[0],
      teacherName: teacherUser.name,
      title: occTitle,
      description: occDesc,
      type: occType,
      readByParent: false,
    };

    onAddOccurrence(newOcc);
    setOccTitle('');
    setOccDesc('');
    setSaveSuccessMsg('Ocorrência enviada para o portal dos pais!');
    setTimeout(() => setSaveSuccessMsg(''), 4000);
  };

  // Routine Photo Form
  const [photoTitle, setPhotoTitle] = useState('');
  const [photoDesc, setPhotoDesc] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');

  const handlePostPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoTitle || !photoUrl) return;

    const newP: RoutinePhoto = {
      id: `ph-${Date.now()}`,
      title: photoTitle,
      description: photoDesc,
      imageUrl: photoUrl,
      date: new Date().toISOString().split('T')[0],
      turma: selectedTurma,
      category: 'Aulas Práticas',
      author: teacherUser.name,
      likes: 0,
    };

    onAddRoutinePhoto(newP);
    setPhotoTitle('');
    setPhotoDesc('');
    setPhotoUrl('');
    setSaveSuccessMsg('Foto publicada na galeria da rotina escolar!');
    setTimeout(() => setSaveSuccessMsg(''), 4000);
  };

  return (
    <div className="py-8 bg-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-emerald-950 text-white p-6 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img src={teacherUser.avatar} alt={teacherUser.name} className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-400" />
            <div>
              <span className="bg-blue-800 text-blue-200 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">
                Portal Docente
              </span>
              <h1 className="text-2xl font-black">{teacherUser.name}</h1>
              <p className="text-xs text-blue-200">
                Disciplinas: {teacherUser.subjects?.join(' • ')}
              </p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 text-xs">
            <span className="text-blue-200 block">Turma Principal Responsável:</span>
            <strong className="text-amber-300 font-extrabold text-sm">{selectedTurma}</strong>
          </div>
        </div>

        {/* Action feedback msg */}
        {saveSuccessMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center gap-2">
            <CheckCircle2 size={18} className="text-emerald-600" />
            <span>{saveSuccessMsg}</span>
          </div>
        )}

        {/* Subtab navigation */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveSubTab('grades')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'grades'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <Award size={16} /> Diário de Classe (Notas & Frequência)
          </button>

          <button
            onClick={() => setActiveSubTab('notice')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'notice'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <Bell size={16} /> Postar Notícia / Comunicado
          </button>

          <button
            onClick={() => setActiveSubTab('photo')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'photo'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <Camera size={16} /> Postar Fotos de Atividades
          </button>

          <button
            onClick={() => setActiveSubTab('occurrences')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'occurrences'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <MessageSquare size={16} /> Ocorrências & Recados aos Pais
          </button>
        </div>

        {/* TAB 1: DIÁRIO DE CLASSE / NOTAS */}
        {activeSubTab === 'grades' && (
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200 space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Lançamento de Notas e Frequência</h2>
                <p className="text-xs text-slate-500">Altere os campos diretamente para atualizar os relatórios do portal dos pais.</p>
              </div>

              <button
                onClick={handleSaveAllGrades}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <Save size={16} />
                <span>Salvar Diário de Notas</span>
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 font-extrabold uppercase tracking-wider border-b border-slate-200">
                    <th className="p-3">Estudante</th>
                    <th className="p-3">Disciplina</th>
                    <th className="p-3 text-center">1º Trim (3.0)</th>
                    <th className="p-3 text-center">2º Trim (3.5)</th>
                    <th className="p-3 text-center">3º Trim (3.5)</th>
                    <th className="p-3 text-center">Faltas</th>
                    <th className="p-3 text-center">Média / Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {localGrades.map((g, idx) => {
                    const avg = ((g.trimestre1 + g.trimestre2 + g.trimestre3) / 3).toFixed(1);
                    return (
                      <tr key={idx} className="hover:bg-blue-50/30 transition-colors">
                        <td className="p-3 font-bold text-slate-900">{g.studentName}</td>
                        <td className="p-3 text-slate-600">{g.subject}</td>
                        
                        <td className="p-3 text-center">
                          <input
                            type="number"
                            step="0.1"
                            max="10"
                            min="0"
                            value={g.trimestre1}
                            onChange={(e) => handleGradeChange(g.studentId, g.subject, 'trimestre1', parseFloat(e.target.value) || 0)}
                            className="w-16 text-center py-1 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-hidden font-semibold"
                          />
                        </td>

                        <td className="p-3 text-center">
                          <input
                            type="number"
                            step="0.1"
                            max="10"
                            min="0"
                            value={g.trimestre2}
                            onChange={(e) => handleGradeChange(g.studentId, g.subject, 'trimestre2', parseFloat(e.target.value) || 0)}
                            className="w-16 text-center py-1 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-hidden font-semibold"
                          />
                        </td>

                        <td className="p-3 text-center">
                          <input
                            type="number"
                            step="0.1"
                            max="10"
                            min="0"
                            value={g.trimestre3}
                            onChange={(e) => handleGradeChange(g.studentId, g.subject, 'trimestre3', parseFloat(e.target.value) || 0)}
                            className="w-16 text-center py-1 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-hidden font-semibold"
                          />
                        </td>

                        <td className="p-3 text-center">
                          <input
                            type="number"
                            min="0"
                            value={g.faltas}
                            onChange={(e) => handleGradeChange(g.studentId, g.subject, 'faltas', parseInt(e.target.value) || 0)}
                            className="w-14 text-center py-1 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-hidden font-semibold text-slate-700"
                          />
                        </td>

                        <td className="p-3 text-center">
                          <span className={`inline-block px-2.5 py-1 rounded-md font-bold text-xs ${
                            parseFloat(avg) >= 7.0 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            Média: {avg} ({g.status})
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* TAB 2: OCORRÊNCIAS & RECADOS */}
        {activeSubTab === 'occurrences' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Form de Ocorrência */}
            <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
              <h2 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-2">
                Enviar Recado ou Ocorrência
              </h2>

              <form onSubmit={handleCreateOccurrence} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Aluno Destinatário</label>
                  <select
                    value={occStudentName}
                    onChange={(e) => setOccStudentName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                  >
                    <option value="Lucas Silva Santos">Lucas Silva Santos (2º Ano)</option>
                    <option value="Beatriz Costa Ramos">Beatriz Costa Ramos (2º Ano)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tipo de Registro</label>
                  <select
                    value={occType}
                    onChange={(e) => setOccType(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                  >
                    <option value="Elogio">Elogio / Desempenho Exemplar</option>
                    <option value="Pedagógico">Lembrete Pedagógico / Plano de Estudo</option>
                    <option value="Aviso">Aviso sobre Material ou Calendário</option>
                    <option value="Observação">Observação de Convivência</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Assunto / Título</label>
                  <input
                    type="text"
                    value={occTitle}
                    onChange={(e) => setOccTitle(e.target.value)}
                    placeholder="Ex: Ótimo aproveitamento na aula prática"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Descrição para os Pais</label>
                  <textarea
                    rows={4}
                    value={occDesc}
                    onChange={(e) => setOccDesc(e.target.value)}
                    placeholder="Digite a mensagem direcionada à família do aluno..."
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-800 hover:bg-blue-900 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <MessageSquare size={15} />
                  <span>Registrar e Enviar para os Pais</span>
                </button>
              </form>
            </div>

            {/* Histórico */}
            <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
              <h2 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-2">
                Ocorrências Recentes Registradas ({occurrences.length})
              </h2>

              <div className="space-y-3">
                {occurrences.map((o) => (
                  <div key={o.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold bg-blue-100 text-blue-900 px-2 py-0.5 rounded-md">
                        {o.type} • {o.studentName}
                      </span>
                      <span className="text-[10px] text-slate-500">{o.date}</span>
                    </div>
                    <h4 className="font-bold text-xs text-slate-900">{o.title}</h4>
                    <p className="text-[11px] text-slate-600 leading-relaxed">{o.description}</p>
                    <div className="text-[10px] text-slate-400 pt-1">
                      Status: {o.readByParent ? '✓ Visualizado pelos pais' : '⏳ Pendente de leitura'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB: POSTAR NOTÍCIA / COMUNICADO */}
        {activeSubTab === 'notice' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 max-w-2xl mx-auto space-y-4 shadow-sm">
            <h2 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
              <Bell size={18} className="text-blue-700" />
              <span>Publicar Notícia / Comunicado Escolar</span>
            </h2>

            <form onSubmit={handlePostNotice} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Título do Comunicado</label>
                <input
                  type="text"
                  value={noticeTitle}
                  onChange={(e) => setNoticeTitle(e.target.value)}
                  placeholder="Ex: Calendário das Práticas de Agroecologia - 2º Semestre"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Categoria</label>
                <select
                  value={noticeCategory}
                  onChange={(e) => setNoticeCategory(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden bg-white"
                >
                  <option value="Pedagógico">Pedagógico</option>
                  <option value="Geral">Geral</option>
                  <option value="Calendário">Calendário</option>
                  <option value="Eventos">Eventos</option>
                  <option value="Urgente">Urgente</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Conteúdo da Notícia</label>
                <textarea
                  rows={4}
                  value={noticeContent}
                  onChange={(e) => setNoticeContent(e.target.value)}
                  placeholder="Informe os detalhes do comunicado para a comunidade escolar..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-800 hover:bg-blue-900 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-all hover:scale-[1.01]"
              >
                <Bell size={15} />
                <span>Publicar Notícia / Comunicado no Site</span>
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: FOTOS DA AULA */}
        {activeSubTab === 'photo' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 max-w-2xl mx-auto space-y-4">
            <h2 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
              <Camera size={18} className="text-blue-700" />
              <span>Publicar Foto de Atividade Prática da Turma</span>
            </h2>

            <form onSubmit={handlePostPhoto} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Título da Atividade</label>
                <input
                  type="text"
                  value={photoTitle}
                  onChange={(e) => setPhotoTitle(e.target.value)}
                  placeholder="Ex: Coleta e análise de amostras de solo"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">URL da Foto</label>
                <input
                  type="text"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Legenda Explicativa</label>
                <textarea
                  rows={3}
                  value={photoDesc}
                  onChange={(e) => setPhotoDesc(e.target.value)}
                  placeholder="Relate o aprendizado dos estudantes..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-800 hover:bg-blue-900 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Camera size={15} />
                <span>Postar Foto na Rotina da Turma</span>
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
