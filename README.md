# Template de Back-end

O template é direcionado a todos que desejam iniciar um back-end com algumas funcionalidades já previamente implementadas.

## 🚀 Funcionalidades

- 👥 Usuários - Entidade de Usuários com paginação.
- 🔒 Autenticação - Segurança com algoritmo SHA-512.
- ✅ Yup - Biblioteca para validação.
- 🧪 Jest - Biblioteca para testes unitários / de integração.
- 📧 Nodemailer - Biblioteca para envio de e-mails.
- 📁 Multer - Biblioteca para envio de arquivos.
- 📙 Prisma ERD Generator - Biblioteca para geração de DER (Diagrama Entidade-Relacionamento).

## ⚙️ Instalação

Para instalar as dependências, utilize um dos seguintes comandos:

```bash
- npm install
- yarn
```

## 🪄 Uso

Para inicializar o projeto, utilize um dos seguintes comandos:

```bash
- yarn dev
- npm run dev
```

Após inicializado, para rodar as migrations utilize um dos seguintes comandos:

```bash
- yarn prisma migrate dev
- npx prisma migrate dev
```

Para gerar o seed, utilize um dos seguintes comandos:

```bash
- yarn prisma db seed
- npx prisma db seed
```

Para gerar o DER (Diagrama de Entidade-Relacionamento), utilize um dos seguintes comandos:

```bash
- yarn prisma generate
- npx prisma generate
```

Para rodar os testes, utilize um dos seguintes comandos:

```bash
- yarn test
- npm run test
```

## 🤝 Apoio

Pull requests são bem-vindas. Para maiores mudanças, primeiro abra uma issue para discutir o que você gostaria de mudar.

Por gentileza, atualize os testes apropriadamente.
