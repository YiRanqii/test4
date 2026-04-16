import React, { useState, useEffect } from 'react'
import { alertColors } from './AlertEffects'

function AlertPanel({ alerts }) {
  const [visibleAlerts, setVisibleAlerts] = useState(alerts)
  const [dismissedAlerts, setDismissedAlerts] = useState([])

  useEffect(() => {
    setVisibleAlerts(alerts.filter(a => !dismissedAlerts.includes(a.id)))
  }, [alerts, dismissedAlerts])

  const dismissAlert = (id) => {
    setDismissedAlerts(prev => [...prev, id])
  }

  const getLevelIcon = (level) => {
    switch (level) {
      case 'critical': return '🔴'
      case 'warning': return '🟡'
      case 'info': return '🔵'
      default: return '⚪'
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'fire': return '🔥'
      case 'structural': return '🏗️'
      case 'energy': return '⚡'
      default: return '⚠️'
    }
  }

  if (visibleAlerts.length === 0) return null

  return (
    <div className="alert-panel">
      <div className="alert-header">
        <h4>⚠️ 预警告警 ({visibleAlerts.length})</h4>
      </div>
      <div className="alert-list">
        {visibleAlerts.map(alert => (
          <div 
            key={alert.id} 
            className={`alert-item ${alert.level}`}
            style={{ borderLeftColor: alertColors[alert.type] }}
          >
            <div className="alert-icon">
              <span className="level-icon">{getLevelIcon(alert.level)}</span>
              <span className="type-icon">{getTypeIcon(alert.type)}</span>
            </div>
            <div className="alert-content">
              <span className="alert-message">{alert.message}</span>
              <span className="alert-time">{new Date().toLocaleTimeString()}</span>
            </div>
            <button 
              className="alert-dismiss"
              onClick={() => dismissAlert(alert.id)}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AlertPanel
