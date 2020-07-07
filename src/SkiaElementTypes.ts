export interface CkTypeConstructor {
  new (props: { [key: string]: any }, root: CkContainer): CkType
}

export interface CkType {
}

export interface CkContainer extends CkType {

}

export interface CkCanvasProps {
  width: number,
  height: number
  clear: Color
}

export class CkCanvas implements CkContainer {
  constructor (props: Partial<CkCanvasProps>) {

  }
}

export interface Color {
  fRed: number,
  fGreen: number,
  fBlue: number,
  fAlpha: number
}

export enum FilterQuality {

}

export enum StrokeCap {

}

export enum StrokeJoin {

}

export enum BlendMode {

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

}

export interface MatrixTransformImageFilter {
  matrix: MatrixColorFilter,
  filterQuality: FilterQuality,
  next: ImageFilter | null
}

export type MaskFilter = BlurMaskFilter

export enum BlurStyle {

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

export class Line implements CkType {
  constructor (props: Partial<LineProps>) {

  }
}

export interface LineProps {
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  paint: Paint
}

export enum TextAlignEnum {

}

export enum TextDirectionEnum {

}

export enum FontWeightEnum {

}

export enum FontSlantEnum {

}

export enum FontWidthEnum {

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

export class Paragraph implements CkType {
  constructor (root: CkContainer, props: Partial<ParagraphProps>) {
  }
}

const COMPONENTS: { [key: string]: CkTypeConstructor | undefined } = {
  CkCanvas,
  Paragraph,
  Line
}

export function createElement (type: string, props: { [key: string]: any }, root: CkContainer) {
  const ctor = COMPONENTS[type]
  if (ctor) {
    return new ctor(props, root)
  } else {
    return undefined
  }
}
