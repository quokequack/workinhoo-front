<template>
  <aside class="sidebar">
    <header class="sidebar-cabecalho">
      <router-link to="/" class="btn-inicio">Início</router-link>
      <p class="sidebar-login">Já possui conta? <router-link to="/entrar" class="link-entrar">Entrar</router-link></p>
    </header>

    <div class="sidebar-corpo">
      <h2 class="sidebar-titulo">
        Crie sua conta e comece agora no <strong>Workinhoo</strong>
      </h2>

      <div class="sidebar-imagem">
        <img src="@/assets/images/register-illustration.svg" alt="Ilustração de cadastro" />
      </div>

      <ul class="sidebar-lista">
        <li>
          <img src="@/assets/icons/check-white.svg" alt="Ícone de check" width="17" height="17" />
          Encontre profissionais próximos
        </li>
        <li>
          <img src="@/assets/icons/check-white.svg" alt="Ícone de check" width="17" height="17" />
          Divulgue seus serviços
        </li>
        <li>
          <img src="@/assets/icons/check-white.svg" alt="Ícone de check" width="17" height="17" />
          Tudo de forma simples
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

.btn-inicio {
  border: 2px solid rgba(255, 255, 255, 0.85);
  color: white;
  padding: 0.28rem 0.9rem;
  border-radius: 8px;
  font-size: 0.78rem;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.25s ease, border-color 0.25s ease;
  white-space: nowrap;
}

.btn-inicio:hover {
  background: rgba(255, 255, 255, 0.18);
  border-color: white;
}

.sidebar-login {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.78rem;
  white-space: nowrap;
}

.link-entrar {
  color: white;
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 2px;
  transition: opacity 0.2s;
}

.link-entrar:hover {
  opacity: 0.8;
}

.sidebar-corpo {
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
  gap: 4rem;
}

.sidebar-titulo {
  color: white;
  font-size: 1.3rem;
  font-weight: 500;
  line-height: 1.45;
}

.sidebar-titulo strong {
  font-weight: 700;
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

.sidebar-lista li svg {
  flex-shrink: 0;
  color: var(--color-secondary-medium);
}
</style>
