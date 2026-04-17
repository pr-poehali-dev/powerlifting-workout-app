"""
Профиль пользователя: получение и обновление данных (вес тела, категория, имя).
"""
import json
import os
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
            f"SELECT id, name, email, body_weight, gender, weight_category, created_at FROM {SCHEMA}.users WHERE id = %s",
            (user_id,)
        )
        row = cur.fetchone()

        cur.execute(f"SELECT COUNT(*) FROM {SCHEMA}.workout_logs WHERE user_id = %s", (user_id,))
        workouts_count = cur.fetchone()[0]

        cur.execute(
            f"SELECT lift, MAX(weight) FROM {SCHEMA}.personal_records WHERE user_id = %s GROUP BY lift",
            (user_id,)
        )
        records = {r[0]: float(r[1]) for r in cur.fetchall()}
        conn.close()

        if not row:
            return {'statusCode': 404, 'headers': headers, 'body': json.dumps({'error': 'Пользователь не найден'})}

        uid, name, email, bw, gender, cat, created = row
        total = sum(records.get(k, 0) for k in ['squat', 'bench', 'deadlift'])
        return {'statusCode': 200, 'headers': headers, 'body': json.dumps({
            'id': uid, 'name': name, 'email': email,
            'body_weight': float(bw) if bw else None,
            'gender': gender, 'weight_category': cat,
            'created_at': str(created),
            'workouts_count': workouts_count,
            'records': records,
            'total': total
        })}

    if method == 'POST':
        body = json.loads(event.get('body') or '{}')
        name = body.get('name')
        bw = body.get('body_weight')
        gender = body.get('gender')
        cat = body.get('weight_category')

        conn = get_conn()
        cur = conn.cursor()
        if name:
            cur.execute(f"UPDATE {SCHEMA}.users SET name = %s WHERE id = %s", (name, user_id))
        if bw is not None:
            cur.execute(f"UPDATE {SCHEMA}.users SET body_weight = %s WHERE id = %s", (float(bw), user_id))
        if gender:
            cur.execute(f"UPDATE {SCHEMA}.users SET gender = %s WHERE id = %s", (gender, user_id))
        if cat:
            cur.execute(f"UPDATE {SCHEMA}.users SET weight_category = %s WHERE id = %s", (cat, user_id))
        cur.execute(f"UPDATE {SCHEMA}.users SET updated_at = NOW() WHERE id = %s", (user_id,))
        conn.commit()
        conn.close()
        return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'ok': True})}

    return {'statusCode': 405, 'headers': headers, 'body': json.dumps({'error': 'Method not allowed'})}
