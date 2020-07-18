// @ts-ignore
import { writeFileSync } from 'fs'
// @ts-ignore
import * as React from 'react'
import * as ReactCanvasKit from '../src'

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
  it('renders using the provided properties', async done => {
    const width = 400
    const height = 300
    const gl = require('gl')(width, height)
    await ReactCanvasKit.render(
      <ck-canvas clear={{ red: 255, green: 165, blue: 0 }}>
        <ck-text x={5} y={50} paint={{ color: '#00FFFF', antiAlias: true }} font={{ size: 24 }}>
          Hello React-CanvasKit!
        </ck-text>
        <ck-surface width={100} height={100} dx={100} dy={100}>
          <ck-canvas clear='#FF00FF' rotate={{ degree: 45 }}>
            <ck-text> React-CanvasKit.</ck-text>
            <ck-line x1={0} y1={10} x2={142} y2={10} paint={{ antiAlias: true, color: '#FFFFFF', strokeWidth: 10 }}/>
          </ck-canvas>
        </ck-surface>
      </ck-canvas>,
      gl, width, height)
    dumpRenderToFile(gl, width, height)
    done()
  })
})
