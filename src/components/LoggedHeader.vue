<script setup lang="ts">
import searchIcon from '@/assets/icons/search.svg'
import profileIcon from '@/assets/icons/profile.svg'
import menuIcon from '@/assets/icons/menu.svg'
import { ref } from 'vue'

const menuAberto = ref(false)
const termoBusca = ref('')
const dropdownAberto = ref(false)

function toggleMenu() {
  menuAberto.value = !menuAberto.value
  dropdownAberto.value = false
}

function fecharMenu() {
  menuAberto.value = false
  dropdownAberto.value = false
}

function toggleDropdown() {
  dropdownAberto.value = !dropdownAberto.value
}
</script>

<template>
  <header class="logged-header">
    <div class="logged-header__container">
      <div class="logged-header__brand">
        <h1>Workinhoo</h1>
      </div>

      <nav class="logged-header__nav">
        <a href="#">Início</a>
        <a href="#">Serviços</a>
        <a href="#">Solicitações</a>
        <a href="#">Favoritos</a>
      </nav>

      <div class="logged-header__actions">
        <form class="search-box" @submit.prevent>
          <input
            v-model="termoBusca"
            type="text"
            placeholder="Qual serviço você procura?"
            aria-label="Buscar serviços"
          />
          <button type="submit" aria-label="Buscar">
            <img :src="searchIcon" alt="" />
          </button>
        </form>

        <div class="logged-header__user-group">
          <button class="profile-button" type="button" aria-label="Perfil do usuário">
            <img :src="profileIcon" alt="" />
          </button>

          <div class="menu-dropdown">
            <button
              class="menu-button"
              type="button"
              aria-label="Abrir menu"
              @click="toggleDropdown"
            >
              <img :src="menuIcon" alt="" />
            </button>

            <div v-if="dropdownAberto" class="menu-dropdown__panel">
              <a href="#">Ver perfil</a>
              <a href="#">Minhas solicitações</a>
              <a href="#">Tornar-se prestador</a>
              <a href="#">Sair</a>
            </div>
          </div>
        </div>
      </div>

      <button
        class="logged-header__mobile-menu"
        :class="{ 'logged-header__mobile-menu--ativo': menuAberto }"
        type="button"
        aria-label="Abrir menu"
        @click="toggleMenu"
      >
        <img :src="menuIcon" alt="" />
      </button>
    </div>
  </header>

  <Transition name="overlay">
    <div v-if="menuAberto" class="mobile-overlay" @click="fecharMenu"></div>
  </Transition>

  <Transition name="drawer">
    <aside v-if="menuAberto" class="mobile-drawer">
      <div class="mobile-drawer__top">
        <h2>Workinhoo</h2>
        <button type="button" aria-label="Fechar menu" @click="fecharMenu">✕</button>
      </div>

      <nav class="mobile-drawer__nav">
        <a href="#" @click="fecharMenu">Início</a>
        <a href="#" @click="fecharMenu">Serviços</a>
        <a href="#" @click="fecharMenu">Solicitações</a>
        <a href="#" @click="fecharMenu">Favoritos</a>
        <a href="#" @click="fecharMenu">Ajuda</a>
      </nav>
    </aside>
  </Transition>
</template>

<style scoped>
.logged-header {
  background-color: var(--color-neutral-light-white);
}

.logged-header__container {
  width: min(92%, 85rem);
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2rem 0;
  gap: 2rem;
}

.logged-header__brand h1 {
  color: #3e3aa6;
  font-family: 'Poppins', sans-serif;
  font-size: 2rem;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
}

.logged-header__nav,
.logged-header__actions {
  display: none;
}

.logged-header__mobile-menu {
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  padding: 0;
}

.logged-header__mobile-menu img {
  width: 1.5625rem;
  height: 1rem;
}

.mobile-overlay {
  position: fixed;
  inset: 0;
  background-color: #00000050;
  z-index: 120;
}

.mobile-drawer {
  position: fixed;
  top: 0;
  right: 0;
  width: min(78vw, 18rem);
  height: 100vh;
  background-color: #ffffff;
  z-index: 130;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  box-shadow: -0.5rem 0 2rem #00000020;
}

.mobile-drawer__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.mobile-drawer__top h2 {
  color: #3e3aa6;
  font-size: 1.25rem;
  font-weight: 700;
}

.mobile-drawer__top button {
  border: none;
  background: transparent;
  font-size: 1.25rem;
}

.mobile-drawer__nav {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.mobile-drawer__nav a {
  text-decoration: none;
  color: #516b90;
  font-weight: 600;
}

.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 0.2s ease;
}

.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}

.drawer-enter-active,
.drawer-leave-active {
  transition: transform 0.2s ease;
}

.drawer-enter-from,
.drawer-leave-to {
  transform: translateX(100%);
}

@media (min-width: 768px) {
  .logged-header__nav,
  .logged-header__actions {
    display: flex;
  }

  .logged-header__nav {
    width: auto;
    min-height: 1.5rem;
    align-items: flex-end;
    gap: 1.5rem;
    margin-left: 2rem;
    margin-right: auto;
  }

  .logged-header__nav a {
    color: #516b90;
    font-family: 'Poppins', sans-serif;
    font-size: 1rem;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    text-decoration: none;
  }

  .logged-header__actions {
    width: 27.5rem;
    height: 2.5rem;
    align-items: center;
    gap: 2rem;
  }

  .search-box {
  display: flex;
  width: 19.625rem;
  height: 2.5rem;
  padding-left: 1rem;
  align-items: center;
  gap: 1.5rem;
  border-radius: 1.5rem;
  border: 0.5px solid #aebdd5;
  background: #f5f7fa;
  overflow: hidden;
  }

  .search-box input {
    flex: 1;
    min-width: 0;
    border: none;
    outline: none;
    background: transparent;
    color: #516b90;
    font-family: 'Poppins', sans-serif;
    font-size: 0.95rem;
  }

  .search-box input::placeholder {
    color: #516b90;
  }

  .search-box button {
  display: flex;
  width: 3.4375rem;
  padding: 0.75rem 1.25rem;
  justify-content: center;
  align-items: center;
  gap: 0.625rem;
  align-self: stretch;
  border: none;
  border-left: 0.5px solid #aebdd5;
  border-radius: 0 1.5rem 1.5rem 0;
  background: #3e3aa6;
  flex-shrink: 0;
  }

  .search-box button img {
  width: 1.5rem;
  height: 1.5rem;
  }

  .logged-header__user-group {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  .profile-button {
    display: flex;
    width: 2.5rem;
    height: 2.5rem;
    padding: 0.9375rem;
    justify-content: center;
    align-items: center;
    gap: 0.625rem;
    border: none;
    border-radius: 1.875rem;
    background: #aebdd5;
  }

  .profile-button img {
    width: 1.125rem;
    height: 1.125rem;
  }

  .menu-button {
    display: flex;
    width: 1.875rem;
    height: 1.875rem;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 0.625rem;
    border: none;
    background: transparent;
    padding: 0;
  }

  .menu-button img {
    width: 1.5625rem;
    height: 1rem;
  }

  .logged-header__mobile-menu {
    display: none;
  }

  .menu-dropdown {
    position: relative;
    display: flex;
    align-items: center;
  }

  .menu-dropdown__panel {
    position: absolute;
    top: calc(100% + 0.75rem);
    right: 0;
    min-width: 11rem;
    background: #ffffff;
    border: 1px solid #e7edf5;
    border-radius: 1rem;
    box-shadow: 0 0.75rem 2rem rgba(62, 58, 166, 0.12);
    padding: 0.5rem 0;
    display: flex;
    flex-direction: column;
    z-index: 150;
  }

  .menu-dropdown__panel a {
    padding: 0.75rem 1rem;
    text-decoration: none;
    color: #516b90;
    font-family: 'Poppins', sans-serif;
    font-size: 0.9rem;
    font-weight: 500;
    white-space: nowrap;
  }

  .menu-dropdown__panel a:hover {
    background-color: #f5f7fa;
  }

}
</style>
