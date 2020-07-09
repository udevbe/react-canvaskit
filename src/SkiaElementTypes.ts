import type { CanvasKit, SkCanvas, SkSurface } from 'canvaskit-wasm'

export type Props = { [key: string]: any }

export interface CkParentContext<T> {
  canvasKit: CanvasKit,
  skInstance: T
}

export class CkInstance<Type extends string, P extends Props, SkInstance> {
  readonly type: Type
  readonly skInstance: SkInstance
  readonly props: P

  constructor (type: Type, props: P, skInstance: SkInstance) {
    this.type = type
    this.props = props
    this.skInstance = skInstance
  }
}

interface CkInstanceCreator<T extends string, P extends Props, SkInstance, ParentContext extends CkParentContext<any>> {
  (props: Partial<P>, parentContext: ParentContext): CkInstance<T, Partial<P>, SkInstance>
}

export interface CkCanvasProps {
  clear: Color
  children: string
}

function toSkColor (context: CkParentContext<any>, color: Color) {
  return context.canvasKit.Color(color.red, color.green, color.blue, color.fAlpha ?? 1)
}

const ckCanvasCreator: CkInstanceCreator<'ck-canvas', CkCanvasProps, SkCanvas, CkParentContext<SkSurface>> = (props, parentContext) => {
  const skCanvas = parentContext.skInstance.getCanvas()
  if (props.clear) {
    skCanvas.clear(toSkColor(parentContext, props.clear))
  }
  return new CkInstance('ck-canvas', props, skCanvas)
}

export interface Color {
  red: number,
  green: number,
  blue: number,
  fAlpha?: number
}

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
  blendMode: BlendMode;
  color: Color
  filterQuality: FilterQuality;
  strokeCap: StrokeCap;
  strokeJoin: StrokeJoin;
  strokeMiter: number;
  strokeWidth: number;
  antiAlias: boolean
  colorFilter: ColorFilter
  imageFilter: ImageFilter;
  maskFilter: MaskFilter
  pathEffect: PathEffect
  shader: Shader
  style: PaintStyle
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
  // TODO
}

export enum FontWidthEnum {
  // TODO
}

export interface FontStyleProps {
  weight: FontWeightEnum;
  slant: FontSlantEnum;
  width: FontWidthEnum;
}

export interface TextStyleProps {
  backgroundColor: Color;
  color: Color;
  decoration: number;
  decorationThickness: number;
  fontFamilies: string[];
  fontSize: number;
  fontStyle: FontStyleProps;
  foregroundColor: Color;
}

export interface ParagraphStyleProps {
  disableHinting: boolean;
  heightMultiplier: number;
  maxLines: number;
  textAlign: TextAlignEnum;
  textDirection: TextDirectionEnum;
  textStyle: TextStyleProps;
}

export interface ParagraphProps {
  style: ParagraphStyleProps,
  maxWidth: number
  x: number,
  y: number
}

const SkElements: { [key: string]: CkInstanceCreator<string, Props, any, CkParentContext<any>> } = {
  'sk-canvas': ckCanvasCreator
  // 'sk-line': ckLineCreator,
  // 'sk-paragraph': ckParagraphCreator
}

export function createCkElement (type: string, props: Props, parentContext: CkParentContext<any>): CkInstance<string, Props, any> {
  return SkElements[type](props, parentContext)
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'sk-canvas': Partial<CkCanvasProps>
      // 'sk-line': Partial<LineProps>
      // 'sk-paragraph': Partial<ParagraphProps>
    }
  }
}


