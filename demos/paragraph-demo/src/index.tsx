import React from 'react'
import { render } from '../../../src'
import { App } from './App'

const htmlCanvasElement = document.createElement('canvas')
document.body.appendChild(htmlCanvasElement)
htmlCanvasElement.width = 400
htmlCanvasElement.height = 300
const gl = htmlCanvasElement.getContext('webgl')
if (gl === null) {
  throw new Error('Browser does not support WebGL.')
}

render(
  <React.StrictMode><App/></React.StrictMode>,
  {
    glRenderingContext: gl,
    width: htmlCanvasElement.width,
    height: htmlCanvasElement.height
  }
)
