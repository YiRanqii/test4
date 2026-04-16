import React, { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

// 雨粒子效果
function RainEffect({ intensity = 1 }) {
  const rainRef = useRef()
  const rainCount = 5000 * intensity

  const rainPositions = useMemo(() => {
    const positions = new Float32Array(rainCount * 3)
    for (let i = 0; i < rainCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 100
      positions[i * 3 + 1] = Math.random() * 80
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100
    }
    return positions
  }, [rainCount])

  useFrame(() => {
    if (rainRef.current) {
      const positions = rainRef.current.geometry.attributes.position.array
      for (let i = 0; i < rainCount; i++) {
        positions[i * 3 + 1] -= 0.8
        if (positions[i * 3 + 1] < 0) {
          positions[i * 3 + 1] = 80
        }
      }
      rainRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <points ref={rainRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={rainCount}
          array={rainPositions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#88ccff"
        size={0.15}
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  )
}

// 雾效果
function FogEffect({ density = 0.02 }) {
  const { scene } = useThree()

  useEffect(() => {
    scene.fog = new THREE.FogExp2(0xcccccc, density)
    return () => {
      scene.fog = null
    }
  }, [scene, density])

  return null
}

// 天气光照系统
function WeatherLighting({ weather }) {
  const lightRef = useRef()

  useFrame((state) => {
    if (lightRef.current) {
      switch (weather) {
        case 'rainy':
          lightRef.current.intensity = 0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.1
          lightRef.current.color.setHex(0x666688)
          break
        case 'foggy':
          lightRef.current.intensity = 0.5
          lightRef.current.color.setHex(0xaaaaaa)
          break
        default:
          lightRef.current.intensity = 1
          lightRef.current.color.setHex(0xffffff)
      }
    }
  })

  return (
    <directionalLight
      ref={lightRef}
      position={[50, 100, 50]}
      castShadow
      shadow-mapSize-width={2048}
      shadow-mapSize-height={2048}
    />
  )
}

// 主天气系统组件
function WeatherSystem({ weather }) {
  const { scene } = useThree()

  useEffect(() => {
    // 根据天气设置背景色
    switch (weather) {
      case 'rainy':
        scene.background = new THREE.Color(0x2a2a3a)
        break
      case 'foggy':
        scene.background = new THREE.Color(0x888899)
        break
      default:
        scene.background = new THREE.Color(0x87ceeb)
    }
  }, [scene, weather])

  return (
    <>
      <WeatherLighting weather={weather} />
      {weather === 'rainy' && <RainEffect intensity={1} />}
      {weather === 'foggy' && <FogEffect density={0.015} />}
    </>
  )
}

export default WeatherSystem
