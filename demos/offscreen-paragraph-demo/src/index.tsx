// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
import workerApp from 'worker-loader!./App.worker'

const htmlCanvasElement = document.createElement("canvas");
const rootElement = document.getElementById("root");
if (rootElement === null) {
  throw new Error("No root element defined.");
}
rootElement.appendChild(htmlCanvasElement);
document.body.appendChild(rootElement);
htmlCanvasElement.width = 800;
htmlCanvasElement.height = 600;

// @ts-ignore
const offscreenCanvas = htmlCanvasElement.transferControlToOffscreen();

workerApp().postMessage({ canvas: offscreenCanvas }, [offscreenCanvas]);
