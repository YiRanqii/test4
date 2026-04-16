import React, { useMemo, useRef } from 'react'
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

function Building({ data, onClick, visible }) {
  const meshRef = useRef()
  const [hovered, setHovered] = React.useState(false)

  const color = useMemo(() => {
    if (data.type === '办公楼') return '#4a90d9'
    if (data.type === '商业楼') return '#d94a4a'
    if (data.type === '住宅楼') return '#4ad94a'
    return '#d9a04a'
  }, [data.type])

  useFrame(() => {
    if (meshRef.current && hovered) {
      meshRef.current.material.emissive.setHex(0x222222)
    } else if (meshRef.current) {
      meshRef.current.material.emissive.setHex(0x000000)
    }
  })

  if (!visible) return null

  return (
    <mesh
      ref={meshRef}
      position={[data.x, data.height / 2, data.z]}
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

function Traffic({ visible }) {
  const carsRef = useRef([])
  
  const cars = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: -40 + Math.random() * 80,
      z: -12 + (Math.random() > 0.5 ? 0 : 14) + (Math.random() - 0.5) * 4,
      speed: 0.1 + Math.random() * 0.15,
      color: ['#ff4444', '#44ff44', '#4444ff', '#ffff44'][Math.floor(Math.random() * 4)],
    }))
  }, [])

  useFrame(() => {
    if (!visible) return
    carsRef.current.forEach((car, i) => {
      if (car) {
        car.position.x += cars[i].speed
        if (car.position.x > 40) {
          car.position.x = -40
        }
      }
    })
  })

  if (!visible) return null

  return (
    <>
      {cars.map((car, i) => (
        <mesh
          key={car.id}
          ref={(el) => { if (el) carsRef.current[i] = el }}
          position={[car.x, 0.5, car.z]}
        >
          <boxGeometry args={[1.5, 0.8, 0.8]} />
          <meshStandardMaterial color={car.color} emissive={car.color} emissiveIntensity={0.3} />
        </mesh>
      ))}
    </>
  )
}

function Ground() {
  return (
    <mesh position={[0, -0.5, 0]} receiveShadow>
      <boxGeometry args={[100, 1, 100]} />
      <meshStandardMaterial color="#1a1a2e" roughness={0.9} />
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

function CityScene({ onBuildingClick, layers }) {
  return (
    <>
      <Ground />
      <GridHelper />
      
      {roadData.map((road, index) => (
        <Road key={index} data={road} visible={layers.roads} />
      ))}
      
      {buildingData.map((building) => (
        <Building
          key={building.id}
          data={building}
          onClick={onBuildingClick}
          visible={layers.buildings}
        />
      ))}
      
      <Traffic visible={layers.traffic} />
    </>
  )
}

export { CityScene as default, buildingData }
