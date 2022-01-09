import { CanvasKit, Image as SkImage, Paint as SkPaint } from 'canvaskit-wasm'
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

export interface CkEncodedImageProps extends CkElementProps<never> {
  left: number
  top: number
  bytes: Uint8Array | ArrayBuffer
  paint?: Paint
}

class CkEncodedImage implements CkElement<'ck-encoded-image'> {
  readonly skObjectType: CkObjectTyping["ck-encoded-image"]["name"] = 'SkImage'
  readonly type: 'ck-encoded-image' = 'ck-encoded-image'
  deleted = false

  private readonly defaultPaint: SkPaint
  private renderPaint?: SkPaint

  private image?: SkImage

  constructor (
    readonly canvasKit: CanvasKit,
    readonly props: CkObjectTyping['ck-encoded-image']['props']
  ) {
    this.defaultPaint = new this.canvasKit.Paint()
    this.defaultPaint.setStyle(this.canvasKit.PaintStyle.Fill)
    this.defaultPaint.setAntiAlias(true)
  }


  delete (): void {
    if (this.deleted) {
      return
    }

    this.image?.delete()
    this.defaultPaint.delete()
    this.renderPaint?.delete()
    this.deleted = true
  }

  render (parent: CkElementContainer<any>): void {
    if (this.deleted) {
      throw new Error('BUG. line element deleted.')
    }

    if(parent && isCkCanvas(parent)){
      this.image = this.canvasKit.MakeImageFromEncoded(this.props.bytes) ?? undefined
      if(this.image){
        this.renderPaint?.delete()
        this.renderPaint = toSkPaint(this.canvasKit, this.props.paint)
        parent.skObject?.drawImage(this.image, this.props.left, this.props.top, this.renderPaint ?? this.defaultPaint)
      }
    }
  }
}

export const createCkEncodedImage: CkElementCreator<'ck-encoded-image'> = (type, props, canvasKit)=> new CkEncodedImage(canvasKit, props)
