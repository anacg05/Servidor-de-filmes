import json
import re
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse, parse_qs

from db import default_converter, fetch_all

# 1. MUDANÇA NA IMPORTAÇÃO:
from api_logic import (
    get_filmes,
    get_filme_by_id,
    create_filme,
    # 'update_filme' removido
    create_edit_submission, # Adicionado
    delete_filme,
    get_solicitacoes_cadastro,
    get_solicitacoes_edicao, # Adicionado
    aprovar_filme
)

# -------------------------------------------------------------------
# O SERVIDOR HTTP
# -------------------------------------------------------------------

class MyApiHandler(BaseHTTPRequestHandler):

    filme_id_regex = re.compile(r'^/api/filmes/(\d+)$')
    aprovar_filme_regex = re.compile(r'^/api/filmes/(\d+)/aprovar$')
    
    # 2. MUDANÇA: Nova rota para solicitação de edição
    edit_submission_regex = re.compile(r'^/api/filmes/(\d+)/solicitar-edicao$')


    def do_OPTIONS(self):
        self.send_response(200, "ok")
        self._send_cors_headers()
        self.end_headers()

    def do_GET(self):
        parsed_path = urlparse(self.path); path = parsed_path.path; query_params = parse_qs(parsed_path.query)
        try:
            match = self.filme_id_regex.match(path)
            
            if match:
                filme_id = int(match.group(1)); data = get_filme_by_id(filme_id) 
                if data: self._send_json_response(data, 200)
                else: self._send_error("Filme não encontrado", 404)
            elif path == "/api/filmes":
                data = get_filmes(query_params); self._send_json_response(data, 200)
            elif path == "/api/solicitacoes/cadastro":
                data = get_solicitacoes_cadastro(); self._send_json_response(data, 200)
            
            # 3. MUDANÇA: Nova rota para o admin ver as edições
            elif path == "/api/solicitacoes/edicao":
                data = get_solicitacoes_edicao(); self._send_json_response(data, 200)
                
            elif path == "/api/filmes/destaques":
                data = fetch_all("SELECT * FROM Filme WHERE status = 'APROVADO' ORDER BY id_filme DESC LIMIT 10")
                self._send_json_response(data, 200)
            elif path == "/api/generos":
                data = fetch_all("SELECT * FROM Genero ORDER BY genero ASC"); self._send_json_response(data, 200)
            elif path == "/api/linguagens":
                data = fetch_all("SELECT * FROM Linguagem ORDER BY linguagem ASC"); self._send_json_response(data, 200)
            elif path == "/api/filmes/anos":
                anos_obj = fetch_all("SELECT DISTINCT ano FROM Filme WHERE ano IS NOT NULL ORDER BY ano DESC"); data = [a["ano"] for a in anos_obj]; self._send_json_response(data, 200)
            else:
                self._send_error("Rota não encontrada", 404)
        except Exception as e:
            self._send_error(f"Erro interno do servidor: {e}", 500)

    def do_POST(self):
        # 4. MUDANÇA: A rota de "edição" agora é um POST
        match_edit = self.edit_submission_regex.match(self.path)

        if self.path == "/api/filmes":
            try:
                data = self._read_json_body()
                response_data, status_code = create_filme(data) 
                if status_code >= 200 and status_code < 300:
                    self._send_json_response(response_data, status_code)
                else:
                    self._send_error(response_data["error"], status_code)
            except Exception as e:
                self._send_error(f"Erro ao criar filme: {e}", 500)
        
        # 5. MUDANÇA: Lógica para a solicitação de edição
        elif match_edit:
            try:
                id_filme_original = int(match_edit.group(1))
                data = self._read_json_body()
                response_data, status_code = create_edit_submission(id_filme_original, data)
                
                if status_code >= 200 and status_code < 300:
                    self._send_json_response(response_data, status_code)
                else:
                    self._send_error(response_data["error"], status_code)
            except Exception as e:
                self._send_error(f"Erro ao solicitar edição: {e}", 500)
        else:
            self._send_error("Rota POST não encontrada", 404)

    def do_PUT(self):
        match_aprovar = self.aprovar_filme_regex.match(self.path)
        
        if match_aprovar:
            try:
                filme_id = int(match_aprovar.group(1))
                result = aprovar_filme(filme_id)
                self._send_json_response(result, 200)
            except Exception as e:
                self._send_error(f"Erro ao aprovar filme: {e}", 500)
        
        # 6. MUDANÇA: Removemos a rota PUT de /api/filmes/<id>
        # (Ela foi movida para POST /api/filmes/<id>/solicitar-edicao)
        
        else:
            self._send_error("Rota PUT não encontrada", 404)

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

    # (Funções Helper _read_json_body, _send_cors_headers, etc. permanecem as mesmas)
    def _read_json_body(self):
        content_length = int(self.headers.get("Content-Length", 0)); body = self.rfile.read(content_length); return json.loads(body.decode("utf-8"))
    def _send_cors_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*"); self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS"); self.send_header("Access-Control-Allow-Headers", "Content-Type")
    def _send_json_response(self, data, status_code):
        self.send_response(status_code); self._send_cors_headers(); self.send_header("Content-Type", "application/json; charset=utf-8"); self.end_headers()
        response_body = json.dumps(data, ensure_ascii=False, default=default_converter).encode("utf-8"); self.wfile.write(response_body)
    def _send_error(self, message, status_code):
        self.send_response(status_code); self._send_cors_headers(); self.send_header("Content-Type", "application/json; charset=utf-8"); self.end_headers()
        response_body = json.dumps({"error": message}, ensure_ascii=False).encode("utf-8"); self.wfile.write(response_body)

def main():
    port = 3001
    server_address = ('', port)
    httpd = HTTPServer(server_address, MyApiHandler)
    print(f"✅ Servidor API (Python Puro) rodando em http://localhost:{port}")
    httpd.serve_forever()

if __name__ == "__main__":
    main()