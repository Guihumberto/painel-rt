import { ref, watch, type Ref } from 'vue'

/**
 * Anima de onde estiver até o novo valor-alvo como um painel de embarque
 * (split-flap), assinatura visual do placar do painel macro. Observa
 * `target` em vez de capturar o valor só no mount, porque os indicadores
 * chegam de uma store assíncrona e podem mudar de 0 para o valor real
 * depois que o tile já foi montado.
 */
export function useSplitFlap(target: Ref<number>, durationMs = 900) {
  const displayed = ref(0)

  watch(
    target,
    (to, from = 0) => {
      const start = performance.now()

      function tick(now: number) {
        const progress = Math.min((now - start) / durationMs, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        displayed.value = Math.round(from + (to - from) * eased)
        if (progress < 1) {
          requestAnimationFrame(tick)
        }
      }

      requestAnimationFrame(tick)
    },
    { immediate: true },
  )

  return displayed
}
