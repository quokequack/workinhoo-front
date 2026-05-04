<script setup lang="ts">
import { reactive, ref, computed, nextTick } from 'vue'

interface DadosPessoais { nome: string; cpf: string; telefone: string; email: string; senha: string; confirmarSenha: string }

const props = defineProps<{ dados: DadosPessoais }>()
const emit = defineEmits<{ proximo: [dados: DadosPessoais] }>()

const form = reactive({ ...props.dados })
const senhaVisivel = ref(false)
const confirmarVisivel = ref(false)
const enviado = ref(false)
const agitando = ref(false)
const tocado = reactive({ cpf: false, telefone: false, email: false, confirmarSenha: false, senha: false })
const entrou = ref(false)

const requisitos = computed(() => ({
  maiuscula: /[A-Z]/.test(form.senha),
  minuscula: /[a-z]/.test(form.senha),
  numero: /[0-9]/.test(form.senha),
  especial: /[^A-Za-z0-9]/.test(form.senha),
  tamanho: form.senha.length >= 8,
}))

const senhaForte = computed(() => Object.values(requisitos.value).every(Boolean))

const mostrarRequisitos = computed(() =>
  (tocado.senha || enviado.value) && !!form.senha && !senhaForte.value
)

const senhasErro = computed(() =>
  (enviado.value || tocado.confirmarSenha) && !!form.confirmarSenha && form.senha !== form.confirmarSenha
)

function onAnimacaoEntrar() {
  entrou.value = true
}

function validar() {
  return (
    form.nome &&
    cpfValido(form.cpf) &&
    telefoneValido(form.telefone) &&
    form.email &&
    emailValido(form.email) &&
    form.senha &&
    senhaForte.value &&
    form.confirmarSenha &&
    form.senha === form.confirmarSenha
  )
}

function handleProximo() {
  enviado.value = true
  if (!validar()) {
    agitando.value = true
    setTimeout(() => (agitando.value = false), 500)
    return
  }
  emit('proximo', { ...form })
}

function aplicarMascara(
  input: HTMLInputElement,
  formatar: (digits: string) => string,
  setter: (v: string) => void
) {
  const cursorAntes = input.selectionStart ?? 0
  const digitosAntes = input.value.slice(0, cursorAntes).replace(/\D/g, '').length

  const digits = input.value.replace(/\D/g, '')
  const formatado = formatar(digits)
  setter(formatado)

  nextTick(() => {
    let digitosContados = 0
    let novoCursor = 0
    for (let i = 0; i < formatado.length; i++) {
      const char = formatado[i] ?? ''
      if (/\d/.test(char)) digitosContados++
      if (digitosContados === digitosAntes) { novoCursor = i + 1; break }
      novoCursor = i + 1
    }
    input.setSelectionRange(novoCursor, novoCursor)
  })
}

function formatarCpf(digits: string): string {
  const d = digits.slice(0, 11)
  if (d.length > 9) return d.replace(/^(\d{3})(\d{3})(\d{3})(\d{1,2})$/, '$1.$2.$3-$4')
  if (d.length > 6) return d.replace(/^(\d{3})(\d{3})(\d+)$/, '$1.$2.$3')
  if (d.length > 3) return d.replace(/^(\d{3})(\d+)$/, '$1.$2')
  return d
}

function formatarTelefone(digits: string): string {
  const d = digits.slice(0, 11)
  if (d.length > 7) return d.replace(/^(\d{2})(\d{5})(\d{1,4})$/, '($1) $2-$3')
  if (d.length > 2) return d.replace(/^(\d{2})(\d+)$/, '($1) $2')
  return d
}

function mascaraCpf(e: Event) {
  aplicarMascara(e.target as HTMLInputElement, formatarCpf, v => { form.cpf = v })
}

function mascaraTelefone(e: Event) {
  aplicarMascara(e.target as HTMLInputElement, formatarTelefone, v => { form.telefone = v })
}

function emailValido(email: string): boolean {
  return email.includes('@') && email.includes('.')
}

function cpfValido(cpf: string): boolean {
  return cpf.replace(/\D/g, '').length === 11
}

function telefoneValido(tel: string): boolean {
  const d = tel.replace(/\D/g, '')
  return d.length === 10 || d.length === 11
}
</script>

<template>
  <form @submit.prevent="handleProximo" class="step-form" :class="{
    'step-form-entrar': !entrou,
    'form-agitando': agitando
  }" @animationend="onAnimacaoEntrar" novalidate>

    <div class="form-grupo">
      <label class="form-rotulo">Nome completo</label>
      <input v-model="form.nome" type="text" class="form-input" :class="{ 'input-erro': enviado && !form.nome }"
        placeholder="João da Silva" autocomplete="name" />
      <p v-if="enviado && !form.nome" class="erro-texto">Campo obrigatório</p>
    </div>

    <div class="form-grupo">
      <label class="form-rotulo">CPF</label>
      <input :value="form.cpf" @input="mascaraCpf" @blur="tocado.cpf = true"
        @keypress="(e) => !/\d/.test(e.key) && e.preventDefault()" type="text" class="form-input"
        :class="{ 'input-erro': (enviado && !form.cpf) || (tocado.cpf && form.cpf && !cpfValido(form.cpf)) }"
        placeholder="000.000.000-00" inputmode="numeric" maxlength="14" />
      <p v-if="enviado && !form.cpf" class="erro-texto">Campo obrigatório</p>
      <p v-else-if="tocado.cpf && form.cpf && !cpfValido(form.cpf)" class="erro-texto">CPF inválido</p>
    </div>

    <div class="form-grupo">
      <label class="form-rotulo">Telefone</label>
      <input :value="form.telefone" @input="mascaraTelefone" @blur="tocado.telefone = true"
        @keypress="(e) => !/\d/.test(e.key) && e.preventDefault()" type="tel" class="form-input"
        :class="{ 'input-erro': (enviado && !form.telefone) || (tocado.telefone && form.telefone && !telefoneValido(form.telefone)) }"
        placeholder="(00) 00000-0000" autocomplete="tel" maxlength="15" />
      <p v-if="enviado && !form.telefone" class="erro-texto">Campo obrigatório</p>
      <p v-else-if="tocado.telefone && form.telefone && !telefoneValido(form.telefone)" class="erro-texto">Telefone
        inválido</p>
    </div>

    <div class="form-grupo">
      <label class="form-rotulo">Email</label>
      <input v-model="form.email" @blur="tocado.email = true" type="email" class="form-input"
        :class="{ 'input-erro': (enviado && !form.email) || (tocado.email && form.email && !emailValido(form.email)) }"
        placeholder="seu@email.com" autocomplete="email" />
      <p v-if="enviado && !form.email" class="erro-texto">Campo obrigatório</p>
      <p v-else-if="tocado.email && form.email && !emailValido(form.email)" class="erro-texto">Email inválido</p>
    </div>

    <div class="form-grupo">
      <label class="form-rotulo">Senha</label>
      <div class="input-senha">
        <input v-model="form.senha" @blur="tocado.senha = true" :type="senhaVisivel ? 'text' : 'password'"
          class="form-input"
          :class="{ 'input-erro': (enviado && !form.senha) || (enviado && form.senha && !senhaForte) }"
          placeholder="••••••••" autocomplete="new-password" />
        <button type="button" class="btn-olho" @click="senhaVisivel = !senhaVisivel"
          :aria-label="senhaVisivel ? 'Ocultar senha' : 'Ver senha'">
          <svg v-if="senhaVisivel" width="17" height="17" viewBox="0 0 24 24" fill="none">
            <path
              d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          </svg>
          <svg v-else width="17" height="17" viewBox="0 0 24 24" fill="none">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round" />
            <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" />
          </svg>
        </button>
      </div>
      <p v-if="enviado && !form.senha" class="erro-texto">Campo obrigatório</p>

      <Transition name="requisitos">
        <div v-if="mostrarRequisitos" class="requisitos-wrapper">
          <div class="requisito" :class="{ 'requisito-ok': requisitos.tamanho }">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
              <path v-if="requisitos.tamanho" d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2.5"
                stroke-linecap="round" stroke-linejoin="round" />
              <circle v-else cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2" />
            </svg>
            Mínimo 8 caracteres
          </div>
          <div class="requisito" :class="{ 'requisito-ok': requisitos.maiuscula }">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
              <path v-if="requisitos.maiuscula" d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2.5"
                stroke-linecap="round" stroke-linejoin="round" />
              <circle v-else cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2" />
            </svg>
            Uma letra maiúscula
          </div>
          <div class="requisito" :class="{ 'requisito-ok': requisitos.minuscula }">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
              <path v-if="requisitos.minuscula" d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2.5"
                stroke-linecap="round" stroke-linejoin="round" />
              <circle v-else cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2" />
            </svg>
            Uma letra minúscula
          </div>
          <div class="requisito" :class="{ 'requisito-ok': requisitos.numero }">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
              <path v-if="requisitos.numero" d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2.5"
                stroke-linecap="round" stroke-linejoin="round" />
              <circle v-else cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2" />
            </svg>
            Um número
          </div>
          <div class="requisito" :class="{ 'requisito-ok': requisitos.especial }">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
              <path v-if="requisitos.especial" d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2.5"
                stroke-linecap="round" stroke-linejoin="round" />
              <circle v-else cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2" />
            </svg>
            Um caractere especial (!@#$...)
          </div>
        </div>
      </Transition>
    </div>

    <div class="form-grupo">
      <label class="form-rotulo">Confirmar senha</label>
      <div class="input-senha">
        <input v-model="form.confirmarSenha" @blur="tocado.confirmarSenha = true"
          :type="confirmarVisivel ? 'text' : 'password'" class="form-input"
          :class="{ 'input-erro': senhasErro || (enviado && !form.confirmarSenha) }" placeholder="••••••••"
          autocomplete="new-password" />
        <button type="button" class="btn-olho" @click="confirmarVisivel = !confirmarVisivel"
          :aria-label="confirmarVisivel ? 'Ocultar senha' : 'Ver senha'">
          <svg v-if="confirmarVisivel" width="17" height="17" viewBox="0 0 24 24" fill="none">
            <path
              d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          </svg>
          <svg v-else width="17" height="17" viewBox="0 0 24 24" fill="none">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round" />
            <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" />
          </svg>
        </button>
      </div>
      <p v-if="senhasErro" class="erro-texto">As senhas não coincidem</p>
      <p v-else-if="enviado && !form.confirmarSenha" class="erro-texto">Campo obrigatório</p>
    </div>

    <div class="form-acoes">
      <button type="submit" class="btn-primario btn-bloco">Próximo</button>
    </div>
  </form>
</template>

<style scoped>
.step-form {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.step-form-entrar {
  animation: form-entrar 0.3s ease;
}

@keyframes form-entrar {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes agitar {

  0%,
  100% {
    transform: translateX(0);
  }

  20% {
    transform: translateX(-6px);
  }

  40% {
    transform: translateX(6px);
  }

  60% {
    transform: translateX(-4px);
  }

  80% {
    transform: translateX(4px);
  }
}

.form-agitando {
  animation: agitar 0.45s cubic-bezier(0.36, 0.07, 0.19, 0.97);
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
}

.form-input::placeholder {
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

.requisitos-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.28rem;
  padding: 0.55rem 0.65rem;
  background: var(--color-neutral-light-lightest);
  border: 1px solid var(--color-neutral-light-light);
  border-radius: 8px;
  margin-top: 0.1rem;
}

.requisito {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.72rem;
  font-weight: 500;
  color: var(--color-error-dark);
  transition: color 0.22s ease;
}

.requisito svg {
  flex-shrink: 0;
  transition: color 0.22s ease;
}

.requisito-ok {
  color: var(--color-neutral-light-dark);
}

.requisitos-enter-active {
  transition: opacity 0.22s ease, transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.requisitos-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.requisitos-enter-from {
  opacity: 0;
  transform: translateY(-6px);
}

.requisitos-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.input-senha {
  position: relative;
  display: flex;
  align-items: center;
}

.input-senha .form-input {
  padding-right: 2.5rem;
}

.btn-olho {
  position: absolute;
  right: 0.7rem;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-neutral-light-dark);
  display: flex;
  align-items: center;
  padding: 0.25rem;
  transition: color 0.2s ease, transform 0.2s ease;
}

.btn-olho:hover {
  color: var(--color-primary-medium);
  transform: scale(1.15);
}

.form-acoes {
  margin-top: 0.5rem;
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

.btn-primario:hover {
  transform: translateY(-3px) scale(1.01);
  box-shadow: 0 12px 32px rgba(62, 58, 168, 0.42);
}

.btn-primario:hover::after {
  opacity: 1;
}

.btn-primario:active {
  transform: translateY(0) scale(0.98);
  box-shadow: none;
}

.btn-bloco {
  width: 100%;
}

@media (min-width: 768px) {
  .step-form {
    gap: 1rem;
  }
}
</style>