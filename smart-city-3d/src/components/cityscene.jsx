import React, { useMemo, useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const buildingData = [
  { id: 1, x: -20, z: -20, width: 8, depth: 8, height: 25, name: '科技大厦', type: '办公楼', floors: 30, occupancy: 85 },
  { id: 2, x: -5, z: -20, width: 10, depth: 10, height: 35, name: '金融中心', type: '商业楼', floors: 45, occupancy: 92 },
  { id: 3, x: 15, z: -20, width: 7, depth: 7, height: 20, name: '创新广场', type: '办公楼', floors: 25, occupancy: 78 },
  { id: 4, x: -25, z: -5, width: 6, depth: 6, height: 18, name: '住宅A区', type: '住宅楼', floors: 22, occupancy: 95 },
  { id: 5, x: -10, z: -5, width: 12, depth: 8, height: 40, name: '城市地标', type: '综合体', floors: 55, occupancy: 88 },
  { id: 6, x: 10, z: -5, width: 8, depth: 8, height: 28, name: '商务中心', type: '办公楼', floors: 35, occupancy: 82 },
  { id: 7, x: 25, z: -5, width: 6, depth: 6, height: 22, name: '住宅B区', type: '住宅楼', floors: 28, occupancy: 91 },
  { id: 8, x: -20, z: 10, width: 9, depth: 9, height: 30, name: '科技园A座', type: '办公楼', floors: 38, occupancy: 87 },
  { id: 9, x: 0, z: 10, width: 11, depth: 11, height: 45, name: '中央塔楼', type: '商业楼', floors: 60, occupancy: 96 },
  { id: 10, x: 20, z: 10, width: 8, depth: 8, height: 26, name: '科技园B座', type: '办公楼', floors: 32, occupancy: 79 },
  { id: 11, x: -15, z: 25, width: 7, depth: 7, height: 24, name: '公寓楼A', type: '住宅楼', floors: 30, occupancy: 93 },
  { id: 12, x: 5, z: 25, width: 10, depth: 10, height: 32, name: '购物中心', type: '商业楼', floors: 8, occupancy: 89 },
  { id: 13, x: 25, z: 25, width: 7, depth: 7, height: 21, name: '公寓楼B', type: '住宅楼', floors: 26, occupancy: 86 },
]

const roadData = [
  { x1: -40, z1: -12, x2: 40, z2: -12, width: 6 },
  { x1: -40, z1: 2, x2: 40, z2: 2, width: 6 },
  { x1: -40, z1: 18, x2: 40, z2: 18, width: 6 },
  { x1: -12, z1: -40, x2: -12, z2: 40, width: 6 },
  { x1: 2, z1: -40, x2: 2, z2: 40, width: 6 },
  { x1: 18, z1: -40, x2: 18, z2: 40, width: 6 },
]

const streetLightPositions = [
  { x: -35, z: -12 }, { x: -25, z: -12 }, { x: -15, z: -12 }, { x: -5, z: -12 },
  { x: 5, z: -12 }, { x: 15, z: -12 }, { x: 25, z: -12 }, { x: 35, z: -12 },
  { x: -35, z: 2 }, { x: -25, z: 2 }, { x: -15, z: 2 }, { x: -5, z: 2 },
  { x: 5, z: 2 }, { x: 15, z: 2 }, { x: 25, z: 2 }, { x: 35, z: 2 },
  { x: -35, z: 18 }, { x: -25, z: 18 }, { x: -15, z: 18 }, { x: -5, z: 18 },
  { x: 5, z: 18 }, { x: 15, z: 18 }, { x: 25, z: 18 }, { x: 35, z: 18 },
  { x: -12, z: -35 }, { x: -12, z: -25 }, { x: -12, z: -15 }, { x: -12, z: 25 }, { x: -12, z: 35 },
  { x: 2, z: -35 }, { x: 2, z: -25 }, { x: 2, z: 25 }, { x: 2, z: 35 },
  { x: 18, z: -35 }, { x: 18, z: -25 }, { x: 18, z: 25 }, { x: 18, z: 35 },
]

const surveillancePoints = [
  { id: 1, x: -20, z: -15, name: '监控点A1' },
  { id: 2, x: 5, z: -15, name: '监控点A2' },
  { id: 3, x: 25, z: -15, name: '监控点A3' },
  { id: 4, x: -20, z: 0, name: '监控点B1' },
  { id: 5, x: 10, z: 0, name: '监控点B2' },
  { id: 6, x: -15, z: 18, name: '监控点C1' },
  { id: 7, x: 10, z: 18, name: '监控点C2' },
  { id: 8, x: 25, z: 18, name: '监控点C3' },
]

const energyPoints = [
  { id: 1, x: -20, z: -20, name: '科技大厦', consumption: 1250, buildingHeight: 25 },
  { id: 2, x: -5, z: -20, name: '金融中心', consumption: 2100, buildingHeight: 35 },
  { id: 3, x: 15, z: -20, name: '创新广场', consumption: 890, buildingHeight: 20 },
  { id: 4, x: -10, z: -5, name: '城市地标', consumption: 3200, buildingHeight: 40 },
  { id: 5, x: 0, z: 10, name: '中央塔楼', consumption: 4500, buildingHeight: 45 },
  { id: 6, x: 5, z: 25, name: '购物中心', consumption: 1800, buildingHeight: 32 },
]

function Building({ data, onClick, visible, isNight }) {
  const meshRef = useRef()
  const [hovered, setHovered] = React.useState(false)

  const color = useMemo(() => {
    if (data.type === '办公楼') return '#4a90d9'
    if (data.type === '商业楼') return '#d94a4a'
    if (data.type === '住宅楼') return '#4ad94a'
    return '#d9a04a'
  }, [data.type])

  const windowLights = useMemo(() => {
    const lights = []
    const windowRows = Math.floor(data.height / 3)
    const windowCols = Math.floor(data.width / 2)
    for (let row = 0; row < windowRows; row++) {
      for (let col = 0; col < windowCols; col++) {
        if (Math.random() > 0.3) {
          lights.push({
            x: (col - windowCols / 2 + 0.5) * 2,
            y: (row - windowRows / 2 + 0.5) * 3,
            intensity: Math.random() * 0.5 + 0.5
          })
        }
      }
    }
    return lights
  }, [data])

  useFrame(() => {
    if (meshRef.current) {
      if (hovered) {
        meshRef.current.material.emissive.setHex(0x222222)
      } else if (isNight) {
        meshRef.current.material.emissive.setHex(0x111111)
      } else {
        meshRef.current.material.emissive.setHex(0x000000)
      }
    }
  })

  if (!visible) return null

  return (
    <group position={[data.x, data.height / 2, data.z]}>
      <mesh
        ref={meshRef}
        onClick={() => onClick(data)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[data.width, data.height, data.depth]} />
        <meshStandardMaterial 
          color={color} 
          roughness={0.3}
          metalness={0.2}
        />
      </mesh>
      
      {isNight && windowLights.map((light, i) => (
        <mesh
          key={i}
          position={[light.x, light.y, data.depth / 2 + 0.05]}
        >
          <planeGeometry args={[1.5, 2]} />
          <meshBasicMaterial 
            color="#ffffaa" 
            transparent
            opacity={light.intensity * 0.8}
          />
        </mesh>
      ))}
    </group>
  )
}

function Road({ data, visible }) {
  if (!visible) return null

  const length = Math.sqrt(
    Math.pow(data.x2 - data.x1, 2) + Math.pow(data.z2 - data.z1, 2)
  )
  const midX = (data.x1 + data.x2) / 2
  const midZ = (data.z1 + data.z2) / 2
  const angle = Math.atan2(data.z2 - data.z1, data.x2 - data.x1)

  return (
    <mesh position={[midX, 0.1, midZ]} rotation={[0, -angle, 0]} receiveShadow>
      <boxGeometry args={[length, 0.2, data.width]} />
      <meshStandardMaterial color="#444444" roughness={0.8} />
    </mesh>
  )
}

function StreetLight({ position, isNight }) {
  const lightRef = useRef()
  
  useFrame((state) => {
    if (lightRef.current && isNight) {
      lightRef.current.intensity = 2 + Math.sin(state.clock.elapsedTime * 2) * 0.2
    }
  })

  return (
    <group position={[position.x, 0, position.z]}>
      <mesh position={[0, 3, 0]}>
        <cylinderGeometry args={[0.1, 0.15, 6, 8]} />
        <meshStandardMaterial color="#333333" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, 6.2, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshBasicMaterial 
          color={isNight ? "#ffdd88" : "#666666"} 
        />
      </mesh>
      {isNight && (
        <pointLight
          ref={lightRef}
          position={[0, 6, 0]}
          color="#ffdd88"
          intensity={2}
          distance={15}
          decay={2}
        />
      )}
    </group>
  )
}

function Traffic({ visible, isNight }) {
  const carsRef = useRef([])
  
  const cars = useMemo(() => {
    const carList = []
    const roads = [
      { z: -12, direction: 1, lane: -1.5 },
      { z: -12, direction: -1, lane: 1.5 },
      { z: 2, direction: 1, lane: -1.5 },
      { z: 2, direction: -1, lane: 1.5 },
      { z: 18, direction: 1, lane: -1.5 },
      { z: 18, direction: -1, lane: 1.5 },
      { x: -12, direction: 1, lane: -1.5, vertical: true },
      { x: -12, direction: -1, lane: 1.5, vertical: true },
      { x: 2, direction: 1, lane: -1.5, vertical: true },
      { x: 2, direction: -1, lane: 1.5, vertical: true },
      { x: 18, direction: 1, lane: -1.5, vertical: true },
      { x: 18, direction: -1, lane: 1.5, vertical: true },
    ]
    
    roads.forEach((road, roadIndex) => {
      const carCount = 2 + Math.floor(Math.random() * 2)
      for (let i = 0; i < carCount; i++) {
        carList.push({
          id: carList.length,
          road: road,
          position: -40 + Math.random() * 80,
          speed: (0.08 + Math.random() * 0.12) * road.direction,
          color: ['#ff4444', '#44ff44', '#4444ff', '#ffff44', '#ff44ff', '#44ffff'][Math.floor(Math.random() * 6)],
        })
      }
    })
    return carList
  }, [])

  useFrame(() => {
    if (!visible) return
    carsRef.current.forEach((car, i) => {
      if (car && cars[i]) {
        cars[i].position += cars[i].speed
        if (cars[i].position > 40) {
          cars[i].position = -40
        } else if (cars[i].position < -40) {
          cars[i].position = 40
        }
        
        const road = cars[i].road
        if (road.vertical) {
          car.position.x = road.x + road.lane
          car.position.z = cars[i].position
          car.rotation.y = road.direction > 0 ? 0 : Math.PI
        } else {
          car.position.x = cars[i].position
          car.position.z = road.z + road.lane
          car.rotation.y = road.direction > 0 ? Math.PI / 2 : -Math.PI / 2
        }
      }
    })
  })

  if (!visible) return null

  return (
    <>
      {cars.map((car, i) => (
        <group
          key={car.id}
          ref={(el) => { if (el) carsRef.current[i] = el }}
          position={[car.road.vertical ? car.road.x + car.road.lane : car.position, 0.4, car.road.vertical ? car.position : car.road.z + car.road.lane]}
        >
          <mesh rotation={[0, car.road.vertical ? (car.road.direction > 0 ? 0 : Math.PI) : (car.road.direction > 0 ? Math.PI / 2 : -Math.PI / 2), 0]}>
            <boxGeometry args={[1.8, 0.6, 0.8]} />
            <meshStandardMaterial 
              color={car.color} 
              emissive={isNight ? car.color : '#000000'} 
              emissiveIntensity={isNight ? 0.5 : 0} 
            />
          </mesh>
          {isNight && (
            <>
              <pointLight position={[0.8, 0.3, 0]} color="#ffffff" intensity={0.5} distance={5} />
              <pointLight position={[0.8, 0.3, 0]} color="#ff0000" intensity={0.3} distance={3} />
            </>
          )}
        </group>
      ))}
    </>
  )
}

function SurveillanceCamera({ data, visible }) {
  const meshRef = useRef()
  const [pulse, setPulse] = useState(0)

  useFrame((state) => {
    setPulse(Math.sin(state.clock.elapsedTime * 3) * 0.3 + 0.7)
  })

  if (!visible) return null

  return (
    <group position={[data.x, 0.5, data.z]}>
      <mesh ref={meshRef}>
        <coneGeometry args={[1.5, 3, 4]} />
        <meshBasicMaterial 
          color="#00ff00" 
          transparent 
          opacity={pulse * 0.4}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshBasicMaterial color="#00ff00" />
      </mesh>
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 2, 8]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
    </group>
  )
}

function EnergyMonitor({ data, visible }) {
  const ringRef = useRef()
  const [rotation, setRotation] = useState(0)

  useFrame((state) => {
    setRotation(state.clock.elapsedTime)
  })

  if (!visible) return null

  const consumptionLevel = data.consumption / 5000
  const ringColor = consumptionLevel > 0.7 ? '#ff4444' : consumptionLevel > 0.4 ? '#ffaa00' : '#00ff00'
  const heightOffset = data.buildingHeight + 5

  return (
    <group position={[data.x, heightOffset, data.z]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2, 2.8, 32]} />
        <meshBasicMaterial 
          color={ringColor} 
          transparent 
          opacity={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, rotation]}>
        <ringGeometry args={[1.6, 2.4, 32, 1, 0, Math.PI * 2 * consumptionLevel]} />
        <meshBasicMaterial 
          color={ringColor} 
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshBasicMaterial color={ringColor} />
      </mesh>
      <mesh position={[0, 3, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 3, 8]} />
        <meshBasicMaterial color={ringColor} transparent opacity={0.5} />
      </mesh>
      <mesh position={[0, 4.5, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshBasicMaterial color={ringColor} />
      </mesh>
    </group>
  )
}

function Ground({ isNight }) {
  return (
    <mesh position={[0, -0.5, 0]} receiveShadow>
      <boxGeometry args={[100, 1, 100]} />
      <meshStandardMaterial 
        color={isNight ? "#0a0a1a" : "#1a1a2e"} 
        roughness={0.9} 
      />
    </mesh>
  )
}

function GridHelper({ isNight }) {
  return (
    <gridHelper
      args={[100, 50, isNight ? '#004466' : '#00ffff', isNight ? '#002233' : '#004444']}
      position={[0, 0.01, 0]}
    />
  )
}

function CityScene({ onBuildingClick, layers, isNight }) {
  return (
    <>
      <Ground isNight={isNight} />
      <GridHelper isNight={isNight} />
      
      {roadData.map((road, index) => (
        <Road key={index} data={road} visible={layers.roads} />
      ))}
      
      {streetLightPositions.map((pos, index) => (
        <StreetLight key={index} position={pos} isNight={isNight} />
      ))}
      
      {buildingData.map((building) => (
        <Building
          key={building.id}
          data={building}
          onClick={onBuildingClick}
          visible={layers.buildings}
          isNight={isNight}
        />
      ))}
      
      <Traffic visible={layers.traffic} isNight={isNight} />
      
      {surveillancePoints.map((point) => (
        <SurveillanceCamera
          key={point.id}
          data={point}
          visible={layers.surveillance}
        />
      ))}
      
      {energyPoints.map((point) => (
        <EnergyMonitor
          key={point.id}
          data={point}
          visible={layers.energy}
        />
      ))}
    </>
  )
}

export default CityScene
