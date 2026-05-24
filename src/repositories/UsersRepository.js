import { BaseRepository } from './BaseRepository.js';
import { Database } from '../db/db.js';

export class UsersRepository extends BaseRepository {
    constructor() {
        super();
        this.db = Database.getInstance();
    }
    async insert({ name, email }) {
        const result = await this.db.executeQuery(
            'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *;',
            [name, email]
        );
        return result.rows[0];
    }
    async findAll() {
        const result = await this.db.executeQuery('SELECT * FROM users;');
        return result.rows;
    }
    async update(id, { name, email }) {
        const result = await this.db.executeQuery(
            'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *;',
            [name, email, id]
        );
        return result.rows[0];
    }
}