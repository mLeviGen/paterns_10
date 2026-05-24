import pkg from 'pg';
const { Pool } = pkg;

export class Database {
    static #instance = null;
    #pool;

    constructor() {
        if (Database.#instance) return Database.#instance;
        
        this.#pool = new Pool({
            user: 'postgres',
            host: 'localhost',
            database: 'patterns_db',
            password: '1234', 
            port: 5432,
        });

        Database.#instance = this;
    }

    static getInstance() {
        if (!this.#instance) this.#instance = new Database();
        return this.#instance;
    }

    async executeQuery(text, params = []) {
        return await this.#pool.query(text, params);
    }

    async createTables() {
        const queries = [
            `CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );`,
            `CREATE TABLE IF NOT EXISTS admins (
                id SERIAL PRIMARY KEY,
                user_id INTEGER UNIQUE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            );`,
            `CREATE TABLE IF NOT EXISTS super_admins (
                id SERIAL PRIMARY KEY,
                user_id INTEGER UNIQUE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            );`
        ];

        for (const query of queries) {
            await this.executeQuery(query);
        }
    }

    async clearTables() {

    await this.executeQuery('TRUNCATE users RESTART IDENTITY CASCADE;');
}

    async close() {
        await this.#pool.end();
    }
}