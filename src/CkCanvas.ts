import { CanvasKit } from 'canvaskit-wasm'
import { ReactNode } from 'react'
import { CkElement, CkElementContainer, CkElementCreator, CkObjectTyping, Color, toSkColor } from './SkiaElementTypes'

export interface CkCanvasProps {
  clear?: Color
  children?: ReactNode
}

class CkCanvas implements CkElementContainer<'ck-canvas'> {
  readonly canvasKit: CanvasKit
  readonly props: CkObjectTyping['ck-canvas']['props']
  readonly skObject: CkObjectTyping['ck-canvas']['type']
  readonly skObjectType: CkObjectTyping['ck-canvas']['name'] = 'SkCanvas'
  readonly type: 'ck-canvas' = 'ck-canvas'
  children: (CkElement<any> | string)[] = []

  constructor (
    canvasKit: CanvasKit,
    props: CkObjectTyping['ck-canvas']['props'],
    skObject: CkObjectTyping['ck-canvas']['type']
  ) {
    this.canvasKit = canvasKit
    this.props = props
    this.skObject = skObject
  }

  render (parent: CkElementContainer<'ck-surface'>): void {
    this.drawSelf()
    this.children.forEach(child => {
      if (typeof child === 'string') {
        this.renderStringChild(child)
      } else {
        child.render(this)
      }
    })
  }

  private drawSelf () {

  }

  private renderStringChild (child: string) {
    // TODO default paint & default font?
    this.skObject.drawText(child, 0, 0, paint, font)
  }

}

export const createCkCanvas: CkElementCreator<'ck-canvas', 'ck-surface'> = (type, props, parent): CkElementContainer<'ck-canvas'> => {
  const skCanvas = parent.skObject.getCanvas()
  if (props.clear) {
    skCanvas.clear(toSkColor(parent.canvasKit, props.clear))
  }

  return new CkCanvas(parent.canvasKit, props, skCanvas)
}
