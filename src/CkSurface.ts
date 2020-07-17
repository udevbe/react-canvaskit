import { CanvasKit, SkCanvas, SkPaint, SkSurface } from 'canvaskit-wasm'
import { ReactElement } from 'react'
import { CkCanvas, CkCanvasProps, isCkCanvas } from './CkCanvas'
import { toSkPaint } from './SkiaElementMapping'
import { CkElement, CkElementContainer, CkElementCreator, CkObjectTyping, Paint } from './SkiaElementTypes'

export interface CkSurfaceProps {
  width: number
  height: number
  dx?: number
  dy?: number
  paint?: Paint

  children?: ReactElement<CkCanvasProps> | ReactElement<CkCanvasProps>[]
}

export class CkSurface implements CkElementContainer<'ck-surface'> {
  readonly canvasKit: CanvasKit
  readonly props: CkObjectTyping['ck-surface']['props']
  skObject?: CkObjectTyping['ck-surface']['type']
  readonly skObjectType: CkObjectTyping['ck-surface']['name'] = 'SkSurface'
  readonly type: 'ck-surface' = 'ck-surface'
  children: CkElementContainer<'ck-canvas'>[] = []

  readonly paint: SkPaint

  constructor (
    canvasKit: CanvasKit,
    props: CkObjectTyping['ck-surface']['props']
  ) {
    this.canvasKit = canvasKit
    this.props = props
    this.paint = new this.canvasKit.SkPaint()
  }

  render (parent: CkElementContainer<any>) {
    if (this.skObject === undefined && parent.skObject && isCkCanvas(parent)) {
      const { width, height } = this.props
      this.skObject = this.canvasKit.MakeSurface(width, height)
    } else {
      throw new Error('Expected an initialized ck-canvas as parent of ck-surface')
    }

    this.children.forEach(child => child.render(this))
    this.drawSelf(parent.skObject, this.skObject)
  }

  private drawSelf (parent: SkCanvas, skSurface: SkSurface) {
    const skImage = skSurface.makeImageSnapshot()
    const { dx, dy, paint } = this.props
    parent.drawImage(skImage, dx ?? 0, dy ?? 0, toSkPaint(this.canvasKit, paint) ?? this.paint)
  }
}

export const createCkSurface: CkElementCreator<'ck-surface'> = (type, props, canvasKit): CkElementContainer<'ck-surface'> => {
  return new CkSurface(canvasKit, props)
}

export function isCkSurface (ckElement: CkElement<any>): ckElement is CkSurface {
  return ckElement.type === 'ck-surface'
}
