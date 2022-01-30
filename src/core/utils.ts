import { Vector3 } from 'three'
import { VectorFlexibleParams } from '../types'

export const isProd = import.meta.env.MODE === 'production'

export function normalizeVectorFlexibleParam(
  value: number | VectorFlexibleParams | any,
): Vector3 {
  if (typeof value === 'number') {
    return new Vector3(value, value, value)
  }
  if (Array.isArray(value)) {
    const array = value as number[]
    return new Vector3(array[0], array[1], array[2])
  }
  if (typeof value === 'object') {
    const { x, y, z } = value
    return new Vector3(x, y, z)
  }
  if (value instanceof Vector3) {
    return value
  }
  return new Vector3(0, 0, 0)
}
