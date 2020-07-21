import React from 'react'
import * as ReactCanvasKit from '../../../src'
import ParagraphDemo from '../../ParagraphDemo'

const htmlCanvasElement = document.createElement('canvas')
document.body.appendChild(htmlCanvasElement)
htmlCanvasElement.width = 400
htmlCanvasElement.height = 300
const gl = htmlCanvasElement.getContext('webgl')
if (gl === null) {
  throw new Error('Browser does not support WebGL.')
}

ReactCanvasKit.render(
  <React.StrictMode>
    <ParagraphDemo/>
  </React.StrictMode>,
  gl,
  htmlCanvasElement.width,
  htmlCanvasElement.height
)
