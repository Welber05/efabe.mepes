import React, { useState } from 'react';
import { User, StudentGrade, Occurrence, AlternanciaSchedule, RoutinePhoto, Message } from '../../types';
import { 
  Users, 
  Award, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Repeat, 
  Camera, 
  Send, 
  Bell, 
  BookOpen, 
  MessageSquare,
  Clock,
  ChevronRight
} from 'lucide-react';

interface ParentPortalProps {
  parentUser: User;
  grades: StudentGrade[];
  occurrences: Occurrence[];
  schedule: AlternanciaSchedule[];
  routinePhotos: RoutinePhoto[];
  messages: Message[];
  onSendMessage: (msg: Message) => void;
}

export const ParentPortal: React.FC<ParentPortalProps> = ({
  parentUser,
  grades,
  occurrences,
  schedule,
  routinePhotos,
  messages,
  onSendMessage,
}) => {
  const [activeTab, setActiveTab] = useState<'boletim' | 'alternancia' | 'occurrences' | 'routine' | 'contact'>('boletim');
  
  // Message form state
  const [msgSubject, setMsgSubject] = useState('');
  const [msgContent, setMsgContent] = useState('');
  const [msgSentSuccess, setMsgSentSuccess] = useState(false);

  // Student specific filtering
  const studentGrades = grades.filter((g) => g.studentId === 'st-01');
  const studentOccurrences = occurrences.filter((o) => o.studentId === 'st-01');
  const childClassPhotos = routinePhotos.filter((p) => p.turma.includes('2º Ano') || p.turma === 'Todas as Turmas');

  // Calculate overall average and attendance
  const totalSubjects = studentGrades.length || 1;
  const overallAvg = (studentGrades.reduce((acc, curr) => acc + (curr.trimestre1 + curr.trimestre2 + curr.trimestre3) / 3, 0) / totalSubjects).toFixed(1);
  const totalFaltas = studentGrades.reduce((acc, curr) => acc + curr.faltas, 0);
  const totalAulasEstimadas = 240;
  const presenciaPct = (((totalAulasEstimadas - totalFaltas) / totalAulasEstimadas) * 100).toFixed(1);

  const handleSendMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgSubject || !msgContent) return;

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      senderName: parentUser.name,
      senderRole: 'parent',
      receiverRole: 'teacher',
      subject: msgSubject,
      content: msgContent,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      read: false,
    };

    onSendMessage(newMsg);
    setMsgSubject('');
    setMsgContent('');
    setMsgSentSuccess(true);
    setTimeout(() => setMsgSentSuccess(false), 4000);
  };

  return (
    <div className="py-8 bg-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Student Profile Card Header */}
        <div className="bg-gradient-to-r from-amber-900 via-emerald-950 to-emerald-900 text-white p-6 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={parentUser.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200'}
                alt={parentUser.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400"
              />
              <span className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-950 p-1 rounded-full text-[10px] font-black">
                <Users size={12} />
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="bg-amber-400 text-emerald-950 text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase">
                  Portal dos Pais & Aluno
                </span>
                <span className="text-xs text-amber-200 font-body">EFABE - Escola Família Agrícola de Boa Esperança</span>
              </div>
              <h1 className="text-2xl font-black">{parentUser.studentName || 'Lucas Silva Santos'}</h1>
              <p className="text-xs text-emerald-200">
                Responsáveis: <strong className="text-white">{parentUser.name}</strong> • Turma: <strong className="text-amber-300">{parentUser.turma || '2º Ano - Téc. Agropecuária'}</strong>
              </p>
            </div>
          </div>

          {/* Quick Stats Cards */}
          <div className="flex items-center gap-3">
            <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 text-center">
              <div className="text-[10px] text-emerald-200 uppercase font-semibold">Média Geral</div>
              <div className="text-xl font-black text-amber-300">{overallAvg} / 10</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 text-center">
              <div className="text-[10px] text-emerald-200 uppercase font-semibold">Frequência</div>
              <div className="text-xl font-black text-emerald-300">{presenciaPct}%</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('boletim')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'boletim'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <Award size={16} /> Boletim Escolar & Notas
          </button>

          <button
            onClick={() => setActiveTab('alternancia')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'alternancia'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <Repeat size={16} /> Calendário da Alternância
          </button>

          <button
            onClick={() => setActiveTab('occurrences')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer relative ${
              activeTab === 'occurrences'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <Bell size={16} /> Recados & Ocorrências ({studentOccurrences.length})
          </button>

          <button
            onClick={() => setActiveTab('routine')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'routine'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <Camera size={16} /> Rotina da Turma ({childClassPhotos.length})
          </button>

          <button
            onClick={() => setActiveTab('contact')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'contact'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <MessageSquare size={16} /> Falar com os Professores
          </button>
        </div>

        {/* TAB 1: BOLETIM ESCOLAR */}
        {activeTab === 'boletim' && (
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Boletim do Desempenho Escolar</h2>
                <p className="text-xs text-slate-500">Acompanhamento do aproveitamento acadêmico por trimestre.</p>
              </div>

              <div className="bg-emerald-50 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5">
                <CheckCircle2 size={16} className="text-emerald-600" />
                <span>Situação Atual: Regular e Aprovado</span>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 font-extrabold uppercase tracking-wider border-b border-slate-200">
                    <th className="p-3">Disciplina</th>
                    <th className="p-3 text-center">1º Trimestre</th>
                    <th className="p-3 text-center">2º Trimestre</th>
                    <th className="p-3 text-center">3º Trimestre</th>
                    <th className="p-3 text-center">Faltas</th>
                    <th className="p-3 text-center">Média Parcial</th>
                    <th className="p-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {studentGrades.map((g, idx) => {
                    const avg = ((g.trimestre1 + g.trimestre2 + g.trimestre3) / 3).toFixed(1);
                    return (
                      <tr key={idx} className="hover:bg-amber-50/20 transition-colors">
                        <td className="p-3 font-bold text-slate-900 flex items-center gap-2">
                          <BookOpen size={14} className="text-amber-600 shrink-0" />
                          <span>{g.subject}</span>
                        </td>
                        <td className="p-3 text-center font-semibold text-slate-700">{g.trimestre1.toFixed(1)}</td>
                        <td className="p-3 text-center font-semibold text-slate-700">{g.trimestre2.toFixed(1)}</td>
                        <td className="p-3 text-center font-semibold text-slate-700">{g.trimestre3.toFixed(1)}</td>
                        <td className="p-3 text-center font-semibold text-slate-600">{g.faltas} faltas</td>
                        <td className="p-3 text-center font-extrabold text-slate-900">{avg}</td>
                        <td className="p-3 text-center">
                          <span className={`inline-block px-2.5 py-1 rounded-md font-extrabold text-[10px] uppercase ${
                            g.status === 'Aprovado' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {g.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
              <span>* Média mínima para aprovação sem exame final: <strong>7.0</strong></span>
              <span>Total de faltas acumuladas no ano: <strong className="text-slate-900">{totalFaltas} dias</strong></span>
            </div>
          </div>
        )}

        {/* TAB 2: CALENDÁRIO DA ALTERNÂNCIA */}
        {activeTab === 'alternancia' && (
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200 space-y-6">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">Cronograma da Pedagogia da Alternância</h2>
              <p className="text-xs text-slate-500">Datas das etapas de permanência na escola (internato) e na propriedade familiar.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {schedule.map((item) => (
                <div
                  key={item.id}
                  className={`p-5 rounded-3xl border-2 space-y-3 ${
                    item.mode === 'Escola'
                      ? 'bg-emerald-50/60 border-emerald-300'
                      : 'bg-amber-50/60 border-amber-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase ${
                      item.mode === 'Escola' ? 'bg-emerald-700 text-white' : 'bg-amber-700 text-white'
                    }`}>
                      {item.mode === 'Escola' ? '🏫 Sessão Escola (Internato)' : '🏡 Sessão Família (Campo)'}
                    </span>
                    <span className="text-xs font-bold text-slate-600">{item.period}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900 pt-1">
                    <Calendar size={15} className="text-slate-500" />
                    <span>{item.startDate} até {item.endDate}</span>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed pt-2 border-t border-slate-200/60">
                    {item.activities}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: OCORRÊNCIAS & RECADOS */}
        {activeTab === 'occurrences' && (
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200 space-y-6">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">Recados da Coordenação & Professores</h2>
              <p className="text-xs text-slate-500">Acompanhe as observações registradas para seu filho.</p>
            </div>

            <div className="space-y-4">
              {studentOccurrences.map((occ) => (
                <div key={occ.id} className="p-5 bg-slate-50 border border-slate-200 rounded-3xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${
                      occ.type === 'Elogio' ? 'bg-emerald-100 text-emerald-900' : 'bg-blue-100 text-blue-900'
                    }`}>
                      {occ.type}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock size={13} /> {occ.date} • {occ.teacherName}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900">{occ.title}</h3>
                  <p className="text-xs text-slate-700 leading-relaxed">{occ.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: ROTINA DA TURMA */}
        {activeTab === 'routine' && (
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200 space-y-6">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">Fotos da Rotina Escolar da Turma</h2>
              <p className="text-xs text-slate-500">Veja seu filho em ação durante as vivências práticas na escola.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {childClassPhotos.map((photo) => (
                <div key={photo.id} className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden space-y-2 p-3">
                  <div className="h-44 rounded-xl overflow-hidden">
                    <img src={photo.imageUrl} alt={photo.title} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                      {photo.category}
                    </span>
                    <h4 className="font-bold text-xs text-slate-900 mt-1">{photo.title}</h4>
                    <p className="text-[11px] text-slate-600 line-clamp-2">{photo.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: MENSAGEM DIRETA */}
        {activeTab === 'contact' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
              <h2 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-2">
                Enviar Mensagem para os Professores
              </h2>

              {msgSentSuccess ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-emerald-600" />
                  <span>Mensagem enviada com sucesso! O professor responderá em breve.</span>
                </div>
              ) : (
                <form onSubmit={handleSendMessageSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Assunto / Motivo</label>
                    <input
                      type="text"
                      value={msgSubject}
                      onChange={(e) => setMsgSubject(e.target.value)}
                      placeholder="Ex: Dúvida sobre o relatório do Plano de Estudo"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-hidden"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Sua Mensagem</label>
                    <textarea
                      rows={5}
                      value={msgContent}
                      onChange={(e) => setMsgContent(e.target.value)}
                      placeholder="Digite a mensagem para o Prof. Carlos Andrade e coordenação..."
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-hidden"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send size={15} />
                    <span>Enviar Mensagem</span>
                  </button>
                </form>
              )}
            </div>

            <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
              <h2 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-2">
                Histórico de Mensagens do Portal
              </h2>

              <div className="space-y-3">
                {messages.map((m) => (
                  <div key={m.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-500">
                      <strong className="text-slate-800">{m.senderName}</strong>
                      <span>{m.date}</span>
                    </div>
                    <h4 className="font-bold text-xs text-slate-900">{m.subject}</h4>
                    <p className="text-xs text-slate-600">{m.content}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
