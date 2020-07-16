import type { CanvasKit, SkSurface } from 'canvaskit-wasm'
import * as CanvasKitInit from 'canvaskit-wasm'
import type { HostConfig, ReactNodeList } from 'react-reconciler'
import * as  ReactReconciler from 'react-reconciler'
import {
  CkElement,
  CkElementContainer,
  CkElementType,
  createCkElement,
  isContainerElement,
  Props
} from './SkiaElementTypes'

// @ts-ignore
const canvasKitPromise = CanvasKitInit()

type ContainerContext = {
  ckElement: CkElement
}



// @ts-ignore
const hostConfig: HostConfig<//
  CkElementType,// Type
  Props, // Props
  CkElementContainer<any>, // Container
  CkElement<any>, // Instance
  CkElement<'ck-text'>, // TextInstance
  any, // HydratableInstance
  CkElement<any> | string, // PublicInstance
  ContainerContext, // HostContext
  any, // UpdatePayload
  (CkElement<any> | string)[], // ChildSet
  any, // TimeoutHandle
  any // NoTimeout
  > & { canvasKit: CanvasKit }
  = {
  // @ts-ignore lazily set when reconciler is created
  canvasKit: undefined,
  /**
   * This function is used by the reconciler in order to calculate current time for prioritising work.
   */
  now: Date.now,
  supportsMutation: false,
  supportsPersistence: true,
  supportsHydration: false,

  createContainerChildSet (container) {
    return [...container.children]
  },
  /**
   * Attaches new children to the set returned by createContainerChildSet
   * @param childSet
   * @param child
   */
  appendChildToContainerChildSet (childSet, child) {
    childSet.push(child)
  },
  replaceContainerChildren (container, newChildren) {
    container.children = newChildren
    container.render()
  },
  /**
   * This function lets you share some context with the other functions in this HostConfig.
   *
   * @param rootContainerInstance is basically the root dom node you specify while calling render. This is most commonly
   * <div id="root"></div>
   * @return A context object that you wish to pass to immediate child.
   */
  getRootHostContext (rootContainerInstance): ContainerContext {
    return { ckElement: rootContainerInstance }
  },

  /**
   * This function provides a way to access context from the parent and also a way to pass some context to the immediate
   * children of the current node. Context is basically a regular object containing some information.
   *
   * @param parentHostContext Context from parent. Example: This will contain rootContext for the immediate child of
   * roothost.
   * @param type This contains the type of fiber i.e, ‘div’, ‘span’, ‘p’, ‘input’ etc.
   * @param rootContainerInstance rootInstance is basically the root dom node you specify while calling render. This is
   * most commonly <div id="root"></div>
   * @return A context object that you wish to pass to immediate child.
   */
  getChildHostContext (parentHostContext, type, rootContainerInstance): ContainerContext {
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
   * @param type This contains the type of fiber i.e, ‘div’, ‘span’, ‘p’, ‘input’ etc.
   * @param props Contains the props passed to the host react element.
   * @return This should be a boolean value.
   */
  shouldSetTextContent (type, props): boolean {
    return type === 'ck-text'
  },

  /**
   * Here we specify how should renderer handle the text content
   *
   * @param text contains the text string that needs to be rendered.
   * @param rootContainerInstance root dom node you specify while calling render. This is most commonly
   * <div id="root"></div>
   * @param hostContext contains the context from the host node enclosing this text node. For example, in the case of
   * <p>Hello</p>: currentHostContext for Hello text node will be host context of p.
   * @param internalInstanceHandle The fiber node for the text instance. This manages work for this instance.
   * @return This should be an actual text view element. In case of dom it would be a textNode.
   */
  // @ts-ignore
  // createTextInstance (text, rootContainerInstance, hostContext, internalInstanceHandle) {
  //   return null
  // },

  /**
   * Create instance is called on all host nodes except the leaf text nodes. So we should return the correct view
   * element for each host type here. We are also supposed to take care of the props sent to the host element. For
   * example: setting up onClickListeners or setting up styling etc.
   *
   * @param type This contains the type of fiber i.e, ‘div’, ‘span’, ‘p’, ‘input’ etc.
   * @param props  Contains the props passed to the host react element.
   * @param rootContainerInstance Root dom node you specify while calling render. This is most commonly <div id="root"></div>
   * @param hostContext contains the context from the parent node enclosing this node. This is the return value from getChildHostContext of the parent node.
   * @param internalInstanceHandle The fiber node for the text instance. This manages work for this instance.
   */
  createInstance (
    type,
    props,
    rootContainerInstance,
    hostContext,
    internalInstanceHandle) {
    return createCkElement(type, props, hostContext.ckElement)
  },

  /**
   * Here we will attach the child dom node to the parent on the initial render phase. This method will be called for
   * each child of the current node.
   *
   * @param parentInstance The current node in the traversal
   * @param child The child dom node of the current node.
   */
  appendInitialChild (parentInstance, child) {
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
   * @param parentInstance The instance is the dom element after appendInitialChild.
   * @param type This contains the type of fiber i.e, ‘div’, ‘span’, ‘p’, ‘input’ etc.
   * @param props Contains the props passed to the host react element.
   * @param rootContainerInstance root dom node you specify while calling render. This is most commonly <div id="root"></div>
   * @param hostContext contains the context from the parent node enclosing this node. This is the return value from getChildHostContext of the parent node.
   */
  finalizeInitialChildren (parentInstance, type, props, rootContainerInstance, hostContext) {
    return false
  },
  finalizeContainerChildren (container: CkElement<any>, newChildren: (CkElement<any> | string)[]) {
    return false
  },
  /**
   * This function is called when we have made a in-memory render tree of all the views (Remember we are yet to attach
   * it the the actual root dom node). Here we can do any preparation that needs to be done on the rootContainer before
   * attaching the in memory render tree. For example: In the case of react-dom, it keeps track of all the currently
   * focused elements, disabled events temporarily, etc.
   *
   * @param containerInfo root dom node you specify while calling render. This is most commonly <div id="root"></div>
   */
  prepareForCommit (containerInfo) {
    // noop?
  },
  /**
   * This function gets executed after the inmemory tree has been attached to the root dom element. Here we can do any
   * post attach operations that needs to be done. For example: react-dom re-enabled events which were temporarily
   * disabled in prepareForCommit and refocuses elements, etc.
   *
   * @param containerInfo root dom node you specify while calling render. This is most commonly <div id="root"></div>
   */
  resetAfterCommit (containerInfo) {
    (<SkSurface>containerInfo.skObject).flush()
  },

  getPublicInstance (instance: CkElement<any> | string): CkElement<any> | string {
    return instance
  }
}

const canvaskitReconciler = ReactReconciler(hostConfig)
canvaskitReconciler.injectIntoDevTools({
  bundleType: 1, // 0 for PROD, 1 for DEV
  version: '0.0.1', // version for your renderer
  rendererPackageName: 'react-canvaskit' // package name
})

export async function render (element: ReactNodeList, glRenderingContext: WebGLRenderingContext, width: number, height: number) {
  const isConcurrent = false
  const hydrate = false

  const canvasKit = await canvasKitPromise
  const context = canvasKit.GetWebGLContext({getContext(){ return glRenderingContext}})
  const grCtx = canvasKit.MakeGrContext(context)
  const skSurface = canvasKit.MakeOnScreenGLSurface(grCtx, width, height, null)
  // @ts-ignore our root object doesn't can't have a parent
  const ckSurfaceElement: CkElementContainer<'ck-surface'> = {
    canvasKit,
    type: 'ck-surface',
    props: { width, height },
    skObjectType: 'SkSurface',
    skObject: skSurface,
    children: [],
    render () {
      this.children.forEach(child => {
        if (typeof child !== 'string') {
          child.render(ckSurfaceElement)
        }
      })
    }
  }
  const container = canvaskitReconciler.createContainer(ckSurfaceElement, isConcurrent, hydrate)

  // Since there is no parent (since this is the root fiber). We set parentComponent to null.
  const parentComponent = null
  // Start reconcilation and render the result
  return new Promise<void>(resolve => {
    canvaskitReconciler.updateContainer(
      element,
      container,
      parentComponent,
      () => {
        resolve()
      }
    )
  })
}
