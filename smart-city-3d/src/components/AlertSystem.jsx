import React, { useRef, useMemo, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// 预警建筑高亮效果
function AlertBuilding({ data, onClick }) {
  const meshRef = useRef()
  const [hovered, setHovered] = React.useState(false)
  const [pulsePhase, setPulsePhase] = useState(0)

  useFrame((state) => {
    if (meshRef.current) {
      // 脉冲闪烁效果
      const pulse = Math.sin(state.clock.elapsedTime * 3) * 0.5 + 0.5
      meshRef.current.material.emissive.setRGB(pulse * 0.8, 0, 0)
      meshRef.current.material.opacity = 0.7 + pulse * 0.3
    }
  })

  return (
    <mesh
      ref={meshRef}
      position={[data.x, data.height / 2, data.z]}
      onClick={() => onClick(data)}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      castShadow
    >
      <boxGeometry args={[data.width + 0.5, data.height + 0.5, data.depth + 0.5]} />
      <meshStandardMaterial 
        color="#ff0000" 
        transparent
        opacity={0.8}
        emissive="#ff0000"
        emissiveIntensity={0.5}
      />
    </mesh>
  )
}

// 预警区域标记
function AlertZone({ zone }) {
  const ringRef = useRef()

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z += 0.02
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.2
      ringRef.current.scale.set(scale, scale, 1)
    }
  })

  return (
    <group position={[zone.x, 0.5, zone.z]}>
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[zone.radius - 2, zone.radius, 32]} />
        <meshBasicMaterial color="#ff4444" transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[zone.radius, 32]} />
        <meshBasicMaterial color="#ff4444" transparent opacity={0.2} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

// 3D预警系统
export function AlertSystem3D({ alertBuildings, alertZones, onBuildingClick }) {
  return (
    <>
      {alertBuildings.map((building) => (
        <AlertBuilding 
          key={building.id} 
          data={building} 
          onClick={onBuildingClick}
        />
      ))}
      {alertZones.map((zone, index) => (
        <AlertZone key={index} zone={zone} />
      ))}
    </>
  )
}

// 预警面板组件
export function AlertPanel({ alerts, onDismiss }) {
  const getAlertIcon = (level) => {
    switch (level) {
      case 'critical': return '🔴'
      case 'warning': return '🟡'
      case 'info': return '🔵'
      default: return '⚪'
    }
  }

  const getAlertClass = (level) => {
    switch (level) {
      case 'critical': return 'alert-critical'
      case 'warning': return 'alert-warning'
      case 'info': return 'alert-info'
      default: return ''
    }
  }

  if (alerts.length === 0) return null

  return (
    <div className="alert-panel">
      <h3>⚠️ 预警信息</h3>
      <div className="alert-list">
        {alerts.map((alert) => (
          <div key={alert.id} className={`alert-item ${getAlertClass(alert.level)}`}>
            <div className="alert-header">
              <span className="alert-icon">{getAlertIcon(alert.level)}</span>
              <span className="alert-title">{alert.title}</span>
              <button 
                className="alert-dismiss" 
                onClick={() => onDismiss(alert.id)}
              >
                ×
              </button>
            </div>
            <p className="alert-message">{alert.message}</p>
            <span className="alert-time">{alert.time}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// 模拟预警数据生成
export function generateMockAlerts() {
  const alertTypes = [
    { title: '火灾预警', message: '科技大厦检测到烟雾浓度异常', level: 'critical' },
    { title: '电力异常', message: '金融中心用电量超出正常范围', level: 'warning' },
    { title: '交通堵塞', message: '主干道拥堵指数超过80%', level: 'warning' },
    { title: '设备维护', message: '中央塔楼空调系统需要维护', level: 'info' },
  ]

  return alertTypes.map((alert, index) => ({
    id: Date.now() + index,
    ...alert,
    time: new Date().toLocaleTimeString('zh-CN'),
  }))
}

// 预警建筑数据
export const alertBuildingsData = [
  { id: 101, x: -20, z: -20, width: 8, depth: 8, height: 25, name: '科技大厦', alertType: '火灾预警' },
  { id: 102, x: -5, z: -20, width: 10, depth: 10, height: 35, name: '金融中心', alertType: '电力异常' },
]

// 预警区域数据
export const alertZonesData = [
  { x: -12, z: -12, radius: 15 },
]
