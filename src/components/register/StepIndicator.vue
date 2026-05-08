<script setup lang="ts">
defineProps<{ stepAtual: number }>()
const rotulos = ['Dados pessoais', 'Prestação de serviços']
</script>

<template>
  <div class="step-indicador">
    <template v-for="n in 2" :key="n">
      <div class="step-item" :class="{
        'step-ativo': stepAtual === n,
        'step-concluido': stepAtual > n,
        'step-pendente': stepAtual < n
      }">
        <div class="step-circulo">
          <Transition name="step-icone" mode="out-in">
            <svg v-if="stepAtual > n" key="check" width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
            <span v-else :key="n">{{ n }}</span>
          </Transition>
        </div>
        <span class="step-rotulo">{{ rotulos[n - 1] }}</span>
      </div>
      <div v-if="n < 2" class="step-linha" :class="{ 'step-linha-concluida': stepAtual > n }" />
    </template>
  </div>
</template>

<style scoped>
.step-indicador {
  display: flex;
  align-items: flex-start;
  padding: 1.5rem 1.25rem 1rem;
}

.step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  position: relative;
  z-index: 1;
}

.step-circulo {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.78rem;
  font-weight: 700;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  will-change: transform;
}

.step-ativo .step-circulo {
  background: var(--color-primary-medium);
  color: white;
  box-shadow: 0 0 0 5px rgba(62, 58, 168, 0.18), 0 4px 12px rgba(62, 58, 168, 0.3);
  transform: scale(1.1);
}

.step-concluido .step-circulo {
  background: var(--color-primary-medium);
  color: white;
  transform: scale(1);
}

.step-pendente .step-circulo {
  background: var(--color-neutral-light-light);
  color: var(--color-neutral-light-dark);
}

.step-rotulo {
  font-size: 0.68rem;
  font-weight: 600;
  white-space: nowrap;
  transition: color 0.25s ease, font-weight 0.25s ease;
}

.step-ativo .step-rotulo {
  color: var(--color-neutral-darkest);
  font-weight: 700;
}

.step-concluido .step-rotulo {
  color: var(--color-neutral-medium);
}

.step-pendente .step-rotulo {
  color: var(--color-neutral-light-dark);
}

.step-linha {
  flex: 1;
  height: 2px;
  background: var(--color-neutral-light-light);
  margin-top: 14px;
  transition: background 0.4s ease;
}

.step-linha-concluida {
  background: var(--color-primary-medium);
}

.step-icone-enter-active,
.step-icone-leave-active {
  transition: opacity 0.2s ease, transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.step-icone-enter-from {
  opacity: 0;
  transform: scale(0.4) rotate(-90deg);
}

.step-icone-leave-to {
  opacity: 0;
  transform: scale(0.4) rotate(90deg);
}

@media (min-width: 768px) {
  .step-indicador {
    padding: 2rem 2.5rem 1.5rem;
  }

  .step-circulo {
    width: 34px;
    height: 34px;
    font-size: 0.82rem;
  }

  .step-rotulo {
    font-size: 0.72rem;
  }
}
</style>
