import type {
  Canvas as SkCanvas,
  CanvasKit,
  Image as SkImage,
  Paragraph as SkParagraph,
  Surface as SkSurface,
} from 'canvaskit-wasm'
import type { MutableRefObject } from 'react'
import type { CkCanvasProps } from './CkCanvas'
import { createCkCanvas } from './CkCanvas'
import type { CkEncodedImageProps } from './CkEncodedImage'
import { createCkEncodedImage } from './CkEncodedImage'
import type { CkLineProps } from './CkLine'
import { createCkLine } from './CkLine'
import type { CkParagraphProps } from './CkParagraph'
import { createCkParagraph } from './CkParagraph'
import type { CkSurfaceProps } from './CkSurface'
import { createCkSurface } from './CkSurface'
import type { CkTextProps } from './CkText'
import { createCkText } from './CkText'

export type CkElementProps<T> = {
  ref?: MutableRefObject<T | null | undefined>
}

export interface CkObjectTyping {
  'ck-surface': { type: SkSurface; name: 'SkSurface'; props: CkSurfaceProps }
  'ck-canvas': { type: SkCanvas; name: 'SkCanvas'; props: CkCanvasProps }
  'ck-line': { type: never; name: 'Line'; props: CkLineProps }
  'ck-text': { type: never; name: 'Text'; props: CkTextProps }
  'ck-paragraph': { type: SkParagraph; name: 'SkParagraph'; props: CkParagraphProps }
  'ck-encoded-image': { type: SkImage; name: 'SkImage'; props: CkEncodedImageProps }
}

export type CkElementType = keyof CkObjectTyping

export interface CkElement<TypeName extends keyof CkObjectTyping> {
  readonly canvasKit: CanvasKit
  readonly type: TypeName
  props: CkObjectTyping[TypeName]['props']
  readonly skObjectType: CkObjectTyping[TypeName]['name']
  skObject?: CkObjectTyping[TypeName]['type']

  render(parent: CkElementContainer<any>): void

  delete(): void
}

export interface CkElementCreator<TypeName extends keyof CkObjectTyping> {
  (type: TypeName, props: CkObjectTyping[TypeName]['props'], canvasKit: CanvasKit): CkElement<TypeName>
}

export function isContainerElement(ckElement: CkElement<any>): ckElement is CkElementContainer<any> {
  return (ckElement as CkElementContainer<any>).children !== undefined
}

export interface CkElementContainer<TypeName extends keyof CkObjectTyping> extends CkElement<TypeName> {
  children: CkElement<any>[]
}

namespace CkPropTypes {
  export const Color = {
    red: 'number',
    green: 'number',
    blue: 'number',
    alpha: 'number',
  }
}

export interface Color {
  red: number
  green: number
  blue: number
  alpha?: number
}

export type ColorTypeName = 'Color'

export enum FilterQuality {}
// TODO

export enum StrokeCap {}
// TODO

export enum StrokeJoin {}
// TODO

export enum BlendMode {}
// TODO

export type ColorFilter =
  | BlendColorFilter
  | ComposeColorFilter
  | LerpColorFilter
  | LinearToSRGBGammaColorFilter
  | MatrixColorFilter
  | SRGBToLinearGammaColorFilter

export interface BlendColorFilter {
  color: Color
  blendMode: BlendMode
}

export interface ComposeColorFilter {
  first: ColorFilter
  second: ColorFilter
}

export interface LerpColorFilter {
  lerp: number
  first: ColorFilter
  second: ColorFilter
}

export type LinearToSRGBGammaColorFilter = 'LinearToSRGBGamma'

export interface MatrixColorFilter {
  matrix: Matrix
}

export type SRGBToLinearGammaColorFilter = 'SRGBToLinearGamma'

export type ImageFilter = BlurImageFilter | ColorImageFilter | ComposeImageFilter | MatrixTransformImageFilter

export enum TileMode {}
// TODO

export interface BlurImageFilter {
  rx: number
  ry: number
  tileMode: TileMode
  next: ImageFilter | null
}

export interface ColorImageFilter {
  filter: ColorFilter
  next: ImageFilter | null
}

export interface ComposeImageFilter {
  first: ImageFilter
  second: ImageFilter
}

export enum FilterQuality {}
// TODO

export interface MatrixTransformImageFilter {
  matrix: MatrixColorFilter
  filterQuality: FilterQuality
  next: ImageFilter | null
}

export type MaskFilter = BlurMaskFilter

export enum BlurStyle {}
// TODO

export interface BlurMaskFilter {
  blurStyle: BlurStyle
  radius: number
  b: boolean
}

export type PathEffect = DashPathEffect | CornerPathEffect | DiscretePathEffect

export interface DashPathEffect {
  intervals: number[]
  phase: number
}

export interface CornerPathEffect {
  radius: number
}

export interface DiscretePathEffect {
  frequency: number
  amplitude: number
  seed: number
}

export type Shader = LinearGradientShader | RadialGradientShader | TwoPointConicalGradientShader

export type Point = [number, number]

export type Matrix = [number, number, number, number, number, number, number, number, number]

export interface LinearGradientShader {
  start: Point
  end: Point
  colors: Color[]
  positions: number[]
  mode: number
  localMatrix: Matrix | null
  flags: number
}

export interface RadialGradientShader {
  center: Point
  radius: number
  colors: Color[]
  positions: number[]
  mode: number
  localMatrix?: Matrix
  flags: number
}

export interface TwoPointConicalGradientShader {
  start: Point
  startRadius: number
  end: Point
  endRadius: number
  colors: Color[]
  positions: number[]
  mode: number
  localMatrix?: Matrix
  flags: number
}

export enum PaintStyle {
  /**
   * Fill the geometry.
   */
  Fill = 0,
  /**
   * Stroke the geometry.
   */
  Stroke = 1,
  /**
   * Fill and stroke the geometry.
   */
  StrokeAndFill = 2,
}

export interface Paint {
  blendMode?: BlendMode
  color?: Color | string
  filterQuality?: FilterQuality
  strokeCap?: StrokeCap
  strokeJoin?: StrokeJoin
  strokeMiter?: number
  strokeWidth?: number
  antiAlias?: boolean
  colorFilter?: ColorFilter
  imageFilter?: ImageFilter
  maskFilter?: MaskFilter
  pathEffect?: PathEffect
  shader?: Shader
  style?: PaintStyle
}

export interface LineProps {
  x1: number
  y1: number
  x2: number
  y2: number
  paint: Paint
}

export enum TextAlignEnum {
  Left = 0,
  Center = 1,
  Right = 2,
}

export enum TextDirectionEnum {
  Ltr = 0,
  Rtl = 1,
  // TODO
}

export enum FontWeightEnum {
  /**
   * A thick font weight of 900.
   */
  Black = 900,
  /**
   * A thick font weight of 700. This is the default for a bold font.
   */
  Bold = 700,
  /**
   * A thick font weight of 1000.
   */
  ExtraBlack = 1000,
  /**
   * A thick font weight of 800.
   */
  ExtraBold = 800,
  /**
   * A thin font weight of 200.
   */
  ExtraLight = 200,
  /**
   * The font has no thickness at all.
   */
  Invisible = 0,

  /**
   * A thin font weight of 300.
   */
  Light = 300,

  /**
   *A thicker font weight of 500.
   */
  Medium = 500,

  /**
   *A typical font weight of 400. This is the default font weight.
   */
  Normal = 400,

  /**
   *A thick font weight of 600.
   */
  SemiBold = 600,

  /**
   *A thin font weight of 100.
   */
  Thin = 100,
}

export enum FontSlantEnum {
  Upright,
  Italic,
  Oblique,
}

export enum FontWidthEnum {
  /**
   * A condensed font width of 3.
   */
  Condensed = 3,
  /**
   * An expanded font width of 7.
   */
  Expanded = 7,
  /**
   *A condensed font width of 2.
   */
  ExtraCondensed = 2,
  /**
   *An expanded font width of 8.
   */
  ExtraExpanded = 8,
  /**
   *A normal font width of 5. This is the default font width.
   */
  Normal = 5,
  /**
   *A condensed font width of 4.
   */
  SemiCondensed = 4,
  /**
   *An expanded font width of 6.
   */
  SemiExpanded = 6,
  /**
   *A condensed font width of 1.
   */
  UltraCondensed = 1,
  /**
   *An expanded font width of 9.
   */
  UltraExpanded = 9,
}

export interface TypeFace {
  data: ArrayBuffer
}

export interface Font {
  typeFace?: TypeFace
  size: number
}

export interface CkFontStyle {
  weight?: FontWeightEnum
  slant?: FontSlantEnum
  width?: FontWidthEnum
}

export interface TextStyle {
  backgroundColor?: Color | string
  color?: Color | string
  decoration?: number
  decorationThickness?: number
  fontFamilies?: string[]
  fontSize?: number
  fontStyle?: CkFontStyle
  foregroundColor?: Color | string
}

export interface ParagraphStyle {
  disableHinting?: boolean
  heightMultiplier?: number
  ellipsis?: string
  maxLines?: number
  textAlign?: TextAlignEnum
  textDirection?: TextDirectionEnum
  textStyle: TextStyle
}

export interface ParagraphProps {
  style: ParagraphStyle
  maxWidth: number
  x: number
  y: number
}

const CkElements: { [key in CkElementType]: CkElementCreator<any> } = {
  'ck-text': createCkText,
  'ck-line': createCkLine,
  'ck-surface': createCkSurface,
  'ck-canvas': createCkCanvas,
  'ck-paragraph': createCkParagraph,
  'ck-encoded-image': createCkEncodedImage,
}

export function createCkElement(type: CkElementType, props: CkElementProps<any>, canvasKit: CanvasKit): CkElement<any> {
  return CkElements[type](type, props, canvasKit)
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'ck-text': CkTextProps
      'ck-canvas': CkCanvasProps
      'ck-surface': CkSurfaceProps
      'ck-line': CkLineProps
      'ck-paragraph': CkParagraphProps
      'ck-encoded-image': CkEncodedImageProps
    }
  }
}
