# React-CanvasKit

![npm](https://img.shields.io/npm/v/react-canvaskit)

Experimental implementation of [Skia CanvasKit](https://skia.org/user/modules/canvaskit) using [ReactJS](https://reactjs.org/).

This implementation allows you to use all familiar React concepts like hooks and contexts, in conjunction with JXS elements that closely match the existing Skia CanvasKit API. Everything is drawn to a hardware accelerated WebGL canvas.

# Examples
#### Paragraph with dynamic font loading
![Alt text](/demos/paragraph-demo/paragraph-demo.gif?raw=true "Paragraph Demo")

```typescript jsx
import type { FunctionComponent } from 'react'
import React from 'react'
import { FontManagerProvider } from 'react-canvaskit'
import ParagraphDemo from './ParagraphDemo'

const robotoPromise = fetch('https://storage.googleapis.com/skia-cdn/google-web-fonts/Roboto-Regular.ttf')
  .then((resp) => resp.arrayBuffer())
const notoColorEmojiPromise = fetch('https://storage.googleapis.com/skia-cdn/misc/NotoColorEmoji.ttf')
  .then((resp) => resp.arrayBuffer())

const fontsPromise = Promise.all([robotoPromise, notoColorEmojiPromise])

export const App: FunctionComponent = () => {
  const [fonts, setFonts] = React.useState<ArrayBuffer[] | undefined>(undefined)
  fontsPromise.then(fetchedFonts => setFonts(fetchedFonts))

  return (
    <FontManagerProvider fontData={fonts}>
      <ParagraphDemo/>
    </FontManagerProvider>
  )
}
```

```typescript jsx
import type { SkParagraph } from 'canvaskit-oc'
import React from 'react'
import type { SkObjectRef } from 'react-canvaskit'
import { PaintStyle, TextAlignEnum, useFontManager } from 'react-canvaskit'
import useAnimationFrame from './useAnimationFrame'

const fontPaint = { style: PaintStyle.Fill, antiAlias: true }

const X = 250
const Y = 250
const paragraphText = 'The quick brown fox 🦊 ate a zesty hamburgerfonts 🍔.\nThe 👩‍👩‍👧‍👧 laughed.'

export default () => {
  const skParagraphRef = React.useRef<SkObjectRef<SkParagraph>>(null)
  const fontManager = useFontManager()

  const calcWrapTo = (time: number): number => 350 + 150 * Math.sin(time / 2000)
  const [wrapTo, setWrapTo] = React.useState(calcWrapTo(performance.now()))

  useAnimationFrame(time => setWrapTo(calcWrapTo(time)))

  return (
    <ck-canvas clear='#FFFFFF'>
      <ck-paragraph
        fontManager={fontManager}
        ref={skParagraphRef}
        textStyle={{
          color: '#000000',
          // Noto Mono is the default canvaskit font, we use it as a fallback
          fontFamilies: ['Noto Mono', 'Roboto', 'Noto Color Emoji'],
          fontSize: 50
        }}
        textAlign={TextAlignEnum.Left}
        maxLines={7}
        ellipsis='...'
        layout={wrapTo}
      >
        {paragraphText}
      </ck-paragraph>
      <ck-line x1={wrapTo} y1={0} x2={wrapTo} y2={400} paint={fontPaint}/>
      <ck-text x={5} y={450}
               paint={fontPaint}>{`At (${X.toFixed(2)}, ${Y.toFixed(2)}) glyph is '${glyph}'`}</ck-text>
    </ck-canvas>
  )
}
```

#### Simple Paint 
![Alt text](/demos/simple-paint/hello-react-canvaskit.png?raw=true "Hello React-CanvasKit!")

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
