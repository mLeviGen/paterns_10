import express from 'express';
import { UsersService } from './src/services/UsersService.js';
import { AdminsService } from './src/services/AdminsService.js';
import { SuperAdminService } from './src/services/SuperAdminService.js';
import { Database } from './src/db/db.js';

const app = express();
const PORT = 5000;

app.use(express.json());

const db = Database.getInstance();
const usersService = new UsersService();
const adminsService = new AdminsService();
const superAdminService = new SuperAdminService();

await db.createTables();

app.get('/api/users', async (req, res) => {
    try {
        const users = await usersService.getAllUsers();
        const enrichedUsers = await Promise.all(users.map(async (user) => ({
            ...user,
            isAdmin: await usersService.isAdmin(user.id),
            isSuperAdmin: await usersService.isSuperAdmin(user.id)
        })));
        res.json(enrichedUsers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/users', async (req, res) => {
    try {
        const { name, email } = req.body;
        const newUser = await usersService.createUser({ name, email });
        res.json(newUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/admins/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        await adminsService.deleteAdmin(parseInt(userId));
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/admins', async (req, res) => {
    try {
        const { userId } = req.body;
        const idNum = parseInt(userId);
        
        await adminsService.createAdmin({ 
            userId: idNum, 
            user_id: idNum, 
            id: idNum 
        }); 
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/system/status', async (req, res) => {
    try {
        const db = Database.getInstance();
        await db.executeQuery('SELECT 1;'); 
        res.json({ status: 'CONNECTED' });
    } catch (err) {
        res.json({ status: 'DISCONNECTED' });
    }
});

app.listen(PORT, () => {
    console.log(`Бэкенд-сервер Express запущен на http://localhost:${PORT}`);
});

app.post('/api/users/profile', async (req, res) => {
    try {
        const { username, email } = req.body;
        
        if (!email) {
            return res.status(400).json({ error: "Email є обов'язковим полем для PostgreSQL!" });
        }
        const newUser = await usersService.createUser({ 
            name: username, 
            email: email 
        });
        res.json({ success: true, user: newUser });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/system/wipe', async (req, res) => {
    try {
        await db.clearTables();
        res.json({ success: true, message: 'Усі таблиці очищені.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});