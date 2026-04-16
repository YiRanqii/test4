import React, { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const PARTICLE_COUNT = 3000

function RainParticles({ intensity = 1 }) {
  const meshRef = useRef()
  const positions = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3)
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 120
      pos[i * 3 + 1] = Math.random() * 80
      pos[i * 3 + 2] = (Math.random() - 0.5) * 120
    }
    return pos
  }, [])

  const velocities = useMemo(() => {
    const vel = new Float32Array(PARTICLE_COUNT)
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      vel[i] = 0.5 + Math.random() * 0.5
    }
    return vel
  }, [])

  useFrame(() => {
    if (!meshRef.current) return
    const positionArray = meshRef.current.geometry.attributes.position.array
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positionArray[i * 3 + 1] -= velocities[i] * intensity * 1.5
      if (positionArray[i * 3 + 1] < 0) {
        positionArray[i * 3 + 1] = 80
        positionArray[i * 3] = (Math.random() - 0.5) * 120
        positionArray[i * 3 + 2] = (Math.random() - 0.5) * 120
      }
    }
    meshRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={PARTICLE_COUNT}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        color="#aaddff"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  )
}

function FogParticles({ intensity = 1 }) {
  const meshRef = useRef()
  const count = 500
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 120
      pos[i * 3 + 1] = Math.random() * 30 + 5
      pos[i * 3 + 2] = (Math.random() - 0.5) * 120
    }
    return pos
  }, [])

  const initialPositions = useMemo(() => [...positions], [positions])

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const positionArray = meshRef.current.geometry.attributes.position.array
    const time = clock.getElapsedTime()
    
    for (let i = 0; i < count; i++) {
      positionArray[i * 3] = initialPositions[i * 3] + Math.sin(time * 0.3 + i) * 5
      positionArray[i * 3 + 1] = initialPositions[i * 3 + 1] + Math.sin(time * 0.2 + i * 0.5) * 2
      positionArray[i * 3 + 2] = initialPositions[i * 3 + 2] + Math.cos(time * 0.25 + i) * 5
    }
    meshRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={3 * intensity}
        color="#cccccc"
        transparent
        opacity={0.3 * intensity}
        sizeAttenuation
      />
    </points>
  )
}

function SunRays({ intensity = 1 }) {
  const meshRef = useRef()
  
  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const time = clock.getElapsedTime()
    meshRef.current.rotation.z = time * 0.05
    meshRef.current.material.opacity = 0.1 * intensity + Math.sin(time * 0.5) * 0.02
  })

  return (
    <mesh ref={meshRef} position={[30, 60, 30]} rotation={[0.3, 0, 0]}>
      <circleGeometry args={[20, 32]} />
      <meshBasicMaterial
        color="#ffffaa"
        transparent
        opacity={0.1}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

function WeatherEffects({ weather, transitionProgress = 1 }) {
  const { scene } = useThree()
  
  useEffect(() => {
    const baseFog = new THREE.FogExp2('#1a1a3e', 0.003)
    
    if (weather === 'foggy') {
      scene.fog = new THREE.FogExp2('#888888', 0.015 * transitionProgress)
    } else if (weather === 'rainy') {
      scene.fog = new THREE.FogExp2('#334455', 0.008 * transitionProgress)
    } else {
      scene.fog = baseFog
    }
    
    return () => {
      scene.fog = baseFog
    }
  }, [weather, transitionProgress, scene])

  return (
    <>
      {weather === 'rainy' && <RainParticles intensity={transitionProgress} />}
      {weather === 'foggy' && <FogParticles intensity={transitionProgress} />}
      {weather === 'sunny' && <SunRays intensity={transitionProgress} />}
    </>
  )
}

export default WeatherEffects
