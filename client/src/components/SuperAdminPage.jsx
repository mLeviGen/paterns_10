// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';

export default function SuperAdminPage() {
    const [dbStatus, setDbStatus] = useState('CHECKING...');
    const [logs, setLogs] = useState([
        '[SYSTEM] Пул з\'єднань PostgreSQL успішно ініціалізовано.',
        '[INFO] Створено таблиці users, admins, super_admins за принципом LSP.'
    ]);

    useEffect(() => {
        const checkStatus = () => {
            fetch('/api/system/status')
                .then(res => res.json())
                .then(data => setDbStatus(data.status))
                .catch(() => setDbStatus('DISCONNECTED'));
        };

        checkStatus();
        const interval = setInterval(checkStatus, 3000);
        return () => clearInterval(interval);
    }, []);

    const triggerWipe = async () => {
        if (window.confirm("Ви впевнені, що хочете виконати реальний TRUNCATE всіх таблиць у вашій системі PostgreSQL?")) {
            try {
                const res = await fetch('/api/system/wipe', { method: 'POST' });
                const data = await res.json();
                if (data.success) {
                    setLogs([...logs, `[CRITICAL] [${new Date().toLocaleTimeString()}] ${data.message}`]);
                }
            } catch (err) {
                console.error(err);
                setLogs([...logs, '[ERROR] Не вдалося виконати очищення бази даних.']);
            }
        }
    };

    return (
        <div style={{ background: '#ffffff', padding: '20px', borderRadius: '8px', color: '#000000', border: '1px solid #e0e0e0' }}>
            <h2>Консоль Супер-Адміністратора</h2>
            
            <div style={{ display: 'flex', gap: '20px', marginTop: '15px' }}>
                <div style={{ background: '#f9f9f9', padding: '15px', borderRadius: '6px', flex: 1, border: '1px solid #e0e0e0' }}>
                    <h4 style={{ margin: '0 0 10px 0' }}>
                        Статус СУБД:{' '}
                        <span style={{ color: dbStatus === 'CONNECTED' ? '#5cb85c' : '#d9534f', fontWeight: 'bold' }}>
                            {dbStatus}
                        </span>
                    </h4>
                    <p style={{ margin: '5px 0', fontSize: '14px' }}>Провайдер: PostgreSQL (WSL Ubuntu)</p>
                    <button 
                        onClick={triggerWipe}
                        style={{ background: '#d9534f', color: '#ffffff', border: 'none', padding: '10px', width: '100%', cursor: 'pointer', fontWeight: 'bold', marginTop: '15px', borderRadius: '4px' }}
                    >
                        Очистити СУБД (TRUNCATE)
                    </button>
                </div>

                <div style={{ background: '#f5f5f5', padding: '15px', borderRadius: '6px', flex: 2, fontFamily: 'monospace', border: '1px solid #e0e0e0' }}>
                    <h4 style={{ color: '#555555', marginTop: 0, marginBottom: '10px' }}>Системні Логи (System Logs):</h4>
                    <div style={{ height: '110px', overflowY: 'auto', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        {logs.map((log, index) => (
                            <div key={index} style={{ color: log.includes('CRITICAL') ? '#d9534f' : '#555555' }}>{log}</div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}