import { CanvasKit, SkFontManager, SkParagraph, SkParagraphStyle } from 'canvaskit-wasm'
import { isCkCanvas } from './CkCanvas'
import { toSkParagraphStyle } from './SkiaElementMapping'
import {
  CkElement,
  CkElementContainer,
  CkElementCreator,
  CkElementProps,
  CkObjectTyping,
  ParagraphStyle
} from './SkiaElementTypes'

export interface CkParagraphProps extends ParagraphStyle, CkElementProps<SkParagraph> {
  x?: number,
  y?: number,
  children?: string,
  // TODO use a context to manage fonts
  fontManager?: SkFontManager
}

class CkParagraph implements CkElement<'ck-paragraph'> {
  readonly canvasKit: CanvasKit
  readonly props: CkObjectTyping['ck-paragraph']['props']
  skObject?: CkObjectTyping['ck-paragraph']['type']
  readonly skObjectType: CkObjectTyping['ck-paragraph']['name'] = 'SkParagraph'
  readonly type: 'ck-paragraph' = 'ck-paragraph'

  constructor (canvasKit: CanvasKit,
               props: CkObjectTyping['ck-paragraph']['props']) {
    this.canvasKit = canvasKit
    this.props = props
  }

  render (parent: CkElementContainer<any>): void {
    if (this.skObject === undefined) {
      const skParagraphBuilder =
        this.canvasKit.ParagraphBuilder.Make(<SkParagraphStyle>toSkParagraphStyle(this.canvasKit, this.props), this.props.fontManager ?? this.canvasKit.SkFontMgr.RefDefault())
      if (this.props.children) {
        skParagraphBuilder.addText(this.props.children)
      }
      this.skObject = skParagraphBuilder.build()
    }
    if (isCkCanvas(parent)) {
      parent.skObject?.drawParagraph(this.skObject, this.props.x ?? 0, this.props.y ?? 0)
    }
  }
}

export const createCkParagraph: CkElementCreator<'ck-paragraph'> =
  (type, props, canvasKit): CkElement<'ck-paragraph'> =>
    new CkParagraph(canvasKit, props)
