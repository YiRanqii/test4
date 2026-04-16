import React, { useState, useCallback, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Sky } from '@react-three/drei'
import CityScene from './components/CityScene'
import DataPanel from './components/DataPanel'
import BuildingInfo from './components/BuildingInfo'
import LayerControls from './components/LayerControls'
import WeatherSystem from './components/WeatherSystem'
import CameraControls from './components/CameraControls'
import AlertPanel from './components/AlertPanel'
import EnergyPanel from './components/EnergyPanel'
import './App.css'

function App() {
  const [selectedBuilding, setSelectedBuilding] = useState(null)
  const [layers, setLayers] = useState({
    buildings: true,
    roads: true,
    traffic: true,
  })
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [weather, setWeather] = useState('sunny')
  const [viewMode, setViewMode] = useState('third-person')
  const [activePanel, setActivePanel] = useState('data')
  const [alerts, setAlerts] = useState([])
  const [alertBuildings, setAlertBuildings] = useState([])

  useEffect(() => {
    const generateAlert = () => {
      const alertTypes = ['fire', 'power', 'crowd', 'system']
      const severities = ['critical', 'warning', 'info']
      const buildings = [
        { id: 2, name: '金融中心' },
        { id: 5, name: '城市地标' },
        { id: 9, name: '中央塔楼' },
      ]
      
      if (Math.random() > 0.7 && alerts.length < 5) {
        const building = buildings[Math.floor(Math.random() * buildings.length)]
        const newAlert = {
          id: Date.now(),
          type: alertTypes[Math.floor(Math.random() * alertTypes.length)],
          severity: severities[Math.floor(Math.random() * severities.length)],
          location: building.name,
          buildingId: building.id,
          time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
          message: ['设备温度异常', '网络连接波动', '人员密度过高', '电力负载预警'][Math.floor(Math.random() * 4)],
        }
        
        setAlerts(prev => [...prev, newAlert])
        setAlertBuildings(prev => [...new Set([...prev, building.id])])
      }
    }

    const interval = setInterval(generateAlert, 8000)
    return () => clearInterval(interval)
  }, [alerts.length])

  const handleAcknowledgeAlert = useCallback((alertId) => {
    const alert = alerts.find(a => a.id === alertId)
    if (alert) {
      setAlerts(prev => prev.filter(a => a.id !== alertId))
      const remainingAlerts = alerts.filter(a => a.id !== alertId)
      const remainingBuildingIds = remainingAlerts.map(a => a.buildingId)
      setAlertBuildings(remainingBuildingIds)
    }
  }, [alerts])

  const handleBuildingClick = useCallback((building) => {
    setSelectedBuilding(building)
  }, [])

  const handleCloseInfo = useCallback(() => {
    setSelectedBuilding(null)
  }, [])

  const toggleLayer = useCallback((layer) => {
    setLayers(prev => ({ ...prev, [layer]: !prev[layer] }))
  }, [])

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }, [])

  const getWeatherIcon = (type) => {
    switch (type) {
      case 'sunny': return '☀️'
      case 'rainy': return '🌧️'
      case 'foggy': return '🌫️'
      default: return '☀️'
    }
  }

  const getViewIcon = (mode) => {
    return mode === 'first-person' ? '👤' : '🎥'
  }

  return (
    <div className="app">
      <div className="header">
        <h1>🏙️ 数字孪生智慧城市</h1>
        <div className="header-controls">
          <div className="weather-controls">
            {['sunny', 'rainy', 'foggy'].map((w) => (
              <button
                key={w}
                onClick={() => setWeather(w)}
                className={`control-btn weather-btn ${weather === w ? 'active' : ''}`}
              >
                {getWeatherIcon(w)}
                {{ sunny: '晴天', rainy: '雨天', foggy: '雾天' }[w]}
              </button>
            ))}
          </div>
          
          <div className="view-controls">
            <button
              onClick={() => setViewMode(viewMode === 'first-person' ? 'third-person' : 'first-person')}
              className="control-btn view-btn"
              title={viewMode === 'first-person' ? 'WASD移动 | 鼠标拖动旋转视角' : ''}
            >
              {getViewIcon(viewMode)}
              {viewMode === 'first-person' ? '第一人称' : '第三人称'}
            </button>
          </div>

          <button onClick={toggleFullscreen} className="control-btn">
            {isFullscreen ? '⛶ 退出全屏' : '⛶ 全屏'}
          </button>
        </div>
      </div>

      <div className="main-container">
        <div className="canvas-container">
          <Canvas
            camera={{ position: [50, 50, 50], fov: 45 }}
            shadows
            gl={{ antialias: true }}
          >
            {weather === 'sunny' && (
              <Sky
                distance={450000}
                sunPosition={[100, 50, 100]}
                inclination={0.5}
                azimuth={0.25}
                rayleigh={2}
              />
            )}
            
            <WeatherSystem weather={weather} />
            
            <CameraControls viewMode={viewMode} />
            
            <CityScene
              onBuildingClick={handleBuildingClick}
              layers={layers}
              alertBuildings={alertBuildings}
            />
          </Canvas>
        </div>

        <div className="panel-tabs">
          <button 
            className={`panel-tab ${activePanel === 'data' ? 'active' : ''}`}
            onClick={() => setActivePanel('data')}
          >
            📊 实时数据
          </button>
          <button 
            className={`panel-tab ${activePanel === 'energy' ? 'active' : ''}`}
            onClick={() => setActivePanel('energy')}
          >
            ⚡ 能耗监控
          </button>
          <button 
            className={`panel-tab ${activePanel === 'alerts' ? 'active' : ''}`}
            onClick={() => setActivePanel('alerts')}
          >
            🚨 告警中心
            {alerts.length > 0 && <span className="alert-badge">{alerts.length}</span>}
          </button>
        </div>

        {activePanel === 'data' && <DataPanel />}
        {activePanel === 'energy' && <EnergyPanel />}
        {activePanel === 'alerts' && (
          <AlertPanel alerts={alerts} onAcknowledge={handleAcknowledgeAlert} />
        )}

        <LayerControls layers={layers} onToggle={toggleLayer} />
        
        {selectedBuilding && (
          <BuildingInfo building={selectedBuilding} onClose={handleCloseInfo} />
        )}
      </div>
    </div>
  )
}

export default App
