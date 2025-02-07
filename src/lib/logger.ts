// import { format } from "date-fns";

const COLOR = {
  GREEN: `\x1b[32m`,
  RED: `\x1b[31m`,
  WHITE: `\x1b[37m`,
  YELLOW: `\x1b[33m`,
  CYAN: `\x1b[36m`,
  GRAY: `\x1b[90m`,
}

const LEVEL_COLORS = {
  FATAL: COLOR.RED,
  ERROR: COLOR.RED,
  WARN: COLOR.YELLOW,
  INFO: COLOR.GREEN,
  LOG: COLOR.GRAY,
  DEBUG: COLOR.GREEN,
  TRACE: COLOR.GREEN,
}

export function makeLogger(module: string) {
  function wrap<T extends () => void>(type: keyof typeof LEVEL_COLORS, fcn: T) {
    const prefix = `${LEVEL_COLORS[type]}${type} ${COLOR.CYAN}[${module}]`
    return Function.prototype.bind.call(fcn, console, prefix) as T
  }
  function wrapDev<T extends () => void>(type: keyof typeof LEVEL_COLORS, fcn: T) {
    return import.meta.env.DEV ? wrap(type, fcn) : ((() => {}) as T)
  }
  const trace = wrapDev('TRACE', console.trace)
  const debug = wrapDev('DEBUG', console.debug)
  const info = wrap('INFO', console.info)
  const warn = wrap('WARN', console.warn)
  const error = wrap('ERROR', console.error)
  const fatal = wrap('FATAL', console.error)
  return { trace, debug, info, warn, error, fatal }
}
