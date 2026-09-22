# Configuração do Firebase — CMS EFABE

O site funciona localmente sem Firebase. Para ativar autenticação real, conteúdo
compartilhado e upload de arquivos, crie um projeto no Firebase e configure:

1. Authentication com o provedor E-mail/Senha.
2. Cloud Firestore em modo de produção.
3. Cloud Storage.
4. Firebase Hosting, caso ele seja usado para a publicação.

Copie `.env.example` para `.env.local` e preencha todas as variáveis
`VITE_FIREBASE_*` com a configuração do aplicativo Web do Firebase.

## Primeiro administrador

Crie o usuário no Firebase Authentication. Em seguida, crie manualmente o
documento `cmsUsers/{UID_DO_USUARIO}` no Firestore:

```json
{
  "name": "Administrador EFABE",
  "email": "email-do-administrador",
  "role": "admin",
  "active": true
}
```

O campo `role` pode ser `admin` ou `editor`. Apenas `admin` pode administrar
perfis. As regras incluídas no projeto bloqueiam escritas anônimas.

## Publicação das regras

Após selecionar o projeto no Firebase CLI, publique as regras e índices:

```text
firebase deploy --only firestore:rules,firestore:indexes,storage
```

Não coloque chaves privadas ou credenciais de contas de serviço nas variáveis
`VITE_*`; elas ficam visíveis no navegador. A segurança é garantida pelas regras
do Firestore/Storage e pela autenticação do usuário.
