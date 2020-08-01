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
  it('renders some simple paint operations', async done => {
    const width = 400
    const height = 300
    const gl = require('gl')(width, height)

    await ReactCanvasKit.init()
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
      // @ts-ignore
      {
        tagName: 'CANVAS',
        getContext () {
          return gl
        },
        width,
        height
      }
    )

    // TODO auto compare output file to reference image
    dumpRenderToFile(gl, width, height)

  }, 5000)

  it('renders a paragraph with different fonts', async done => {
    const width = 800
    const height = 600
    const gl = require('gl')(width, height)

    await ReactCanvasKit.init()
    await ReactCanvasKit.render(
      <App/>,
      // @ts-ignore
      {
        tagName: 'CANVAS',
        getContext () {
          return gl
        },
        width,
        height
      }
    )

    // TODO auto compare output file to reference image
    dumpRenderToFile(gl, width, height)

  }, 5000)
})
