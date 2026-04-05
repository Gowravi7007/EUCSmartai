import React, { useState } from 'react';
import axios from 'axios';

function App() {
    const [logs, setLogs] = useState(["[System] Vehicle Telemetry Online.", "[OBD-2] Listening for diagnostic codes..."]);

    const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:3000';

    const addLog = (msg, type = "info") => {
        setLogs(prev => [...prev, { msg, type }]);
    };

    const simulateFault = async () => {
        try {
            addLog("Detecting anomalies...");
            // We manually hit the backend to simulate a fault and return it
            const res = await axios.get(`${API_URL}/api/simulate-fault`);
            const { fault, hash } = res.data;

            setTimeout(() => addLog(`[Fault Detected] ${fault.dtc_code}: ${fault.description}`, 'err'), 500);
            setTimeout(() => addLog(`[Integrity] SHA-256 Hash Generated: ${hash}`, 'warn'), 1000);
            setTimeout(() => addLog(`[Network] Dispatching encrypted log to Manufacturer dashboard...`, 'info'), 1500);
            setTimeout(() => addLog(`[Success] Payload delivered securely.`, 'info'), 2500);

        } catch (err) {
            addLog(`[Error] Unable to communicate with OEM servers.`, 'err');
        }
    };

    return (
        <div className="simulator-container">
            <div className="header">
                <h1>Vehicle Client Emulator</h1>
                <p>OBD-2 Port Simulation & Hardware Feedback</p>
            </div>

            <button className="btn" onClick={simulateFault}>
                Inject Simulated Fault (India Config)
            </button>

            <div style={{ marginTop: '2rem' }}>
                <h3 style={{ marginBottom: '0.5rem', fontSize: '1rem', color: 'var(--text-secondary)' }}>System Console</h3>
                <div className="console">
                    {logs.map((log, i) => {
                        if (typeof log === 'string') return <p key={i}>{log}</p>;
                        return <p key={i} className={log.type}>{log.msg}</p>;
                    })}
                </div>
            </div>
        </div>
    );
}

export default App;
