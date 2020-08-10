import type { FunctionComponent } from 'react'
import React from 'react'
import { FontManagerProvider, init, render } from 'react-canvaskit'
import ParagraphDemo from './ParagraphDemo'

const robotoPromise = fetch('https://storage.googleapis.com/skia-cdn/google-web-fonts/Roboto-Regular.ttf')
  .then((resp) => resp.arrayBuffer())
const notoColorEmojiPromise = fetch('https://storage.googleapis.com/skia-cdn/misc/NotoColorEmoji.ttf')
  .then((resp) => resp.arrayBuffer())
const fontsPromise = Promise.all([robotoPromise, notoColorEmojiPromise])

const App: FunctionComponent = () => {
  const [fonts, setFonts] = React.useState<ArrayBuffer[] | undefined>(undefined)
  fontsPromise.then(fetchedFonts => setFonts(fetchedFonts))
  return (
    <FontManagerProvider fontData={fonts}>
      <ParagraphDemo/>
    </FontManagerProvider>
  )
}

self.onmessage = async (e: MessageEvent) => {
  const offscreenCanvas = e.data.canvas
  await init()
  render(<App/>, offscreenCanvas)
}
