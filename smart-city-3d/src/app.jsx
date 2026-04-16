import React, { useState, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Sky } from '@react-three/drei'
import CityScene from './components/CityScene'
import DataPanel from './components/DataPanel'
import BuildingInfo from './components/BuildingInfo'
import LayerControls from './components/LayerControls'
import './App.css'

function App() {
  const [selectedBuilding, setSelectedBuilding] = useState(null)
  const [layers, setLayers] = useState({
    buildings: true,
    roads: true,
    traffic: true,
    security: false,
    energy: false,
  })
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isNightMode, setIsNightMode] = useState(false)

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

  const toggleDayNight = useCallback(() => {
    setIsNightMode(prev => !prev)
  }, [])

  return (
    <div className="app">
      <div className="header">
        <h1>🏙️ 数字孪生智慧城市</h1>
        <div className="header-controls">
          <button onClick={toggleDayNight} className="control-btn day-night-btn">
            {isNightMode ? '☀️ 白天模式' : '🌙 夜晚模式'}
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
              sunPosition={isNightMode ? [0, -1, 0] : [0, 1, 0]}
              inclination={isNightMode ? 0.5 : 0}
              azimuth={0.25}
            />
            <ambientLight intensity={isNightMode ? 0.1 : 0.4} />
            <directionalLight
              position={[50, 100, 50]}
              intensity={isNightMode ? 0.2 : 1}
              castShadow
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
            />
            <OrbitControls
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              minDistance={10}
              maxDistance={200}
              maxPolarAngle={Math.PI / 2 - 0.1}
            />
            <CityScene
              onBuildingClick={handleBuildingClick}
              layers={layers}
              isNightMode={isNightMode}
            />
          </Canvas>
        </div>

        <DataPanel />
        <LayerControls layers={layers} onToggle={toggleLayer} />
        
        {selectedBuilding && (
          <BuildingInfo building={selectedBuilding} onClose={handleCloseInfo} />
        )}
      </div>
    </div>
  )
}

export default App
