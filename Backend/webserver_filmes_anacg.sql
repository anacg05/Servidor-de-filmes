-- 1. CRIAÇÃO DO BANCO DE DADOS
DROP DATABASE IF EXISTS webserver_filmes_anacg;
CREATE DATABASE webserver_filmes_anacg;
USE webserver_filmes_anacg;
 
-- 2. CRIAÇÃO DAS TABELAS

-- ATOR
CREATE TABLE Ator (
    id_ator INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    sobrenome VARCHAR(255)  NOT NULL,
    nacionalidade VARCHAR(255)
);

-- DIRETOR
CREATE TABLE Diretor (
    id_diretor INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    sobrenome VARCHAR(255),
    nacionalidade VARCHAR(255)
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
    poster TEXT,
    id_linguagem INT,
    synopsis TEXT,
    rating DECIMAL(3, 1),
    FOREIGN KEY (id_linguagem) REFERENCES Linguagem(id_linguagem)
);

-- TABELAS RELACIONADAS (JUNÇÃO)
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
 
-- 3. INSERÇÃO DE DADOS BÁSICOS (Linguagem, País, Gênero)

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

-- 4. POPULAÇÃO DOS 30 FILMES (Atores, Diretores e Filmes)
-- Desativar verificação de chaves estrangeiras temporariamente para inserção em massa
SET FOREIGN_KEY_CHECKS = 0;

-- INSERTS PARA ATORES
INSERT INTO Ator (id_ator, nome, sobrenome, nacionalidade) VALUES
(1, 'Cillian', 'Murphy', 'Irlandês'),
(2, 'Margot', 'Robbie', 'Australiana'),
(3, 'Keanu', 'Reeves', 'Canadense'),
(4, 'Leonardo', 'DiCaprio', 'Americano'),
(5, 'Timothée', 'Chalamet', 'Americano'),
(6, 'Tom', 'Hanks', 'Americano'),
(7, 'Morgan', 'Freeman', 'Americano'),
(8, 'Song', 'Kang-ho', 'Sul-coreano'),
(9, 'Anya', 'Taylor-Joy', 'Americana'),
(10, 'Florence', 'Pugh', 'Britânica'),
(11, 'Robert', 'Downey Jr.', 'Americano'),
(12, 'Christian', 'Bale', 'Britânico'),
(13, 'John', 'Travolta', 'Americano'),
(14, 'Samuel L.', 'Jackson', 'Americano'),
(15, 'Jodie', 'Foster', 'Americana'),
(16, 'Brad', 'Pitt', 'Americano'),
(17, 'Russell', 'Crowe', 'Neozelandês'),
(18, 'J.K.', 'Simmons', 'Americano'),
(19, 'Zendaya', '', 'Americana'),
(20, 'Ryan', 'Gosling', 'Canadense'),
(21, 'Audrey', 'Tautou', 'Francesa'),
(22, 'Choi', 'Min-sik', 'Sul-coreano'),
(23, 'Michael J.', 'Fox', 'Americano'),
(24, 'Jack', 'Nicholson', 'Americano'),
(25, 'Christoph', 'Waltz', 'Austríaco'),
(26, 'Joaquin', 'Phoenix', 'Americano');

-- INSERTS PARA DIRETORES
INSERT INTO Diretor (id_diretor, nome, sobrenome, nacionalidade) VALUES
(1, 'Christopher', 'Nolan', 'Britânico'),
(2, 'Greta', 'Gerwig', 'Americana'),
(3, 'Lana', 'Wachowski', 'Americana'),
(4, 'Martin', 'Scorsese', 'Americano'),
(5, 'Denis', 'Villeneuve', 'Canadense'),
(6, 'Robert', 'Zemeckis', 'Americano'),
(7, 'Frank', 'Darabont', 'Americano'),
(8, 'Bong', 'Joon-ho', 'Sul-coreano'),
(9, 'George', 'Miller', 'Australiano'),
(10, 'Hayao', 'Miyazaki', 'Japonês'),
(11, 'Francis Ford', 'Coppola', 'Americano'),
(12, 'Quentin', 'Tarantino', 'Americano'),
(13, 'Jonathan', 'Demme', 'Americano'),
(14, 'David', 'Fincher', 'Americano'),
(15, 'Ridley', 'Scott', 'Britânico'),
(16, 'Damien', 'Chazelle', 'Americano'),
(17, 'Makoto', 'Shinkai', 'Japonês'),
(18, 'Bob', 'Persichetti', 'Americano'),
(19, 'Jean-Pierre', 'Jeunet', 'Francês'),
(20, 'Park', 'Chan-wook', 'Sul-coreano'),
(21, 'Fernando', 'Meirelles', 'Brasileiro'),
(22, 'Stanley', 'Kubrick', 'Americano'),
(23, 'Todd', 'Phillips', 'Americano');

-- INSERTS PARA FILMES (E RELACIONAMENTOS)

-- Filme 1: Oppenheimer
INSERT INTO Filme (id_filme, titulo, tempo_duracao, ano, poster, id_linguagem, synopsis, rating) VALUES
(1, 'Oppenheimer', '03:00:00', 2023, 'https://m.media-amazon.com/images/M/MV5BMDEzNDdjYTctNjA4ZS00YjVlLTg0MzctYTkzMjFkNTRmODgzXkEyXkFqcGdeQXVyMTM1MTE1NDMx._V1_FMjpg_UX1000_.jpg', 1, 'A história do físico americano J. Robert Oppenheimer, seu papel no Projeto Manhattan e no desenvolvimento da bomba atômica.', 8.6);
INSERT INTO Filme_Genero (id_filme, id_genero) VALUES (1, 20), (1, 4), (1, 16);
INSERT INTO Filme_Diretor (id_filme, id_diretor) VALUES (1, 1);
INSERT INTO Filme_Ator (id_filme, id_ator) VALUES (1, 1), (1, 10), (1, 11);

-- Filme 2: Barbie
INSERT INTO Filme (id_filme, titulo, tempo_duracao, ano, poster, id_linguagem, synopsis, rating) VALUES
(2, 'Barbie', '01:54:00', 2023, 'https://m.media-amazon.com/images/M/MV5BNjU3N2QxNzYtMWMyNC00NmMyLWEAWjctM2QxNTI3MGYxZjA3XkEyXkFqcGdeQXVyMTM1MTE1NDMx._V1_FMjpg_UX1000_.jpg', 1, 'Barbie sofre uma crise que a leva a questionar seu mundo e sua existência.', 6.9);
INSERT INTO Filme_Genero (id_filme, id_genero) VALUES (2, 3), (2, 10);
INSERT INTO Filme_Diretor (id_filme, id_diretor) VALUES (2, 2);
INSERT INTO Filme_Ator (id_filme, id_ator) VALUES (2, 2), (2, 20);

-- Filme 3: The Matrix
INSERT INTO Filme (id_filme, titulo, tempo_duracao, ano, poster, id_linguagem, synopsis, rating) VALUES
(3, 'The Matrix', '02:16:00', 1999, 'https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_FMjpg_UX1000_.jpg', 1, 'Um hacker descobre a verdade chocante sobre sua realidade e seu papel na guerra contra seus controladores.', 8.7);
INSERT INTO Filme_Genero (id_filme, id_genero) VALUES (3, 1), (3, 8);
INSERT INTO Filme_Diretor (id_filme, id_diretor) VALUES (3, 3);
INSERT INTO Filme_Ator (id_filme, id_ator) VALUES (3, 3);

-- Filme 4: Inception (A Origem)
INSERT INTO Filme (id_filme, titulo, tempo_duracao, ano, poster, id_linguagem, synopsis, rating) VALUES
(4, 'A Origem', '02:28:00', 2010, 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_FMjpg_UX1000_.jpg', 1, 'Um ladrão que rouba segredos corporativos através do uso da tecnologia de compartilhamento de sonhos.', 8.8);
INSERT INTO Filme_Genero (id_filme, id_genero) VALUES (4, 1), (4, 8), (4, 14);
INSERT INTO Filme_Diretor (id_filme, id_diretor) VALUES (4, 1);
INSERT INTO Filme_Ator (id_filme, id_ator) VALUES (4, 4), (4, 1);

-- Filme 5: Duna: Parte 2
INSERT INTO Filme (id_filme, titulo, tempo_duracao, ano, poster, id_linguagem, synopsis, rating) VALUES
(5, 'Duna: Parte 2', '02:46:00', 2024, 'https://m.media-amazon.com/images/M/MV5BODdjMjM3NGQtZDA5OC00NGE4LWIzY2MtOTA0MWNlM2M0N2Y3XkEyXkFqcGdeQXVyODE5NzE3OTE@._V1_FMjpg_UX1000_.jpg', 1, 'Paul Atreides se une a Chani e aos Fremen enquanto busca vingança contra os conspiradores que destruíram sua família.', 8.9);
INSERT INTO Filme_Genero (id_filme, id_genero) VALUES (5, 8), (5, 1);
INSERT INTO Filme_Diretor (id_filme, id_diretor) VALUES (5, 5);
INSERT INTO Filme_Ator (id_filme, id_ator) VALUES (5, 5), (5, 19);

-- Filme 6: Forrest Gump
INSERT INTO Filme (id_filme, titulo, tempo_duracao, ano, poster, id_linguagem, synopsis, rating) VALUES
(6, 'Forrest Gump', '02:22:00', 1994, 'https://m.media-amazon.com/images/M/MV5BNWIwODRlZTUtY2U3ZS00Yzg1LWJhNzYtMmZiYmEyNmU1NjMzXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_FMjpg_UX1000_.jpg', 1, 'A história das décadas de 1950 a 1970 através da perspectiva de um homem do Alabama com um QI baixo.', 8.8);
INSERT INTO Filme_Genero (id_filme, id_genero) VALUES (6, 4), (6, 7);
INSERT INTO Filme_Diretor (id_filme, id_diretor) VALUES (6, 6);
INSERT INTO Filme_Ator (id_filme, id_ator) VALUES (6, 6);

-- Filme 7: Um Sonho de Liberdade
INSERT INTO Filme (id_filme, titulo, tempo_duracao, ano, poster, id_linguagem, synopsis, rating) VALUES
(7, 'Um Sonho de Liberdade', '02:22:00', 1994, 'https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MDBjZTVkXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_FMjpg_UX1000_.jpg', 1, 'Dois homens presos se unem ao longo de vários anos, encontrando consolo e eventual redenção através de atos de decência comum.', 9.3);
INSERT INTO Filme_Genero (id_filme, id_genero) VALUES (7, 4);
INSERT INTO Filme_Diretor (id_filme, id_diretor) VALUES (7, 7);
INSERT INTO Filme_Ator (id_filme, id_ator) VALUES (7, 7);

-- Filme 8: Parasita
INSERT INTO Filme (id_filme, titulo, tempo_duracao, ano, poster, id_linguagem, synopsis, rating) VALUES
(8, 'Parasita', '02:12:00', 2019, 'https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDMtZTI4YThkYTYiMGI3XkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_FMjpg_UX1000_.jpg', 11, 'A ganância e a discriminação de classe ameaçam o relacionamento simbiótico recém-formado entre a rica família Park e a pobre família Kim.', 8.5);
INSERT INTO Filme_Genero (id_filme, id_genero) VALUES (8, 14), (8, 4), (8, 3);
INSERT INTO Filme_Diretor (id_filme, id_diretor) VALUES (8, 8);
INSERT INTO Filme_Ator (id_filme, id_ator) VALUES (8, 8);

-- Filme 9: Mad Max: Estrada da Fúria
INSERT INTO Filme (id_filme, titulo, tempo_duracao, ano, poster, id_linguagem, synopsis, rating) VALUES
(9, 'Mad Max: Estrada da Fúria', '02:00:00', 2015, 'https://m.media-amazon.com/images/M/MV5BN2EwM2I5OWMtMGQyMi00ZTE4LThjNDgtZTkxNTY1NjYyMzY2XkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_FMjpg_UX1000_.jpg', 1, 'Em um deserto pós-apocalíptico, uma mulher se rebela contra um governante tirânico em busca de sua terra natal.', 8.1);
INSERT INTO Filme_Genero (id_filme, id_genero) VALUES (9, 1), (9, 8);
INSERT INTO Filme_Diretor (id_filme, id_diretor) VALUES (9, 9);
INSERT INTO Filme_Ator (id_filme, id_ator) VALUES (9, 9);

-- Filme 10: A Viagem de Chihiro
INSERT INTO Filme (id_filme, titulo, tempo_duracao, ano, poster, id_linguagem, synopsis, rating) VALUES
(10, 'A Viagem de Chihiro', '02:05:00', 2001, 'https://m.media-amazon.com/images/M/MV5BMjlmZmI5MDctNDE2YS00YWE0LWE5ZWItZDBhYWQ0NTcxNWRhXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_FMjpg_UX1000_.jpg', 7, 'Durante a mudança para um novo bairro, uma menina de 10 anos vagueia por um mundo governado por deuses, bruxas e espíritos.', 8.6);
INSERT INTO Filme_Genero (id_filme, id_genero) VALUES (10, 11), (10, 10);
INSERT INTO Filme_Diretor (id_filme, id_diretor) VALUES (10, 10);

-- Filme 11: O Poderoso Chefão
INSERT INTO Filme (id_filme, titulo, tempo_duracao, ano, poster, id_linguagem, synopsis, rating) VALUES
(11, 'O Poderoso Chefão', '02:55:00', 1972, 'https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_FMjpg_UX1000_.jpg', 1, 'O patriarca idoso de uma dinastia do crime organizado transfere o controle de seu império clandestino para seu filho relutante.', 9.2);
INSERT INTO Filme_Genero (id_filme, id_genero) VALUES (11, 15), (11, 4);
INSERT INTO Filme_Diretor (id_filme, id_diretor) VALUES (11, 11);

-- Filme 12: Pulp Fiction
INSERT INTO Filme (id_filme, titulo, tempo_duracao, ano, poster, id_linguagem, synopsis, rating) VALUES
(12, 'Pulp Fiction', '02:34:00', 1994, 'https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_FMjpg_UX1000_.jpg', 1, 'As vidas de dois assassinos da máfia, um boxeador, a esposa de um gângster e um casal de bandidos se entrelaçam.', 8.9);
INSERT INTO Filme_Genero (id_filme, id_genero) VALUES (12, 15), (12, 4);
INSERT INTO Filme_Diretor (id_filme, id_diretor) VALUES (12, 12);
INSERT INTO Filme_Ator (id_filme, id_ator) VALUES (12, 13), (12, 14);

-- Filme 13: Batman: O Cavaleiro das Trevas
INSERT INTO Filme (id_filme, titulo, tempo_duracao, ano, poster, id_linguagem, synopsis, rating) VALUES
(13, 'Batman: O Cavaleiro das Trevas', '02:32:00', 2008, 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_FMjpg_UX1000_.jpg', 1, 'Quando a ameaça conhecida como Coringa emerge, Batman deve aceitar um dos maiores testes psicológicos de sua vida.', 9.0);
INSERT INTO Filme_Genero (id_filme, id_genero) VALUES (13, 1), (13, 15), (13, 4);
INSERT INTO Filme_Diretor (id_filme, id_diretor) VALUES (13, 1);
INSERT INTO Filme_Ator (id_filme, id_ator) VALUES (13, 12);

-- Filme 14: Interestelar
INSERT INTO Filme (id_filme, titulo, tempo_duracao, ano, poster, id_linguagem, synopsis, rating) VALUES
(14, 'Interestelar', '02:49:00', 2014, 'https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_FMjpg_UX1000_.jpg', 1, 'Uma equipe de exploradores viaja através de um buraco de minhoca no espaço na tentativa de garantir a sobrevivência da humanidade.', 8.7);
INSERT INTO Filme_Genero (id_filme, id_genero) VALUES (14, 8), (14, 4);
INSERT INTO Filme_Diretor (id_filme, id_diretor) VALUES (14, 1);
INSERT INTO Filme_Ator (id_filme, id_ator) VALUES (14, 9);

-- Filme 15: O Silêncio dos Inocentes
INSERT INTO Filme (id_filme, titulo, tempo_duracao, ano, poster, id_linguagem, synopsis, rating) VALUES
(15, 'O Silêncio dos Inocentes', '01:58:00', 1991, 'https://m.media-amazon.com/images/M/MV5BNjNhZTk0ZmEtNjJhMi00YzFlLWE1MmEtYzM1M2ZmMGMwMTU4XkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_FMjpg_UX1000_.jpg', 1, 'Uma jovem estagiária do FBI deve procurar a ajuda de um assassino canibal manipulador para capturar outro serial killer.', 8.6);
INSERT INTO Filme_Genero (id_filme, id_genero) VALUES (15, 14), (15, 15), (15, 4);
INSERT INTO Filme_Diretor (id_filme, id_diretor) VALUES (15, 13);
INSERT INTO Filme_Ator (id_filme, id_ator) VALUES (15, 15);

-- Filme 16: Se7en - Os Sete Crimes Capitais
INSERT INTO Filme (id_filme, titulo, tempo_duracao, ano, poster, id_linguagem, synopsis, rating) VALUES
(16, 'Se7en', '02:07:00', 1995, 'https://m.media-amazon.com/images/M/MV5BOTUwODM5MTctZjczMi00OTk4LTg3NWUtNmVhMTAzNTNjYjcyXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_FMjpg_UX1000_.jpg', 1, 'Dois detetives caçam um serial killer que usa os sete pecados capitais como seus motivos.', 8.6);
INSERT INTO Filme_Genero (id_filme, id_genero) VALUES (16, 14), (16, 15);
INSERT INTO Filme_Diretor (id_filme, id_diretor) VALUES (16, 14);
INSERT INTO Filme_Ator (id_filme, id_ator) VALUES (16, 16), (16, 7);

-- Filme 17: Gladiador
INSERT INTO Filme (id_filme, titulo, tempo_duracao, ano, poster, id_linguagem, synopsis, rating) VALUES
(17, 'Gladiador', '02:35:00', 2000, 'https://m.media-amazon.com/images/M/MV5BMDliMmNhNDEtODUyOS00MjNlLTgxODEtN2U3NzIxMGVkZTA1L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_FMjpg_UX1000_.jpg', 1, 'Um general romano traído é forçado a se tornar um gladiador, e sua busca por vingança o leva a desafiar o imperador.', 8.5);
INSERT INTO Filme_Genero (id_filme, id_genero) VALUES (17, 1), (17, 4), (17, 16);
INSERT INTO Filme_Diretor (id_filme, id_diretor) VALUES (17, 15);
INSERT INTO Filme_Ator (id_filme, id_ator) VALUES (17, 17), (17, 26);

-- Filme 18: Whiplash
INSERT INTO Filme (id_filme, titulo, tempo_duracao, ano, poster, id_linguagem, synopsis, rating) VALUES
(18, 'Whiplash', '01:46:00', 2014, 'https://m.media-amazon.com/images/M/MV5BOTA5NDZlZGUtMjAxOS00YTRkLTkwYmMtYWQ0NWEwZDZiNjEzXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_FMjpg_UX1000_.jpg', 1, 'Um jovem baterista de jazz promissor é levado ao limite por seu instrutor abusivo.', 8.5);
INSERT INTO Filme_Genero (id_filme, id_genero) VALUES (18, 4), (18, 13);
INSERT INTO Filme_Diretor (id_filme, id_diretor) VALUES (18, 16);
INSERT INTO Filme_Ator (id_filme, id_ator) VALUES (18, 18);

-- Filme 19: Your Name
INSERT INTO Filme (id_filme, titulo, tempo_duracao, ano, poster, id_linguagem, synopsis, rating) VALUES
(19, 'Your Name', '01:46:00', 2016, 'https://m.media-amazon.com/images/M/MV5BODRmZGY5NTgtStopY2YyLWFkYjYtNWU1OTY1NTEyZDFmXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_FMjpg_UX1000_.jpg', 7, 'Dois estranhos se veem misteriosamente trocando de corpo.', 8.4);
INSERT INTO Filme_Genero (id_filme, id_genero) VALUES (19, 11), (19, 7), (19, 10);
INSERT INTO Filme_Diretor (id_filme, id_diretor) VALUES (19, 17);

-- Filme 20: Homem-Aranha no Aranhaverso
INSERT INTO Filme (id_filme, titulo, tempo_duracao, ano, poster, id_linguagem, synopsis, rating) VALUES
(20, 'Homem-Aranha no Aranhaverso', '01:57:00', 2018, 'https://m.media-amazon.com/images/M/MV5BMjMwNDkxMTgzOF5BMl5BanBnXkFtZTgwNTkwNTQ3NjM@._V1_FMjpg_UX1000_.jpg', 1, 'O adolescente Miles Morales se torna o Homem-Aranha de sua realidade, cruzando seu caminho com cinco contrapartes de outras dimensões.', 8.4);
INSERT INTO Filme_Genero (id_filme, id_genero) VALUES (20, 11), (20, 1), (20, 3);
INSERT INTO Filme_Diretor (id_filme, id_diretor) VALUES (20, 18);

-- Filme 21: O Lobo de Wall Street
INSERT INTO Filme (id_filme, titulo, tempo_duracao, ano, poster, id_linguagem, synopsis, rating) VALUES
(21, 'O Lobo de Wall Street', '03:00:00', 2013, 'https://m.media-amazon.com/images/M/MV5BMjIxMjgxNTk0MF5BMl5BanBnXkFtZTgwNjIyOTg2MDE@._V1_FMjpg_UX1000_.jpg', 1, 'Baseado na história de Jordan Belfort, desde sua ascensão como corretor da bolsa até sua queda envolvendo crime e corrupção.', 8.2);
INSERT INTO Filme_Genero (id_filme, id_genero) VALUES (21, 20), (21, 3), (21, 15);
INSERT INTO Filme_Diretor (id_filme, id_diretor) VALUES (21, 4);
INSERT INTO Filme_Ator (id_filme, id_ator) VALUES (21, 4), (21, 2);

-- Filme 22: Alien, o Oitavo Passageiro
INSERT INTO Filme (id_filme, titulo, tempo_duracao, ano, poster, id_linguagem, synopsis, rating) VALUES
(22, 'Alien', '01:57:00', 1979, 'https://m.media-amazon.com/images/M/MV5BOGQzZTBjMjQtOTVmMS00NGE5LWEyYmMtOGQ1ZGZjNmRkYjFhXkEyXkFqcGdeQXVyMjUzOTY1NTc@._V1_FMjpg_UX1000_.jpg', 1, 'A tripulação de uma nave espacial comercial é atacada por uma forma de vida extraterrestre mortal.', 8.5);
INSERT INTO Filme_Genero (id_filme, id_genero) VALUES (22, 8), (22, 5);
INSERT INTO Filme_Diretor (id_filme, id_diretor) VALUES (22, 15);

-- Filme 23: Blade Runner 2049
INSERT INTO Filme (id_filme, titulo, tempo_duracao, ano, poster, id_linguagem, synopsis, rating) VALUES
(23, 'Blade Runner 2049', '02:44:00', 2017, 'https://m.media-amazon.com/images/M/MV5BNzA1Njg4NzYxOV5BMl5BanBnXkFtZTgwODk5NjU3MzI@._V1_FMjpg_UX1000_.jpg', 1, 'Um jovem Blade Runner descobre um segredo há muito enterrado que o leva a encontrar o ex-Blade Runner Rick Deckard.', 8.0);
INSERT INTO Filme_Genero (id_filme, id_genero) VALUES (23, 8), (23, 14);
INSERT INTO Filme_Diretor (id_filme, id_diretor) VALUES (23, 5);
INSERT INTO Filme_Ator (id_filme, id_ator) VALUES (23, 20);

-- Filme 24: O Fabuloso Destino de Amélie Poulain
INSERT INTO Filme (id_filme, titulo, tempo_duracao, ano, poster, id_linguagem, synopsis, rating) VALUES
(24, 'O Fabuloso Destino de Amélie Poulain', '02:02:00', 2001, 'https://m.media-amazon.com/images/M/MV5BNDg4NjM1YjMtYmNhZC00MjM0LWFiZmYtNGY1YjA3MzZmODc5XkEyXkFqcGdeQXVyNDk3NzU2MTQ@._V1_FMjpg_UX1000_.jpg', 4, 'Amélie é uma garçonete parisiense que decide mudar o mundo secretamente, melhorando a vida daqueles ao seu redor.', 8.3);
INSERT INTO Filme_Genero (id_filme, id_genero) VALUES (24, 3), (24, 7);
INSERT INTO Filme_Diretor (id_filme, id_diretor) VALUES (24, 19);
INSERT INTO Filme_Ator (id_filme, id_ator) VALUES (24, 21);

-- Filme 25: Oldboy
INSERT INTO Filme (id_filme, titulo, tempo_duracao, ano, poster, id_linguagem, synopsis, rating) VALUES
(25, 'Oldboy', '02:00:00', 2003, 'https://m.media-amazon.com/images/M/MV5BMTI3NTQyMzU5M15BMl5BanBnXkFtZTcwMTM2MjgyMQ@@._V1_FMjpg_UX1000_.jpg', 11, 'Depois de ser sequestrado e preso por 15 anos, Oh Dae-Su é libertado e busca vingança contra seu captor.', 8.4);
INSERT INTO Filme_Genero (id_filme, id_genero) VALUES (25, 14), (25, 1);
INSERT INTO Filme_Diretor (id_filme, id_diretor) VALUES (25, 20);
INSERT INTO Filme_Ator (id_filme, id_ator) VALUES (25, 22);

-- Filme 26: Cidade de Deus
INSERT INTO Filme (id_filme, titulo, tempo_duracao, ano, poster, id_linguagem, synopsis, rating) VALUES
(26, 'Cidade de Deus', '02:10:00', 2002, 'https://m.media-amazon.com/images/M/MV5BMGU5OWEwZDItMTNkYS00NTc5LThjMzYtYjYyYjIzYmViM2Q4XkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_FMjpg_UX1000_.jpg', 2, 'Dois jovens crescem em uma favela violenta do Rio de Janeiro, mas seguem caminhos diferentes na vida.', 8.6);
INSERT INTO Filme_Genero (id_filme, id_genero) VALUES (26, 15), (26, 4);
INSERT INTO Filme_Diretor (id_filme, id_diretor) VALUES (26, 21);

-- Filme 27: De Volta para o Futuro
INSERT INTO Filme (id_filme, titulo, tempo_duracao, ano, poster, id_linguagem, synopsis, rating) VALUES
(27, 'De Volta para o Futuro', '01:56:00', 1985, 'https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_FMjpg_UX1000_.jpg', 1, 'Marty McFly é enviado acidentalmente trinta anos no passado em uma máquina do tempo inventada por seu amigo.', 8.5);
INSERT INTO Filme_Genero (id_filme, id_genero) VALUES (27, 8), (27, 3);
INSERT INTO Filme_Diretor (id_filme, id_diretor) VALUES (27, 6);
INSERT INTO Filme_Ator (id_filme, id_ator) VALUES (27, 23);

-- Filme 28: O Iluminado
INSERT INTO Filme (id_filme, titulo, tempo_duracao, ano, poster, id_linguagem, synopsis, rating) VALUES
(28, 'O Iluminado', '02:26:00', 1980, 'https://m.media-amazon.com/images/M/MV5BZWFlYmY2MGEtZjVkYS00YzU4LTg0YjQtYzY1ZGE3NTA5NGQxXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_FMjpg_UX1000_.jpg', 1, 'Uma família vai para um hotel isolado para o inverno, onde uma presença sinistra influencia o pai à violência.', 8.4);
INSERT INTO Filme_Genero (id_filme, id_genero) VALUES (28, 5), (28, 4);
INSERT INTO Filme_Diretor (id_filme, id_diretor) VALUES (28, 22);
INSERT INTO Filme_Ator (id_filme, id_ator) VALUES (28, 24);

-- Filme 29: Bastardos Inglórios
INSERT INTO Filme (id_filme, titulo, tempo_duracao, ano, poster, id_linguagem, synopsis, rating) VALUES
(29, 'Bastardos Inglórios', '02:33:00', 2009, 'https://m.media-amazon.com/images/M/MV5BOTJiNDEzOWYtMTVjOC00ZjlmLWE0NGMtZmE1OWVmZDQ2OWJhXkEyXkFqcGdeQXVyNTIzOTk5ODM@._V1_FMjpg_UX1000_.jpg', 1, 'Na França ocupada pelos nazistas, um plano para assassinar líderes nazistas por um grupo de soldados judeus coincide com os planos de uma dona de cinema.', 8.3);
INSERT INTO Filme_Genero (id_filme, id_genero) VALUES (29, 17), (29, 4), (29, 1);
INSERT INTO Filme_Diretor (id_filme, id_diretor) VALUES (29, 12);
INSERT INTO Filme_Ator (id_filme, id_ator) VALUES (29, 16), (29, 25);

-- Filme 30: Coringa
INSERT INTO Filme (id_filme, titulo, tempo_duracao, ano, poster, id_linguagem, synopsis, rating) VALUES
(30, 'Coringa', '02:02:00', 2019, 'https://m.media-amazon.com/images/M/MV5BNGVjNWI4ZGUtNzE0MS00YTJmLWE0ZDctN2ZiYTk2YmI3NTYyXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_FMjpg_UX1000_.jpg', 1, 'Em Gotham City, o comediante Arthur Fleck busca conexão enquanto caminha por uma sociedade conturbada.', 8.4);
INSERT INTO Filme_Genero (id_filme, id_genero) VALUES (30, 4), (30, 14), (30, 15);
INSERT INTO Filme_Diretor (id_filme, id_diretor) VALUES (30, 23);
INSERT INTO Filme_Ator (id_filme, id_ator) VALUES (30, 26);


-- Reativar a verificação de chaves estrangeiras
SET FOREIGN_KEY_CHECKS = 1;