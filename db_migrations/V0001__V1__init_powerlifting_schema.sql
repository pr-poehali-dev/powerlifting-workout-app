
CREATE TABLE t_p29988202_powerlifting_workout.users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    body_weight DECIMAL(5,2),
    gender VARCHAR(10) DEFAULT 'male',
    weight_category VARCHAR(20),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE t_p29988202_powerlifting_workout.sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES t_p29988202_powerlifting_workout.users(id),
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE t_p29988202_powerlifting_workout.personal_records (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES t_p29988202_powerlifting_workout.users(id),
    lift VARCHAR(50) NOT NULL,
    weight DECIMAL(6,2) NOT NULL,
    recorded_at DATE DEFAULT CURRENT_DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE t_p29988202_powerlifting_workout.workout_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES t_p29988202_powerlifting_workout.users(id),
    name VARCHAR(200) NOT NULL,
    completed_at TIMESTAMP DEFAULT NOW(),
    duration_minutes INTEGER,
    notes TEXT
);

CREATE TABLE t_p29988202_powerlifting_workout.workout_sets (
    id SERIAL PRIMARY KEY,
    workout_id INTEGER REFERENCES t_p29988202_powerlifting_workout.workout_logs(id),
    exercise_name VARCHAR(100) NOT NULL,
    set_number INTEGER NOT NULL,
    weight DECIMAL(6,2) NOT NULL,
    reps INTEGER NOT NULL,
    completed BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_sessions_token ON t_p29988202_powerlifting_workout.sessions(token);
CREATE INDEX idx_records_user ON t_p29988202_powerlifting_workout.personal_records(user_id);
CREATE INDEX idx_workout_logs_user ON t_p29988202_powerlifting_workout.workout_logs(user_id);
