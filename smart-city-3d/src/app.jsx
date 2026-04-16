import React, { useState, useCallback, useRef, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Sky } from '@react-three/drei'
import CityScene, { buildingData } from './components/CityScene'
import DataPanel from './components/DataPanel'
import BuildingInfo from './components/BuildingInfo'
import LayerControls from './components/LayerControls'
import WeatherEffects from './components/WeatherEffects'
import WeatherControls from './components/WeatherControls'
import { CameraController, VIEW_MODES } from './components/CameraController'
import ViewControls from './components/ViewControls'
import { AlertEffects, alertBuildings } from './components/AlertEffects'
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
  const [isWeatherTransitioning, setIsWeatherTransitioning] = useState(false)
  const [viewMode, setViewMode] = useState(VIEW_MODES.THIRD_PERSON)
  const [alerts, setAlerts] = useState(alertBuildings)
  const orbitControlsRef = useRef()

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
    if (newWeather === weather) return
    setIsWeatherTransitioning(true)
    setWeather(newWeather)
    setTimeout(() => {
      setIsWeatherTransitioning(false)
    }, 1500)
  }, [weather])

  const handleViewChange = useCallback((newViewMode) => {
    setViewMode(newViewMode)
  }, [])

  const getSkyProps = () => {
    switch (weather) {
      case 'rainy':
        return {
          sunPosition: [0, 0.1, 0],
          turbidity: 20,
          rayleigh: 4,
        }
      case 'foggy':
        return {
          sunPosition: [0, 0.3, 0],
          turbidity: 15,
          rayleigh: 3,
        }
      default:
        return {
          sunPosition: [100, 50, 100],
          turbidity: 8,
          rayleigh: 0.5,
        }
    }
  }

  const getLightingIntensity = () => {
    switch (weather) {
      case 'rainy':
        return { ambient: 0.25, directional: 0.5 }
      case 'foggy':
        return { ambient: 0.35, directional: 0.6 }
      default:
        return { ambient: 0.4, directional: 1 }
    }
  }

  const lightIntensity = getLightingIntensity()

  return (
    <div className="app">
      <div className="header">
        <h1>🏙️ 数字孪生智慧城市</h1>
        <div className="header-controls">
          <WeatherControls 
            weather={weather} 
            onWeatherChange={handleWeatherChange}
            isTransitioning={isWeatherTransitioning}
          />
          <ViewControls viewMode={viewMode} onViewChange={handleViewChange} />
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
              inclination={0.5}
              azimuth={0.25}
              {...getSkyProps()}
            />
            <ambientLight intensity={lightIntensity.ambient} />
            <directionalLight
              position={[50, 100, 50]}
              intensity={lightIntensity.directional}
              castShadow
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
            />
            <OrbitControls
              ref={orbitControlsRef}
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              minDistance={10}
              maxDistance={200}
              maxPolarAngle={Math.PI / 2 - 0.1}
              enabled={viewMode === VIEW_MODES.THIRD_PERSON}
            />
            <CameraController 
              viewMode={viewMode} 
              enabled={true}
              orbitControlsRef={orbitControlsRef}
            />
            <WeatherEffects weather={weather} />
            <CityScene
              onBuildingClick={handleBuildingClick}
              layers={layers}
            />
            <AlertEffects buildingData={buildingData} alerts={alerts} />
          </Canvas>
        </div>

        <div className="left-panels">
          <DataPanel />
          <EnergyPanel />
        </div>
        
        <LayerControls layers={layers} onToggle={toggleLayer} />
        
        <AlertPanel alerts={alerts} />
        
        {selectedBuilding && (
          <BuildingInfo building={selectedBuilding} onClose={handleCloseInfo} />
        )}
      </div>
    </div>
  )
}

export default App
