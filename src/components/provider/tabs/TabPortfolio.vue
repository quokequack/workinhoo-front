<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Prestador, PortfolioItem } from '@/types/prestador'
import PortfolioImageModal from '@/components/provider/modals/ModalPortfolioImage.vue'
import ModalSolicitarOrcamento from '@/components/provider/modals/ModalSolicitarOrcamento.vue'
import checkPurple from '@/assets/icons/check-purple.svg'

const CHECK_PURPLE = checkPurple

const props = defineProps<{
  prestador: Prestador
}>()

const filtroAtivo = ref<string>('todos')
const modalAberto = ref(false)
const itemSelecionado = ref<PortfolioItem | null>(null)
const modalOrcamentoAberto = ref(false)

const todosServicos = computed<string[]>(() => {
  const set = new Set<string>()

  props.prestador.portfolio.forEach((item) => {
    item.categorias.forEach((categoria) => set.add(categoria))
  })

  return Array.from(set)
})

const itensFiltrados = computed(() => {
  if (filtroAtivo.value === 'todos') {
    return props.prestador.portfolio
  }

  return props.prestador.portfolio.filter((item) =>
    item.categorias.includes(filtroAtivo.value)
  )
})

function setFiltro(categoria: string) {
  filtroAtivo.value = categoria
}

function abrirModal(item: PortfolioItem) {
  itemSelecionado.value = item
  modalAberto.value = true
}

function fecharModal() {
  modalAberto.value = false
  itemSelecionado.value = null
}

function abrirModalOrcamento() {
  modalOrcamentoAberto.value = true
}

function fecharModalOrcamento() {
  modalOrcamentoAberto.value = false
}
</script>

<template>
  <div id="panel-portfolio" class="portfolio-panel" role="tabpanel" aria-labelledby="tab-portfolio">
    <h2 class="section-title">Trabalhos realizados</h2>
    <p class="section-subtitle">
      Confira alguns serviços já realizados por este profissional
    </p>

    <div class="portfolio-filters" role="group" aria-label="Filtrar por serviço">
      <button class="filter-btn" :class="{ active: filtroAtivo === 'todos' }" type="button" @click="setFiltro('todos')">
        <img v-if="filtroAtivo === 'todos'" class="filter-btn__icon" :src="CHECK_PURPLE" alt="" width="14" height="14"
          aria-hidden="true" />
        <span>Todos</span>
      </button>

      <button v-for="servico in todosServicos" :key="servico" class="filter-btn"
        :class="{ active: filtroAtivo === servico }" type="button" @click="setFiltro(servico)">
        <img v-if="filtroAtivo === servico" class="filter-btn__icon" :src="CHECK_PURPLE" alt="" width="14" height="14"
          aria-hidden="true" />
        <span>{{ servico }}</span>
      </button>
    </div>

    <div class="portfolio-grid">
      <button v-for="item in itensFiltrados" :key="item.id" class="portfolio-item" type="button"
        :aria-label="`Ver detalhes de ${item.titulo || item.alt}`" @click="abrirModal(item)">
        <img :src="item.imagemUrl" :alt="item.alt" width="400" height="400" loading="lazy" />

        <div class="portfolio-item__overlay">
          <div class="portfolio-item__overlay-content">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M1.5 12S5.5 5 12 5s10.5 7 10.5 7-4 7-10.5 7S1.5 12 1.5 12Z" stroke="currentColor"
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" />
            </svg>
            <span>Ver detalhes</span>
          </div>
        </div>
      </button>
    </div>

    <div class="portfolio-divider"></div>

    <div class="portfolio-cta">
      <p class="portfolio-cta__title">Gostou do trabalho deste profissional?</p>
      <p class="portfolio-cta__desc">
        Entre em contato e solicite informações sobre o serviço
      </p>
      <button class="btn btn-primary" type="button" @click="abrirModalOrcamento">
        Solicitar orçamento
      </button>
    </div>

    <PortfolioImageModal :aberto="modalAberto" :item="itemSelecionado" @fechar="fecharModal" />

    <ModalSolicitarOrcamento :aberto="modalOrcamentoAberto" :prestador="prestador" @fechar="fecharModalOrcamento" />
  </div>
</template>

<style scoped>
.portfolio-panel {
  padding: 0 1.5rem;
  animation: fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1);
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-neutral-medium);
  margin-bottom: 0.25rem;
  line-height: 1.2;
}

.section-subtitle {
  font-size: 0.75rem;
  font-weight: 400;
  color: var(--color-neutral-light);
  margin-bottom: 1rem;
  line-height: 1.5;
}

.portfolio-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 1.25rem 0;
  animation: fade-up 0.8s cubic-bezier(0.22, 1, 0.36, 1);
}

.filter-btn {
  min-height: 1.75rem;
  padding: 0.25rem 0.875rem;
  border-radius: 9999rem;
  font-size: 0.75rem;
  font-weight: 500;
  font-family: inherit;
  background: var(--color-neutral-light-white);
  border: 0.0625rem solid var(--color-neutral-light-light);
  color: var(--color-neutral-light);
  transition:
    transform 180ms ease,
    box-shadow 180ms ease,
    border-color 180ms ease,
    color 180ms ease,
    background 180ms ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  cursor: pointer;
  box-shadow: 0 0.125rem 0.5rem rgba(0, 0, 0, 0.04);
}

.filter-btn__icon {
  flex-shrink: 0;
  width: 0.625rem;
  height: 0.625rem;
  display: block;
}

.filter-btn:hover {
  transform: translateY(-0.0625rem);
  border-color: var(--color-primary-medium);
  color: var(--color-primary-medium);
  background: var(--color-neutral-light-white);
  box-shadow: 0 0.5rem 1rem rgba(22, 29, 39, 0.08);
}

.filter-btn.active {
  background: var(--color-neutral-light-white);
  color: var(--color-primary-medium);
  border-color: var(--color-primary-medium);
  box-shadow:
    inset 0 0 0 0.0625rem var(--color-primary-lightest),
    0 0.5rem 1rem rgba(22, 29, 39, 0.07);
}

.portfolio-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.portfolio-item {
  position: relative;
  border: none;
  border-radius: 0.875rem;
  overflow: hidden;
  aspect-ratio: 1;
  background: var(--color-neutral-light-medium);
  cursor: pointer;
  padding: 0;
  isolation: isolate;
  font-family: inherit;
  transform: translateY(0);
  transition:
    transform 260ms cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 260ms cubic-bezier(0.22, 1, 0.36, 1),
    filter 260ms ease;
  box-shadow: 0 0.375rem 1.25rem rgba(22, 29, 39, 0.06);
}

.portfolio-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 360ms cubic-bezier(0.22, 1, 0.36, 1), filter 300ms ease;
}

.portfolio-item__overlay {
  position: absolute;
  inset: 0;
  background: rgba(22, 29, 39, 0);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: background 260ms ease, opacity 260ms ease;
}

.portfolio-item__overlay-content {
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
  color: #ffffff;
  font-size: 1rem;
  font-weight: 600;
  transform: translateY(0.25rem) scale(0.98);
  transition: transform 260ms cubic-bezier(0.22, 1, 0.36, 1);
}

.portfolio-item:hover {
  transform: translateY(-0.1875rem);
  box-shadow: 0 1rem 2rem rgba(22, 29, 39, 0.14);
}

.portfolio-item:hover img {
  transform: scale(1.05);
  filter: saturate(1.04);
}

.portfolio-item:hover .portfolio-item__overlay {
  opacity: 1;
  background: rgba(22, 29, 39, 0.44);
}

.portfolio-item:hover .portfolio-item__overlay-content {
  transform: translateY(0) scale(1);
}

.portfolio-divider {
  height: 0.0625rem;
  background: var(--color-neutral-light-light);
  margin: 0.625rem 0 1.25rem;
}

.portfolio-cta {
  text-align: center;
  padding: 0 1.5rem 0;
  animation: fade-up 0.95s cubic-bezier(0.22, 1, 0.36, 1);
}

.portfolio-cta__title {
  font-size: 1.5625rem;
  font-weight: 800;
  line-height: 1.2;
  color: var(--color-neutral-dark);
  margin-bottom: 0.625rem;
  margin-top: 1.25rem;
}

.portfolio-cta__desc {
  font-size: 0.875rem;
  color: var(--color-neutral-light);
  margin-bottom: 1.125rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 12.125rem;
  padding: 0.875rem 3.75rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 600;
  transition:
    transform 180ms ease,
    box-shadow 180ms ease,
    background 180ms ease,
    filter 180ms ease;
  border: 0.125rem solid transparent;
  cursor: pointer;
  font-family: inherit;
}

.btn:hover {
  transform: translateY(-0.0625rem);
}

.btn-primary {
  background: var(--color-primary-dark);
  color: #ffffff;
  box-shadow: 0 0.75rem 1.5rem rgba(22, 29, 39, 0.12);
}

.btn-primary:hover {
  background: var(--color-primary-dark);
  filter: saturate(1.05);
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background:
    radial-gradient(circle at top, rgba(113, 63, 255, 0.08), transparent 34%),
    rgba(17, 17, 17, 0.45);
  backdrop-filter: blur(0.375rem);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.25rem;
  z-index: 50;
  overflow-y: auto;
}

.modal-card {
  width: 100%;
  max-width: 41.25rem;
  background: var(--color-neutral-light-white);
  border-radius: 1.125rem;
  border: 0.0625rem solid var(--color-neutral-light-light);
  box-shadow: 0 1.5rem 5rem rgba(0, 0, 0, 0.18);
  padding: 1.75rem 2rem;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0;
  margin: auto;
}

.btn-fechar {
  position: absolute;
  right: 1.25rem;
  top: 1.25rem;
  border: none;
  background: transparent;
  cursor: pointer;
  color: var(--color-neutral-medium);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.3rem;
  border-radius: 0.375rem;
  transition: color 0.2s ease, background 0.2s ease, transform 0.2s ease;
}

.btn-fechar:hover {
  color: var(--color-neutral-dark);
  background: var(--color-neutral-light-light);
  transform: rotate(90deg);
}

.modal-titulo {
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--color-neutral-dark);
  text-align: center;
  padding-bottom: 1.25rem;
  font-family: 'Poppins', sans-serif;
}

.divider {
  height: 0.0625rem;
  background: var(--color-neutral-light-light);
  margin: 0 -2rem;
}

.prestador-info-modal {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 0;
}

.prestador-avatar {
  width: 5rem;
  height: 5rem;
  border-radius: 9999rem;
  object-fit: cover;
  flex-shrink: 0;
  border: 0.1875rem solid var(--color-neutral-light-light);
  box-shadow: 0 0.75rem 1.5rem rgba(22, 29, 39, 0.08);
}

.prestador-dados {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
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
}

.modal-body {
  padding: 1.25rem 0;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 1rem;
  align-items: start;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  min-width: 0;
}

.form-label {
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--color-neutral-dark);
  font-family: 'Poppins', sans-serif;
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
  border-radius: 0.625rem;
  border: 0.0625rem solid var(--color-neutral-light-light);
  background: var(--color-neutral-light-white);
  color: var(--color-neutral-dark);
  font-size: 0.82rem;
  font-family: 'Poppins', sans-serif;
  resize: vertical;
  line-height: 1.55;
  transition:
    border-color 180ms ease,
    box-shadow 180ms ease,
    transform 180ms ease;
}

.form-textarea::placeholder {
  color: var(--color-neutral-lightest);
}

.form-textarea:focus {
  outline: none;
  border-color: var(--color-primary-medium);
  box-shadow: 0 0 0 0.25rem color-mix(in srgb, var(--color-primary-lightest) 25%, transparent);
  transform: translateY(-0.0625rem);
}

.horario-chips {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.horario-chip {
  padding: 0.4375rem 1.25rem;
  border-radius: 0.5rem;
  border: 0.09375rem solid var(--color-neutral-light-light);
  background: var(--color-neutral-light-white);
  color: var(--color-neutral-dark);
  font-size: 0.82rem;
  font-weight: 500;
  font-family: 'Poppins', sans-serif;
  cursor: pointer;
  transition:
    all 180ms ease,
    transform 180ms ease,
    box-shadow 180ms ease;
}

.horario-chip:hover {
  transform: translateY(-0.0625rem);
  box-shadow: 0 0.625rem 1.25rem rgba(22, 29, 39, 0.08);
}

.horario-chip.active {
  border-color: var(--color-primary-dark);
  background: color-mix(in srgb, var(--color-primary-lightest) 30%, white);
  color: var(--color-primary-dark);
  font-weight: 600;
}

.upload-area {
  border: 0.09375rem dashed var(--color-neutral-light-medium);
  border-radius: 0.75rem;
  padding: 1.5rem;
  text-align: center;
  background: var(--color-neutral-light-lightest, #fafafa);
  transition:
    border-color 180ms ease,
    transform 180ms ease,
    box-shadow 180ms ease;
}

.upload-area:hover {
  border-color: var(--color-primary-light);
  transform: translateY(-0.0625rem);
  box-shadow: 0 0.875rem 1.75rem rgba(22, 29, 39, 0.06);
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
  transition: transform 180ms ease;
}

.upload-area:hover .upload-label img {
  transform: translateY(-0.0625rem) scale(1.04);
}

.upload-hint {
  font-size: 0.8rem;
  color: var(--color-neutral-lightest);
  font-family: 'Poppins', sans-serif;
}

.upload-btn-label {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.4375rem 1rem;
  border-radius: 0.5rem;
  border: 0.09375rem solid var(--color-neutral-light-light);
  background: var(--color-neutral-light-white);
  color: var(--color-neutral-dark);
  font-size: 0.8rem;
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
  transition:
    all 180ms ease,
    transform 180ms ease,
    box-shadow 180ms ease;
  cursor: pointer;
}

.upload-btn-label:hover {
  border-color: var(--color-primary-medium);
  color: var(--color-primary-medium);
  transform: translateY(-0.0625rem);
  box-shadow: 0 0.75rem 1.5rem rgba(22, 29, 39, 0.08);
}

.file-list {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  margin-top: 0.625rem;
}

.file-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.375rem 0.625rem;
  border-radius: 0.5rem;
  background: var(--color-neutral-light-light);
  font-size: 0.78rem;
  color: var(--color-neutral-dark);
  font-family: 'Poppins', sans-serif;
  transition: transform 180ms ease, box-shadow 180ms ease;
}

.file-item:hover {
  transform: translateY(-0.0625rem);
  box-shadow: 0 0.625rem 1.25rem rgba(22, 29, 39, 0.05);
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
  transition: color 180ms ease, transform 180ms ease;
}

.file-remove:hover {
  color: var(--color-neutral-dark);
  transform: scale(1.08);
}

.modal-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding-top: 1.25rem;
  border-top: 0.0625rem solid var(--color-neutral-light-light);
  margin-top: 0.25rem;
}

.btn-modal {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.6875rem 2rem;
  border-radius: 0.625rem;
  font-size: 0.88rem;
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
  cursor: pointer;
  transition:
    transform 180ms ease,
    box-shadow 180ms ease,
    background 180ms ease,
    border-color 180ms ease;
  border: 0.125rem solid transparent;
  min-width: 10rem;
}

.btn-modal:hover {
  transform: translateY(-0.0625rem);
}

.btn-outline {
  background: transparent;
  border-color: var(--color-primary-darkest);
  color: var(--color-primary-darkest);
}

.btn-outline:hover {
  background: color-mix(in srgb, var(--color-primary-lightest) 20%, white);
}

.btn-primary-modal {
  background: var(--color-primary-darkest);
  color: #ffffff;
  border-color: var(--color-primary-darkest);
  box-shadow: 0 0.75rem 1.5rem rgba(22, 29, 39, 0.12);
}

.btn-primary-modal:hover {
  background: var(--color-primary-dark);
  border-color: var(--color-primary-dark);
}

.sort-dropdown {
  position: relative;
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
  border-radius: 0.625rem;
  background: var(--color-neutral-light-white);
  border: 0.0625rem solid var(--color-neutral-light-light);
  color: var(--color-neutral-dark);
  font-size: 0.82rem;
  font-weight: 500;
  font-family: 'Poppins', sans-serif;
  box-shadow: 0 0.0625rem 0.1875rem rgba(22, 29, 39, 0.06);
  cursor: pointer;
  transition:
    border-color 180ms ease,
    background 180ms ease,
    transform 180ms ease,
    box-shadow 180ms ease;
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

.sort-select__icon {
  flex-shrink: 0;
  transition: transform 180ms ease;
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
  z-index: 30;
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
  transition: background 180ms ease, transform 180ms ease, color 180ms ease;
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
  transition: opacity 180ms ease, transform 180ms ease;
  transform-origin: top center;
}

.sort-menu-enter-from,
.sort-menu-leave-to {
  opacity: 0;
  transform: translateY(-0.375rem) scale(0.98);
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
    transform: translateY(0.875rem) scale(0.98);
    opacity: 0;
  }

  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(0.625rem);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 75rem) {
  .portfolio-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 56.25rem) {
  .portfolio-panel {
    padding: 0 1.25rem;
  }

  .portfolio-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .modal-card {
    max-width: 38rem;
  }
}

@media (max-width: 37.5rem) {
  .portfolio-panel {
    padding: 0 1rem;
  }

  .section-title {
    font-size: 1.125rem;
  }

  .section-subtitle {
    font-size: 0.75rem;
  }

  .portfolio-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.625rem;
  }

  .portfolio-item__overlay-content {
    font-size: 0.8125rem;
    gap: 0.5rem;
  }

  .portfolio-cta {
    padding-inline: 0;
  }

  .portfolio-cta__title {
    font-size: 1.5rem;
  }

  .modal-card {
    padding: 1.25rem 1rem;
    border-radius: 1rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .prestador-info-modal {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .bairro-tags {
    justify-content: center;
  }

  .prestador-roles {
    justify-content: center;
  }

  .modal-footer {
    flex-direction: column;
  }

  .btn-modal {
    width: 100%;
  }
}

@media (max-width: 30rem) {
  .portfolio-panel {
    padding: 0 0.875rem;
  }

  .portfolio-filters {
    gap: 0.375rem;
  }

  .filter-btn {
    font-size: 0.71875rem;
    padding: 0.25rem 0.75rem;
  }

  .portfolio-grid {
    grid-template-columns: 1fr;
  }

  .portfolio-item {
    aspect-ratio: 1 / 1;
  }

  .local-row {
    grid-template-columns: 1fr;
  }

  .upload-area {
    padding: 1.125rem;
  }

  .modal-overlay {
    padding: 0.875rem;
    align-items: flex-end;
  }

  .modal-card {
    padding: 1.125rem 0.875rem;
    max-width: 100%;
    width: 100%;
  }

  .divider {
    margin: 0 -0.875rem;
  }
}

@media (hover: none) {

  .portfolio-item:hover,
  .filter-btn:hover,
  .horario-chip:hover,
  .upload-btn-label:hover,
  .btn:hover,
  .btn-modal:hover,
  .form-select-trigger:hover {
    transform: none;
  }

  .portfolio-item:hover .portfolio-item__overlay {
    opacity: 0;
    background: rgba(22, 29, 39, 0);
  }

  .portfolio-item:hover .portfolio-item__overlay-content {
    transform: translateY(0.25rem) scale(0.98);
  }

  .portfolio-item:hover img {
    transform: none;
    filter: none;
  }
}

@media (prefers-reduced-motion: reduce) {

  .portfolio-panel,
  .portfolio-filters,
  .portfolio-cta,
  .portfolio-item,
  .portfolio-item img,
  .portfolio-item__overlay,
  .portfolio-item__overlay-content,
  .filter-btn,
  .btn,
  .btn-modal,
  .btn-fechar,
  .horario-chip,
  .upload-area,
  .upload-label img,
  .upload-btn-label,
  .file-item,
  .file-remove,
  .form-select-trigger,
  .sort-menu__item,
  .form-textarea,
  .modal-card {
    animation: none !important;
    transition: none !important;
  }
}
</style>