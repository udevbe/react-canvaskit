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
      <ck-canvas clear={{ red: 1, green: 1, blue: 1 }}>
        Hello React-CanvasKit!
        <ck-surface width={100} height={100}>
          <ck-canvas clear={{ red: 0.5, green: 0.5, blue: 0.5 }}/>
        </ck-surface>
      </ck-canvas>,
      canvas
    )
    // TODO check the visual output somehow
    // done()
  })
})
