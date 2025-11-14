from urllib.parse import unquote
# Importa as funções de banco de dados do arquivo db.py
from db import fetch_all, fetch_one, execute_query

# LÓGICA DE NEGÓCIO PARA FILMES (GET)
def get_filmes(params):
    
    print(f"[DEBUG] Parâmetros recebidos: {params}")
    
   
    busca = params.get("busca", [None])[0]
    genero = params.get("genero", [None])[0]
    ano = params.get("ano", [None])[0]
    limit = params.get("limit", [None])[0]
    
    query = """
        SELECT DISTINCT
            f.id_filme, f.titulo, f.ano, f.poster, f.rating, f.synopsis,
            (SELECT g.genero FROM Genero g JOIN Filme_Genero fg ON g.id_genero = fg.id_genero WHERE fg.id_filme = f.id_filme LIMIT 1) as genre
        FROM Filme f
        LEFT JOIN Filme_Genero fg ON f.id_filme = fg.id_filme
        LEFT JOIN Genero g ON fg.id_genero = g.id_genero
        LEFT JOIN Filme_Ator fa ON f.id_filme = fa.id_filme
        LEFT JOIN Ator a ON fa.id_ator = a.id_ator
        LEFT JOIN Filme_Diretor fd ON f.id_filme = fd.id_filme
        LEFT JOIN Diretor d ON fd.id_diretor = d.id_diretor
        WHERE 1=1
    """
    
    # Apenas filmes APROVADOS são mostrados na lista principal
    query += " AND f.status = 'APROVADO'"
    
    query_params = []
    
    if busca:
        query += " AND (f.titulo LIKE %s OR a.nome LIKE %s OR a.sobrenome LIKE %s OR d.nome LIKE %s OR d.sobrenome LIKE %s)"
        search_like = f"%{unquote(busca)}%"
        query_params.extend([search_like, search_like, search_like, search_like, search_like])
        
    if genero:
        query += " AND EXISTS (SELECT 1 FROM Filme_Genero fg_filter JOIN Genero g_filter ON fg_filter.id_genero = g_filter.id_genero WHERE fg_filter.id_filme = f.id_filme AND g_filter.genero = %s)"
        query_params.append(unquote(genero))
        
    if ano:
        query += " AND f.ano = %s"
        query_params.append(ano)
    
    query += " ORDER BY f.titulo ASC"
    
    if limit:
        query += " LIMIT %s"
        query_params.append(int(limit))
    
    return fetch_all(query, query_params)

# LÓGICA DE NEGÓCIO PARA FILME (GET por ID)
def get_filme_by_id(filme_id):
    query = """
        SELECT 
            f.id_filme, f.titulo, f.ano, f.poster, f.rating, f.synopsis, f.tempo_duracao, f.status,
            f.id_filme_original,
            l.linguagem,
            GROUP_CONCAT(DISTINCT g.genero SEPARATOR ', ') as genre,
            GROUP_CONCAT(DISTINCT d.nome SEPARATOR ', ') as director,
            GROUP_CONCAT(DISTINCT a.nome SEPARATOR ', ') as actors,
            GROUP_CONCAT(DISTINCT p.pais SEPARATOR ', ') as country,
            GROUP_CONCAT(DISTINCT pr.produtora SEPARATOR ', ') as producer
        FROM Filme f
        LEFT JOIN Linguagem l ON f.id_linguagem = l.id_linguagem
        LEFT JOIN Filme_Genero fg ON f.id_filme = fg.id_filme
        LEFT JOIN Genero g ON fg.id_genero = g.id_genero
        LEFT JOIN Filme_Diretor fd ON f.id_filme = fd.id_filme
        LEFT JOIN Diretor d ON fd.id_diretor = d.id_diretor
        LEFT JOIN Filme_Ator fa ON f.id_filme = fa.id_filme
        LEFT JOIN Ator a ON fa.id_ator = a.id_ator
        LEFT JOIN Filme_Pais fp ON f.id_filme = fp.id_filme
        LEFT JOIN Pais p ON fp.id_pais = p.id_pais
        LEFT JOIN Filme_Produtora fpr ON f.id_filme = fpr.id_filme
        LEFT JOIN Produtora pr ON fpr.id_produtora = pr.id_produtora
        WHERE f.id_filme = %s
        GROUP BY f.id_filme, l.linguagem;
    """
    filme = fetch_one(query, (filme_id,))
    if filme:
        return {
            "id": filme.get("id_filme"),
            "title": filme.get("titulo"),
            "year": filme.get("ano"),
            "poster": filme.get("poster"),
            "rating": filme.get("rating"),
            "synopsis": filme.get("synopsis"),
            "duration": filme.get("tempo_duracao"),
            "status": filme.get("status"),
            "id_filme_original": filme.get("id_filme_original"),
            "language": filme.get("linguagem"),
            "genre": filme.get("genre"),
            "director": filme.get("director"),
            "actors": filme.get("actors"),
            "country": filme.get("country"),
            "producer": filme.get("producer")
        }
    return None

# FILME (POST - Solicitar Cadastro)
def create_filme(data):
    titulo = data.get("titulo"); ano = data.get("ano"); poster = data.get("poster"); rating = data.get("rating"); synopsis = data.get("synopsis"); generos_nomes = data.get("generos_nomes"); diretor_nome = data.get("diretor_nome"); id_linguagem = data.get("id_linguagem"); ator_nome1 = data.get("ator_nome1"); ator_nome2 = data.get("ator_nome2"); ator_nome3 = data.get("ator_nome3"); atores = [ator_nome1, ator_nome2, ator_nome3]; tempo_duracao = data.get("tempo_duracao") or None

    if not titulo or not ano or not generos_nomes or not id_linguagem:
        return {"error": "Campos obrigatórios..."}, 400

    try:
        existing_film = fetch_one("SELECT id_filme FROM Filme WHERE titulo = %s AND ano = %s", (titulo, ano))
        if existing_film:
            return {"error": f"O filme '{titulo}' ({ano}) já está cadastrado (pode estar pendente)."}, 409
        
        # Salva com status 'PENDENTE_CADASTRO'
        query_filme = "INSERT INTO Filme (titulo, ano, poster, rating, synopsis, id_linguagem, tempo_duracao, status) VALUES (%s, %s, %s, %s, %s, %s, %s, 'PENDENTE_CADASTRO')"
        id_filme = execute_query(query_filme, (titulo, ano, poster, rating, synopsis, id_linguagem, tempo_duracao))
        
        # (Lógica de Gêneros, Diretor e Atores permanece a mesma)
        if generos_nomes:
            for genero_nome in generos_nomes:
                genero_obj = fetch_one("SELECT id_genero FROM Genero WHERE genero = %s", (genero_nome,)); id_genero = genero_obj["id_genero"] if genero_obj else execute_query("INSERT INTO Genero (genero) VALUES (%s)", (genero_nome,))
                execute_query("INSERT INTO Filme_Genero (id_filme, id_genero) VALUES (%s, %s)", (id_filme, id_genero))
        if diretor_nome:
            diretor_obj = fetch_one("SELECT id_diretor FROM Diretor WHERE nome = %s", (diretor_nome,)); id_diretor = diretor_obj["id_diretor"] if diretor_obj else execute_query("INSERT INTO Diretor (nome) VALUES (%s)", (diretor_nome,))
            execute_query("INSERT INTO Filme_Diretor (id_filme, id_diretor) VALUES (%s, %s)", (id_filme, id_diretor))
        for ator_nome in atores:
            if ator_nome:
                ator_obj = fetch_one("SELECT id_ator FROM Ator WHERE nome = %s", (ator_nome,)); id_ator = ator_obj["id_ator"] if ator_obj else execute_query("INSERT INTO Ator (nome, sobrenome) VALUES (%s, %s)", (ator_nome, ''))
                execute_query("INSERT INTO Filme_Ator (id_filme, id_ator) VALUES (%s, %s)", (id_filme, id_ator))
        
        data["id_filme"] = id_filme
        return data, 201
    
    except Exception as e:
        return {"error": str(e)}, 500

# FILME (POST - Solicitar Edição)
def create_edit_submission(id_filme_original, data):
    titulo = data.get("titulo"); ano = data.get("ano"); poster = data.get("poster"); rating = data.get("rating"); synopsis = data.get("synopsis"); generos_nomes = data.get("generos_nomes"); diretor_nome = data.get("diretor_nome"); id_linguagem = data.get("id_linguagem"); ator_nome1 = data.get("ator_nome1"); ator_nome2 = data.get("ator_nome2"); ator_nome3 = data.get("ator_nome3"); atores = [ator_nome1, ator_nome2, ator_nome3]; tempo_duracao = data.get("tempo_duracao") or None

    if not titulo or not ano or not generos_nomes or not id_linguagem:
        return {"error": "Campos obrigatórios..."}, 400

    try:
        # Cria uma *nova* entrada de filme com status PENDENTE_EDICAO
        query_filme = "INSERT INTO Filme (titulo, ano, poster, rating, synopsis, id_linguagem, tempo_duracao, status, id_filme_original) VALUES (%s, %s, %s, %s, %s, %s, %s, 'PENDENTE_EDICAO', %s)"
        id_filme_pendente = execute_query(query_filme, (titulo, ano, poster, rating, synopsis, id_linguagem, tempo_duracao, id_filme_original))
        
        if generos_nomes:
            for genero_nome in generos_nomes:
                genero_obj = fetch_one("SELECT id_genero FROM Genero WHERE genero = %s", (genero_nome,)); id_genero = genero_obj["id_genero"] if genero_obj else execute_query("INSERT INTO Genero (genero) VALUES (%s)", (genero_nome,))
                execute_query("INSERT INTO Filme_Genero (id_filme, id_genero) VALUES (%s, %s)", (id_filme_pendente, id_genero))
        if diretor_nome:
            diretor_obj = fetch_one("SELECT id_diretor FROM Diretor WHERE nome = %s", (diretor_nome,)); id_diretor = diretor_obj["id_diretor"] if diretor_obj else execute_query("INSERT INTO Diretor (nome) VALUES (%s)", (diretor_nome,))
            execute_query("INSERT INTO Filme_Diretor (id_filme, id_diretor) VALUES (%s, %s)", (id_filme_pendente, id_diretor))
        for ator_nome in atores:
            if ator_nome:
                ator_obj = fetch_one("SELECT id_ator FROM Ator WHERE nome = %s", (ator_nome,)); id_ator = ator_obj["id_ator"] if ator_obj else execute_query("INSERT INTO Ator (nome, sobrenome) VALUES (%s, %s)", (ator_nome, ''))
                execute_query("INSERT INTO Filme_Ator (id_filme, id_ator) VALUES (%s, %s)", (id_filme_pendente, id_ator))
        
        data["id_filme_pendente"] = id_filme_pendente
        return data, 201
    
    except Exception as e:
        return {"error": str(e)}, 500

# FILME (DELETE - Recusar ou Excluir)
def delete_filme(filme_id):
    # Esta função é usada para "Recusar" (apagar PENDENTE)
    # ou "Excluir" (apagar APROVADO)
    try:
        execute_query("DELETE FROM Filme_Genero WHERE id_filme = %s", (filme_id,))
        execute_query("DELETE FROM Filme_Diretor WHERE id_filme = %s", (filme_id,))
        execute_query("DELETE FROM Filme_Ator WHERE id_filme = %s", (filme_id,))
        execute_query("DELETE FROM Filme_Produtora WHERE id_filme = %s", (filme_id,))
        execute_query("DELETE FROM Filme_Pais WHERE id_filme = %s", (filme_id,))
        execute_query("DELETE FROM Filme WHERE id_filme = %s", (filme_id,))
        return {"message": "Filme deletado com sucesso"}
    except Exception as e:
        return {"error": str(e)}, 500


# LÓGICAS DE NEGÓCIO (ADMIN)
def get_solicitacoes_cadastro():
    query = "SELECT * FROM Filme WHERE status = 'PENDENTE_CADASTRO' ORDER BY id_filme ASC"
    return fetch_all(query)

def get_solicitacoes_edicao():
    query = "SELECT * FROM Filme WHERE status = 'PENDENTE_EDICAO' ORDER BY id_filme ASC"
    return fetch_all(query)

def aprovar_filme(filme_pendente_id):
    try:
        # 1. Busca o filme pendente
        filme_pendente = fetch_one("SELECT * FROM Filme WHERE id_filme = %s", (filme_pendente_id,))
        if not filme_pendente:
            return {"error": "Solicitação não encontrada"}, 404

        status = filme_pendente["status"]
        
        if status == 'PENDENTE_CADASTRO':
            # APROVAÇÃO SIMPLES: Apenas muda o status
            execute_query("UPDATE Filme SET status = 'APROVADO' WHERE id_filme = %s", (filme_pendente_id,))
            return {"message": "Filme aprovado com sucesso"}
        
        elif status == 'PENDENTE_EDICAO':
            # APROVAÇÃO DE EDIÇÃO: Copia os dados para o original e apaga a pendência
            id_original = filme_pendente["id_filme_original"]
            
            # 1. Copia os dados do filme pendente para o original
            execute_query(
                """
                UPDATE Filme SET
                    titulo = %s, ano = %s, poster = %s, rating = %s, synopsis = %s, 
                    id_linguagem = %s, tempo_duracao = %s
                WHERE id_filme = %s
                """,
                (
                    filme_pendente["titulo"], filme_pendente["ano"], filme_pendente["poster"],
                    filme_pendente["rating"], filme_pendente["synopsis"], filme_pendente["id_linguagem"],
                    filme_pendente["tempo_duracao"], id_original
                )
            )
            
            # 2. Apaga as relações antigas do filme ORIGINAL
            execute_query("DELETE FROM Filme_Genero WHERE id_filme = %s", (id_original,))
            execute_query("DELETE FROM Filme_Diretor WHERE id_filme = %s", (id_original,))
            execute_query("DELETE FROM Filme_Ator WHERE id_filme = %s", (id_original,))
            
            # 3. Copia as novas relações (do filme pendente) para o filme ORIGINAL
            execute_query("UPDATE Filme_Genero SET id_filme = %s WHERE id_filme = %s", (id_original, filme_pendente_id))
            execute_query("UPDATE Filme_Diretor SET id_filme = %s WHERE id_filme = %s", (id_original, filme_pendente_id))
            execute_query("UPDATE Filme_Ator SET id_filme = %s WHERE id_filme = %s", (id_original, filme_pendente_id))
            
            # 4. Apaga o filme pendente (que agora é desnecessário)
            delete_filme(filme_pendente_id)
            
            return {"message": "Edição aprovada e aplicada com sucesso"}
            
        else:
            return {"error": "Este filme não está pendente"}, 400
            
    except Exception as e:
        return {"error": str(e)}, 500