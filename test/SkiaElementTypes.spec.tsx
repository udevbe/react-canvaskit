// @ts-ignore
import { writeFileSync } from 'fs'
// @ts-ignore
import * as React from 'react'
import * as ReactCanvasKit from '../src'
import { PaintStyle, TextAlignEnum } from '../src/SkiaElementTypes'

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

    const fontPaint = { style: PaintStyle.Fill, antiAlias: true }

    await ReactCanvasKit.render(
      <ck-canvas clear='#FFFFFF'>
        <ck-paragraph
          textStyle={{
            color: '#000000',
            fontFamilies: ['Roboto', 'Noto Color Emoji'],
            fontSize: 50
          }}
          textAlign={TextAlignEnum.Left}
          maxLines={7}
          ellipsis='...'
        >
          The quick brown fox 🦊 ate a zesty hamburgerfons 🍔.\nThe 👩‍👩‍👧‍👧 laughed.
        </ck-paragraph>
        <ck-line x1={300} y1={0} x2={300} y2={400} paint={fontPaint}/>
      </ck-canvas>,
      gl, width, height)

    dumpRenderToFile(gl, width, height)
    done()
  })
})
