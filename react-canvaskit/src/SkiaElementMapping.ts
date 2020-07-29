import {
  CanvasKit,
  FontStyle,
  SkColor,
  SkFont,
  SkPaint,
  SkParagraphStyle,
  SkTextStyle,
  SkTypeface
} from 'canvaskit-wasm'
import {
  CkFontStyle,
  Color,
  Font,
  FontSlantEnum,
  FontWeightEnum,
  FontWidthEnum,
  Paint,
  ParagraphStyle,
  TextStyle,
  TypeFace
} from './SkiaElementTypes'

export interface PropsConverter<IN, OUT> {
  (canvasKit: CanvasKit, propIn?: IN): OUT | undefined
}

export const toSkTypeFace: PropsConverter<TypeFace, SkTypeface> = (canvasKit, typeFace) => typeFace ? canvasKit.SkFontMgr.RefDefault().MakeTypefaceFromData(typeFace.data) : undefined
export const toSkFont: PropsConverter<Font, SkFont> = (canvasKit, font) => font ? new canvasKit.SkFont(font.typeFace === undefined ? null : toSkTypeFace(canvasKit, font.typeFace)!!, font.size) : undefined
export const toSkColor: PropsConverter<Color | string, SkColor> = (canvasKit, color) => {
  if (typeof color === 'string') {
    // @ts-ignore
    return <SkColor>canvasKit.parseColorString(color)
  } else {
    return color ? canvasKit.Color(color.red, color.green, color.blue, color.alpha ?? 1) : undefined
  }
}

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

export const toFontStyle: PropsConverter<CkFontStyle, FontStyle> = (canvasKit, fontStyle): FontStyle => {
  return {
    slant: { value: fontStyle?.slant ?? FontSlantEnum.Upright },
    weight: { value: fontStyle?.weight ?? FontWeightEnum.Normal },
    width: { value: fontStyle?.width ?? FontWidthEnum.Normal }
  }
}

export const toSkTextStyle: PropsConverter<TextStyle, SkTextStyle> = (canvasKit, textStyle) => {
  return {
    backgroundColor: toSkColor(canvasKit, textStyle?.backgroundColor) ?? canvasKit.WHITE,
    color: toSkColor(canvasKit, textStyle?.color) ?? canvasKit.BLACK,
    decoration: textStyle?.decoration ?? 0,
    decorationThickness: textStyle?.decorationThickness ?? 0,
    fontFamilies: textStyle?.fontFamilies ?? [],
    fontSize: textStyle?.fontSize ?? 14,
    fontStyle: <FontStyle>toFontStyle(canvasKit, textStyle?.fontStyle),
    foregroundColor: toSkColor(canvasKit, textStyle?.foregroundColor) ?? canvasKit.BLACK
  }
}

export const toSkParagraphStyle: PropsConverter<ParagraphStyle, SkParagraphStyle> = (canvasKit, paragraphStyle) => {
  const textAlign = paragraphStyle?.textAlign ? { value: paragraphStyle.textAlign } : undefined
  const textDirection = paragraphStyle?.textDirection ? { value: paragraphStyle.textDirection } : undefined

  return new canvasKit.ParagraphStyle({
    disableHinting: paragraphStyle?.disableHinting,
    ellipsis: paragraphStyle?.ellipsis,
    maxLines: paragraphStyle?.maxLines,
    textAlign,
    textDirection,
    textStyle: <SkTextStyle>toSkTextStyle(canvasKit, paragraphStyle?.textStyle)
  })
}

