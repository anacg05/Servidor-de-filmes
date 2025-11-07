import json
import mysql.connector
import datetime
import decimal
import re
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse, parse_qs, unquote

# -------------------------------------------------------------------
# 🔹 1. LÓGICA DO BANCO DE DADOS (Sem alterações)
# -------------------------------------------------------------------

try:
    mydb = mysql.connector.connect(
        host="localhost",
        user="root",
        password="senai",
        database="webserver_filmes_anacg"
    )
    print("✅ Conexão com o MySQL estabelecida com sucesso!")
except mysql.connector.Error as err:
    print(f"❌ Erro ao conectar ao MySQL: {err}")
    exit(1)

def default_converter(obj):
    if isinstance(obj, (datetime.date, datetime.datetime)):
        return obj.isoformat()
    if isinstance(obj, datetime.timedelta):
        total_seconds = int(obj.total_seconds())
        hours, remainder = divmod(total_seconds, 3600)
        minutes, seconds = divmod(remainder, 60)
        return f"{hours:02}:{minutes:02}:{seconds:02}"
    if isinstance(obj, decimal.Decimal):
        return float(obj)
    return str(obj)

def fetch_all(query, params=None):
    cursor = mydb.cursor(dictionary=True)
    cursor.execute(query, params or ())
    result = cursor.fetchall()
    cursor.close()
    return result

def fetch_one(query, params=None):
    cursor = mydb.cursor(dictionary=True)
    cursor.execute(query, params or ())
    result = cursor.fetchone()
    cursor.close()
    return result

def execute_query(query, params=None):
    cursor = mydb.cursor()
    cursor.execute(query, params or ())
    mydb.commit()
    last_row_id = cursor.lastrowid
    cursor.close()
    return last_row_id

# -------------------------------------------------------------------
# 🔹 2. ROTAS DA API (LÓGICA DE NEGÓCIO)
# -------------------------------------------------------------------

def get_filmes(params):
    # (Sem alterações aqui)
    busca = params.get("busca", [None])[0]
    genero = params.get("genero", [None])[0]
    ano = params.get("ano", [None])[0]
    limit = params.get("limit", [None])[0]
    query = "SELECT DISTINCT f.id_filme, f.titulo, f.ano, f.poster, f.rating, f.synopsis, (SELECT g.genero FROM Genero g JOIN Filme_Genero fg ON g.id_genero = fg.id_genero WHERE fg.id_filme = f.id_filme LIMIT 1) as genre FROM Filme f LEFT JOIN Filme_Genero fg ON f.id_filme = fg.id_filme LEFT JOIN Genero g ON fg.id_genero = g.id_genero WHERE 1=1"
    query_params = []
    if busca:
        query += " AND f.titulo LIKE %s"
        query_params.append(f"%{unquote(busca)}%")
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
    # (Sem alterações aqui)
    query = "SELECT f.id_filme, f.titulo, f.ano, f.poster, f.rating, f.synopsis, f.tempo_duracao, l.linguagem, GROUP_CONCAT(DISTINCT g.genero SEPARATOR ', ') as genre, GROUP_CONCAT(DISTINCT d.nome SEPARATOR ', ') as director, GROUP_CONCAT(DISTINCT a.nome SEPARATOR ', ') as actors FROM Filme f LEFT JOIN Linguagem l ON f.id_linguagem = l.id_linguagem LEFT JOIN Filme_Genero fg ON f.id_filme = fg.id_filme LEFT JOIN Genero g ON fg.id_genero = g.id_genero LEFT JOIN Filme_Diretor fd ON f.id_filme = fd.id_filme LEFT JOIN Diretor d ON fd.id_diretor = d.id_diretor LEFT JOIN Filme_Ator fa ON f.id_filme = fa.id_filme LEFT JOIN Ator a ON fa.id_ator = a.id_ator WHERE f.id_filme = %s GROUP BY f.id_filme, l.linguagem;"
    filme = fetch_one(query, (filme_id,))
    if filme:
        return {"id": filme.get("id_filme"), "title": filme.get("titulo"), "year": filme.get("ano"), "poster": filme.get("poster"), "rating": filme.get("rating"), "synopsis": filme.get("synopsis"), "duration": filme.get("tempo_duracao"), "language": filme.get("linguagem"), "genre": filme.get("genre"), "director": filme.get("director"), "actors": filme.get("actors")}
    return None

# ⭐ MUDANÇA AQUI: VERIFICAÇÃO DE DUPLICATAS ADICIONADA
def create_filme(data):
    titulo = data.get("titulo")
    ano = data.get("ano")
    poster = data.get("poster")
    rating = data.get("rating")
    synopsis = data.get("synopsis")
    generos_nomes = data.get("generos_nomes") 
    diretor_nome = data.get("diretor_nome")
    ator_nome = data.get("ator_nome")
    id_linguagem = data.get("id_linguagem")

    if not titulo or not ano or not generos_nomes or not id_linguagem:
        return {"error": "Campos obrigatórios (titulo, ano, generos_nomes, id_linguagem) não preenchidos"}, 400

    # ⭐ 1. ADICIONA A VERIFICAÇÃO DE DUPLICATAS
    # (Verifica se um filme com o mesmo Título e Ano já existe)
    try:
        existing_film = fetch_one("SELECT id_filme FROM Filme WHERE titulo = %s AND ano = %s", (titulo, ano))
        if existing_film:
            # Retorna um erro 409 (Conflito) se o filme já existir
            return {"error": f"O filme '{titulo}' ({ano}) já está cadastrado."}, 409

        # 2. Se não houver duplicatas, continua com a inserção
        query_filme = "INSERT INTO Filme (titulo, ano, poster, rating, synopsis, id_linguagem) VALUES (%s, %s, %s, %s, %s, %s)"
        id_filme = execute_query(query_filme, (titulo, ano, poster, rating, synopsis, id_linguagem))

        # 3. Lidar com Gêneros
        if generos_nomes:
            for genero_nome in generos_nomes:
                genero_obj = fetch_one("SELECT id_genero FROM Genero WHERE genero = %s", (genero_nome,))
                id_genero = genero_obj["id_genero"] if genero_obj else execute_query("INSERT INTO Genero (genero) VALUES (%s)", (genero_nome,))
                execute_query("INSERT INTO Filme_Genero (id_filme, id_genero) VALUES (%s, %s)", (id_filme, id_genero))

        # 4. Lidar com Diretor
        if diretor_nome:
            diretor_obj = fetch_one("SELECT id_diretor FROM Diretor WHERE nome = %s", (diretor_nome,))
            id_diretor = diretor_obj["id_diretor"] if diretor_obj else execute_query("INSERT INTO Diretor (nome) VALUES (%s)", (diretor_nome,))
            execute_query("INSERT INTO Filme_Diretor (id_filme, id_diretor) VALUES (%s, %s)", (id_filme, id_diretor))

        # 5. Lidar com Ator
        if ator_nome:
            ator_obj = fetch_one("SELECT id_ator FROM Ator WHERE nome = %s", (ator_nome,))
            id_ator = ator_obj["id_ator"] if ator_obj else execute_query("INSERT INTO Ator (nome, sobrenome) VALUES (%s, %s)", (ator_nome, ''))
            execute_query("INSERT INTO Filme_Ator (id_filme, id_ator) VALUES (%s, %s)", (id_filme, id_ator))

        data["id_filme"] = id_filme
        return data, 201 # 201 = Created
    
    except Exception as e:
        return {"error": str(e)}, 500


def update_filme(filme_id, data):
    # (Sem alterações aqui)
    execute_query("UPDATE Filme SET titulo = %s, ano = %s, poster = %s, rating = %s, synopsis = %s WHERE id_filme = %s", (data["titulo"], data["ano"], data["poster"], data.get("rating"), data.get("synopsis"), filme_id))
    return data

def delete_filme(filme_id):
    # (Sem alterações aqui)
    execute_query("DELETE FROM Filme_Genero WHERE id_filme = %s", (filme_id,))
    execute_query("DELETE FROM Filme_Diretor WHERE id_filme = %s", (filme_id,))
    execute_query("DELETE FROM Filme_Ator WHERE id_filme = %s", (filme_id,))
    execute_query("DELETE FROM Filme_Produtora WHERE id_filme = %s", (filme_id,))
    execute_query("DELETE FROM Filme_Pais WHERE id_filme = %s", (filme_id,))
    execute_query("DELETE FROM Filme WHERE id_filme = %s", (filme_id,))
    return {"message": "Filme deletado com sucesso"}

# -------------------------------------------------------------------
# 🔹 3. O SERVIDOR HTTP (PYTHON PURO) (Sem alterações)
# -------------------------------------------------------------------

class MyApiHandler(BaseHTTPRequestHandler):

    filme_id_regex = re.compile(r'^/api/filmes/(\d+)$')

    def do_OPTIONS(self):
        self.send_response(200, "ok")
        self._send_cors_headers()
        self.end_headers()

    def do_GET(self):
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        query_params = parse_qs(parsed_path.query)
        try:
            match = self.filme_id_regex.match(path)
            if match:
                filme_id = int(match.group(1))
                data = get_filme_by_id(filme_id)
                if data: self._send_json_response(data, 200)
                else: self._send_error("Filme não encontrado", 404)
            elif path == "/api/filmes":
                data = get_filmes(query_params)
                self._send_json_response(data, 200)
            elif path == "/api/generos":
                data = fetch_all("SELECT * FROM Genero ORDER BY genero ASC")
                self._send_json_response(data, 200)
            elif path == "/api/linguagens":
                data = fetch_all("SELECT * FROM Linguagem ORDER BY linguagem ASC")
                self._send_json_response(data, 200)
            elif path == "/api/filmes/anos":
                anos_obj = fetch_all("SELECT DISTINCT ano FROM Filme WHERE ano IS NOT NULL ORDER BY ano DESC")
                data = [a["ano"] for a in anos_obj]
                self._send_json_response(data, 200)
            elif path == "/api/filmes/destaques":
                data = fetch_all("SELECT * FROM Filme ORDER BY id_filme DESC LIMIT 10")
                self._send_json_response(data, 200)
            else:
                self._send_error("Rota não encontrada", 404)
        except Exception as e:
            self._send_error(f"Erro interno do servidor: {e}", 500)

    # A função do_POST já estava pronta para lidar com códigos de erro
    def do_POST(self):
        if self.path == "/api/filmes":
            try:
                data = self._read_json_body()
                # Esta função agora retorna (dados, status_code) ou (erro, status_code)
                response_data, status_code = create_filme(data)
                
                if status_code >= 200 and status_code < 300:
                    self._send_json_response(response_data, status_code)
                else:
                    self._send_error(response_data["error"], status_code)
                    
            except Exception as e:
                self._send_error(f"Erro ao criar filme: {e}", 500)
        else:
            self._send_error("Rota não encontrada", 404)

    def do_PUT(self):
        match = self.filme_id_regex.match(self.path)
        if match:
            try:
                filme_id = int(match.group(1))
                data = self._read_json_body()
                updated_filme = update_filme(filme_id, data)
                self._send_json_response(updated_filme, 200)
            except Exception as e:
                self._send_error(f"Erro ao atualizar filme: {e}", 500)
        else:
            self._send_error("Rota não encontrada", 404)

    def do_DELETE(self):
        match = self.filme_id_regex.match(self.path)
        if match:
            try:
                filme_id = int(match.group(1))
                result = delete_filme(filme_id)
                self._send_json_response(result, 200)
            except Exception as e:
                self._send_error(f"Erro ao deletar filme: {e}", 500)
        else:
            self._send_error("Rota não encontrada", 404)

    def _read_json_body(self):
        content_length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(content_length)
        return json.loads(body.decode("utf-8"))

    def _send_cors_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")

    def _send_json_response(self, data, status_code):
        self.send_response(status_code)
        self._send_cors_headers()
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.end_headers()
        response_body = json.dumps(data, ensure_ascii=False, default=default_converter).encode("utf-8")
        self.wfile.write(response_body)

    def _send_error(self, message, status_code):
        self.send_response(status_code)
        self._send_cors_headers()
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.end_headers()
        response_body = json.dumps({"error": message}, ensure_ascii=False).encode("utf-8")
        self.wfile.write(response_body)

# -------------------------------------------------------------------
# 🔹 4. INICIALIZAÇÃO DO SERVIDOR (Sem alterações)
# -------------------------------------------------------------------
def main():
    port = 3001
    server_address = ('', port)
    httpd = HTTPServer(server_address, MyApiHandler)
    print(f"✅ Servidor API (Python Puro) rodando em http://localhost:{port}")
    httpd.serve_forever()

if __name__ == "__main__":
    main()