import React from 'react'

const weatherConfig = [
  { key: 'sunny', label: '☀️ 晴天', color: '#ffcc00', desc: '阳光明媚' },
  { key: 'rainy', label: '🌧️ 雨天', color: '#4a90d9', desc: '细雨绵绵' },
  { key: 'foggy', label: '🌫️ 雾天', color: '#888888', desc: '薄雾笼罩' },
]

function WeatherControls({ weather, onWeatherChange, isTransitioning }) {
  return (
    <div className="weather-controls">
      <h4>🌤️ 天气切换</h4>
      <div className="weather-buttons">
        {weatherConfig.map(({ key, label, color, desc }) => (
          <button
            key={key}
            className={`weather-btn ${weather === key ? 'active' : ''}`}
            onClick={() => onWeatherChange(key)}
            disabled={isTransitioning}
            style={{
              borderColor: weather === key ? color : 'rgba(0, 255, 255, 0.3)',
              background: weather === key ? `${color}22` : 'transparent',
            }}
          >
            <span className="weather-label">{label}</span>
            <span className="weather-desc">{desc}</span>
          </button>
        ))}
      </div>
      {isTransitioning && (
        <div className="transition-indicator">
          <span className="transition-text">切换中...</span>
        </div>
      )}
    </div>
  )
}

export default WeatherControls
