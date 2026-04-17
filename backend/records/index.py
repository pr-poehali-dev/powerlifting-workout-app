"""
Личные рекорды пользователя: получение, добавление.
"""
import json
import os
from datetime import date
import psycopg2

SCHEMA = os.environ.get('MAIN_DB_SCHEMA', 't_p29988202_powerlifting_workout')
CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
}


def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def get_user_id(token: str) -> int | None:
    conn = get_conn()
    cur = conn.cursor()
    cur.execute(
        f"SELECT user_id FROM {SCHEMA}.sessions WHERE token = %s AND expires_at > NOW()",
        (token,)
    )
    row = cur.fetchone()
    conn.close()
    return row[0] if row else None


def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    headers = {**CORS, 'Content-Type': 'application/json'}
    method = event.get('httpMethod', 'GET')
    token = event.get('headers', {}).get('X-Auth-Token') or event.get('headers', {}).get('x-auth-token')

    if not token:
        return {'statusCode': 401, 'headers': headers, 'body': json.dumps({'error': 'Требуется авторизация'})}

    user_id = get_user_id(token)
    if not user_id:
        return {'statusCode': 401, 'headers': headers, 'body': json.dumps({'error': 'Сессия истекла'})}

    if method == 'GET':
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f"""SELECT lift, MAX(weight) as best
                FROM {SCHEMA}.personal_records
                WHERE user_id = %s
                GROUP BY lift""",
            (user_id,)
        )
        rows = cur.fetchall()

        cur.execute(
            f"""SELECT lift, weight, recorded_at, notes
                FROM {SCHEMA}.personal_records
                WHERE user_id = %s
                ORDER BY recorded_at DESC""",
            (user_id,)
        )
        history = cur.fetchall()
        conn.close()

        bests = {row[0]: float(row[1]) for row in rows}
        hist_list = [
            {'lift': r[0], 'weight': float(r[1]), 'date': str(r[2]), 'notes': r[3]}
            for r in history
        ]
        return {'statusCode': 200, 'headers': headers, 'body': json.dumps({
            'bests': bests, 'history': hist_list
        })}

    if method == 'POST':
        body = json.loads(event.get('body') or '{}')
        lift = body.get('lift', '').strip()
        weight = body.get('weight')
        notes = body.get('notes', '')
        recorded_at = body.get('date', str(date.today()))

        if not lift or weight is None:
            return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'Укажи упражнение и вес'})}

        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f"INSERT INTO {SCHEMA}.personal_records (user_id, lift, weight, recorded_at, notes) VALUES (%s, %s, %s, %s, %s) RETURNING id",
            (user_id, lift, float(weight), recorded_at, notes)
        )
        rec_id = cur.fetchone()[0]
        conn.commit()
        conn.close()
        return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'id': rec_id, 'ok': True})}

    return {'statusCode': 405, 'headers': headers, 'body': json.dumps({'error': 'Method not allowed'})}
