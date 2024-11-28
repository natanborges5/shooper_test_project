## Instruções para rodar container docker

- Adicionar as variáveis do .env.example ao arquivo .env e adicionar a variável de ambiente GOOGLE_API_KEY no .env
- Rodar o comando "yarn" ou "npm install" na raiz do projeto
- Rodar o comando "docker compose build web" na raiz do projeto
- Rodar o comando "docker compose up postgres -d" para subir somente o postgres para gerar as tabelas e fazer o seed.
- Rodar o comando "yarn db:push" na raiz do projeto para gerar as tabelas
- Rodar o comando "yarn prisma:seed" para fazer o seed do banco de dados
- Subir os containers com o comando "docker compose up" na raiz do projeto
- O backend vai estar na porta 8080 [Swagger](http://localhost:8080/api#)
- O Frontend vai estar na porta 3000 [Front](http://localhost:3000/) a porta 80 para o frontend causou problemas de cors, por isso está na porta 3000.
