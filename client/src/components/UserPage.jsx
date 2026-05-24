    // eslint-disable-next-line no-unused-vars
    import React, { useState } from 'react';

    export default function UserPage() {
        const [profile, setProfile] = useState({
            username: 'Дмитро',
            email: 'dmytro.vsl@mail.com',
            age: 21,
            bio: 'Майбутній інженер, люблю проектувати бази даних.'
        });
        const [statusMessage, setStatusMessage] = useState('');

        const handleInputChange = (event) => {
            const { name, value } = event.target;
            setProfile((prev) => ({
                ...prev,
                [name]: value
            }));
        };

        const handleSaveToDb = async (e) => {
            e.preventDefault();
            setStatusMessage('');
            try {
                const res = await fetch('/api/users/profile', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(profile)
                });
                const data = await res.json();
                if (data.success) {
                    setStatusMessage(`Успішно збережено! Створено користувача з ID: ${data.user.id}`);
                } else {
                    setStatusMessage(`Помилка: ${data.error}`);
                }
            } catch (err) {
                console.error(err);
                setStatusMessage('Не вдалося з\'єднатися з сервером.');
            }
        };

        return (
            <div style={{ background: '#ffffff', padding: '20px', borderRadius: '8px', color: '#000000', border: '1px solid #e0e0e0' }}>
                <h2>Кабінет Користувача</h2>
                
                <form onSubmit={handleSaveToDb} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px' }}>
                    <label style={{ fontWeight: 'bold' }}>
                        Ім'я користувача (name): <br />
                        <input type="text" name="username" value={profile.username} onChange={handleInputChange} style={{ padding: '8px', width: '100%', background: '#ffffff', color: '#000000', border: '1px solid #ccc', borderRadius: '4px', marginTop: '5px' }} required />
                    </label>
                    
                    <label style={{ fontWeight: 'bold' }}>
                        Електронна пошта (email): <br />
                        <input type="email" name="email" value={profile.email} onChange={handleInputChange} style={{ padding: '8px', width: '100%', background: '#ffffff', color: '#000000', border: '1px solid #ccc', borderRadius: '4px', marginTop: '5px' }} required />
                    </label>

                    <div style={{ display: 'flex', gap: '15px' }}>
                        <label style={{ fontWeight: 'bold', flex: 1 }}>
                            Вік (age): <br />
                            <input type="number" name="age" value={profile.age} onChange={handleInputChange} style={{ padding: '8px', width: '100%', background: '#ffffff', color: '#000000', border: '1px solid #ccc', borderRadius: '4px', marginTop: '5px' }} />
                        </label>
                    </div>

                    <label style={{ fontWeight: 'bold' }}>
                        Біографія (bio): <br />
                        <textarea name="bio" value={profile.bio} onChange={handleInputChange} rows="3" style={{ padding: '8px', width: '100%', background: '#ffffff', color: '#000000', border: '1px solid #ccc', borderRadius: '4px', marginTop: '5px', resize: 'none' }} />
                    </label>

                    <button type="submit" style={{ background: '#007acc', color: '#ffffff', border: 'none', padding: '10px', cursor: 'pointer', fontWeight: 'bold', borderRadius: '4px', marginTop: '10px' }}>
                        Створити профіль
                    </button>
                </form>

                {statusMessage && (
                    <div style={{ marginTop: '15px', padding: '10px', background: statusMessage.includes('🎉') ? '#eef7ff' : '#fdeeed', color: statusMessage.includes('🎉') ? '#0055aa' : '#cc0000', borderRadius: '4px', fontWeight: 'bold', border: `1px solid ${statusMessage.includes('🎉') ? '#bce0fd' : '#f8baba'}` }}>
                        {statusMessage}
                    </div>
                )}
            </div>
        );
    }