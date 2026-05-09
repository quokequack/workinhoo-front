<script setup lang="ts">
import { ref } from 'vue'

const menuAberto = ref(false)

function toggleMenu() {
    menuAberto.value = !menuAberto.value
}

function fecharMenu() {
    menuAberto.value = false
}
</script>

<template>
    <header>
        <div class="logo">
            <h1>Workinhoo</h1>
        </div>

        <div class="menu-nav">
            <nav>
                <ul>
                    <li><a href="#sobre">Sobre</a></li>
                    <li><a href="#como-funciona">Como funciona</a></li>
                    <li><a href="#servicos">Serviços</a></li>
                </ul>
            </nav>
        </div>

        <div class="menu-login">
            <router-link to="/entrar" class="btn-entrar">Entrar</router-link>
            <router-link to="/cadastrar" class="btn-cadastrar">Cadastrar</router-link>
        </div>

        <button class="hamburger" :class="{ 'hamburger--ativo': menuAberto }" @click="toggleMenu"
            aria-label="Abrir menu">
            <span class="hamburger-linha"></span>
            <span class="hamburger-linha"></span>
            <span class="hamburger-linha"></span>
        </button>
    </header>

    <Transition name="overlay">
        <div v-if="menuAberto" class="menu-overlay" @click="fecharMenu"></div>
    </Transition>

    <Transition name="drawer">
        <div v-if="menuAberto" class="menu-drawer">
            <div class="drawer-logo">
                <h2>Workinhoo</h2>
                <button class="drawer-fechar" @click="fecharMenu" aria-label="Fechar menu">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2.5"
                            stroke-linecap="round" />
                    </svg>
                </button>
            </div>

            <nav class="drawer-nav">
                <a href="#sobre" class="drawer-link" @click="fecharMenu">
                    <span class="drawer-link-num">01</span>
                    <span class="drawer-link-texto">Sobre</span>
                </a>
                <a href="#como-funciona" class="drawer-link" @click="fecharMenu">
                    <span class="drawer-link-num">02</span>
                    <span class="drawer-link-texto">Como funciona</span>
                </a>
                <a href="#servicos" class="drawer-link" @click="fecharMenu">
                    <span class="drawer-link-num">03</span>
                    <span class="drawer-link-texto">Serviços</span>
                </a>
            </nav>

            <div class="drawer-acoes">
                <router-link to="/entrar" class="drawer-btn-entrar" @click="fecharMenu">Entrar</router-link>
                <router-link to="/cadastrar" class="drawer-btn-cadastrar" @click="fecharMenu">Cadastrar</router-link>
            </div>
        </div>
    </Transition>
</template>

<style scoped>
header {
    background-color: var(--color-neutral-light-white);
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 5rem;
    padding: 0 1.25rem;
    box-shadow: 0px 4px 16px 0px #2A2A2A0D;
    margin-bottom: 1rem;
    position: fixed;
    top: 0;
    z-index: 100;
}

header .logo {
    color: var(--color-primary-medium);
    font-weight: 700;
    font-size: 1.2rem;
}

.menu-nav {
    display: none;
}

.menu-nav nav ul a {
    position: relative;
    text-decoration: none;
}

.menu-nav nav ul a::after {
    content: '';
    position: absolute;
    bottom: -3px;
    left: 0;
    width: 0%;
    height: 2px;
    background-color: var(--color-primary-medium);
    border-radius: 2px;
    transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.menu-nav nav ul a:hover::after {
    width: 100%;
}

.menu-login {
    display: none;
}

.btn-entrar {
    color: var(--color-neutral-dark);
    font-family: Poppins;
    font-weight: 600;
    font-size: 0.9rem;
    position: relative;
    text-decoration: none;
}

.btn-entrar::after {
    content: '';
    position: absolute;
    bottom: -3px;
    left: 0;
    width: 0%;
    height: 2px;
    background-color: var(--color-primary-medium);
    border-radius: 2px;
    transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.btn-entrar:hover::after {
    width: 100%;
}

.btn-cadastrar {
    background-color: var(--color-primary-medium);
    color: var(--color-neutral-light-lightest);
    font-family: Poppins;
    padding: 0.5rem 1rem;
    border-radius: 24px;
    font-weight: 600;
    font-size: 0.9rem;
    transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
}

.btn-cadastrar:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(88, 60, 196, 0.35);
    opacity: 0.92;
}

.hamburger {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 5px;
    width: 44px;
    height: 44px;
    background: var(--color-primary-medium);
    border: none;
    border-radius: 12px;
    cursor: pointer;
    padding: 0;
    flex-shrink: 0;
    box-shadow: 0 4px 14px rgba(88, 60, 196, 0.35);
    transition: background 0.3s ease, box-shadow 0.3s ease, transform 0.2s ease;
}

.hamburger:active {
    transform: scale(0.92);
}

.hamburger:hover {
    box-shadow: 0 6px 20px rgba(88, 60, 196, 0.5);
    transform: scale(1.05);
}

.hamburger-linha {
    display: block;
    width: 20px;
    height: 2px;
    background: #ffffff;
    border-radius: 2px;
    transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1),
        opacity 0.3s ease,
        width 0.3s ease;
    transform-origin: center;
}

.hamburger--ativo .hamburger-linha:nth-child(1) {
    transform: translateY(7px) rotate(45deg);
}

.hamburger--ativo .hamburger-linha:nth-child(2) {
    opacity: 0;
    transform: scaleX(0);
}

.hamburger--ativo .hamburger-linha:nth-child(3) {
    transform: translateY(-7px) rotate(-45deg);
}

.menu-overlay {
    position: fixed;
    inset: 0;
    background: rgba(20, 10, 50, 0.45);
    backdrop-filter: blur(3px);
    z-index: 200;
}

.overlay-enter-active,
.overlay-leave-active {
    transition: opacity 0.35s ease;
}

.overlay-enter-from,
.overlay-leave-to {
    opacity: 0;
}

.menu-drawer {
    position: fixed;
    top: 0;
    right: 0;
    width: min(80vw, 300px);
    height: 100dvh;
    background: var(--color-neutral-light-white);
    z-index: 300;
    display: flex;
    flex-direction: column;
    padding: 1.75rem 1.5rem 2.5rem;
    box-shadow: -8px 0 40px rgba(20, 10, 50, 0.18);
    border-radius: 24px 0 0 24px;
    overflow: hidden;
}

.drawer-enter-active {
    transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1);
}

.drawer-leave-active {
    transition: transform 0.3s cubic-bezier(0.55, 0, 1, 0.45);
}

.drawer-enter-from,
.drawer-leave-to {
    transform: translateX(100%);
}

.drawer-logo {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 2.5rem;
}

.drawer-logo h2 {
    color: var(--color-primary-medium);
    font-weight: 700;
    font-size: 1.3rem;
}

.drawer-fechar {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--color-neutral-dark);
    padding: 6px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s ease, color 0.2s ease;
}

.drawer-fechar:hover {
    background: #f0eeff;
    color: var(--color-primary-medium);
}

.drawer-nav {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    flex: 1;
}

.drawer-nav::after {
    content: '';
    display: block;
    height: 1px;
    background: #ece9f8;
    margin: 1rem 0;
}

.drawer-link {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    border-radius: 14px;
    text-decoration: none;
    color: var(--color-neutral-dark);
    position: relative;
    overflow: hidden;
    transition: transform 0.2s ease;
}

.drawer-link::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, var(--color-primary-medium), var(--color-secondary-medium));
    opacity: 0;
    transition: opacity 0.25s ease;
    border-radius: 14px;
}

.drawer-link:hover::after,
.drawer-link:active::after {
    opacity: 1;
}

.drawer-link:hover .drawer-link-num,
.drawer-link:hover .drawer-link-texto,
.drawer-link:active .drawer-link-num,
.drawer-link:active .drawer-link-texto {
    color: #ffffff;
}

.drawer-link:active {
    transform: scale(0.97);
}

.drawer-link-num {
    font-size: 0.7rem;
    font-weight: 700;
    color: var(--color-primary-medium);
    letter-spacing: 0.05em;
    min-width: 24px;
    position: relative;
    z-index: 1;
    transition: color 0.2s ease;
}

.drawer-link-texto {
    font-size: 1.05rem;
    font-weight: 600;
    position: relative;
    z-index: 1;
    transition: color 0.2s ease;
}

.drawer-acoes {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-top: auto;
}

.drawer-btn-entrar {
    display: block;
    text-align: center;
    padding: 0.85rem 1.5rem;
    border-radius: 14px;
    font-weight: 600;
    font-size: 0.95rem;
    color: var(--color-primary-medium);
    border: 2px solid var(--color-primary-medium);
    text-decoration: none;
    transition: background 0.2s ease;
}

.drawer-btn-entrar:hover {
    background: #f0eeff;
}

.drawer-btn-cadastrar {
    display: block;
    text-align: center;
    padding: 0.85rem 1.5rem;
    border-radius: 14px;
    font-weight: 600;
    font-size: 0.95rem;
    background: var(--color-primary-medium);
    color: #ffffff;
    text-decoration: none;
    box-shadow: 0 4px 14px rgba(88, 60, 196, 0.35);
    transition: opacity 0.2s ease, transform 0.2s ease;
}

.drawer-btn-cadastrar:hover {
    opacity: 0.9;
    transform: translateY(-1px);
}

@media (min-width: 768px) {
    header {
        width: 90%;
        height: 6rem;
        padding: 0 1.5rem;
        border-bottom-left-radius: 24px;
        border-bottom-right-radius: 24px;
        margin: 0 auto;
        position: relative;
    }

    header .logo {
        font-size: 1.35rem;
    }

    .menu-nav {
        display: block;
    }

    .menu-nav nav ul {
        display: flex;
        align-items: center;
        gap: 1.5rem;
        list-style: none;
        padding: 0;
    }

    .menu-nav nav ul a {
        color: var(--color-neutral-dark);
        font-weight: 600;
        font-size: 0.95rem;
    }

    .menu-login {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }

    .btn-entrar {
        font-size: 0.95rem;
    }

    .btn-cadastrar {
        padding: 0.65rem 1.25rem;
        font-size: 0.95rem;
    }

    .hamburger {
        display: none;
    }
}

@media (min-width: 1280px) {
    header {
        width: 85%;
        height: 6.5rem;
        padding: 0 1.75rem;
    }

    header .logo {
        font-size: 1.35rem;
    }

    .menu-nav nav ul {
        gap: 2rem;
    }

    .menu-nav nav ul a {
        font-size: 1rem;
    }

    .menu-login {
        gap: 1.25rem;
    }

    .btn-entrar {
        font-size: 1rem;
    }

    .btn-cadastrar {
        padding: 0.75rem 1.25rem;
        font-size: 1rem;
    }
}
</style>