import { BaseRepository } from './BaseRepository.js';
import { Database } from '../db/db.js';

export class SuperAdminRepository extends BaseRepository {
    constructor() {
        super();
        this.db = Database.getInstance();
    }
    async insert({ user_id }) {
        const result = await this.db.executeQuery(
            'INSERT INTO super_admins (user_id) VALUES ($1) RETURNING *;',
            [user_id]
        );
        return result.rows[0];
    }
    async findAll() {
        const result = await this.db.executeQuery('SELECT * FROM super_admins;');
        return result.rows;
    }
}