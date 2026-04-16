import React, { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

function EnergyPanel() {
  const [selectedZone, setSelectedZone] = useState('all')
  const [energyData, setEnergyData] = useState({
    zones: {
      A: { name: '商务区', electricity: 0, water: 0, gas: 0 },
      B: { name: '科技区', electricity: 0, water: 0, gas: 0 },
      C: { name: '住宅区', electricity: 0, water: 0, gas: 0 },
      D: { name: '商业区', electricity: 0, water: 0, gas: 0 },
    },
    trend: []
  })

  const generateTimeLabel = (index) => {
    const hour = Math.floor(index / 6) + 8
    const minute = (index % 6) * 10
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
  }

  useEffect(() => {
    const initialTrend = Array.from({ length: 24 }, (_, i) => ({
      time: generateTimeLabel(i),
      A: 120 + Math.random() * 80,
      B: 150 + Math.random() * 100,
      C: 80 + Math.random() * 60,
      D: 100 + Math.random() * 70,
    }))

    setEnergyData(prev => ({
      ...prev,
      trend: initialTrend,
      zones: {
        A: { name: '商务区', electricity: 2450, water: 125, gas: 890 },
        B: { name: '科技区', electricity: 3680, water: 180, gas: 1120 },
        C: { name: '住宅区', electricity: 1580, water: 320, gas: 650 },
        D: { name: '商业区', electricity: 2890, water: 210, gas: 980 },
      }
    }))

    const interval = setInterval(() => {
      setEnergyData(prev => {
        const newTrend = [...prev.trend.slice(1), {
          time: generateTimeLabel((prev.trend.length + 17) % 24),
          A: 120 + Math.random() * 80 + (selectedZone === 'A' || selectedZone === 'all' ? 0 : -50),
          B: 150 + Math.random() * 100 + (selectedZone === 'B' || selectedZone === 'all' ? 0 : -50),
          C: 80 + Math.random() * 60 + (selectedZone === 'C' || selectedZone === 'all' ? 0 : -50),
          D: 100 + Math.random() * 70 + (selectedZone === 'D' || selectedZone === 'all' ? 0 : -50),
        }]

        return {
          ...prev,
          trend: newTrend,
          zones: {
            A: { ...prev.zones.A, electricity: Math.max(2000, prev.zones.A.electricity + Math.floor(Math.random() * 20 - 10)) },
            B: { ...prev.zones.B, electricity: Math.max(3000, prev.zones.B.electricity + Math.floor(Math.random() * 30 - 15)) },
            C: { ...prev.zones.C, electricity: Math.max(1200, prev.zones.C.electricity + Math.floor(Math.random() * 15 - 7)) },
            D: { ...prev.zones.D, electricity: Math.max(2500, prev.zones.D.electricity + Math.floor(Math.random() * 25 - 12)) },
          }
        }
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [selectedZone])

  const getZoneColor = (zone) => {
    switch (zone) {
      case 'A': return '#00ffff'
      case 'B': return '#ffaa00'
      case 'C': return '#00ff88'
      case 'D': return '#ff4488'
      default: return '#ffffff'
    }
  }

  const totalEnergy = Object.values(energyData.zones).reduce((sum, z) => sum + z.electricity, 0)

  return (
    <div className="energy-panel">
      <h3>⚡ 能耗监控中心</h3>
      
      <div className="zone-tabs">
        <button 
          className={`zone-tab ${selectedZone === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedZone('all')}
        >
          全部区域
        </button>
        {Object.entries(energyData.zones).map(([key, zone]) => (
          <button 
            key={key}
            className={`zone-tab ${selectedZone === key ? 'active' : ''}`}
            onClick={() => setSelectedZone(key)}
            style={{ '--zone-color': getZoneColor(key) }}
          >
            {zone.name}
          </button>
        ))}
      </div>

      <div className="energy-summary">
        <div className="summary-card">
          <div className="summary-label">总用电量</div>
          <div className="summary-value">{totalEnergy.toLocaleString()}</div>
          <div className="summary-unit">kWh</div>
        </div>
        <div className="summary-card">
          <div className="summary-label">实时功率</div>
          <div className="summary-value">{Math.floor(totalEnergy / 24)}</div>
          <div className="summary-unit">kW</div>
        </div>
        <div className="summary-card">
          <div className="summary-label">碳排放量</div>
          <div className="summary-value">{Math.floor(totalEnergy * 0.785)}</div>
          <div className="summary-unit">kgCO₂</div>
        </div>
      </div>

      <div className="zone-energy-list">
        {Object.entries(energyData.zones).map(([key, zone]) => (
          (selectedZone === 'all' || selectedZone === key) && (
            <div key={key} className="zone-energy-item" style={{ borderLeftColor: getZoneColor(key) }}>
              <div className="zone-name">{zone.name}</div>
              <div className="zone-metrics">
                <div className="metric">
                  <span className="metric-icon">⚡</span>
                  <span className="metric-value">{zone.electricity} kWh</span>
                </div>
                <div className="metric">
                  <span className="metric-icon">💧</span>
                  <span className="metric-value">{zone.water} m³</span>
                </div>
                <div className="metric">
                  <span className="metric-icon">🔥</span>
                  <span className="metric-value">{zone.gas} m³</span>
                </div>
              </div>
            </div>
          )
        ))}
      </div>

      <div className="chart-container">
        <div className="chart-title">能耗趋势（24小时）</div>
        <ResponsiveContainer width="100%" height={140}>
          <LineChart data={energyData.trend} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,255,255,0.1)" />
            <XAxis 
              dataKey="time" 
              stroke="rgba(255,255,255,0.5)" 
              tick={{ fontSize: 10 }}
              interval={5}
            />
            <YAxis 
              stroke="rgba(255,255,255,0.5)" 
              tick={{ fontSize: 10 }}
              width={30}
            />
            <Tooltip 
              contentStyle={{ 
                background: 'rgba(0,0,0,0.9)', 
                border: '1px solid rgba(0,255,255,0.3)',
                borderRadius: '8px'
              }}
              labelStyle={{ color: '#00ffff' }}
            />
            {(selectedZone === 'all' || selectedZone === 'A') && (
              <Line type="monotone" dataKey="A" stroke="#00ffff" strokeWidth={2} dot={false} name="商务区" />
            )}
            {(selectedZone === 'all' || selectedZone === 'B') && (
              <Line type="monotone" dataKey="B" stroke="#ffaa00" strokeWidth={2} dot={false} name="科技区" />
            )}
            {(selectedZone === 'all' || selectedZone === 'C') && (
              <Line type="monotone" dataKey="C" stroke="#00ff88" strokeWidth={2} dot={false} name="住宅区" />
            )}
            {(selectedZone === 'all' || selectedZone === 'D') && (
              <Line type="monotone" dataKey="D" stroke="#ff4488" strokeWidth={2} dot={false} name="商业区" />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default EnergyPanel
