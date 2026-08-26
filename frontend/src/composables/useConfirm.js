import { reactive } from 'vue'

const state = reactive({
  visible: false,
  title: '',
  message: '',
  confirmLabel: 'Confirmer',
})

let resolveFn = null

export function useConfirm() {
  function ask(message, { title = 'Confirmer', confirmLabel = 'Confirmer' } = {}) {
    state.visible = true
    state.title = title
    state.message = message
    state.confirmLabel = confirmLabel
    return new Promise(resolve => { resolveFn = resolve })
  }

  function confirm() {
    state.visible = false
    resolveFn?.(true)
    resolveFn = null
  }

  function cancel() {
    state.visible = false
    resolveFn?.(false)
    resolveFn = null
  }

  return { state, ask, confirm, cancel }
}
