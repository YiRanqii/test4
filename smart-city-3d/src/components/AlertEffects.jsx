import React, { useRef, useMemo, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const alertBuildings = [
  { id: 2, type: 'fire', level: 'critical', message: '金融中心 - 火警报警' },
  { id: 5, type: 'structural', level: 'warning', message: '城市地标 - 结构异常' },
  { id: 9, type: 'energy', level: 'info', message: '中央塔楼 - 能耗超标' },
]

const alertColors = {
  fire: '#ff4444',
  structural: '#ffaa00',
  energy: '#44aaff',
}

const alertLevels = {
  critical: { pulseSpeed: 2, intensity: 1 },
  warning: { pulseSpeed: 1.5, intensity: 0.7 },
  info: { pulseSpeed: 1, intensity: 0.5 },
}

function AlertHighlight({ building, alertInfo, buildingData }) {
  const meshRef = useRef()
  const data = buildingData.find(b => b.id === building.id)
  
  const color = useMemo(() => new THREE.Color(alertColors[alertInfo.type]), [alertInfo.type])
  const { pulseSpeed, intensity } = alertLevels[alertInfo.level]

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const time = clock.getElapsedTime()
    const pulse = (Math.sin(time * pulseSpeed * Math.PI) + 1) / 2
    meshRef.current.material.opacity = 0.2 + pulse * 0.4 * intensity
    meshRef.current.scale.setScalar(1 + pulse * 0.05)
  })

  if (!data) return null

  return (
    <mesh
      ref={meshRef}
      position={[data.x, data.height / 2, data.z]}
    >
      <boxGeometry args={[data.width + 0.5, data.height + 0.5, data.depth + 0.5]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.3}
        side={THREE.BackSide}
      />
    </mesh>
  )
}

function AlertEffects({ buildingData, alerts }) {
  return (
    <>
      {alerts.map(alert => (
        <AlertHighlight
          key={alert.id}
          building={alert}
          alertInfo={alert}
          buildingData={buildingData}
        />
      ))}
    </>
  )
}

export { AlertEffects, alertBuildings, alertColors, alertLevels }
