from urllib.parse import unquote
# Importa as funções de banco de dados do arquivo db.py
from db import fetch_all, fetch_one, execute_query

# (get_filmes e get_filme_by_id permanecem os mesmos)
# ...
def get_filmes(params):
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
    query_params = []
    
    if busca:
        query += " AND (f.titulo LIKE %s OR a.nome LIKE %s OR a.sobrenome LIKE %s OR d.nome LIKE %s OR d.sobrenome LIKE %s)"
        search_like = f"%{unquote(busca)}%"
        query_params.extend([search_like, search_like, search_like, search_like, search_like])
        
    if genero:
        query += " AND g.genero = %s"
        query_params.append(unquote(genero))
    if ano:
        query += " AND f.ano = %s"
        query_params.append(ano)
    
    query += " ORDER BY f.titulo ASC"
    
    if limit:
        query += " LIMIT %s"
        query_params.append(int(limit))
    
    return fetch_all(query, query_params)

def get_filme_by_id(filme_id):
    query = """
        SELECT 
            f.id_filme, f.titulo, f.ano, f.poster, f.rating, f.synopsis, f.tempo_duracao,
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
            "id": filme.get("id_filme"), "title": filme.get("titulo"), "year": filme.get("ano"),
            "poster": filme.get("poster"), "rating": filme.get("rating"), "synopsis": filme.get("synopsis"),
            "duration": filme.get("tempo_duracao"), "language": filme.get("linguagem"),
            "genre": filme.get("genre"), "director": filme.get("director"), "actors": filme.get("actors"),
            "country": filme.get("country"), "producer": filme.get("producer")
        }
    return None

# ⭐ LÓGICA DE NEGÓCIO PARA FILME (POST - Criar) ATUALIZADA
def create_filme(data):
    titulo = data.get("titulo")
    ano = data.get("ano")
    poster = data.get("poster")
    rating = data.get("rating")
    synopsis = data.get("synopsis")
    generos_nomes = data.get("generos_nomes") 
    diretor_nome = data.get("diretor_nome")
    id_linguagem = data.get("id_linguagem")
    ator_nome1 = data.get("ator_nome1")
    ator_nome2 = data.get("ator_nome2")
    ator_nome3 = data.get("ator_nome3")
    atores = [ator_nome1, ator_nome2, ator_nome3]
    
    # ⭐ NOVO CAMPO
    tempo_duracao = data.get("tempo_duracao") or None # Usa None (NULL) se estiver vazio

    if not titulo or not ano or not generos_nomes or not id_linguagem:
        return {"error": "Campos obrigatórios (titulo, ano, generos_nomes, id_linguagem) não preenchidos"}, 400

    try:
        existing_film = fetch_one("SELECT id_filme FROM Filme WHERE titulo = %s AND ano = %s", (titulo, ano))
        if existing_film:
            return {"error": f"O filme '{titulo}' ({ano}) já está cadastrado."}, 409
        
        # ⭐ QUERY ATUALIZADA
        query_filme = "INSERT INTO Filme (titulo, ano, poster, rating, synopsis, id_linguagem, tempo_duracao) VALUES (%s, %s, %s, %s, %s, %s, %s)"
        id_filme = execute_query(query_filme, (titulo, ano, poster, rating, synopsis, id_linguagem, tempo_duracao))
        
        # (Restante da lógica de Gêneros, Diretor e Atores permanece a mesma)
        if generos_nomes:
            for genero_nome in generos_nomes:
                genero_obj = fetch_one("SELECT id_genero FROM Genero WHERE genero = %s", (genero_nome,))
                id_genero = genero_obj["id_genero"] if genero_obj else execute_query("INSERT INTO Genero (genero) VALUES (%s)", (genero_nome,))
                execute_query("INSERT INTO Filme_Genero (id_filme, id_genero) VALUES (%s, %s)", (id_filme, id_genero))
        
        if diretor_nome:
            diretor_obj = fetch_one("SELECT id_diretor FROM Diretor WHERE nome = %s", (diretor_nome,))
            id_diretor = diretor_obj["id_diretor"] if diretor_obj else execute_query("INSERT INTO Diretor (nome) VALUES (%s)", (diretor_nome,))
            execute_query("INSERT INTO Filme_Diretor (id_filme, id_diretor) VALUES (%s, %s)", (id_filme, id_diretor))
        
        for ator_nome in atores:
            if ator_nome:
                ator_obj = fetch_one("SELECT id_ator FROM Ator WHERE nome = %s", (ator_nome,))
                id_ator = ator_obj["id_ator"] if ator_obj else execute_query("INSERT INTO Ator (nome, sobrenome) VALUES (%s, %s)", (ator_nome, ''))
                execute_query("INSERT INTO Filme_Ator (id_filme, id_ator) VALUES (%s, %s)", (id_filme, id_ator))
        
        data["id_filme"] = id_filme
        return data, 201
    
    except Exception as e:
        return {"error": str(e)}, 500

# (update_filme e delete_filme permanecem os mesmos)
def update_filme(filme_id, data):
    # ...
    return data
def delete_filme(filme_id):
    # ...
    return {"message": "Filme deletado com sucesso"}