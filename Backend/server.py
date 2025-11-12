import json
import re
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse, parse_qs

# Importa o conversor de JSON do db.py
from db import default_converter, fetch_all

# Importa todas as funções de lógica de negócio do api_logic.py
from api_logic import (
    get_filmes,
    get_filme_by_id,
    create_filme,
    update_filme,
    delete_filme
)

# -------------------------------------------------------------------
# 🔹 O SERVIDOR HTTP (Camada de Apresentação)
# -------------------------------------------------------------------

class MyApiHandler(BaseHTTPRequestHandler):

    # Rota REGEX para filmes (ex: /api/filmes/1)
    filme_id_regex = re.compile(r'^/api/filmes/(\d+)$')

    # Lida com o CORS (pre-flight)
    def do_OPTIONS(self):
        self.send_response(200, "ok")
        self._send_cors_headers()
        self.end_headers()

    # Lida com requisições GET
    def do_GET(self):
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        query_params = parse_qs(parsed_path.query)
        
        try:
            # Rota: /api/filmes/<id>
            match = self.filme_id_regex.match(path)
            if match:
                filme_id = int(match.group(1))
                data = get_filme_by_id(filme_id) # Chama a lógica importada
                if data:
                    self._send_json_response(data, 200)
                else:
                    self._send_error("Filme não encontrado", 404)
            
            # Rota: /api/filmes (com filtros)
            elif path == "/api/filmes":
                data = get_filmes(query_params) # Chama a lógica importada
                self._send_json_response(data, 200)
            
            # Rota: /api/generos
            elif path == "/api/generos":
                data = fetch_all("SELECT * FROM Genero ORDER BY genero ASC") # Chama o 'db.py'
                self._send_json_response(data, 200)
            
            # Rota: /api/linguagens
            elif path == "/api/linguagens":
                data = fetch_all("SELECT * FROM Linguagem ORDER BY linguagem ASC") # Chama o 'db.py'
                self._send_json_response(data, 200)
            
            # Rota: /api/filmes/anos
            elif path == "/api/filmes/anos":
                anos_obj = fetch_all("SELECT DISTINCT ano FROM Filme WHERE ano IS NOT NULL ORDER BY ano DESC")
                data = [a["ano"] for a in anos_obj]
                self._send_json_response(data, 200)
            
            # Rota: /api/filmes/destaques
            elif path == "/api/filmes/destaques":
                data = fetch_all("SELECT * FROM Filme ORDER BY id_filme DESC LIMIT 10")
                self._send_json_response(data, 200)
            
            else:
                self._send_error("Rota não encontrada", 404)
        except Exception as e:
            self._send_error(f"Erro interno do servidor: {e}", 500)

    # Lida com requisições POST
    def do_POST(self):
        if self.path == "/api/filmes":
            try:
                data = self._read_json_body()
                response_data, status_code = create_filme(data) # Chama a lógica importada
                
                if status_code >= 200 and status_code < 300:
                    self._send_json_response(response_data, status_code)
                else:
                    self._send_error(response_data["error"], status_code)
                    
            except Exception as e:
                self._send_error(f"Erro ao criar filme: {e}", 500)
        else:
            self._send_error("Rota não encontrada", 404)

    # Lida com requisições PUT
    def do_PUT(self):
        match = self.filme_id_regex.match(self.path)
        if match:
            try:
                filme_id = int(match.group(1))
                data = self._read_json_body()
                updated_filme = update_filme(filme_id, data) # Chama a lógica importada
                self._send_json_response(updated_filme, 200)
            except Exception as e:
                self._send_error(f"Erro ao atualizar filme: {e}", 500)
        else:
            self._send_error("Rota não encontrada", 404)

    # Lida com requisições DELETE
    def do_DELETE(self):
        match = self.filme_id_regex.match(self.path)
        if match:
            try:
                filme_id = int(match.group(1))
                result = delete_filme(filme_id) # Chama a lógica importada
                self._send_json_response(result, 200)
            except Exception as e:
                self._send_error(f"Erro ao deletar filme: {e}", 500)
        else:
            self._send_error("Rota não encontrada", 404)

    # --- Funções Helper do Servidor---
    
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
# 🔹 INICIALIZAÇÃO DO SERVIDOR
# -------------------------------------------------------------------
def main():
    port = 3001
    server_address = ('', port)
    httpd = HTTPServer(server_address, MyApiHandler)
    print(f"✅ Servidor API rodando em http://localhost:{port}")
    httpd.serve_forever()

if __name__ == "__main__":
    main()