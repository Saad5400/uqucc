export default defineNuxtPlugin((nuxtApp) => {
    // override Vue warning handler
    nuxtApp.vueApp.config.warnHandler = (warning, instance, trace) => {
        // filter out just the hydration-style-mismatch warnings
        if (
            warning.includes('Hydration style mismatch') ||
            warning.includes('Hydration node mismatch')
        ) {
            return
        }
        // fall back to the default behavior
        // eslint-disable-next-line no-console
        console.warn(`[Vue warn]: ${warning}${trace}`)
    }
})
