import Reconciler, { ReactNodeList } from 'react-reconciler'
import { createElement } from './SkiaElementTypes'

const hostConfig = {
  appendInitialChild(parentInstance, child) {
    // TODO
  },

  createInstance(type, props, internalInstanceHandle) {
    return createElement(type, props, internalInstanceHandle);
  },

  createTextInstance(text, rootContainerInstance, internalInstanceHandle) {
    return text;
  },

  finalizeInitialChildren(wordElement, type, props) {
    return false;
  },

  getPublicInstance(inst) {
    return inst;
  },

  prepareForCommit() {
    // noop
  },

  prepareUpdate(wordElement, type, oldProps, newProps) {
    return true;
  },

  resetAfterCommit() {
    // noop
  },

  resetTextContent(wordElement) {
    // noop
  },

  getRootHostContext(rootInstance) {
    // You can use this 'rootInstance' to pass data from the roots.
  },

  getChildHostContext() {
    // TODO
    //return emptyObject;
  },

  shouldSetTextContent(type, props) {
    return false;
  },

  now: () => {
  },

  supportsMutation: false
}

// @ts-ignore ignore other reconciler methods for now
let CustomRenderer = Reconciler(hostConfig)

const ReactCanvasKit = {
  render (root: ReactNodeList, canvas: HTMLCanvasElement | OffscreenCanvas) {
    const container = CustomRenderer.createContainer(canvas, false, false)
    CustomRenderer.updateContainer(root, container, null, () => {
    })
    CustomRenderer.injectIntoDevTools({
      bundleType: 1, // 0 for PROD, 1 for DEV
      version: '0.0.1', // version for your renderer
      rendererPackageName: 'react-canvaskit', // package name
      findHostInstanceByFiber: CustomRenderer.findHostInstance // host instance (root)
    })
  }
}

export default ReactCanvasKit
