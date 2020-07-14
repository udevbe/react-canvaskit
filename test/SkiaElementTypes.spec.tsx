// @ts-ignore
import { writeFileSync } from 'fs'
// @ts-ignore
import * as React from 'react'
import * as ReactCanvasKit from '../src'

function dumpRenderToFile (gl: WebGLRenderingContext, width: number, height: number) {
  //Write output as a PPM formatted image
  let pixels = new Uint8Array(width * height * 4)
  gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels)
  const header = ['P3\n# gl.ppm\n', width, ' ', height, '\n255\n'].join('')

  let body = ''
  for (let i = 0; i < pixels.length; i += 4) {
    for (let j = 0; j < 3; ++j) {
      body += (pixels[i + j] + ' ')
    }
  }

  writeFileSync('./snap.ppm', header + '\n' + body)
}

describe('canvaskit canvas', () => {
  it('renders using the provided properties', async done => {
    const width = 250
    const height = 250
    const gl = require('gl')(width, height, { preserveDrawingBuffer: true })
    await ReactCanvasKit.render(
      <ck-canvas clear={{ red: 100, green: 100, blue: 100 }}>
        Hello React-CanvasKit!
      </ck-canvas>,
      gl, width, height)
    // TODO assert the visual output istead of writing it to a file
    dumpRenderToFile(gl, width, height)
    done()
  })
})
