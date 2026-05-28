<script setup lang="ts">
import searchIcon from '@/assets/icons/search.svg'
import profileIcon from '@/assets/icons/profile.svg'
import menuHamburguerIcon from '@/assets/icons/menu-hamburguer.svg'
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
  menuAberto.value = false
}
</script>

<template>
  <header class="logged-header">
    <div class="logged-header__container">
      <div class="logged-header__top">
        <div class="logged-header__brand-group">
          <div class="logged-header__mobile-menu-wrapper">
            <button
              class="logged-header__mobile-menu"
              :class="{ 'logged-header__mobile-menu--ativo': menuAberto }"
              type="button"
              aria-label="Abrir menu"
              @click="toggleMenu"
            >
              <img :src="menuHamburguerIcon" alt="" />
            </button>

            <div v-if="menuAberto" class="mobile-menu-dropdown">
              <a href="#" @click="fecharMenu">Ver Perfil</a>
              <a href="#" @click="fecharMenu">Minhas solicitações</a>
              <a href="#" @click="fecharMenu">Tornar-se prestador</a>
              <a href="#" @click="fecharMenu">Sair</a>
            </div>
          </div>

          <div class="logged-header__brand">
            <h1>Workinhoo</h1>
          </div>
        </div>

        <nav class="logged-header__nav">
          <a href="#">Início</a>
          <a href="#">Serviços</a>
          <a href="#">Solicitações</a>
          <a href="#">Favoritos</a>
        </nav>

        <div class="logged-header__actions">
          <form class="search-box search-box--desktop" @submit.prevent>
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
        </div>

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

      <form class="search-box search-box--mobile" @submit.prevent>
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
    </div>
  </header>
</template>

<style scoped>
.logged-header {
  background-color: var(--color-neutral-light-white);
}

.logged-header__container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0 1rem;
}

.logged-header__top {
  display: flex;
  height: 4rem;
  padding: 1.25rem 0;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  gap: 0.75rem;
}

.logged-header__brand-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
}

.logged-header__mobile-menu-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.logged-header__brand {
  display: flex;
  height: 2rem;
  align-items: center;
}

.logged-header__brand h1 {
  margin: 0;
  color: #3e3aa6;
  font-family: 'Poppins', sans-serif;
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1;
  white-space: nowrap;
}

.logged-header__nav,
.logged-header__actions {
  display: none;
}

.logged-header__mobile-menu {
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  flex-shrink: 0;
}

.logged-header__mobile-menu img {
  width: 1.5rem;
  height: 1.5rem;
}

.mobile-menu-dropdown {
  position: absolute;
  top: calc(100% + 0.75rem);
  left: 0;
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

.mobile-menu-dropdown a {
  padding: 0.75rem 1rem;
  text-decoration: none;
  color: #516b90;
  font-family: 'Poppins', sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
  white-space: nowrap;
}

.mobile-menu-dropdown a:hover {
  background-color: #f5f7fa;
}

.logged-header__user-group {
  display: flex;
  align-items: center;
  margin-left: auto;
}

.profile-button {
  display: flex;
  width: 2rem;
  height: 2rem;
  justify-content: center;
  align-items: center;
  border: none;
  border-radius: 999px;
  background: #dbe4f1;
  padding: 0;
  cursor: pointer;
  flex-shrink: 0;
}

.profile-button img {
  width: 1rem;
  height: 1rem;
}

.menu-dropdown {
  display: none;
}

.search-box {
  display: flex;
  align-items: center;
  overflow: hidden;
}

.search-box--desktop {
  display: none;
}

.search-box--mobile {
  width: 100%;
  max-width: 21.875rem;
  height: 3rem;
  padding-left: 1.125rem;
  justify-content: space-between;
  align-items: center;
  align-self: center;
  border-radius: 1.5rem;
  border: 0.5px solid #aebdd5;
  background: #f5f7fa;
}

.search-box--mobile input {
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  color: #516b90;
  font-family: 'Poppins', sans-serif;
  font-size: 0.95rem;
}

.search-box--mobile input::placeholder {
  color: #c1cada;
}

.search-box--mobile button {
  display: flex;
  width: 3.25rem;
  height: 100%;
  padding: 0.75rem 1.25rem;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  border: none;
  border-left: 0.5px solid #aebdd5;
  border-radius: 0 1.5rem 1.5rem 0;
  background: #3e3aa6;
  cursor: pointer;
}

.search-box--mobile button img {
  width: 1.25rem;
  height: 1.25rem;
}

@media (min-width: 768px) {
  .logged-header__container {
    width: min(92%, 85rem);
    margin: 0 auto;
    padding: 2rem 0;
    gap: 0;
  }

  .logged-header__top {
    height: auto;
    padding: 0;
    gap: 2rem;
  }

  .logged-header__brand-group {
    flex-shrink: 0;
  }

  .logged-header__brand h1 {
    font-size: 2rem;
  }

  .logged-header__mobile-menu-wrapper,
  .search-box--mobile {
    display: none;
  }

  .logged-header__nav {
    display: flex;
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
    font-weight: 500;
    text-decoration: none;
  }

  .logged-header__actions {
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }

  .search-box--desktop {
    display: flex;
    width: 19.625rem;
    height: 2.5rem;
    padding-left: 1rem;
    align-items: center;
    gap: 1.5rem;
    border-radius: 1.5rem;
    border: 0.5px solid #aebdd5;
    background: #f5f7fa;
  }

  .search-box--desktop input {
    flex: 1;
    min-width: 0;
    border: none;
    outline: none;
    background: transparent;
    color: #516b90;
    font-family: 'Poppins', sans-serif;
    font-size: 0.95rem;
  }

  .search-box--desktop input::placeholder {
    color: #516b90;
  }

  .search-box--desktop button {
    display: flex;
    width: 3.4375rem;
    height: 100%;
    justify-content: center;
    align-items: center;
    border: none;
    border-left: 0.5px solid #aebdd5;
    border-radius: 0 1.5rem 1.5rem 0;
    background: #3e3aa6;
    flex-shrink: 0;
    cursor: pointer;
  }

  .search-box--desktop button img {
    width: 1.5rem;
    height: 1.5rem;
  }

  .logged-header__user-group {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    margin-left: 1.5rem;
    flex-shrink: 0;
  }

  .profile-button {
    width: 2.5rem;
    height: 2.5rem;
    padding: 0.9375rem;
  }

  .profile-button img {
    width: 1.125rem;
    height: 1.125rem;
  }

  .menu-dropdown {
    position: relative;
    display: flex;
    align-items: center;
  }

  .menu-button {
    display: flex;
    width: 1.875rem;
    height: 1.875rem;
    justify-content: center;
    align-items: center;
    border: none;
    background: transparent;
    padding: 0;
    cursor: pointer;
  }

  .menu-button img {
    width: 1.5625rem;
    height: 1rem;
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
