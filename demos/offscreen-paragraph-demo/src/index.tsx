// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
import workerApp from 'workerize-loader!./App.worker'

const htmlCanvasElement = document.createElement('canvas')
const rootElement = document.getElementById('root')
if (rootElement === null) {
  throw new Error('No root element defined.')
}
rootElement.appendChild(htmlCanvasElement)
document.body.appendChild(htmlCanvasElement)
htmlCanvasElement.width = 800
htmlCanvasElement.height = 600

const offscreenCanvas = htmlCanvasElement.transferControlToOffscreen()

workerApp().postMessage({ canvas: offscreenCanvas }, [offscreenCanvas])
