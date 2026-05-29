<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Prestador } from '@/types/prestador'
import ratingIcon from '@/assets/icons/rating.svg'

const props = defineProps<{
  aberto: boolean
  prestador: Prestador
}>()

const emit = defineEmits<{
  fechar: []
  publicado: []
}>()

const nota = ref(0)
const notaHover = ref(0)
const tagsSelecionadas = ref<string[]>([])
const descricao = ref('')

const tags = [
  'Pontual',
  'Educado(a)',
  'Serviço rápido',
  'Preço justo',
  'Resolveu o problema',
  'Recomendo'
]

function toggleTag(tag: string) {
  const idx = tagsSelecionadas.value.indexOf(tag)
  if (idx >= 0) tagsSelecionadas.value.splice(idx, 1)
  else tagsSelecionadas.value.push(tag)
}

function publicar() {
  if (nota.value === 0) return
  emit('publicado')
  emit('fechar')
}

function resetarEstado() {
  nota.value = 0
  notaHover.value = 0
  tagsSelecionadas.value = []
  descricao.value = ''
}

defineExpose({ resetarEstado })

watch(
  () => props.aberto,
  (aberto) => {
    if (aberto === false) {
      resetarEstado()
    }
  }
)
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="aberto" class="modal-overlay">
        <div class="modal-card" role="dialog" aria-modal="true" aria-label="Avaliar prestador">
          <button class="btn-fechar" type="button" aria-label="Fechar" @click="emit('fechar')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
          </button>

          <div class="modal-header">
            <div class="header-icon" aria-hidden="true">
              <img :src="ratingIcon" alt="Ícone de avaliação" class="header-icon-img" />
            </div>

            <div class="header-copy">
              <h2 class="modal-titulo">
                Avalie seu atendimento com
                <span class="nome-destaque">{{ prestador.nome.split(' ')[0] }}</span>
              </h2>
              <p class="modal-subtitulo">Sua avaliação ajuda outros clientes da comunidade</p>
            </div>
          </div>

          <div class="divider"></div>

          <div class="modal-body">
            <div class="form-group">
              <label class="form-label">Sua nota</label>

              <div class="stars-row" role="group" aria-label="Selecione uma nota de 1 a 5 estrelas">
                <button v-for="i in 5" :key="i" type="button" class="star-btn"
                  :class="{ filled: i <= (notaHover || nota) }" :aria-label="`${i} estrela${i > 1 ? 's' : ''}`"
                  @mouseenter="notaHover = i" @mouseleave="notaHover = 0" @click="nota = i">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M12 2l2.9 6 6.6.96-4.75 4.63 1.12 6.53L12 17.27l-5.87 3.09 1.12-6.53L2.5 9.41 9.1 8.4 12 2z"
                      stroke-width="1.2" stroke-linejoin="round" />
                  </svg>
                </button>
              </div>
            </div>

            <div class="form-group form-group-char">
              <label class="form-label">
                Como foi o atendimento?
                <span class="rotulo-opcional">(opcional)</span>
              </label>

              <div class="tag-chips">
                <button v-for="tag in tags" :key="tag" type="button" class="tag-chip"
                  :class="{ active: tagsSelecionadas.includes(tag) }" @click="toggleTag(tag)">
                  {{ tag }}
                </button>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">
                Descreva sua experiência
                <span class="rotulo-opcional">(opcional)</span>
              </label>

              <textarea v-model="descricao" class="form-textarea" maxlength="255"
                placeholder="Conte um pouco sobre sua experiência com esse profissional" rows="4"></textarea>

              <div class="char-count" aria-live="polite">
                {{ descricao.length }}/255
              </div>
            </div>
          </div>

          <div class="divider"></div>

          <div class="modal-footer">
            <button class="btn btn-outline" type="button" @click="emit('fechar')">
              Cancelar
            </button>
            <button class="btn btn-primary" type="button" :disabled="nota === 0" @click="publicar">
              Publicar avaliação
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background:
    radial-gradient(circle at top, rgba(113, 63, 255, 0.08), transparent 32%),
    rgba(17, 17, 17, 0.52);
  backdrop-filter: blur(0.375rem);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.25rem;
  z-index: 50;
  overflow-y: auto;
  box-sizing: border-box;
  overflow-x: hidden;
}

.modal-card {
  width: min(100%, 33.75rem);
  max-width: 33.75rem;
  background: linear-gradient(180deg,
      color-mix(in srgb, var(--color-neutral-light-white) 96%, white) 0%,
      var(--color-neutral-light-white) 100%);
  border-radius: 1.125rem;
  border: 0.0625rem solid var(--color-neutral-light-light);
  box-shadow:
    0 1.5rem 5rem rgba(0, 0, 0, 0.18),
    0 0.125rem 0.5rem rgba(22, 29, 39, 0.08);
  padding: 1.75rem 2rem;
  position: relative;
  display: flex;
  flex-direction: column;
  margin: auto;
  overflow: hidden;
  transform-origin: center;
}

.modal-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg,
      color-mix(in srgb, var(--color-primary-lightest) 22%, transparent) 0%,
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

.modal-header {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding-bottom: 1.25rem;
  margin-top: 0.75rem;
}

.header-icon {
  border: 0.125rem solid var(--color-primary-darkest);
  padding: 0.625rem;
  border-radius: 9999rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
}

.modal-card:hover .header-icon {
  transform: translateY(-0.125rem);
}

.header-icon img {
  width: 1.75rem;
  height: 1.75rem;
  object-fit: contain;
}

.header-copy {
  min-width: 0;
}

.modal-titulo {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-neutral-dark);
  line-height: 1.3;
  font-family: 'Poppins', sans-serif;
  padding-right: 2rem;
}

.nome-destaque {
  color: var(--color-primary-medium);
  position: relative;
}

.modal-subtitulo {
  font-size: 0.82rem;
  color: var(--color-neutral-medium);
  margin-top: 0.25rem;
  font-family: 'Poppins', sans-serif;
  line-height: 1.45;
}

.divider {
  border-top: 0.0625rem solid var(--color-neutral-light-light);
  margin: 0 auto;
  width: 100%;
}

.modal-body {
  padding: 1.25rem 0;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  animation: fade-up 0.45s ease both;
}

form-group-char {
  margin-bottom: -1.1rem;
}

.rotulo-opcional {
  font-weight: 400;
  color: var(--color-neutral-light-dark);
  margin-left: 0.25rem;
  font-size: 0.82rem;
}

.char-count {
  align-self: flex-end;
  font-size: 0.75rem;
  color: var(--color-neutral-light-dark);
  margin-top: 0.125rem;
}

.form-group:nth-child(1) {
  animation-delay: 0.04s;
}

.form-group:nth-child(2) {
  animation-delay: 0.08s;
}

.form-group:nth-child(3) {
  animation-delay: 0.12s;
}

.form-label {
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--color-neutral-dark);
  font-family: 'Poppins', sans-serif;
  letter-spacing: 0.01em;
}

.stars-row {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.star-btn {
  width: 3.75rem;
  height: 3.75rem;
  padding: 0.375rem;
  border-radius: 0.9rem;
  border: 0.09375rem solid var(--color-neutral-light-light);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.95), rgba(249, 249, 249, 0.95));
  cursor: pointer;
  transition:
    transform 0.22s ease,
    border-color 0.22s ease,
    box-shadow 0.22s ease,
    background 0.22s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 0.25rem 0.875rem rgba(22, 29, 39, 0.04);
}

.star-btn svg {
  width: 100%;
  height: 100%;
  stroke: var(--color-neutral-light-medium);
  fill: var(--color-neutral-light-light);
  transition:
    stroke 0.2s ease,
    fill 0.2s ease,
    transform 0.2s ease;
}

.star-btn:hover {
  transform: translateY(-0.125rem) scale(1.06);
  border-color: #f59e0b;
  box-shadow: 0 0.75rem 1.5rem rgba(245, 158, 11, 0.18);
}

.star-btn:hover svg {
  transform: scale(1.05);
}

.star-btn:active {
  transform: scale(0.97);
}

.star-btn.filled {
  border-color: #f59e0b;
  background: linear-gradient(180deg, #fffdf3 0%, #fffbeb 100%);
  box-shadow:
    0 0.75rem 1.5rem rgba(245, 158, 11, 0.14),
    inset 0 0 0 0.0625rem rgba(255, 255, 255, 0.65);
}

.star-btn.filled svg {
  stroke: #f59e0b;
  fill: #fbbf24;
}

.tag-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag-chip {
  padding: 0.4375rem 1rem;
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

.tag-chip:hover:not(.active) {
  border-color: var(--color-primary-lightest);
  color: var(--color-primary-dark);
  transform: translateY(-0.0625rem);
  box-shadow: 0 0.5rem 1rem rgba(22, 29, 39, 0.06);
}

.tag-chip:active {
  transform: scale(0.98);
}

.tag-chip.active {
  border-color: var(--color-primary-dark);
  background: color-mix(in srgb, var(--color-primary-lightest) 30%, white);
  color: var(--color-primary-dark);
  font-weight: 600;
  box-shadow:
    0 0.625rem 1.25rem rgba(22, 29, 39, 0.08),
    inset 0 0 0 0.0625rem rgba(255, 255, 255, 0.65);
}

.form-textarea {
  width: 100%;
  min-height: 7rem;
  box-sizing: border-box;
  padding: 0.75rem 0.875rem;
  border-radius: 0.875rem;
  border: 0.09375rem solid var(--color-neutral-light-light);
  background: var(--color-neutral-light-white);
  color: var(--color-neutral-dark);
  font-size: 0.82rem;
  font-family: 'Poppins', sans-serif;
  resize: vertical;
  line-height: 1.55;
  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease,
    background 0.18s ease,
    transform 0.18s ease;
  box-shadow: inset 0 0.0625rem 0 rgba(255, 255, 255, 0.7);
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

.modal-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding-top: 1.25rem;
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
  background: linear-gradient(120deg,
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
  background: linear-gradient(180deg,
      color-mix(in srgb, var(--color-primary-darkest) 90%, white) 0%,
      var(--color-primary-darkest) 100%);
  color: #ffffff;
  border-color: var(--color-primary-darkest);
  box-shadow: 0 0.875rem 1.5rem rgba(22, 29, 39, 0.14);
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

@media (max-width: 48rem) {
  .modal-overlay {
    padding: 1rem;
    align-items: flex-end;
  }

  .modal-card {
    width: 100%;
    max-width: 100%;
    border-radius: 1.25rem 1.25rem;
    padding: 1.375rem 1rem 1rem;
    max-height: min(92dvh, 56rem);
    overflow-y: auto;
  }

  .modal-header {
    align-items: flex-start;
    margin-top: 0.5rem;
  }

  .modal-titulo {
    font-size: 1rem;
    padding-right: 1.75rem;
  }

  .modal-subtitulo {
    font-size: 0.78rem;
  }

  .stars-row {
    gap: 0.375rem;
  }

  .star-btn {
    width: 3rem;
    height: 3rem;
    border-radius: 0.75rem;
  }

  .modal-footer {
    flex-direction: column;
    align-items: stretch;
  }

  .btn {
    width: 100%;
    min-width: 100%;
  }
}

@media (max-width: 30rem) {
  .modal-overlay {
    padding: 0.75rem;
  }

  .modal-card {
    padding: 1.125rem 0.875rem 0.875rem;
  }

  .modal-header {
    padding-bottom: 1rem;
    align-items: center;
  }

  .header-icon {
    padding: 0.5rem;
  }

  .header-icon img {
    width: 1.5rem;
    height: 1.5rem;
  }

  .modal-header {
    gap: 0.75rem;
  }

  .form-label {
    font-size: 0.82rem;
  }

  .tag-chips {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
  }

  .tag-chip {
    width: 100%;
    justify-content: center;
  }

  .form-textarea {
    min-height: 6.5rem;
  }
}

@media (min-width: 64rem) {
  .modal-card {
    max-width: 35rem;
  }
}

@media (prefers-reduced-motion: reduce) {

  .modal-card,
  .form-group,
  .btn,
  .btn-fechar,
  .star-btn,
  .tag-chip,
  .form-textarea,
  .header-icon,
  .header-icon-img {
    animation: none !important;
    transition: none !important;
  }
}
</style>