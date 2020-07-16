import { CanvasKit, SkFont, SkPaint } from 'canvaskit-wasm'
import { ReactNode } from 'react'
import { toSkColor } from './SkiaElementMapping'
import { CkElement, CkElementContainer, CkElementCreator, CkObjectTyping, Color } from './SkiaElementTypes'

export interface CkCanvasProps {
  clear?: Color
  children?: ReactNode
}

type CkCanvasChild = CkElement<'ck-surface'> | CkElement<'ck-text'>

export class CkCanvas implements CkElementContainer<'ck-canvas'> {
  readonly canvasKit: CanvasKit
  readonly props: CkObjectTyping['ck-canvas']['props']
  readonly skObject: CkObjectTyping['ck-canvas']['type']
  readonly skObjectType: CkObjectTyping['ck-canvas']['name'] = 'SkCanvas'
  readonly type: 'ck-canvas' = 'ck-canvas'
  children: CkCanvasChild[] = []

  private readonly fontPaint: SkPaint
  private readonly font: SkFont

  constructor (
    canvasKit: CanvasKit,
    props: CkObjectTyping['ck-canvas']['props'],
    skObject: CkObjectTyping['ck-canvas']['type']
  ) {
    this.canvasKit = canvasKit
    this.props = props
    this.skObject = skObject

    this.fontPaint = new this.canvasKit.SkPaint()
    this.fontPaint.setStyle(this.canvasKit.PaintStyle.Fill)
    this.fontPaint.setAntiAlias(true)

    this.font = new this.canvasKit.SkFont(null, 14)
  }

  render (): void {
    this.drawSelf()
    this.children.forEach(child => child.render(this))
  }

  private drawSelf () {
    const skColor = toSkColor(this.canvasKit, this.props.clear)
    if (skColor) {
      this.skObject.clear(skColor)
    }
  }

  private renderStringChild (child: string) {
    this.skObject.drawText(child, 0, 10, this.fontPaint, this.font)
  }
}

export function isCkCanvas (ckElement: CkElement<any>): ckElement is CkCanvas {
  return ckElement.type === 'ck-canvas'
}

export const createCkCanvas: CkElementCreator<'ck-canvas', 'ck-surface'> = (type, props, parent): CkElementContainer<'ck-canvas'> => {
  const skCanvas = parent.skObject.getCanvas()
  return new CkCanvas(parent.canvasKit, props, skCanvas)
}
