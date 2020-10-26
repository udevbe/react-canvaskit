import type { CanvasKit, Font as SkFont, Paint as SkPaint } from 'canvaskit-wasm'
import { isCkCanvas } from './CkCanvas'
import { toSkFont, toSkPaint } from './SkiaElementMapping'
import {
  CkElement,
  CkElementContainer,
  CkElementCreator,
  CkElementProps,
  CkObjectTyping,
  Font,
  Paint
} from './SkiaElementTypes'

export interface CkTextProps extends CkElementProps<never> {
  x?: number
  y?: number
  paint?: Paint
  font?: Font
  children: string
}

class CkText implements CkElement<'ck-text'> {
  readonly canvasKit: CanvasKit
  readonly props: CkObjectTyping['ck-text']['props']
  readonly skObjectType: CkObjectTyping['ck-text']['name'] = 'Text'
  readonly type: 'ck-text' = 'ck-text'

  private readonly defaultPaint: SkPaint
  private readonly defaultFont: SkFont

  private renderPaint?: SkPaint
  private renderFont?: SkFont
  deleted = false

  constructor (
    canvasKit: CanvasKit,
    props: CkObjectTyping['ck-text']['props']
  ) {
    this.canvasKit = canvasKit
    this.props = props

    this.defaultPaint = new this.canvasKit.Paint()
    this.defaultPaint.setStyle(this.canvasKit.PaintStyle.Fill)
    this.defaultPaint.setAntiAlias(true)

    this.defaultFont = new this.canvasKit.Font(null, 14)
  }

  render (parent?: CkElementContainer<any>): void {
    if (parent && isCkCanvas(parent)) {
      // TODO we can be smart and only recreate the paint object if the paint props have changed.
      this.renderPaint?.delete()
      this.renderPaint = toSkPaint(this.canvasKit, this.props.paint)
      // TODO we can be smart and only recreate the font object if the font props have changed.
      this.renderFont?.delete()
      this.renderFont = toSkFont(this.canvasKit, this.props.font)
      parent.skObject?.drawText(this.props.children, this.props.x ?? 0, this.props.y ?? 0, this.renderPaint ?? this.defaultPaint, this.renderFont ?? this.defaultFont)
    }
  }

  delete () {
    if (this.deleted) {
      return
    }
    this.deleted = true
    this.defaultFont.delete()
    this.defaultPaint.delete()
    this.renderPaint?.delete()
    this.renderFont?.delete()
  }
}

export const createCkText: CkElementCreator<'ck-text'> = (type, props, canvasKit) => new CkText(canvasKit, props)
