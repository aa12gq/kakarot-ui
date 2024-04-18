import { Component, ComponentPublicInstance, createApp } from 'vue';

export interface MountInstance {
  instance: ComponentPublicInstance;
  unmount: () => void;
}

/**
 * 挂载组件
 * @param RootComponent 组件
 * @param opts
 */
export function mountComponent(RootComponent: Component, opts: { [key: string]: any }): MountInstance {
  const app = createApp(RootComponent, opts);
  const root = document.createElement('div');

  document.body.appendChild(root);

  return {
    instance: app.mount(root),
    unmount() {
      app.unmount();
      document.body.removeChild(root);
    },
  };
}
