# React-CanvasKit

Experimental implementation of [Skia CanvasKit](https://skia.org/user/modules/canvaskit) using [ReactJS](https://reactjs.org/).

This implementation allows you to use all familiar React concepts like hooks and contexts, in conjunction with JXS elements that closely match the existing Skia CanvasKit API. Everything is drawn to a hardware accelerated WebGL canvas.

# Example

```typescript jsx
const App: FunctionComponent = () => {
  return (
    <ck-canvas clear={{ red: 255, green: 165, blue: 0 }}>
      <ck-text x={5} y={50} paint={{ color: '#00FFFF', antiAlias: true }} font={{ size: 24 }}>
        Hello React-CanvasKit!
      </ck-text>
      <ck-surface width={100} height={100} dx={100} dy={100}>
        <ck-canvas clear='#FF00FF' rotate={{ degree: 45 }}>
          <ck-text> React-CanvasKit.</ck-text>
          <ck-line x1={0} y1={10} x2={142} y2={10} 
            paint={{ antiAlias: true, color: '#FFFFFF', strokeWidth: 10 }}/>
        </ck-canvas>
      </ck-surface>
    </ck-canvas>
  )
}

const htmlCanvasElement = document.createElement('canvas')
const rootElement = document.getElementById('root')
if (rootElement === null) {
  throw new Error('No root element defined.')
}
rootElement.appendChild(htmlCanvasElement)
document.body.appendChild(htmlCanvasElement)
htmlCanvasElement.width = 400
htmlCanvasElement.height = 300

init().then(() => render(<App/>, htmlCanvasElement))
```


![Alt text](/demos/simple-paint/hello-react-canvaskit.png?raw=true "Hello React-CanvasKit!")


See the `demos` directory for more concrete examples.

# TODO

- Not all API is currently implemented. 
- Scene redraws are not optimal and might leak memory.
- No custom Layouting. We might want to borrow the flexbox layouting used by React-Native?
- No custom styling. We might wan to borrow the stylesheet implementation of React-Native?
