import type { CanvasKit, SkCanvas, SkObject, SkSurface } from 'canvaskit-wasm'
import { ReactElement, ReactNode } from 'react'

export type Props = { [key: string]: any }

interface CkObjectTyping {
  'ck-object': { type: SkObject<any>, name: 'SkObject', props: Props }
  'ck-surface': { type: SkSurface, name: 'SkSurface', props: CkSurfaceProps }
  'ck-canvas': { type: SkCanvas, name: 'SkCanvas', props: CkCanvasProps }
  'ck-line': { type: SkSurface, name: 'SkSurface', props: Props }
}

export type CkElementType = keyof CkObjectTyping

export interface CkElement<TypeName extends keyof CkObjectTyping = 'ck-object'> {
  readonly canvasKit: CanvasKit,
  readonly type: TypeName
  readonly props: CkObjectTyping[TypeName]['props']
  readonly skObjectType: CkObjectTyping[TypeName]['name']
  readonly skObject: CkObjectTyping[TypeName]['type']
}

export function isContainerElement (ckElement: CkElement<any>): ckElement is CkElementContainer<any> {
  return (ckElement as CkElementContainer).children !== undefined
}

export interface CkElementContainer<TypeName extends keyof CkObjectTyping = 'ck-object'> extends CkElement<TypeName> {
  children: (CkElement<any> | string)[]
}

interface CkElementCreator<TypeName extends keyof CkObjectTyping, ParentTypeName extends keyof CkObjectTyping> {
  (type: TypeName, props: CkObjectTyping[TypeName]['props'], parent: CkElement<ParentTypeName>): CkElement<TypeName>
}

export interface CkSurfaceProps {
  width: number
  height: number
  children?: ReactElement<CkCanvasProps> | ReactElement<CkCanvasProps>[]
}

class CkSurface implements CkElementContainer<'ck-surface'> {
  static create: CkElementCreator<'ck-surface', 'ck-canvas'> = (type, props, parent) => {
    const skSurface = parent.canvasKit.MakeSurface(props.width, props.height)
    return new CkSurface(parent.canvasKit, props, skSurface)
  }

  readonly canvasKit: CanvasKit
  readonly props: CkObjectTyping['ck-surface']['props']
  readonly skObject: CkObjectTyping['ck-surface']['type']
  readonly skObjectType: CkObjectTyping['ck-surface']['name'] = 'SkSurface'
  readonly type: 'ck-surface' = 'ck-surface'
  children: CkElement<any>[] = []

  constructor (
    canvasKit: CanvasKit,
    props: CkObjectTyping['ck-surface']['props'],
    skObject: CkObjectTyping['ck-surface']['type']
  ) {
    this.canvasKit = canvasKit
    this.props = props
    this.skObject = skObject
  }
}

export interface CkCanvasProps {
  clear?: Color
  children?: ReactNode
}

class CkCanvas implements CkElementContainer<'ck-canvas'> {
  static create: CkElementCreator<'ck-canvas', 'ck-surface'> = (type, props, parent) => {
    const skCanvas = parent.skObject.getCanvas()
    if (props.clear) {
      skCanvas.clear(toSkColor(parent.canvasKit, props.clear))
    }

    return new CkCanvas(parent.canvasKit, props, skCanvas)
  }

  readonly canvasKit: CanvasKit
  readonly props: CkObjectTyping['ck-canvas']['props']
  readonly skObject: CkObjectTyping['ck-canvas']['type']
  readonly skObjectType: CkObjectTyping['ck-canvas']['name'] = 'SkCanvas'
  readonly type: 'ck-canvas' = 'ck-canvas'
  children: CkElement<any>[] = []

  constructor (
    canvasKit: CanvasKit,
    props: CkObjectTyping['ck-canvas']['props'],
    skObject: CkObjectTyping['ck-canvas']['type']
  ) {
    this.canvasKit = canvasKit
    this.props = props
    this.skObject = skObject
  }
}

function toSkColor (canvasKit: CanvasKit, color: Color): number {
  return canvasKit.Color(color.red, color.green, color.blue, color.alpha ?? 1)
}

export interface Color {
  red: number,
  green: number,
  blue: number,
  alpha?: number
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

const CkElements: { [key in CkElementType]: CkElementCreator<any, any> } = {
  // @ts-ignore TODO
  'ck-line': undefined,
  // @ts-ignore TODO
  'ck-object': undefined,
  'ck-surface': CkSurface.create,
  'ck-canvas': CkCanvas.create
}

export function createCkElement (type: CkElementType, props: Props, parent: CkElement<any>): CkElement {
  return CkElements[type](type, props, parent)
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'ck-canvas': CkCanvasProps
      'ck-surface': CkSurfaceProps
      // 'sk-line': Partial<LineProps>
      // 'sk-paragraph': Partial<ParagraphProps>
    }
  }
}


