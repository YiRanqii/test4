import React from 'react'

function LayerControls({ layers, onToggle, isNight, onToggleDayNight }) {
  const layerConfig = [
    { key: 'buildings', label: '建筑图层', color: '#4a90d9', icon: '🏢' },
    { key: 'roads', label: '道路图层', color: '#888888', icon: '🛣️' },
    { key: 'traffic', label: '交通图层', color: '#d94a4a', icon: '🚗' },
    { key: 'surveillance', label: '安防监控', color: '#00ff00', icon: '📹' },
    { key: 'energy', label: '能耗监测', color: '#ffaa00', icon: '⚡' },
  ]

  return (
    <div className="layer-controls">
      <h4>图层控制</h4>
      
      <div className="day-night-toggle">
        <button 
          className={`toggle-btn ${isNight ? 'night' : 'day'}`}
          onClick={onToggleDayNight}
        >
          {isNight ? '🌙 夜间模式' : '☀️ 白天模式'}
        </button>
      </div>
      
      <div className="layer-list">
        {layerConfig.map(({ key, label, color, icon }) => (
          <label key={key} className="layer-item">
            <input
              type="checkbox"
              className="layer-checkbox"
              checked={layers[key]}
              onChange={() => onToggle(key)}
            />
            <span className="layer-icon">{icon}</span>
            <span className="layer-label" style={{ color: layers[key] ? color : '#666' }}>
              {label}
            </span>
          </label>
        ))}
      </div>
    </div>
  )
}

export default LayerControls
