<script setup lang="ts">
const categoriasPopulares = [
  'Eletricistas',
  'Pedreiros',
  'Diaristas',
  'Encanadores',
  'Professores',
  'Mecânicos',
]
</script>

<template>
  <footer class="logged-footer">
    <div class="logged-footer__container">
      <section class="logged-footer__brand">
        <h2>Workinhoo</h2>
        <p>Conectando você a profissionais locais.</p>
      </section>

      <section class="logged-footer__column">
        <h3>Navegação</h3>
        <ul>
          <li><a href="#">Início</a></li>
          <li><a href="#">Serviços</a></li>
          <li><a href="#">Solicitações</a></li>
          <li><a href="#">Favoritos</a></li>
          <li><a href="#">Ajuda</a></li>
          <li><a href="#">Tornar-se prestador</a></li>
        </ul>
      </section>

      <section class="logged-footer__column">
        <h3>Categorias populares</h3>
        <ul>
          <li v-for="categoria in categoriasPopulares" :key="categoria">
            <a href="#">{{ categoria }}</a>
          </li>
        </ul>
      </section>

      <section class="logged-footer__column">
        <h3>Contato</h3>
        <p>workinhoo@gmail.com</p>
      </section>
    </div>

    <div class="logged-footer__bottom">
      <p>© 2026 Workinhoo. Todos os direitos reservados.</p>
    </div>
  </footer>
</template>

<style scoped>
.logged-footer {
  background-color: var(--color-neutral-darkest);
  color: var(--color-neutral-light-white);
  padding-top: 3rem;
}

.logged-footer__container,
.logged-footer__bottom {
  width: min(90%, 75rem);
  margin: 0 auto;
}

.logged-footer__container {
  display: grid;
  gap: 1rem;
  padding-bottom: 2rem;
}

.logged-footer__brand h2,
.logged-footer__column h3 {
  margin-bottom: 0.75rem;
}

.logged-footer__column ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.logged-footer__column li + li {
  margin-top: 0.5rem;
}

.logged-footer__column a {
  color: var(--color-neutral-light-white);
  text-decoration: none;
}

.logged-footer__bottom {
  border-top: 1px solid #ffffff20;
  padding: 1.25rem 0 2rem;
}

.logged-footer__bottom p {
  text-align: center;
  font-size: 0.9rem;
}

@media (min-width: 768px) {
  .logged-footer__container {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .logged-footer__container {
    grid-template-columns: 1.2fr 1fr 1fr 0.9fr;
    align-items: start;
  }
}
</style>
