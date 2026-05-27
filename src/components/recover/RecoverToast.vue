<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

type ToastType = 'erro' | 'info' | 'sucesso'

const props = withDefaults(
  defineProps<{
    aberto: boolean
    tipo: ToastType
    mensagem: string
    duracaoMs?: number
  }>(),
  { duracaoMs: 3200 }
)

const emit = defineEmits<{ fechar: [] }>()

const progresso = ref(100)
let raf: number | null = null
let startTs = 0

const estilos = computed(() => {
  if (props.tipo === 'erro') {
    return {
      fundo: 'var(--color-error-light)',
      barra: 'var(--color-error-dark)',
      texto: 'var(--color-error-dark)'
    }
  }
  if (props.tipo === 'sucesso') {
    return {
      fundo: 'var(--color-success-light)',
      barra: 'var(--color-success-dark)',
      texto: 'var(--color-success-dark)'
    }
  }
  return {
    fundo: 'var(--color-neutral-light-lightest)',
    barra: 'var(--color-primary-medium)',
    texto: 'var(--color-primary-medium)'
  }
})

function cancelarAnimacao() {
  if (raf != null) cancelAnimationFrame(raf)
  raf = null
}

function iniciarAnimacao() {
  cancelarAnimacao()
  progresso.value = 100
  startTs = performance.now()

  const tick = (ts: number) => {
    const elapsed = ts - startTs
    const t = Math.min(1, elapsed / props.duracaoMs)
    progresso.value = Math.max(0, 100 * (1 - t))

    if (t >= 1) {
      emit('fechar')
      cancelarAnimacao()
      return
    }
    raf = requestAnimationFrame(tick)
  }

  raf = requestAnimationFrame(tick)
}

watch(
  () => props.aberto,
  (aberto) => {
    if (aberto) iniciarAnimacao()
    else cancelarAnimacao()
  }
)

onMounted(() => {
  if (props.aberto) iniciarAnimacao()
})

onBeforeUnmount(() => cancelarAnimacao())
</script>

<template>
  <Transition name="toast" mode="out-in">
    <div v-if="aberto" class="toast" :style="{ background: estilos.fundo }" role="status" aria-live="polite">
      <div class="toast-conteudo">
        <div class="toast-icone" :style="{ color: estilos.texto }" aria-hidden="true">
          <template v-if="tipo === 'erro'">
            <img src="@/assets/icons/toast-warning.svg" alt="Ícone de aviso" width="24" height="24" />
          </template>
          <template v-else-if="tipo === 'info'">
            <img src="@/assets/icons/toast-mail.svg" alt="Ícone de e-mail" width="24" height="24" />
          </template>
          <template v-else>
            <img src="@/assets/icons/toast-success.svg" alt="Ícone de sucesso" width="24" height="24" />
          </template>
        </div>

        <div class="toast-texto" :style="{ color: estilos.texto }">
          {{ mensagem }}
        </div>

        <button class="toast-fechar" type="button" @click="emit('fechar')" aria-label="Fechar toast">
          ×
        </button>
      </div>

      <div class="toast-progresso">
        <div class="toast-progresso-barra" :style="{ width: `${progresso}%`, background: estilos.barra }" />
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.toast {
  width: 100%;
  border-radius: 14px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  overflow: hidden;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.12);
}

.toast-conteudo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem 0.95rem;
}

.toast-icone {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toast-texto {
  flex: 1;
  font-size: 0.92rem;
  font-weight: 800;
  line-height: 1.25;
}

.toast-fechar {
  border: none;
  background: transparent;
  cursor: pointer;
  color: rgba(0, 0, 0, 0.35);
  font-size: 1.3rem;
  line-height: 1;
  padding: 0.1rem 0.25rem;
  transition: color 0.2s ease, transform 0.2s ease;
}

.toast-fechar:hover {
  color: rgba(0, 0, 0, 0.55);
  transform: scale(1.08);
}

.toast-progresso {
  height: 6px;
  background: rgba(0, 0, 0, 0.06);
}

.toast-progresso-barra {
  height: 100%;
  transition: width 0.1s linear;
}

.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.18s ease, transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(-10px) scale(0.97);
}

.toast-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.97);
}

@media (max-width: 767px) {
  .toast {
    border-radius: 16px;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.14), 0 8px 32px rgba(0, 0, 0, 0.08);
  }

  .toast-conteudo {
    padding: 1rem 1.1rem;
    gap: 0.85rem;
  }

  .toast-icone img {
    width: 28px;
    height: 28px;
  }

  .toast-texto {
    font-size: 0.95rem;
  }

  .toast-fechar {
    font-size: 1.5rem;
    padding: 0.15rem 0.3rem;
    min-width: 32px;
    min-height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>