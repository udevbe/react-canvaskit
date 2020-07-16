import { CanvasKit, SkColor, SkFont, SkPaint, SkTypeface } from 'canvaskit-wasm'
import { Color, Font, Paint, TypeFace } from './SkiaElementTypes'

export interface PropsConverter<IN, OUT> {
  (canvasKit: CanvasKit, propIn?: IN): OUT | undefined
}

export const toSkTypeFace: PropsConverter<TypeFace, SkTypeface> = (canvasKit, typeFace) => typeFace ? canvasKit.SkFontMgr.RefDefault().MakeTypefaceFromData(typeFace.data) : undefined
export const toSkFont: PropsConverter<Font, SkFont> = (canvasKit, font) => font ? new canvasKit.SkFont(font.typeFace === undefined ? null : toSkTypeFace(canvasKit, font.typeFace)!!, font.size) : undefined
export const toSkColor: PropsConverter<Color, SkColor> = (canvasKit, color) => color ? canvasKit.Color(color.red, color.green, color.blue, color.alpha ?? 1) : undefined

export const toSkPaint: PropsConverter<Paint, SkPaint> = (canvasKit, paint) => {
  if (paint === undefined) {
    return undefined
  }

  const skPaint = new canvasKit.SkPaint()

  // TODO blendMode?: BlendMode;

  const skColor = toSkColor(canvasKit, paint.color)
  if (skColor) {
    skPaint.setColor(skColor)
  }

  // TODO filterQuality?: FilterQuality;
  // TODO strokeCap?: StrokeCap;
  // TODO strokeJoin?: StrokeJoin;

  if (paint.strokeMiter) {
    skPaint.setStrokeMiter(paint.strokeMiter)
  }
  if (paint.strokeWidth) {
    skPaint.setStrokeWidth(paint.strokeWidth)
  }
  if (paint.antiAlias) {
    skPaint.setAntiAlias(paint.antiAlias)
  }
  // TODO colorFilter?: ColorFilter
  // TODO imageFilter?: ImageFilter;
  // TODO maskFilter?: MaskFilter
  // TODO pathEffect?: PathEffect
  // TODO shader?: Shader
  // TODO style?: PaintStyle

  return skPaint
}




