<script setup lang="ts">
defineProps<{ aberto: boolean }>()
const emit = defineEmits<{ fechar: []; irLogin: [] }>()
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="aberto" class="modal-overlay" @click.self="emit('fechar')">
        <div class="modal-card" role="dialog" aria-modal="true" aria-label="Senha redefinida com sucesso">

          <button class="btn-fechar" type="button" aria-label="Fechar" @click="emit('fechar')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
          </button>

          <div class="modal-cabecalho">
            <div class="icon-wrapper" aria-hidden="true">
              <img src="@/assets/icons/success-recover.svg" alt="Ícone de sucesso" width="52" height="52" />
            </div>
            <h2 class="modal-titulo">Senha redefinida com sucesso!</h2>
            <p class="modal-subtitulo">Agora você já pode acessar sua conta normalmente.</p>
          </div>

          <div class="form-acoes">
            <button class="btn-primario btn-bloco" type="button" @click="emit('irLogin')">
              Ir para o login
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
  background: rgba(17, 17, 17, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.25rem;
  z-index: 50;
}

.modal-card {
  width: 100%;
  max-width: 480px;
  background: var(--color-neutral-light-white);
  border-radius: 18px;
  border: 1px solid var(--color-neutral-light-light);
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.18);
  padding: 2rem 2rem 1.75rem;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1rem;
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
  padding: 0.3rem;
  border-radius: 6px;
  transition: color 0.2s ease, background 0.2s ease;
}

.btn-fechar:hover {
  color: var(--color-neutral-dark);
  background: var(--color-neutral-light-light);
}

.modal-cabecalho {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.65rem;
  padding-top: 0.5rem;
  text-align: center;
}

.icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-titulo {
  font-size: 1.55rem;
  font-weight: 700;
  color: var(--color-neutral-dark);
  line-height: 1.2;
}

.modal-subtitulo {
  font-size: 0.88rem;
  color: var(--color-neutral-medium);
  line-height: 1.35;
}

.form-acoes {
  margin-top: 0.25rem;
}

.btn-primario {
  background: var(--color-primary-medium);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 0.88rem;
  font-weight: 700;
  font-family: inherit;
  height: 44px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.25s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-primario::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, transparent 55%);
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: inherit;
}

.btn-primario:hover {
  transform: translateY(-3px) scale(1.01);
  box-shadow: 0 12px 32px rgba(62, 58, 168, 0.42);
}

.btn-primario:hover::after {
  opacity: 1;
}

.btn-primario:active {
  transform: translateY(0) scale(0.98);
  box-shadow: none;
}

.btn-bloco {
  width: 100%;
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
    transform: translateY(14px) scale(0.98);
    opacity: 0;
  }

  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}
</style>