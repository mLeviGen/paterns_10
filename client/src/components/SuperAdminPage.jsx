// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useMemo } from 'react'; 
import { throttle } from '../utils/optimization';

export default function SuperAdminPage() {
    const [dbStatus, setDbStatus] = useState('CHECKING...');
    const [logs, setLogs] = useState([
        '[SYSTEM] Пул з\'єднань PostgreSQL успішно ініціалізовано.',
        '[INFO] Впроваджено лімітери частоти запитів ПР10.'
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

    const executeWipe = async () => {
        if (window.confirm("Ви впевнені, що хочете виконати реальний TRUNCATE всіх таблиць?")) {
            try {
                const res = await fetch('/api/system/wipe', { method: 'POST' });
                const data = await res.json();
                if (data.success) {
                    setLogs(prev => [...prev, `[CRITICAL] [${new Date().toLocaleTimeString()}] ${data.message}`]);
                }
            } catch (err) {
                setLogs(prev => [...prev, `[ERROR] Помилка мережі СУБД. ${err.message}`]);
            }
        }
    };

    const throttledWipe = useMemo(
        () => throttle(() => executeWipe(), 2000),
        []
    );

    return (
        <div style={{ background: '#ffffff', padding: '20px', borderRadius: '8px', color: '#000000', border: '1px solid #e0e0e0' }}>
            <h2>Консоль Супер-Адміністратора (Захист кліка Throttle)</h2>
            <div style={{ display: 'flex', gap: '20px', marginTop: '15px' }}>
                <div style={{ background: '#f9f9f9', padding: '15px', borderRadius: '6px', flex: 1, border: '1px solid #e0e0e0' }}>
                    <h4 element="status">Статус СУБД: <span style={{ color: dbStatus === 'CONNECTED' ? '#5cb85c' : '#d9534f' }}>{dbStatus}</span></h4>
                    <p style={{ fontSize: '13px', color: '#666' }}>Кнопка нижче захищена троттлінгом на 2000мс від спам-кліків.</p>
                    <button 
                        onClick={throttledWipe}
                        style={{ background: '#d9534f', color: '#ffffff', border: 'none', padding: '10px', width: '100%', cursor: 'pointer', fontWeight: 'bold', marginTop: '15px', borderRadius: '4px' }}
                    >
                        Очистити СУБД (TRUNCATE)
                    </button>
                </div>
                <div style={{ background: '#f5f5f5', padding: '15px', borderRadius: '6px', flex: 2, fontFamily: 'monospace', border: '1px solid #e0e0e0' }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#555' }}>Системні Логи:</h4>
                    <div style={{ height: '110px', overflowY: 'auto', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        {logs.map((log, i) => <div key={i} style={{ color: log.includes('CRITICAL') ? '#d9534f' : '#0055aa' }}>{log}</div>)}
                    </div>
                </div>
            </div>
        </div>
    );
}