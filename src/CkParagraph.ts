import { CanvasKit, SkParagraph, SkParagraphStyle } from 'canvaskit-wasm'
import { isCkCanvas } from './CkCanvas'
import { toSkParagraphStyle } from './SkiaElementMapping'
import { CkElement, CkElementContainer, CkElementProps, CkObjectTyping, ParagraphStyle } from './SkiaElementTypes'

export interface CkParagraphProps extends ParagraphStyle, CkElementProps<SkParagraph> {
  x?: number,
  y?: number,
  children: string
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
      const skParagraphBuilder = this.canvasKit.ParagraphBuilder.Make(<SkParagraphStyle>toSkParagraphStyle(this.canvasKit, this.props), this.canvasKit.SkFontMgr.RefDefault())
      skParagraphBuilder.addText(this.props.children)
      this.skObject = skParagraphBuilder.build()
    }
    if (isCkCanvas(parent)) {
      parent.skObject?.drawParagraph(this.skObject, this.props.x ?? 0, this.props.y ?? 0)
    }
  }
}
