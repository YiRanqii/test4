import React from 'react'

function BuildingInfo({ building, onClose }) {
  const getTypeColor = (type) => {
    switch (type) {
      case '办公楼': return '#4a90d9'
      case '商业楼': return '#d94a4a'
      case '住宅楼': return '#4ad94a'
      default: return '#d9a04a'
    }
  }

  return (
    <div className="building-info">
      <div className="building-info-header">
        <h3>🏢 {building.name}</h3>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>
      
      <div className="info-row">
        <span className="info-label">建筑类型</span>
        <span className="info-value" style={{ color: getTypeColor(building.type) }}>
          {building.type}
        </span>
      </div>
      
      <div className="info-row">
        <span className="info-label">楼层数</span>
        <span className="info-value">{building.floors} 层</span>
      </div>
      
      <div className="info-row">
        <span className="info-label">建筑高度</span>
        <span className="info-value">{building.height} 米</span>
      </div>
      
      <div className="info-row">
        <span className="info-label">占地面积</span>
        <span className="info-value">{building.width * building.depth} m²</span>
      </div>
      
      <div className="info-row">
        <span className="info-label">入住率</span>
        <span className="info-value" style={{ 
          color: building.occupancy > 90 ? '#4ad94a' : building.occupancy > 70 ? '#d9a04a' : '#d94a4a'
        }}>
          {building.occupancy}%
        </span>
      </div>

      <div className="info-row">
        <span className="info-label">位置坐标</span>
        <span className="info-value">X: {building.x}, Z: {building.z}</span>
      </div>
    </div>
  )
}

export default BuildingInfo
