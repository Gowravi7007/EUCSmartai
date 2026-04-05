import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [faults, setFaults] = useState([]);
  const [ledger, setLedger] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:3000';

  // Setup Polling
  useEffect(() => {
    const fetchData = async () => {
      try {
        const faultsRes = await axios.get(`${API_URL}/api/faults`);
        setFaults(faultsRes.data);
        const ledgerRes = await axios.get(`${API_URL}/api/ledger`);
        setLedger(ledgerRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    
    fetchData();
    const interval = setInterval(fetchData, 3000); // Poll every 3 seconds
    return () => clearInterval(interval);
  }, []);

  const dispatchUpdate = async () => {
    try {
      await axios.post(`${API_URL}/api/updates`, {
        version: "1.1",
        firmware_name: "Antigravity_Patch_v1.1"
      });
      alert('Secure Update Dispatched & Anchored to Blockchain');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="header">
        <h1><span>⚡</span> OEM Central Dashboard</h1>
        <button className="btn primary" onClick={dispatchUpdate}>
          Dispatch Secure OTA Update
        </button>
      </div>

      <div className="grid">
        <div className="main-panel">
          <div className="glass-card">
            <h2>Active High-Priority Faults</h2>
            <div className="fault-list">
              {faults.length === 0 ? <p>No faults detected in fleet.</p> : null}
              {faults.map(fault => (
                <div key={fault.id} className={`fault-item ${fault.status === 'PATCH_DISPATCHED' ? 'resolved' : ''}`}>
                  <div className="fault-info">
                    <h3>{fault.dtc_code} - {fault.model} ({fault.vehicle_id})</h3>
                    <p>{fault.description}</p>
                    <div className="hash-display" style={{marginTop: '0.5rem'}}>
                      Signature Hash: {fault.hash}
                    </div>
                  </div>
                  <div className="fault-meta">
                    <div className="timer">
                      {fault.status === 'PENDING' ? 'ACTION REQ' : 'RESOLVED'}
                    </div>
                    <span style={{color: 'var(--text-secondary)', fontSize: '0.8rem'}}>
                      {new Date(fault.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="side-panel">
          <div className="glass-card" style={{marginBottom: '1rem'}}>
            <h2>Blockchain Ledger</h2>
            <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
              {ledger.map(block => (
                <div key={block.id} style={{padding: '0.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: '4px'}}>
                  <strong style={{color: 'var(--accent-cyan)'}}>Block #{block.id} - v{block.version}</strong>
                  <div className="hash-display" style={{fontSize: '0.7rem', marginTop: '4px'}}>
                    Hash: {block.hash.substring(0,16)}...
                  </div>
                  <div style={{fontSize: '0.75rem', marginTop: '4px', color: 'var(--accent-green)'}}>
                    Status: {block.ai_flag} (PQC Signed)
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
