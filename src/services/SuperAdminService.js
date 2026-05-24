import { SuperAdminRepository } from '../repositories/SuperAdminRepository.js';

export class SuperAdminService {
    constructor() { this.superAdminRepository = new SuperAdminRepository(); }
    async createSuperAdmin(sa) { return await this.superAdminRepository.insert(sa); }
    async getAllSuperAdmins() { return await this.superAdminRepository.findAll(); }
}