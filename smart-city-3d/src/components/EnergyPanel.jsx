import React, { useState, useEffect, useMemo } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Legend
} from 'recharts'

// 区域能耗数据
const energyData = {
  '商业区': { current: 2450, peak: 3200, avg: 2100 },
  '住宅区': { current: 1850, peak: 2400, avg: 1600 },
  '办公区': { current: 3200, peak: 3800, avg: 2900 },
  '工业区': { current: 5600, peak: 6800, avg: 5200 },
}

// 生成历史数据
function generateHistoryData() {
  const data = []
  const now = new Date()
  for (let i = 23; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000)
    data.push({
      time: time.getHours() + ':00',
      商业区: Math.floor(1800 + Math.random() * 1400),
      住宅区: Math.floor(1200 + Math.random() * 1200),
      办公区: Math.floor(2500 + Math.random() * 1500),
      工业区: Math.floor(4800 + Math.random() * 2000),
    })
  }
  return data
}

function EnergyPanel() {
  const [selectedZone, setSelectedZone] = useState('all')
  const [historyData, setHistoryData] = useState(generateHistoryData())
  const [realtimeData, setRealtimeData] = useState(energyData)

  // 实时更新数据
  useEffect(() => {
    const interval = setInterval(() => {
      setRealtimeData(prev => ({
        '商业区': {
          current: Math.max(1500, Math.min(3500, prev['商业区'].current + Math.floor(Math.random() * 200 - 100))),
          peak: prev['商业区'].peak,
          avg: prev['商业区'].avg,
        },
        '住宅区': {
          current: Math.max(1000, Math.min(2800, prev['住宅区'].current + Math.floor(Math.random() * 150 - 75))),
          peak: prev['住宅区'].peak,
          avg: prev['住宅区'].avg,
        },
        '办公区': {
          current: Math.max(2000, Math.min(4200, prev['办公区'].current + Math.floor(Math.random() * 250 - 125))),
          peak: prev['办公区'].peak,
          avg: prev['办公区'].avg,
        },
        '工业区': {
          current: Math.max(4000, Math.min(7500, prev['工业区'].current + Math.floor(Math.random() * 400 - 200))),
          peak: prev['工业区'].peak,
          avg: prev['工业区'].avg,
        },
      }))

      // 每小时更新历史数据
      setHistoryData(prev => {
        const newData = [...prev]
        const now = new Date()
        newData.shift()
        newData.push({
          time: now.getHours() + ':' + String(now.getMinutes()).padStart(2, '0'),
          商业区: Math.floor(1800 + Math.random() * 1400),
          住宅区: Math.floor(1200 + Math.random() * 1200),
          办公区: Math.floor(2500 + Math.random() * 1500),
          工业区: Math.floor(4800 + Math.random() * 2000),
        })
        return newData
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const zones = useMemo(() => [
    { key: '商业区', name: '商业区', color: '#ff6b6b', icon: '🏢' },
    { key: '住宅区', name: '住宅区', color: '#4ecdc4', icon: '🏠' },
    { key: '办公区', name: '办公区', color: '#45b7d1', icon: '💼' },
    { key: '工业区', name: '工业区', color: '#f9ca24', icon: '🏭' },
  ], [])

  const totalConsumption = useMemo(() => {
    return Object.values(realtimeData).reduce((sum, zone) => sum + zone.current, 0)
  }, [realtimeData])

  const getFilteredData = () => {
    if (selectedZone === 'all') return historyData
    return historyData.map(d => ({
      time: d.time,
      [selectedZone]: d[selectedZone],
    }))
  }

  const getZoneStatus = (current, peak) => {
    const ratio = current / peak
    if (ratio > 0.9) return { status: 'high', color: '#ff4444' }
    if (ratio > 0.7) return { status: 'medium', color: '#ffaa00' }
    return { status: 'normal', color: '#44ff44' }
  }

  return (
    <div className="energy-panel">
      <h3>⚡ 能耗监控中心</h3>
      
      {/* 总能耗概览 */}
      <div className="energy-total">
        <div className="energy-total-value">
          <span className="total-number">{totalConsumption.toLocaleString()}</span>
          <span className="total-unit">kWh</span>
        </div>
        <span className="total-label">实时总能耗</span>
      </div>

      {/* 区域选择 */}
      <div className="zone-selector">
        <button 
          className={`zone-btn ${selectedZone === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedZone('all')}
        >
          全部区域
        </button>
        {zones.map(zone => (
          <button 
            key={zone.key}
            className={`zone-btn ${selectedZone === zone.key ? 'active' : ''}`}
            onClick={() => setSelectedZone(zone.key)}
            style={{ '--zone-color': zone.color }}
          >
            {zone.icon} {zone.name}
          </button>
        ))}
      </div>

      {/* 区域能耗卡片 */}
      <div className="zone-cards">
        {zones.map(zone => {
          const data = realtimeData[zone.key]
          const status = getZoneStatus(data.current, data.peak)
          return (
            <div 
              key={zone.key} 
              className={`zone-card ${status.status}`}
              style={{ borderLeftColor: zone.color }}
            >
              <div className="zone-header">
                <span className="zone-icon">{zone.icon}</span>
                <span className="zone-name">{zone.name}</span>
              </div>
              <div className="zone-value">
                <span className="value-number">{data.current.toLocaleString()}</span>
                <span className="value-unit">kWh</span>
              </div>
              <div className="zone-bar">
                <div 
                  className="zone-bar-fill"
                  style={{ 
                    width: `${(data.current / data.peak) * 100}%`,
                    backgroundColor: status.color
                  }}
                />
              </div>
              <div className="zone-stats">
                <span>峰值: {data.peak.toLocaleString()}</span>
                <span>平均: {data.avg.toLocaleString()}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* 能耗趋势图 */}
      <div className="energy-chart">
        <h4>📈 24小时能耗趋势</h4>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={getFilteredData()}>
              <defs>
                {zones.map(zone => (
                  <linearGradient key={zone.key} id={`color${zone.key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={zone.color} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={zone.color} stopOpacity={0}/>
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="time" 
                stroke="#888"
                fontSize={10}
                tickLine={false}
              />
              <YAxis 
                stroke="#888"
                fontSize={10}
                tickLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(0,0,0,0.8)', 
                  border: '1px solid #00ffff',
                  borderRadius: '8px'
                }}
                labelStyle={{ color: '#00ffff' }}
              />
              <Legend />
              {(selectedZone === 'all' ? zones : zones.filter(z => z.key === selectedZone)).map(zone => (
                <Area
                  key={zone.key}
                  type="monotone"
                  dataKey={zone.key}
                  stroke={zone.color}
                  fillOpacity={1}
                  fill={`url(#color${zone.key})`}
                  strokeWidth={2}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default EnergyPanel
