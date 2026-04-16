import React, { useState, useCallback, useRef, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Sky, Stars } from '@react-three/drei'
import * as THREE from 'three'
import CityScene from './components/CityScene'
import DataPanel from './components/DataPanel'
import BuildingInfo from './components/BuildingInfo'
import LayerControls from './components/LayerControls'
import './App.css'

function SceneLighting({ isNight }) {
  const ambientRef = useRef()
  const directionalRef = useRef()
  const targetRef = useRef(new THREE.Vector3(0, 0, 0))

  useFrame(() => {
    if (ambientRef.current) {
      const targetIntensity = isNight ? 0.15 : 0.5
      ambientRef.current.intensity += (targetIntensity - ambientRef.current.intensity) * 0.05
    }
    if (directionalRef.current) {
      const targetIntensity = isNight ? 0.1 : 1.2
      directionalRef.current.intensity += (targetIntensity - directionalRef.current.intensity) * 0.05
    }
  })

  return (
    <>
      <ambientLight ref={ambientRef} intensity={0.5} />
      <directionalLight
        ref={directionalRef}
        position={[50, 100, 50]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={200}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />
    </>
  )
}

function App() {
  const [selectedBuilding, setSelectedBuilding] = useState(null)
  const [layers, setLayers] = useState({
    buildings: true,
    roads: true,
    traffic: true,
    surveillance: false,
    energy: false,
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
        <h1>数字孪生智慧城市</h1>
        <div className="header-controls">
          <button onClick={toggleDayNight} className={`control-btn day-night-btn ${isNight ? 'night' : ''}`}>
            {isNight ? '🌙 夜间' : '☀️ 白天'}
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
            {isNight ? (
              <>
                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                <fog attach="fog" args={['#0a0a1a', 50, 150]} />
              </>
            ) : (
              <Sky
                distance={450000}
                sunPosition={[100, 50, 100]}
                inclination={0.49}
                azimuth={0.25}
              />
            )}
            <SceneLighting isNight={isNight} />
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
        <LayerControls 
          layers={layers} 
          onToggle={toggleLayer}
          isNight={isNight}
          onToggleDayNight={toggleDayNight}
        />
        
        {selectedBuilding && (
          <BuildingInfo building={selectedBuilding} onClose={handleCloseInfo} />
        )}
      </div>
    </div>
  )
}

export default App
