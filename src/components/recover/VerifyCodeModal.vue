<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import RecoverToast from '@/components/recover/RecoverToast.vue'

const props = defineProps<{
  aberto: boolean
  email: string
  carregando?: boolean
}>()

const emit = defineEmits<{
  fechar: []
  confirmar: [codigo: string]
  reenviar: []
}>()

const state = reactive({ codigo: '' })
const tocado = ref(false)

function normalizarToken(valor: string) {
  return valor.toLowerCase().replace(/[^a-f0-9]/g, '').slice(0, 8)
}

const codigoLimpo = computed(() => normalizarToken(state.codigo))
const codigoValido = computed(() => /^[a-f0-9]{8}$/.test(codigoLimpo.value))

watch(
  () => props.aberto,
  (aberto) => {
    if (aberto) {
      state.codigo = ''
      tocado.value = false
    }
  }
)

function inserirTextoNoCursor(input: HTMLInputElement, texto: string) {
  const start = input.selectionStart ?? input.value.length
  const end = input.selectionEnd ?? input.value.length
  const antes = input.value.slice(0, start)
  const depois = input.value.slice(end)
  const novo = (antes + texto + depois).slice(0, 8)
  state.codigo = normalizarToken(novo)

  requestAnimationFrame(() => {
    const pos = Math.min(start + texto.length, state.codigo.length)
    input.setSelectionRange(pos, pos)
  })
}

function onBeforeInput(e: InputEvent) {
  const input = e.target as HTMLInputElement
  const data = e.data ?? ''

  if (!data) return

  const start = input.selectionStart ?? input.value.length
  const end = input.selectionEnd ?? input.value.length
  const selecionado = end - start
  const tamanhoApos = input.value.length - selecionado

  if (tamanhoApos >= 8) {
    e.preventDefault()
    return
  }

  if (!/^[0-9a-fA-F]+$/.test(data)) {
    e.preventDefault()
    return
  }

  const lower = data.toLowerCase()
  if (lower !== data) {
    e.preventDefault()
    inserirTextoNoCursor(input, lower)
  }
}

function onKeydown(e: KeyboardEvent) {
  if (e.ctrlKey || e.metaKey || e.altKey) return

  const k = e.key
  const allowedControl = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'Tab']
  if (allowedControl.includes(k)) return

  if (k.length === 1 && !/^[0-9a-fA-F]$/.test(k)) {
    e.preventDefault()
  }
}

function onInput(e: Event) {
  const input = e.target as HTMLInputElement
  state.codigo = normalizarToken(input.value)
}

function onPaste(e: ClipboardEvent) {
  e.preventDefault()
  const input = e.target as HTMLInputElement
  const texto = e.clipboardData?.getData('text') ?? ''
  inserirTextoNoCursor(input, normalizarToken(texto))
}

type ToastType = 'erro' | 'info' | 'sucesso'
const toastAberto = ref(false)
const toastTipo = ref<ToastType>('info')
const toastMensagem = ref('')

function abrirToast(tipo: ToastType, mensagem: string) {
  toastTipo.value = tipo
  toastMensagem.value = mensagem
  toastAberto.value = true
}

function fecharToast() {
  toastAberto.value = false
}

function confirmar() {
  tocado.value = true

  if (!codigoValido.value) {
    return
  }

  emit('confirmar', codigoLimpo.value)
}

function reenviar() {
  emit('reenviar')
}

function toastSucesso(mensagem?: string) {
  abrirToast('sucesso', mensagem ?? 'Código validado com sucesso.')
}

function toastErro(mensagem?: string) {
  abrirToast('erro', mensagem ?? 'Código inválido. Tente novamente.')
}

function toastReenviado(mensagem?: string) {
  abrirToast('info', mensagem ?? 'Código reenviado para seu email.')
}

function limparEstado() {
  state.codigo = ''
  tocado.value = false
}

defineExpose({
  toastSucesso,
  toastErro,
  toastReenviado,
  limparEstado
})
</script>

<template>
  <Teleport to="body">
    <div class="toast-fixed">
      <RecoverToast :aberto="toastAberto" :tipo="toastTipo" :mensagem="toastMensagem" @fechar="fecharToast" />
    </div>
  </Teleport>

  <Teleport to="body">
    <Transition name="modal">
      <div v-if="aberto" class="modal-overlay">
        <div class="modal-card" role="dialog" aria-modal="true" aria-label="Verifique seu email">
          <button class="btn-fechar" type="button" aria-label="Fechar" @click="emit('fechar')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
          </button>

          <div class="modal-cabecalho">
            <h2 class="modal-titulo">Verifique seu email</h2>
            <p class="modal-subtitulo">
              Digite o código enviado para
              <span class="modal-email">{{ email || 'seuemail@exemplo.com' }}</span>
            </p>
          </div>

          <div class="form-grupo">
            <label class="form-rotulo">Código de verificação</label>

            <input :value="codigoLimpo" @beforeinput="onBeforeInput" @keydown="onKeydown" @input="onInput"
              @paste="onPaste" @blur="tocado = true" class="form-input" autocomplete="one-time-code"
              placeholder="— — — — — — — —" :class="{ 'input-erro': tocado && !codigoValido }" maxlength="8"
              autocapitalize="none" spellcheck="false" />

            <p v-if="tocado && !codigoValido" class="erro-texto">
              Informe um token com 8 caracteres.
            </p>
          </div>

          <div class="form-acoes">
            <button class="btn-primario btn-bloco" type="button" @click="confirmar" :disabled="!!carregando">
              Confirmar código
            </button>
          </div>

          <div class="divisor">
            <span class="divisor-linha"></span>
            <span class="divisor-texto">ou</span>
            <span class="divisor-linha"></span>
          </div>

          <div class="modal-rodape">
            <span class="rodape-texto">Não recebeu o email?</span>
            <button type="button" class="btn-secundario btn-bloco" @click="reenviar" :disabled="!!carregando">
              Reenviar código
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.toast-fixed {
  position: fixed;
  top: 1.15rem;
  right: 1.15rem;
  z-index: 80;
  width: min(420px, calc(100vw - 2.3rem));
  pointer-events: none;
}

.toast-fixed :deep(.toast),
.toast-fixed :deep(.toast-fechar) {
  pointer-events: auto;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(17, 17, 17, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.25rem;
  z-index: 50;
}

.modal-card {
  width: 100%;
  max-width: 480px;
  background: var(--color-neutral-light-white);
  border-radius: 18px;
  border: 1px solid var(--color-neutral-light-light);
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.18);
  padding: 2rem 2rem 1.75rem;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.btn-fechar {
  position: absolute;
  right: 1rem;
  top: 1rem;
  border: none;
  background: transparent;
  cursor: pointer;
  color: var(--color-neutral-medium);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.3rem;
  border-radius: 6px;
  transition: color 0.2s ease, background 0.2s ease;
}

.btn-fechar:hover {
  color: var(--color-neutral-dark);
  background: var(--color-neutral-light-light);
}

.modal-cabecalho {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  padding-right: 1.5rem;
}

.modal-titulo {
  font-size: 1.55rem;
  font-weight: 700;
  color: var(--color-neutral-dark);
  line-height: 1.2;
}

.modal-subtitulo {
  font-size: 0.88rem;
  color: var(--color-neutral-medium);
  line-height: 1.35;
}

.modal-email {
  color: var(--color-primary-medium);
  font-weight: 700;
}

.form-grupo {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.form-rotulo {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--color-neutral-dark);
}

.form-input {
  width: 100%;
  padding: 0.52rem 0.75rem;
  border: 1.5px solid var(--color-neutral-light-medium);
  border-radius: 10px;
  font-size: 0.82rem;
  font-family: inherit;
  color: var(--color-neutral-dark);
  background: var(--color-neutral-light-white);
  transition: border-color 0.22s ease, box-shadow 0.22s ease, transform 0.22s ease;
  outline: none;
  height: 40px;
  letter-spacing: 0.12em;
}

.form-input::placeholder {
  letter-spacing: 0.2em;
  color: var(--color-neutral-light-dark);
}

.form-input:focus {
  border-color: var(--color-primary-medium);
  box-shadow: 0 0 0 3px rgba(62, 58, 168, 0.13);
  transform: translateY(-1px);
}

.input-erro {
  border-color: var(--color-error-medium) !important;
  box-shadow: 0 0 0 3px rgba(255, 97, 109, 0.12) !important;
}

.erro-texto {
  font-size: 0.72rem;
  color: var(--color-error-dark);
  font-weight: 500;
}

.form-acoes {
  margin-top: 0.25rem;
}

.btn-primario {
  background: var(--color-primary-medium);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 0.88rem;
  font-weight: 700;
  font-family: inherit;
  height: 44px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.25s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-primario::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, transparent 55%);
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: inherit;
}

.btn-primario:hover:not(:disabled) {
  transform: translateY(-3px) scale(1.01);
  box-shadow: 0 12px 32px rgba(62, 58, 168, 0.42);
}

.btn-primario:hover:not(:disabled)::after {
  opacity: 1;
}

.btn-primario:active:not(:disabled) {
  transform: translateY(0) scale(0.98);
  box-shadow: none;
}

.btn-primario:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-bloco {
  width: 100%;
}

.divisor {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0.25rem 0;
}

.divisor-linha {
  flex: 1;
  height: 1px;
  background: var(--color-neutral-light-medium);
}

.divisor-texto {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--color-neutral-medium);
}

.modal-rodape {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.rodape-texto {
  font-size: 0.78rem;
  color: var(--color-neutral-medium);
  text-align: center;
}

.btn-secundario {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  border: 1.5px solid var(--color-primary-medium);
  border-radius: 12px;
  color: var(--color-primary-medium);
  font-size: 0.88rem;
  font-weight: 700;
  font-family: inherit;
  background: transparent;
  cursor: pointer;
  transition: background 0.22s ease, color 0.22s ease, transform 0.22s ease;
}

.btn-secundario:hover:not(:disabled) {
  background: var(--color-primary-medium);
  color: white;
  transform: translateY(-2px);
}

.btn-secundario:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.16s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-card {
  animation: modal-pop 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes modal-pop {
  from {
    transform: translateY(14px) scale(0.98);
    opacity: 0;
  }

  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}
</style>