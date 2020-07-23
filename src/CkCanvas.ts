import { CanvasKit, SkCanvas, SkFont, SkPaint } from 'canvaskit-wasm'
import { ReactNode } from 'react'
import { isCkSurface } from './CkSurface'
import { toSkColor } from './SkiaElementMapping'
import {
  CkElement,
  CkElementContainer,
  CkElementCreator,
  CkElementProps,
  CkObjectTyping,
  Color
} from './SkiaElementTypes'

export interface CkCanvasProps extends CkElementProps<SkCanvas> {
  clear?: Color | string
  rotate?: { degree: number, px?: number, py?: number }
  children?: ReactNode
}

type CkCanvasChild = CkElement<'ck-surface'> | CkElement<'ck-text'>

export class CkCanvas implements CkElementContainer<'ck-canvas'> {
  readonly canvasKit: CanvasKit
  readonly props: CkObjectTyping['ck-canvas']['props']
  skObject?: CkObjectTyping['ck-canvas']['type']
  readonly skObjectType: CkObjectTyping['ck-canvas']['name'] = 'SkCanvas'
  readonly type: 'ck-canvas' = 'ck-canvas'
  children: CkCanvasChild[] = []

  private readonly fontPaint: SkPaint
  private readonly font: SkFont

  constructor (
    canvasKit: CanvasKit,
    props: CkObjectTyping['ck-canvas']['props']
  ) {
    this.canvasKit = canvasKit
    this.props = props

    this.fontPaint = new this.canvasKit.SkPaint()
    this.fontPaint.setStyle(this.canvasKit.PaintStyle.Fill)
    this.fontPaint.setAntiAlias(true)

    this.font = new this.canvasKit.SkFont(null, 14)
  }

  render (parent: CkElementContainer<any>): void {
    if (this.skObject === undefined && parent.skObject && isCkSurface(parent)) {
      this.skObject = parent.skObject.getCanvas()
    } else {
      throw new Error('Expected an initialized ck-surface as parent of ck-canvas')
    }

    this.skObject.save()
    this.drawSelf(this.skObject)
    this.children.forEach(child => child.render(this))
    this.skObject.restore()
    this.skObject.flush()
  }

  private drawSelf (skCanvas: SkCanvas) {
    const skColor = toSkColor(this.canvasKit, this.props.clear)
    if (skColor) {
      skCanvas.clear(skColor)
    }

    if (this.props.rotate) {
      const { degree, px, py } = this.props.rotate
      skCanvas.rotate(degree, px ?? 0, py ?? 0)
    }
  }
}

export function isCkCanvas (ckElement: CkElement<any>): ckElement is CkCanvas {
  return ckElement.type === 'ck-canvas'
}

export const createCkCanvas: CkElementCreator<'ck-canvas'> =
  (type, props, canvasKit: CanvasKit): CkElementContainer<'ck-canvas'> =>
    new CkCanvas(canvasKit, props)
