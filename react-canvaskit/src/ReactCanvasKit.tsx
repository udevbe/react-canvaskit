import type { CanvasKit, FontMgr as SkFontManager } from 'canvaskit-wasm'
import * as CanvasKitInit from 'canvaskit-wasm'
import type { FunctionComponent, ReactNode } from 'react'
import * as React from 'react'
import type { HostConfig } from 'react-reconciler'
import * as ReactReconciler from 'react-reconciler'
import {
  CkElement,
  CkElementContainer,
  CkElementProps,
  CkElementType,
  createCkElement,
  isContainerElement,
} from './SkiaElementTypes'

const loadRobotoFontData = fetch('https://storage.googleapis.com/skia-cdn/misc/Roboto-Regular.ttf').then((response) =>
  response.arrayBuffer(),
)
// @ts-ignore
const canvasKitPromise: Promise<CanvasKit> = CanvasKitInit({
  locateFile: (file: string): string => `https://unpkg.com/canvaskit-wasm@0.32.0/bin/${file}`,
})
let canvasKit: CanvasKit | undefined

let CanvasKitContext: React.Context<CanvasKit>
export let useCanvasKit: () => CanvasKit
export let CanvasKitProvider: FunctionComponent

let FontManagerContext: React.Context<SkFontManager>
export let useFontManager: () => SkFontManager
export let FontManagerProvider: FunctionComponent<{ fontData: ArrayBuffer[] | undefined; children?: ReactNode }>

export async function init() {
  canvasKit = await canvasKitPromise
  const robotoFontData = await loadRobotoFontData
  // const copy to make the TS compiler happy when we pass it down to a lambda
  const ck = canvasKit

  CanvasKitContext = React.createContext(ck)
  useCanvasKit = () => React.useContext(CanvasKitContext)
  CanvasKitProvider = ({ children }) => <CanvasKitContext.Provider value={ck}>children</CanvasKitContext.Provider>

  const defaultFontManager = ck.FontMgr.FromData(robotoFontData) as SkFontManager
  FontManagerContext = React.createContext(defaultFontManager)
  useFontManager = () => React.useContext(FontManagerContext)
  FontManagerProvider = (props: { fontData: ArrayBuffer[] | undefined; children?: ReactNode }) => {
    if (props.fontData) {
      const fontMgrFromData = ck.FontMgr.FromData(...props.fontData)
      if (fontMgrFromData === null) {
        throw new Error('Failed to create font manager from font data.')
      }

      return <FontManagerContext.Provider value={fontMgrFromData}>{props.children}</FontManagerContext.Provider>
    } else {
      return <FontManagerContext.Provider value={defaultFontManager}>{props.children}</FontManagerContext.Provider>
    }
  }
}

type ContainerContext = {
  ckElement: CkElement<any>
}

export interface SkObjectRef<T> {
  current: T
}

interface ReactCanvasKitHostConfig
  extends HostConfig<
    CkElementType, // Type
    CkElementProps<any>, // Props
    CkElementContainer<any>, // Container
    CkElement<any>, // Instance
    CkElement<'ck-text'> | CkElement<'ck-paragraph'>, // TextInstance
    any, // SuspenceInstance
    any, // HydratableInstance
    SkObjectRef<any>, // PublicInstance
    ContainerContext, // HostContext
    any, // UpdatePayload
    CkElement<any>[], // _ChildSet
    any, // TimeoutHandle
    any // NoTimout
  > {}

// @ts-ignore TODO implement missing functions
const hostConfig: ReactCanvasKitHostConfig = {
  /**
   * This function is used by the reconciler in order to calculate current time for prioritising work.
   */
  now: Date.now,
  supportsMutation: false,
  supportsPersistence: true,
  supportsHydration: false,

  createContainerChildSet(container: CkElementContainer<any>): CkElement<any>[] {
    return []
  },
  /**
   * Attaches new children to the set returned by createContainerChildSet
   * @param childSet
   * @param child
   */
  appendChildToContainerChildSet(childSet: CkElement<any>[], child: CkElement<any>) {
    childSet.push(child)
  },
  replaceContainerChildren(container: CkElementContainer<any>, newChildren: CkElement<any>[]) {
    container.children.forEach((child) => child.delete())
    container.children = newChildren
  },
  /**
   * This function lets you share some context with the other functions in this HostConfig.
   *
   * This method lets you return the initial host context from the root of the tree. See `getChildHostContext` for the explanation of host context.
   *
   * If you don't intend to use host context, you can return `null`.
   *
   * This method happens **in the render phase**. Do not mutate the tree from it.
   *
   * @param rootContainerInstance is basically the root dom node you specify while calling render. This is most commonly
   * <div id="root"></div>
   * @return A context object that you wish to pass to immediate child.
   */
  getRootHostContext(rootContainerInstance): ContainerContext {
    return { ckElement: rootContainerInstance }
  },

  /**
   * This function provides a way to access context from the parent and also a way to pass some context to the immediate
   * children of the current node. Context is basically a regular object containing some information.
   *
   * Host context lets you track some information about where you are in the tree so that it's available inside `createInstance` as the `hostContext` parameter. For example, the DOM renderer uses it to track whether it's inside an HTML or an SVG tree, because `createInstance` implementation needs to be different for them.
   *
   * If the node of this `type` does not influence the context you want to pass down, you can return `parentHostContext`. Alternatively, you can return any custom object representing the information you want to pass down.
   *
   * If you don't want to do anything here, return `parentHostContext`.
   *
   * This method happens **in the render phase**. Do not mutate the tree from it.
   *
   * @param parentHostContext Context from parent. Example: This will contain rootContext for the immediate child of
   * roothost.
   * @param type This contains the type of fiber i.e, ‘div’, ‘span’, ‘p’, ‘input’ etc.
   * @param rootContainerInstance rootInstance is basically the root dom node you specify while calling render. This is
   * most commonly <div id="root"></div>
   * @return A context object that you wish to pass to immediate child.
   */
  getChildHostContext(parentHostContext, type, rootContainerInstance): ContainerContext {
    return parentHostContext
  },

  /**
   * If the function returns true, the text would be created inside the host element and no new text element would be
   * created separately.
   *
   * If this returned true, the next call would be to createInstance for the current element and traversal would stop at
   * this node (children of this element wont be traversed).
   *
   * If it returns false, getChildHostContext and shouldSetTextContent will be called on the child elements and it will
   * continue till shouldSetTextContent returns true or if the recursion reaches the last tree endpoint which usually is
   * a text node. When it reaches the last leaf text node it will call createTextInstance
   *
   * Some target platforms support setting an instance's text content without manually creating a text node. For example, in the DOM, you can set `node.textContent` instead of creating a text node and appending it.
   *
   * If you return `true` from this method, React will assume that this node's children are text, and will not create nodes for them. It will instead rely on you to have filled that text during `createInstance`. This is a performance optimization. For example, the DOM renderer returns `true` only if `type` is a known text-only parent (like `'textarea'`) or if `props.children` has a `'string'` type. If you return `true`, you will need to implement `resetTextContent` too.
   *
   * If you don't want to do anything here, you should return `false`.
   *
   * This method happens **in the render phase**. Do not mutate the tree from it.
   *
   * @param type This contains the type of fiber i.e, ‘div’, ‘span’, ‘p’, ‘input’ etc.
   * @param props Contains the props passed to the host react element.
   * @return This should be a boolean value.
   */
  shouldSetTextContent(type, props): boolean {
    return type === 'ck-text' || type === 'ck-paragraph'
  },

  /**
   * Here we specify how should renderer handle the text content
   *
   * Same as `createInstance`, but for text nodes. If your renderer doesn't support text nodes, you can throw here.
   *
   * @param text contains the text string that needs to be rendered.
   * @param rootContainerInstance root dom node you specify while calling render. This is most commonly
   * <div id="root"></div>
   * @param hostContext contains the context from the host node enclosing this text node. For example, in the case of
   * <p>Hello</p>: currentHostContext for Hello text node will be host context of p.
   * @param internalInstanceHandle The fiber node for the text instance. This manages work for this instance.
   * @return This should be an actual text view element. In case of dom it would be a textNode.
   */
  createTextInstance(
    text,
    rootContainerInstance,
    hostContext,
    internalInstanceHandle,
  ): CkElement<'ck-text'> | CkElement<'ck-paragraph'> {
    throw new Error(`The text '${text}' must be wrapped in a ck-text or ck-paragraph element.`)
  },

  /**
   * Create instance is called on all host nodes except the leaf text nodes. So we should return the correct view
   * element for each host type here. We are also supposed to take care of the props sent to the host element. For
   * example: setting up onClickListeners or setting up styling etc.
   *
   * This method should return a newly created node. For example, the DOM renderer would call `document.createElement(type)` here and then set the properties from `props`.
   *
   * You can use `rootContainer` to access the root container associated with that tree. For example, in the DOM renderer, this is useful to get the correct `document` reference that the root belongs to.
   *
   * The `hostContext` parameter lets you keep track of some information about your current place in the tree. To learn more about it, see `getChildHostContext` below.
   *
   * The `internalHandle` data structure is meant to be opaque. If you bend the rules and rely on its internal fields, be aware that it may change significantly between versions. You're taking on additional maintenance risk by reading from it, and giving up all guarantees if you write something to it.
   *
   * This method happens **in the render phase**. It can (and usually should) mutate the node it has just created before returning it, but it must not modify any other nodes. It must not register any event handlers on the parent tree. This is because an instance being created doesn't guarantee it would be placed in the tree — it could be left unused and later collected by GC. If you need to do something when an instance is definitely in the tree, look at `commitMount` instead.
   *
   * @param type This contains the type of fiber i.e, ‘div’, ‘span’, ‘p’, ‘input’ etc.
   * @param props  Contains the props passed to the host react element.
   * @param rootContainerInstance Root dom node you specify while calling render. This is most commonly <div id="root"></div>
   * @param hostContext contains the context from the parent node enclosing this node. This is the return value from getChildHostContext of the parent node.
   * @param internalInstanceHandle The fiber node for the text instance. This manages work for this instance.
   */
  createInstance(type, props, rootContainerInstance, hostContext, internalInstanceHandle) {
    return createCkElement(type, props, hostContext.ckElement.canvasKit)
  },

  /**
   * Here we will attach the child dom node to the parent on the initial render phase. This method will be called for
   * each child of the current node.
   *
   * This method should mutate the `parentInstance` and add the child to its list of children. For example, in the DOM this would translate to a `parentInstance.appendChild(child)` call.
   *
   * This method happens **in the render phase**. It can mutate `parentInstance` and `child`, but it must not modify any other nodes. It's called while the tree is still being built up and not connected to the actual tree on the screen.
   *
   * @param parentInstance The current node in the traversal
   * @param child The child dom node of the current node.
   */
  appendInitialChild(parentInstance, child) {
    if (isContainerElement(parentInstance)) {
      parentInstance.children.push(child)
    } else {
      throw new Error('Bug? Trying to append a child to a parent that is not a container.')
    }
  },

  /**
   * In case of react native renderer, this function does nothing but return false.
   *
   * In case of react-dom, this adds default dom properties such as event listeners, etc.
   * For implementing auto focus for certain input elements (autofocus can happen only
   * after render is done), react-dom sends return type as true. This results in commitMount
   * method for this element to be called. The commitMount will be called only if an element
   * returns true in finalizeInitialChildren and after the all elements of the tree has been
   * rendered (even after resetAfterCommit).
   *
   * In this method, you can perform some final mutations on the `instance`. Unlike with `createInstance`, by the time `finalizeInitialChildren` is called, all the initial children have already been added to the `instance`, but the instance itself has not yet been connected to the tree on the screen.
   *
   * This method happens **in the render phase**. It can mutate `instance`, but it must not modify any other nodes. It's called while the tree is still being built up and not connected to the actual tree on the screen.
   *
   * There is a second purpose to this method. It lets you specify whether there is some work that needs to happen when the node is connected to the tree on the screen. If you return `true`, the instance will receive a `commitMount` call later. See its documentation below.
   *
   * If you don't want to do anything here, you should return `false`.
   *
   * @param parentInstance The instance is the dom element after appendInitialChild.
   * @param type This contains the type of fiber i.e, ‘div’, ‘span’, ‘p’, ‘input’ etc.
   * @param props Contains the props passed to the host react element.
   * @param rootContainerInstance root dom node you specify while calling render. This is most commonly <div id="root"></div>
   * @param hostContext contains the context from the parent node enclosing this node. This is the return value from getChildHostContext of the parent node.
   */
  finalizeInitialChildren(parentInstance, type, props, rootContainerInstance, hostContext) {
    return false
  },
  finalizeContainerChildren(container: CkElementContainer<any>, newChildren: CkElement<any>[]) {},

  /**
   *
   * This function is called when we have made a in-memory render tree of all the views (Remember we are yet to attach
   * it the the actual root dom node). Here we can do any preparation that needs to be done on the rootContainer before
   * attaching the in memory render tree. For example: In the case of react-dom, it keeps track of all the currently
   * focused elements, disabled events temporarily, etc.
   *
   * This method lets you store some information before React starts making changes to the tree on the screen. For example, the DOM renderer stores the current text selection so that it can later restore it. This method is mirrored by `resetAfterCommit`.
   *
   * Even if you don't want to do anything here, you need to return `null` from it.
   *
   * @param containerInfo root dom node you specify while calling render. This is most commonly <div id="root"></div>
   */
  prepareForCommit(containerInfo) {
    return null
  },

  /**
   * This function gets executed after the inmemory tree has been attached to the root dom element. Here we can do any
   * post attach operations that needs to be done. For example: react-dom re-enabled events which were temporarily
   * disabled in prepareForCommit and refocuses elements, etc.
   *
   * This method is called right after React has performed the tree mutations. You can use it to restore something you've stored in `prepareForCommit` — for example, text selection.
   *
   * You can leave it empty.
   *
   * @param containerInfo root dom node you specify while calling render. This is most commonly <div id="root"></div>
   */
  resetAfterCommit(containerInfo) {
    // TODO instead of re-rendering everything, only rerender dirty nodes?
    containerInfo.children.forEach((child) => child.render(containerInfo))
    containerInfo.props.renderCallback?.()
  },

  getPublicInstance(instance: CkElement<any> | CkElement<'ck-text'>): SkObjectRef<any> {
    return instance.skObject
  },

  /**
   * React calls this method so that you can compare the previous and the next props, and decide whether you need to update the underlying instance or not. If you don't need to update it, return `null`. If you need to update it, you can return an arbitrary object representing the changes that need to happen. Then in `commitUpdate` you would need to apply those changes to the instance.
   *
   * This method happens **in the render phase**. It should only *calculate* the update — but not apply it! For example, the DOM renderer returns an array that looks like `[prop1, value1, prop2, value2, ...]` for all props that have actually changed. And only in `commitUpdate` it applies those changes. You should calculate as much as you can in `prepareUpdate` so that `commitUpdate` can be very fast and straightforward.
   *
   * See the meaning of `rootContainer` and `hostContext` in the `createInstance` documentation.
   */
  prepareUpdate(instance, type, oldProps, newProps, rootContainerInstance, hostContext) {
    // TODO check & return if we can need to create an entire new object or we can reuse the underlying skobject and use it as the payload in cloneInstance.
  },

  cloneInstance(
    instance: CkElement<any>,
    updatePayload: any,
    type: CkElementType,
    oldProps: CkElementProps<any>,
    newProps: CkElementProps<any>,
    internalInstanceHandle: SkObjectRef<any>,
    keepChildren: boolean,
    recyclableInstance: CkElement<any>,
  ): CkElement<any> {
    // TODO implement a way where we can create a new instance and reuse the underlying canvaskit objects where possible

    const ckElement = createCkElement(type, newProps, instance.canvasKit)
    if (keepChildren && isContainerElement(ckElement) && isContainerElement(instance)) {
      ckElement.children = instance.children
    }
    // recyclableInstance.props = newProps
    // return recyclableInstance
    return ckElement
  },
}

const canvaskitReconciler = ReactReconciler(hostConfig)
canvaskitReconciler.injectIntoDevTools({
  bundleType: 1, // 0 for PROD, 1 for DEV
  version: '0.0.1', // version for your renderer
  rendererPackageName: 'react-canvaskit', // package name
})

export function render(element: ReactNode, canvas: HTMLCanvasElement, renderCallback?: () => void) {
  if (canvasKit === undefined) {
    throw new Error('Not initialized')
  }

  const rootTag = 0
  const hydrate = false

  const skSurface = canvasKit.MakeWebGLCanvasSurface(canvas, undefined)
  if (skSurface === null) {
    throw new Error('Failed to create surface from canvas.')
  }

  const ckSurfaceElement: CkElementContainer<'ck-surface'> = {
    canvasKit,
    type: 'ck-surface',
    // @ts-ignore
    props: { width: canvas.width, height: canvas.height, renderCallback },
    skObjectType: 'SkSurface',
    skObject: skSurface,
    children: [],
    render() {
      this.children.forEach((child) => child.render(ckSurfaceElement))
    },
  }
  const container = canvaskitReconciler.createContainer(ckSurfaceElement, rootTag, hydrate, null)

  return new Promise<void>((resolve) => {
    canvaskitReconciler.updateContainer(element, container, null, () => resolve())
  })
}
