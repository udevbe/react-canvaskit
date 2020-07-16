import { CanvasKit, SkFont, SkPaint } from 'canvaskit-wasm'
import { isCkCanvas } from './CkCanvas'
import { toSkFont, toSkPaint } from './SkiaElementMapping'
import { CkElement, CkElementContainer, CkElementCreator, CkObjectTyping, Font, Paint } from './SkiaElementTypes'

export interface CkTextProps {
  x?: number
  y?: number
  paint?: Paint
  font?: Font
  children: string
}

class CkText implements CkElement<'ck-text'> {
  readonly canvasKit: CanvasKit
  readonly props: CkObjectTyping['ck-text']['props']
  readonly skObject: CkObjectTyping['ck-text']['type']
  readonly skObjectType: CkObjectTyping['ck-text']['name'] = 'Text'
  readonly type: 'ck-text' = 'ck-text'

  private readonly paint: SkPaint
  private readonly font: SkFont

  constructor (
    canvasKit: CanvasKit,
    props: CkObjectTyping['ck-text']['props']
  ) {
    this.canvasKit = canvasKit
    this.props = props

    this.paint = new this.canvasKit.SkPaint()
    this.paint.setStyle(this.canvasKit.PaintStyle.Fill)
    this.paint.setAntiAlias(true)

    this.font = new this.canvasKit.SkFont(null, 14)
  }

  render (parent?: CkElementContainer<any>): void {
    if (parent && isCkCanvas(parent)) {
      const skPaint = toSkPaint(this.canvasKit, this.props.paint)
      const skFont = toSkFont(this.canvasKit, this.props.font)
      parent.skObject.drawText(this.props.children, this.props.x ?? 0, this.props.y ?? 0, skPaint ?? this.paint, skFont ?? this.font)
    }
  }
}

export const createCkText: CkElementCreator<'ck-text', 'ck-canvas'> = (type, props, parent) => {
  return new CkText(parent.canvasKit, props)
}
