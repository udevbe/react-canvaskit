// @ts-ignore
import { writeFileSync } from 'fs'
// @ts-ignore
import { createCanvas } from 'node-canvas-webgl'
import * as React from 'react'
import * as ReactCanvasKit from '../src'

describe('canvaskit canvas', () => {
  it('renders using the provided properties', async done => {
    const canvas = createCanvas(250, 250)
    // canvaskit uses the tagname to check if the element is a canvas
    canvas.tagName = 'CANVAS'
    await ReactCanvasKit.render(
      <ck-canvas clear={{ red: 255, green: 255, blue: 255 }}>
        Hello React-CanvasKit!
        <ck-surface width={100} height={100}>
          <ck-canvas clear={{ red: 100, green: 100, blue: 100 }}/>
        </ck-surface>
      </ck-canvas>,
      canvas)
    // TODO assert the visual output istead of writing it to a file
    writeFileSync('./snap.png', canvas.toBuffer())
    // done()
  })
})
