import { setup } from '@css-render/vue3-ssr'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  if (process.server && nuxtApp.ssrContext) {
    const { collect } = setup(nuxtApp.vueApp)
    const originalRenderMeta = nuxtApp.ssrContext?.renderMeta

    nuxtApp.ssrContext.renderMeta = () => {
      if (!originalRenderMeta) {
        return {
          headTags: collect()
        }
      }

      const originalMeta = originalRenderMeta()

      if ('then' in originalMeta) {
        return originalMeta.then((resolvedOriginalMeta: Record<string, unknown>) => {
          return {
            ...resolvedOriginalMeta,
            headTags: resolvedOriginalMeta.headTags + collect()
          }
        })
      } else {
        return {
          ...originalMeta,
          headTags: originalMeta.headTags + collect()
        }
      }
    }
  }
})
