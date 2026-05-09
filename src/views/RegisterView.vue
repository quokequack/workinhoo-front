<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRouter, onBeforeRouteLeave } from 'vue-router'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import StepIndicator from '@/components/register/StepIndicator.vue'
import StepDadosPessoais from '@/components/register/StepDadosPessoais.vue'
import StepServicos from '@/components/register/StepServicos.vue'
import api from '@/services/api'

interface DadosPessoais {
  nome: string
  email: string
  senha: string
  confirmarSenha: string
  contato: string
  foto: File | null
}

interface Servicos {
  is_prestador: boolean
  prestador: {
    descricao: string
    instagram: string | null
    cidade_id: number | null
    atende_cidade_toda: boolean
    latitude: number | null
    longitude: number | null
    especialidades: Record<number, string[]>
    bairros: number[]
  } | null
}

const cidades = ref<{ value: number; label: string }[]>([])
const especialidades = ref<{ value: string; label: string }[]>([])
const carregandoInicial = ref(true)

const router = useRouter()
const carregando = ref(false)
const erroGlobal = ref<string | null>(null)

const CHAVE_FORM = 'cadastro_form'
const CHAVE_STEP = 'cadastro_step'
const CHAVE_FOTO = 'cadastro_foto_b64'

function carregarForm() {
  try {
    const salvo = sessionStorage.getItem(CHAVE_FORM)
    if (salvo) return JSON.parse(salvo)
  } catch { }
  return null
}

function carregarFotoB64(): string | null {
  return sessionStorage.getItem(CHAVE_FOTO)
}

async function salvarFoto(file: File | null) {
  if (!file) {
    sessionStorage.removeItem(CHAVE_FOTO)
    fotoB64Restaurada.value = null
    return
  }
  const reader = new FileReader()
  reader.onload = () => {
    try {
      const b64 = reader.result as string
      sessionStorage.setItem(CHAVE_FOTO, b64)
      fotoB64Restaurada.value = b64
    } catch { }
  }
  reader.readAsDataURL(file)
}

async function b64ToFile(b64: string): Promise<File> {
  const res = await fetch(b64)
  const blob = await res.blob()
  return new File([blob], 'foto-perfil.png', { type: blob.type })
}

const formRestaurado = ref(!!sessionStorage.getItem(CHAVE_FORM))
const fotoB64Restaurada = ref<string | null>(carregarFotoB64())

const formData = ref(
  carregarForm() ?? {
    dadosPessoais: {
      nome: '',
      email: '',
      senha: '',
      confirmarSenha: '',
      contato: '',
      foto: null
    } as DadosPessoais,
    servicos: {
      is_prestador: false,
      prestador: null
    } as Servicos
  }
)

const stepAtual = ref(Number(sessionStorage.getItem(CHAVE_STEP) ?? 1))

watch(
  formData,
  (dados) => {
    try {
      const paraSerializar = {
        ...dados,
        dadosPessoais: { ...dados.dadosPessoais, foto: null }
      }
      sessionStorage.setItem(CHAVE_FORM, JSON.stringify(paraSerializar))
    } catch { }
  },
  { deep: true, immediate: true }
)

watch(
  () => formData.value.dadosPessoais.foto,
  (foto) => {
    if (foto === null && fotoB64Restaurada.value) return
    salvarFoto(foto)
  }
)

watch(stepAtual, (v) => {
  sessionStorage.setItem(CHAVE_STEP, String(v))
}, { immediate: true })

function handleProximoDados(dados: DadosPessoais) {
  formData.value.dadosPessoais = dados
  stepAtual.value++
}

function limparSession() {
  sessionStorage.removeItem(CHAVE_FORM)
  sessionStorage.removeItem(CHAVE_STEP)
  sessionStorage.removeItem(CHAVE_FOTO)
}

async function handleCadastrar(servicos: Servicos) {
  formData.value.servicos = servicos
  carregando.value = true
  erroGlobal.value = null

  const { dadosPessoais } = formData.value

  if (!dadosPessoais.foto && fotoB64Restaurada.value) {
    dadosPessoais.foto = await b64ToFile(fotoB64Restaurada.value)
  }

  try {
    const formPayload = new FormData()

    formPayload.append('usuario[nome]', dadosPessoais.nome)
    formPayload.append('usuario[email]', dadosPessoais.email)
    formPayload.append('usuario[senha]', dadosPessoais.senha)
    formPayload.append('usuario[contato]', dadosPessoais.contato.replace(/\D/g, ''))
    formPayload.append('usuario[is_prestador]', servicos.is_prestador ? '1' : '0')

    if (dadosPessoais.foto) {
      formPayload.append('usuario[foto]', dadosPessoais.foto)
    }

    if (servicos.is_prestador && servicos.prestador) {
      const p = servicos.prestador
      formPayload.append('prestador[descricao]', p.descricao)
      formPayload.append('prestador[instagram]', p.instagram ?? '')
      formPayload.append('prestador[cidade_id]', String(p.cidade_id))
      formPayload.append('prestador[atende_cidade_toda]', p.atende_cidade_toda ? '1' : '0')
      if (p.latitude !== null) formPayload.append('prestador[latitude]', String(p.latitude))
      if (p.longitude !== null) formPayload.append('prestador[longitude]', String(p.longitude))
      formPayload.append(
        'prestador[especialidades_json]',
        JSON.stringify(p.especialidades)
      )
      p.bairros.forEach((b, i) => {
        formPayload.append(`prestador[bairros][${i}]`, String(b))
      })
    }

    await api.get('/sanctum/csrf-cookie')

    await api.post('api/signup', formPayload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })

    limparSession()

    router.push('/entrar')
  } catch (err: unknown) {
    const axiosErr = err as { response?: { data?: { message?: string } } }
    erroGlobal.value =
      axiosErr.response?.data?.message ?? 'Erro ao cadastrar. Tente novamente.'
  } finally {
    carregando.value = false
  }
}

function voltar() {
  if (stepAtual.value > 1) stepAtual.value--
}

onMounted(async () => {
  try {
    const [resCidades, resEspecialidades] = await Promise.all([
      api.get('api/cidades', { params: { uf: 'al' } }),
      api.get('api/especialidades'),
    ])
    cidades.value = resCidades.data.map((c: { id: number; nome: string }) => ({
      value: c.id,
      label: c.nome,
    }))
    especialidades.value = resEspecialidades.data.map((e: { id: number; nome: string }) => ({
      value: String(e.id),
      label: e.nome,
    }))
  } finally {
    carregandoInicial.value = false
  }
})

onBeforeRouteLeave(() => limparSession())
</script>

<template>
  <div class="cadastrar-pagina">
    <AppSidebar titulo="Crie sua conta e comece agora no <strong>Workinhoo</strong>" imagem="register-illustration.svg"
      imagem-alt="Ilustração de cadastro" btn-label="Início" btn-to="/" header-texto="Já possui conta?"
      link-label="Entrar" link-to="/entrar"
      :lista="['Encontre profissionais próximos', 'Divulgue seus serviços', 'Tudo de forma simples']" />

    <main class="cadastrar-main">
      <div class="mobile-banner">
        <div class="mobile-banner-topo">
          <router-link to="/" class="btn-inicio-banner">Início</router-link>
          <p class="mobile-entrar-banner">
            Já tem conta?
            <router-link to="/entrar" class="link-banner">Entrar</router-link>
          </p>
        </div>

        <div class="mobile-banner-conteudo">
          <span class="mobile-banner-logo">Workinhoo</span>
          <p class="mobile-banner-slogan">Crie sua conta gratuitamente ✨</p>
        </div>

        <div class="mobile-banner-onda" />
      </div>

      <StepIndicator :step-atual="stepAtual" />

      <div class="form-area">
        <Transition name="step" mode="out-in">
          <StepDadosPessoais v-if="stepAtual === 1" :dados="formData.dadosPessoais" :foto-b64="fotoB64Restaurada"
            :form-restaurado="formRestaurado" @proximo="handleProximoDados"
            @atualizar="(d) => formData.dadosPessoais = d" />
          <StepServicos v-else-if="stepAtual === 2" :dados="formData.servicos" :carregando="carregando"
            :erro="erroGlobal" :cidades-disponiveis="cidades" :especialidades-disponiveis="especialidades"
            @cadastrar="handleCadastrar" @voltar="voltar" @atualizar="(d) => formData.servicos = d" />
        </Transition>
      </div>
    </main>
  </div>
</template>

<style scoped>
.cadastrar-pagina {
  display: flex;
  min-height: 100dvh;
  background-color: var(--color-primary-medium);
}

.cadastrar-main {
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

.mobile-entrar-banner {
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

.form-area {
  flex: 1;
  padding: 1.25rem 1.25rem 2rem;
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
  .form-area {
    padding: 1.5rem 5rem 2.5rem;
  }

  .cadastrar-main {
    border-top-left-radius: 24px;
    border-bottom-left-radius: 24px;
  }
}
</style>
