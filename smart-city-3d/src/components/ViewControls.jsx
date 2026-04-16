import React from 'react'
import { VIEW_MODES } from './CameraController'

function ViewControls({ viewMode, onViewChange }) {
  const viewConfig = [
    { 
      key: VIEW_MODES.THIRD_PERSON, 
      label: '🎥 第三人称', 
      desc: '俯瞰城市',
      icon: '🎥'
    },
    { 
      key: VIEW_MODES.FIRST_PERSON, 
      label: '👁️ 第一人称', 
      desc: '沉浸漫游',
      icon: '👁️'
    },
  ]

  return (
    <div className="view-controls">
      <h4>👁️ 视角切换</h4>
      <div className="view-buttons">
        {viewConfig.map(({ key, label, desc }) => (
          <button
            key={key}
            className={`view-btn ${viewMode === key ? 'active' : ''}`}
            onClick={() => onViewChange(key)}
          >
            <span className="view-label">{label}</span>
            <span className="view-desc">{desc}</span>
          </button>
        ))}
      </div>
      {viewMode === VIEW_MODES.FIRST_PERSON && (
        <div className="first-person-hint">
          <p>WASD / 方向键: 移动</p>
          <p>鼠标拖拽: 转向</p>
        </div>
      )}
    </div>
  )
}

export default ViewControls
