-- DROP DATABASE webserver_filmes_anacg

/* 1. CRIAÇÃO DO BANCO DE DADOS */
CREATE DATABASE webserver_filmes_anacg;
USE webserver_filmes_anacg;
 
/* 2. CRIAÇÃO DAS TABELAS */

CREATE TABLE Ator (
    id_ator INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    sobrenome VARCHAR(255)  NOT NULL,
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


CREATE TABLE Filme (
    id_filme INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    tempo_duracao TIME,
    ano YEAR,
    poster TEXT,
    id_linguagem INT,
    synopsis TEXT,
    rating DECIMAL(3, 1),
    status VARCHAR(20) NOT NULL DEFAULT 'APROVADO',
    id_filme_original INT NULL DEFAULT NULL,
    FOREIGN KEY (id_linguagem) REFERENCES Linguagem(id_linguagem)
);

/* TABELAS RELACIONADAS (JUNÇÃO) */
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
 
/* 3. INSERÇÃO DE DADOS BÁSICOS (Linguagem, País, Gênero) */

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

SET FOREIGN_KEY_CHECKS = 0;

/* INSERINDO DIRETORES (IDs 1-34) */
INSERT INTO Diretor (id_diretor, nome, sobrenome, nacionalidade) VALUES
(1, 'Chad', 'Stahelski', 'Americano'),
(2, 'David', 'Leitch', 'Americano'),
(3, 'Christian', 'Zübert', 'Alemão'),
(4, 'Jordan', 'Peele', 'Americano'),
(5, 'James', 'Wan', 'Malaio'),
(6, 'Simon', 'Stone', 'Australiano'),
(7, 'James', 'DeMonaco', 'Americano'),
(8, 'Joseph', 'Kosinski', 'Americano'),
(9, 'Joss', 'Whedon', 'Americano'),
(10, 'Guy', 'Ritchie', 'Britânico'),
(11, 'M. Night', 'Shyamalan', 'Indiano'),
(12, 'David', 'Ayer', 'Americano'),
(13, 'Andy', 'Muschietti', 'Argentino'),
(14, 'William', 'Friedkin', 'Americano'),
(15, 'Gore', 'Verbinski', 'Americano'),
(16, 'Jennifer', 'Kent', 'Australiana'),
(17, 'John R.', 'Leonetti', 'Americano'),
(18, 'Steven', 'Spielberg', 'Americano'),
(19, 'Pete', 'Docter', 'Americano'),
(20, 'Bob', 'Peterson', 'Americano'),
(21, 'Carlos', 'Saldanha', 'Brasileiro'),
(22, 'Eric', 'Darnell', 'Americano'),
(23, 'Tom', 'McGrath', 'Americano'),
(24, 'Christopher', 'McQuarrie', 'Americano'),
(25, 'Gavin', 'O''Connor', 'Americano'),
(26, 'Pierre', 'Morel', 'Francês'),
(27, 'Drew', 'Goddard', 'Americano'),
(28, 'Corin', 'Hardy', 'Britânico'),
(29, 'Byron', 'Howard', 'Americano'),
(30, 'Nathan', 'Greno', 'Americano'),
(31, 'Ron', 'Clements', 'Americano'),
(32, 'John', 'Musker', 'Americano'),
(33, 'Christopher', 'Nolan', 'Britânico'),
(34, 'Jonathan', 'Demme', 'Americano');

/* INSERINDO ATORES (IDs 1-73) */
INSERT INTO Ator (id_ator, nome, sobrenome, nacionalidade) VALUES
(1, 'Keanu', 'Reeves', 'Canadense'),
(2, 'Willem', 'Dafoe', 'Americano'),
(3, 'Jeanne', 'Goursaud', 'Alemã'),
(4, 'Dougray', 'Scott', 'Escocês'),
(5, 'Daniel', 'Kaluuya', 'Britânico'),
(6, 'Allison', 'Williams', 'Americana'),
(7, 'Vera', 'Farmiga', 'Americana'),
(8, 'Patrick', 'Wilson', 'Americano'),
(9, 'Keira', 'Knightley', 'Britânica'),
(10, 'Guy', 'Pearce', 'Australiano'),
(11, 'Hannah', 'Waddingham', 'Britânica'),
(12, 'Frank', 'Grillo', 'Americano'),
(13, 'Carmen', 'Ejogo', 'Britânica'),
(14, 'Tom', 'Cruise', 'Americano'),
(15, 'Miles', 'Teller', 'Americano'),
(16, 'Jennifer', 'Connelly', 'Americana'),
(17, 'Robert', 'Downey Jr.', 'Americano'),
(18, 'Chris', 'Evans', 'Americano'),
(19, 'Scarlett', 'Johansson', 'Americana'),
(20, 'Samuel L.', 'Jackson', 'Americano'),
(21, 'Jason', 'Statham', 'Britânico'),
(22, 'Josh', 'Hartnett', 'Americano'),
(23, 'Scott', 'Eastwood', 'Americano'),
(24, 'James', 'McAvoy', 'Escocês'),
(25, 'Anya', 'Taylor-Joy', 'Americana'),
(26, 'Betty', 'Buckley', 'Americana'),
(27, 'Josh', 'Hutcherson', 'Americano'),
(28, 'Jeremy', 'Irons', 'Britânico'),
(29, 'Bill', 'Skarsgård', 'Sueco'),
(30, 'Jaeden', 'Martell', 'Americano'),
(31, 'Finn', 'Wolfhard', 'Canadense'),
(32, 'Linda', 'Blair', 'Americana'),
(33, 'Ellen', 'Burstyn', 'Americana'),
(34, 'Max', 'von Sydow', 'Sueco'),
(35, 'Naomi', 'Watts', 'Britânica'),
(36, 'Martin', 'Henderson', 'Neozelandês'),
(37, 'Essie', 'Davis', 'Australiana'),
(38, 'Noah', 'Wiseman', 'Australiano'),
(39, 'Annabelle', 'Wallis', 'Britânica'),
(40, 'Ward', 'Horton', 'Americano'),
(41, 'Sam', 'Neill', 'Neozelandês'),
(42, 'Laura', 'Dern', 'Americana'),
(43, 'Jeff', 'Goldblum', 'Americano'),
(44, 'Edward', 'Asner', 'Americano'),
(45, 'Christopher', 'Plummer', 'Canadense'),
(46, 'Jesse', 'Eisenberg', 'Americano'),
(47, 'Anne', 'Hathaway', 'Americana'),
(48, 'Ben', 'Stiller', 'Americano'),
(49, 'Chris', 'Rock', 'Americano'),
(50, 'David', 'Schwimmer', 'Americano'),
(51, 'Rosamund', 'Pike', 'Britânica'),
(52, 'Richard', 'Jenkins', 'Americano'),
(53, 'Ben', 'Affleck', 'Americano'),
(54, 'Anna', 'Kendrick', 'Americana'),
(55, 'J.K.', 'Simmons', 'Americano'),
(56, 'Liam', 'Neeson', 'Norte-irlandês'),
(57, 'Maggie', 'Grace', 'Americana'),
(58, 'Famke', 'Janssen', 'Holandesa'),
(59, 'Kristen', 'Connolly', 'Americana'),
(60, 'Fran', 'Kranz', 'Americano'),
(61, 'Taissa', 'Farmiga', 'Americana'),
(62, 'Demián', 'Bichir', 'Mexicano'),
(63, 'Bonnie', 'Aarons', 'Americana'),
(64, 'Mandy', 'Moore', 'Americana'),
(65, 'Zachary', 'Levi', 'Americano'),
(66, 'Anika', 'Noni Rose', 'Americana'),
(67, 'Bruno', 'Campos', 'Brasileiro'),
(68, 'Cillian', 'Murphy', 'Irlandês'),
(69, 'Florence', 'Pugh', 'Britânica'),
(70, 'Matthew', 'McConaughey', 'Americano'),
(71, 'Jessica', 'Chastain', 'Americana'),
(72, 'Jodie', 'Foster', 'Americana'),
(73, 'Anthony', 'Hopkins', 'Britânico');

/* Filme 1: John Wick de volta ao jogo */
INSERT INTO Filme (id_filme, titulo, tempo_duracao, ano, poster, id_linguagem, synopsis, rating, status) VALUES (1, 'John Wick - De Volta ao Jogo', '01:41:00', 2014, 'https://m.media-amazon.com/images/M/MV5BMTU2NjA1ODgzMF5BMl5BanBnXkFtZTgwMTM2MTI4MjE@._V1_FMjpg_UX1000_.jpg', 1, 'John Wick (Keanu Reeves) é forçado a voltar à ação quando um criminoso rouba seu carro e mata seu cachorro, um presente de sua falecida esposa.', 7.4, 'APROVADO');
INSERT INTO Filme_Genero (id_filme, id_genero) VALUES (1, 1), (1, 14), (1, 15);
INSERT INTO Filme_Diretor (id_filme, id_diretor) VALUES (1, 1), (1, 2);
INSERT INTO Filme_Ator (id_filme, id_ator) VALUES (1, 1), (1, 2);

/* Filme 2: Exterritorial */
INSERT INTO Filme (id_filme, titulo, tempo_duracao, ano, poster, id_linguagem, synopsis, rating, status) VALUES (2, 'Exterritorial', '01:32:00', 2025, 'https://m.media-amazon.com/images/M/MV5BYjVkMzI2MjAtYzA3NC00OGE1LWEyZDMtODc0YTc5NTZjYzFiXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg', 5, 'Sara, uma ex-militar, visita a embaixada dos EUA na Alemanha com seu filho. Após o menino desaparecer, ela precisa lutar para encontrá-lo.', 3.9, 'APROVADO');
INSERT INTO Filme_Genero (id_filme, id_genero) VALUES (2, 1), (2, 14), (2, 4);
INSERT INTO Filme_Diretor (id_filme, id_diretor) VALUES (2, 3);
INSERT INTO Filme_Ator (id_filme, id_ator) VALUES (2, 3), (2, 4);

/* Filme 3: Corra */
INSERT INTO Filme (id_filme, titulo, tempo_duracao, ano, poster, id_linguagem, synopsis, rating, status) VALUES (3, 'Corra!', '01:44:00', 2017, 'https://br.web.img3.acsta.net/pictures/17/04/19/21/08/577190.jpg', 1, 'Chris (Daniel Kaluuya) é um jovem negro que vai conhecer os pais de sua namorada branca. Ao chegar lá, ele descobre um segredo sombrio.', 7.7, 'APROVADO');
INSERT INTO Filme_Genero (id_filme, id_genero) VALUES (3, 5), (3, 6), (3, 9);
INSERT INTO Filme_Diretor (id_filme, id_diretor) VALUES (3, 4);
INSERT INTO Filme_Ator (id_filme, id_ator) VALUES (3, 5), (3, 6);

/* Filme 4: Invocação do mal */
INSERT INTO Filme (id_filme, titulo, tempo_duracao, ano, poster, id_linguagem, synopsis, rating, status) VALUES (4, 'Invocação do Mal', '01:52:00', 2013, 'data:image/jpeg;base64,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', 1, 'Os demonologistas Ed e Lorraine Warren investigam a família Perron, assombrada por uma entidade demoníaca em sua casa de campo.', 7.5, 'APROVADO');
INSERT INTO Filme_Genero (id_filme, id_genero) VALUES (4, 5), (4, 6), (4, 9);
INSERT INTO Filme_Diretor (id_filme, id_diretor) VALUES (4, 5);
INSERT INTO Filme_Ator (id_filme, id_ator) VALUES (4, 7), (4, 8);

/* Filme 5: A mulher da cabine 10 */
INSERT INTO Filme (id_filme, titulo, tempo_duracao, ano, poster, id_linguagem, synopsis, rating, status) VALUES (5, 'A Mulher na Cabine 10', '01:32:00', 2025, 'https://br.web.img2.acsta.net/img/14/fb/14fbd8437590db955d4a3f5d3cb58928.jpg', 1, 'A bordo de um iate de luxo, uma jornalista vê uma pessoa caindo no mar, mas ninguém acredita. Para descobrir a verdade, ela coloca a própria vida em risco.', 6.5, 'APROVADO');
INSERT INTO Filme_Genero (id_filme, id_genero) VALUES (5, 9), (5, 14), (5, 18);
INSERT INTO Filme_Diretor (id_filme, id_diretor) VALUES (5, 6);
INSERT INTO Filme_Ator (id_filme, id_ator) VALUES (5, 9), (5, 10), (5, 11);

/* Filme 6: Uma noite de crime anarquia */
INSERT INTO Filme (id_filme, titulo, tempo_duracao, ano, poster, id_linguagem, synopsis, rating, status) VALUES (6, 'Uma Noite de Crime: Anarquia', '01:43:00', 2014, 'https://br.web.img2.acsta.net/pictures/14/11/25/16/16/015135.jpg', 1, 'Três grupos de pessoas precisam sobreviver nas ruas durante o expurgo anual, uma noite em que todos os crimes são permitidos pelo governo.', 6.4, 'APROVADO');
INSERT INTO Filme_Genero (id_filme, id_genero) VALUES (6, 1), (6, 5), (6, 8);
INSERT INTO Filme_Diretor (id_filme, id_diretor) VALUES (6, 7);
INSERT INTO Filme_Ator (id_filme, id_ator) VALUES (6, 12), (6, 13);

/* Filme 7: Top gun maverick */
INSERT INTO Filme (id_filme, titulo, tempo_duracao, ano, poster, id_linguagem, synopsis, rating, status) VALUES (7, 'Top Gun: Maverick', '02:11:00', 2022, 'https://upload.wikimedia.org/wikipedia/pt/thumb/d/d2/Top_Gun_Maverick.jpg/250px-Top_Gun_Maverick.jpg', 1, 'Maverick confronta seu passado ao treinar um grupo de jovens graduados da Top Gun, incluindo o filho de seu falecido amigo, para uma missão perigosa.', 8.3, 'APROVADO');
INSERT INTO Filme_Genero (id_filme, id_genero) VALUES (7, 1), (7, 4);
INSERT INTO Filme_Diretor (id_filme, id_diretor) VALUES (7, 8);
INSERT INTO Filme_Ator (id_filme, id_ator) VALUES (7, 14), (7, 15), (7, 16);

/* Filme 8: Os vingadores */
INSERT INTO Filme (id_filme, titulo, tempo_duracao, ano, poster, id_linguagem, synopsis, rating, status) VALUES (8, 'Os Vingadores - The Avengers', '02:23:00', 2012, 'https://m.media-amazon.com/images/M/MV5BNDYxNjQyMjAtNTdiOS00NGYwLWFmNTAtNThmYjU5ZGI2YTI1XkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_FMjpg_UX1000_.jpg', 1, 'Nick Fury reúne os maiores heróis da Marvel (Homem de Ferro, Capitão América, Hulk, Thor) para lutar contra Loki, que ameaça a Terra.', 8.0, 'APROVADO');
INSERT INTO Filme_Genero (id_filme, id_genero) VALUES (8, 1), (8, 2), (8, 8);
INSERT INTO Filme_Diretor (id_filme, id_diretor) VALUES (8, 9);
INSERT INTO Filme_Ator (id_filme, id_ator) VALUES (8, 17), (8, 18), (8, 19), (8, 20);

/* Filme 9: Infiltrado */
INSERT INTO Filme (id_filme, titulo, tempo_duracao, ano, poster, id_linguagem, synopsis, rating, status) VALUES (9, 'Infiltrado', '01:59:00', 2021, 'https://br.web.img3.acsta.net/pictures/21/06/01/21/29/5026941.jpg', 1, 'H (Jason Statham) é um homem misterioso que trabalha para uma empresa de carros-fortes. Ao impedir um assalto, ele surpreende a todos com suas habilidades.', 7.1, 'APROVADO');
INSERT INTO Filme_Genero (id_filme, id_genero) VALUES (9, 1), (9, 15), (9, 14);
INSERT INTO Filme_Diretor (id_filme, id_diretor) VALUES (9, 10);
INSERT INTO Filme_Ator (id_filme, id_ator) VALUES (9, 21), (9, 22), (9, 23);

/* Filme 10: Fragmentado */
INSERT INTO Filme (id_filme, titulo, tempo_duracao, ano, poster, id_linguagem, synopsis, rating, status) VALUES (10, 'Fragmentado', '01:57:00', 2016, 'https://br.web.img2.acsta.net/pictures/17/02/24/16/32/482058.jpg', 1, 'Kevin (James McAvoy), um homem com 23 personalidades, sequestra três adolescentes. Elas precisam escapar antes que uma nova e terrível personalidade surja.', 7.3, 'APROVADO');
INSERT INTO Filme_Genero (id_filme, id_genero) VALUES (10, 6), (10, 5), (10, 14);
INSERT INTO Filme_Diretor (id_filme, id_diretor) VALUES (10, 11);
INSERT INTO Filme_Ator (id_filme, id_ator) VALUES (10, 24), (10, 25), (10, 26);

/* Filme 11: Beekeeper */
INSERT INTO Filme (id_filme, titulo, tempo_duracao, ano, poster, id_linguagem, synopsis, rating, status) VALUES (11, 'Beekeeper - Rede de Vingança', '01:45:00', 2024, 'https://upload.wikimedia.org/wikipedia/en/8/82/The_Beekeeper_poster.jpg', 1, 'Adam Clay (Jason Statham) busca vingança contra golpistas responsáveis pela morte de sua amiga, revelando ser um ex-agente da organização secreta "Beekeepers".', 6.4, 'APROVADO');
INSERT INTO Filme_Genero (id_filme, id_genero) VALUES (11, 1), (11, 6);
INSERT INTO Filme_Diretor (id_filme, id_diretor) VALUES (11, 12);
INSERT INTO Filme_Ator (id_filme, id_ator) VALUES (11, 21), (11, 27), (11, 28);

/* Filme 12: Oppenheimer */
INSERT INTO Filme (id_filme, titulo, tempo_duracao, ano, poster, id_linguagem, synopsis, rating, status) VALUES (12, 'Oppenheimer', '03:00:00', 2023, 'https://upload.wikimedia.org/wikipedia/pt/thumb/5/5b/Oppenheimer_poster.jpg/250px-Oppenheimer_poster.jpg', 1, 'A história do físico americano J. Robert Oppenheimer e seu papel no desenvolvimento da bomba atômica.', 8.6, 'APROVADO');
INSERT INTO Filme_Genero (id_filme, id_genero) VALUES (12, 20), (12, 4), (12, 16);
INSERT INTO Filme_Diretor (id_filme, id_diretor) VALUES (12, 33);
INSERT INTO Filme_Ator (id_filme, id_ator) VALUES (12, 68), (12, 69), (12, 17);

/* Filme 13: It a coisa */
INSERT INTO Filme (id_filme, titulo, tempo_duracao, ano, poster, id_linguagem, synopsis, rating, status) VALUES (13, 'It: A Coisa', '02:15:00', 2017, 'https://upload.wikimedia.org/wikipedia/pt/8/82/It_2017.jpg', 1, 'Um grupo de crianças se une para enfrentar Pennywise, uma entidade maligna em forma de palhaço que assombra a cidade de Derry.', 7.3, 'APROVADO');
INSERT INTO Filme_Genero (id_filme, id_genero) VALUES (13, 5), (13, 6);
INSERT INTO Filme_Diretor (id_filme, id_diretor) VALUES (13, 13);
INSERT INTO Filme_Ator (id_filme, id_ator) VALUES (13, 29), (13, 30), (13, 31);

/* Filme 14: O Exorcista */
INSERT INTO Filme (id_filme, titulo, tempo_duracao, ano, poster, id_linguagem, synopsis, rating, status) VALUES (14, 'O Exorcista', '02:02:00', 1973, 'https://br.web.img2.acsta.net/medias/nmedia/18/87/26/84/19873738.jpg', 1, 'Uma atriz percebe que sua filha de doze anos está possuída pelo demônio e pede ajuda a dois padres para tentar salvá-la.', 8.1, 'APROVADO');
INSERT INTO Filme_Genero (id_filme, id_genero) VALUES (14, 5);
INSERT INTO Filme_Diretor (id_filme, id_diretor) VALUES (14, 14);
INSERT INTO Filme_Ator (id_filme, id_ator) VALUES (14, 32), (14, 33), (14, 34);

/* Filme 15: O Chamado */
INSERT INTO Filme (id_filme, titulo, tempo_duracao, ano, poster, id_linguagem, synopsis, rating, status) VALUES (15, 'O Chamado', '01:55:00', 2002, 'https://br.web.img2.acsta.net/pictures/14/12/02/19/31/398428.jpg', 1, 'Uma jornalista investiga uma fita de vídeo misteriosa que parece causar a morte de quem a assiste em sete dias.', 7.1, 'APROVADO');
INSERT INTO Filme_Genero (id_filme, id_genero) VALUES (15, 5), (15, 9);
INSERT INTO Filme_Diretor (id_filme, id_diretor) VALUES (15, 15);
INSERT INTO Filme_Ator (id_filme, id_ator) VALUES (15, 35), (15, 36);

/* Filme 16: Babadook */
INSERT INTO Filme (id_filme, titulo, tempo_duracao, ano, poster, id_linguagem, synopsis, rating, status) VALUES (16, 'O Babadook', '01:34:00', 2014, 'https://br.web.img2.acsta.net/pictures/14/01/23/02/58/013133.jpg', 1, 'Uma mãe solteira, atormentada pela morte do marido, batalha com o medo de seu filho de um monstro que se espreita pela casa.', 6.8, 'APROVADO');
INSERT INTO Filme_Genero (id_filme, id_genero) VALUES (16, 5), (16, 4), (16, 6);
INSERT INTO Filme_Diretor (id_filme, id_diretor) VALUES (16, 16);
INSERT INTO Filme_Ator (id_filme, id_ator) VALUES (16, 37), (16, 38);

/* Filme 17: Annabelle */
INSERT INTO Filme (id_filme, titulo, tempo_duracao, ano, poster, id_linguagem, synopsis, rating, status) VALUES (17, 'Annabelle', '01:39:00', 2014, 'https://br.web.img2.acsta.net/pictures/14/08/11/21/32/336680.jpg', 1, 'Um casal começa a presenciar ocorrências sobrenaturais assustadoras envolvendo uma boneca, logo após sua casa ser invadida por membros de uma seita.', 5.4, 'APROVADO');
INSERT INTO Filme_Genero (id_filme, id_genero) VALUES (17, 5), (17, 6), (17, 9);
INSERT INTO Filme_Diretor (id_filme, id_diretor) VALUES (17, 17);
INSERT INTO Filme_Ator (id_filme, id_ator) VALUES (17, 39), (17, 40);

/* Filme 18: Jurassic Park */
INSERT INTO Filme (id_filme, titulo, tempo_duracao, ano, poster, id_linguagem, synopsis, rating, status) VALUES (18, 'Jurassic Park: O Parque dos Dinossauros', '02:07:00', 1993, 'https://m.media-amazon.com/images/M/MV5BMjM2MDgxMDg0Nl5BMl5BanBnXkFtZTgwNTM2OTM5NDE@._V1_FMjpg_UX1000_.jpg', 1, 'Um bilionário cria um parque temático com dinossauros recriados por engenharia genética, mas a segurança falha e os dinossauros escapam.', 8.2, 'APROVADO');
INSERT INTO Filme_Genero (id_filme, id_genero) VALUES (18, 2), (18, 8), (18, 6);
INSERT INTO Filme_Diretor (id_filme, id_diretor) VALUES (18, 18);
INSERT INTO Filme_Ator (id_filme, id_ator) VALUES (18, 41), (18, 42), (18, 43), (18, 20);

/* Filme 19: Up – Altas Aventuras */
INSERT INTO Filme (id_filme, titulo, tempo_duracao, ano, poster, id_linguagem, synopsis, rating, status) VALUES (19, 'Up - Altas Aventuras', '01:36:00', 2009, 'https://ingresso-a.akamaihd.net/prd/img/movie/up-altas-aventuras/46a36367-94f3-4853-99bb-9c5d746ea111.jpg', 1, 'Carl Fredricksen, um vendedor de balões de 78 anos, amarra milhares de balões à sua casa e voa para a América do Sul, levando acidentalmente um jovem escoteiro.', 8.3, 'APROVADO');
INSERT INTO Filme_Genero (id_filme, id_genero) VALUES (19, 11), (19, 2), (19, 3), (19, 19);
INSERT INTO Filme_Diretor (id_filme, id_diretor) VALUES (19, 19), (19, 20);
INSERT INTO Filme_Ator (id_filme, id_ator) VALUES (19, 44), (19, 45);

/* Filme 20: Rio */
INSERT INTO Filme (id_filme, titulo, tempo_duracao, ano, poster, id_linguagem, synopsis, rating, status) VALUES (20, 'Rio', '01:36:00', 2011, 'https://cinemacomrapadura.com.br/imagens/2011/04/capa-livro-rio-lexa.jpg', 1, 'Blu, uma arara-azul macho domesticada, é levada ao Rio de Janeiro para acasalar com Jade, a última fêmea da espécie. Juntos, eles são capturados por contrabandistas.', 6.9, 'APROVADO');
INSERT INTO Filme_Genero (id_filme, id_genero) VALUES (20, 11), (20, 2), (20, 3), (20, 19);
INSERT INTO Filme_Diretor (id_filme, id_diretor) VALUES (20, 21);
INSERT INTO Filme_Ator (id_filme, id_ator) VALUES (20, 46), (20, 47);

/* Filme 21: Madagascar */
INSERT INTO Filme (id_filme, titulo, tempo_duracao, ano, poster, id_linguagem, synopsis, rating, status) VALUES (21, 'Madagascar', '01:26:00', 2005, 'https://upload.wikimedia.org/wikipedia/pt/3/36/Madagascar_Theatrical_Poster.jpg', 1, 'Quatro animais do Zoológico do Central Park (Leão, Zebra, Girafa e Hipopótamo) acabam presos em Madagascar e precisam aprender a sobreviver na selva.', 6.9, 'APROVADO');
INSERT INTO Filme_Genero (id_filme, id_genero) VALUES (21, 11), (21, 2), (21, 3), (21, 19);
INSERT INTO Filme_Diretor (id_filme, id_diretor) VALUES (21, 22), (21, 23);
INSERT INTO Filme_Ator (id_filme, id_ator) VALUES (21, 48), (21, 49), (21, 50);

/* Filme 22: Jack Reacher: O Último Tiro */
INSERT INTO Filme (id_filme, titulo, tempo_duracao, ano, poster, id_linguagem, synopsis, rating, status) VALUES (22, 'Jack Reacher: O Último Tiro', '02:10:00', 2012, 'https://upload.wikimedia.org/wikipedia/pt/thumb/d/d1/Jack_Reacher_poster.jpg/250px-Jack_Reacher_poster.jpg', 1, 'Um ex-investigador militar, Jack Reacher (Tom Cruise), é convocado para investigar um atirador que matou cinco pessoas aleatórias.', 7.0, 'APROVADO');
INSERT INTO Filme_Genero (id_filme, id_genero) VALUES (22, 1), (22, 14), (22, 15);
INSERT INTO Filme_Diretor (id_filme, id_diretor) VALUES (22, 24);
INSERT INTO Filme_Ator (id_filme, id_ator) VALUES (22, 14), (22, 51), (22, 52);

/* Filme 23: O Contador */
INSERT INTO Filme (id_filme, titulo, tempo_duracao, ano, poster, id_linguagem, synopsis, rating, status) VALUES (23, 'O Contador', '02:08:00', 2016, 'https://screamyell.com.br/site/wp-content/uploads/2025/04/contador2.jpg', 1, 'Christian Wolff (Ben Affleck) é um contador com autismo que trabalha para algumas das mais perigosas organizações criminosas do mundo.', 7.3, 'APROVADO');
INSERT INTO Filme_Genero (id_filme, id_genero) VALUES (23, 1), (23, 4), (23, 14);
INSERT INTO Filme_Diretor (id_filme, id_diretor) VALUES (23, 25);
INSERT INTO Filme_Ator (id_filme, id_ator) VALUES (23, 53), (23, 54), (23, 55);

/* Filme 24: Busca Implacável */
INSERT INTO Filme (id_filme, titulo, tempo_duracao, ano, poster, id_linguagem, synopsis, rating, status) VALUES (24, 'Busca Implacável', '01:30:00', 2008, 'https://play-lh.googleusercontent.com/prYHBU7FojWxCyRq-VwKffB2jOV7b2qhUM7SgKS9IEqQ1rqx1miXUcfynUn52d2AoKAO', 1, 'Bryan Mills (Liam Neeson), um ex-agente da CIA, usa suas habilidades para resgatar sua filha e a amiga dela, sequestradas por traficantes em Paris.', 7.8, 'APROVADO');
INSERT INTO Filme_Genero (id_filme, id_genero) VALUES (24, 1), (24, 6), (24, 14);
INSERT INTO Filme_Diretor (id_filme, id_diretor) VALUES (24, 26);
INSERT INTO Filme_Ator (id_filme, id_ator) VALUES (24, 56), (24, 57), (24, 58);

/* Filme 25: O Silêncio dos Inocentes */
INSERT INTO Filme (id_filme, titulo, tempo_duracao, ano, poster, id_linguagem, synopsis, rating, status) VALUES (25, 'O Silêncio dos Inocentes', '01:58:00', 1991, 'https://m.media-amazon.com/images/M/MV5BNjNhZTk0ZmEtNjJhMi00YzFlLWE1MmEtYzM1M2ZmMGMwMTU4XkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_FMjpg_UX1000_.jpg', 1, 'Uma jovem estagiária do FBI deve procurar a ajuda de um assassino canibal preso (Hannibal Lecter) para capturar outro assassino.', 8.6, 'APROVADO');
INSERT INTO Filme_Genero (id_filme, id_genero) VALUES (25, 14), (25, 15), (25, 4);
INSERT INTO Filme_Diretor (id_filme, id_diretor) VALUES (25, 34);
INSERT INTO Filme_Ator (id_filme, id_ator) VALUES (25, 72), (25, 73);

/* Filme 26: O Segredo da Cabana */
INSERT INTO Filme (id_filme, titulo, tempo_duracao, ano, poster, id_linguagem, synopsis, rating, status) VALUES (26, 'O Segredo da Cabana', '01:35:00', 2012, 'https://m.media-amazon.com/images/S/pv-target-images/047d248c8c53ab0fcdff16a0d4668aaebc83bdfe584f5759ba9f28bc025f5f3c.jpg', 1, 'Cinco amigos vão para uma cabana na floresta e descobrem que estão sendo manipulados por técnicos em um laboratório subterrâneo.', 7.0, 'APROVADO');
INSERT INTO Filme_Genero (id_filme, id_genero) VALUES (26, 5), (26, 9), (26, 3);
INSERT INTO Filme_Diretor (id_filme, id_diretor) VALUES (26, 27);
INSERT INTO Filme_Ator (id_filme, id_ator) VALUES (26, 59), (26, 18), (26, 60), (26, 52);

/* Filme 27: A Freira */
INSERT INTO Filme (id_filme, titulo, tempo_duracao, ano, poster, id_linguagem, synopsis, rating, status) VALUES (27, 'A Freira', '01:36:00', 2018, 'https://br.web.img3.acsta.net/pictures/18/07/18/21/53/1348208.jpg', 1, 'Um padre e uma noviça são enviados pelo Vaticano para investigar o suicídio de uma freira na Romênia, descobrindo um segredo profano.', 5.3, 'APROVADO');
INSERT INTO Filme_Genero (id_filme, id_genero) VALUES (27, 5), (27, 6), (27, 9);
INSERT INTO Filme_Diretor (id_filme, id_diretor) VALUES (27, 28);
INSERT INTO Filme_Ator (id_filme, id_ator) VALUES (27, 61), (27, 62), (27, 63);

/* Filme 28: Enrolados */
INSERT INTO Filme (id_filme, titulo, tempo_duracao, ano, poster, id_linguagem, synopsis, rating, status) VALUES (28, 'Enrolados', '01:40:00', 2010, 'https://i.pinimg.com/736x/eb/88/08/eb8808cfa6b18b4332d4f972617eaba7.jpg', 1, 'Rapunzel, uma princesa com longos cabelos mágicos, foge de sua torre isolada com a ajuda de um ladrão (Flynn Rider) para ver as luzes flutuantes.', 7.7, 'APROVADO');
INSERT INTO Filme_Genero (id_filme, id_genero) VALUES (28, 11), (28, 2), (28, 3), (28, 13);
INSERT INTO Filme_Diretor (id_filme, id_diretor) VALUES (28, 29), (28, 30);
INSERT INTO Filme_Ator (id_filme, id_ator) VALUES (28, 64), (28, 65);

/* Filme 29: A Princesa e o Sapo */
INSERT INTO Filme (id_filme, titulo, tempo_duracao, ano, poster, id_linguagem, synopsis, rating, status) VALUES (29, 'A Princesa e o Sapo', '01:37:00', 2009, 'https://br.web.img3.acsta.net/medias/nmedia/18/87/89/74/19962669.jpg', 1, 'Tiana, uma garçonete de Nova Orleans, sonha em abrir seu próprio restaurante. Ela beija um príncipe transformado em sapo e acaba se tornando um sapo também.', 7.1, 'APROVADO');
INSERT INTO Filme_Genero (id_filme, id_genero) VALUES (29, 11), (29, 7), (29, 10), (29, 13);
INSERT INTO Filme_Diretor (id_filme, id_diretor) VALUES (29, 31), (29, 32);
INSERT INTO Filme_Ator (id_filme, id_ator) VALUES (29, 66), (29, 67);

/* Filme 30: Interestelar */
INSERT INTO Filme (id_filme, titulo, tempo_duracao, ano, poster, id_linguagem, synopsis, rating, status) VALUES (30, 'Interestelar', '02:49:00', 2014, 'https://br.web.img3.acsta.net/pictures/14/10/31/20/39/476171.jpg', 1, 'Uma equipe de exploradores viaja através de um buraco de minhoca no espaço na tentativa de garantir a sobrevivência da humanidade.', 8.7, 'APROVADO');
INSERT INTO Filme_Genero (id_filme, id_genero) VALUES (30, 8), (30, 4), (30, 2);
INSERT INTO Filme_Diretor (id_filme, id_diretor) VALUES (30, 33);
INSERT INTO Filme_Ator (id_filme, id_ator) VALUES (30, 70), (30, 47), (30, 71);

SET FOREIGN_KEY_CHECKS = 1;