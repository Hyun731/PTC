from sqlalchemy import create_engine, text

user = "user"
passwd = "1234"
host = "localhost"
port = "3306"
db = "kikko"

DB_URL = f'mysql+pymysql://{user}:{passwd}@{host}:{port}/{db}?charset=utf8'

engine = create_engine(DB_URL, echo=True)
def execute_sql(query, params=None, fetch: bool = True, return_insert_id: bool = False):
    with engine.begin() as conn:
        result = conn.execute(text(query), params or {})
        if return_insert_id:
            return result.lastrowid
        elif fetch:
            return result.mappings().all()
        else:
            return None