import React, { useRef, useEffect, useState } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

// 第一人称视角控制器
function FirstPersonControls({ enabled, onExit }) {
  const { camera } = useThree()
  const velocity = useRef(new THREE.Vector3())
  const direction = useRef(new THREE.Vector3())
  const moveState = useRef({ forward: false, backward: false, left: false, right: false })
  const euler = useRef(new THREE.Euler(0, 0, 0, 'YXZ'))
  const PI_2 = Math.PI / 2

  useEffect(() => {
    if (!enabled) return

    camera.rotation.order = 'YXZ'
    camera.position.y = 5

    const onKeyDown = (event) => {
      switch (event.code) {
        case 'ArrowUp':
        case 'KeyW': moveState.current.forward = true; break
        case 'ArrowLeft':
        case 'KeyA': moveState.current.left = true; break
        case 'ArrowDown':
        case 'KeyS': moveState.current.backward = true; break
        case 'ArrowRight':
        case 'KeyD': moveState.current.right = true; break
        case 'Escape': onExit(); break
      }
    }

    const onKeyUp = (event) => {
      switch (event.code) {
        case 'ArrowUp':
        case 'KeyW': moveState.current.forward = false; break
        case 'ArrowLeft':
        case 'KeyA': moveState.current.left = false; break
        case 'ArrowDown':
        case 'KeyS': moveState.current.backward = false; break
        case 'ArrowRight':
        case 'KeyD': moveState.current.right = false; break
      }
    }

    const onMouseMove = (event) => {
      if (document.pointerLockElement === document.body) {
        euler.current.setFromQuaternion(camera.quaternion)
        euler.current.y -= event.movementX * 0.002
        euler.current.x -= event.movementY * 0.002
        euler.current.x = Math.max(-PI_2, Math.min(PI_2, euler.current.x))
        camera.quaternion.setFromEuler(euler.current)
      }
    }

    const onClick = () => {
      if (enabled && document.pointerLockElement !== document.body) {
        document.body.requestPointerLock()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('keyup', onKeyUp)
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('click', onClick)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('keyup', onKeyUp)
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('click', onClick)
      if (document.pointerLockElement === document.body) {
        document.exitPointerLock()
      }
    }
  }, [enabled, camera, onExit])

  useFrame((state, delta) => {
    if (!enabled) return

    velocity.current.x -= velocity.current.x * 10.0 * delta
    velocity.current.z -= velocity.current.z * 10.0 * delta

    direction.current.z = Number(moveState.current.forward) - Number(moveState.current.backward)
    direction.current.x = Number(moveState.current.right) - Number(moveState.current.left)
    direction.current.normalize()

    if (moveState.current.forward || moveState.current.backward) {
      velocity.current.z -= direction.current.z * 100.0 * delta
    }
    if (moveState.current.left || moveState.current.right) {
      velocity.current.x -= direction.current.x * 100.0 * delta
    }

    camera.translateX(-velocity.current.x * delta)
    camera.translateZ(-velocity.current.z * delta)

    // 限制移动范围
    camera.position.x = Math.max(-45, Math.min(45, camera.position.x))
    camera.position.z = Math.max(-45, Math.min(45, camera.position.z))
    camera.position.y = Math.max(2, Math.min(50, camera.position.y))
  })

  return null
}

// 主相机控制器
function CameraController({ viewMode, onViewModeChange }) {
  const orbitRef = useRef()
  const { camera } = useThree()

  // 切换视角时的平滑过渡
  useEffect(() => {
    if (viewMode === 'third' && orbitRef.current) {
      // 重置到第三人称视角
      camera.position.set(50, 50, 50)
      camera.lookAt(0, 0, 0)
      orbitRef.current.reset()
    } else if (viewMode === 'first') {
      // 切换到第一人称视角
      camera.position.set(0, 5, 20)
      camera.rotation.set(0, 0, 0)
    }
  }, [viewMode, camera])

  const handleExitFirstPerson = () => {
    onViewModeChange('third')
  }

  return (
    <>
      {viewMode === 'third' ? (
        <OrbitControls
          ref={orbitRef}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={10}
          maxDistance={200}
          maxPolarAngle={Math.PI / 2 - 0.1}
        />
      ) : (
        <FirstPersonControls enabled={viewMode === 'first'} onExit={handleExitFirstPerson} />
      )}
    </>
  )
}

export default CameraController
