import React from 'react'
import { init, render } from 'react-canvaskit'
import { App } from './App'

const htmlCanvasElement = document.createElement('canvas')
const rootElement = document.getElementById('root')
if (rootElement === null) {
  throw new Error('No root element defined.')
}
rootElement.appendChild(htmlCanvasElement)
document.body.appendChild(htmlCanvasElement)
htmlCanvasElement.width = 400
htmlCanvasElement.height = 300
const glRenderingContext = htmlCanvasElement.getContext('webgl')
if (glRenderingContext === null) {
  throw new Error('Browser does not support WebGL.')
}

const renderContext = {
  glRenderingContext,
  width: htmlCanvasElement.width,
  height: htmlCanvasElement.height
}

init().then(() => {
  render(
    <App/>,
    renderContext
  )
})
