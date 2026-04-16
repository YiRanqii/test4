import React, { useState, useEffect, useRef } from 'react'

const regions = [
  { id: 'district_a', name: 'A区 - 商业中心', color: '#4a90d9' },
  { id: 'district_b', name: 'B区 - 科技园区', color: '#4ad94a' },
  { id: 'district_c', name: 'C区 - 住宅区域', color: '#d9a04a' },
  { id: 'district_d', name: 'D区 - 工业区域', color: '#d94a4a' },
]

const generateInitialData = () => {
  const data = {}
  const now = Date.now()
  regions.forEach(region => {
    data[region.id] = Array.from({ length: 20 }, (_, i) => ({
      time: now - (19 - i) * 3000,
      value: Math.random() * 500 + 200
    }))
  })
  return data
}

function EnergyChart({ data, color, selected }) {
  const canvasRef = useRef(null)
  const width = 240
  const height = 80

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !data || data.length === 0) return
    
    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    
    canvas.width = width * dpr
    canvas.height = height * dpr
    ctx.scale(dpr, dpr)
    
    ctx.clearRect(0, 0, width, height)
    
    const values = data.map(d => d.value)
    const minVal = Math.min(...values) * 0.9
    const maxVal = Math.max(...values) * 1.1
    const range = maxVal - minVal
    
    const gradient = ctx.createLinearGradient(0, 0, 0, height)
    gradient.addColorStop(0, color + '40')
    gradient.addColorStop(1, color + '05')
    
    ctx.beginPath()
    ctx.moveTo(0, height)
    
    data.forEach((point, i) => {
      const x = (i / (data.length - 1)) * width
      const y = height - ((point.value - minVal) / range) * height
      if (i === 0) {
        ctx.lineTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    
    ctx.lineTo(width, height)
    ctx.closePath()
    ctx.fillStyle = gradient
    ctx.fill()
    
    ctx.beginPath()
    data.forEach((point, i) => {
      const x = (i / (data.length - 1)) * width
      const y = height - ((point.value - minVal) / range) * height
      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.strokeStyle = color
    ctx.lineWidth = selected ? 2.5 : 1.5
    ctx.stroke()
    
    if (selected) {
      const lastPoint = data[data.length - 1]
      const lastX = width
      const lastY = height - ((lastPoint.value - minVal) / range) * height
      
      ctx.beginPath()
      ctx.arc(lastX, lastY, 4, 0, Math.PI * 2)
      ctx.fillStyle = color
      ctx.fill()
      ctx.strokeStyle = '#fff'
      ctx.lineWidth = 2
      ctx.stroke()
    }
  }, [data, color, selected])

  return (
    <canvas 
      ref={canvasRef} 
      style={{ width, height }}
      className="energy-chart"
    />
  )
}

function EnergyPanel() {
  const [energyData, setEnergyData] = useState(generateInitialData)
  const [selectedRegion, setSelectedRegion] = useState('district_a')
  const [stats, setStats] = useState({})

  useEffect(() => {
    const interval = setInterval(() => {
      setEnergyData(prev => {
        const newData = { ...prev }
        const now = Date.now()
        regions.forEach(region => {
          const regionData = [...prev[region.id]]
          const lastValue = regionData[regionData.length - 1].value
          const change = (Math.random() - 0.5) * 100
          const newValue = Math.max(100, Math.min(800, lastValue + change))
          regionData.push({ time: now, value: newValue })
          if (regionData.length > 20) {
            regionData.shift()
          }
          newData[region.id] = regionData
        })
        return newData
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const newStats = {}
    regions.forEach(region => {
      const data = energyData[region.id]
      if (data && data.length > 0) {
        const values = data.map(d => d.value)
        const current = values[values.length - 1]
        const avg = values.reduce((a, b) => a + b, 0) / values.length
        const max = Math.max(...values)
        const min = Math.min(...values)
        newStats[region.id] = { current, avg, max, min }
      }
    })
    setStats(newStats)
  }, [energyData])

  const formatValue = (val) => {
    return Math.round(val).toLocaleString()
  }

  return (
    <div className="energy-panel">
      <h3>⚡ 能耗数据监控</h3>
      
      <div className="region-tabs">
        {regions.map(region => (
          <button
            key={region.id}
            className={`region-tab ${selectedRegion === region.id ? 'active' : ''}`}
            onClick={() => setSelectedRegion(region.id)}
            style={{ 
              borderColor: selectedRegion === region.id ? region.color : 'transparent',
              color: selectedRegion === region.id ? region.color : '#888'
            }}
          >
            {region.name.split(' - ')[0]}
          </button>
        ))}
      </div>

      {stats[selectedRegion] && (
        <div className="energy-stats">
          <div className="stat-item current">
            <span className="stat-label">当前能耗</span>
            <span className="stat-value" style={{ color: regions.find(r => r.id === selectedRegion)?.color }}>
              {formatValue(stats[selectedRegion].current)} <small>kW</small>
            </span>
          </div>
          <div className="stat-row">
            <div className="stat-item">
              <span className="stat-label">平均值</span>
              <span className="stat-value">{formatValue(stats[selectedRegion].avg)} kW</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">峰值</span>
              <span className="stat-value">{formatValue(stats[selectedRegion].max)} kW</span>
            </div>
          </div>
        </div>
      )}

      <div className="chart-container">
        <EnergyChart 
          data={energyData[selectedRegion]} 
          color={regions.find(r => r.id === selectedRegion)?.color}
          selected={true}
        />
      </div>

      <div className="energy-list">
        {regions.map(region => {
          const regionStats = stats[region.id]
          if (!regionStats) return null
          
          return (
            <div 
              key={region.id}
              className={`energy-item ${selectedRegion === region.id ? 'selected' : ''}`}
              onClick={() => setSelectedRegion(region.id)}
            >
              <div className="energy-item-header">
                <span className="region-dot" style={{ background: region.color }} />
                <span className="region-name">{region.name.split(' - ')[1]}</span>
              </div>
              <div className="energy-item-chart">
                <EnergyChart 
                  data={energyData[region.id]} 
                  color={region.color}
                  selected={selectedRegion === region.id}
                />
              </div>
              <div className="energy-item-value">
                {formatValue(regionStats.current)} kW
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default EnergyPanel
