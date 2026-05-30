<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue'
import type { Prestador } from '@/types/prestador'
import ModalSuccess from '@/components/layout/ModalSuccess.vue'

const props = withDefaults(defineProps<{
  aberto: boolean
  prestador: Prestador
  servicoInicial?: string
}>(), {
  servicoInicial: ''
})

const emit = defineEmits<{
  fechar: []
  enviado: []
}>()

const servicoSelecionado = ref('')
const bairroSelecionado = ref('')
const cidadeSelecionada = ref('')
const descricao = ref('')
const horarios = ref<string[]>([])
const arquivos = ref<File[]>([])

const fileInputRef = ref<HTMLInputElement | null>(null)

const servicoMenuOpen = ref(false)
const bairroMenuOpen = ref(false)
const cidadeMenuOpen = ref(false)

const todosServicos = computed(() =>
  props.prestador.especialidades.map((e) => e.nome)
)

const modalSucessoAberto = ref(false)

const bairrosDisponiveis = computed(() => props.prestador.area.bairros)
const cidadesDisponiveis = computed(() => [props.prestador.area.cidade])

const servicoLabel = computed(() => servicoSelecionado.value || 'Selecione o serviço')
const bairroLabel = computed(() => bairroSelecionado.value || 'Bairro')
const cidadeLabel = computed(() => cidadeSelecionada.value || 'Cidade')

function resetarEstado() {
  servicoSelecionado.value = ''
  bairroSelecionado.value = ''
  cidadeSelecionada.value = ''
  descricao.value = ''
  horarios.value = []
  arquivos.value = []
  closeDropdowns()

  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

watch(
  () => props.aberto,
  (aberto) => {
    if (aberto) {
      servicoSelecionado.value = props.servicoInicial
    } else {
      resetarEstado()
    }
  },
  { immediate: true }
)

function closeDropdowns() {
  servicoMenuOpen.value = false
  bairroMenuOpen.value = false
  cidadeMenuOpen.value = false
}

function toggleServicoMenu() {
  const next = !servicoMenuOpen.value
  closeDropdowns()
  servicoMenuOpen.value = next
}

function toggleBairroMenu() {
  const next = !bairroMenuOpen.value
  closeDropdowns()
  bairroMenuOpen.value = next
}

function toggleCidadeMenu() {
  const next = !cidadeMenuOpen.value
  closeDropdowns()
  cidadeMenuOpen.value = next
}

function selecionarServico(servico: string) {
  servicoSelecionado.value = servico
  servicoMenuOpen.value = false
}

function selecionarBairro(bairro: string) {
  bairroSelecionado.value = bairro
  bairroMenuOpen.value = false
}

function selecionarCidade(cidade: string) {
  cidadeSelecionada.value = cidade
  cidadeMenuOpen.value = false
}

function toggleHorario(h: string) {
  const idx = horarios.value.indexOf(h)
  if (idx >= 0) horarios.value.splice(idx, 1)
  else horarios.value.push(h)
}

function abrirSeletorArquivos() {
  closeDropdowns()
  fileInputRef.value?.click()
}

function onArquivos(e: Event) {
  const input = e.target as HTMLInputElement
  const novosArquivos = Array.from(input.files || [])

  if (!novosArquivos.length) return

  arquivos.value = [...arquivos.value, ...novosArquivos]

  nextTick(() => {
    if (fileInputRef.value) {
      fileInputRef.value.value = ''
    }
  })
}

function removerArquivo(i: number) {
  arquivos.value.splice(i, 1)
}

function resetarFormulario() {
  servicoSelecionado.value = ''
  bairroSelecionado.value = ''
  cidadeSelecionada.value = ''
  descricao.value = ''
  horarios.value = []
  arquivos.value = []
  closeDropdowns()
}

function abrirModalSucesso() {
  modalSucessoAberto.value = true
}

function fecharModalSucesso() {
  modalSucessoAberto.value = false
}

function enviar() {
  closeDropdowns()
  emit('fechar')
  emit('enviado')
  resetarFormulario()
  abrirModalSucesso()
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="aberto" class="modal-overlay">
        <div class="modal-card" role="dialog" aria-modal="true" aria-label="Solicitar orçamento"
          @click="closeDropdowns">
          <div class="modal-scroll">
            <button class="btn-fechar" type="button" aria-label="Fechar" @click="emit('fechar')">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"
                  stroke-linejoin="round" />
              </svg>
            </button>

            <h2 class="modal-titulo">Solicitar orçamento para</h2>

            <div class="prestador-info">
              <img class="prestador-avatar" :src="prestador.fotoPerfil" :alt="prestador.nome" width="80" height="80" />
              <div class="prestador-dados">
                <span class="prestador-nome">{{ prestador.nome }}</span>

                <div class="prestador-roles">
                  <template v-for="(role, i) in prestador.roles" :key="role">
                    <span>{{ role }}</span>
                    <span v-if="i < prestador.roles.length - 1" class="role-sep">|</span>
                  </template>
                </div>

                <div class="prestador-local">
                  {{ prestador.area.cidade }} – {{ prestador.area.estado }}
                </div>

                <div class="bairro-tags">
                  <span v-for="b in prestador.area.bairros" :key="b" class="bairro-tag">
                    {{ b }}
                  </span>
                </div>
              </div>
            </div>

            <div class="divider"></div>

            <div class="modal-body">
              <div class="form-row">
                <div class="form-group form-group--wide" :class="{ 'is-open': servicoMenuOpen }">
                  <label class="form-label">Serviço desejado</label>

                  <div class="sort-dropdown sort-dropdown--servico" :class="{ 'is-open': servicoMenuOpen }" @click.stop>
                    <button class="sort-select form-select-trigger" type="button" :aria-expanded="servicoMenuOpen"
                      aria-haspopup="menu" @click="toggleServicoMenu">
                      <span class="sort-select__label">{{ servicoLabel }}</span>
                      <svg class="sort-select__icon" :class="{ 'is-open': servicoMenuOpen }" width="12" height="12"
                        viewBox="0 0 12 12" fill="none">
                        <path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                          stroke-linejoin="round" />
                      </svg>
                    </button>

                    <transition name="servico-menu">
                      <div v-show="servicoMenuOpen" class="sort-menu form-sort-menu form-sort-menu--servico"
                        role="menu">
                        <button v-for="s in todosServicos" :key="s" class="sort-menu__item"
                          :class="{ active: servicoSelecionado === s }" type="button" role="menuitem"
                          @click="selecionarServico(s)">
                          <span>{{ s }}</span>
                          <span v-if="servicoSelecionado === s" class="sort-menu__check">•</span>
                        </button>
                      </div>
                    </transition>
                  </div>
                </div>

                <div class="form-group form-group--local">
                  <label class="form-label">Local do atendimento</label>

                  <div class="local-row">
                    <div class="sort-dropdown" :class="{ 'is-open': bairroMenuOpen }" @click.stop>
                      <button class="sort-select form-select-trigger" type="button" :aria-expanded="bairroMenuOpen"
                        aria-haspopup="menu" @click="toggleBairroMenu">
                        <span class="sort-select__label">{{ bairroLabel }}</span>
                        <svg class="sort-select__icon" :class="{ 'is-open': bairroMenuOpen }" width="12" height="12"
                          viewBox="0 0 12 12" fill="none">
                          <path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                            stroke-linejoin="round" />
                        </svg>
                      </button>

                      <transition name="sort-menu">
                        <div v-if="bairroMenuOpen" class="sort-menu form-sort-menu" role="menu">
                          <button v-for="b in bairrosDisponiveis" :key="b" class="sort-menu__item"
                            :class="{ active: bairroSelecionado === b }" type="button" role="menuitem"
                            @click="selecionarBairro(b)">
                            <span>{{ b }}</span>
                            <span v-if="bairroSelecionado === b" class="sort-menu__check">•</span>
                          </button>
                        </div>
                      </transition>
                    </div>

                    <div class="sort-dropdown" :class="{ 'is-open': cidadeMenuOpen }" @click.stop>
                      <button class="sort-select form-select-trigger" type="button" :aria-expanded="cidadeMenuOpen"
                        aria-haspopup="menu" @click="toggleCidadeMenu">
                        <span class="sort-select__label">{{ cidadeLabel }}</span>
                        <svg class="sort-select__icon" :class="{ 'is-open': cidadeMenuOpen }" width="12" height="12"
                          viewBox="0 0 12 12" fill="none">
                          <path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                            stroke-linejoin="round" />
                        </svg>
                      </button>

                      <transition name="sort-menu">
                        <div v-if="cidadeMenuOpen" class="sort-menu form-sort-menu" role="menu">
                          <button v-for="cidade in cidadesDisponiveis" :key="cidade" class="sort-menu__item"
                            :class="{ active: cidadeSelecionada === cidade }" type="button" role="menuitem"
                            @click="selecionarCidade(cidade)">
                            <span>{{ cidade }}</span>
                            <span v-if="cidadeSelecionada === cidade" class="sort-menu__check">•</span>
                          </button>
                        </div>
                      </transition>
                    </div>
                  </div>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">
                  Descrição do problema ou necessidade
                  <span class="rotulo-opcional">(opcional)</span>
                </label>

                <textarea v-model="descricao" class="form-textarea" maxlength="255"
                  placeholder="Descreva o que você precisa, o local do serviço e qualquer detalhe importante"
                  rows="4"></textarea>

                <div class="char-count" aria-live="polite">
                  {{ descricao.length }}/255
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Faixa de horário desejada</label>
                <div class="horario-chips">
                  <button v-for="h in ['Manhã', 'Tarde', 'Noite']" :key="h" type="button" class="horario-chip"
                    :class="{ active: horarios.includes(h) }" @click="toggleHorario(h)">
                    {{ h }}
                  </button>
                </div>
              </div>

              <div class="upload-area" @click.stop>
                <input ref="fileInputRef" id="file-input" type="file" multiple class="file-input-hidden"
                  @change="onArquivos" @click.stop />

                <div class="upload-label">
                  <img src="@/assets/icons/cloud.svg" alt="" aria-hidden="true" />

                  <span class="upload-hint">
                    Adicione fotos para ajudar o prestador a entender o serviço <span
                      class="rotulo-opcional">(opcional)</span>
                  </span>

                  <button type="button" class="upload-btn-label" @click.stop="abrirSeletorArquivos">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor"
                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    Adicionar arquivo
                  </button>
                </div>

                <div v-if="arquivos.length" class="file-list">
                  <div v-for="(f, i) in arquivos" :key="`${f.name}-${i}`" class="file-item">
                    <span class="file-name">{{ f.name }}</span>
                    <button type="button" class="file-remove" @click.stop="removerArquivo(i)">×</button>
                  </div>
                </div>
              </div>
            </div>

            <div class="divider"></div>

            <div class="modal-footer">
              <button class="btn btn-outline" type="button" @click="emit('fechar')">
                Cancelar
              </button>
              <button class="btn btn-primary" type="button"
                :disabled="servicoSelecionado == '' || bairroSelecionado == '' || cidadeSelecionada == '' || horarios.length == 0"
                @click="enviar">
                Enviar solicitação
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>

  <ModalSuccess :aberto="modalSucessoAberto" titulo="Solicitação enviada!"
    subtitulo="Seu pedido de orçamento foi enviado para o prestador. Aguarde o retorno com um orçamento."
    botaoTexto="Fechar" @fechar="fecharModalSucesso" />
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  padding: 1.25rem;
  box-sizing: border-box;
  overflow-x: hidden;
  overflow-y: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  background:
    radial-gradient(circle at top, rgba(113, 63, 255, 0.08), transparent 32%),
    rgba(17, 17, 17, 0.52);
  backdrop-filter: blur(0.375rem);
}

.modal-card {
  box-sizing: border-box;
  width: min(100%, 41.25rem);
  max-width: 41.25rem;
  overflow: hidden;
  background:
    linear-gradient(180deg,
      color-mix(in srgb, var(--color-neutral-light-white) 96%, white) 0%,
      var(--color-neutral-light-white) 100%);
  border-radius: 1.125rem;
  border: 0.0625rem solid var(--color-neutral-light-light);
  box-shadow:
    0 1.5rem 5rem rgba(0, 0, 0, 0.18),
    0 0.125rem 0.5rem rgba(22, 29, 39, 0.08);
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0;
  margin: auto;
  transform-origin: center;
}

.modal-scroll {
  position: relative;
  max-height: min(92dvh, 56rem);
  overflow-y: auto;
  overflow-x: hidden;
  padding: 1.75rem 2rem;
}

.modal-scroll::-webkit-scrollbar {
  display: none;
}

.modal-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    linear-gradient(135deg,
      color-mix(in srgb, var(--color-primary-lightest) 20%, transparent) 0%,
      transparent 42%,
      color-mix(in srgb, var(--color-primary-lightest) 10%, transparent) 100%);
  pointer-events: none;
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
  width: 2.375rem;
  height: 2.375rem;
  padding: 0;
  border-radius: 0.75rem;
  transition:
    color 0.2s ease,
    background 0.2s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease;
  z-index: 5;
}

.btn-fechar:hover {
  color: var(--color-neutral-dark);
  background: var(--color-neutral-light-light);
  transform: translateY(-0.0625rem) scale(1.03);
  box-shadow: 0 0.375rem 1rem rgba(22, 29, 39, 0.1);
}

.btn-fechar:active {
  transform: scale(0.96);
}

.modal-titulo {
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--color-neutral-dark);
  text-align: center;
  padding-bottom: 1.25rem;
  font-family: 'Poppins', sans-serif;
  animation: fade-up 0.45s ease both;
}

.divider {
  border-top: 0.0625rem solid var(--color-neutral-light-light);
  margin: 0 auto;
  width: 100%;
}

.prestador-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 0;
  animation: fade-up 0.45s ease both;
  animation-delay: 0.04s;
}

.prestador-avatar {
  width: 5rem;
  height: 5rem;
  border-radius: 9999rem;
  object-fit: cover;
  flex-shrink: 0;
  border: 0.1875rem solid var(--color-neutral-light-light);
  box-shadow:
    0 0.875rem 1.5rem rgba(22, 29, 39, 0.08),
    inset 0 0 0 0.0625rem rgba(255, 255, 255, 0.65);
}

.prestador-dados {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
}

.prestador-nome {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-primary-medium);
  font-family: 'Poppins', sans-serif;
}

.prestador-roles {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: var(--color-neutral-medium);
  font-family: 'Poppins', sans-serif;
  flex-wrap: wrap;
}

.role-sep {
  color: var(--color-neutral-lightest);
  font-size: 0.75rem;
}

.prestador-local {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--color-neutral-dark);
  margin-top: 0.125rem;
  font-family: 'Poppins', sans-serif;
}

.bairro-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin-top: 0.375rem;
}

.bairro-tag {
  padding: 0.1875rem 0.625rem;
  background: var(--color-secondary-lightest);
  color: var(--color-secondary-dark);
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease;
}

.bairro-tag:hover {
  transform: translateY(-0.0625rem);
  box-shadow: 0 0.375rem 0.875rem rgba(22, 29, 39, 0.06);
}

.modal-body {
  padding: 1.25rem 0;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  position: relative;
  overflow: visible;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 1rem;
  align-items: start;
  position: relative;
  z-index: 2;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  min-width: 0;
  animation: fade-up 0.45s ease both;
  position: relative;
}

.form-group:nth-child(3) {
  margin-top: -1.5rem;
}

.form-group:nth-child(1) {
  animation-delay: 0.08s;
}

.form-group:nth-child(2) {
  animation-delay: 0.12s;
}

.form-group--wide,
.form-group--local,
.local-row {
  position: relative;
}

.form-group--wide.is-open {
  z-index: 130;
}

.form-label {
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--color-neutral-dark);
  font-family: 'Poppins', sans-serif;
  letter-spacing: 0.01em;
}

.rotulo-opcional {
  font-weight: 400;
  color: var(--color-neutral-light-dark);
  margin-left: 0.25rem;
}

.local-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}

.form-textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 0.75rem 0.875rem;
  border-radius: 0.875rem;
  border: 0.0625rem solid var(--color-neutral-light-light);
  background: var(--color-neutral-light-white);
  color: var(--color-neutral-dark);
  font-size: 0.82rem;
  font-family: 'Poppins', sans-serif;
  resize: vertical;
  line-height: 1.55;
  min-height: 7rem;
  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease,
    background 0.18s ease,
    transform 0.18s ease;
  box-shadow: inset 0 0.0625rem 0 rgba(255, 255, 255, 0.7);
  position: relative;
  z-index: 1;
}

.form-textarea::placeholder {
  color: var(--color-neutral-lightest);
}

.form-textarea:hover {
  border-color: color-mix(in srgb, var(--color-primary-lightest) 70%, white);
}

.form-textarea:focus {
  outline: none;
  border-color: var(--color-primary-medium);
  background: color-mix(in srgb, var(--color-primary-lightest) 7%, white);
  box-shadow:
    0 0 0 0.25rem color-mix(in srgb, var(--color-primary-lightest) 28%, transparent),
    0 0.75rem 1.5rem rgba(22, 29, 39, 0.06);
  transform: translateY(-0.0625rem);
}

.char-count {
  align-self: flex-end;
  font-size: 0.75rem;
  color: var(--color-neutral-light-dark);
  margin-top: 0.125rem;
}

.horario-chips {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.horario-chip {
  padding: 0.4375rem 1.25rem;
  border-radius: 0.75rem;
  border: 0.09375rem solid var(--color-neutral-light-light);
  background: var(--color-neutral-light-white);
  color: var(--color-neutral-dark);
  font-size: 0.82rem;
  font-weight: 500;
  font-family: 'Poppins', sans-serif;
  cursor: pointer;
  transition:
    all 0.18s ease,
    transform 0.18s ease,
    box-shadow 0.18s ease;
  box-shadow: 0 0.1875rem 0.625rem rgba(22, 29, 39, 0.03);
}

.horario-chip:hover {
  transform: translateY(-0.0625rem);
  box-shadow: 0 0.5rem 1rem rgba(22, 29, 39, 0.06);
}

.horario-chip:active {
  transform: scale(0.98);
}

.horario-chip.active {
  border-color: var(--color-primary-dark);
  background: color-mix(in srgb, var(--color-primary-lightest) 30%, white);
  color: var(--color-primary-dark);
  font-weight: 600;
  box-shadow:
    0 0.625rem 1.25rem rgba(22, 29, 39, 0.08),
    inset 0 0 0 0.0625rem rgba(255, 255, 255, 0.65);
}

.upload-area {
  border: 0.09375rem dashed var(--color-neutral-light-medium);
  border-radius: 1rem;
  padding: 1.25rem 1.5rem 1.5rem;
  text-align: center;
  background:
    linear-gradient(180deg,
      color-mix(in srgb, var(--color-neutral-light-lightest, #fafafa) 95%, white) 0%,
      var(--color-neutral-light-lightest, #fafafa) 100%);
  transition:
    border-color 0.18s ease,
    background 0.18s ease,
    transform 0.18s ease,
    box-shadow 0.18s ease;
  animation: fade-up 0.45s ease both;
  animation-delay: 0.16s;
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: stretch;
}

.upload-area:hover {
  border-color: var(--color-primary-light);
  transform: translateY(-0.0625rem);
  box-shadow: 0 0.75rem 1.5rem rgba(22, 29, 39, 0.05);
}

.file-input-hidden {
  display: none;
}

.upload-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.625rem;
  cursor: default;
  color: var(--color-neutral-lightest);
}

.upload-label img {
  width: 2rem;
  height: 2rem;
  object-fit: contain;
  opacity: 0.85;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.upload-area:hover .upload-label img {
  transform: translateY(-0.0625rem) scale(1.03);
  opacity: 1;
}

.upload-hint {
  font-size: 0.8rem;
  color: var(--color-neutral-lightest);
  font-family: 'Poppins', sans-serif;
  max-width: 28rem;
  margin-inline: auto;
}

.upload-btn-label {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.4375rem 1rem;
  border-radius: 0.75rem;
  border: 0.09375rem solid var(--color-neutral-light-light);
  background: var(--color-neutral-light-white);
  color: var(--color-neutral-dark);
  font-size: 0.8rem;
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
  transition:
    all 0.18s ease,
    transform 0.18s ease,
    box-shadow 0.18s ease;
  cursor: pointer;
  box-shadow: 0 0.25rem 0.75rem rgba(22, 29, 39, 0.04);
}

.upload-btn-label:hover {
  border-color: var(--color-primary-medium);
  color: var(--color-primary-medium);
  transform: translateY(-0.0625rem);
  box-shadow: 0 0.75rem 1.5rem rgba(22, 29, 39, 0.08);
}

.upload-btn-label:active {
  transform: scale(0.98);
}

.file-list {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  margin-top: 0.25rem;
}

.file-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.375rem 0.625rem;
  border-radius: 0.625rem;
  background: var(--color-neutral-light-light);
  font-size: 0.78rem;
  color: var(--color-neutral-dark);
  font-family: 'Poppins', sans-serif;
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    background 0.18s ease;
}

.file-item:hover {
  transform: translateY(-0.0625rem);
  box-shadow: 0 0.5rem 1rem rgba(22, 29, 39, 0.06);
}

.file-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 90%;
}

.file-remove {
  background: none;
  border: none;
  font-size: 1.1rem;
  cursor: pointer;
  color: var(--color-neutral-light);
  line-height: 1;
  flex-shrink: 0;
  transition:
    color 0.18s ease,
    transform 0.18s ease;
}

.file-remove:hover {
  color: var(--color-neutral-dark);
  transform: scale(1.06);
}

.modal-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding-top: 1.25rem;
  margin-top: 0.25rem;
  position: relative;
  z-index: 1;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.6875rem 2rem;
  border-radius: 0.875rem;
  font-size: 0.88rem;
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
  cursor: pointer;
  transition:
    all 0.18s ease,
    transform 0.18s ease,
    box-shadow 0.18s ease,
    filter 0.18s ease;
  border: 0.125rem solid transparent;
  min-width: 10rem;
  position: relative;
  overflow: hidden;
}

.btn::after {
  content: '';
  position: absolute;
  inset: 0;
  background:
    linear-gradient(120deg,
      transparent 0%,
      rgba(255, 255, 255, 0.22) 35%,
      transparent 70%);
  transform: translateX(-120%);
  transition: transform 0.45s ease;
}

.btn:hover::after {
  transform: translateX(120%);
}

.btn:hover {
  transform: translateY(-0.0625rem);
}

.btn:active {
  transform: scale(0.985);
}

.btn-outline {
  background: transparent;
  border-color: var(--color-primary-darkest);
  color: var(--color-primary-darkest);
}

.btn-outline:hover {
  background: color-mix(in srgb, var(--color-primary-lightest) 20%, white);
  box-shadow: 0 0.75rem 1.5rem rgba(22, 29, 39, 0.08);
}

.btn-primary {
  background:
    linear-gradient(180deg,
      color-mix(in srgb, var(--color-primary-darkest) 90%, white) 0%,
      var(--color-primary-darkest) 100%);
  color: #ffffff;
  border-color: var(--color-primary-darkest);
  box-shadow: 0 0.875rem 1.5rem rgba(22, 29, 39, 0.14);
}

.btn-primary:hover {
  background:
    linear-gradient(180deg,
      color-mix(in srgb, var(--color-primary-dark) 90%, white) 0%,
      var(--color-primary-dark) 100%);
  border-color: var(--color-primary-dark);
  box-shadow: 0 1rem 2rem rgba(22, 29, 39, 0.18);
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(180deg,
      color-mix(in srgb, var(--color-primary-dark) 90%, white) 0%,
      var(--color-primary-dark) 100%);
  border-color: var(--color-primary-dark);
  box-shadow: 0 1rem 2rem rgba(22, 29, 39, 0.18);
}

.btn-primary:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  box-shadow: none;
}

.sort-dropdown {
  position: relative;
  z-index: 1;
  min-width: 0;
}

.sort-dropdown.is-open {
  z-index: 80;
}

.sort-dropdown--servico {
  min-width: 0;
  width: 100%;
}

.sort-select {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.form-select-trigger {
  width: 100%;
  min-height: 2.625rem;
  justify-content: space-between;
  padding: 0 0.875rem;
  border-radius: 0.875rem;
  background: var(--color-neutral-light-white);
  border: 0.0625rem solid var(--color-neutral-light-light);
  color: var(--color-neutral-dark);
  font-size: 0.82rem;
  font-weight: 500;
  font-family: 'Poppins', sans-serif;
  box-shadow: 0 0.0625rem 0.1875rem rgba(22, 29, 39, 0.06);
  cursor: pointer;
  transition:
    border-color 0.18s ease,
    background 0.18s ease,
    transform 0.18s ease,
    box-shadow 0.18s ease;
}

.form-select-trigger:hover {
  border-color: var(--color-primary-lightest);
  background: var(--color-neutral-light-lightest);
  transform: translateY(-0.0625rem);
  box-shadow: 0 0.75rem 1.5rem rgba(22, 29, 39, 0.06);
}

.sort-select__label {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sort-dropdown--servico .sort-select__label {
  max-width: 100%;
}

.sort-select__icon {
  flex-shrink: 0;
  transition: transform 0.18s ease;
}

.sort-select__icon.is-open {
  transform: rotate(180deg);
}

.sort-menu {
  position: absolute;
}

.form-sort-menu {
  top: calc(100% + 0.5rem);
  right: 0;
  left: 0;
  min-width: 100%;
  max-height: 13.75rem;
  overflow-y: auto;
  padding: 0.5rem;
  background: var(--color-neutral-light-white);
  border: 0.0625rem solid var(--color-neutral-light-light);
  border-radius: 0.875rem;
  box-shadow: 0 1.125rem 2.125rem rgba(22, 29, 39, 0.12);
  z-index: 120;
}

.form-sort-menu--servico {
  left: 0;
  right: 0;
  width: 100%;
  transform-origin: top center;
  will-change: opacity, transform;
  backface-visibility: hidden;
}

.sort-menu__item {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.625rem 0.75rem;
  border: 0;
  border-radius: 0.625rem;
  background: transparent;
  color: var(--color-neutral-dark);
  font-size: 0.82rem;
  font-weight: 500;
  font-family: 'Poppins', sans-serif;
  text-align: left;
  cursor: pointer;
  transition:
    background 0.18s ease,
    color 0.18s ease,
    transform 0.18s ease;
}

.sort-menu__item:hover {
  background: var(--color-neutral-light-lightest);
  transform: translateX(0.0625rem);
}

.sort-menu__item.active {
  background: color-mix(in srgb, var(--color-primary-lightest) 35%, white);
  color: var(--color-primary-dark);
  font-weight: 600;
}

.sort-menu__check {
  font-size: 1.125rem;
  line-height: 1;
  color: var(--color-primary-medium);
}

.sort-menu-enter-active,
.sort-menu-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
  transform-origin: top center;
}

.sort-menu-enter-from,
.sort-menu-leave-to {
  opacity: 0;
  transform: translateY(-0.375rem) scale(0.98);
}

.servico-menu-enter-active,
.servico-menu-leave-active {
  transition:
    opacity 0.16s ease,
    transform 0.16s ease;
}

.servico-menu-enter-from,
.servico-menu-leave-to {
  opacity: 0;
  transform: translateY(-0.25rem);
}

.servico-menu-enter-to,
.servico-menu-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.22s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-card {
  animation: modal-pop 0.32s cubic-bezier(0.22, 1, 0.36, 1);
}

.modal-leave-active .modal-card {
  animation: modal-out 0.2s ease forwards;
}

@keyframes modal-pop {
  0% {
    transform: translateY(1rem) scale(0.96);
    opacity: 0;
    filter: blur(0.25rem);
  }

  60% {
    transform: translateY(-0.125rem) scale(1.01);
    opacity: 1;
    filter: blur(0);
  }

  100% {
    transform: translateY(0) scale(1);
    opacity: 1;
    filter: blur(0);
  }
}

@keyframes modal-out {
  from {
    transform: translateY(0) scale(1);
    opacity: 1;
  }

  to {
    transform: translateY(0.75rem) scale(0.98);
    opacity: 0;
  }
}

@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(0.375rem);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 64rem) {
  .modal-card {
    max-width: 39rem;
  }
}

@media (max-width: 48rem) {
  .modal-overlay {
    padding: 1rem;
    align-items: flex-end;
  }

  .modal-card {
    width: 100%;
    max-width: 100%;
    border-radius: 1.25rem 1.25rem;
    overflow: hidden;
  }

  .modal-scroll {
    max-height: min(92dvh, 56rem);
    overflow-y: auto;
    overflow-x: hidden;
    padding: 1.5rem 1rem 1rem;
    border-radius: 1.25rem 1.25rem 0 0;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .prestador-info {
    align-items: center;
  }

  .modal-footer {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }

  .sort-dropdown--servico .form-sort-menu {
    top: calc(100% + 0.375rem);
    left: 0;
    right: 0;
    width: 100%;
    max-height: 11rem;
    overflow-y: auto;
  }

  .sort-dropdown--servico .sort-select__label {
    max-width: 100%;
  }
}

@media (max-width: 37.5rem) {
  .modal-scroll {
    padding: 4rem 1rem 1.25rem;
  }

  .prestador-info {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .prestador-dados {
    align-items: center;
  }

  .bairro-tags {
    justify-content: center;
  }

  .prestador-roles {
    justify-content: center;
  }

  .local-row {
    grid-template-columns: 1fr;
  }

  .upload-area {
    padding: 1rem;
  }

  .form-textarea {
    min-height: 6.5rem;
  }

  .sort-dropdown--servico {
    width: 100%;
  }

  .sort-dropdown--servico .form-sort-menu {
    max-height: 10rem;
    padding: 0.375rem;
    border-radius: 0.75rem;
  }

  .sort-dropdown--servico .sort-menu__item {
    padding: 0.625rem 0.6875rem;
  }
}

@media (max-width: 30rem) {
  .modal-overlay {
    padding: 0.75rem;
  }

  .modal-scroll {
    padding: 3.5rem 0.875rem 1rem;
  }

  .modal-titulo {
    font-size: 1.15rem;
    padding-bottom: 0;
  }

  .prestador-avatar {
    width: 4.5rem;
    height: 4.5rem;
  }

  .upload-hint {
    font-size: 0.75rem;
  }

  .horario-chip,
  .upload-btn-label,
  .bairro-tag,
  .sort-menu__item,
  .form-label,
  .form-select-trigger,
  .form-textarea,
  .char-count {
    font-size: 0.78rem;
  }
}

@media (prefers-reduced-motion: reduce) {

  .modal-card,
  .modal-scroll,
  .prestador-info,
  .form-group,
  .upload-area,
  .btn,
  .btn-fechar,
  .bairro-tag,
  .horario-chip,
  .upload-btn-label,
  .file-item,
  .file-remove,
  .form-select-trigger,
  .sort-menu__item,
  .form-textarea {
    animation: none !important;
    transition: none !important;
  }
}
</style>