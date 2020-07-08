import type { CanvasKit } from 'canvaskit-wasm'
import * as CanvasKitInit from 'canvaskit-wasm'
import type { HostConfig, ReactNodeList } from 'react-reconciler'
import * as  ReactReconciler from 'react-reconciler'
import { CkInstance, CkParentContext, createCkElement, Props } from './SkiaElementTypes'

export type ContainerContext = CkParentContext<any>

// @ts-ignore
const hostConfig: HostConfig<string,// Type
  Props, // Props
  ContainerContext, // Container
  CkInstance<string, Props, any>, // Instance
  any, // TextInstance
  any, // HydratableInstance
  any, // PublicInstance
  CanvasKit, // HostContext
  any, // UpdatePayload
  any, // ChildSet
  any, // TimeoutHandle
  any // NoTimeout
  > = {
  now: Date.now,
  supportsMutation: true,
  appendChildToContainer (container: ContainerContext, child: CkInstance<string, Props, any>) {
    console.log('appendChildToContainer')
  },
  getRootHostContext (rootContainerInstance: ContainerContext): CanvasKit {
    console.log('getRootHostContext')
    return rootContainerInstance.canvasKit
  },
  getChildHostContext (parentHostContext: CanvasKit, type: any, rootContainerInstance: ContainerContext): CanvasKit {
    console.log('getChildHostContext')
    return parentHostContext
  },
  shouldSetTextContent (type: string, props: Props): boolean {
    console.log('shouldSetTextContent')
    return true
  },
  createTextInstance (
    text: string,
    rootContainerInstance: ContainerContext,
    hostContext: CanvasKit,
    internalInstanceHandle: ReactReconciler.OpaqueHandle): any {
    console.log('createTextInstance')
  },
  createInstance (
    type: string,
    props: Props,
    rootContainerInstance: ContainerContext,
    hostContext: CanvasKit,
    internalInstanceHandle: ReactReconciler.OpaqueHandle): CkInstance<string, Props, any> {
    console.log('createInstance')
    return createCkElement(type, props, rootContainerInstance)
  },
  appendInitialChild (parentInstance: CkInstance<string, Props, any>, child: CkInstance<string, Props, any>) {
    console.log('appendInitialChild')
  },
  finalizeInitialChildren (
    parentInstance: CkInstance<string, Props, any>,
    type: string,
    props: Props,
    rootContainerInstance: ContainerContext,
    hostContext: CanvasKit): boolean {
    console.log('finalizeInitialChildren')
    return false
  },
  prepareForCommit (containerInfo: ContainerContext) {
    console.log('prepareForCommit')
  },
  resetAfterCommit (containerInfo: ContainerContext) {
    console.log('resetAfterCommit')
  }
}

const canvaskitReconciler = ReactReconciler(hostConfig)


export async function render (element: ReactNodeList, canvas: HTMLCanvasElement, callback = () => {
}) {
  const isConcurrent = false
  const hydrate = false

  // Creates root fiber node.
  // @ts-ignore
  const canvasKit = await CanvasKitInit()
  const skSurface = canvasKit.MakeCanvasSurface(canvas)
  const context: ContainerContext = { canvasKit, skInstance: skSurface }
  const container = canvaskitReconciler.createContainer(context, isConcurrent, hydrate)

  // Since there is no parent (since this is the root fiber). We set parentComponent to null.
  const parentComponent = null
  // Start reconcilation and render the result
  canvaskitReconciler.updateContainer(
    element,
    container,
    parentComponent,
    callback
  )

  // TODO provide support for dev tools
  // reactCanvaskitReconciler.injectIntoDevTools({
  //   bundleType: 1, // 0 for PROD, 1 for DEV
  //   version: '0.0.1', // version for your renderer
  //   rendererPackageName: 'react-canvaskit', // package name
  //   // @ts-ignore
  //   findHostInstanceByFiber: reactCanvaskitReconciler.findHostInstance // host instance (root)
  // })
}
