import React from "react";
import { init, render } from "react-canvaskit";
import { App } from "./App";

const htmlCanvasElement = document.createElement("canvas");
const rootElement = document.getElementById("root");
if (rootElement === null) {
  throw new Error("No root element defined.");
}
rootElement.appendChild(htmlCanvasElement);
document.body.appendChild(htmlCanvasElement);
htmlCanvasElement.width = 800;
htmlCanvasElement.height = 600;

init().then(() => render(<App />, htmlCanvasElement));
