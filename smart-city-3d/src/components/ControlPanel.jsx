import React from 'react'

function ControlPanel({ weather, onWeatherChange, viewMode, onViewModeChange }) {
  const weatherOptions = [
    { key: 'sunny', label: '☀️ 晴天', icon: '☀️' },
    { key: 'rainy', label: '🌧️ 雨天', icon: '🌧️' },
    { key: 'foggy', label: '🌫️ 雾天', icon: '🌫️' },
  ]

  const viewOptions = [
    { key: 'third', label: '👁️ 第三人称', description: '鼠标拖拽旋转视角' },
    { key: 'first', label: '🎮 第一人称', description: 'WASD移动，鼠标控制方向，ESC退出' },
  ]

  return (
    <div className="control-panel">
      {/* 天气控制 */}
      <div className="control-section">
        <h4>🌤️ 天气控制</h4>
        <div className="weather-buttons">
          {weatherOptions.map((option) => (
            <button
              key={option.key}
              className={`weather-btn ${weather === option.key ? 'active' : ''}`}
              onClick={() => onWeatherChange(option.key)}
            >
              <span className="weather-icon">{option.icon}</span>
              <span className="weather-label">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 视角控制 */}
      <div className="control-section">
        <h4>🎥 视角切换</h4>
        <div className="view-buttons">
          {viewOptions.map((option) => (
            <button
              key={option.key}
              className={`view-btn ${viewMode === option.key ? 'active' : ''}`}
              onClick={() => onViewModeChange(option.key)}
            >
              <span className="view-label">{option.label}</span>
              <span className="view-desc">{option.description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 操作提示 */}
      {viewMode === 'first' && (
        <div className="control-hint">
          <p>🎮 <strong>第一人称模式</strong></p>
          <p>WASD - 移动 | 鼠标 - 视角 | ESC - 退出</p>
        </div>
      )}
    </div>
  )
}

export default ControlPanel
