// @ts-ignore
import { writeFileSync } from 'fs'
// @ts-ignore
import * as React from 'react'
import * as ReactCanvasKit from '../src'
import { App } from './App'

function dumpRenderToFile (gl: WebGLRenderingContext, width: number, height: number) {
  //Write output as a PPM formatted image
  let pixels = new Uint8Array(width * height * 4)
  gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels)
  const header =
    `P3
${width} ${height}
255`

  let body = ''

  for (let y = height - 1; y >= 0; y--) {
    for (let x = 0; x < (width * 4); x += 4) {
      body += (pixels[(y * (width * 4)) + x] + ' ')
      body += (pixels[(y * (width * 4)) + x + 1] + ' ')
      body += (pixels[(y * (width * 4)) + x + 2] + ' ')
    }
  }
  writeFileSync('./snap.ppm', header + '\n' + body)
}

describe('canvaskit canvas', () => {
  it('renders a paragraph with different fonts', async done => {
    const width = 800
    const height = 600
    const gl = require('gl')(width, height)

    await ReactCanvasKit.init()
    await ReactCanvasKit.render(
      <App/>,
      { glRenderingContext: gl, width, height }
    )

    // TODO auto compare output file to reference image
    dumpRenderToFile(gl, width, height)

  }, 5000)
})
