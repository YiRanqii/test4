import React, { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const buildingData = [
  { id: 1, x: -20, z: -20, width: 8, depth: 8, height: 25, name: '科技大厦', type: '办公楼', floors: 30, occupancy: 85, energyLevel: 2 },
  { id: 2, x: -5, z: -20, width: 10, depth: 10, height: 35, name: '金融中心', type: '商业楼', floors: 45, occupancy: 92, energyLevel: 3 },
  { id: 3, x: 15, z: -20, width: 7, depth: 7, height: 20, name: '创新广场', type: '办公楼', floors: 25, occupancy: 78, energyLevel: 1 },
  { id: 4, x: -25, z: -5, width: 6, depth: 6, height: 18, name: '住宅A区', type: '住宅楼', floors: 22, occupancy: 95, energyLevel: 1 },
  { id: 5, x: -10, z: -5, width: 12, depth: 8, height: 40, name: '城市地标', type: '综合体', floors: 55, occupancy: 88, energyLevel: 3 },
  { id: 6, x: 10, z: -5, width: 8, depth: 8, height: 28, name: '商务中心', type: '办公楼', floors: 35, occupancy: 82, energyLevel: 2 },
  { id: 7, x: 25, z: -5, width: 6, depth: 6, height: 22, name: '住宅B区', type: '住宅楼', floors: 28, occupancy: 91, energyLevel: 1 },
  { id: 8, x: -20, z: 10, width: 9, depth: 9, height: 30, name: '科技园A座', type: '办公楼', floors: 38, occupancy: 87, energyLevel: 2 },
  { id: 9, x: 0, z: 10, width: 11, depth: 11, height: 45, name: '中央塔楼', type: '商业楼', floors: 60, occupancy: 96, energyLevel: 3 },
  { id: 10, x: 20, z: 10, width: 8, depth: 8, height: 26, name: '科技园B座', type: '办公楼', floors: 32, occupancy: 79, energyLevel: 2 },
  { id: 11, x: -15, z: 25, width: 7, depth: 7, height: 24, name: '公寓楼A', type: '住宅楼', floors: 30, occupancy: 93, energyLevel: 1 },
  { id: 12, x: 5, z: 25, width: 10, depth: 10, height: 32, name: '购物中心', type: '商业楼', floors: 8, occupancy: 89, energyLevel: 3 },
  { id: 13, x: 25, z: 25, width: 7, depth: 7, height: 21, name: '公寓楼B', type: '住宅楼', floors: 26, occupancy: 86, energyLevel: 1 },
]

const roadData = [
  { x1: -40, z1: -12, x2: 40, z2: -12, width: 6, isHorizontal: true },
  { x1: -40, z1: 2, x2: 40, z2: 2, width: 6, isHorizontal: true },
  { x1: -40, z1: 18, x2: 40, z2: 18, width: 6, isHorizontal: true },
  { x1: -12, z1: -40, x2: -12, z2: 40, width: 6, isHorizontal: false },
  { x1: 2, z1: -40, x2: 2, z2: 40, width: 6, isHorizontal: false },
  { x1: 18, z1: -40, x2: 18, z2: 40, width: 6, isHorizontal: false },
]

const streetLightPositions = [
  { x: -30, z: -14 }, { x: -15, z: -14 }, { x: 0, z: -14 }, { x: 15, z: -14 }, { x: 30, z: -14 },
  { x: -30, z: 0 }, { x: -15, z: 0 }, { x: 0, z: 0 }, { x: 15, z: 0 }, { x: 30, z: 0 },
  { x: -30, z: 16 }, { x: -15, z: 16 }, { x: 0, z: 16 }, { x: 15, z: 16 }, { x: 30, z: 16 },
  { x: -14, z: -30 }, { x: -14, z: -15 }, { x: -14, z: 15 }, { x: -14, z: 30 },
  { x: 0, z: -30 }, { x: 0, z: -15 }, { x: 0, z: 15 }, { x: 0, z: 30 },
  { x: 16, z: -30 }, { x: 16, z: -15 }, { x: 16, z: 15 }, { x: 16, z: 30 },
]

const cameraPositions = [
  { x: -35, z: -35, rotation: Math.PI / 4 },
  { x: 35, z: -35, rotation: Math.PI / 4 + Math.PI / 2 },
  { x: -35, z: 35, rotation: -Math.PI / 4 },
  { x: 35, z: 35, rotation: -Math.PI / 4 - Math.PI / 2 },
  { x: 0, z: 0, rotation: 0 },
  { x: -25, z: 0, rotation: Math.PI / 2 },
  { x: 25, z: 0, rotation: -Math.PI / 2 },
]

const carRoutes = [
  { points: [{ x: -40, z: -13 }, { x: 40, z: -13 }, { x: 40, z: -11 }, { x: -40, z: -11 }], isLoop: true },
  { points: [{ x: 40, z: 1 }, { x: -40, z: 1 }, { x: -40, z: 3 }, { x: 40, z: 3 }], isLoop: true },
  { points: [{ x: -40, z: 17 }, { x: 40, z: 17 }, { x: 40, z: 19 }, { x: -40, z: 19 }], isLoop: true },
  { points: [{ x: -13, z: 40 }, { x: -13, z: -40 }, { x: -11, z: -40 }, { x: -11, z: 40 }], isLoop: true },
  { points: [{ x: 1, z: -40 }, { x: 1, z: 40 }, { x: 3, z: 40 }, { x: 3, z: -40 }], isLoop: true },
  { points: [{ x: 19, z: 40 }, { x: 19, z: -40 }, { x: 17, z: -40 }, { x: 17, z: 40 }], isLoop: true },
]

function Building({ data, onClick, visible, isNight }) {
  const meshRef = useRef()
  const windowsRef = useRef([])
  const [hovered, setHovered] = React.useState(false)

  const color = useMemo(() => {
    if (data.type === '办公楼') return '#4a90d9'
    if (data.type === '商业楼') return '#d94a4a'
    if (data.type === '住宅楼') return '#4ad94a'
    return '#d9a04a'
  }, [data.type])

  const windows = useMemo(() => {
    const win = []
    const windowRows = Math.floor(data.height / 3)
    const windowColsFront = Math.floor(data.width / 2.5)
    const windowColsSide = Math.floor(data.depth / 2.5)
    
    for (let row = 1; row < windowRows; row++) {
      for (let col = 0; col < windowColsFront; col++) {
        win.push({ x: -data.width / 2 + 1 + col * 2.2, y: row * 3, z: data.depth / 2 + 0.3, side: 'front' })
        win.push({ x: -data.width / 2 + 1 + col * 2.2, y: row * 3, z: -data.depth / 2 - 0.3, side: 'back' })
      }
      for (let col = 0; col < windowColsSide; col++) {
        win.push({ x: data.width / 2 + 0.3, y: row * 3, z: -data.depth / 2 + 1 + col * 2.2, side: 'right' })
        win.push({ x: -data.width / 2 - 0.3, y: row * 3, z: -data.depth / 2 + 1 + col * 2.2, side: 'left' })
      }
    }
    return win
  }, [data])

  useFrame((state) => {
    if (meshRef.current && hovered) {
      meshRef.current.material.emissive.setHex(0x222222)
    } else if (meshRef.current) {
      meshRef.current.material.emissive.setHex(0x000000)
    }
    if (isNight && windowsRef.current) {
      windowsRef.current.forEach((win, i) => {
        if (win) {
          const flicker = Math.sin(state.clock.elapsedTime * 2 + i * 0.5) * 0.1 + 0.9
          win.material.opacity = flicker
        }
      })
    }
  })

  if (!visible) return null

  return (
    <group position={[data.x, 0, data.z]}>
      <mesh
        ref={meshRef}
        position={[0, data.height / 2, 0]}
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
      {isNight && windows.map((win, i) => (
        <mesh
          key={i}
          ref={(el) => { if (el) windowsRef.current[i] = el }}
          position={[win.x, win.y, win.z]}
          rotation={win.side === 'front' || win.side === 'back' ? [0, 0, 0] : [0, Math.PI / 2, 0]}
        >
          <planeGeometry args={[0.9, 1.4]} />
          <meshStandardMaterial 
            color="#ffffcc" 
            emissive="#ffffaa" 
            emissiveIntensity={2.5}
            transparent
          />
        </mesh>
      ))}
    </group>
  )
}

function StreetLight({ position, isNight }) {
  const lightRef = useRef()
  const bulbRef = useRef()
  
  useFrame((state) => {
    if (lightRef.current && isNight) {
      const pulse = Math.sin(state.clock.elapsedTime * 2 + position.x * 0.1) * 0.3 + 1
      lightRef.current.intensity = pulse * 10
    }
    if (bulbRef.current && isNight) {
      const glow = Math.sin(state.clock.elapsedTime * 2 + position.x * 0.1) * 0.2 + 1
      bulbRef.current.scale.setScalar(glow)
    }
  })

  return (
    <group position={[position.x, 0, position.z]}>
      <mesh position={[0, 4, 0]}>
        <cylinderGeometry args={[0.08, 0.12, 8, 8]} />
        <meshStandardMaterial color="#222222" metalness={0.9} />
      </mesh>
      {isNight && (
        <mesh position={[0, 8, 0]}>
          <sphereGeometry args={[0.6, 16, 16]} />
          <meshBasicMaterial 
            color="#ffff88" 
            transparent
            opacity={0.3}
          />
        </mesh>
      )}
      <mesh ref={bulbRef} position={[0, 8, 0]}>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshStandardMaterial 
          color={isNight ? "#ffffff" : "#666666"} 
          emissive={isNight ? "#ffffaa" : "#000000"} 
          emissiveIntensity={isNight ? 4 : 0}
        />
      </mesh>
      {isNight && (
        <pointLight
          ref={lightRef}
          position={[0, 7.5, 0]}
          color="#ffffaa"
          intensity={10}
          distance={20}
          castShadow={false}
        />
      )}
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
    <group>
      <mesh position={[midX, 0.1, midZ]} rotation={[0, -angle, 0]} receiveShadow>
        <boxGeometry args={[length, 0.2, data.width]} />
        <meshStandardMaterial color="#333333" roughness={0.9} />
      </mesh>
      <mesh position={[midX, 0.21, midZ]} rotation={[0, -angle, 0]}>
        <boxGeometry args={[length, 0.02, 0.1]} />
        <meshStandardMaterial color="#ffffaa" />
      </mesh>
    </group>
  )
}

function Traffic({ visible }) {
  const carsRef = useRef([])
  const progressRef = useRef([])

  const cars = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      routeIndex: i % carRoutes.length,
      progress: Math.random(),
      speed: 0.0008 + Math.random() * 0.0012,
      color: ['#ff4444', '#4488ff', '#ffffff', '#333333', '#ffaa00'][Math.floor(Math.random() * 5)],
    }))
  }, [])

  const getPositionOnRoute = (route, progress) => {
    const totalLength = route.points.length
    const segment = Math.floor(progress * totalLength)
    const segmentProgress = (progress * totalLength) - segment
    const nextSegment = (segment + 1) % totalLength
    
    const p1 = route.points[segment]
    const p2 = route.points[nextSegment]
    
    return {
      x: p1.x + (p2.x - p1.x) * segmentProgress,
      z: p1.z + (p2.z - p1.z) * segmentProgress,
      angle: Math.atan2(p2.z - p1.z, p2.x - p1.x),
    }
  }

  useFrame(() => {
    if (!visible) return
    
    carsRef.current.forEach((car, i) => {
      if (car) {
        progressRef.current[i] = (progressRef.current[i] || cars[i].progress) + cars[i].speed
        if (progressRef.current[i] >= 1) progressRef.current[i] = 0
        
        const pos = getPositionOnRoute(carRoutes[cars[i].routeIndex], progressRef.current[i])
        car.position.x = pos.x
        car.position.z = pos.z
        car.rotation.y = -pos.angle
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
        >
          <mesh position={[0, 0.5, 0]}>
            <boxGeometry args={[2, 0.7, 1]} />
            <meshStandardMaterial color={car.color} />
          </mesh>
          <mesh position={[-0.3, 0.9, 0]}>
            <boxGeometry args={[0.8, 0.5, 0.9]} />
            <meshStandardMaterial color={car.color} />
          </mesh>
          <mesh position={[0.7, 0.35, 0.55]}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshStandardMaterial color="#ffffaa" emissive="#ffffaa" emissiveIntensity={1} />
          </mesh>
          <mesh position={[0.7, 0.35, -0.55]}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshStandardMaterial color="#ffffaa" emissive="#ffffaa" emissiveIntensity={1} />
          </mesh>
        </group>
      ))}
    </>
  )
}

function SecurityCamera({ position, rotation, visible }) {
  const coneRef = useRef()
  
  useFrame((state) => {
    if (coneRef.current) {
      coneRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.5
    }
  })

  if (!visible) return null

  return (
    <group position={[position.x, 12, position.z]} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.5, 0.5, 1]} />
        <meshStandardMaterial color="#333333" metalness={0.8} />
      </mesh>
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 1, 8]} />
        <meshStandardMaterial color="#555555" />
      </mesh>
      <mesh ref={coneRef} position={[0, -0.2, 3]} rotation={[Math.PI / 3, 0, 0]}>
        <coneGeometry args={[4, 8, 16, 1, true]} />
        <meshStandardMaterial 
          color="#00ff00" 
          transparent 
          opacity={0.15}
          side={THREE.DoubleSide}
        />
      </mesh>
      <pointLight position={[0, -0.5, 0.5]} color="#00ff00" intensity={1} distance={5} />
    </group>
  )
}

function EnergyMonitor({ buildings, visible }) {
  const energyColors = ['#00ff00', '#ffaa00', '#ff4444']
  
  if (!visible) return null

  return (
    <>
      {buildings.map((building) => (
        <group key={building.id} position={[building.x, 0, building.z]}>
          <mesh position={[0, building.height + 3, 0]}>
            <sphereGeometry args={[1.5, 16, 16]} />
            <meshStandardMaterial 
              color={energyColors[building.energyLevel - 1]} 
              emissive={energyColors[building.energyLevel - 1]} 
              emissiveIntensity={1}
              transparent
              opacity={0.8}
            />
          </mesh>
          <mesh position={[0, building.height + 3, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.8, 2.2, 32]} />
            <meshBasicMaterial 
              color={energyColors[building.energyLevel - 1]} 
              side={THREE.DoubleSide}
              transparent
              opacity={0.6}
            />
          </mesh>
          <pointLight 
            position={[0, building.height + 3, 0]} 
            color={energyColors[building.energyLevel - 1]} 
            intensity={2} 
            distance={10} 
          />
        </group>
      ))}
    </>
  )
}

function Ground() {
  return (
    <mesh position={[0, -0.5, 0]} receiveShadow>
      <boxGeometry args={[100, 1, 100]} />
      <meshStandardMaterial color="#1a2a1a" roughness={0.9} />
    </mesh>
  )
}

function GridHelper() {
  return (
    <gridHelper
      args={[100, 50, '#00ffff', '#004444']}
      position={[0, 0.01, 0]}
    />
  )
}

function CityScene({ onBuildingClick, layers, isNight }) {
  return (
    <>
      <Ground />
      <GridHelper />
      
      {roadData.map((road, index) => (
        <Road key={index} data={road} visible={layers.roads} />
      ))}
      
      {streetLightPositions.map((pos, i) => (
        <StreetLight key={i} position={pos} isNight={isNight} />
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
      
      <Traffic visible={layers.traffic} />
      
      {cameraPositions.map((pos, i) => (
        <SecurityCamera key={i} position={pos} rotation={pos.rotation} visible={layers.security} />
      ))}
      
      <EnergyMonitor buildings={buildingData} visible={layers.energy} />
    </>
  )
}

export default CityScene
