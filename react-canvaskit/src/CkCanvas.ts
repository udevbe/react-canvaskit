import type { CanvasKit, Canvas as SkCanvas } from 'canvaskit-wasm'
import type { ReactNode } from 'react'
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

  private deleted = false

  constructor (
    canvasKit: CanvasKit,
    props: CkObjectTyping['ck-canvas']['props']
  ) {
    this.canvasKit = canvasKit
    this.props = props
  }

  render (parent: CkElementContainer<any>): void {
    if (this.deleted) {
      throw new Error('BUG. canvas element deleted.')
    }

    if (parent.skObject && isCkSurface(parent)) {
      if (this.skObject === undefined) {
        this.skObject = parent.skObject.getCanvas()
      }
    } else {
      throw new Error('Expected an initialized ck-surface as parent of ck-canvas')
    }

    this.skObject.save()
    this.drawSelf(this.skObject)
    this.children.forEach(child => child.render(this))
    this.skObject.restore()
    parent.skObject?.flush()
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

  delete () {
    if (this.deleted) {
      return
    }
    this.deleted = true
    // The canvas object is 1-to-1 linked to the parent surface object, so deleting it means we could never recreate it.
    // this.skObject?.delete()
    this.skObject = undefined
  }
}

export function isCkCanvas (ckElement: CkElement<any>): ckElement is CkCanvas {
  return ckElement.type === 'ck-canvas'
}

export const createCkCanvas: CkElementCreator<'ck-canvas'> =
  (type, props, canvasKit: CanvasKit): CkElementContainer<'ck-canvas'> =>
    new CkCanvas(canvasKit, props)
