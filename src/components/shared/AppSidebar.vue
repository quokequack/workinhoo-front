<script setup lang="ts">
defineProps<{
    titulo: string
    subtitulo?: string
    imagem: string
    imagemAlt: string
    btnLabel: string
    btnTo: string
    btnIcone?: string
    btnAnimate?: boolean
    headerTexto: string
    linkLabel: string
    linkTo: string
    lista?: string[]
}>()
</script>

<template>
    <aside class="sidebar">
        <header class="sidebar-cabecalho">
            <router-link :to="btnTo" class="btn-acao" :class="{ 'btn-acao--animate': btnAnimate }">
                <img v-if="btnIcone" :src="`/src/assets/icons/${btnIcone}`" :alt="`Ícone ${btnLabel}`" width="12"
                    height="12" />
                {{ btnLabel }}
            </router-link>

            <p class="sidebar-login">
                {{ headerTexto }}
                <router-link :to="linkTo" class="link-acao">{{ linkLabel }}</router-link>
            </p>
        </header>

        <div class="sidebar-corpo">
            <div class="sidebar-texto">
                <h2 class="sidebar-titulo" v-html="titulo" />
                <p v-if="subtitulo" class="sidebar-subtitulo">{{ subtitulo }}</p>
            </div>

            <div class="sidebar-imagem">
                <img :src="`/src/assets/images/${imagem}`" :alt="imagemAlt" />
            </div>

            <ul v-if="lista && lista.length" class="sidebar-lista">
                <li v-for="(item, index) in lista" :key="index">
                    <img src="@/assets/icons/check-white.svg" alt="Ícone de check" width="17" height="17" />
                    {{ item }}
                </li>
            </ul>
        </div>
    </aside>
</template>

<style scoped>
.sidebar {
    display: none;
}

@media (min-width: 768px) {
    .sidebar {
        display: flex;
        flex-direction: column;
        width: 360px;
        min-width: 320px;
        background: var(--color-primary-medium);
        padding: 1.75rem 2rem 2.5rem;
        position: sticky;
        top: 0;
        height: 100dvh;
        overflow: hidden;
        flex-shrink: 0;
    }
}

@media (min-width: 1536px) {
    .sidebar {
        width: 420px;
        padding: 2rem 2.5rem 3rem;
    }
}

.sidebar-cabecalho {
    display: flex;
    align-items: center;
    gap: 1.25rem;
    flex-shrink: 0;
}

.btn-acao {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    border: 2px solid rgba(255, 255, 255, 0.85);
    color: white;
    padding: 0.28rem 0.9rem;
    border-radius: 8px;
    font-size: 0.78rem;
    font-weight: 600;
    text-decoration: none;
    white-space: nowrap;
    width: fit-content;
    transition: background 0.25s ease, border-color 0.25s ease;
}

.btn-acao:hover {
    background: rgba(255, 255, 255, 0.18);
    border-color: white;
}

.btn-acao--animate {
    transition: background 0.25s ease, transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), border-color 0.25s ease;
}

.btn-acao--animate:hover {
    transform: translateY(-2px);
}

.btn-acao--animate:active {
    transform: translateY(0);
}

.sidebar-login {
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.78rem;
    white-space: nowrap;
}

.link-acao {
    color: white;
    font-weight: 700;
    text-decoration: underline;
    text-underline-offset: 2px;
    transition: opacity 0.2s;
}

.link-acao:hover {
    opacity: 0.8;
}

.sidebar-corpo {
    display: flex;
    flex-direction: column;
    flex: 1;
    justify-content: center;
    gap: 4rem;
}

.sidebar-texto {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
}

.sidebar-titulo {
    color: white;
    font-size: 1.4rem;
    font-weight: 500;
    line-height: 1.45;
}

.sidebar-titulo :deep(strong) {
    font-weight: 700;
}

.sidebar-subtitulo {
    color: rgba(255, 255, 255, 0.75);
    font-size: 0.88rem;
    font-weight: 400;
}

.sidebar-imagem {
    width: 100%;
    max-width: 240px;
    margin: 0 auto;
    flex-shrink: 0;
}

.sidebar-imagem img {
    width: 100%;
    height: auto;
    display: block;
}

.sidebar-lista {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.sidebar-lista li {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    color: white;
    font-size: 0.85rem;
    font-weight: 500;
}
</style>