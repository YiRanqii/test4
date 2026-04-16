import React, { useState, useEffect } from 'react'

function DataPanel() {
  const [trafficData, setTrafficData] = useState({
    flow: 2458,
    congestion: 35,
    avgSpeed: 42,
  })
  
  const [populationData, setPopulationData] = useState({
    total: 1285000,
    density: 8500,
    growth: 2.3,
  })

  // 模拟数据更新
  useEffect(() => {
    const interval = setInterval(() => {
      setTrafficData(prev => ({
        flow: Math.max(2000, Math.min(3000, prev.flow + Math.floor(Math.random() * 100 - 50))),
        congestion: Math.max(20, Math.min(80, prev.congestion + Math.floor(Math.random() * 10 - 5))),
        avgSpeed: Math.max(30, Math.min(60, prev.avgSpeed + Math.floor(Math.random() * 6 - 3))),
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const formatNumber = (num) => {
    return num.toLocaleString('zh-CN')
  }

  const getCongestionClass = (value) => {
    if (value < 40) return ''
    if (value < 70) return 'warning'
    return 'danger'
  }

  return (
    <div className="data-panel">
      <h3>📊 实时数据监控</h3>
      
      <div className="data-section">
        <h4 style={{ fontSize: '13px', color: '#aaa', marginBottom: '10px' }}>🚗 交通状况</h4>
        <div className="data-item">
          <span className="data-label">车流量</span>
          <span className="data-value">{formatNumber(trafficData.flow)} 辆/小时</span>
        </div>
        <div className="data-item">
          <span className="data-label">拥堵指数</span>
          <span className={`data-value ${getCongestionClass(trafficData.congestion)}`}>
            {trafficData.congestion}%
          </span>
        </div>
        <div className="data-item">
          <span className="data-label">平均车速</span>
          <span className="data-value">{trafficData.avgSpeed} km/h</span>
        </div>
      </div>

      <div className="data-section" style={{ marginTop: '20px' }}>
        <h4 style={{ fontSize: '13px', color: '#aaa', marginBottom: '10px' }}>👥 人口统计</h4>
        <div className="data-item">
          <span className="data-label">常住人口</span>
          <span className="data-value">{formatNumber(populationData.total)} 人</span>
        </div>
        <div className="data-item">
          <span className="data-label">人口密度</span>
          <span className="data-value">{formatNumber(populationData.density)} 人/km²</span>
        </div>
        <div className="data-item">
          <span className="data-label">年增长率</span>
          <span className="data-value">+{populationData.growth}%</span>
        </div>
      </div>
    </div>
  )
}

export default DataPanel
