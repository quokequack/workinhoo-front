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
    <div class="logged-footer__content">
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
        <p class="logged-footer__contact">workinhoo@gmail.com</p>
      </section>
    </div>

    <div class="logged-footer__bottom">
      <p>© 2026 Workinhoo. Todos os direitos reservados.</p>
    </div>
  </footer>
</template>

<style scoped>
.logged-footer {
  width: 100%;
  padding: 4rem 4rem 2rem;
  background: #161d27;
  color: #fff;
  font-family: Poppins, sans-serif;
}

.logged-footer__content {
  width: 100%;
  max-width: 82rem;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 18.4375rem 1fr 1fr 1fr;
  align-items: start;
  column-gap: 4rem;
}

.logged-footer__brand,
.logged-footer__column {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.logged-footer__brand {
  gap: 0.75rem;
}

.logged-footer__column {
  gap: 0.75rem;
}

.logged-footer__brand h2,
.logged-footer__column h3,
.logged-footer__brand p,
.logged-footer__column ul,
.logged-footer__column li,
.logged-footer__column a,
.logged-footer__contact,
.logged-footer__bottom p {
  margin: 0;
}

.logged-footer__brand h2,
.logged-footer__column h3 {
  font-size: 1.125rem;
  font-weight: 600;
  line-height: normal;
}

.logged-footer__brand p,
.logged-footer__contact {
  font-size: 0.9375rem;
  font-weight: 400;
  line-height: 2rem;
}

.logged-footer__column ul {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

.logged-footer__column a {
  color: #fff;
  text-decoration: none;
  font-size: 0.9375rem;
  font-weight: 500;
  line-height: normal;
}

.logged-footer__bottom {
  width: 100%;
  margin-top: 5rem;
  padding: 1.5rem 3.5rem 0;
  border-top: 2px solid #fff;
}

.logged-footer__bottom p {
  font-size: 0.9375rem;
  font-weight: 400;
  line-height: 2.8125rem;
  text-align: left;
}

@media (max-width: 1024px) {
  .logged-footer {
    padding: 3rem 2rem 2rem;
  }

  .logged-footer__content {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    row-gap: 2.5rem;
    column-gap: 3rem;
  }

  .logged-footer__brand {
    max-width: 18.4375rem;
  }

  .logged-footer__bottom {
    margin-top: 3rem;
    padding: 1.5rem 0 0;
  }
}

@media (max-width: 768px) {
  .logged-footer {
    padding: 2.5rem 1.5rem 1.5rem;
  }

  .logged-footer__content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .logged-footer__bottom {
    margin-top: 2.5rem;
  }

  .logged-footer__bottom p {
    line-height: 1.8rem;
  }
}
</style>
