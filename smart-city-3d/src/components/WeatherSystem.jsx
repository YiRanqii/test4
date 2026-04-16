import React, { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

function RainParticles({ intensity = 1 }) {
  const rainRef = useRef()
  const count = 1500 * intensity
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 120
      pos[i * 3 + 1] = Math.random() * 80
      pos[i * 3 + 2] = (Math.random() - 0.5) * 120
    }
    return pos
  }, [count])

  useFrame(() => {
    if (rainRef.current) {
      const positions = rainRef.current.geometry.attributes.position.array
      for (let i = 0; i < count; i++) {
        positions[i * 3 + 1] -= 0.8 + Math.random() * 0.5
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
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#aaccff"
        size={0.3}
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  )
}

function FogEffect({ density, weather }) {
  const { scene } = useThree()
  
  useEffect(() => {
    if (weather === 'foggy') {
      scene.fog = new THREE.FogExp2(0x8899aa, density * 0.015)
    } else if (weather === 'rainy') {
      scene.fog = new THREE.FogExp2(0x556677, density * 0.008)
    } else {
      scene.fog = null
    }
    return () => {
      scene.fog = null
    }
  }, [weather, density, scene])

  return null
}

function WeatherLighting({ weather }) {
  const dirLightRef = useRef()
  const ambientRef = useRef()

  useFrame(() => {
    if (dirLightRef.current && ambientRef.current) {
      const targetIntensity = weather === 'sunny' ? 1.2 : weather === 'rainy' ? 0.4 : 0.2
      const targetAmbient = weather === 'sunny' ? 0.5 : weather === 'rainy' ? 0.3 : 0.2
      
      dirLightRef.current.intensity += (targetIntensity - dirLightRef.current.intensity) * 0.02
      ambientRef.current.intensity += (targetAmbient - ambientRef.current.intensity) * 0.02
    }
  })

  return (
    <>
      <ambientLight ref={ambientRef} intensity={0.5} color={weather === 'sunny' ? '#ffffff' : '#8899aa'} />
      <directionalLight
        ref={dirLightRef}
        position={[50, 100, 50]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        color={weather === 'sunny' ? '#fff8e7' : '#8899aa'}
      />
    </>
  )
}

export default function WeatherSystem({ weather, transition = 1 }) {
  return (
    <>
      <WeatherLighting weather={weather} />
      <FogEffect density={transition} weather={weather} />
      {weather === 'rainy' && <RainParticles intensity={transition} />}
    </>
  )
}
