import React from 'react'

function LayerControls({ layers, onToggle }) {
  const layerConfig = [
    { key: 'buildings', label: '🏢 建筑图层', color: '#4a90d9' },
    { key: 'roads', label: '🛣️ 道路图层', color: '#888888' },
    { key: 'traffic', label: '🚗 交通图层', color: '#d94a4a' },
    { key: 'security', label: '📹 安防监控', color: '#00ff00' },
    { key: 'energy', label: '⚡ 能耗监测', color: '#ffaa00' },
  ]

  return (
    <div className="layer-controls">
      <h4>🎛️ 图层控制</h4>
      {layerConfig.map(({ key, label, color }) => (
        <label key={key} className="layer-item">
          <input
            type="checkbox"
            className="layer-checkbox"
            checked={layers[key]}
            onChange={() => onToggle(key)}
          />
          <span className="layer-label" style={{ color: layers[key] ? color : '#666' }}>
            {label}
          </span>
        </label>
      ))}
    </div>
  )
}

export default LayerControls
