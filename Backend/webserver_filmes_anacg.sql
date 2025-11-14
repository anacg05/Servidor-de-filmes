/* 1. CRIAÇÃO DO BANCO DE DADOS */
DROP DATABASE IF EXISTS webserver_filmes_anacg;
CREATE DATABASE webserver_filmes_anacg;
USE webserver_filmes_anacg;

/* 2. CRIAÇÃO DAS TABELAS */
CREATE TABLE Ator (
    id_ator INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    sobrenome VARCHAR(255) NOT NULL,
    nacionalidade VARCHAR(255)
);

CREATE TABLE Diretor (
    id_diretor INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    sobrenome VARCHAR(255),
    nacionalidade VARCHAR(255)
);

CREATE TABLE Produtora (
    id_produtora INT AUTO_INCREMENT PRIMARY KEY,
    produtora VARCHAR(255) NOT NULL
);

CREATE TABLE Pais (
    id_pais INT AUTO_INCREMENT PRIMARY KEY,
    pais VARCHAR(255) NOT NULL
);

CREATE TABLE Linguagem (
    id_linguagem INT AUTO_INCREMENT PRIMARY KEY,
    linguagem VARCHAR(255) NOT NULL
);

CREATE TABLE Genero (
    id_genero INT AUTO_INCREMENT PRIMARY KEY,
    genero VARCHAR(255) NOT NULL
);

/* Tabela Filme */
CREATE TABLE Filme (
    id_filme INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    tempo_duracao TIME,
    ano YEAR,
    poster TEXT,
    id_linguagem INT,
    synopsis TEXT,
    rating DECIMAL(3,1),
    status VARCHAR(20) NOT NULL DEFAULT 'APROVADO',
    id_filme_original INT NULL,
    FOREIGN KEY (id_linguagem) REFERENCES Linguagem(id_linguagem)
);

/* Tabelas Relacionamento */
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

/* 3. ADIÇÃO DE ÍNDICES (MELHORIA DE PERFORMANCE) */
CREATE INDEX idx_filme_status ON Filme(status);
CREATE INDEX idx_filme_titulo ON Filme(titulo);
CREATE INDEX idx_filme_ano ON Filme(ano);

CREATE INDEX idx_genero_nome ON Genero(genero);

CREATE INDEX idx_fg_filme ON Filme_Genero(id_filme);
CREATE INDEX idx_fg_genero ON Filme_Genero(id_genero);

CREATE INDEX idx_fa_filme ON Filme_Ator(id_filme);
CREATE INDEX idx_fd_filme ON Filme_Diretor(id_filme);
CREATE INDEX idx_fp_filme ON Filme_Produtora(id_filme);
CREATE INDEX idx_fpais_filme ON Filme_Pais(id_filme);

/* 4. INSERÇÃO DE DADOS BÁSICOS */
INSERT INTO Linguagem (linguagem) VALUES
('Inglês'), ('Português'), ('Espanhol'), ('Francês'), ('Alemão'),
('Italiano'), ('Japonês'), ('Chinês'), ('Russo'), ('Árabe'),
('Coreano'), ('Hindi'), ('Bengali'), ('Holandês'), ('Sueco'),
('Polonês'), ('Turco'), ('Grego'), ('Tailandês'), ('Vietnamita');

INSERT INTO Pais (pais) VALUES 
('Estados Unidos'), ('Brasil'), ('Argentina'), ('Canadá'), ('França'),
('Reino Unido'), ('Alemanha'), ('Itália'), ('Japão'), ('China'),
('Rússia'), ('México'), ('Coreia do Sul'), ('Indústria Indiana'), ('Espanha'),
('Suécia'), ('Holanda'), ('Polônia'), ('Turquia'), ('Irã');

INSERT INTO Genero (genero) VALUES 
('Ação'), ('Aventura'), ('Comédia'), ('Drama'), ('Terror'),
('Suspense'), ('Romance'), ('Ficção Científica'), ('Mistério'), ('Fantasia'),
('Animação'), ('Documentário'), ('Musical'), ('Thriller'), ('Crime'),
('Histórico'), ('Guerra'), ('Policial'), ('Família'), ('Biografia');

/* 5. POPULAÇÃO DOS FILMES (mantém exatamente igual ao seu script original) */
SET FOREIGN_KEY_CHECKS = 0;


INSERT INTO Filme (id_filme, titulo, tempo_duracao, ano, poster, id_linguagem, synopsis, rating, status) VALUES (1, 'Oppenheimer', '03:00:00', 2023, 'https://m.media-amazon.com/images/M/MV5BMDEzNDdjYTctNjA4ZS00YjVlLTg0MzctYTkzMjFkNTRmODgzXkEyXkFqcGdeQXVyMTM1MTE1NDMx._V1_FMjpg_UX1000_.jpg', 1, 'A história do físico americano J. Robert Oppenheimer...', 8.6, 'APROVADO');
INSERT INTO Filme_Genero (id_filme, id_genero) VALUES (1, 20), (1, 4), (1, 16);
INSERT INTO Filme_Diretor (id_filme, id_diretor) VALUES (1, 1);
INSERT INTO Filme_Ator (id_filme, id_ator) VALUES (1, 1), (1, 10), (1, 11);

INSERT INTO Filme (id_filme, titulo, tempo_duracao, ano, poster, id_linguagem, synopsis, rating, status) VALUES (2, 'Barbie', '01:54:00', 2023, 'https://m.media-amazon.com/images/M/MV5BNjU3N2QxNzYtMWMyNC00NmMyLWEAWjctM2QxNTI3MGYxZjA3XkEyXkFqcGdeQXVyMTM1MTE1NDMx._V1_FMjpg_UX1000_.jpg', 1, 'Barbie sofre uma crise que a leva a questionar seu mundo...', 6.9, 'APROVADO');
INSERT INTO Filme_Genero (id_filme, id_genero) VALUES (2, 3), (2, 10);
INSERT INTO Filme_Diretor (id_filme, id_diretor) VALUES (2, 2);
INSERT INTO Filme_Ator (id_filme, id_ator) VALUES (2, 2), (2, 20);

INSERT INTO Filme (id_filme, titulo, tempo_duracao, ano, poster, id_linguagem, synopsis, rating, status) VALUES (3, 'The Matrix', '02:16:00', 1999, 'https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_FMjpg_UX1000_.jpg', 1, 'Um hacker descobre a verdade chocante sobre sua realidade...', 8.7, 'APROVADO');
INSERT INTO Filme_Genero (id_filme, id_genero) VALUES (3, 1), (3, 8);
INSERT INTO Filme_Diretor (id_filme, id_diretor) VALUES (3, 3);
INSERT INTO Filme_Ator (id_filme, id_ator) VALUES (3, 3);

INSERT INTO Filme (id_filme, titulo, tempo_duracao, ano, poster, id_linguagem, synopsis, rating, status) VALUES (4, 'A Origem', '02:28:00', 2010, 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_FMjpg_UX1000_.jpg', 1, 'Um ladrão que rouba segredos corporativos através do uso da tecnologia...', 8.8, 'APROVADO');
INSERT INTO Filme_Genero (id_filme, id_genero) VALUES (4, 1), (4, 8), (4, 14);
INSERT INTO Filme_Diretor (id_filme, id_diretor) VALUES (4, 1);
INSERT INTO Filme_Ator (id_filme, id_ator) VALUES (4, 4), (4, 1);

INSERT INTO Filme (id_filme, titulo, tempo_duracao, ano, poster, id_linguagem, synopsis, rating, status) VALUES (5, 'Duna: Parte 2', '02:46:00', 2024, 'https://m.media-amazon.com/images/M/MV5BODdjMjM3NGQtZDA5OC00NGE4LWIzY2MtOTA0MWNlM2M0N2Y3XkEyXkFqcGdeQXVyODE5NzE3OTE@._V1_FMjpg_UX1000_.jpg', 1, 'Paul Atreides se une a Chani e aos Fremen...', 8.9, 'APROVADO');
INSERT INTO Filme_Genero (id_filme, id_genero) VALUES (5, 8), (5, 1);
INSERT INTO Filme_Diretor (id_filme, id_diretor) VALUES (5, 5);
INSERT INTO Filme_Ator (id_filme, id_ator) VALUES (5, 5), (5, 19);

INSERT INTO Filme (id_filme, titulo, tempo_duracao, ano, poster, id_linguagem, synopsis, rating, status) VALUES (6, 'Forrest Gump', '02:22:00', 1994, 'https://m.media-amazon.com/images/M/MV5BNWIwODRlZTUtY2U3ZS00Yzg1LWJhNzYtMmZiYmEyNmU1NjMzXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_FMjpg_UX1000_.jpg', 1, 'A história das décadas de 1950 a 1970 através da perspectiva...', 8.8, 'APROVADO');
INSERT INTO Filme_Genero (id_filme, id_genero) VALUES (6, 4), (6, 7);
INSERT INTO Filme_Diretor (id_filme, id_diretor) VALUES (6, 6);
INSERT INTO Filme_Ator (id_filme, id_ator) VALUES (6, 6);

INSERT INTO Filme (id_filme, titulo, tempo_duracao, ano, poster, id_linguagem, synopsis, rating, status) VALUES (7, 'Um Sonho de Liberdade', '02:22:00', 1994, 'https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MDBjZTVkXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_FMjpg_UX1000_.jpg', 1, 'Dois homens presos se unem ao longo de vários anos...', 9.3, 'APROVADO');
INSERT INTO Filme_Genero (id_filme, id_genero) VALUES (7, 4);
INSERT INTO Filme_Diretor (id_filme, id_diretor) VALUES (7, 7);
INSERT INTO Filme_Ator (id_filme, id_ator) VALUES (7, 7);

INSERT INTO Filme (id_filme, titulo, tempo_duracao, ano, poster, id_linguagem, synopsis, rating, status) VALUES (8, 'Parasita', '02:12:00', 2019, 'https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDMtZTI4YThkYTYiMGI3XkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_FMjpg_UX1000_.jpg', 11, 'A ganância e a discriminação de classe ameaçam o relacionamento...', 8.5, 'APROVADO');
INSERT INTO Filme_Genero (id_filme, id_genero) VALUES (8, 14), (8, 4), (8, 3);
INSERT INTO Filme_Diretor (id_filme, id_diretor) VALUES (8, 8);
INSERT INTO Filme_Ator (id_filme, id_ator) VALUES (8, 8);

INSERT INTO Filme (id_filme, titulo, tempo_duracao, ano, poster, id_linguagem, synopsis, rating, status) VALUES (9, 'Mad Max: Estrada da Fúria', '02:00:00', 2015, 'https://m.media-amazon.com/images/M/MV5BN2EwM2I5OWMtMGQyMi00ZTE4LThjNDgtZTkxNTY1NjYyMzY2XkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_FMjpg_UX1000_.jpg', 1, 'Em um deserto pós-apocalíptico, uma mulher se rebela...', 8.1, 'APROVADO');
INSERT INTO Filme_Genero (id_filme, id_genero) VALUES (9, 1), (9, 8);
INSERT INTO Filme_Diretor (id_filme, id_diretor) VALUES (9, 9);
INSERT INTO Filme_Ator (id_filme, id_ator) VALUES (9, 9);

INSERT INTO Filme (id_filme, titulo, tempo_duracao, ano, poster, id_linguagem, synopsis, rating, status) VALUES (10, 'A Viagem de Chihiro', '02:05:00', 2001, 'https://m.media-amazon.com/images/M/MV5BMjlmZmI5MDctNDE2YS00YWE0LWE5ZWItZDBhYWQ0NTcxNWRhXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_FMjpg_UX1000_.jpg', 7, 'Durante a mudança para um novo bairro, uma menina de 10 anos...', 8.6, 'APROVADO');
INSERT INTO Filme_Genero (id_filme, id_genero) VALUES (10, 11), (10, 10);
INSERT INTO Filme_Diretor (id_filme, id_diretor) VALUES (10, 10);

INSERT INTO Filme (id_filme, titulo, tempo_duracao, ano, poster, id_linguagem, synopsis, rating, status) VALUES (11, 'O Poderoso Chefão', '02:55:00', 1972, 'https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_FMjpg_UX1000_.jpg', 1, 'O patriarca idoso de uma dinastia do crime organizado...', 9.2, 'APROVADO');
INSERT INTO Filme_Genero (id_filme, id_genero) VALUES (11, 15), (11, 4);
INSERT INTO Filme_Diretor (id_filme, id_diretor) VALUES (11, 11);

INSERT INTO Filme (id_filme, titulo, tempo_duracao, ano, poster, id_linguagem, synopsis, rating, status) VALUES (12, 'Pulp Fiction', '02:34:00', 1994, 'https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_FMjpg_UX1000_.jpg', 1, 'As vidas de dois assassinos da máfia, um boxeador...', 8.9, 'APROVADO');
INSERT INTO Filme_Genero (id_filme, id_genero) VALUES (12, 15), (12, 4);
INSERT INTO Filme_Diretor (id_filme, id_diretor) VALUES (12, 12);
INSERT INTO Filme_Ator (id_filme, id_ator) VALUES (12, 13), (12, 14);

INSERT INTO Filme (id_filme, titulo, tempo_duracao, ano, poster, id_linguagem, synopsis, rating, status) VALUES (13, 'Batman: O Cavaleiro das Trevas', '02:32:00', 2008, 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_FMjpg_UX1000_.jpg', 1, 'Quando a ameaça conhecida como Coringa emerge...', 9.0, 'APROVADO');
INSERT INTO Filme_Genero (id_filme, id_genero) VALUES (13, 1), (13, 15), (13, 4);
INSERT INTO Filme_Diretor (id_filme, id_diretor) VALUES (13, 1);
INSERT INTO Filme_Ator (id_filme, id_ator) VALUES (13, 12);

INSERT INTO Filme (id_filme, titulo, tempo_duracao, ano, poster, id_linguagem, synopsis, rating, status) VALUES (14, 'Interestelar', '02:49:00', 2014, 'https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_FMjpg_UX1000_.jpg', 1, 'Uma equipe de exploradores viaja através de um buraco de minhoca...', 8.7, 'APROVADO');
INSERT INTO Filme_Genero (id_filme, id_genero) VALUES (14, 8), (14, 4);
INSERT INTO Filme_Diretor (id_filme, id_diretor) VALUES (14, 1);
INSERT INTO Filme_Ator (id_filme, id_ator) VALUES (14, 9);

INSERT INTO Filme (id_filme, titulo, tempo_duracao, ano, poster, id_linguagem, synopsis, rating, status) VALUES (15, 'O Silêncio dos Inocentes', '01:58:00', 1991, 'https://m.media-amazon.com/images/M/MV5BNjNhZTk0ZmEtNjJhMi00YzFlLWE1MmEtYzM1M2ZmMGMwMTU4XkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_FMjpg_UX1000_.jpg', 1, 'Uma jovem estagiária do FBI deve procurar a ajuda de um assassino...', 8.6, 'APROVADO');
INSERT INTO Filme_Genero (id_filme, id_genero) VALUES (15, 14), (15, 15), (15, 4);
INSERT INTO Filme_Diretor (id_filme, id_diretor) VALUES (15, 13);
INSERT INTO Filme_Ator (id_filme, id_ator) VALUES (15, 15);

INSERT INTO Filme (id_filme, titulo, tempo_duracao, ano, poster, id_linguagem, synopsis, rating, status) VALUES (16, 'Se7en', '02:07:00', 1995, 'https://m.media-amazon.com/images/M/MV5BOTUwODM5MTctZjczMi00OTk4LTg3NWUtNmVhMTAzNTNjYjcyXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_FMjpg_UX1000_.jpg', 1, 'Dois detetives caçam um serial killer que usa os sete pecados...', 8.6, 'APROVADO');
INSERT INTO Filme_Genero (id_filme, id_genero) VALUES (16, 14), (16, 15);
INSERT INTO Filme_Diretor (id_filme, id_diretor) VALUES (16, 14);
INSERT INTO Filme_Ator (id_filme, id_ator) VALUES (16, 16), (16, 7);

INSERT INTO Filme (id_filme, titulo, tempo_duracao, ano, poster, id_linguagem, synopsis, rating, status) VALUES (17, 'Gladiador', '02:35:00', 2000, 'https://m.media-amazon.com/images/M/MV5BMDliMmNhNDEtODUyOS00MjNlLTgxODEtN2U3NzIxMGVkZTA1L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_FMjpg_UX1000_.jpg', 1, 'Um general romano traído é forçado a se tornar um gladiador...', 8.5, 'APROVADO');
INSERT INTO Filme_Genero (id_filme, id_genero) VALUES (17, 1), (17, 4), (17, 16);
INSERT INTO Filme_Diretor (id_filme, id_diretor) VALUES (17, 15);
INSERT INTO Filme_Ator (id_filme, id_ator) VALUES (17, 17), (17, 26);

INSERT INTO Filme (id_filme, titulo, tempo_duracao, ano, poster, id_linguagem, synopsis, rating, status) VALUES (18, 'Whiplash', '01:46:00', 2014, 'https://m.media-amazon.com/images/M/MV5BOTA5NDZlZGUtMjAxOS00YTRkLTkwYmMtYWQ0NWEwZDZiNjEzXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_FMjpg_UX1000_.jpg', 1, 'Um jovem baterista de jazz promissor é levado ao limite...', 8.5, 'APROVADO');
INSERT INTO Filme_Genero (id_filme, id_genero) VALUES (18, 4), (18, 13);
INSERT INTO Filme_Diretor (id_filme, id_diretor) VALUES (18, 16);
INSERT INTO Filme_Ator (id_filme, id_ator) VALUES (18, 18);

INSERT INTO Filme (id_filme, titulo, tempo_duracao, ano, poster, id_linguagem, synopsis, rating, status) VALUES (19, 'Your Name', '01:46:00', 2016, 'https://m.media-amazon.com/images/M/MV5BODRmZGY5NTgtStopY2YyLWFkYjYtNWU1OTY1NTEyZDFmXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_FMjpg_UX1000_.jpg', 7, 'Dois estranhos se veem misteriosamente trocando de corpo.', 8.4, 'APROVADO');
INSERT INTO Filme_Genero (id_filme, id_genero) VALUES (19, 11), (19, 7), (19, 10);
INSERT INTO Filme_Diretor (id_filme, id_diretor) VALUES (19, 17);

INSERT INTO Filme (id_filme, titulo, tempo_duracao, ano, poster, id_linguagem, synopsis, rating, status) VALUES (20, 'Homem-Aranha no Aranhaverso', '01:57:00', 2018, 'https://m.media-amazon.com/images/M/MV5BMjMwNDkxMTgzOF5BMl5BanBnXkFtZTgwNTkwNTQ3NjM@._V1_FMjpg_UX1000_.jpg', 1, 'O adolescente Miles Morales se torna o Homem-Aranha...', 8.4, 'APROVADO');
INSERT INTO Filme_Genero (id_filme, id_genero) VALUES (20, 11), (20, 1), (20, 3);
INSERT INTO Filme_Diretor (id_filme, id_diretor) VALUES (20, 18);

INSERT INTO Filme (id_filme, titulo, tempo_duracao, ano, poster, id_linguagem, synopsis, rating, status) VALUES (21, 'O Lobo de Wall Street', '03:00:00', 2013, 'https://m.media-amazon.com/images/M/MV5BMjIxMjgxNTk0MF5BMl5BanBnXkFtZTgwNjIyOTg2MDE@._V1_FMjpg_UX1000_.jpg', 1, 'Baseado na história de Jordan Belfort...', 8.2, 'APROVADO');
INSERT INTO Filme_Genero (id_filme, id_genero) VALUES (21, 20), (21, 3), (21, 15);
INSERT INTO Filme_Diretor (id_filme, id_diretor) VALUES (21, 4);
INSERT INTO Filme_Ator (id_filme, id_ator) VALUES (21, 4), (21, 2);

INSERT INTO Filme (id_filme, titulo, tempo_duracao, ano, poster, id_linguagem, synopsis, rating, status) VALUES (22, 'Alien', '01:57:00', 1979, 'https://m.media-amazon.com/images/M/MV5BOGQzZTBjMjQtOTVmMS00NGE5LWEyYmMtOGQ1ZGZjNmRkYjFhXkEyXkFqcGdeQXVyMjUzOTY1NTc@._V1_FMjpg_UX1000_.jpg', 1, 'A tripulação de uma nave espacial comercial é atacada...', 8.5, 'APROVADO');
INSERT INTO Filme_Genero (id_filme, id_genero) VALUES (22, 8), (22, 5);
INSERT INTO Filme_Diretor (id_filme, id_diretor) VALUES (22, 15);

INSERT INTO Filme (id_filme, titulo, tempo_duracao, ano, poster, id_linguagem, synopsis, rating, status) VALUES (23, 'Blade Runner 2049', '02:44:00', 2017, 'https://m.media-amazon.com/images/M/MV5BNzA1Njg4NzYxOV5BMl5BanBnXkFtZTgwODk5NjU3MzI@._V1_FMjpg_UX1000_.jpg', 1, 'Um jovem Blade Runner descobre um segredo há muito enterrado...', 8.0, 'APROVADO');
INSERT INTO Filme_Genero (id_filme, id_genero) VALUES (23, 8), (23, 14);
INSERT INTO Filme_Diretor (id_filme, id_diretor) VALUES (23, 5);
INSERT INTO Filme_Ator (id_filme, id_ator) VALUES (23, 20);

INSERT INTO Filme (id_filme, titulo, tempo_duracao, ano, poster, id_linguagem, synopsis, rating, status) VALUES (24, 'O Fabuloso Destino de Amélie Poulain', '02:02:00', 2001, 'https://m.media-amazon.com/images/M/MV5BNDg4NjM1YjMtYmNhZC00MjM0LWFiZmYtNGY1YjA3MzZmODc5XkEyXkFqcGdeQXVyNDk3NzU2MTQ@._V1_FMjpg_UX1000_.jpg', 4, 'Amélie é uma garçonete parisiense que decide mudar o mundo...', 8.3, 'APROVADO');
INSERT INTO Filme_Genero (id_filme, id_genero) VALUES (24, 3), (24, 7);
INSERT INTO Filme_Diretor (id_filme, id_diretor) VALUES (24, 19);
INSERT INTO Filme_Ator (id_filme, id_ator) VALUES (24, 21);

INSERT INTO Filme (id_filme, titulo, tempo_duracao, ano, poster, id_linguagem, synopsis, rating, status) VALUES (25, 'Oldboy', '02:00:00', 2003, 'https://m.media-amazon.com/images/M/MV5BMTI3NTQyMzU5M15BMl5BanBnXkFtZTcwMTM2MjgyMQ@@._V1_FMjpg_UX1000_.jpg', 11, 'Depois de ser sequestrado e preso por 15 anos...', 8.4, 'APROVADO');
INSERT INTO Filme_Genero (id_filme, id_genero) VALUES (25, 14), (25, 1);
INSERT INTO Filme_Diretor (id_filme, id_diretor) VALUES (25, 20);
INSERT INTO Filme_Ator (id_filme, id_ator) VALUES (25, 22);

INSERT INTO Filme (id_filme, titulo, tempo_duracao, ano, poster, id_linguagem, synopsis, rating, status) VALUES (26, 'Cidade de Deus', '02:10:00', 2002, 'https://m.media-amazon.com/images/M/MV5BMGU5OWEwZDItMTNkYS00NTc5LThjMzYtYjYyYjIzYmViM2Q4XkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_FMjpg_UX1000_.jpg', 2, 'Dois jovens crescem em uma favela violenta do Rio de Janeiro...', 8.6, 'APROVADO');
INSERT INTO Filme_Genero (id_filme, id_genero) VALUES (26, 15), (26, 4);
INSERT INTO Filme_Diretor (id_filme, id_diretor) VALUES (26, 21);

INSERT INTO Filme (id_filme, titulo, tempo_duracao, ano, poster, id_linguagem, synopsis, rating, status) VALUES (27, 'De Volta para o Futuro', '01:56:00', 1985, 'https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_FMjpg_UX1000_.jpg', 1, 'Marty McFly é enviado acidentalmente trinta anos no passado...', 8.5, 'APROVADO');
INSERT INTO Filme_Genero (id_filme, id_genero) VALUES (27, 8), (27, 3);
INSERT INTO Filme_Diretor (id_filme, id_diretor) VALUES (27, 6);
INSERT INTO Filme_Ator (id_filme, id_ator) VALUES (27, 23);

INSERT INTO Filme (id_filme, titulo, tempo_duracao, ano, poster, id_linguagem, synopsis, rating, status) VALUES (28, 'O Iluminado', '02:26:00', 1980, 'https://m.media-amazon.com/images/M/MV5BZWFlYmY2MGEtZjVkYS00YzU4LTg0YjQtYzY1ZGE3NTA5NGQxXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_FMjpg_UX1000_.jpg', 1, 'Uma família vai para um hotel isolado para o inverno...', 8.4, 'APROVADO');
INSERT INTO Filme_Genero (id_filme, id_genero) VALUES (28, 5), (28, 4);
INSERT INTO Filme_Diretor (id_filme, id_diretor) VALUES (28, 22);
INSERT INTO Filme_Ator (id_filme, id_ator) VALUES (28, 24);

INSERT INTO Filme (id_filme, titulo, tempo_duracao, ano, poster, id_linguagem, synopsis, rating, status) VALUES (29, 'Bastardos Inglórios', '02:33:00', 2009, 'https://m.media-amazon.com/images/M/MV5BOTJiNDEzOWYtMTVjOC00ZjlmLWE0NGMtZmE1OWVmZDQ2OWJhXkEyXkFqcGdeQXVyNTIzOTk5ODM@._V1_FMjpg_UX1000_.jpg', 1, 'Na França ocupada pelos nazistas, um plano para assassinar...', 8.3, 'APROVADO');
INSERT INTO Filme_Genero (id_filme, id_genero) VALUES (29, 17), (29, 4), (29, 1);
INSERT INTO Filme_Diretor (id_filme, id_diretor) VALUES (29, 12);
INSERT INTO Filme_Ator (id_filme, id_ator) VALUES (29, 16), (29, 25);

INSERT INTO Filme (id_filme, titulo, tempo_duracao, ano, poster, id_linguagem, synopsis, rating, status) VALUES (30, 'Coringa', '02:02:00', 2019, 'https://m.media-amazon.com/images/M/MV5BNGVjNWI4ZGUtNzE0MS00YTJmLWE0ZDctN2ZiYTk2YmI3NTYyXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_FMjpg_UX1000_.jpg', 1, 'Em Gotham City, o comediante Arthur Fleck busca conexão...', 8.4, 'APROVADO');
INSERT INTO Filme_Genero (id_filme, id_genero) VALUES (30, 4), (30, 14), (30, 15);
INSERT INTO Filme_Diretor (id_filme, id_diretor) VALUES (30, 23);
INSERT INTO Filme_Ator (id_filme, id_ator) VALUES (30, 26);

SET FOREIGN_KEY_CHECKS = 1;
