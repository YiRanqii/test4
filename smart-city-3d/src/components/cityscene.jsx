import React, { useMemo, useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// 建筑数据
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

// 道路数据
const roadData = [
  { id: 1, x1: -40, z1: -12, x2: 40, z2: -12, width: 6, direction: 'horizontal' },
  { id: 2, x1: -40, z1: 2, x2: 40, z2: 2, width: 6, direction: 'horizontal' },
  { id: 3, x1: -40, z1: 18, x2: 40, z2: 18, width: 6, direction: 'horizontal' },
  { id: 4, x1: -12, z1: -40, x2: -12, z2: 40, width: 6, direction: 'vertical' },
  { id: 5, x1: 2, z1: -40, x2: 2, z2: 40, width: 6, direction: 'vertical' },
  { id: 6, x1: 18, z1: -40, x2: 18, z2: 40, width: 6, direction: 'vertical' },
]

// 路灯位置数据
const streetLightData = [
  { x: -35, z: -15 }, { x: -20, z: -15 }, { x: -5, z: -15 }, { x: 10, z: -15 }, { x: 25, z: -15 }, { x: 35, z: -15 },
  { x: -35, z: -1 }, { x: -20, z: -1 }, { x: -5, z: -1 }, { x: 10, z: -1 }, { x: 25, z: -1 }, { x: 35, z: -1 },
  { x: -35, z: 15 }, { x: -20, z: 15 }, { x: -5, z: 15 }, { x: 10, z: 15 }, { x: 25, z: 15 }, { x: 35, z: 15 },
  { x: -15, z: -35 }, { x: -15, z: -20 }, { x: -15, z: 5 }, { x: -15, z: 25 }, { x: -15, z: 35 },
  { x: -1, z: -35 }, { x: -1, z: -20 }, { x: -1, z: 5 }, { x: -1, z: 25 }, { x: -1, z: 35 },
  { x: 15, z: -35 }, { x: 15, z: -20 }, { x: 15, z: 5 }, { x: 15, z: 25 }, { x: 15, z: 35 },
]

// 安防监控点位数据
const securityCameraData = [
  { id: 1, x: -30, z: -30, angle: Math.PI / 4 },
  { id: 2, x: 0, z: -30, angle: 0 },
  { id: 3, x: 30, z: -30, angle: -Math.PI / 4 },
  { id: 4, x: -30, z: 0, angle: Math.PI / 2 },
  { id: 5, x: 30, z: 0, angle: -Math.PI / 2 },
  { id: 6, x: -30, z: 30, angle: 3 * Math.PI / 4 },
  { id: 7, x: 0, z: 30, angle: Math.PI },
  { id: 8, x: 30, z: 30, angle: -3 * Math.PI / 4 },
  { id: 9, x: -15, z: -15, angle: Math.PI / 4 },
  { id: 10, x: 15, z: 15, angle: -3 * Math.PI / 4 },
]

// 能耗监测点位数据
const energyMonitorData = [
  { id: 1, x: -20, z: -20, consumption: 85, buildingId: 1 },
  { id: 2, x: -5, z: -20, consumption: 120, buildingId: 2 },
  { id: 3, x: 15, z: -20, consumption: 65, buildingId: 3 },
  { id: 4, x: -25, z: -5, consumption: 45, buildingId: 4 },
  { id: 5, x: -10, z: -5, consumption: 150, buildingId: 5 },
  { id: 6, x: 10, z: -5, consumption: 95, buildingId: 6 },
  { id: 7, x: 25, z: -5, consumption: 55, buildingId: 7 },
  { id: 8, x: -20, z: 10, consumption: 110, buildingId: 8 },
  { id: 9, x: 0, z: 10, consumption: 180, buildingId: 9 },
  { id: 10, x: 20, z: 10, consumption: 88, buildingId: 10 },
  { id: 11, x: -15, z: 25, consumption: 72, buildingId: 11 },
  { id: 12, x: 5, z: 25, consumption: 135, buildingId: 12 },
  { id: 13, x: 25, z: 25, consumption: 60, buildingId: 13 },
]

// 生成窗户灯光数据
function generateWindows(width, height, depth, buildingId) {
  const windows = []
  const cols = Math.floor(width * 1.5)
  const rows = Math.floor(height * 0.8)
  const windowWidth = (width * 0.75) / cols
  const windowHeight = (height * 0.85) / rows
  const spacingX = width * 0.75 / cols
  const spacingY = height * 0.85 / rows
  
  // 前面窗户
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      // 随机决定是否亮灯 (70%概率)
      if (Math.random() > 0.3) {
        windows.push({
          id: `front-${row}-${col}`,
          x: -width * 0.375 + col * spacingX + spacingX / 2,
          y: -height * 0.425 + row * spacingY + spacingY / 2,
          z: depth / 2 + 0.05,
          width: windowWidth * 0.7,
          height: windowHeight * 0.7,
          side: 'front',
          brightness: 0.5 + Math.random() * 0.5
        })
      }
    }
  }
  
  // 侧面窗户
  const sideCols = Math.floor(depth * 1.5)
  const sideWindowWidth = (depth * 0.75) / sideCols
  const sideSpacingX = depth * 0.75 / sideCols
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < sideCols; col++) {
      if (Math.random() > 0.4) {
        windows.push({
          id: `side-${row}-${col}`,
          x: width / 2 + 0.05,
          y: -height * 0.425 + row * spacingY + spacingY / 2,
          z: -depth * 0.375 + col * sideSpacingX + sideSpacingX / 2,
          width: 0.05,
          height: windowHeight * 0.7,
          depth: sideWindowWidth * 0.7,
          side: 'right',
          brightness: 0.5 + Math.random() * 0.5
        })
      }
    }
  }
  
  return windows
}

// 单个窗户组件
function WindowLight({ window, isNightMode }) {
  const lightRef = useRef()
  
  useFrame(() => {
    if (lightRef.current && isNightMode) {
      // 轻微的闪烁效果模拟真实灯光
      const flicker = 1 + Math.sin(Date.now() * 0.001 + window.x * 10) * 0.05
      lightRef.current.material.opacity = window.brightness * 0.8 * flicker
    }
  })
  
  if (!isNightMode) return null
  
  const windowColor = window.brightness > 0.7 ? '#ffeebb' : window.brightness > 0.5 ? '#ffdd88' : '#ffcc66'
  
  if (window.side === 'front') {
    return (
      <mesh ref={lightRef} position={[window.x, window.y, window.z]}>
        <planeGeometry args={[window.width, window.height]} />
        <meshBasicMaterial 
          color={windowColor}
          transparent 
          opacity={window.brightness * 0.7}
          side={THREE.DoubleSide}
        />
      </mesh>
    )
  } else {
    return (
      <mesh ref={lightRef} position={[window.x, window.y, window.z]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[window.depth, window.height]} />
        <meshBasicMaterial 
          color={windowColor}
          transparent 
          opacity={window.brightness * 0.6}
          side={THREE.DoubleSide}
        />
      </mesh>
    )
  }
}

// 建筑组件
function Building({ data, onClick, visible, isNightMode }) {
  const meshRef = useRef()
  const [hovered, setHovered] = React.useState(false)
  
  // 使用useMemo缓存窗户数据，避免每次渲染重新生成
  const windows = useMemo(() => generateWindows(data.width, data.height, data.depth, data.id), [data])

  const color = useMemo(() => {
    if (data.type === '办公楼') return '#2a6099'
    if (data.type === '商业楼') return '#993333'
    if (data.type === '住宅楼') return '#339933'
    return '#997733'
  }, [data.type])

  useFrame((state) => {
    if (meshRef.current && hovered) {
      meshRef.current.material.emissive.setHex(0x333333)
      meshRef.current.material.emissiveIntensity = 0.3
    } else if (meshRef.current) {
      if (isNightMode) {
        // 夜晚建筑整体微光
        meshRef.current.material.emissive.setHex(0x0a0a1a)
        meshRef.current.material.emissiveIntensity = 0.15
      } else {
        meshRef.current.material.emissive.setHex(0x000000)
        meshRef.current.material.emissiveIntensity = 0
      }
    }
  })

  if (!visible) return null

  return (
    <group position={[data.x, data.height / 2, data.z]}>
      {/* 建筑主体 */}
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
          roughness={0.4}
          metalness={0.1}
        />
      </mesh>
      
      {/* 窗户灯光层 */}
      {isNightMode && windows.map((window) => (
        <WindowLight key={window.id} window={window} isNightMode={isNightMode} />
      ))}
      
      {/* 建筑顶部装饰灯光 */}
      {isNightMode && (
        <>
          {/* 顶部轮廓灯 */}
          <mesh position={[0, data.height / 2 + 0.1, 0]}>
            <boxGeometry args={[data.width + 0.2, 0.1, data.depth + 0.2]} />
            <meshBasicMaterial color="#ff6666" transparent opacity={0.6} />
          </mesh>
          {/* 顶部点光源 */}
          <pointLight
            position={[0, data.height / 2 + 2, 0]}
            intensity={0.5}
            distance={20}
            color="#ffaa66"
          />
        </>
      )}
    </group>
  )
}

// 道路组件
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

// 路灯组件
function StreetLight({ data, isNightMode, visible }) {
  if (!visible) return null

  return (
    <group position={[data.x, 0, data.z]}>
      {/* 灯杆 */}
      <mesh position={[0, 4, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.15, 8, 8]} />
        <meshStandardMaterial color="#666666" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* 灯头 */}
      <mesh position={[0, 8.2, 0]} castShadow>
        <boxGeometry args={[1.5, 0.3, 0.5]} />
        <meshStandardMaterial color="#444444" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* 光源 */}
      {isNightMode && (
        <>
          <pointLight
            position={[0, 7.5, 0]}
            intensity={2}
            distance={15}
            color="#ffdd88"
            castShadow
          />
          {/* 光晕效果 */}
          <mesh position={[0, 7.8, 0]}>
            <sphereGeometry args={[0.3, 8, 8]} />
            <meshBasicMaterial color="#ffdd88" transparent opacity={0.8} />
          </mesh>
        </>
      )}
    </group>
  )
}

// 改进的车辆组件
function Car({ data, road, onComplete }) {
  const carRef = useRef()
  const progressRef = useRef(Math.random())

  useFrame(() => {
    if (!carRef.current) return
    
    progressRef.current += data.speed * 0.01
    if (progressRef.current >= 1) {
      progressRef.current = 0
    }
    
    const t = progressRef.current
    const x = road.x1 + (road.x2 - road.x1) * t
    const z = road.z1 + (road.z2 - road.z1) * t
    
    // 计算车辆朝向
    const angle = Math.atan2(road.z2 - road.z1, road.x2 - road.x1)
    
    carRef.current.position.set(x, 0.6, z + data.laneOffset)
    carRef.current.rotation.y = -angle
  })

  return (
    <group ref={carRef}>
      {/* 车身 */}
      <mesh castShadow>
        <boxGeometry args={[2, 0.8, 1]} />
        <meshStandardMaterial color={data.color} metalness={0.3} roughness={0.4} />
      </mesh>
      {/* 车顶 */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <boxGeometry args={[1.2, 0.5, 0.8]} />
        <meshStandardMaterial color="#333333" metalness={0.2} roughness={0.6} />
      </mesh>
      {/* 车灯 */}
      <mesh position={[1.05, -0.1, 0.3]}>
        <boxGeometry args={[0.1, 0.2, 0.2]} />
        <meshStandardMaterial color="#ffffaa" emissive="#ffffaa" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[1.05, -0.1, -0.3]}>
        <boxGeometry args={[0.1, 0.2, 0.2]} />
        <meshStandardMaterial color="#ffffaa" emissive="#ffffaa" emissiveIntensity={0.5} />
      </mesh>
      {/* 尾灯 */}
      <mesh position={[-1.05, -0.1, 0.3]}>
        <boxGeometry args={[0.1, 0.2, 0.2]} />
        <meshStandardMaterial color="#ff4444" emissive="#ff4444" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[-1.05, -0.1, -0.3]}>
        <boxGeometry args={[0.1, 0.2, 0.2]} />
        <meshStandardMaterial color="#ff4444" emissive="#ff4444" emissiveIntensity={0.3} />
      </mesh>
      {/* 车轮 */}
      {[[-0.6, 0.35], [0.6, 0.35], [-0.6, -0.35], [0.6, -0.35]].map(([x, z], i) => (
        <mesh key={i} position={[x, -0.3, z]}>
          <cylinderGeometry args={[0.2, 0.2, 0.15, 8]} rotation={[0, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#222222" />
        </mesh>
      ))}
    </group>
  )
}

// 交通车辆系统
function TrafficSystem({ visible, isNightMode }) {
  if (!visible) return null

  const cars = useMemo(() => {
    const carColors = ['#ff4444', '#44ff44', '#4444ff', '#ffff44', '#ff44ff', '#44ffff', '#ffffff', '#888888']
    const allCars = []
    
    roadData.forEach((road, roadIndex) => {
      // 每条道路生成2-4辆车
      const carCount = 2 + Math.floor(Math.random() * 3)
      for (let i = 0; i < carCount; i++) {
        allCars.push({
          id: `${roadIndex}-${i}`,
          road: road,
          color: carColors[Math.floor(Math.random() * carColors.length)],
          speed: 0.3 + Math.random() * 0.4,
          laneOffset: (Math.random() - 0.5) * 2,
        })
      }
    })
    
    return allCars
  }, [])

  return (
    <>
      {cars.map((car) => (
        <Car key={car.id} data={car} road={car.road} />
      ))}
    </>
  )
}

// 安防监控组件
function SecurityCamera({ data, visible }) {
  const cameraRef = useRef()
  const scanRef = useRef(0)

  useFrame(() => {
    if (!cameraRef.current || !visible) return
    scanRef.current += 0.02
    cameraRef.current.rotation.y = data.angle + Math.sin(scanRef.current) * 0.5
  })

  if (!visible) return null

  return (
    <group position={[data.x, 6, data.z]}>
      {/* 监控杆 */}
      <mesh position={[0, -3, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.1, 6, 8]} />
        <meshStandardMaterial color="#555555" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* 摄像头外壳 */}
      <group ref={cameraRef}>
        <mesh castShadow>
          <boxGeometry args={[0.6, 0.4, 0.5]} />
          <meshStandardMaterial color="#333333" metalness={0.5} roughness={0.4} />
        </mesh>
        {/* 镜头 */}
        <mesh position={[0.3, 0, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.15, 16]} rotation={[0, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#111111" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* 指示灯 */}
        <mesh position={[0, 0.25, 0.15]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial color="#00ff00" />
        </mesh>
      </group>
      {/* 扫描范围指示（半透明） */}
      <mesh position={[0, -6, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[8, 8.5, 32]} />
        <meshBasicMaterial color="#00ff00" transparent opacity={0.2} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

// 能耗监测组件
function EnergyMonitor({ data, visible }) {
  const barRef = useRef()
  const glowRef = useRef()
  const [hovered, setHovered] = React.useState(false)

  useFrame(() => {
    if (!barRef.current) return
    // 能耗条脉动动画
    const scale = 1 + Math.sin(Date.now() * 0.005 + data.id) * 0.15
    barRef.current.scale.y = scale
    
    // 光晕旋转动画
    if (glowRef.current) {
      glowRef.current.rotation.y += 0.02
    }
  })

  if (!visible) return null

  const height = data.consumption / 8
  const color = data.consumption > 100 ? '#ff4444' : data.consumption > 70 ? '#ffaa00' : '#44ff44'

  return (
    <group position={[data.x + 6, 0, data.z + 6]}>
      {/* 连接线到建筑 */}
      <mesh position={[-3, height / 2, -3]}>
        <cylinderGeometry args={[0.05, 0.05, Math.sqrt(18) * 2, 4]} rotation={[0, 0, Math.PI / 4]} />
        <meshBasicMaterial color={color} transparent opacity={0.5} />
      </mesh>
      
      {/* 底座光环 */}
      <mesh ref={glowRef} position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.8, 1.2, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>
      
      {/* 底座 */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.6, 0.7, 0.3, 16]} />
        <meshStandardMaterial color="#222222" metalness={0.5} roughness={0.3} />
      </mesh>
      
      {/* 能耗指示柱 - 玻璃管效果 */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.5, 16]} />
        <meshStandardMaterial color="#333333" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* 能耗柱状图 */}
      <mesh 
        ref={barRef}
        position={[0, height / 2 + 0.8, 0]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <cylinderGeometry args={[0.35, 0.35, height, 16]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color}
          emissiveIntensity={0.6}
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {/* 能量粒子效果 */}
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh key={i} position={[Math.sin(i * 1.2) * 0.6, height + 1 + i * 0.3, Math.cos(i * 1.2) * 0.6]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshBasicMaterial color={color} transparent opacity={0.8 - i * 0.15} />
        </mesh>
      ))}
      
      {/* 顶部能量球 */}
      <mesh position={[0, height + 1.2, 0]}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} />
      </mesh>
      
      {/* 数值显示牌 */}
      <mesh position={[0, 0.5, 0.8]} rotation={[0, 0, 0]}>
        <boxGeometry args={[1.2, 0.6, 0.1]} />
        <meshStandardMaterial color="#111111" />
      </mesh>
      
      {/* 悬浮提示框 */}
      {hovered && (
        <group position={[0, height + 2.5, 0]}>
          <mesh>
            <planeGeometry args={[3, 1]} />
            <meshBasicMaterial color="rgba(0,0,0,0.8)" />
          </mesh>
        </group>
      )}
    </group>
  )
}

// 地面组件
function Ground() {
  return (
    <mesh position={[0, -0.5, 0]} receiveShadow>
      <boxGeometry args={[100, 1, 100]} />
      <meshStandardMaterial color="#1a1a2e" roughness={0.9} />
    </mesh>
  )
}

// 网格辅助线
function GridHelper() {
  return (
    <gridHelper
      args={[100, 50, '#00ffff', '#004444']}
      position={[0, 0.01, 0]}
    />
  )
}

// 主场景组件
function CityScene({ onBuildingClick, layers, isNightMode }) {
  return (
    <>
      <Ground />
      <GridHelper />
      
      {roadData.map((road) => (
        <Road key={road.id} data={road} visible={layers.roads} />
      ))}
      
      {buildingData.map((building) => (
        <Building
          key={building.id}
          data={building}
          onClick={onBuildingClick}
          visible={layers.buildings}
          isNightMode={isNightMode}
        />
      ))}
      
      {/* 路灯 */}
      {streetLightData.map((light, index) => (
        <StreetLight 
          key={index} 
          data={light} 
          isNightMode={isNightMode}
          visible={layers.roads}
        />
      ))}
      
      {/* 交通车辆 */}
      <TrafficSystem visible={layers.traffic} isNightMode={isNightMode} />
      
      {/* 安防监控 */}
      {securityCameraData.map((camera) => (
        <SecurityCamera 
          key={camera.id} 
          data={camera} 
          visible={layers.security}
        />
      ))}
      
      {/* 能耗监测 */}
      {energyMonitorData.map((monitor) => (
        <EnergyMonitor 
          key={monitor.id} 
          data={monitor} 
          visible={layers.energy}
        />
      ))}
    </>
  )
}

export default CityScene
