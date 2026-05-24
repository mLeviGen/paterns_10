// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';

export default function AdminPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewingUser, setViewingUser] = useState(null); 

    const loadUsers = () => {
        fetch('/api/users')
            .then(res => res.json())
            .then(data => {
                setUsers(data);
                setLoading(false);
            })
            .catch(err => console.error("Помилка завантаження даних:", err));
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleRoleChange = async (userId, newRole) => {
        try {
            let res;
            if (newRole === 'ADMIN') {
                res = await fetch('/api/admins', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId })
                });
            } else if (newRole === 'USER') {
                res = await fetch(`/api/admins/${userId}`, { method: 'DELETE' });
            }

            if (res && res.ok) {
                loadUsers();
            } else {
                const errorData = await res.json();
                alert(`Помилка СУБД: ${errorData.error || 'Невідома помилка сервера'}`);
                loadUsers(); 
            }
        } catch (err) {
            console.error("Помилка мережі:", err);
            alert("Немає зв'язку з бекенд-сервером");
            loadUsers();
        }
    };

    if (loading) return <div style={{ color: '#000000', padding: '20px' }}>Завантаження даних з PostgreSQL...</div>;

    return (
        <div style={{ background: '#ffffff', padding: '20px', borderRadius: '8px', color: '#000000', border: '1px solid #e0e0e0', position: 'relative' }}>
            <h2>Панель Адміністратора</h2>
            
            <table style={{ width: '100%', marginTop: '15px', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                    <tr>
                        <th style={{ padding: '10px' }}>ID</th>
                        <th style={{ padding: '10px' }}>Користувач</th>
                        <th style={{ padding: '10px' }}>Email</th>
                        <th style={{ padding: '10px' }}>Зміна ролі</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => {
                        const currentRole = user.isSuperAdmin ? 'SUPER_ADMIN' : user.isAdmin ? 'ADMIN' : 'USER';
                        
                        return (
                            <tr key={user.id} style={{ borderBottom: '1px solid #e0e0e0' }}>
                                <td style={{ padding: '10px' }}>{user.id}</td>
                                <td style={{ padding: '10px' }}>
                                    <span 
                                        onClick={() => setViewingUser(user)}
                                        style={{ color: '#007acc', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline' }}
                                        title="Натисніть для перегляду профілю"
                                    >
                                        {user.name}
                                    </span>
                                </td>
                                <td style={{ padding: '10px' }}>{user.email}</td>
                                <td style={{ padding: '10px' }}>
                                    {user.isSuperAdmin ? (
                                        <span style={{ color: '#d9534f', fontWeight: 'bold', fontSize: '14px' }}>SUPER ADMIN</span>
                                    ) : (
                                        <select 
                                            value={currentRole} 
                                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                            style={{ padding: '5px 10px', background: '#ffffff', color: '#000000', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer', fontWeight: '500' }}
                                        >
                                            <option value="USER">USER</option>
                                            <option value="ADMIN">ADMIN</option>
                                        </select>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            {viewingUser && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div style={{ background: '#ffffff', padding: '25px', borderRadius: '8px', width: '400px', color: '#000000', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', border: '1px solid #e0e0e0' }}>
                        <h3 style={{ marginTop: 0, borderBottom: '2px solid #007acc', paddingBottom: '10px', color: '#007acc' }}>
                            Профіль користувача
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', margin: '20px 0', fontSize: '15px' }}>
                            <div><strong>ID в системі:</strong> {viewingUser.id}</div>
                            <div><strong>Ім'я:</strong> {viewingUser.name}</div>
                            <div><strong>Електронна пошта:</strong> {viewingUser.email}</div>
                            <div><strong>Поточна роль:</strong> {viewingUser.isSuperAdmin ? 'SUPER ADMIN' : viewingUser.isAdmin ? 'ADMIN' : 'USER'}</div>
                            <div><strong>Дата реєстрації:</strong> {`2026-04-${String(10 + (viewingUser.id % 20)).padStart(2, '0')}`}</div>
                        </div>
                        <button 
                            onClick={() => setViewingUser(null)}
                            style={{ background: '#007acc', color: '#ffffff', border: 'none', padding: '10px 20px', width: '100%', cursor: 'pointer', fontWeight: 'bold', borderRadius: '4px' }}
                        >
                            Закрити профіль
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}