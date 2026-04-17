"""
Авторизация пользователей: регистрация, вход, выход, проверка сессии.
"""
import json
import os
import hashlib
import secrets
from datetime import datetime, timedelta
import psycopg2

SCHEMA = os.environ.get('MAIN_DB_SCHEMA', 't_p29988202_powerlifting_workout')
CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
}


def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


def make_token() -> str:
    return secrets.token_hex(32)


def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    path = event.get('path', '/')
    method = event.get('httpMethod', 'GET')
    body = json.loads(event.get('body') or '{}')

    headers = {**CORS, 'Content-Type': 'application/json'}

    if path.endswith('/register') and method == 'POST':
        email = body.get('email', '').strip().lower()
        password = body.get('password', '')
        name = body.get('name', '').strip()

        if not email or not password or not name:
            return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'Заполни все поля'})}
        if len(password) < 6:
            return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'Пароль минимум 6 символов'})}

        conn = get_conn()
        cur = conn.cursor()
        cur.execute(f"SELECT id FROM {SCHEMA}.users WHERE email = %s", (email,))
        if cur.fetchone():
            conn.close()
            return {'statusCode': 409, 'headers': headers, 'body': json.dumps({'error': 'Email уже зарегистрирован'})}

        pw_hash = hash_password(password)
        cur.execute(
            f"INSERT INTO {SCHEMA}.users (email, password_hash, name) VALUES (%s, %s, %s) RETURNING id",
            (email, pw_hash, name)
        )
        user_id = cur.fetchone()[0]

        token = make_token()
        expires = datetime.utcnow() + timedelta(days=30)
        cur.execute(
            f"INSERT INTO {SCHEMA}.sessions (user_id, token, expires_at) VALUES (%s, %s, %s)",
            (user_id, token, expires)
        )
        conn.commit()
        conn.close()

        return {'statusCode': 200, 'headers': headers, 'body': json.dumps({
            'token': token,
            'user': {'id': user_id, 'name': name, 'email': email}
        })}

    if path.endswith('/login') and method == 'POST':
        email = body.get('email', '').strip().lower()
        password = body.get('password', '')

        conn = get_conn()
        cur = conn.cursor()
        pw_hash = hash_password(password)
        cur.execute(
            f"SELECT id, name, email, body_weight, gender, weight_category FROM {SCHEMA}.users WHERE email = %s AND password_hash = %s",
            (email, pw_hash)
        )
        row = cur.fetchone()
        if not row:
            conn.close()
            return {'statusCode': 401, 'headers': headers, 'body': json.dumps({'error': 'Неверный email или пароль'})}

        user_id, name, user_email, bw, gender, cat = row
        token = make_token()
        expires = datetime.utcnow() + timedelta(days=30)
        cur.execute(
            f"INSERT INTO {SCHEMA}.sessions (user_id, token, expires_at) VALUES (%s, %s, %s)",
            (user_id, token, expires)
        )
        conn.commit()
        conn.close()

        return {'statusCode': 200, 'headers': headers, 'body': json.dumps({
            'token': token,
            'user': {
                'id': user_id, 'name': name, 'email': user_email,
                'body_weight': float(bw) if bw else None,
                'gender': gender, 'weight_category': cat
            }
        })}

    if path.endswith('/me') and method == 'GET':
        token = event.get('headers', {}).get('X-Auth-Token') or event.get('headers', {}).get('x-auth-token')
        if not token:
            return {'statusCode': 401, 'headers': headers, 'body': json.dumps({'error': 'Нет токена'})}

        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f"""SELECT u.id, u.name, u.email, u.body_weight, u.gender, u.weight_category
                FROM {SCHEMA}.sessions s
                JOIN {SCHEMA}.users u ON s.user_id = u.id
                WHERE s.token = %s AND s.expires_at > NOW()""",
            (token,)
        )
        row = cur.fetchone()
        conn.close()
        if not row:
            return {'statusCode': 401, 'headers': headers, 'body': json.dumps({'error': 'Сессия истекла'})}

        uid, name, email, bw, gender, cat = row
        return {'statusCode': 200, 'headers': headers, 'body': json.dumps({
            'user': {'id': uid, 'name': name, 'email': email,
                     'body_weight': float(bw) if bw else None,
                     'gender': gender, 'weight_category': cat}
        })}

    return {'statusCode': 404, 'headers': headers, 'body': json.dumps({'error': 'Not found'})}
