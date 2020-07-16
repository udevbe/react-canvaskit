import type { CanvasKit, SkCanvas, SkObject, SkSurface } from 'canvaskit-wasm'
import { CkCanvasProps, createCkCanvas } from './CkCanvas'
import { CkSurfaceProps, createCkSurface } from './CkSurface'
import { CkTextProps, createCkText } from './CkText'

export type Props = { [key: string]: any }

export interface CkObjectTyping {
  'ck-object': { type: SkObject<any>, name: 'SkObject', props: Props }
  'ck-surface': { type: SkSurface, name: 'SkSurface', props: CkSurfaceProps }
  'ck-canvas': { type: SkCanvas, name: 'SkCanvas', props: CkCanvasProps }
  'ck-line': { type: SkSurface, name: 'SkSurface', props: Props }
  'ck-text': { type: never, name: 'Text', props: CkTextProps }
}

export type CkElementType = keyof CkObjectTyping

export interface CkElement<TypeName extends keyof CkObjectTyping = 'ck-object'> {
  readonly canvasKit: CanvasKit,
  readonly type: TypeName
  readonly props: CkObjectTyping[TypeName]['props']
  readonly skObjectType: CkObjectTyping[TypeName]['name']
  readonly skObject: CkObjectTyping[TypeName]['type']

  render (parent?: CkElementContainer<any>): void
}

export interface CkElementCreator<TypeName extends keyof CkObjectTyping, ParentTypeName extends keyof CkObjectTyping> {
  (type: TypeName, props: CkObjectTyping[TypeName]['props'], parent: CkElement<ParentTypeName>): CkElement<TypeName>
}

export function isContainerElement (ckElement: CkElement<any>): ckElement is CkElementContainer<any> {
  return (ckElement as CkElementContainer).children !== undefined
}

export interface CkElementContainer<TypeName extends keyof CkObjectTyping = 'ck-object'> extends CkElement<TypeName> {
  children: (CkElement<any> | string)[]
}

namespace CkPropTypes {
  export const Color = {
    red: 'number',
    green: 'number',
    blue: 'number',
    alpha: 'number'
  }
}

export interface Color {
  red: number,
  green: number,
  blue: number,
  alpha?: number
}

export type ColorTypeName = 'Color'

export enum FilterQuality {
  // TODO
}

export enum StrokeCap {
  // TODO
}

export enum StrokeJoin {
  // TODO
}

export enum BlendMode {
  // TODO
}

export type ColorFilter =
  BlendColorFilter
  | ComposeColorFilter
  | LerpColorFilter
  | LinearToSRGBGammaColorFilter
  | MatrixColorFilter
  | SRGBToLinearGammaColorFilter

export interface BlendColorFilter {
  color: Color,
  blendMode: BlendMode
}

export interface ComposeColorFilter {
  first: ColorFilter,
  second: ColorFilter
}

export interface LerpColorFilter {
  lerp: number,
  first: ColorFilter,
  second: ColorFilter
}

export type LinearToSRGBGammaColorFilter = 'LinearToSRGBGamma'

export interface MatrixColorFilter {
  matrix: Matrix
}

export type SRGBToLinearGammaColorFilter = 'SRGBToLinearGamma'

export type ImageFilter = BlurImageFilter | ColorImageFilter | ComposeImageFilter | MatrixTransformImageFilter

export enum TileMode {
  // TODO
}

export interface BlurImageFilter {
  rx: number
  ry: number
  tileMode: TileMode
  next: ImageFilter | null
}

export interface ColorImageFilter {
  filter: ColorFilter,
  next: ImageFilter | null
}

export interface ComposeImageFilter {
  first: ImageFilter,
  second: ImageFilter
}

export enum FilterQuality {
  // TODO
}

export interface MatrixTransformImageFilter {
  matrix: MatrixColorFilter,
  filterQuality: FilterQuality,
  next: ImageFilter | null
}

export type MaskFilter = BlurMaskFilter

export enum BlurStyle {
  // TODO
}

export interface BlurMaskFilter {
  blurStyle: BlurStyle,
  radius: number,
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
  frequency: number,
  amplitude: number,
  seed: number
}

export type Shader = LinearGradientShader | RadialGradientShader | TwoPointConicalGradientShader

export type Point = [number, number]

export type Matrix = [number, number, number, number, number, number, number, number, number];

export interface LinearGradientShader {
  start: Point,
  end: Point,
  colors: Color[],
  positions: number[],
  mode: number,
  localMatrix: Matrix | null,
  flags: number
}

export interface RadialGradientShader {
  center: Point,
  radius: number,
  colors: Color[],
  positions: number[],
  mode: number,
  localMatrix?: Matrix,
  flags: number
}

export interface TwoPointConicalGradientShader {
  start: Point,
  startRadius: number,
  end: Point,
  endRadius: number,
  colors: Color[],
  positions: number[],
  mode: number,
  localMatrix?: Matrix,
  flags: number,
}

export enum PaintStyle {
  // TODO
}

export interface Paint {
  blendMode?: BlendMode;
  color?: Color
  filterQuality?: FilterQuality;
  strokeCap?: StrokeCap;
  strokeJoin?: StrokeJoin;
  strokeMiter?: number;
  strokeWidth?: number;
  antiAlias?: boolean
  colorFilter?: ColorFilter
  imageFilter?: ImageFilter;
  maskFilter?: MaskFilter
  pathEffect?: PathEffect
  shader?: Shader
  style?: PaintStyle
}

export interface LineProps {
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  paint: Paint
}

export enum TextAlignEnum {
  // TODO
}

export enum TextDirectionEnum {
  // TODO
}

export enum FontWeightEnum {
  // TODO
}

export enum FontSlantEnum {
  Upright,
  Italic,
  Oblique,
}

export enum FontWidthEnum {
  // TODO
}

export interface TypeFace {
  data: number[] | ArrayBuffer | Uint8Array
}

export interface Font {
  typeFace?: TypeFace,
  size: number
}

export interface FontStyle {
  weight?: FontWeightEnum;
  slant?: FontSlantEnum;
  width?: FontWidthEnum;
}

export interface TextStyle {
  backgroundColor: Color;
  color: Color;
  decoration: number;
  decorationThickness: number;
  fontFamilies: string[];
  fontSize: number;
  fontStyle: FontStyle;
  foregroundColor: Color;
}

export interface ParagraphStyle {
  disableHinting: boolean;
  heightMultiplier: number;
  maxLines: number;
  textAlign: TextAlignEnum;
  textDirection: TextDirectionEnum;
  textStyle: TextStyle;
}

export interface ParagraphProps {
  style: ParagraphStyle,
  maxWidth: number
  x: number,
  y: number
}


const CkElements: { [key in CkElementType]: CkElementCreator<any, any> } = {
  'ck-text': createCkText,
  // @ts-ignore
  'ck-line': undefined,
  // @ts-ignore
  'ck-object': undefined,
  'ck-surface': createCkSurface,
  'ck-canvas': createCkCanvas
}

export function createCkElement (type: CkElementType, props: Props, parent: CkElement<any>): CkElement {
  return CkElements[type](type, props, parent)
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'ck-text': CkTextProps
      'ck-canvas': CkCanvasProps
      'ck-surface': CkSurfaceProps
      // 'sk-line': Partial<LineProps>
      // 'sk-paragraph': Partial<ParagraphProps>
    }
  }
}


