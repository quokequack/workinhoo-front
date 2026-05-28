<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount, watch } from 'vue'
import type { Prestador, BarraRating } from '@/types/prestador'
import ModalAvaliarPrestador from '@/components/provider/modals/ModalAvaliarPrestador.vue'

import starFull from '@/assets/icons/star-full.svg'
import starHalf from '@/assets/icons/star-half.svg'
import starEmpty from '@/assets/icons/star-empty.svg'
import quoteSoft from '@/assets/icons/quote-soft.svg'
import quoteMedium from '@/assets/icons/quote-medium.svg'
import arrowDown from '@/assets/icons/arrow-down2.svg'
import arrowLeft from '@/assets/icons/arrow-left.svg'
import arrowRight from '@/assets/icons/arrow-right.svg'

const props = defineProps<{
  prestador: Prestador
}>()

type SortOption = 'recentes' | 'maiores' | 'menores'

const STAR_FULL = starFull
const STAR_HALF = starHalf
const STAR_EMPTY = starEmpty
const QUOTE_SOFT = quoteSoft
const QUOTE_MEDIUM = quoteMedium
const ARROW_DOWN = arrowDown
const ARROW_LEFT = arrowLeft
const ARROW_RIGHT = arrowRight

const currentSlide = ref(0)
const isMobile = ref(false)

const sortBy = ref<SortOption>('recentes')
const sortMenuOpen = ref(false)

const modalAvaliarAberto = ref(false)

const carouselRef = ref<HTMLElement | null>(null)
const isDragging = ref(false)
const dragStartX = ref(0)
const dragCurrentX = ref(0)
const dragOffsetX = ref(0)
const dragThreshold = 60

const DESKTOP_GAP_PX = 14
const MOBILE_GAP_PX = 14
const MOBILE_PEEK_PX = 22

function abrirModalAvaliar() {
  modalAvaliarAberto.value = true
}

function fecharModalAvaliar() {
  modalAvaliarAberto.value = false
}

function updateViewport() {
  isMobile.value = window.innerWidth <= 1080
}

onMounted(() => {
  updateViewport()
  window.addEventListener('resize', updateViewport)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateViewport)
})

const itemsPerView = computed(() => (isMobile.value ? 1 : 3))

const barras = computed<BarraRating[]>(() => {
  const total = props.prestador.avaliacoes.length

  return [5, 4, 3, 2, 1].map((nota) => {
    const count = props.prestador.avaliacoes.filter((a) => Math.floor(a.nota) === nota).length

    return {
      nota,
      count,
      percentual: total > 0 ? Math.round((count / total) * 100) : 0,
    }
  })
})

function getTimestamp(avaliacao: any) {
  if (avaliacao.createdAt) {
    return new Date(avaliacao.createdAt).getTime()
  }

  const parsed = new Date(avaliacao.data).getTime()
  return Number.isNaN(parsed) ? 0 : parsed
}

const sortedAvaliacoes = computed(() => {
  const avaliacoes = [...props.prestador.avaliacoes]

  if (sortBy.value === 'maiores') {
    return avaliacoes.sort((a, b) => b.nota - a.nota)
  }

  if (sortBy.value === 'menores') {
    return avaliacoes.sort((a, b) => a.nota - b.nota)
  }

  return avaliacoes.sort((a, b) => getTimestamp(b) - getTimestamp(a))
})

const totalSlides = computed(() => {
  return Math.max(1, sortedAvaliacoes.value.length - itemsPerView.value + 1)
})

const progressPercent = computed(() => {
  if (totalSlides.value <= 1) return 100
  return ((currentSlide.value + 1) / totalSlides.value) * 100
})

const trackStyle = computed(() => {
  if (isMobile.value && carouselRef.value) {
    const viewportWidth = carouselRef.value.clientWidth
    const cardWidth = viewportWidth - MOBILE_PEEK_PX * 2
    const step = cardWidth + MOBILE_GAP_PX

    return {
      transform: `translateX(${-(currentSlide.value * step) + MOBILE_PEEK_PX + dragOffsetX.value}px)`,
      transition: isDragging.value ? 'none' : 'transform 520ms cubic-bezier(0.22, 1, 0.36, 1)',
    }
  }

  const slideWidthPercent = 100 / itemsPerView.value
  const gapOffset = (DESKTOP_GAP_PX * currentSlide.value) / itemsPerView.value

  return {
    transform: `translateX(calc(-${currentSlide.value * slideWidthPercent}% - ${gapOffset}px${isDragging.value ? ` + ${dragOffsetX.value}px` : ''}))`,
    transition: isDragging.value ? 'none' : 'transform 520ms cubic-bezier(0.22, 1, 0.36, 1)',
  }
})

const canGoPrev = computed(() => currentSlide.value > 0)
const canGoNext = computed(() => currentSlide.value < totalSlides.value - 1)

const sortLabel = computed(() => {
  if (sortBy.value === 'maiores') return 'Avaliações mais altas'
  if (sortBy.value === 'menores') return 'Avaliações mais baixas'
  return 'Mais recentes'
})

function prevSlide() {
  if (!canGoPrev.value) return
  currentSlide.value--
}

function nextSlide() {
  if (!canGoNext.value) return
  currentSlide.value++
}

function setSort(option: SortOption) {
  sortBy.value = option
  sortMenuOpen.value = false
  currentSlide.value = 0
}

function toggleSortMenu() {
  sortMenuOpen.value = !sortMenuOpen.value
}

function closeSortMenu() {
  sortMenuOpen.value = false
}

function getStarIcon(nota: number, index: number) {
  const position = index + 1

  if (nota >= position) return STAR_FULL
  if (nota >= position - 0.5) return STAR_HALF
  return STAR_EMPTY
}

function handlePublicado() {
  modalAvaliarAberto.value = false
}

function onPointerDown(event: PointerEvent) {
  if (!carouselRef.value) return
  isDragging.value = true
  dragStartX.value = event.clientX
  dragCurrentX.value = event.clientX
  dragOffsetX.value = 0
  carouselRef.value.setPointerCapture?.(event.pointerId)
}

function onPointerMove(event: PointerEvent) {
  if (!isDragging.value) return
  dragCurrentX.value = event.clientX
  dragOffsetX.value = dragCurrentX.value - dragStartX.value
}

function finalizarDrag() {
  if (!isDragging.value) return

  if (dragOffsetX.value <= -dragThreshold && canGoNext.value) {
    currentSlide.value++
  } else if (dragOffsetX.value >= dragThreshold && canGoPrev.value) {
    currentSlide.value--
  }

  isDragging.value = false
  dragStartX.value = 0
  dragCurrentX.value = 0
  dragOffsetX.value = 0
}

function onPointerUp(event: PointerEvent) {
  if (carouselRef.value) {
    carouselRef.value.releasePointerCapture?.(event.pointerId)
  }
  finalizarDrag()
}

function onPointerCancel() {
  finalizarDrag()
}

watch(itemsPerView, () => {
  currentSlide.value = 0
})

watch(
  () => props.prestador.avaliacoes.length,
  () => {
    currentSlide.value = 0
  }
)
</script>

<template>
  <div
    id="panel-avaliacoes"
    class="panel-avaliacoes"
    role="tabpanel"
    aria-labelledby="tab-avaliacoes"
    @click="closeSortMenu"
  >
    <div class="avaliacoes-header">
      <div class="rating-summary">
        <div class="rating-summary__score" :aria-label="`Nota ${prestador.nota.toFixed(1)}`">
          {{ prestador.nota.toFixed(1) }}
        </div>

        <div class="rating-summary__meta">
          <div class="stars" aria-hidden="true">
            <img
              v-for="i in 5"
              :key="i"
              class="star-icon"
              :src="getStarIcon(prestador.nota, i - 1)"
              alt=""
              width="30"
              height="30"
            />
          </div>

          <div class="rating-summary__total">
            Baseado em <strong>{{ String(prestador.totalAvaliacoes).padStart(2, '0') }}</strong> avaliações
          </div>
        </div>
      </div>

      <div class="rating-bars" aria-label="Distribuição das avaliações">
        <div v-for="barra in barras" :key="barra.nota" class="rating-row">
          <span class="rating-row__label">{{ barra.nota.toFixed(1) }}</span>

          <img class="rating-row__star" :src="STAR_FULL" alt="" width="14" height="14" aria-hidden="true" />

          <div class="rating-bar-track">
            <div class="rating-bar-fill" :style="{ width: barra.percentual + '%' }"></div>
          </div>

          <span class="rating-row__count">{{ barra.count }}</span>
        </div>
      </div>
    </div>

    <div class="section-divider"></div>

    <div class="avaliacoes-toolbar">
      <span>Ordenar por:</span>

      <div class="sort-dropdown" @click.stop>
        <button
          class="sort-select"
          type="button"
          :aria-expanded="sortMenuOpen"
          aria-haspopup="menu"
          @click="toggleSortMenu"
        >
          <span class="sort-select__label">{{ sortLabel }}</span>
          <img
            class="sort-select__icon"
            :class="{ 'is-open': sortMenuOpen }"
            :src="ARROW_DOWN"
            alt=""
            width="12"
            height="12"
            aria-hidden="true"
          />
        </button>

        <transition name="sort-menu">
          <div v-if="sortMenuOpen" class="sort-menu" role="menu">
            <button
              class="sort-menu__item"
              :class="{ active: sortBy === 'recentes' }"
              type="button"
              role="menuitem"
              @click="setSort('recentes')"
            >
              <span>Mais recentes</span>
              <span v-if="sortBy === 'recentes'" class="sort-menu__check">•</span>
            </button>

            <button
              class="sort-menu__item"
              :class="{ active: sortBy === 'maiores' }"
              type="button"
              role="menuitem"
              @click="setSort('maiores')"
            >
              <span>Avaliações mais altas</span>
              <span v-if="sortBy === 'maiores'" class="sort-menu__check">•</span>
            </button>

            <button
              class="sort-menu__item"
              :class="{ active: sortBy === 'menores' }"
              type="button"
              role="menuitem"
              @click="setSort('menores')"
            >
              <span>Avaliações mais baixas</span>
              <span v-if="sortBy === 'menores'" class="sort-menu__check">•</span>
            </button>
          </div>
        </transition>
      </div>
    </div>

    <div class="depoimentos-layout">
      <aside class="depoimentos-side">
        <img class="depoimentos-side__quote" :src="QUOTE_SOFT" alt="" width="80" height="60" aria-hidden="true" />

        <h2 class="depoimentos-side__title">
          O que os clientes dizem
        </h2>

        <div class="depoimentos-side__controls">
          <button
            class="carousel-arrow"
            :class="{ disabled: !canGoPrev }"
            :disabled="!canGoPrev"
            type="button"
            aria-label="Ver avaliações anteriores"
            @click="prevSlide"
          >
            <img :src="ARROW_LEFT" alt="" width="12" height="12" aria-hidden="true" />
          </button>

          <div class="carousel-progress" aria-hidden="true">
            <div class="carousel-progress__fill" :style="{ width: progressPercent + '%' }"></div>
          </div>

          <button
            class="carousel-arrow"
            :class="{ disabled: !canGoNext }"
            :disabled="!canGoNext"
            type="button"
            aria-label="Ver próximas avaliações"
            @click="nextSlide"
          >
            <img :src="ARROW_RIGHT" alt="" width="12" height="12" aria-hidden="true" />
          </button>
        </div>
      </aside>

      <div
        ref="carouselRef"
        class="avaliacoes-carousel"
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @pointerup="onPointerUp"
        @pointercancel="onPointerCancel"
        @pointerleave="onPointerCancel"
      >
        <div class="avaliacoes-track" :style="trackStyle">
          <article v-for="av in sortedAvaliacoes" :key="av.id" class="avaliacao-card">
            <img class="avaliacao-card__quote" :src="QUOTE_MEDIUM" alt="" width="20" height="20" aria-hidden="true" />

            <div class="avaliacao-card__stars" :aria-label="`${av.nota} estrelas`">
              <img
                v-for="i in 5"
                :key="i"
                class="star-icon star-icon--small"
                :src="getStarIcon(av.nota, i - 1)"
                alt=""
                width="16"
                height="16"
                aria-hidden="true"
              />
            </div>

            <p class="avaliacao-card__text">{{ av.texto }}</p>

            <div class="avaliacao-card__author">
              <img
                class="author-avatar"
                :src="av.avatarUrl"
                :alt="`Foto de ${av.autor}`"
                width="44"
                height="44"
                loading="lazy"
              />
              <div>
                <div class="author-name">{{ av.autor }}</div>
                <div class="author-date">{{ av.data }}</div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>

    <div class="section-divider section-divider--bottom"></div>

    <div class="avalie-banner">
      <p class="avalie-banner__title">Sua experiência pode ajudar outras pessoas</p>
      <p class="avalie-banner__desc">
        Conte como foi o atendimento e ajude a comunidade a encontrar profissionais de confiança na Workinhoo
      </p>
      <button class="btn btn-primary" type="button" @click="abrirModalAvaliar">
        Avaliar prestador
      </button>
    </div>

    <ModalAvaliarPrestador
      :aberto="modalAvaliarAberto"
      :prestador="prestador"
      @fechar="fecharModalAvaliar"
      @publicado="handlePublicado"
    />
  </div>
</template>

<style scoped>
.panel-avaliacoes {
  padding: 1.5rem;
  font-family: 'Poppins', sans-serif;
  animation: fade-panel 0.7s cubic-bezier(0.22, 1, 0.36, 1);
  overflow-x: hidden;
}

.avaliacoes-header {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  background: var(--color-neutral-light-white);
  border: 0.0625rem solid var(--color-neutral-light-light);
  border-radius: 1rem;
  padding: 1.75rem 2rem;
  box-shadow:
    0 0.0625rem 0.1875rem rgba(22, 29, 39, 0.07),
    0 1rem 2.25rem rgba(22, 29, 39, 0.04);
  align-items: center;
  animation: fade-up 0.72s cubic-bezier(0.22, 1, 0.36, 1);
}

.rating-summary {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.rating-summary__score {
  font-size: 4.25rem;
  font-weight: 800;
  color: var(--color-neutral-dark);
  line-height: 1;
  letter-spacing: -0.04em;
}

.rating-summary__meta {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.rating-summary__total {
  font-size: 0.875rem;
  color: var(--color-neutral-lightest);
}

.stars {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
}

.star-icon {
  display: block;
  flex-shrink: 0;
  transition: transform 180ms ease, filter 220ms ease;
}

.rating-summary:hover .star-icon {
  filter: saturate(1.05);
}

.star-icon--small {
  width: 1rem;
  height: 1rem;
}

.rating-bars {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.rating-row {
  display: grid;
  grid-template-columns: 2.125rem 1rem 1fr 1.25rem;
  align-items: center;
  gap: 0.625rem;
}

.rating-row__label,
.rating-row__count {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-neutral-medium);
}

.rating-row__count {
  text-align: right;
}

.rating-bar-track {
  width: 100%;
  height: 0.3125rem;
  background: var(--color-neutral-light-medium);
  border-radius: 9999rem;
  overflow: hidden;
}

.rating-bar-fill {
  height: 100%;
  background: linear-gradient(90deg,
      var(--color-primary-medium) 0%,
      color-mix(in srgb, var(--color-primary-light) 75%, white) 100%);
  border-radius: 9999rem;
  transition: width 260ms ease;
  box-shadow: 0 0 0.5rem color-mix(in srgb, var(--color-primary-lightest) 38%, transparent);
}

.section-divider {
  height: 0.0625rem;
  background: linear-gradient(90deg,
      transparent 0%,
      var(--color-neutral-light-light) 12%,
      var(--color-neutral-light-light) 88%,
      transparent 100%);
  margin: 2.5rem 0;
}

.section-divider--bottom {
  margin: 1.375rem 0 1.125rem;
}

.avaliacoes-toolbar {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 0.375rem;
  margin: 1.5625rem 0 1.125rem;
  animation: fade-up 0.82s cubic-bezier(0.22, 1, 0.36, 1);
}

.avaliacoes-toolbar span {
  font-size: 0.875rem;
  color: var(--color-neutral-lightest);
}

.sort-dropdown {
  position: relative;
}

.sort-select {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 2.5rem;
  padding: 0 0.875rem;
  border-radius: 0.75rem;
  background: var(--color-neutral-light-white);
  border: 0.0625rem solid var(--color-neutral-light-light);
  color: var(--color-neutral-dark);
  font-size: 0.875rem;
  font-weight: 600;
  font-family: inherit;
  box-shadow: 0 0.25rem 0.75rem rgba(22, 29, 39, 0.06);
  transition:
    transform 180ms ease,
    box-shadow 220ms ease,
    border-color 220ms ease,
    background 180ms ease;
}

.sort-select:hover {
  border-color: var(--color-primary-lightest);
  background: var(--color-neutral-light-lightest);
  transform: translateY(-0.0625rem);
  box-shadow: 0 0.75rem 1.5rem rgba(22, 29, 39, 0.08);
}

.sort-select__label {
  white-space: nowrap;
}

.sort-select__icon {
  transition: transform 180ms ease;
}

.sort-select__icon.is-open {
  transform: rotate(180deg);
}

.sort-menu {
  position: absolute;
  top: calc(100% + 0.625rem);
  right: 0;
  min-width: 13.75rem;
  padding: 0.5rem;
  background: var(--color-neutral-light-white);
  border: 0.0625rem solid var(--color-neutral-light-light);
  border-radius: 0.875rem;
  box-shadow: 0 1.125rem 2.125rem rgba(22, 29, 39, 0.12);
  z-index: 20;
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
  font-size: 0.875rem;
  font-weight: 500;
  font-family: inherit;
  text-align: left;
  transition:
    background 180ms ease,
    color 180ms ease,
    transform 180ms ease;
}

.sort-menu__item:hover {
  background: var(--color-neutral-light-lightest);
  transform: translateX(0.125rem);
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
  transform-origin: top right;
}

.sort-menu-enter-from,
.sort-menu-leave-to {
  opacity: 0;
  transform: translateY(-0.375rem) scale(0.98);
}

.depoimentos-layout {
  display: grid;
  grid-template-columns: 10rem 1fr;
  gap: 1.5rem;
  align-items: stretch;
  overflow-x: hidden;
}

.depoimentos-side {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0.5rem 0 0.375rem;
  animation: fade-up 0.88s cubic-bezier(0.22, 1, 0.36, 1);
}

.depoimentos-side__quote {
  animation: float-soft 6s ease-in-out infinite;
}

.depoimentos-side__title {
  font-size: 1.5rem;
  line-height: 1.1;
  font-weight: 600;
  color: var(--color-neutral-dark);
  max-width: 7.5rem;
  margin-top: 1.25rem;
}

.depoimentos-side__controls {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 1.25rem;
}

.avaliacoes-carousel {
  overflow-x: hidden;
  overflow-y: visible;
  width: 100%;
  padding-top: 0.375rem;
  touch-action: pan-y;
  cursor: grab;
  -webkit-user-select: none;
  user-select: none;
}

.avaliacoes-carousel:active {
  cursor: grabbing;
}

.avaliacoes-track {
  display: flex;
  gap: 0.875rem;
  will-change: transform;
}

.avaliacao-card {
  flex: 0 0 calc((100% - 1.75rem) / 3);
  min-width: 0;
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex-direction: column;
  background: var(--color-neutral-light-white);
  border: 0.0625rem solid var(--color-neutral-light-light);
  border-radius: 0.75rem;
  padding: 1rem 0.875rem 0.875rem;
  min-height: 18.5rem;
  transition:
    transform 220ms ease,
    box-shadow 220ms ease,
    border-color 220ms ease;
  user-select: none;
  -webkit-user-select: none;
}

.avaliacao-card:hover {
  transform: translateY(-0.1875rem);
  border-color: color-mix(in srgb, var(--color-primary-lightest) 65%, white);
}

.carousel-arrow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border: none;
  background: transparent;
  border-radius: 999rem;
  padding: 0;
  transition:
    transform 180ms ease,
    opacity 180ms ease,
    background 180ms ease,
    box-shadow 220ms ease;
}

.carousel-arrow:hover:not(.disabled) {
  transform: translateX(0.0625rem) translateY(-0.0625rem);
}

.carousel-arrow.disabled {
  cursor: not-allowed;
  opacity: 0.45;
  box-shadow: none;
}

.carousel-progress {
  width: 6.875rem;
  height: 0.1875rem;
  background: var(--color-neutral-light-medium);
  border-radius: 9999rem;
  overflow: hidden;
}

.carousel-progress__fill {
  height: 100%;
  background: linear-gradient(90deg,
      var(--color-primary-medium) 0%,
      color-mix(in srgb, var(--color-primary-light) 72%, white) 100%);
  border-radius: 9999rem;
  transition: width 220ms ease;
}

.avaliacao-card__quote {
  position: absolute;
  top: 0.75rem;
  right: 0.875rem;
}

.avaliacao-card__stars {
  display: flex;
  gap: 0.1875rem;
  margin-bottom: 0.875rem;
}

.avaliacao-card__text {
  font-size: 0.875rem;
  line-height: 1.55;
  color: var(--color-neutral-medium);
  margin-bottom: 1.125rem;
  flex: 1 1 auto;
}

.avaliacao-card__author {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding-top: 0.875rem;
  border-top: 0.0625rem solid var(--color-neutral-light-light);
  margin-top: auto;
}

.author-avatar {
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 9999rem;
  object-fit: cover;
  flex-shrink: 0;
}

.author-name {
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--color-neutral-dark);
}

.author-date {
  font-size: 0.8125rem;
  color: var(--color-neutral-lightest);
}

.avalie-banner {
  text-align: center;
  padding: 0.375rem 0 0;
  animation: fade-up 0.98s cubic-bezier(0.22, 1, 0.36, 1);
}

.avalie-banner__title {
  font-size: 1.5625rem;
  font-weight: 800;
  line-height: 1.2;
  color: var(--color-neutral-dark);
  margin-bottom: 0.625rem;
  margin-top: 1.25rem;
}

.avalie-banner__desc {
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
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  transition:
    transform 180ms ease,
    box-shadow 220ms ease,
    background 180ms ease,
    filter 180ms ease;
  border: 0.125rem solid transparent;
  cursor: pointer;
  font-family: inherit;
  position: relative;
  overflow: hidden;
  isolation: isolate;
}

.btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    linear-gradient(120deg,
      transparent 0%,
      rgba(255, 255, 255, 0.22) 38%,
      transparent 72%);
  transform: translateX(-130%);
  transition: transform 480ms ease;
  z-index: 0;
}

.btn:hover::before {
  transform: translateX(130%);
}

.btn > * {
  position: relative;
  z-index: 1;
}

.btn-primary {
  background: linear-gradient(180deg,
      color-mix(in srgb, var(--color-primary-dark) 92%, white) 0%,
      var(--color-primary-dark) 100%);
  color: #ffffff;
  box-shadow: 0 0.875rem 1.5rem rgba(22, 29, 39, 0.12);
}

.btn-primary:hover {
  background: linear-gradient(180deg,
      var(--color-primary-dark) 0%,
      var(--color-primary-medium) 100%);
  transform: translateY(-0.125rem);
  box-shadow: 0 1rem 2rem rgba(22, 29, 39, 0.16);
  filter: saturate(1.03);
}

.btn-primary:active {
  transform: scale(0.985);
}

@keyframes fade-panel {
  from {
    opacity: 0;
    transform: translateY(0.75rem);
  }

  to {
    opacity: 1;
    transform: translateY(0);
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

@keyframes float-soft {
  0%,
  100% {
    transform: translate3d(0, 0, 0);
  }

  50% {
    transform: translate3d(0, -0.3125rem, 0);
  }
}

@media (max-width: 67.5rem) {
  .avaliacoes-header {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .depoimentos-layout {
    grid-template-columns: 1fr;
  }

  .depoimentos-side {
    gap: 1rem;
  }

  .depoimentos-side__title {
    max-width: none;
  }

  .avaliacoes-carousel {
    overflow: hidden;
  }

  .avaliacoes-track {
    gap: 0.875rem;
  }

  .avaliacao-card {
    flex: 0 0 calc(100% - 2.75rem);
    min-height: 19rem;
  }

  .carousel-progress {
    width: 100%;
  }
}

@media (max-width: 48rem) {
  .panel-avaliacoes {
    padding: 1.25rem;
  }

  .avaliacoes-header {
    padding: 1.375rem 1.25rem;
  }

  .rating-summary {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.875rem;
  }

  .rating-summary__score {
    font-size: 3.5rem;
  }

  .depoimentos-side__title {
    font-size: 1.375rem;
  }

  .btn {
    padding: 0.875rem 2rem;
    min-width: 100%;
    width: 100%;
    max-width: 18rem;
  }

  .avalie-banner {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}

@media (max-width: 40rem) {
  .panel-avaliacoes {
    padding: 1rem;
  }

  .avaliacoes-header {
    padding: 1.25rem 1rem;
    border-radius: 0.875rem;
  }

  .rating-row {
    grid-template-columns: 1.875rem 0.875rem 1fr 1.125rem;
    gap: 0.5rem;
  }

  .rating-row__label,
  .rating-row__count,
  .rating-summary__total,
  .avaliacoes-toolbar span,
  .sort-select,
  .sort-menu__item,
  .avaliacao-card__text,
  .author-name {
    font-size: 0.75rem;
  }

  .author-date {
    font-size: 0.71875rem;
  }

  .avaliacoes-toolbar {
    justify-content: flex-start;
    margin: 1.25rem 0 1rem;
  }

  .sort-menu {
    left: 0;
    right: auto;
    min-width: 12.5rem;
  }

  .avalie-banner__title {
    font-size: 1.5rem;
  }

  .carousel-arrow {
    width: 1.875rem;
    height: 1.875rem;
  }
}

@media (max-width: 30rem) {
  .panel-avaliacoes {
    padding: 0.875rem;
  }

  .rating-summary__score {
    font-size: 3.125rem;
  }

  .depoimentos-side__controls {
    gap: 0.625rem;
  }

  .avalie-banner__title {
    font-size: 1.375rem;
  }

  .avalie-banner__desc {
    font-size: 0.8125rem;
  }

  .btn {
    max-width: 100%;
    padding: 0.8125rem 1.25rem;
  }

  .avaliacao-card {
    min-height: 18rem;
  }
}

@media (hover: none) {
  .avaliacao-card,
  .avaliacoes-carousel,
  .avaliacao-card__text {
    -webkit-user-select: none;
    user-select: none;
  }

  .avaliacao-card:hover,
  .sort-select:hover,
  .sort-menu__item:hover,
  .carousel-arrow:hover:not(.disabled),
  .btn-primary:hover {
    transform: none;
  }

  .avaliacao-card:hover {
    border-color: var(--color-neutral-light-light);
    box-shadow: none;
  }

  .btn:hover::before {
    transform: translateX(-130%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .panel-avaliacoes,
  .avaliacoes-header,
  .avaliacoes-toolbar,
  .depoimentos-side,
  .avalie-banner,
  .depoimentos-side__quote,
  .star-icon,
  .rating-bar-fill,
  .sort-select,
  .sort-select__icon,
  .sort-menu,
  .sort-menu__item,
  .avaliacoes-track,
  .avaliacao-card,
  .carousel-arrow,
  .carousel-progress__fill,
  .btn,
  .btn::before {
    animation: none !important;
    transition: none !important;
  }
}
</style>