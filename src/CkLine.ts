import { CanvasKit, SkPaint } from 'canvaskit-wasm'
import { isCkCanvas } from './CkCanvas'
import { toSkPaint } from './SkiaElementMapping'
import {
  CkElement,
  CkElementContainer,
  CkElementCreator,
  CkElementProps,
  CkObjectTyping,
  Paint
} from './SkiaElementTypes'

export interface CkLineProps extends CkElementProps<never>{
  x1: number
  y1: number
  x2: number
  y2: number
  paint?: Paint
}

class CkLine implements CkElement<'ck-line'> {
  readonly canvasKit: CanvasKit
  readonly props: CkObjectTyping['ck-line']['props']
  readonly skObjectType: CkObjectTyping['ck-line']['name'] = 'Line'
  readonly type: 'ck-line' = 'ck-line'

  private readonly paint: SkPaint

  constructor (
    canvasKit: CanvasKit,
    props: CkObjectTyping['ck-line']['props']
  ) {
    this.canvasKit = canvasKit
    this.props = props

    this.paint = new this.canvasKit.SkPaint()
    this.paint.setStyle(this.canvasKit.PaintStyle.Fill)
    this.paint.setAntiAlias(true)
  }

  render (parent: CkElementContainer<any>): void {
    if (parent && isCkCanvas(parent)) {
      parent.skObject?.drawLine(this.props.x1, this.props.y1, this.props.x2, this.props.y2, toSkPaint(this.canvasKit, this.props.paint) ?? this.paint)
    }
  }
}

export const createCkLine: CkElementCreator<'ck-line'> = (type, props, canvasKit) => new CkLine(canvasKit, props)
