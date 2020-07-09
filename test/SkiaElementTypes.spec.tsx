// @ts-ignore
import { createCanvas } from 'node-canvas-webgl'
import * as React from 'react'
import * as ReactCanvasKit from '../src'


describe('canvaskit canvas', () => {
  it('renders using the provided properties', async cb => {
    const canvas = createCanvas(250, 250)
    // canvaskit uses the tagname to check if the element is a canvas
    canvas.tagName = 'CANVAS'
    ReactCanvasKit.render(
      <sk-canvas clear={{ red: 1, green: 1, blue: 1 }}>
        Hello React-CanvasKit!
      </sk-canvas>, canvas
    )
  })
})
