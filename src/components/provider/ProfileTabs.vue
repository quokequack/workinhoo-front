<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export type TabId = 'sobre' | 'portfolio' | 'avaliacoes'

const route = useRoute()
const router = useRouter()

const tabs = [
  { id: 'sobre' as TabId, label: 'Sobre', name: 'provider-details-about' },
  { id: 'portfolio' as TabId, label: 'Portfólio', name: 'provider-details-portfolio' },
  { id: 'avaliacoes' as TabId, label: 'Avaliações', name: 'provider-details-reviews' },
]

const activeTab = computed<TabId>(() => {
  if (route.name === 'provider-details-portfolio') return 'portfolio'
  if (route.name === 'provider-details-reviews') return 'avaliacoes'
  return 'sobre'
})

function changeTab(routeName: string) {
  router.push({
    name: routeName,
    params: { id: route.params.id },
  })
}
</script>

<template>
  <nav class="profile-tabs" role="tablist" aria-label="Seções do perfil">
    <button v-for="tab in tabs" :key="tab.id" class="tab-btn" :class="{ active: activeTab === tab.id }" role="tab"
      :aria-selected="activeTab === tab.id" @click="changeTab(tab.name)">
      <span class="tab-btn__label">{{ tab.label }}</span>
    </button>
  </nav>
</template>

<style scoped>
.profile-tabs {
  display: flex;
  gap: 0.75rem;
  width: 100%;
  padding: 0 1.5rem;
  margin-bottom: 1.5rem;
  box-sizing: border-box;
  flex-wrap: wrap;
  align-items: center;
  animation: tabs-fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1);
}

.tab-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 2.75rem;
  min-width: 0;
  padding: 0.5rem 1.25rem;
  border: none;
  border-radius: 0.875rem;
  font-family: inherit;
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.2;
  text-align: center;
  white-space: nowrap;
  color: var(--color-primary-darkest);
  cursor: pointer;
  overflow: hidden;
  isolation: isolate;
  -webkit-tap-highlight-color: transparent;
  transform: translateY(0);
  background: linear-gradient(180deg,
      color-mix(in srgb, var(--color-neutral-light-white) 96%, white) 0%,
      var(--color-neutral-light-white) 100%);
  box-shadow:
    0 0 0 0.0625rem rgba(22, 29, 39, 0.04),
    0 0.375rem 1.125rem rgba(0, 0, 0, 0.07);
  transition:
    transform 220ms cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 240ms cubic-bezier(0.22, 1, 0.36, 1),
    color 180ms ease,
    background 220ms ease,
    border-color 220ms ease,
    opacity 180ms ease;
}

.tab-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background: linear-gradient(120deg,
      transparent 0%,
      rgba(255, 255, 255, 0.34) 35%,
      transparent 70%);
  transform: translateX(-140%);
  transition: transform 520ms cubic-bezier(0.22, 1, 0.36, 1);
}

.tab-btn__label {
  position: relative;
  z-index: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: transform 180ms ease;
}

.tab-btn:active {
  transform: translateY(0) scale(0.985);
}

.tab-btn:focus-visible {
  outline: 0.1875rem solid color-mix(in srgb, var(--color-primary-light) 58%, white);
  outline-offset: 0.1875rem;
}

.tab-btn.active {
  background: linear-gradient(180deg,
      color-mix(in srgb, var(--color-primary-darkest) 92%, white) 0%,
      var(--color-primary-darkest) 100%);
  color: #ffffff;
  box-shadow:
    0 0.125rem 0.375rem rgba(22, 29, 39, 0.08),
    0 0.875rem 1.875rem rgba(22, 29, 39, 0.14);
}

.tab-btn.active::before {
  background: linear-gradient(120deg,
      transparent 0%,
      rgba(255, 255, 255, 0.18) 35%,
      transparent 70%);
}

@keyframes tabs-fade-up {
  from {
    opacity: 0;
    transform: translateY(0.625rem);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (hover: hover) and (pointer: fine) {
  .tab-btn:hover {
    color: var(--color-primary-medium);
    transform: translateY(-0.125rem);
    box-shadow:
      0 0 0 0.0625rem color-mix(in srgb, var(--color-primary-lightest) 60%, white),
      0 0.75rem 1.75rem rgba(22, 29, 39, 0.1);
  }

  .tab-btn:hover::before {
    transform: translateX(140%);
  }

  .tab-btn:hover .tab-btn__label {
    transform: translateY(-0.03125rem);
  }

  .tab-btn.active:hover {
    color: #ffffff;
    box-shadow:
      0 0.125rem 0.375rem rgba(22, 29, 39, 0.08),
      0 0.875rem 1.875rem rgba(22, 29, 39, 0.14);
  }
}

@media (max-width: 64rem) {
  .profile-tabs {
    padding: 0 1.25rem;
    margin-bottom: 1.375rem;
  }

  .tab-btn {
    min-height: 2.625rem;
    padding: 0.5rem 1.125rem;
  }
}

@media (max-width: 48rem) {
  .profile-tabs {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    width: 100%;
    gap: 0.625rem;
    padding: 0 1rem;
    margin-bottom: 1.25rem;
    align-items: stretch;
  }

  .tab-btn {
    width: 100%;
    min-width: 0;
    min-height: 2.75rem;
    padding: 0.6875rem 0.75rem;
    font-size: 0.8125rem;
  }
}

@media (max-width: 30rem) {
  .profile-tabs {
    padding: 0 0.875rem;
    margin-bottom: 1.125rem;
    gap: 0.5rem;
  }

  .tab-btn {
    min-height: 2.75rem;
    border-radius: 0.75rem;
    font-size: 0.78125rem;
    padding: 0.6875rem 0.5rem;
  }
}

@media (prefers-reduced-motion: reduce) {

  .profile-tabs,
  .tab-btn,
  .tab-btn::before,
  .tab-btn__label {
    animation: none !important;
    transition: none !important;
  }
}
</style>