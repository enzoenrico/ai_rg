import { useSpring, animated } from '@react-spring/three'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh } from 'three'

export const Box = ({
  active,
  ...props
}: {
  active: boolean
  props: { position: number[]; setActive: (val: boolean) => void }
}) => {
  const meshRef = useRef<Mesh>()

  const { scale } = useSpring({
    scale: active ? [0.4, 0.4, 0.4] : [0.8, 0.8, 0.8],
    config: { mass: 1, tension: 170, friction: 26 }
  })

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta
      meshRef.current.rotation.x += delta * 0.9

      // sine function to fluctuate the scale of model (breathing)
      meshRef.current.scale.x =
        scale.get()[0] * (1 + Math.sin(state.clock.elapsedTime * 1.25) * 0.25)

      meshRef.current.scale.y =
        scale.get()[0] * (1 + Math.sin(state.clock.elapsedTime * 1.25) * 0.25)

      meshRef.current.scale.z =
        scale.get()[0] * (1 + Math.sin(state.clock.elapsedTime * 1.25) * 0.25)
    }
  })

  return (
    <animated.mesh
      {...props}
      ref={meshRef}
      scale-x={scale}
      scale-y={scale}
      scale-z={scale}
    >
      {active ? (
        <boxGeometry args={[1, 1, 1]} />
      ) : (
        <coneGeometry args={[1, 2, 3]} />
      )}
      <meshStandardMaterial color={'white'} roughness={0.8} />
    </animated.mesh>
  )
}
