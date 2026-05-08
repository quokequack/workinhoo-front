<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import AppSidebar from '@/components/shared/AppSidebar.vue'
import api from '@/services/api'

const router = useRouter()

const form = reactive({ email: '', senha: '' })
const senhaVisivel = ref(false)
const enviado = ref(false)
const agitando = ref(false)
const carregando = ref(false)
const erroServidor = ref('')

const emailValido = computed(() =>
  form.email.includes('@') && form.email.includes('.')
)

const emailErro = computed(() =>
  enviado.value && (!form.email || !emailValido.value)
)

function validar() {
  return emailValido.value && !!form.senha
}

async function handleEntrar() {
  enviado.value = true
  erroServidor.value = ''

  if (!validar()) {
    agitando.value = true
    setTimeout(() => (agitando.value = false), 500)
    return
  }

  carregando.value = true
  try {
    await api.get('/sanctum/csrf-cookie')

    await api.post('/api/auth/login', {
      credencial: form.email,
      senha: form.senha,
    })

    router.push('/')
  } catch (err: any) {
    const status = err.response?.status
    if (status === 422) {
      const mensagem = err.response?.data?.errors?.credencial?.[0]
      erroServidor.value = mensagem ?? 'Email ou senha incorretos.'
    } else if (status === 401) {
      erroServidor.value = 'Sessão expirada. Faça login novamente.'
    } else {
      erroServidor.value = 'Erro ao conectar com o servidor. Tente novamente.'
    }
    agitando.value = true
    setTimeout(() => (agitando.value = false), 500)
  } finally {
    carregando.value = false
  }
}
</script>

<template>
  <div class="entrar-pagina">
    <AppSidebar titulo="Acesse sua conta" subtitulo="Entre para continuar." imagem="login-illustration.svg"
      imagem-alt="Ilustração de login" btn-label="Início" btn-to="/" header-texto="Não tem conta?"
      link-label="Cadastrar" link-to="/cadastrar"
      :lista="['Encontre profissionais próximos', 'Divulgue seus serviços', 'Tudo de forma simples']" />

    <main class="entrar-main">
      <div class="mobile-banner">
        <div class="mobile-banner-topo">
          <router-link to="/" class="btn-inicio-banner">Início</router-link>
          <p class="mobile-cadastro-banner">
            Não tem conta?
            <router-link to="/cadastrar" class="link-banner">Cadastrar</router-link>
          </p>
        </div>
        <div class="mobile-banner-conteudo">
          <span class="mobile-banner-logo">Workinhoo</span>
          <p class="mobile-banner-slogan">Bem-vindo de volta 👋</p>
        </div>
        <div class="mobile-banner-onda" />
      </div>

      <div class="form-container">
        <div class="form-cabecalho">
          <h1 class="form-titulo">Acesse sua conta</h1>
        </div>

        <form @submit.prevent="handleEntrar" class="entrar-form" :class="{ 'form-agitando': agitando }" novalidate>
          <div class="form-grupo">
            <label class="form-rotulo">Email</label>
            <input v-model="form.email" type="email" class="form-input" :class="{ 'input-erro': emailErro }"
              placeholder="seu@email.com" autocomplete="email" />
            <p v-if="enviado && !form.email" class="erro-texto">Campo obrigatório</p>
            <p v-else-if="enviado && form.email && !emailValido" class="erro-texto">Email inválido</p>
          </div>

          <div class="form-grupo">
            <label class="form-rotulo">Senha</label>
            <div class="input-senha">
              <input v-model="form.senha" :type="senhaVisivel ? 'text' : 'password'" class="form-input"
                :class="{ 'input-erro': enviado && !form.senha }" placeholder="••••••••"
                autocomplete="current-password" />
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
          </div>

          <div class="esqueceu-wrapper">
            <router-link to="/recuperar-senha" class="link-esqueceu">Esqueceu sua senha?</router-link>
          </div>

          <Transition name="erro-servidor">
            <p v-if="erroServidor" class="erro-servidor-texto">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" />
                <path d="M12 8v4M12 16h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
              </svg>
              {{ erroServidor }}
            </p>
          </Transition>

          <div class="form-acoes">
            <button type="submit" class="btn-primario btn-bloco" :disabled="carregando">
              <span v-if="!carregando">Entrar</span>
              <span v-else class="btn-loading">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" class="spinner">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-dasharray="31.4 31.4"
                    stroke-linecap="round" />
                </svg>
              </span>
            </button>
          </div>

          <div class="divisor">
            <span class="divisor-linha"></span>
            <span class="divisor-texto">ou</span>
            <span class="divisor-linha"></span>
          </div>

          <router-link to="/cadastrar" class="btn-secundario btn-bloco">
            Criar conta
          </router-link>
        </form>
      </div>
    </main>
  </div>
</template>

<style scoped>
.entrar-pagina {
  display: flex;
  min-height: 100dvh;
  background-color: var(--color-primary-medium);
}

.entrar-main {
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

.btn-inicio-banner {
  border: 1.5px solid rgba(255, 255, 255, 0.5);
  color: white;
  padding: 0.28rem 0.8rem;
  border-radius: 8px;
  font-size: 0.76rem;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.2s ease;
}

.btn-inicio-banner:hover {
  background: rgba(255, 255, 255, 0.15);
}

.mobile-cadastro-banner {
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
}

.entrar-form {
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

.esqueceu-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: -0.25rem;
}

.link-esqueceu {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--color-primary-medium);
  text-decoration: none;
  transition: opacity 0.2s;
}

.link-esqueceu:hover {
  opacity: 0.75;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.erro-servidor-texto {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--color-error-dark);
  background: rgba(255, 97, 109, 0.08);
  border: 1px solid rgba(255, 97, 109, 0.25);
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
}

.erro-servidor-enter-active {
  transition: opacity 0.22s ease, transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.erro-servidor-leave-active {
  transition: opacity 0.15s ease;
}

.erro-servidor-enter-from {
  opacity: 0;
  transform: translateY(-6px);
}

.erro-servidor-leave-to {
  opacity: 0;
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

.btn-loading {
  display: flex;
  align-items: center;
  justify-content: center;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.spinner {
  animation: spin 0.8s linear infinite;
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
  transition: background 0.22s ease, color 0.22s ease, transform 0.22s ease;
}

.btn-secundario:hover {
  background: var(--color-primary-medium);
  color: white;
  transform: translateY(-2px);
}

@media (min-width: 768px) {
  .form-container {
    padding: 2rem 5rem;
  }

  .entrar-main {
    border-top-left-radius: 24px;
    border-bottom-left-radius: 24px;
  }
}
</style>
