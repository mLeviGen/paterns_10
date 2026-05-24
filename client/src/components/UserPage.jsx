// eslint-disable-next-line no-unused-vars
import React, { useState, useMemo } from 'react'; 
import { debounce } from '../utils/optimization';

export default function UserPage() {
    const [profile, setProfile] = useState({
        username: 'Дмитро',
        email: 'dmytro.vsl@mail.com',
        age: 21,
        bio: 'Майбутній інженер.'
    });
    const [statusMessage, setStatusMessage] = useState('');
    const [draftStatus, setDraftStatus] = useState('Усі зміни збережено локально');

    const saveDraftText = (text) => {
        setDraftStatus(`Автозбереження чернетки біографії... (${text.length} симв.)`);
    };

    const debouncedSaveDraft = useMemo(
        () => debounce((text) => saveDraftText(text), 1000),
        []
    );

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setProfile((prev) => ({ ...prev, [name]: value }));

        if (name === 'bio') {
            setDraftStatus('Печатає...');
            debouncedSaveDraft(value);
        }
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
                setStatusMessage(`Успішно збережено в СУБД! ID: ${data.user.id}`);
                setDraftStatus('Усі зміни синхронізовано з PostgreSQL');
            } else {
                setStatusMessage(`Помилка: ${data.error}`);
            }
        } catch (err) {
            setStatusMessage(`Не вдалося з\`єднатися з сервером. ${err.message}`);
        }
    };

    return (
        <div style={{ background: '#ffffff', padding: '20px', borderRadius: '8px', color: '#000000', border: '1px solid #e0e0e0' }}>
            <h2>Кабінет Користувача (ПР10 Оптимізація)</h2>
            <p style={{ color: '#666', fontSize: '14px' }}><strong>Статус чернетки:</strong> {draftStatus}</p>
            
            <form onSubmit={handleSaveToDb} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px' }}>
                <label style={{ fontWeight: 'bold' }}>
                    Ім'я користувача: <br />
                    <input type="text" name="username" value={profile.username} onChange={handleInputChange} style={{ padding: '8px', width: '100%', background: '#ffffff', color: '#000000', border: '1px solid #ccc', borderRadius: '4px', marginTop: '5px' }} required />
                </label>
                <label style={{ fontWeight: 'bold' }}>
                    Електронна пошта: <br />
                    <input type="email" name="email" value={profile.email} onChange={handleInputChange} style={{ padding: '8px', width: '100%', background: '#ffffff', color: '#000000', border: '1px solid #ccc', borderRadius: '4px', marginTop: '5px' }} required />
                </label>
                <label style={{ fontWeight: 'bold' }}>
                    Біографія (Зона дії Debounce): <br />
                    <textarea name="bio" value={profile.bio} onChange={handleInputChange} rows="3" style={{ padding: '8px', width: '100%', background: '#ffffff', color: '#000000', border: '1px solid #ccc', borderRadius: '4px', marginTop: '5px', resize: 'none' }} />
                </label>
                <button type="submit" style={{ background: '#007acc', color: '#ffffff', border: 'none', padding: '10px', cursor: 'pointer', fontWeight: 'bold', borderRadius: '4px', marginTop: '10px' }}>
                    Надіслати інпути до PostgreSQL
                </button>
            </form>
            {statusMessage && <div style={{ marginTop: '15px', padding: '10px', background: '#eef7ff', color: '#0055aa', borderRadius: '4px', fontWeight: 'bold' }}>{statusMessage}</div>}
        </div>
    );
}