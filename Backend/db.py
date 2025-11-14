import mysql.connector
import datetime
import decimal


# ============================
# CONFIGURAÇÃO DO BANCO
# ============================
db_config = {
    "host": "localhost",
    "user": "root",
    "password": "root",
    "database": "webserver_filmes_anacg"
}

mydb = None


# ============================
# CONEXÃO COM O BANCO
# ============================
def get_db_connection():
    """Retorna uma conexão ativa com o MySQL, reconectando se necessário."""
    global mydb

    try:
        if mydb is None or not mydb.is_connected():
            print("Conexão perdida. Reconectando ao MySQL...")
            mydb = mysql.connector.connect(**db_config)
            print("Conexão restabelecida.")

        mydb.ping(reconnect=True, attempts=1, delay=0)

    except mysql.connector.Error as err:
        print(f"Erro ao conectar/reconectar ao MySQL: {err}")
        try:
            mydb = mysql.connector.connect(**db_config)
            print("Conexão restabelecida (forçada).")
        except Exception as e:
            print(f"Falha crítica ao reconectar: {e}")
            return None

    return mydb


# ============================
# CONVERSÕES DE TIPOS PARA JSON
# ============================
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


# ============================
# CONSULTAS SQL
# ============================
def fetch_all(query, params=None):
    """Executa SELECT retornando múltiplos registros."""
    db = get_db_connection()
    if db is None:
        return []

    cursor = db.cursor(dictionary=True)
    cursor.execute(query, params or ())
    result = cursor.fetchall()
    cursor.close()
    return result


def fetch_one(query, params=None):
    """Executa SELECT retornando um único registro."""
    db = get_db_connection()
    if db is None:
        return None

    cursor = db.cursor(dictionary=True)
    cursor.execute(query, params or ())
    result = cursor.fetchone()
    cursor.close()
    return result


def execute_query(query, params=None):
    """Executa INSERT, UPDATE ou DELETE."""
    db = get_db_connection()
    if db is None:
        return None

    cursor = db.cursor()
    cursor.execute(query, params or ())
    db.commit()
    last_row_id = cursor.lastrowid
    cursor.close()
    return last_row_id
