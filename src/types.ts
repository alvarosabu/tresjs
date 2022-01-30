import { Vector3 } from 'three'

export type SizeFlexibleParams =
  | number[]
  | {
      width: number
      height: number
    }

export interface Vector2PropInterface {
  x?: number
  y?: number
  width?: number
  height?: number
}

export interface Vector3PropInterface extends Vector2PropInterface {
  z?: number
}

export type VectorFlexibleParams = Vector3 | number[] | Vector3PropInterface
