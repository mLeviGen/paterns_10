import { UsersRepository } from '../repositories/UsersRepository.js';
import { AdminRepository } from '../repositories/AdminRepository.js';
import { SuperAdminRepository } from '../repositories/SuperAdminRepository.js';

export class UsersService {
    constructor() {
        this.usersRepository = new UsersRepository();
        this.adminsRepository = new AdminRepository();
        this.superAdminsRepository = new SuperAdminRepository();
    }
    async createUser(user) { return await this.usersRepository.insert(user); }
    async getAllUsers() { return await this.usersRepository.findAll(); }
    async updateUser(id, data) { return await this.usersRepository.update(id, data); }
    async isAdmin(userId) {
        const admins = await this.adminsRepository.findAll();
        return admins.some(admin => admin.user_id === userId);
    }
    async isSuperAdmin(userId) {
        const superAdmins = await this.superAdminsRepository.findAll();
        return superAdmins.some(sa => sa.user_id === userId);
    }
}