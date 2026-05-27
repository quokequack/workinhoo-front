<script setup lang="ts">
import { computed } from 'vue'
import type { PortfolioItem } from '@/types/prestador'

const props = defineProps<{
    aberto: boolean
    item: PortfolioItem | null
}>()

const emit = defineEmits<{
    fechar: []
}>()

const categoriasTexto = computed(() => {
    if (!props.item?.categorias?.length) return []
    return props.item.categorias.slice(0, 2)
})
</script>

<template>
    <Teleport to="body">
        <Transition name="modal">
            <div v-if="aberto && item" class="modal-overlay" @click.self="emit('fechar')">
                <div class="modal-card" role="dialog" aria-modal="true" :aria-label="item.titulo">
                    <button class="btn-fechar" type="button" aria-label="Fechar" @click="emit('fechar')">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2.6"
                                stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </button>

                    <img class="modal-imagem" :src="item.imagemUrl" :alt="item.alt" width="720" height="720" />

                    <div class="modal-content">
                        <h2 class="modal-titulo">{{ item.titulo }}</h2>

                        <p class="modal-descricao">
                            {{ item.descricao }}
                        </p>

                        <div class="modal-footer">
                            <div class="modal-tags" v-if="categoriasTexto.length">
                                <span v-for="categoria in categoriasTexto" :key="categoria" class="modal-tag">
                                    {{ categoria }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <p class="modal-data">
                        {{ item.data }}
                    </p>
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
        radial-gradient(circle at top, rgba(125, 86, 255, 0.1), transparent 32%),
        rgba(15, 18, 28, 0.52);
    backdrop-filter: blur(0.75rem);
    -webkit-backdrop-filter: blur(0.75rem);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
    z-index: 60;
    overflow-y: auto;
}

.modal-card {
    width: min(100%, 31.25rem);
    background:
        linear-gradient(180deg, rgba(255, 255, 255, 0.96) 0%, #efefef 100%);
    position: relative;
    overflow: hidden;
    padding: 0 0.5rem 1.125rem;
    margin: auto 0;
    border-radius: 1.125rem;
    box-shadow:
        0 1.75rem 4rem rgba(12, 18, 28, 0.2),
        0 0.375rem 1rem rgba(12, 18, 28, 0.08);
    border: 0.0625rem solid rgba(255, 255, 255, 0.55);
    transform-origin: center;
}

.modal-card::before {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    background:
        linear-gradient(135deg, rgba(255, 255, 255, 0.35), transparent 30%, transparent 70%, rgba(255, 255, 255, 0.18));
}

.btn-fechar {
    position: absolute;
    top: 0.625rem;
    right: 0.75rem;
    z-index: 3;
    width: 2.25rem;
    height: 2.25rem;
    border: 0;
    background: rgba(255, 255, 255, 0.72);
    color: #1f2937;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 9999rem;
    backdrop-filter: blur(0.375rem);
    -webkit-backdrop-filter: blur(0.375rem);
    box-shadow: 0 0.375rem 1rem rgba(31, 41, 55, 0.12);
    transition:
        transform 0.22s ease,
        opacity 0.22s ease,
        background 0.22s ease,
        box-shadow 0.22s ease;
}

.btn-fechar:hover {
    opacity: 1;
    transform: translateY(-0.0625rem) scale(1.04);
    background: rgba(255, 255, 255, 0.92);
    box-shadow: 0 0.625rem 1.25rem rgba(31, 41, 55, 0.16);
}

.btn-fechar:active {
    transform: scale(0.96);
}

.modal-imagem {
    width: 90%;
    margin: 4.375rem auto 0;
    border-radius: 0.875rem;
    height: auto;
    display: block;
    object-fit: contain;
    background: var(--color-neutral-light-medium);
    box-shadow:
        0 1rem 2rem rgba(12, 18, 28, 0.1),
        0 0.125rem 0.5rem rgba(12, 18, 28, 0.06);
    transition:
        transform 0.35s ease,
        box-shadow 0.35s ease,
        filter 0.35s ease;
}

.modal-card:hover .modal-imagem {
    transform: translateY(-0.125rem) scale(1.01);
    box-shadow:
        0 1.25rem 2.5rem rgba(12, 18, 28, 0.12),
        0 0.25rem 0.75rem rgba(12, 18, 28, 0.08);
    filter: saturate(1.02);
}

.modal-content {
    padding: 1rem 1.5625rem 0;
}

.modal-titulo {
    font-size: 1.5rem;
    line-height: 1.08;
    font-weight: 700;
    color: #243247;
    margin: 0 0 0.625rem;
    letter-spacing: -0.02em;
    animation: fade-up 0.45s ease both;
    animation-delay: 0.06s;
}

.modal-descricao {
    max-width: 45rem;
    font-size: 0.8125rem;
    line-height: 1.45;
    font-weight: 400;
    color: #5f7088;
    margin: 0 0 0.625rem;
    animation: fade-up 0.45s ease both;
    animation-delay: 0.1s;
}

.modal-footer {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 1rem;
}

.modal-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.625rem;
    animation: fade-up 0.45s ease both;
    animation-delay: 0.14s;
}

.modal-tag {
    display: inline-flex;
    align-items: center;
    min-height: 2rem;
    padding: 0 0.875rem;
    border-radius: 0.625rem;
    background:
        linear-gradient(180deg,
            color-mix(in srgb, var(--color-primary-lightest) 88%, white) 0%,
            var(--color-primary-lightest) 100%);
    color: var(--color-neutral-dark);
    font-size: 0.8125rem;
    font-weight: 600;
    white-space: nowrap;
    box-shadow:
        0 0.375rem 0.875rem rgba(22, 29, 39, 0.06),
        inset 0 0 0 0.0625rem rgba(255, 255, 255, 0.65);
    transition:
        transform 0.18s ease,
        box-shadow 0.18s ease,
        filter 0.18s ease;
}

.modal-tag:hover {
    transform: translateY(-0.0625rem);
    box-shadow:
        0 0.625rem 1.25rem rgba(22, 29, 39, 0.1),
        inset 0 0 0 0.0625rem rgba(255, 255, 255, 0.72);
    filter: brightness(1.01);
}

.modal-data {
    font-size: 0.8125rem;
    line-height: 1;
    font-weight: 600;
    color: #6d85a1;
    white-space: nowrap;
    padding-bottom: 0.25rem;
    flex-shrink: 0;
    text-align: right;
    margin: 3.125rem 1.5625rem 0 0;
    animation: fade-up 0.45s ease both;
    animation-delay: 0.18s;
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
    animation: modal-pop 0.34s cubic-bezier(0.22, 1, 0.36, 1);
}

.modal-leave-active .modal-card {
    animation: modal-out 0.2s ease forwards;
}

@keyframes modal-pop {
    0% {
        transform: translateY(0.75rem) scale(0.965);
        opacity: 0.94;
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
        transform: translateY(0.5rem) scale(0.985);
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

@media (max-width: 64rem) {
    .modal-card {
        width: min(100%, 32rem);
    }
}

@media (max-width: 48rem) {
    .modal-overlay {
        padding: 1rem;
        align-items: center;
        justify-content: center;
    }

    .modal-card {
        width: min(100%, 31.25rem);
        max-width: 100%;
        margin: auto;
        border-radius: 1.25rem;
        padding: 0 0.5rem 1rem;
    }

    .modal-imagem {
        width: 92%;
        margin-top: 3.75rem;
        border-radius: 0.75rem;
    }

    .modal-content {
        padding: 0.9375rem 1rem 0;
    }

    .modal-titulo {
        font-size: 1.375rem;
    }

    .modal-footer {
        flex-direction: column;
        align-items: flex-start;
    }

    .modal-data {
        margin: 2rem 1rem 0 0;
        text-align: left;
    }
}

@media (max-width: 40rem) {
    .modal-overlay {
        padding: 0.75rem;
    }

    .btn-fechar {
        top: 0.625rem;
        right: 0.625rem;
        width: 2.125rem;
        height: 2.125rem;
    }

    .modal-imagem {
        width: 94%;
        margin-top: 3.5rem;
    }

    .modal-content {
        padding: 0.875rem 0.75rem 0;
    }

    .modal-titulo {
        font-size: 1.25rem;
        line-height: 1.12;
    }

    .modal-descricao {
        font-size: 0.8125rem;
        line-height: 1.5;
    }

    .modal-tags {
        gap: 0.5rem;
    }

    .modal-tag {
        min-height: 1.875rem;
        padding: 0 0.75rem;
        font-size: 0.75rem;
    }

    .modal-data {
        font-size: 0.75rem;
        margin: 1.5rem 0.75rem 0 0;
        text-align: right;
    }
}

@media (max-width: 30rem) {
    .modal-card {
        border-radius: 1.125rem 1.125rem;
    }

    .modal-imagem {
        width: 95%;
        margin-top: 3.25rem;
    }

    .modal-content {
        padding: 0.75rem 0.625rem 0;
    }

    .modal-titulo {
        font-size: 1.125rem;
    }

    .modal-descricao {
        font-size: 0.78rem;
    }

    .modal-footer {
        gap: 0.875rem;
    }

    .modal-data {
        margin-top: 1.25rem;
        margin-right: 0.625rem;
        text-align: right;
    }
}

@media (prefers-reduced-motion: reduce) {

    .modal-card,
    .modal-imagem,
    .modal-titulo,
    .modal-descricao,
    .modal-tags,
    .modal-data,
    .modal-tag,
    .btn-fechar {
        animation: none !important;
        transition: none !important;
    }
}
</style>