import type { CanvasKit, SkCanvas, SkPaint, SkSurface } from 'canvaskit-oc'
import type { ReactElement } from 'react'
import type { CkCanvasProps } from './CkCanvas'
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

export interface CkSurfaceProps extends CkElementProps<SkSurface> {
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

  readonly defaultPaint: SkPaint
  private renderPaint?: SkPaint
  deleted = false

  constructor (
    canvasKit: CanvasKit,
    props: CkObjectTyping['ck-surface']['props']
  ) {
    this.canvasKit = canvasKit
    this.props = props
    this.defaultPaint = new this.canvasKit.SkPaint()
  }

  render (parent: CkElementContainer<any>) {
    if (this.deleted) {
      throw new Error('BUG. surface element deleted.')
    }

    if (parent.skObject && isCkCanvas(parent)) {
      if (this.skObject === undefined) {
        const { width, height } = this.props
        this.skObject = this.canvasKit.MakeSurface(width, height)
      }
    } else {
      throw new Error('Expected an initialized ck-canvas as parent of ck-surface')
    }

    this.children.forEach(child => child.render(this))
    this.drawSelf(parent.skObject, this.skObject)
  }

  private drawSelf (parent: SkCanvas, skSurface: SkSurface) {
    const skImage = skSurface.makeImageSnapshot()
    const { dx, dy, paint } = this.props
    // TODO we can be smart and only recreate the paint object if the paint props have changed.
    this.renderPaint?.delete()
    this.renderPaint = toSkPaint(this.canvasKit, paint)
    parent.drawImage(skImage, dx ?? 0, dy ?? 0, this.renderPaint ?? this.defaultPaint)
  }

  delete () {
    if (this.deleted) {
      return
    }
    this.deleted = true
    this.defaultPaint.delete()
    this.renderPaint?.delete()
    this.renderPaint = undefined
    this.skObject?.delete()
    this.skObject = undefined
  }
}

export const createCkSurface: CkElementCreator<'ck-surface'> = (type, props, canvasKit): CkElementContainer<'ck-surface'> => {
  return new CkSurface(canvasKit, props)
}

export function isCkSurface (ckElement: CkElement<any>): ckElement is CkSurface {
  return ckElement.type === 'ck-surface'
}
