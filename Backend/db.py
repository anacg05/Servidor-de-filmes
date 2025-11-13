import mysql.connector
import datetime
import decimal

# 🔹 Conexão com o banco MySQL
try:
    mydb = mysql.connector.connect(
        host="localhost",
        user="root",        #  usuário
        password="root",     #  senha
        database="webserver_filmes_anacg"
    )
    print("✅ Conexão com o MySQL estabelecida com sucesso!")
except mysql.connector.Error as err:
    print(f"❌ Erro ao conectar ao MySQL: {err}")
    exit(1)

# 🔹 Conversor de JSON (para lidar com datas/decimais do DB)
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

# 🔹 Funções helper para executar queries
def fetch_all(query, params=None):
    """ Busca múltiplos resultados (ex: SELECT *) """
    cursor = mydb.cursor(dictionary=True)
    cursor.execute(query, params or ())
    result = cursor.fetchall()
    cursor.close()
    return result

def fetch_one(query, params=None):
    """ Busca um único resultado (ex: SELECT ... WHERE id=) """
    cursor = mydb.cursor(dictionary=True)
    cursor.execute(query, params or ())
    result = cursor.fetchone()
    cursor.close()
    return result

def execute_query(query, params=None):
    """ Executa queries de INSERT, UPDATE, DELETE """
    cursor = mydb.cursor()
    cursor.execute(query, params or ())
    mydb.commit()
    last_row_id = cursor.lastrowid
    cursor.close()
    return last_row_id