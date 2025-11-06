-- Criar o banco de dados

CREATE DATABASE webserver_filmes_anacg;

-- DROP DATABASE  webserver_filmes_anacg;

USE webserver_filmes_anacg;
 
-- ATOR
CREATE TABLE Ator (
    id_ator INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    sobrenome VARCHAR(255),
    nacionalidade VARCHAR(255),
);

-- DIRETOR
CREATE TABLE Diretor (
    id_diretor INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    sobrenome VARCHAR(255),
    nacionalidade VARCHAR(255),
);

-- PRODUTORA
CREATE TABLE Produtora (
    id_produtora INT AUTO_INCREMENT PRIMARY KEY,
    produtora VARCHAR(255) NOT NULL
);

-- PAÍS
CREATE TABLE Pais (
    id_pais INT AUTO_INCREMENT PRIMARY KEY,
    pais VARCHAR(255) NOT NULL
);

-- LINGUAGEM
CREATE TABLE Linguagem (
    id_linguagem INT AUTO_INCREMENT PRIMARY KEY,
    linguagem VARCHAR(255) NOT NULL
);

-- GÊNERO
CREATE TABLE Genero (
    id_genero INT AUTO_INCREMENT PRIMARY KEY,
    genero VARCHAR(255) NOT NULL
);

-- FILME
CREATE TABLE Filme (
    id_filme INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    tempo_duracao TIME,
    ano YEAR,
    poster text,
    id_linguagem INT,
    FOREIGN KEY (id_linguagem) REFERENCES Linguagem(id_linguagem)
);

-- TABELAS RELACIONADAS
CREATE TABLE Filme_Ator (
    id_filme_ator INT AUTO_INCREMENT PRIMARY KEY,
    id_filme INT NOT NULL,
    id_ator INT NOT NULL,
    FOREIGN KEY (id_filme) REFERENCES Filme(id_filme),
    FOREIGN KEY (id_ator) REFERENCES Ator(id_ator)
);

CREATE TABLE Filme_Diretor (
    id_filme_diretor INT AUTO_INCREMENT PRIMARY KEY,
    id_filme INT NOT NULL,
    id_diretor INT NOT NULL,
    FOREIGN KEY (id_filme) REFERENCES Filme(id_filme),
    FOREIGN KEY (id_diretor) REFERENCES Diretor(id_diretor)
);

CREATE TABLE Filme_Produtora (
    id_filme_produtora INT AUTO_INCREMENT PRIMARY KEY,
    id_filme INT NOT NULL,
    id_produtora INT NOT NULL,
    FOREIGN KEY (id_filme) REFERENCES Filme(id_filme),
    FOREIGN KEY (id_produtora) REFERENCES Produtora(id_produtora)
);

CREATE TABLE Filme_Pais (
    id_filme_pais INT AUTO_INCREMENT PRIMARY KEY,
    id_filme INT NOT NULL,
    id_pais INT NOT NULL,
    FOREIGN KEY (id_filme) REFERENCES Filme(id_filme),
    FOREIGN KEY (id_pais) REFERENCES Pais(id_pais)
);

CREATE TABLE Filme_Genero (
    id_filme_genero INT AUTO_INCREMENT PRIMARY KEY,
    id_filme INT NOT NULL,
    id_genero INT NOT NULL,
    FOREIGN KEY (id_filme) REFERENCES Filme(id_filme),
    FOREIGN KEY (id_genero) REFERENCES Genero(id_genero)
); 
 
 INSERT INTO Linguagem (linguagem) VALUES
('Inglês'),
('Português'),
('Espanhol'),
('Francês'),
('Alemão'),
('Italiano'),
('Japonês'),
('Chinês'),
('Russo'),
('Árabe'),
('Coreano'),
('Hindi'),
('Bengali'),
('Holandês'),
('Sueco'),
('Polonês'),
('Turco'),
('Grego'),
('Tailandês'),
('Vietnamita');
 
-- Inserir País
INSERT INTO Pais (pais) VALUES 
('Estados Unidos'),
('Brasil'),
('Argentina'),
('Canadá'),
('França'),
('Reino Unido'),
('Alemanha'),
('Itália'),
('Japão'),
('China'),
('Rússia'),
('México'),
('Coreia do Sul'),
('Indústria Indiana'),
('Espanha'),
('Suécia'),
('Holanda'),
('Polônia'),
('Turquia'),
('Irã');

-- Inserir Gênero
INSERT INTO Genero (genero) VALUES 
('Ação'),
('Aventura'),
('Comédia'),
('Drama'),
('Terror'),
('Suspense'),
('Romance'),
('Ficção Científica'),
('Mistério'),
('Fantasia'),
('Animação'),
('Documentário'),
('Musical'),
('Thriller'),
('Crime'),
('Histórico'),
('Guerra'),
('Policial'),
('Família'),
('Biografia');
