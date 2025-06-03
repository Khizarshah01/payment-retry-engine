import React, { useState } from 'react';
import { processPayment } from './utils/processPayment';
import { retryWithBackoff } from './utils/retryLogic'
import './App.css';

function App() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [networkSpeed, setNetworkSpeed] = useState("normal");
  const [stats, setStats] = useState({
    successRate: 0,
    totalAttempts: 0,
    totalSuccess: 0,
    avgRetries: 0,
  });

  const addLog = (message, type = 'info') => {
     const colors = {
    success: '#27ae60', // green
    error: '#e74c3c',   // red
    info: '#3498db',    // blue
    warning: '#f39c12'  // orange
  };
    
  setLogs(prev => [...prev, { text: message, color: colors[type] }]);
  };

  // Update after each payment
  const updateStats = (success) => {
    setStats((prev) => {
      const newAttempts = prev.totalAttempts + 1;
      const newSuccess = success ? prev.totalSuccess+1 : prev.totalSuccess;
      const newSuccesses = success ? prev.successRate * prev.totalAttempts + 1 : prev.successRate * prev.totalAttempts;
      return {
        successRate: newSuccess * 100 / newAttempts,
        totalAttempts: newAttempts,
        totalSuccess: newSuccess,
        avgRetries: prev.avgRetries, 
      };
    });
  };

  const handleStartPayment = async () => {
  setLogs([]);
  setLoading(true);
  const idempotencyKey = "idemp_" + Date.now();
  addLog(`Starting payment (Idempotency Key: ${idempotencyKey})...`, 'info');

  const result = await retryWithBackoff(
    () => processPayment(idempotencyKey, networkSpeed), 
    3,
    networkSpeed === "slow" ? 2000 : 1000,
    (msg) => addLog(msg, 'info')
  );

  if(result.status === 'FAILED') {
    addLog(`Final result: ${result.status}`, 'error');
  } else {
    addLog(`Final result: ${result.status}`, 'success');
  }
  
  updateStats(result.status === "SUCCESS"); 
  setLoading(false);
};

  return (
  <div className="app-container">
    <div className="app-header">
      <h1>Smart Payment Retry Engine</h1>
    </div>
    
    <div className="controls">
      <select
        className="network-select"
        value={networkSpeed}
        onChange={(e) => setNetworkSpeed(e.target.value)}
      >
        <option value="normal">Normal Network</option>
        <option value="slow">Slow Network (3G)</option>
      </select>
      <button 
        className="payment-button"
        onClick={handleStartPayment} 
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Start Payment'}
      </button>
    </div>

    <div className="stats-panel">
      <h3>Stats</h3>
      <div className="stats-item">
        <span className="stats-label">Success Rate:</span>
        <span className="stats-value">{stats.successRate.toFixed(1)}%</span>
      </div>
      <div className="stats-item">
        <span className="stats-label">Total Attempts:</span>
        <span className="stats-value">{stats.totalAttempts}</span>
      </div>
      <div className="stats-item">
        <span className="stats-label">Total Success:</span>
        <span className="stats-value">{stats.totalSuccess}</span>
      </div>
    </div>

  <div className="logs-panel">
  <h3>Transaction Log</h3>
  {logs.map((log, i) => (
    <div key={i} className="log-entry" style={{ color: log.color }}>
      {log.text}
    </div>
  ))}
</div>
  </div>
);
}

export default App;