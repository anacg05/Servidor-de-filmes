# WebServer de Filmes

<!-- Capa -->
<img src="./projeto_capa.png"/>

<!-- Resumo -->
**WebServer de Filmes** é um projeto desenvolvido para a disciplina de Frontend do curso de Desenvolvimento de Sistemas do SENAI Roberto Mange. O projeto tem como principal objetivo criar um sistema de gerenciamento de filmes, onde os usuários comuns podem visualizar, adicionar, editar e filtrar filmes, enquanto os administradores têm a função de aprovar ou rejeitar solicitações de adição e edição de filmes. O sistema conta com uma interface simples e intuitiva, usando **React** no frontend, **Python** no backend e **MySQL** como banco de dados.

A proposta deste sistema é facilitar o gerenciamento e organização de filmes de forma colaborativa, além de fornecer um ambiente acessível para usuários comuns interagirem com os dados do sistema.

<br/>

<!-- Objetivos -->
## Objetivos do projeto

- Criar uma plataforma web para gerenciamento de filmes;
- Permitir aos usuários comuns visualizar, adicionar, editar e filtrar filmes;
- Implementar um sistema de autenticação de usuários, diferenciando usuários comuns de administradores;
- Administradores devem aprovar ou recusar adições e edições de filmes feitas pelos usuários comuns;
- Garantir uma interface funcional e de fácil navegação para o usuário final.

<br/>

<!-- Pastas -->
## Organização de pastas e arquivos

O projeto é dividido em duas partes principais:

### 🐍 Backend
Contém o servidor em **Python** que se comunica com o banco de dados **MySQL** para realizar as operações de CRUD (Create, Read, Update, Delete) nos filmes, além de gerenciar o sistema de autenticação de usuários e controle de permissões para administradores. O backend é responsável por validar e processar as solicitações de filmes feitas pelos usuários.

<br/>

### 💻 Frontend
No diretório "public" estão armazenadas as imagens e arquivos estáticos. Dentro de "src" encontram-se todos os componentes **React** que compõem as páginas do site, incluindo as páginas de listagem de filmes, adição, edição, e visualização. A navegação entre as páginas é gerenciada pelo **React Router**, e as interações são feitas com o backend através de requisições **HTTP**.

Além disso, na pasta "Assets" estão a fonte global do projeto e variáveis de cores utilizadas.

<br/>

<!-- Instalações -->
## Dependências

Para rodar tanto o Backend quanto o Frontend, são necessárias as instalações de algumas dependências:

### 🐍 Backend
> [!IMPORTANT] Não é necessário rodar o Backend para rodar o projeto frontend, mas é necessário para realizar as operações de backend.

#### Instalação das dependências do backend:
```bash
pip install -r requirements.txt
