import React, { useRef, useEffect, useState, useCallback } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const VIEW_MODES = {
  THIRD_PERSON: 'thirdPerson',
  FIRST_PERSON: 'firstPerson'
}

const CAMERA_CONFIG = {
  thirdPerson: {
    position: [50, 50, 50],
    target: [0, 0, 0],
    fov: 45
  },
  firstPerson: {
    position: [0, 2, 0],
    target: [10, 2, 10],
    fov: 75,
    height: 2
  }
}

function CameraController({ viewMode, enabled, orbitControlsRef }) {
  const { camera, gl } = useThree()
  const [isTransitioning, setIsTransitioning] = useState(false)
  const transitionProgress = useRef(0)
  const startPosition = useRef(new THREE.Vector3())
  const endPosition = useRef(new THREE.Vector3())
  const startTarget = useRef(new THREE.Vector3())
  const endTarget = useRef(new THREE.Vector3())
  const startFov = useRef(45)
  const endFov = useRef(45)
  const firstPersonState = useRef({
    position: new THREE.Vector3(0, 2, 0),
    rotation: { x: 0, y: 0 },
    target: new THREE.Vector3(10, 2, 10)
  })
  const keysPressed = useRef({})
  const mouseState = useRef({ isDown: false, lastX: 0, lastY: 0 })
  const moveSpeed = 0.3
  const rotateSpeed = 0.003

  useEffect(() => {
    const handleKeyDown = (e) => {
      keysPressed.current[e.code] = true
    }
    const handleKeyUp = (e) => {
      keysPressed.current[e.code] = false
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  useEffect(() => {
    const canvas = gl.domElement
    
    const handleMouseDown = (e) => {
      if (viewMode === VIEW_MODES.FIRST_PERSON && e.button === 0) {
        mouseState.current.isDown = true
        mouseState.current.lastX = e.clientX
        mouseState.current.lastY = e.clientY
        canvas.style.cursor = 'grabbing'
      }
    }

    const handleMouseUp = () => {
      mouseState.current.isDown = false
      canvas.style.cursor = viewMode === VIEW_MODES.FIRST_PERSON ? 'grab' : 'default'
    }

    const handleMouseMove = (e) => {
      if (mouseState.current.isDown && viewMode === VIEW_MODES.FIRST_PERSON) {
        const deltaX = e.clientX - mouseState.current.lastX
        const deltaY = e.clientY - mouseState.current.lastY
        
        firstPersonState.current.rotation.y -= deltaX * rotateSpeed
        firstPersonState.current.rotation.x -= deltaY * rotateSpeed
        firstPersonState.current.rotation.x = Math.max(
          -Math.PI / 2.5,
          Math.min(Math.PI / 2.5, firstPersonState.current.rotation.x)
        )
        
        mouseState.current.lastX = e.clientX
        mouseState.current.lastY = e.clientY
      }
    }

    canvas.addEventListener('mousedown', handleMouseDown)
    canvas.addEventListener('mouseup', handleMouseUp)
    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseleave', handleMouseUp)

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown)
      canvas.removeEventListener('mouseup', handleMouseUp)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseleave', handleMouseUp)
    }
  }, [viewMode, gl.domElement])

  const startTransition = useCallback((fromMode, toMode) => {
    const fromConfig = CAMERA_CONFIG[fromMode]
    const toConfig = CAMERA_CONFIG[toMode]
    
    startPosition.current.copy(camera.position)
    
    if (toMode === VIEW_MODES.FIRST_PERSON) {
      endPosition.current.set(
        firstPersonState.current.position.x,
        firstPersonState.current.position.y,
        firstPersonState.current.position.z
      )
    } else {
      endPosition.current.set(...toConfig.position)
    }
    
    startTarget.current.set(0, 0, 0)
    if (camera.userData.target) {
      startTarget.current.copy(camera.userData.target)
    }
    
    if (toMode === VIEW_MODES.FIRST_PERSON) {
      const rot = firstPersonState.current.rotation
      const dist = 10
      endTarget.current.set(
        endPosition.current.x + Math.sin(rot.y) * dist,
        endPosition.current.y + Math.sin(rot.x) * dist,
        endPosition.current.z + Math.cos(rot.y) * dist
      )
    } else {
      endTarget.current.set(...toConfig.target)
    }
    
    startFov.current = camera.fov
    endFov.current = toConfig.fov
    
    transitionProgress.current = 0
    setIsTransitioning(true)
  }, [camera])

  useEffect(() => {
    if (!enabled) return
    
    const currentMode = viewMode === VIEW_MODES.FIRST_PERSON ? 'firstPerson' : 'thirdPerson'
    const prevMode = viewMode === VIEW_MODES.FIRST_PERSON ? 'thirdPerson' : 'firstPerson'
    
    if (orbitControlsRef.current) {
      orbitControlsRef.current.enabled = viewMode === VIEW_MODES.THIRD_PERSON
    }
    
    startTransition(prevMode, currentMode)
  }, [viewMode, enabled, startTransition, orbitControlsRef])

  useFrame((_, delta) => {
    if (isTransitioning) {
      transitionProgress.current += delta * 1.5
      
      if (transitionProgress.current >= 1) {
        transitionProgress.current = 1
        setIsTransitioning(false)
      }
      
      const t = easeInOutCubic(transitionProgress.current)
      
      camera.position.lerpVectors(startPosition.current, endPosition.current, t)
      
      const currentTarget = new THREE.Vector3()
      currentTarget.lerpVectors(startTarget.current, endTarget.current, t)
      camera.lookAt(currentTarget)
      camera.userData.target = currentTarget
      
      camera.fov = THREE.MathUtils.lerp(startFov.current, endFov.current, t)
      camera.updateProjectionMatrix()
    }
    
    if (viewMode === VIEW_MODES.FIRST_PERSON && !isTransitioning) {
      const state = firstPersonState.current
      const keys = keysPressed.current
      
      const forward = new THREE.Vector3(
        Math.sin(state.rotation.y),
        0,
        Math.cos(state.rotation.y)
      )
      const right = new THREE.Vector3(
        Math.sin(state.rotation.y + Math.PI / 2),
        0,
        Math.cos(state.rotation.y + Math.PI / 2)
      )
      
      if (keys['KeyW'] || keys['ArrowUp']) {
        state.position.add(forward.clone().multiplyScalar(moveSpeed))
      }
      if (keys['KeyS'] || keys['ArrowDown']) {
        state.position.add(forward.clone().multiplyScalar(-moveSpeed))
      }
      if (keys['KeyA'] || keys['ArrowLeft']) {
        state.position.add(right.clone().multiplyScalar(-moveSpeed))
      }
      if (keys['KeyD'] || keys['ArrowRight']) {
        state.position.add(right.clone().multiplyScalar(moveSpeed))
      }
      
      state.position.x = Math.max(-48, Math.min(48, state.position.x))
      state.position.z = Math.max(-48, Math.min(48, state.position.z))
      
      camera.position.copy(state.position)
      
      const lookTarget = new THREE.Vector3(
        state.position.x + Math.sin(state.rotation.y) * 10,
        state.position.y + Math.sin(state.rotation.x) * 10,
        state.position.z + Math.cos(state.rotation.y) * 10
      )
      camera.lookAt(lookTarget)
    }
  })

  return null
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

export { CameraController, VIEW_MODES }
