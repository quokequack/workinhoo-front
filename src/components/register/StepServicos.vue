<script setup lang="ts">
import { reactive, ref, computed, nextTick, watch, onMounted } from 'vue'
import L, { Map, Marker } from 'leaflet'
import SelectCustom from '@/components/register/SelectCustom.vue'
import api from '@/services/api'

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

interface OpcaoSelect {
  value: string | number
  label: string
}

const props = defineProps<{
  dados: Servicos
  carregando: boolean
  erro?: string | null
  cidadesDisponiveis: { value: number; label: string }[]        
  especialidadesDisponiveis: { value: string; label: string }[] 
}>()
const emit = defineEmits<{
  cadastrar: [dados: Servicos]
  voltar: []
  atualizar: [dados: Servicos]  
}>()

const cacheBairros: Record<number, OpcaoSelect[]> = {}

const enviado = ref(false)
const agitando = ref(false)
const entrou = ref(false)

const isPrestador = ref(props.dados.is_prestador)

const especialidadesIds = ref<string[]>(
  Object.keys(props.dados.prestador?.especialidades ?? {})
)

const prestadorForm = reactive({
  descricao: props.dados.prestador?.descricao ?? '',
  instagram: props.dados.prestador?.instagram ?? '',
  cidade_id: props.dados.prestador?.cidade_id ?? null as number | null,
  atende_cidade_toda: props.dados.prestador?.atende_cidade_toda ?? true,
  latitude: props.dados.prestador?.latitude ?? null as number | null,
  longitude: props.dados.prestador?.longitude ?? null as number | null,
  bairros: [...(props.dados.prestador?.bairros ?? [])] as number[],
})

const opcoesCidades = computed(() => props.cidadesDisponiveis)
const opcoesEspecialidades = computed(() => props.especialidadesDisponiveis)
const carregandoCidades = computed(() => props.cidadesDisponiveis.length === 0)
const carregandoEspecialidades = computed(() => props.especialidadesDisponiveis.length === 0)
const opcoesBairros = ref<OpcaoSelect[]>([])
const carregandoBairros = ref(false)
let montado = false

const mapaRef = ref<HTMLDivElement | null>(null)
const mapaAberto = ref(false)
const localizacaoSalva = ref(
  prestadorForm.latitude !== null && prestadorForm.longitude !== null
)
let mapaInstance: Map | null = null
let marcador: Marker | null = null

async function carregarBairros(cidadeId: number, preservarBairros = false) {
  if (cacheBairros[cidadeId]) {
    opcoesBairros.value = cacheBairros[cidadeId]
    if (!preservarBairros) prestadorForm.bairros = []
    return
  }

  carregandoBairros.value = true
  if (!preservarBairros) prestadorForm.bairros = []
  try {
    const { data } = await api.get('api/bairros', { params: { cidade: cidadeId } })
    const opcoes = data.map((b: { id: number; nome: string }) => ({
      value: b.id,
      label: b.nome,
    }))
    cacheBairros[cidadeId] = opcoes 
    opcoesBairros.value = opcoes
  } catch {
    opcoesBairros.value = []
  } finally {
    carregandoBairros.value = false
  }
}

watch(() => prestadorForm.cidade_id, (id) => {
  if (!montado) return
  if (id !== null) carregarBairros(id)
  else opcoesBairros.value = []
})

watch(
  [isPrestador, prestadorForm, especialidadesIds],
  () => {
    const especialidades: Record<number, string[]> = {}
    especialidadesIds.value.forEach(id => {
      especialidades[Number(id)] = []
    })
    emit('atualizar', {
      is_prestador: isPrestador.value,
      prestador: isPrestador.value ? {
        ...prestadorForm,
        especialidades,
        bairros: prestadorForm.atende_cidade_toda ? [] : prestadorForm.bairros,
      } : null,
    })
  },
  { deep: true }
)

onMounted(() => {
  montado = true
  if (isPrestador.value && prestadorForm.cidade_id) {
    carregarBairros(prestadorForm.cidade_id, true)
  }
})

async function abrirMapa() {
  mapaAberto.value = true
  await nextTick()
  if (!mapaRef.value) return

  const L = (await import('leaflet')).default
  await import('leaflet/dist/leaflet.css')

  if (mapaInstance) return

  const lat = prestadorForm.latitude ?? -9.665
  const lng = prestadorForm.longitude ?? -35.735

  mapaInstance = L.map(mapaRef.value).setView([lat, lng], 13)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap',
    maxZoom: 19,
  }).addTo(mapaInstance)

  const icone = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  })

  if (prestadorForm.latitude !== null && prestadorForm.longitude !== null) {
    marcador = L.marker([prestadorForm.latitude, prestadorForm.longitude], { icon: icone, draggable: true }).addTo(mapaInstance)
    marcador.on('dragend', (e: unknown) => {
      // @ts-ignore
      const pos = e.target.getLatLng()
      prestadorForm.latitude = pos.lat
      prestadorForm.longitude = pos.lng
    })
  }

  mapaInstance.on('click', (e: unknown) => {
    // @ts-ignore
    const { lat, lng } = e.latlng
    prestadorForm.latitude = lat
    prestadorForm.longitude = lng
    if (marcador) {
      marcador.setLatLng([lat, lng])
    } else {
      // @ts-ignore
      marcador = L.marker([lat, lng], { icon: icone, draggable: true }).addTo(mapaInstance)
      marcador.on('dragend', (ev: unknown) => {
        // @ts-ignore
        const pos = ev.target.getLatLng()
        prestadorForm.latitude = pos.lat
        prestadorForm.longitude = pos.lng
      })
    }
  })
}

function usarLocalizacaoAtual() {
  if (!navigator.geolocation) return
  navigator.geolocation.getCurrentPosition((pos) => {
    prestadorForm.latitude = pos.coords.latitude
    prestadorForm.longitude = pos.coords.longitude
    if (mapaInstance && marcador) {
      marcador.setLatLng([pos.coords.latitude, pos.coords.longitude])
      mapaInstance.setView([pos.coords.latitude, pos.coords.longitude], 15)
    } else if (mapaInstance) {
      mapaInstance.setView([pos.coords.latitude, pos.coords.longitude], 15)
    }
  })
}

function confirmarLocalizacao() {
  localizacaoSalva.value = prestadorForm.latitude !== null && prestadorForm.longitude !== null
  fecharMapa()
}

function fecharMapa() {
  if (mapaInstance) {
    mapaInstance.remove()
    mapaInstance = null
    marcador = null
  }
  mapaAberto.value = false
}

function removerLocalizacao() {
  prestadorForm.latitude = null
  prestadorForm.longitude = null
  localizacaoSalva.value = false
  fecharMapa() 
}

const bairrosSelecionados = computed({
  get: () => prestadorForm.bairros.map(String),
  set: (v: string[]) => { prestadorForm.bairros = v.map(Number) },
})

const cidadeIdStr = computed({
  get: () => prestadorForm.cidade_id !== null ? String(prestadorForm.cidade_id) : '',
  set: (v: string) => { prestadorForm.cidade_id = v ? Number(v) : null },
})

function validar() {
  if (!isPrestador.value) return true
  return (
    especialidadesIds.value.length > 0 &&
    prestadorForm.cidade_id !== null &&
    prestadorForm.descricao.trim().length > 0 &&
    (prestadorForm.atende_cidade_toda || prestadorForm.bairros.length > 0)
  )
}

function onAnimacaoEntrar() {
  entrou.value = true
}

function handleCadastrar() {
  enviado.value = true
  if (!validar()) {
    agitando.value = true
    setTimeout(() => (agitando.value = false), 500)
    return
  }

  const especialidades: Record<number, string[]> = {}
  especialidadesIds.value.forEach(id => {
    especialidades[Number(id)] = []
  })

  const payload: Servicos = {
    is_prestador: isPrestador.value,
    prestador: isPrestador.value ? {
      descricao: prestadorForm.descricao.trim(),
      instagram: prestadorForm.instagram?.trim() || null,
      cidade_id: prestadorForm.cidade_id!,
      atende_cidade_toda: prestadorForm.atende_cidade_toda,
      latitude: prestadorForm.latitude,
      longitude: prestadorForm.longitude,
      especialidades,
      bairros: prestadorForm.atende_cidade_toda ? [] : prestadorForm.bairros,
    } : null,
  }
  emit('cadastrar', payload)
}
</script>

<template>
  <form @submit.prevent="handleCadastrar" class="step-form" :class="{
    'step-form-entrar': !entrou,
    'form-agitando': agitando
  }" @animationend="onAnimacaoEntrar" novalidate>

    <div class="pergunta-wrapper">
      <h3 class="pergunta-titulo">Você deseja oferecer serviços na plataforma?</h3>
      <div class="radio-grupo">
        <label class="radio-item">
          <input type="radio" :value="false" v-model="isPrestador" class="radio-input" />
          <span class="radio-circulo"></span>
          <span class="radio-texto">Não, apenas quero contratar</span>
        </label>
        <label class="radio-item">
          <input type="radio" :value="true" v-model="isPrestador" class="radio-input" />
          <span class="radio-circulo"></span>
          <span class="radio-texto">Sim, quero prestar serviços</span>
        </label>
      </div>
    </div>

    <Transition name="servicos-expandir">
      <div v-if="isPrestador" class="servicos-bloco">

        <div class="separador">
          <div class="separador-linha"></div>
          <div class="separador-icone">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
          </div>
          <div class="separador-linha"></div>
        </div>

        <h3 class="servicos-titulo">Informações profissionais</h3>

        <div class="form-grupo">
          <label class="form-rotulo">Especialidades</label>
          <SelectCustom v-model="especialidadesIds" :opcoes="opcoesEspecialidades"
            placeholder="Selecione suas especialidades" :multiplo="true" :carregando="carregandoEspecialidades"
            :class="{ 'select-erro': enviado && !especialidadesIds.length }" />
          <p v-if="enviado && !especialidadesIds.length" class="erro-texto">Selecione ao menos uma especialidade</p>
        </div>

        <div class="form-grupo">
          <label class="form-rotulo">Descrição profissional</label>
          <textarea v-model="prestadorForm.descricao" class="form-textarea"
            :class="{ 'input-erro': enviado && !prestadorForm.descricao.trim() }"
            placeholder="Descreva seus serviços, experiência e diferenciais" rows="4" />
          <p v-if="enviado && !prestadorForm.descricao.trim()" class="erro-texto">Campo obrigatório</p>
        </div>

        <div class="form-grupo">
          <label class="form-rotulo">
            Instagram
            <span class="rotulo-opcional">(opcional)</span>
          </label>
          <input v-model="prestadorForm.instagram" type="text" class="form-input" placeholder="@seuusuario"
            autocomplete="off" />
        </div>

        <div class="form-grupo">
          <label class="form-rotulo">Cidade</label>
          <SelectCustom v-model="cidadeIdStr" :opcoes="opcoesCidades" placeholder="Selecione sua cidade"
            :multiplo="false" :carregando="carregandoCidades"
            :class="{ 'select-erro': enviado && !prestadorForm.cidade_id }" />
          <p v-if="enviado && !prestadorForm.cidade_id" class="erro-texto">Selecione uma cidade</p>
        </div>

        <div class="form-grupo">
          <label class="form-rotulo">Área de atendimento</label>
          <div class="toggle-wrapper">
            <button type="button" class="toggle-btn" :class="{ 'toggle-ativo': prestadorForm.atende_cidade_toda }"
              @click="prestadorForm.atende_cidade_toda = true">
              Cidade toda
            </button>
            <button type="button" class="toggle-btn" :class="{ 'toggle-ativo': !prestadorForm.atende_cidade_toda }"
              @click="prestadorForm.atende_cidade_toda = false">
              Bairros específicos
            </button>
          </div>
        </div>

        <Transition name="servicos-expandir">
          <div v-if="!prestadorForm.atende_cidade_toda" class="form-grupo">
            <label class="form-rotulo">Bairros atendidos</label>
            <SelectCustom v-model="bairrosSelecionados" :opcoes="opcoesBairros" placeholder="Selecione os bairros"
              :multiplo="true" :carregando="carregandoBairros" :disabled="!prestadorForm.cidade_id"
              :class="{ 'select-erro': enviado && !prestadorForm.bairros.length }" />
            <p v-if="!prestadorForm.cidade_id" class="dica-texto">Selecione uma cidade primeiro</p>
            <p v-else-if="enviado && !prestadorForm.bairros.length" class="erro-texto">Selecione ao menos um bairro</p>
          </div>
        </Transition>

        <div class="form-grupo">
          <label class="form-rotulo">
            Localização
            <span class="rotulo-opcional">(opcional)</span>
          </label>

          <div v-if="localizacaoSalva" class="localizacao-salva">
            <div class="localizacao-salva-info">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round" />
                <circle cx="12" cy="10" r="3" stroke="currentColor" stroke-width="2" />
              </svg>
              <span>Localização salva</span>
              <span class="localizacao-coords">{{ prestadorForm.latitude?.toFixed(4) }}, {{
                prestadorForm.longitude?.toFixed(4) }}</span>
            </div>
            <div class="localizacao-acoes">
              <button type="button" class="btn-loc-acao" @click="abrirMapa">Editar</button>
              <button type="button" class="btn-loc-acao btn-loc-remover" @click="removerLocalizacao">Remover</button>
            </div>
          </div>

          <button v-else type="button" class="btn-mapa" @click="abrirMapa">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round" />
              <circle cx="12" cy="10" r="3" stroke="currentColor" stroke-width="2" />
            </svg>
            Adicionar localização no mapa
          </button>

          <Teleport to="body">
            <Transition name="modal">
              <div v-if="mapaAberto" class="mapa-overlay">
                <div class="mapa-card">
                  <div class="mapa-cabecalho">
                    <div>
                      <h3 class="mapa-titulo">Sua localização</h3>
                      <p class="mapa-subtitulo">Clique no mapa ou arraste o marcador para ajustar</p>
                    </div>
                    <button type="button" class="btn-fechar-mapa" @click="fecharMapa()" aria-label="Fechar">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"
                          stroke-linejoin="round" />
                      </svg>
                    </button>
                  </div>
                  <div ref="mapaRef" class="mapa-container"></div>
                  <div class="mapa-rodape">
                    <button type="button" class="btn-gps" @click="usarLocalizacaoAtual">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" />
                        <path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke="currentColor" stroke-width="2"
                          stroke-linecap="round" />
                      </svg>
                      Usar localização atual
                    </button>
                    <div class="mapa-rodape-acoes">
                      <button type="button" class="btn-secundario-sm" @click="fecharMapa()">Cancelar</button>
                      <button type="button" class="btn-primario-sm" @click="confirmarLocalizacao"
                        :disabled="prestadorForm.latitude === null">
                        Confirmar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Transition>
          </Teleport>
        </div>

      </div>
    </Transition>

    <div v-if="props.erro" class="erro-global">{{ props.erro }}</div>

    <div class="form-acoes">
      <button type="button" class="btn-secundario" @click="$emit('voltar')">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round" />
        </svg>
        Voltar
      </button>
      <button type="submit" class="btn-primario" :disabled="carregando">
        <svg v-if="carregando" class="spinner" width="16" height="16" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2.5" stroke-dasharray="31.4"
            stroke-dashoffset="10" stroke-linecap="round" />
        </svg>
        {{ carregando ? 'Cadastrando...' : 'Cadastrar' }}
      </button>
    </div>

  </form>
</template>

<style scoped>
.step-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
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

.pergunta-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.pergunta-titulo {
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-neutral-darkest);
  line-height: 1.4;
}

.radio-grupo {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.radio-item {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  cursor: pointer;
  padding: 0.2rem 0;
}

.radio-input {
  display: none;
}

.radio-circulo {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid var(--color-neutral-light-medium);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.22s ease;
  position: relative;
}

.radio-circulo::after {
  content: '';
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--color-primary-medium);
  opacity: 0;
  transform: scale(0);
  transition: opacity 0.22s ease, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.radio-input:checked+.radio-circulo {
  border-color: var(--color-primary-medium);
}

.radio-input:checked+.radio-circulo::after {
  opacity: 1;
  transform: scale(1);
}

.radio-item:hover .radio-circulo {
  border-color: var(--color-primary-light);
}

.radio-texto {
  font-size: 0.85rem;
  color: var(--color-neutral-dark);
  font-weight: 500;
  transition: color 0.2s ease;
}

.radio-input:checked~.radio-texto {
  color: var(--color-neutral-darkest);
  font-weight: 600;
}

.servicos-bloco {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.separador {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.separador-linha {
  flex: 1;
  height: 1px;
  background: var(--color-neutral-light-light);
}

.separador-icone {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1.5px solid var(--color-neutral-light-medium);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-neutral-light-dark);
  flex-shrink: 0;
}

.servicos-titulo {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-neutral-darkest);
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

.rotulo-opcional {
  font-weight: 400;
  color: var(--color-neutral-light-dark);
  margin-left: 0.25rem;
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

.form-textarea {
  width: 100%;
  padding: 0.6rem 0.75rem;
  border: 1.5px solid var(--color-neutral-light-medium);
  border-radius: 10px;
  font-size: 0.82rem;
  font-family: inherit;
  color: var(--color-neutral-dark);
  background: var(--color-neutral-light-white);
  resize: vertical;
  min-height: 90px;
  transition: border-color 0.22s ease, box-shadow 0.22s ease;
  outline: none;
  line-height: 1.55;
}

.form-textarea::placeholder {
  color: var(--color-neutral-light-dark);
}

.form-textarea:focus {
  border-color: var(--color-primary-medium);
  box-shadow: 0 0 0 3px rgba(62, 58, 168, 0.13);
}

.input-erro {
  border-color: var(--color-error-medium) !important;
  box-shadow: 0 0 0 3px rgba(255, 97, 109, 0.12) !important;
}

.select-erro :deep(.select-gatilho) {
  border-color: var(--color-error-medium) !important;
  box-shadow: 0 0 0 3px rgba(255, 97, 109, 0.12) !important;
}

.erro-texto {
  font-size: 0.72rem;
  color: var(--color-error-dark);
  font-weight: 500;
}

.dica-texto {
  font-size: 0.72rem;
  color: var(--color-neutral-light-dark);
  font-weight: 500;
}

.toggle-wrapper {
  display: flex;
  border: 1.5px solid var(--color-neutral-light-medium);
  border-radius: 10px;
  overflow: hidden;
}

.toggle-btn {
  flex: 1;
  height: 38px;
  font-size: 0.8rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  border: none;
  background: var(--color-neutral-light-white);
  color: var(--color-neutral-light-dark);
  transition: background 0.2s ease, color 0.2s ease;
}

.toggle-btn+.toggle-btn {
  border-left: 1.5px solid var(--color-neutral-light-medium);
}

.toggle-ativo {
  background: var(--color-primary-medium);
  color: white;
}

.btn-mapa {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  height: 40px;
  padding: 0 0.9rem;
  border: 1.5px dashed var(--color-neutral-light-medium);
  border-radius: 10px;
  font-size: 0.82rem;
  font-weight: 600;
  font-family: inherit;
  color: var(--color-neutral-medium);
  background: transparent;
  cursor: pointer;
  transition: border-color 0.2s ease, color 0.2s ease;
  width: fit-content;
}

.btn-mapa:hover {
  border-color: var(--color-primary-medium);
  color: var(--color-primary-medium);
}

.localizacao-salva {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.55rem 0.75rem;
  border: 1.5px solid var(--color-neutral-light-light);
  border-radius: 10px;
  background: var(--color-neutral-light-lightest);
  gap: 0.5rem;
}

.localizacao-salva-info {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-neutral-dark);
}

.localizacao-coords {
  font-weight: 400;
  color: var(--color-neutral-medium);
  font-size: 0.72rem;
}

.localizacao-acoes {
  display: flex;
  gap: 0.5rem;
}

.btn-loc-acao {
  font-size: 0.72rem;
  font-weight: 600;
  font-family: inherit;
  color: var(--color-primary-medium);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.2rem 0.4rem;
  border-radius: 6px;
  transition: background 0.2s ease;
}

.btn-loc-acao:hover {
  background: rgba(62, 58, 168, 0.08);
}

.btn-loc-remover {
  color: var(--color-error-dark);
}

.btn-loc-remover:hover {
  background: rgba(255, 97, 109, 0.08);
}

.mapa-overlay {
  position: fixed;
  inset: 0;
  background: rgba(17, 17, 17, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 100;
}

.mapa-card {
  width: 100%;
  max-width: 580px;
  background: var(--color-neutral-light-white);
  border-radius: 18px;
  border: 1px solid var(--color-neutral-light-light);
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.18);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.mapa-cabecalho {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 1.25rem 1.25rem 1rem;
  gap: 0.5rem;
}

.mapa-titulo {
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-neutral-darkest);
  line-height: 1.2;
}

.mapa-subtitulo {
  font-size: 0.76rem;
  color: var(--color-neutral-medium);
  margin-top: 0.2rem;
}

.btn-fechar-mapa {
  border: none;
  background: transparent;
  cursor: pointer;
  color: var(--color-neutral-medium);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.3rem;
  border-radius: 6px;
  flex-shrink: 0;
  transition: color 0.2s ease, background 0.2s ease;
}

.btn-fechar-mapa:hover {
  color: var(--color-neutral-dark);
  background: var(--color-neutral-light-light);
}

.mapa-container {
  width: 100%;
  height: 320px;
}

.mapa-rodape {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.85rem 1.25rem;
  border-top: 1px solid var(--color-neutral-light-light);
  gap: 0.5rem;
  flex-wrap: wrap;
}

.btn-gps {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.76rem;
  font-weight: 600;
  font-family: inherit;
  color: var(--color-primary-medium);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.3rem 0.5rem;
  border-radius: 8px;
  transition: background 0.2s ease;
}

.btn-gps:hover {
  background: rgba(62, 58, 168, 0.07);
}

.mapa-rodape-acoes {
  display: flex;
  gap: 0.5rem;
}

.btn-primario-sm,
.btn-secundario-sm {
  height: 36px;
  padding: 0 1rem;
  border-radius: 9px;
  font-size: 0.8rem;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.btn-primario-sm {
  background: var(--color-primary-medium);
  color: white;
  border: none;
}

.btn-primario-sm:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(62, 58, 168, 0.35);
}

.btn-primario-sm:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.btn-secundario-sm {
  background: transparent;
  color: var(--color-neutral-dark);
  border: 1.5px solid var(--color-neutral-light-medium);
}

.btn-secundario-sm:hover {
  background: var(--color-neutral-light-light);
}

.erro-global {
  padding: 0.65rem 0.9rem;
  background: rgba(255, 97, 109, 0.08);
  border: 1.5px solid var(--color-error-medium);
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--color-error-dark);
}

.form-acoes {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.25rem;
}

.btn-primario,
.btn-secundario {
  flex: 1;
  height: 44px;
  border-radius: 12px;
  font-size: 0.88rem;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.25s ease;
  position: relative;
  overflow: hidden;
}

.btn-primario {
  background: var(--color-primary-medium);
  color: white;
  border: none;
}

.btn-primario::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, transparent 55%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.btn-primario:hover:not(:disabled) {
  transform: translateY(-3px) scale(1.01);
  box-shadow: 0 12px 32px rgba(62, 58, 168, 0.42);
}

.btn-primario:hover:not(:disabled)::after {
  opacity: 1;
}

.btn-primario:active {
  transform: translateY(0) scale(0.98);
  box-shadow: none;
}

.btn-primario:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-secundario {
  background: transparent;
  color: var(--color-primary-medium);
  border: 1.5px solid var(--color-primary-medium);
}

.btn-secundario:hover {
  background: rgba(62, 58, 168, 0.05);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(62, 58, 168, 0.15);
}

.btn-secundario:active {
  transform: translateY(0) scale(0.98);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.spinner {
  animation: spin 0.8s linear infinite;
}

.servicos-expandir-enter-active {
  transition: opacity 0.3s ease, transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.servicos-expandir-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.servicos-expandir-enter-from {
  opacity: 0;
  transform: translateY(-12px);
}

.servicos-expandir-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.16s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .mapa-card {
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

@media (min-width: 768px) {
  .step-form {
    gap: 1.1rem;
  }

  .mapa-container {
    height: 380px;
  }
}
</style>
