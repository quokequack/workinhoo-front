<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import RecoverSidebar from '@/components/recover/RecoverSidebar.vue'
import RecoverStepIndicator from '@/components/recover/RecoverStepIndicator.vue'
import VerifyCodeModal from '@/components/recover/VerifyCodeModal.vue'
import ResetSuccessModal from '@/components/recover/ResetSuccessModal.vue'

const stepAtual = ref(1)

const form = reactive({
  email: '',
  senha: '',
  confirmarSenha: ''
})

const enviado = ref(false)
const tocado = reactive({ email: false, senha: false, confirmarSenha: false })
const agitando = ref(false)
const senhaVisivel = ref(false)
const confirmarVisivel = ref(false)

const modalCodigoAberto = ref(false)
const modalSucessoAberto = ref(false)

const modalRef = ref<InstanceType<typeof VerifyCodeModal> | null>(null)

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
  (enviado.value || tocado.confirmarSenha) &&
  !!form.confirmarSenha &&
  form.senha !== form.confirmarSenha
)

function emailValido(email: string): boolean {
  return email.includes('@') && email.includes('.')
}

function validarEmail() {
  return !!form.email && emailValido(form.email)
}

function validarSenha() {
  return !!form.senha && senhaForte.value && !!form.confirmarSenha && !senhasErro.value
}

function agitar() {
  agitando.value = true
  setTimeout(() => (agitando.value = false), 500)
}

function resetarEstado() {
  enviado.value = false
  tocado.email = false
  tocado.senha = false
  tocado.confirmarSenha = false
}

function enviarCodigo() {
  enviado.value = true
  if (!validarEmail()) { agitar(); return }
  modalCodigoAberto.value = true
}

async function confirmarCodigo(codigo: string) {
  const ok = codigo === '123456'
  if (!ok) { modalRef.value?.toastErro(); return }
  modalRef.value?.toastSucesso()
  setTimeout(() => {
    modalCodigoAberto.value = false
    resetarEstado()
    stepAtual.value = 2
  }, 450)
}

function reenviarCodigo() {
  modalRef.value?.toastReenviado()
}

function redefinirSenha() {
  enviado.value = true
  if (!validarSenha()) { agitar(); return }
  modalSucessoAberto.value = true
}

function voltarStep1() {
  resetarEstado()
  stepAtual.value = 1
}

function irParaLogin() {
  window.location.href = '/entrar'
}
</script>

<template>
  <div class="recover-pagina">
    <RecoverSidebar />

    <main class="recover-main">
      <div class="mobile-banner">
        <div class="mobile-banner-topo">
          <router-link to="/entrar" class="btn-voltar-banner">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M5 12l7 7M5 12l7-7" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
            Voltar
          </router-link>
          <p class="mobile-login-banner">
            Não tem conta?
            <router-link to="/cadastrar" class="link-banner">Cadastrar</router-link>
          </p>
        </div>
        <div class="mobile-banner-conteudo">
          <span class="mobile-banner-logo">Workinhoo</span>
          <p class="mobile-banner-slogan">Vamos recuperar seu acesso 🔑</p>
        </div>
        <div class="mobile-banner-onda" />
      </div>

      <div class="recover-area">
        <RecoverStepIndicator :step-atual="stepAtual" />

        <div class="form-container">
          <Transition name="step" mode="out-in">

            <section v-if="stepAtual === 1" key="step1">
              <div class="form-cabecalho">
                <h1 class="form-titulo">Verifique seu email</h1>
                <p class="form-subtitulo">Informe seu email para receber o código de verificação.</p>
              </div>

              <form class="recover-form" :class="{ 'form-agitando': agitando }" @submit.prevent="enviarCodigo"
                novalidate>
                <div class="form-grupo">
                  <label class="form-rotulo">Email</label>
                  <input v-model="form.email" type="email" class="form-input" placeholder="joao123@gmail.com"
                    autocomplete="email" @blur="tocado.email = true" :class="{
                      'input-erro':
                        (enviado && !form.email) ||
                        ((enviado || tocado.email) && form.email && !emailValido(form.email))
                    }" />
                  <p v-if="enviado && !form.email" class="erro-texto">Campo obrigatório</p>
                  <p v-else-if="(enviado || tocado.email) && form.email && !emailValido(form.email)" class="erro-texto">
                    Email inválido
                  </p>
                </div>

                <div class="form-acoes">
                  <button type="submit" class="btn-primario btn-bloco">Enviar código</button>
                </div>
              </form>
            </section>

            <section v-else key="step2">
              <div class="form-cabecalho">
                <h1 class="form-titulo">Nova senha</h1>
                <p class="form-subtitulo">Crie uma nova senha para acessar sua conta.</p>
              </div>

              <form class="recover-form" :class="{ 'form-agitando': agitando }" @submit.prevent="redefinirSenha"
                novalidate>
                <div class="form-grupo">
                  <label class="form-rotulo">Senha</label>
                  <div class="input-senha">
                    <input v-model="form.senha" @blur="tocado.senha = true" :type="senhaVisivel ? 'text' : 'password'"
                      class="form-input" placeholder="••••••••" autocomplete="new-password"
                      :class="{ 'input-erro': (enviado && !form.senha) || (enviado && form.senha && !senhaForte) }" />
                    <button type="button" class="btn-olho" @click="senhaVisivel = !senhaVisivel"
                      :aria-label="senhaVisivel ? 'Ocultar senha' : 'Ver senha'">
                      <svg v-if="senhaVisivel" width="17" height="17" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" stroke-width="2"
                          stroke-linecap="round" />
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
                      :type="confirmarVisivel ? 'text' : 'password'" class="form-input" placeholder="••••••••"
                      autocomplete="new-password"
                      :class="{ 'input-erro': senhasErro || (enviado && !form.confirmarSenha) }" />
                    <button type="button" class="btn-olho" @click="confirmarVisivel = !confirmarVisivel"
                      :aria-label="confirmarVisivel ? 'Ocultar senha' : 'Ver senha'">
                      <svg v-if="confirmarVisivel" width="17" height="17" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" stroke-width="2"
                          stroke-linecap="round" />
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
                  <button type="submit" class="btn-primario btn-bloco">Redefinir senha</button>
                </div>

                <div class="divisor">
                  <span class="divisor-linha"></span>
                  <span class="divisor-texto">ou</span>
                  <span class="divisor-linha"></span>
                </div>

                <button type="button" class="btn-secundario btn-bloco" @click="voltarStep1">
                  Voltar
                </button>
              </form>
            </section>

          </Transition>
        </div>
      </div>
    </main>

    <VerifyCodeModal ref="modalRef" :aberto="modalCodigoAberto" :email="form.email" @fechar="modalCodigoAberto = false"
      @confirmar="confirmarCodigo" @reenviar="reenviarCodigo" />

    <ResetSuccessModal :aberto="modalSucessoAberto" @fechar="modalSucessoAberto = false" @irLogin="irParaLogin" />
  </div>
</template>

<style scoped>
.recover-pagina {
  display: flex;
  min-height: 100dvh;
}

.recover-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: var(--color-neutral-light-white);
  min-height: 100dvh;
  overflow-y: auto;
}

.mobile-banner {
  display: flex;
  flex-direction: column;
  background: var(--color-primary-medium);
  padding: 1.25rem 1.25rem 2.75rem;
  position: relative;
  overflow: hidden;
}

.mobile-banner::before {
  content: '';
  position: absolute;
  top: -50px;
  right: -40px;
  width: 170px;
  height: 170px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.06);
  pointer-events: none;
}

.mobile-banner::after {
  content: '';
  position: absolute;
  bottom: 10px;
  left: -35px;
  width: 130px;
  height: 130px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  pointer-events: none;
}

.mobile-banner-topo {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.35rem;
  position: relative;
  z-index: 1;
}

.btn-voltar-banner {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  border: 1.5px solid rgba(255, 255, 255, 0.5);
  color: white;
  padding: 0.28rem 0.8rem;
  border-radius: 8px;
  font-size: 0.76rem;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.2s ease;
}

.btn-voltar-banner:hover {
  background: rgba(255, 255, 255, 0.15);
}

.mobile-login-banner {
  font-size: 0.76rem;
  color: rgba(255, 255, 255, 0.72);
}

.link-banner {
  color: white;
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.mobile-banner-conteudo {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.mobile-banner-logo {
  font-size: 1.55rem;
  font-weight: 800;
  color: white;
  letter-spacing: -0.03em;
}

.mobile-banner-slogan {
  font-size: 0.82rem;
  color: rgba(255, 255, 255, 0.75);
  font-weight: 500;
  line-height: 1.4;
}

.mobile-banner-onda {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 32px;
  background: var(--color-neutral-light-white);
  clip-path: ellipse(55% 100% at 50% 100%);
}

@media (min-width: 768px) {
  .mobile-banner {
    display: none;
  }
}

.recover-area {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
}

:deep(.step-indicador) {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
}

.form-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 1.5rem 1.25rem 2rem;
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

.form-cabecalho {
  margin-bottom: 1.75rem;
}

.form-titulo {
  font-size: 1.55rem;
  font-weight: 700;
  color: var(--color-neutral-dark);
  line-height: 1.2;
  margin-bottom: 0.3rem;
}

.form-subtitulo {
  font-size: 0.88rem;
  color: var(--color-neutral-medium);
  line-height: 1.35;
}

.recover-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
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
  text-decoration: none;
  background: transparent;
  cursor: pointer;
  transition: background 0.22s ease, color 0.22s ease, transform 0.22s ease;
}

.btn-secundario:hover {
  background: var(--color-primary-medium);
  color: white;
  transform: translateY(-2px);
}

.step-enter-active,
.step-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.step-enter-from {
  opacity: 0;
  transform: translateX(14px);
}

.step-leave-to {
  opacity: 0;
  transform: translateX(-14px);
}

@media (min-width: 768px) {
  .form-container {
    padding: 2rem 5rem;
  }
}
</style>
