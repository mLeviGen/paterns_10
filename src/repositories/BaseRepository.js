export class BaseRepository {
    async insert(data) { throw new Error("Метод insert() не реалізовано!"); }
    async findById(id) { throw new Error("Метод findById() не реалізовано!"); }
    async findAll() { throw new Error("Метод findAll() не реалізовано!"); }
    async update(id, data) { throw new Error("Метод update() не реалізовано!"); }
    async delete(id) { throw new Error("Метод delete() не реалізовано!"); }
}