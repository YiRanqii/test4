import React, { useRef, useEffect, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

export default function CameraControls({ viewMode }) {
  const { camera, gl } = useThree()
  const orbitRef = useRef()
  const keys = useRef({})
  
  const moveSpeed = 0.8
  const rotateSpeed = 0.003
  
  const isMouseDown = useRef(false)
  const lastMouseX = useRef(0)
  const lastMouseY = useRef(0)

  const cameraModeRef = useRef(viewMode)
  const isTransitioning = useRef(false)
  const transitionProgress = useRef(0)
  const startPos = useRef(new THREE.Vector3())
  const endPos = useRef(new THREE.Vector3())
  const startTarget = useRef(new THREE.Vector3())
  const endTarget = useRef(new THREE.Vector3())

  useEffect(() => {
    const oldMode = cameraModeRef.current
    cameraModeRef.current = viewMode
    
    if (oldMode !== viewMode) {
      isTransitioning.current = true
      transitionProgress.current = 0
      
      startPos.current.copy(camera.position)
      
      if (viewMode === 'first-person') {
        endPos.current.set(0, 12, 50)
        endTarget.current.set(0, 5, 0)
      } else {
        endPos.current.set(50, 50, 50)
        endTarget.current.set(0, 0, 0)
      }

      if (orbitRef.current) {
        startTarget.current.copy(orbitRef.current.target)
      }
    }

    if (orbitRef.current) {
      orbitRef.current.enabled = viewMode === 'third-person'
    }
  }, [viewMode, camera])

  useEffect(() => {
    const handleKeyDown = (e) => {
      keys.current[e.code] = true
    }
    const handleKeyUp = (e) => {
      keys.current[e.code] = false
    }
    const handleMouseDown = (e) => {
      if (cameraModeRef.current === 'first-person') {
        isMouseDown.current = true
        lastMouseX.current = e.clientX
        lastMouseY.current = e.clientY
      }
    }
    const handleMouseUp = () => {
      isMouseDown.current = false
    }
    const handleMouseMove = (e) => {
      if (cameraModeRef.current === 'first-person' && isMouseDown.current) {
        const deltaX = e.clientX - lastMouseX.current
        const deltaY = e.clientY - lastMouseY.current
        
        const euler = new THREE.Euler(0, 0, 0, 'YXZ')
        euler.setFromQuaternion(camera.quaternion)
        euler.y -= deltaX * rotateSpeed
        euler.x -= deltaY * rotateSpeed
        euler.x = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, euler.x))
        camera.quaternion.setFromEuler(euler)
        
        lastMouseX.current = e.clientX
        lastMouseY.current = e.clientY
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [camera])

  useFrame(() => {
    if (isTransitioning.current) {
      transitionProgress.current += 0.02
      
      if (transitionProgress.current >= 1) {
        transitionProgress.current = 1
        isTransitioning.current = false
      }

      const t = transitionProgress.current
      const smoothT = t * t * (3 - 2 * t)
      
      camera.position.lerpVectors(startPos.current, endPos.current, smoothT)
      
      if (orbitRef.current && cameraModeRef.current === 'third-person') {
        orbitRef.current.target.lerpVectors(startTarget.current, endTarget.current, smoothT)
        orbitRef.current.update()
      }

      if (cameraModeRef.current === 'first-person') {
        const targetDir = new THREE.Vector3()
        targetDir.subVectors(endTarget.current, endPos.current).normalize()
        const targetQuat = new THREE.Quaternion()
        const tempMatrix = new THREE.Matrix4()
        tempMatrix.lookAt(endPos.current, endTarget.current, new THREE.Vector3(0, 1, 0))
        targetQuat.setFromRotationMatrix(tempMatrix)
        camera.quaternion.slerp(targetQuat, smoothT * 0.1)
      }
    }

    if (cameraModeRef.current === 'first-person' && !isTransitioning.current) {
      const direction = new THREE.Vector3()
      camera.getWorldDirection(direction)
      direction.y = 0
      direction.normalize()

      const right = new THREE.Vector3()
      right.crossVectors(direction, new THREE.Vector3(0, 1, 0)).normalize()

      if (keys.current['KeyW'] || keys.current['ArrowUp']) {
        camera.position.addScaledVector(direction, moveSpeed)
      }
      if (keys.current['KeyS'] || keys.current['ArrowDown']) {
        camera.position.addScaledVector(direction, -moveSpeed)
      }
      if (keys.current['KeyA'] || keys.current['ArrowLeft']) {
        camera.position.addScaledVector(right, -moveSpeed)
      }
      if (keys.current['KeyD'] || keys.current['ArrowRight']) {
        camera.position.addScaledVector(right, moveSpeed)
      }
      if (keys.current['Space']) {
        camera.position.y += moveSpeed * 0.5
      }
      if (keys.current['ShiftLeft']) {
        camera.position.y -= moveSpeed * 0.5
      }

      camera.position.y = Math.max(5, camera.position.y)
    }
  })

  return (
    <OrbitControls
      ref={orbitRef}
      enablePan={true}
      enableZoom={true}
      enableRotate={true}
      minDistance={15}
      maxDistance={200}
      maxPolarAngle={Math.PI / 2 - 0.05}
      enableDamping
      dampingFactor={0.05}
      makeDefault
    />
  )
}
