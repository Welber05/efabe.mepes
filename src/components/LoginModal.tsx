import React, { useState } from 'react';
import { User, Role } from '../types';
import { 
  X, 
  Lock, 
  Mail, 
  ShieldCheck, 
  BookOpen, 
  Users, 
  KeyRound, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  usersList: User[];
  onLoginSuccess: (user: User) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  usersList,
  onLoginSuccess,
}) => {
  const [selectedRole, setSelectedRole] = useState<Role>('admin');
  const [email, setEmail] = useState('admin@mepes.org.br');
  const [password, setPassword] = useState('123');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleRoleTabChange = (role: Role) => {
    setSelectedRole(role);
    setErrorMsg('');
    if (role === 'admin') {
      setEmail('admin@mepes.org.br');
    } else if (role === 'teacher') {
      setEmail('professor@mepes.org.br');
    } else if (role === 'parent') {
      setEmail('pais@mepes.org.br');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const found = usersList.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() || u.cpf === email
    );

    if (found) {
      onLoginSuccess(found);
      onClose();
    } else {
      setErrorMsg('Credenciais não encontradas. Utilize um dos botões de simulação abaixo.');
    }
  };

  const handleQuickDemo = (user: User) => {
    onLoginSuccess(user);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden transform transition-all">
        
        {/* Header */}
        <div className="bg-emerald-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-emerald-300 hover:text-white bg-emerald-800 hover:bg-emerald-700 p-1.5 rounded-full transition-colors"
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-[#e9c46a] p-0.5 shadow-md flex items-center justify-center shrink-0">
              <img src="/logomarca.jpeg" alt="EFABE Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight font-heading">Portal EFABE - Acesso Restrito</h2>
              <p className="text-xs text-emerald-200 font-body">Escola Família Agrícola de Boa Esperança</p>
            </div>
          </div>
        </div>

        {/* Role Tabs */}
        <div className="grid grid-cols-3 bg-slate-100 p-1 border-b border-slate-200 text-xs font-semibold">
          <button
            onClick={() => handleRoleTabChange('admin')}
            className={`py-2.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              selectedRole === 'admin'
                ? 'bg-white text-emerald-900 shadow-xs font-bold border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck size={14} className={selectedRole === 'admin' ? 'text-emerald-600' : ''} />
            <span>Admin (Gestor)</span>
          </button>

          <button
            onClick={() => handleRoleTabChange('teacher')}
            className={`py-2.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              selectedRole === 'teacher'
                ? 'bg-white text-blue-900 shadow-xs font-bold border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen size={14} className={selectedRole === 'teacher' ? 'text-blue-600' : ''} />
            <span>Professor</span>
          </button>

          <button
            onClick={() => handleRoleTabChange('parent')}
            className={`py-2.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              selectedRole === 'parent'
                ? 'bg-white text-amber-900 shadow-xs font-bold border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users size={14} className={selectedRole === 'parent' ? 'text-amber-600' : ''} />
            <span>Pais / Alunos</span>
          </button>
        </div>

        <div className="p-6 space-y-5">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                E-mail ou CPF Cadastrado
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-slate-400" size={16} />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-hidden"
                  placeholder="ex: admin@mepes.org.br ou CPF"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Senha de Acesso
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-slate-400" size={16} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-hidden"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <KeyRound size={16} />
              <span>Entrar no Portal</span>
            </button>
          </form>

          {/* Demonstration Quick Access Buttons */}
          <div className="pt-4 border-t border-slate-200">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 text-center">
              Acesso Instantâneo de Teste (Clique para Entrar)
            </p>
            <div className="space-y-2">
              {usersList.map((u) => (
                <button
                  key={u.id}
                  onClick={() => handleQuickDemo(u)}
                  className="w-full text-left p-2.5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover border border-slate-300" />
                    <div>
                      <div className="text-xs font-bold text-slate-800 group-hover:text-emerald-900">{u.name}</div>
                      <div className="text-[10px] text-slate-500">
                        {u.role === 'admin' ? 'Administração do Site' : u.role === 'teacher' ? 'Prof. Agropecuária' : 'Pais de Lucas Silva'}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    Acessar <CheckCircle2 size={14} />
                  </span>
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
