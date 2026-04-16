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
    security: true,
    energy: true,
  })
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isNight, setIsNight] = useState(false)

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
    setIsNight(prev => !prev)
  }, [])

  return (
    <div className="app">
      <div className="header">
        <h1>🏙️ 数字孪生智慧城市</h1>
        <div className="header-controls">
          <button onClick={toggleDayNight} className="control-btn">
            {isNight ? '🌙 夜晚模式' : '☀️ 白天模式'}
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
            {!isNight && (
              <Sky
                distance={450000}
                sunPosition={[0, 1, 0]}
                inclination={0}
                azimuth={0.25}
              />
            )}
            {isNight && (
              <>
                <color attach="background" args={['#050510']} />
                <fog attach="fog" args={['#050510', 50, 150]} />
              </>
            )}
            <ambientLight intensity={isNight ? 0.05 : 0.4} />
            <directionalLight
              position={[50, 100, 50]}
              intensity={isNight ? 0.1 : 1}
              castShadow
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
            />
            {isNight && (
              <>
                <pointLight position={[-30, 30, -30]} intensity={0.3} color="#3355aa" />
                <pointLight position={[30, 30, 30]} intensity={0.3} color="#3355aa" />
              </>
            )}
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
              isNight={isNight}
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
