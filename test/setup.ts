import { webcrypto } from 'crypto'
import {
  TextDecoder as NodeTextDecoder,
  TextEncoder as NodeTextEncoder,
} from 'util'

// Create wrapper classes that ensure proper Uint8Array instances
class TextEncoderWrapper {
  private encoder = new NodeTextEncoder()

  encode(input?: string): Uint8Array {
    const result = this.encoder.encode(input)
    // Ensure it's a proper Uint8Array, not a subclass
    return new Uint8Array(result.buffer, result.byteOffset, result.byteLength)
  }

  encodeInto(source: string, destination: Uint8Array) {
    return this.encoder.encodeInto(source, destination)
  }

  get encoding() {
    return 'utf-8'
  }
}

class TextDecoderWrapper {
  private decoder = new NodeTextDecoder()

  decode(input?: BufferSource): string {
    return this.decoder.decode(input as any)
  }

  get encoding() {
    return 'utf-8'
  }

  get fatal() {
    return false
  }

  get ignoreBOM() {
    return false
  }
}

// Setup global polyfills for jsdom environment
global.TextEncoder = TextEncoderWrapper as any
global.TextDecoder = TextDecoderWrapper as any

// Setup crypto - use Object.defineProperty to override read-only property
Object.defineProperty(global, 'crypto', {
  value: webcrypto,
  writable: true,
  configurable: true,
})

// Setup fetch
if (typeof global.fetch === 'undefined') {
  global.fetch = require('node-fetch')
}

// Setup btoa/atob if not available
if (typeof btoa === 'undefined') {
  global.btoa = function (b: string) {
    return Buffer.from(b, 'binary').toString('base64')
  }
}

if (typeof atob === 'undefined') {
  global.atob = function (a: string) {
    return Buffer.from(a, 'base64').toString('binary')
  }
}

// Fix Uint8Array for jose library compatibility
// jose requires actual Uint8Array instances, not jsdom's version
global.Uint8Array = Uint8Array
global.ArrayBuffer = ArrayBuffer
