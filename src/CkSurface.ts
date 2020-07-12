import { CanvasKit } from 'canvaskit-wasm'
import { ReactElement } from 'react'
import { CkCanvasProps } from './CkCanvas'
import { CkElementContainer, CkElementCreator, CkObjectTyping } from './SkiaElementTypes'

export interface CkSurfaceProps {
  width: number
  height: number
  children?: ReactElement<CkCanvasProps> | ReactElement<CkCanvasProps>[]
}

class CkSurface implements CkElementContainer<'ck-surface'> {
  readonly canvasKit: CanvasKit
  readonly props: CkObjectTyping['ck-surface']['props']
  readonly skObject: CkObjectTyping['ck-surface']['type']
  readonly skObjectType: CkObjectTyping['ck-surface']['name'] = 'SkSurface'
  readonly type: 'ck-surface' = 'ck-surface'
  children: CkElementContainer<'ck-canvas'>[] = []

  constructor (
    canvasKit: CanvasKit,
    props: CkObjectTyping['ck-surface']['props'],
    skObject: CkObjectTyping['ck-surface']['type']
  ) {
    this.canvasKit = canvasKit
    this.props = props
    this.skObject = skObject
  }

  render() {
    this.children.forEach(child => child.render(this))
  }
}

export const createCkSurface: CkElementCreator<'ck-surface', 'ck-canvas'> = (type, props, parent): CkElementContainer<'ck-surface'> => {
  const skSurface = parent.canvasKit.MakeSurface(props.width, props.height)
  return new CkSurface(parent.canvasKit, props, skSurface)
}
