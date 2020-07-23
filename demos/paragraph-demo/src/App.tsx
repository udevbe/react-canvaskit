import React, { FunctionComponent, useState } from 'react'
import { FontManagerProvider } from '../../../src'
import ParagraphDemo from './ParagraphDemo'

let robotoData = null;
fetch('https://storage.googleapis.com/skia-cdn/google-web-fonts/Roboto-Regular.ttf').then((resp) => {
  resp.arrayBuffer().then((buffer) => {
    robotoData = buffer;
    requestAnimationFrame(drawFrame);
  });
});

let emojiData = null;
fetch('https://storage.googleapis.com/skia-cdn/misc/NotoColorEmoji.ttf').then((resp) => {
  resp.arrayBuffer().then((buffer) => {
    emojiData = buffer;
    requestAnimationFrame(drawFrame);
  });
});

export const App: FunctionComponent = () => {
  const [fonts, setFonts] = useState(undefined)
  return (
    <FontManagerProvider fontData={fonts}>
      <ParagraphDemo/>
    </FontManagerProvider>
  )
}
