import React from 'react'

function AlertPanel({ alerts, onAcknowledge }) {
  const getAlertType = (type) => {
    switch (type) {
      case 'fire':
        return { icon: '🔥', color: '#ff4444', label: '火灾预警' }
      case 'power':
        return { icon: '⚡', color: '#ffaa00', label: '电力异常' }
      case 'crowd':
        return { icon: '👥', color: '#ff6600', label: '人员密集' }
      case 'system':
        return { icon: '⚠️', color: '#cc44ff', label: '系统告警' }
      default:
        return { icon: '⚠️', color: '#ff4444', label: '未知告警' }
    }
  }

  const getSeverityClass = (severity) => {
    switch (severity) {
      case 'critical':
        return 'critical'
      case 'warning':
        return 'warning'
      default:
        return 'info'
    }
  }

  return (
    <div className="alert-panel">
      <h3>🚨 实时告警中心</h3>
      
      {alerts.length === 0 ? (
        <div className="no-alerts">
          <div className="no-alerts-icon">✓</div>
          <p>系统运行正常，无告警信息</p>
        </div>
      ) : (
        <div className="alerts-list">
          {alerts.map((alert) => {
            const typeInfo = getAlertType(alert.type)
            return (
              <div key={alert.id} className={`alert-item ${getSeverityClass(alert.severity)}`}>
                <div className="alert-icon">{typeInfo.icon}</div>
                <div className="alert-content">
                  <div className="alert-header">
                    <span className="alert-type" style={{ color: typeInfo.color }}>
                      {typeInfo.label}
                    </span>
                    <span className="alert-time">{alert.time}</span>
                  </div>
                  <div className="alert-location">{alert.location}</div>
                  <div className="alert-message">{alert.message}</div>
                </div>
                <button 
                  className="acknowledge-btn"
                  onClick={() => onAcknowledge(alert.id)}
                >
                  ✓
                </button>
              </div>
            )
          })}
        </div>
      )}
      
      <div className="alert-summary">
        <div className="summary-item">
          <span className="summary-count critical">{alerts.filter(a => a.severity === 'critical').length}</span>
          <span className="summary-label">严重</span>
        </div>
        <div className="summary-item">
          <span className="summary-count warning">{alerts.filter(a => a.severity === 'warning').length}</span>
          <span className="summary-label">警告</span>
        </div>
        <div className="summary-item">
          <span className="summary-count info">{alerts.filter(a => a.severity === 'info').length}</span>
          <span className="summary-label">一般</span>
        </div>
      </div>
    </div>
  )
}

export default AlertPanel
