<script setup lang="ts">
import { ref } from 'vue'
import type { Prestador } from '@/types/prestador'

import ModalAvaliarPrestador from '@/components/provider/modals/ModalAvaliarPrestador.vue'
import ModalSolicitarOrcamento from '@/components/provider/modals/ModalSolicitarOrcamento.vue'
import starProfileIcon from '@/assets/icons/star-profile.svg'
import pinIcon from '@/assets/icons/pin.svg'
import socialMediaIcon from '@/assets/icons/social-media.svg'

const props = defineProps<{
  prestador: Prestador
}>()

const modalAvaliarAberto = ref(false)
const modalSolicitarOrcamentoAberto = ref(false)

function abrirModalAvaliar() {
  modalAvaliarAberto.value = true
}

function fecharModalAvaliar() {
  modalAvaliarAberto.value = false
}

function handlePublicado() {
  modalAvaliarAberto.value = false
}

function abrirModalSolicitarOrcamento() {
  modalSolicitarOrcamentoAberto.value = true
}

function fecharModalSolicitarOrcamento() {
  modalSolicitarOrcamentoAberto.value = false
}

function handleEnviadoOrcamento() {
  modalSolicitarOrcamentoAberto.value = false
}
</script>

<template>
  <div class="profile-hero">
    <div class="profile-hero__banner" role="img" aria-label="Capa do perfil">
      <div class="profile-hero__banner-glow profile-hero__banner-glow--one"></div>
      <div class="profile-hero__banner-glow profile-hero__banner-glow--two"></div>

      <div class="profile-hero__avatar-wrap">
        <img class="profile-hero__avatar" :src="props.prestador.fotoPerfil"
          :alt="`Foto de perfil de ${props.prestador.nome}`" width="96" height="96" loading="eager" />
      </div>
    </div>

    <div class="profile-hero__body">
      <h1 class="profile-hero__name">{{ props.prestador.nome }}</h1>

      <div class="profile-hero__roles">
        <template v-for="(role, i) in props.prestador.roles" :key="role">
          <span>{{ role }}</span>
          <span v-if="i < props.prestador.roles.length - 1" aria-hidden="true">|</span>
        </template>
      </div>

      <div class="profile-hero__actions">
        <button class="btn btn-primary" type="button" @click="abrirModalSolicitarOrcamento">
          Solicitar orçamento
        </button>

        <button class="btn btn-outline" type="button" @click="abrirModalAvaliar">
          Avaliar
        </button>
      </div>

      <div class="profile-hero__meta">
        <div class="meta-chip">
          <img :src="starProfileIcon" alt="" width="13" height="13" aria-hidden="true" />
          {{ props.prestador.nota.toFixed(1) }}
        </div>

        <div class="meta-chip">
          <img :src="pinIcon" alt="" width="13" height="13" aria-hidden="true" />
          {{ props.prestador.area.cidade }} – {{ props.prestador.area.estado }}
        </div>

        <div class="meta-chip">
          <img :src="socialMediaIcon" alt="" width="13" height="13" aria-hidden="true" />
          {{ props.prestador.instagram }}
        </div>
      </div>
    </div>

    <div class="divider"></div>

    <ModalAvaliarPrestador :aberto="modalAvaliarAberto" :prestador="props.prestador" @fechar="fecharModalAvaliar"
      @publicado="handlePublicado" />

    <ModalSolicitarOrcamento :aberto="modalSolicitarOrcamentoAberto" :prestador="props.prestador"
      @fechar="fecharModalSolicitarOrcamento" @enviado="handleEnviadoOrcamento" />
  </div>
</template>

<style scoped>
.profile-hero {
  position: relative;
  overflow-x: hidden;
  overflow-y: visible;
  margin-bottom: 2.5rem;
  animation: hero-fade-up 0.75s cubic-bezier(0.22, 1, 0.36, 1);
}

.profile-hero__banner {
  position: relative;
  min-height: 11.25rem;
  background:
    linear-gradient(135deg,
      var(--color-primary-dark) 0%,
      var(--color-primary-medium) 58%,
      var(--color-primary-light) 100%);
  border-radius: 1rem;
  z-index: 1;
}

.profile-hero__banner::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background:
    linear-gradient(180deg,
      rgba(255, 255, 255, 0.1) 0%,
      rgba(255, 255, 255, 0) 38%,
      rgba(0, 0, 0, 0.08) 100%);
  pointer-events: none;
  z-index: 1;
}

.profile-hero__banner-glow {
  position: absolute;
  border-radius: 9999rem;
  filter: blur(0.625rem);
  opacity: 0.28;
  pointer-events: none;
  animation: hero-float 7s ease-in-out infinite;
  z-index: 0;
}

.profile-hero__banner-glow--one {
  width: 11rem;
  height: 11rem;
  top: -2.5rem;
  left: -1.5rem;
  background: rgba(255, 255, 255, 0.28);
}

.profile-hero__banner-glow--two {
  width: 13rem;
  height: 13rem;
  right: -2rem;
  bottom: -4rem;
  background: rgba(255, 255, 255, 0.18);
  animation-delay: -2s;
}

.profile-hero__avatar-wrap {
  position: absolute;
  bottom: -3.75rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 5;
}

.profile-hero__avatar {
  position: relative;
  z-index: 6;
  width: 9.375rem;
  height: 9.375rem;
  border-radius: 9999rem;
  border: 0.25rem solid var(--color-neutral-light-white);
  object-fit: cover;
  background: var(--color-neutral-light-medium);
  box-shadow:
    0 0.25rem 0.75rem rgba(22, 29, 39, 0.09),
    0 1.25rem 2.5rem rgba(22, 29, 39, 0.12);
  transition:
    transform 220ms ease,
    box-shadow 220ms ease,
    filter 220ms ease;
}

.profile-hero__avatar:hover {
  transform: scale(1.035);
  box-shadow:
    0 0.5rem 1rem rgba(22, 29, 39, 0.1),
    0 1.75rem 3rem rgba(22, 29, 39, 0.16);
  filter: saturate(1.04);
}

.profile-hero__body {
  position: relative;
  z-index: 2;
  padding: 4.25rem 1.5rem 2.5rem;
  text-align: center;
  background-color: transparent;
}

.profile-hero__name {
  font-size: clamp(1.25rem, 1.05rem + 0.7vw, 1.65rem);
  font-weight: 700;
  color: var(--color-neutral-dark);
  letter-spacing: -0.02em;
  margin-bottom: 0.5rem;
  animation: hero-fade-up 0.8s cubic-bezier(0.22, 1, 0.36, 1);
}

.profile-hero__roles {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--color-neutral-medium);
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
  animation: hero-fade-up 0.9s cubic-bezier(0.22, 1, 0.36, 1);
}

.profile-hero__roles span:nth-child(even) {
  font-size: 0.75rem;
  color: var(--color-neutral-medium);
  opacity: 0.75;
}

.profile-hero__actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 1.5625rem;
  flex-wrap: wrap;
  animation: hero-fade-up 1s cubic-bezier(0.22, 1, 0.36, 1);
}

.profile-hero__meta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  animation: hero-fade-up 1.08s cubic-bezier(0.22, 1, 0.36, 1);
}

.btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: 600;
  transition:
    transform 180ms ease,
    box-shadow 220ms ease,
    background 220ms ease,
    color 220ms ease,
    border-color 220ms ease,
    filter 220ms ease;
  border: 0.125rem solid transparent;
  line-height: 1.5;
  width: min(100%, 11.25rem);
  min-height: 2.8125rem;
  cursor: pointer;
  font-family: inherit;
  overflow: hidden;
  isolation: isolate;
  -webkit-tap-highlight-color: transparent;
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

.btn:hover {
  transform: translateY(-0.125rem);
}

.btn:active {
  transform: translateY(0) scale(0.985);
}

.btn:focus-visible {
  outline: 0.1875rem solid color-mix(in srgb, var(--color-primary-light) 55%, white);
  outline-offset: 0.1875rem;
}

.btn-primary {
  background: linear-gradient(180deg,
      var(--color-primary-darkest) 0%,
      var(--color-primary-dark) 100%);
  color: #ffffff;
  border: none;
  box-shadow: 0 0.75rem 1.5rem rgba(22, 29, 39, 0.12);
}

.btn-primary:hover {
  background: linear-gradient(180deg,
      var(--color-primary-dark) 0%,
      var(--color-primary-medium) 100%);
  box-shadow: 0 1rem 2rem rgba(22, 29, 39, 0.16);
  filter: saturate(1.05);
}

.btn-outline {
  background: rgba(255, 255, 255, 0.76);
  backdrop-filter: blur(0.5rem);
  color: var(--color-primary-darkest);
  border-color: var(--color-primary-darkest);
  box-shadow: 0 0.5rem 1.25rem rgba(22, 29, 39, 0.06);
}

.btn-outline:hover {
  background: var(--color-primary-medium);
  color: #ffffff;
  border-color: var(--color-primary-medium);
  box-shadow: 0 1rem 2rem rgba(22, 29, 39, 0.14);
}

.meta-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  border: 0.0625rem solid var(--color-neutral-light-light);
  border-radius: 9999rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--color-neutral-darkest);
  box-shadow: 0 0.25rem 0.3125rem 0 rgba(0, 0, 0, 0.05);
  background:
    linear-gradient(180deg,
      rgba(255, 255, 255, 0.92) 0%,
      rgba(255, 255, 255, 0.82) 100%);
  backdrop-filter: blur(0.375rem);
  transition:
    transform 180ms ease,
    box-shadow 220ms ease,
    border-color 220ms ease,
    background 220ms ease;
  min-height: 2rem;
}

.meta-chip:hover {
  transform: translateY(-0.125rem);
  box-shadow: 0 0.75rem 1.125rem rgba(22, 29, 39, 0.08);
  border-color: color-mix(in srgb, var(--color-primary-lightest) 75%, white);
}

.meta-chip img {
  flex-shrink: 0;
}

.divider {
  height: 0.0625rem;
  background: var(--color-neutral-light-light);
  margin: 0 auto;
  width: 100%;
}

@keyframes hero-fade-up {
  from {
    opacity: 0;
    transform: translateY(0.75rem);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes hero-float {

  0%,
  100% {
    transform: translate3d(0, 0, 0) scale(1);
  }

  50% {
    transform: translate3d(0, -0.5rem, 0) scale(1.03);
  }
}

@media (max-width: 64rem) {
  .profile-hero__banner {
    min-height: 10.5rem;
  }

  .profile-hero__avatar {
    width: 8.75rem;
    height: 8.75rem;
  }

  .profile-hero__avatar-wrap {
    bottom: -3.5rem;
  }

  .profile-hero__body {
    padding-top: 4rem;
  }
}

@media (max-width: 48rem) {
  .profile-hero {
    margin-bottom: 2rem;
  }

  .profile-hero__banner {
    min-height: 9.5rem;
    border-radius: 0.875rem;
  }

  .profile-hero__avatar {
    width: 7.5rem;
    height: 7.5rem;
    border-width: 0.1875rem;
  }

  .profile-hero__avatar-wrap {
    bottom: -3rem;
  }

  .profile-hero__body {
    padding: 3.5rem 1rem 2rem;
  }

  .profile-hero__actions {
    gap: 0.625rem;
  }

  .btn {
    width: min(100%, 14rem);
  }

  .profile-hero__meta {
    gap: 0.625rem;
  }
}

@media (max-width: 37.5rem) {
  .profile-hero {
    margin-bottom: 1.75rem;
  }

  .profile-hero__banner {
    min-height: 8.75rem;
    border-radius: 0.75rem;
  }

  .profile-hero__banner-glow--one {
    width: 8rem;
    height: 8rem;
    top: -1.25rem;
    left: -1rem;
  }

  .profile-hero__banner-glow--two {
    width: 9.5rem;
    height: 9.5rem;
    right: -1.5rem;
    bottom: -2.5rem;
  }

  .profile-hero__avatar {
    width: 6.75rem;
    height: 6.75rem;
  }

  .profile-hero__avatar-wrap {
    bottom: -2.75rem;
  }

  .profile-hero__body {
    padding: 3.25rem 0.875rem 1.75rem;
  }

  .profile-hero__name {
    font-size: clamp(1.125rem, 1rem + 0.8vw, 1.35rem);
  }

  .profile-hero__roles {
    font-size: 0.8125rem;
    gap: 0.375rem;
    margin-bottom: 1rem;
  }

  .profile-hero__actions {
    flex-direction: column;
    align-items: stretch;
    width: 100%;
    max-width: 20rem;
    margin-inline: auto;
  }

  .btn {
    width: 100%;
  }

  .profile-hero__meta {
    flex-direction: column;
    align-items: stretch;
    width: 100%;
    max-width: 20rem;
    margin-inline: auto;
  }

  .meta-chip {
    width: 100%;
    justify-content: center;
    padding: 0.5rem 0.75rem;
  }
}

@media (max-width: 22.5rem) {
  .profile-hero__body {
    padding-inline: 0.75rem;
  }

  .profile-hero__name {
    font-size: 1.0625rem;
  }

  .profile-hero__roles {
    font-size: 0.75rem;
  }

  .btn {
    min-height: 2.75rem;
    font-size: 0.8125rem;
  }

  .meta-chip {
    font-size: 0.71875rem;
  }
}

@media (hover: none) {

  .btn:hover,
  .meta-chip:hover,
  .profile-hero__avatar:hover {
    transform: none;
  }

  .btn:hover::before {
    transform: translateX(-130%);
  }
}

@media (prefers-reduced-motion: reduce) {

  .profile-hero,
  .profile-hero__name,
  .profile-hero__roles,
  .profile-hero__actions,
  .profile-hero__meta,
  .profile-hero__banner-glow,
  .btn,
  .btn::before,
  .meta-chip,
  .profile-hero__avatar {
    animation: none !important;
    transition: none !important;
  }
}
</style>