<script setup lang="ts">
defineProps<{
    aberto: boolean
    titulo: string
    subtitulo: string
    botaoTexto: string
}>()

const emit = defineEmits(['fechar'])

function fechar() {
    emit('fechar')
}
</script>

<template>
    <Teleport to="body">
        <Transition name="modal">
            <div v-if="aberto" class="modal-overlay">
                <div class="modal-card" role="dialog" aria-modal="true" aria-label="Conta criada com sucesso">

                    <div class="modal-cabecalho">
                        <div class="icon-wrapper" aria-hidden="true">
                            <img src="@/assets/icons/success-recover.svg" alt="Ícone de sucesso" width="52"
                                height="52" />
                        </div>
                        <h2 class="modal-titulo">{{ titulo }}</h2>
                        <p class="modal-subtitulo">{{ subtitulo }}</p>
                    </div>

                    <div class="form-acoes">
                        <button class="btn-primario btn" type="button" @click="fechar()">
                            {{ botaoTexto }}
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
    display: flex;
    justify-content: center;
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

.btn-primario {
  background: linear-gradient(180deg,
      color-mix(in srgb, var(--color-primary-darkest) 90%, white) 0%,
      var(--color-primary-darkest) 100%);
  color: #ffffff;
  border-color: var(--color-primary-darkest);
  box-shadow: 0 0.875rem 1.5rem rgba(22, 29, 39, 0.14);
}

.btn-primario:hover {
  background: linear-gradient(180deg,
      color-mix(in srgb, var(--color-primary-dark) 90%, white) 0%,
      var(--color-primary-dark) 100%);
  border-color: var(--color-primary-dark);
  box-shadow: 0 1rem 2rem rgba(22, 29, 39, 0.18);
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