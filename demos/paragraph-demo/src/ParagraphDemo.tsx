import type { SkParagraph } from 'canvaskit-wasm'
import * as React from 'react'
import { PaintStyle, TextAlignEnum } from '../../../src/SkiaElementTypes'

const fontPaint = { style: PaintStyle.Fill, antiAlias: true }

const X = 250
const Y = 250
const str = 'The quick brown fox 🦊 ate a zesty hamburgerfons 🍔.\nThe 👩‍👩‍👧‍👧 laughed.'

export default () => {
  const skParagraphRef = React.useRef<SkParagraph>(null)
  const requestRef = React.useRef<number>()

  const calcWrapTo = (time: number): number => 350 + 150 * Math.sin(time / 2000)
  const [wrapTo, setWrapTo] = React.useState(calcWrapTo(Date.now()))

  const animate: FrameRequestCallback = time => {
    setWrapTo(calcWrapTo(time))
    requestRef.current = requestAnimationFrame(animate)
  }

  React.useEffect(() => {
    requestRef.current = requestAnimationFrame(animate)
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [])

  const posA = skParagraphRef.current?.getGlyphPositionAtCoordinate(X, Y)
  let glyph
  if (posA) {
    const cp = str.codePointAt(posA.pos)
    if (cp) {
      glyph = String.fromCodePoint(cp)
    }
  }

  return (
    <ck-canvas clear='#FFFFFF'>
      <ck-paragraph
        ref={skParagraphRef}
        textStyle={{
          color: '#000000',
          // TODO custom font manager
          fontFamilies: ['Roboto', 'Noto Color Emoji'],
          fontSize: 50
        }}
        textAlign={TextAlignEnum.Left}
        maxLines={7}
        ellipsis='...'
      >
        {str}
      </ck-paragraph>
      <ck-line x1={wrapTo} y1={0} x2={wrapTo} y2={400} paint={fontPaint}/>
      glyph && <ck-text x={5} y={450}
                        paint={fontPaint}>{`At (${X.toFixed(2)}, ${Y.toFixed(2)}) glyph is '${glyph}'`}</ck-text>
    </ck-canvas>
  )
}
