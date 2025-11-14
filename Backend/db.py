import mysql.connector
import datetime
import decimal

db_config = {
    "host": "localhost",
    "user": "root",
    "password": "senai",
    "database": "webserver_filmes_anacg"
}
mydb = None # A conexão começa como 'None'

def get_db_connection():
    """
    Verifica a conexão e reconecta se estiver inativa ou fechada.
    """
    global mydb
    try:
        # Se não houver conexão ou se estiver fechada, cria uma nova
        if mydb is None or not mydb.is_connected():
            print("Conexão perdida. Reconectando ao MySQL...")
            mydb = mysql.connector.connect(**db_config)
            print("✅ Conexão com o MySQL restabelecida.")
        
        mydb.ping(reconnect=True, attempts=1, delay=0)
        
    except mysql.connector.Error as err:
        print(f"❌ Erro ao conectar/reconectar ao MySQL: {err}")
        try:
            # Tenta uma reconexão forçada
            mydb = mysql.connector.connect(**db_config)
            print("✅ Conexão com o MySQL restabelecida (forçada).")
        except Exception as e:
            print(f"❌ Falha crítica ao reconectar: {e}")
            return None # Falha total
            
    return mydb


# Função para converter dados do DB para JSON

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


# Funções de Query (agora usam get_db_connection())


def fetch_all(query, params=None):
    """ Busca múltiplos resultados (ex: SELECT *) """
    db = get_db_connection()
    if db is None: return [] # Retorna vazio se a conexão falhar
    
    cursor = db.cursor(dictionary=True)
    cursor.execute(query, params or ())
    result = cursor.fetchall()
    cursor.close()
    return result

def fetch_one(query, params=None):
    """ Busca um único resultado (ex: SELECT ... WHERE id=) """
    db = get_db_connection()
    if db is None: return None
    
    cursor = db.cursor(dictionary=True)
    cursor.execute(query, params or ())
    result = cursor.fetchone()
    cursor.close()
    return result

def execute_query(query, params=None):
    """ Executa queries de INSERT, UPDATE, DELETE """
    db = get_db_connection()
    if db is None: return None
    
    cursor = db.cursor()
    cursor.execute(query, params or ())
    db.commit() 
    last_row_id = cursor.lastrowid
    cursor.close()
    return last_row_id