import { Vector3 } from 'three'

export type SizeFlexibleParams =
  | number[]
  | {
      width: number
      height: number
    }

export type VectorFlexibleParams =
  | Vector3
  | number[]
  | {
      x: number
      y: number
      z: number
    }
