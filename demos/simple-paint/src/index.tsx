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
const width = 400
const height = 300
htmlCanvasElement.width = width
htmlCanvasElement.height = height
const glRenderingContext = htmlCanvasElement.getContext('webgl')
if (glRenderingContext === null) {
  alert('Browser does not support WebGL.')
  throw new Error('Browser does not support WebGL.')
}

const renderContext = { glRenderingContext, width, height }
init().then(() => render(<App/>, renderContext))
