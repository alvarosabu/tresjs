import { isProd } from '/@/core/utils'
const logPrefix = '[TresJS 🪐⚡️]'

interface LoggerComposition {
  logError: (message: string) => void
  logWarning: (message: string) => void
  logMessage: (name: string, value: any) => void
}

export function useLogger(): LoggerComposition {
  function logError(message: string) {
    console.error(`${logPrefix} ${message}`)
    throw `${logPrefix} ${message}`
  }

  function logWarning(message: string) {
    console.warn(`${logPrefix} ${message}`)
  }

  function logMessage(name: string, value: any) {
    if (!isProd) console.log(`${logPrefix} - ${name}:`, value)
  }

  return {
    logError,
    logWarning,
    logMessage,
  }
}
