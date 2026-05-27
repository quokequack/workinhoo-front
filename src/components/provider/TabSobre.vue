<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Prestador } from '@/types/prestador'

import ModalSolicitarOrcamento from '@/components/provider/modals/ModalSolicitarOrcamento.vue'
import locationIcon from '@/assets/icons/icon-location.svg'
import specialtyIcon from '@/assets/icons/specialty.svg'

const props = defineProps<{
  prestador: Prestador
}>()

const bioExpanded = ref(false)
const BIO_LIMIT = 800

const modalSolicitarOrcamentoAberto = ref(false)

function abrirModalSolicitarOrcamento() {
  modalSolicitarOrcamentoAberto.value = true
}

function fecharModalSolicitarOrcamento() {
  modalSolicitarOrcamentoAberto.value = false
}

function handleEnviadoOrcamento() {
  modalSolicitarOrcamentoAberto.value = false
}

const hasLongBio = computed(() => {
  return (props.prestador.bio?.length ?? 0) > BIO_LIMIT
})

const displayedBio = computed(() => {
  const bio = props.prestador.bio ?? ''

  if (!hasLongBio.value || bioExpanded.value) {
    return bio
  }

  return bio.slice(0, BIO_LIMIT) + '...'
})
</script>

<template>
  <div id="panel-sobre" role="tabpanel" aria-labelledby="tab-sobre">
    <div class="sobre-grid">
      <div class="card">
        <h2 class="card__title">Conheça o profissional</h2>
        <p class="card__body">
          {{ displayedBio }}
        </p>
        <button v-if="hasLongBio" class="show-more" :aria-expanded="bioExpanded" @click="bioExpanded = !bioExpanded">
          {{ bioExpanded ? 'Mostrar menos' : 'Mostrar mais' }}
        </button>
      </div>

      <div class="card areas-card">
        <h2 class="card__title">
          <span class="areas-card__title-inner">
            <img :src="locationIcon" alt="" aria-hidden="true" width="33" height="33" />
            Áreas atendidas
          </span>
        </h2>
        <p class="areas-card__location">{{ prestador.area.cidade }} – {{ prestador.area.estado }}</p>
        <p class="areas-card__label">Atende:</p>
        <div class="bairro-tags">
          <span v-for="bairro in prestador.area.bairros" :key="bairro" class="bairro-tag">
            {{ bairro }}
          </span>
        </div>
      </div>
    </div>

    <h2 class="section-title">Especialidade(s)</h2>

    <div class="especialidades-grid">
      <div v-for="esp in prestador.especialidades" :key="esp.id" class="especialidade-card">
        <div class="especialidade-card__header">
          <div class="especialidade-icon" aria-hidden="true">
            <img :src="specialtyIcon" alt="Ícone de especialidade" width="35" height="35" />
          </div>
          <div>
            <div class="especialidade-card__name">{{ esp.nome }}</div>
            <div class="especialidade-card__sub">Serviços oferecidos</div>
          </div>
        </div>

        <div class="servico-tags">
          <span v-for="servico in esp.servicos" :key="servico" class="servico-tag">
            {{ servico }}
          </span>
        </div>

        <div class="especialidade-card__footer">
          <div>
            <div class="preco-label">A partir de:</div>
            <div class="preco-valor">
              R$ {{ esp.precoBase.toFixed(2).replace('.', ',') }}
            </div>
          </div>
          <button class="btn btn-primary" type="button" @click="abrirModalSolicitarOrcamento">
            Solicitar orçamento
          </button>
        </div>
      </div>
    </div>

    <ModalSolicitarOrcamento :aberto="modalSolicitarOrcamentoAberto" :prestador="props.prestador"
      @fechar="fecharModalSolicitarOrcamento" @enviado="handleEnviadoOrcamento" />
  </div>
</template>

<style scoped>
#panel-sobre {
  animation: panel-fade-up 0.75s cubic-bezier(0.22, 1, 0.36, 1);
}

.sobre-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(16.25rem, 0.5fr);
  gap: 1.5rem;
  margin: 2rem 1.5rem;
  padding-bottom: 2rem;
  border-bottom: 0.0625rem solid var(--color-neutral-light-medium);
}

.card {
  position: relative;
  background: linear-gradient(180deg,
      color-mix(in srgb, var(--color-neutral-light-white) 97%, white) 0%,
      var(--color-neutral-light-white) 100%);
  border: 0.0625rem solid var(--color-neutral-light-light);
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow:
    0 0.0625rem 0.1875rem rgba(22, 29, 39, 0.07),
    0 0.75rem 1.75rem rgba(22, 29, 39, 0.04);
  min-width: 0;
  overflow: hidden;
  transition:
    transform 260ms cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 260ms cubic-bezier(0.22, 1, 0.36, 1),
    border-color 220ms ease,
    background 220ms ease;
}

.card::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    linear-gradient(135deg,
      color-mix(in srgb, var(--color-primary-lightest) 14%, transparent) 0%,
      transparent 38%,
      color-mix(in srgb, var(--color-primary-lightest) 8%, transparent) 100%);
  opacity: 0;
  transition: opacity 260ms ease;
  pointer-events: none;
}

.card:hover {
  transform: translateY(-0.1875rem);
  border-color: color-mix(in srgb, var(--color-primary-lightest) 55%, white);
  box-shadow:
    0 0.25rem 0.75rem rgba(22, 29, 39, 0.08),
    0 1.25rem 2.5rem rgba(22, 29, 39, 0.08);
}

.card:hover::before {
  opacity: 1;
}

.card__title {
  font-size: 1.5625rem;
  font-weight: 600;
  color: var(--color-neutral-medium);
  margin-bottom: 1rem;
  line-height: 1.2;
}

.card__body {
  font-size: 0.875rem;
  color: var(--color-neutral-medium);
  line-height: 1.75;
}

.show-more {
  color: var(--color-primary-medium);
  font-weight: 600;
  font-size: 0.875rem;
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  margin-top: 0.5rem;
  transition:
    color 180ms ease,
    transform 180ms ease,
    opacity 180ms ease;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.show-more:hover {
  color: var(--color-primary-dark);
  transform: translateX(0.125rem);
}

.areas-card__title-inner {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.areas-card__title-inner img {
  flex-shrink: 0;
  transition: transform 220ms ease;
}

.areas-card:hover .areas-card__title-inner img {
  transform: scale(1.05) rotate(-4deg);
}

.areas-card__location {
  font-weight: 700;
  font-size: 0.875rem;
  color: var(--color-neutral-dark);
  margin-bottom: 0.25rem;
}

.areas-card__label {
  font-size: 0.75rem;
  color: var(--color-neutral-light);
  margin-bottom: 0.75rem;
}

.bairro-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.bairro-tag {
  padding: 0.25rem 0.75rem;
  background: var(--color-secondary-lightest);
  color: var(--color-secondary-dark);
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  transition:
    transform 180ms ease,
    box-shadow 220ms ease,
    background 220ms ease;
}

.bairro-tag:hover {
  transform: translateY(-0.0625rem);
  box-shadow: 0 0.5rem 1rem rgba(22, 29, 39, 0.06);
}

.section-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-neutral-dark);
  margin: 1.25rem 1.5rem;
  animation: section-fade 0.7s cubic-bezier(0.22, 1, 0.36, 1);
}

.especialidades-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 17.5rem), 1fr));
  gap: 1.5rem;
  margin: 0 1.5rem;
  align-items: stretch;
}

.especialidade-card {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--color-neutral-light-white);
  border: 0.0625rem solid var(--color-neutral-light-light);
  border-radius: 1rem;
  box-shadow:
    0 0.0625rem 0.1875rem rgba(22, 29, 39, 0.07),
    0 0.75rem 1.75rem rgba(22, 29, 39, 0.04);
  min-width: 0;
  overflow: hidden;
  transition:
    transform 260ms cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 260ms cubic-bezier(0.22, 1, 0.36, 1),
    border-color 220ms ease;
}

.especialidade-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    linear-gradient(145deg,
      color-mix(in srgb, var(--color-primary-lightest) 12%, transparent) 0%,
      transparent 45%,
      color-mix(in srgb, var(--color-primary-lightest) 8%, transparent) 100%);
  opacity: 0;
  transition: opacity 260ms ease;
  pointer-events: none;
}

.especialidade-card:hover {
  transform: translateY(-0.25rem);
  border-color: color-mix(in srgb, var(--color-primary-lightest) 55%, white);
  box-shadow:
    0 0.375rem 1rem rgba(22, 29, 39, 0.08),
    0 1.5rem 2.75rem rgba(22, 29, 39, 0.08);
}

.especialidade-card:hover::before {
  opacity: 1;
}

.especialidade-card__header {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 1rem;
  padding: 1.5rem 1.5rem 0;
}

.especialidade-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: transform 220ms ease;
}

.especialidade-card:hover .especialidade-icon {
  transform: translateY(-0.125rem) scale(1.04);
}

.especialidade-card__name {
  font-weight: 700;
  font-size: 1rem;
  color: var(--color-neutral-medium);
  word-break: break-word;
  line-height: 1.35;
}

.especialidade-card__sub {
  font-size: 0.75rem;
  color: var(--color-neutral-light-dark);
}

.servico-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  padding: 0 1.5rem;
}

.servico-tag {
  padding: 0.25rem 0.75rem;
  background: var(--color-primary-lightest);
  border-radius: 0.5rem;
  font-size: 0.75rem;
  color: var(--color-neutral-dark);
  font-weight: 500;
  transition:
    transform 180ms ease,
    background 220ms ease,
    box-shadow 220ms ease;
}

.servico-tag:hover {
  transform: translateY(-0.0625rem);
  box-shadow: 0 0.5rem 1rem rgba(22, 29, 39, 0.05);
}

.especialidade-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom-left-radius: 1rem;
  border-bottom-right-radius: 1rem;
  border-top: 0.0625rem solid var(--color-neutral-light-light);
  background: linear-gradient(
    180deg,
    color-mix(in srgb, var(--color-neutral-light-light) 94%, white) 0%,
    var(--color-neutral-light-light) 100%
  );
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: auto;
}

.preco-label {
  font-size: 0.75rem;
  color: var(--color-neutral-medium);
  margin-bottom: 0.125rem;
}

.preco-valor {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-neutral-dark);
}

.btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border-radius: 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  transition:
    transform 220ms cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 220ms cubic-bezier(0.22, 1, 0.36, 1),
    background 220ms ease,
    border-color 220ms ease,
    filter 220ms ease;
  border: 0.125rem solid transparent;
  line-height: 1.5;
  font-family: inherit;
  cursor: pointer;
  overflow: hidden;
  isolation: isolate;
  min-height: 2.75rem;
}

.btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    linear-gradient(120deg,
      transparent 0%,
      rgba(255, 255, 255, 0.22) 35%,
      transparent 70%);
  transform: translateX(-130%);
  transition: transform 480ms ease;
  z-index: 0;
}

.btn:hover::before {
  transform: translateX(130%);
}

.btn>* {
  position: relative;
  z-index: 1;
}

.btn:active {
  transform: scale(0.985);
}

.btn-primary {
  background: linear-gradient(180deg,
      color-mix(in srgb, var(--color-primary-dark) 92%, white) 0%,
      var(--color-primary-dark) 100%);
  color: var(--color-neutral-light-white);
  box-shadow: 0 0.625rem 1.5rem rgba(22, 29, 39, 0.1);
}

.btn-primary:hover {
  background: linear-gradient(180deg,
      color-mix(in srgb, var(--color-primary-dark) 86%, white) 0%,
      var(--color-primary-medium) 100%);
  border-color: var(--color-primary-dark);
  box-shadow: 0 1rem 2rem rgba(22, 29, 39, 0.14);
  transform: translateY(-0.125rem);
  filter: saturate(1.04);
}

@keyframes panel-fade-up {
  from {
    opacity: 0;
    transform: translateY(0.875rem);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes section-fade {
  from {
    opacity: 0;
    transform: translateY(0.5rem);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 75rem) {

  .sobre-grid,
  .especialidades-grid,
  .section-title {
    margin-left: 1.25rem;
    margin-right: 1.25rem;
  }
}

@media (max-width: 56.25rem) {
  .sobre-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 42.5rem) {
  .sobre-grid {
    margin: 1.5rem 1rem;
    gap: 1rem;
    padding-bottom: 1.5rem;
  }

  .section-title {
    margin: 1.25rem 1rem 1rem;
    font-size: 1.125rem;
  }

  .especialidades-grid {
    margin: 0 1rem;
    gap: 1rem;
    grid-template-columns: 1fr;
  }

  .card,
  .especialidade-card__header,
  .servico-tags,
  .especialidade-card__footer {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .card {
    padding-top: 1.25rem;
    padding-bottom: 1.25rem;
  }

  .card__title {
    font-size: 1.25rem;
  }

  .especialidade-card__footer {
    flex-direction: column;
    align-items: stretch;
  }

  .btn {
    width: 100%;
  }
}

@media (max-width: 30rem) {
  .sobre-grid {
    margin: 1.25rem 0.875rem;
  }

  .section-title {
    margin: 1.125rem 0.875rem 0.875rem;
  }

  .especialidades-grid {
    margin: 0 0.875rem;
  }

  .card {
    border-radius: 0.875rem;
  }

  .especialidade-card {
    border-radius: 0.875rem;
  }

  .especialidade-card__footer {
    border-bottom-left-radius: 0.875rem;
    border-bottom-right-radius: 0.875rem;
  }

  .card__body,
  .areas-card__location,
  .show-more {
    font-size: 0.8125rem;
  }

  .bairro-tag,
  .servico-tag,
  .preco-label,
  .especialidade-card__sub,
  .areas-card__label,
  .btn {
    font-size: 0.75rem;
  }

  .preco-valor {
    font-size: 1rem;
  }
}

@media (hover: none) {

  .card:hover,
  .especialidade-card:hover,
  .bairro-tag:hover,
  .servico-tag:hover,
  .btn-primary:hover,
  .show-more:hover {
    transform: none;
  }

  .card:hover::before,
  .especialidade-card:hover::before {
    opacity: 0;
  }

  .btn:hover::before {
    transform: translateX(-130%);
  }
}

@media (prefers-reduced-motion: reduce) {

  #panel-sobre,
  .sobre-grid,
  .card,
  .card::before,
  .show-more,
  .bairro-tag,
  .section-title,
  .especialidade-card,
  .especialidade-card::before,
  .especialidade-icon,
  .servico-tag,
  .btn,
  .btn::before {
    animation: none !important;
    transition: none !important;
  }
}
</style>