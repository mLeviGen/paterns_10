import { BaseRepository } from './BaseRepository.js';
import { Database } from '../db/db.js';

export class AdminRepository extends BaseRepository {
    constructor() {
        super();
        this.db = Database.getInstance();
    }
    async insert({ user_id }) {
        const result = await this.db.executeQuery(
            'INSERT INTO admins (user_id) VALUES ($1) RETURNING *;',
            [user_id]
        );
        return result.rows[0];
    }
    async findAll() {
        const result = await this.db.executeQuery('SELECT * FROM admins;');
        return result.rows;
    }
    async deleteByUserId(userId) {
        const result = await this.db.executeQuery(
            'DELETE FROM admins WHERE user_id = $1 RETURNING *;',
            [userId]
        );
        return result.rows[0];
    }
}