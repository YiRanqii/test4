import React, { useState, useCallback, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Sky } from '@react-three/drei'
import CityScene from './components/CityScene'
import DataPanel from './components/DataPanel'
import BuildingInfo from './components/BuildingInfo'
import LayerControls from './components/LayerControls'
import WeatherSystem from './components/WeatherSystem'
import CameraController from './components/CameraController'
import ControlPanel from './components/ControlPanel'
import EnergyPanel from './components/EnergyPanel'
import { AlertSystem3D, AlertPanel, generateMockAlerts, alertBuildingsData, alertZonesData } from './components/AlertSystem'
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
  const [viewMode, setViewMode] = useState('third')
  const [alerts, setAlerts] = useState([])
  const [showEnergyPanel, setShowEnergyPanel] = useState(false)

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

  const handleWeatherChange = useCallback((newWeather) => {
    setWeather(newWeather)
  }, [])

  const handleViewModeChange = useCallback((newMode) => {
    setViewMode(newMode)
    if (newMode === 'first') {
      setSelectedBuilding(null)
    }
  }, [])

  const handleDismissAlert = useCallback((alertId) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId))
  }, [])

  // 模拟预警数据更新
  useEffect(() => {
    // 初始加载预警
    setAlerts(generateMockAlerts())

    // 定期更新预警
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newAlerts = generateMockAlerts()
        setAlerts(prev => {
          const combined = [...newAlerts, ...prev].slice(0, 5)
          return combined
        })
      }
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  // 获取天空配置
  const getSkyConfig = () => {
    switch (weather) {
      case 'rainy':
        return { sunPosition: [0, 0.1, 0], inclination: 0.5, azimuth: 0.25 }
      case 'foggy':
        return { sunPosition: [0, 0.3, 0], inclination: 0.3, azimuth: 0.25 }
      default:
        return { sunPosition: [0, 1, 0], inclination: 0, azimuth: 0.25 }
    }
  }

  const skyConfig = getSkyConfig()

  return (
    <div className="app">
      <div className="header">
        <h1>🏙️ 数字孪生智慧城市</h1>
        <div className="header-controls">
          <button 
            onClick={() => setShowEnergyPanel(!showEnergyPanel)} 
            className={`control-btn ${showEnergyPanel ? 'active' : ''}`}
          >
            ⚡ 能耗面板
          </button>
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
            <Sky
              distance={450000}
              sunPosition={skyConfig.sunPosition}
              inclination={skyConfig.inclination}
              azimuth={skyConfig.azimuth}
            />
            <ambientLight intensity={weather === 'sunny' ? 0.4 : 0.2} />
            
            <WeatherSystem weather={weather} />
            <CameraController viewMode={viewMode} onViewModeChange={handleViewModeChange} />
            
            <CityScene
              onBuildingClick={handleBuildingClick}
              layers={layers}
            />
            
            <AlertSystem3D 
              alertBuildings={alertBuildingsData}
              alertZones={alertZonesData}
              onBuildingClick={handleBuildingClick}
            />
          </Canvas>
        </div>

        <DataPanel />
        <LayerControls layers={layers} onToggle={toggleLayer} />
        <ControlPanel 
          weather={weather}
          onWeatherChange={handleWeatherChange}
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
        />
        
        {showEnergyPanel && <EnergyPanel />}
        <AlertPanel alerts={alerts} onDismiss={handleDismissAlert} />
        
        {selectedBuilding && (
          <BuildingInfo building={selectedBuilding} onClose={handleCloseInfo} />
        )}
      </div>
    </div>
  )
}

export default App
