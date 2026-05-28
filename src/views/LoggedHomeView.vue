<script setup lang="ts">
import LoggedHeader from '@/components/LoggedHeader.vue'
import LoggedFooter from '@/components/LoggedFooter.vue'
import diaristaImg from '@/assets/images/diarista.jpg'
import eletricistaImg from '@/assets/images/eletricista.jpg'
import encanadorImg from '@/assets/images/encanador.jpg'
import mecanicoImg from '@/assets/images/mecanico.jpg'
import pedreiroImg from '@/assets/images/pedreiro.jpg'
import pintorImg from '@/assets/images/pintor.jpg'
import tatuadorImg from '@/assets/images/tatuador.jpg'

const categorias = [
  { nome: 'Construção e Reparos', quantidade: '18 prestadores' },
  { nome: 'Serviços Domésticos', quantidade: '12 prestadores' },
  { nome: 'Beleza e Bem-estar', quantidade: '9 prestadores' },
  { nome: 'Saúde e Qualidade de Vida', quantidade: '7 prestadores' },
  { nome: 'Criativos e Digitais', quantidade: '10 prestadores' },
  { nome: 'Educação e Consultoria', quantidade: '6 prestadores' },
  { nome: 'Técnicos Especializados', quantidade: '11 prestadores' },
]

const prestadoresDestaque = [
  {
    nome: 'Ana Maria',
    profissao: 'Técnico(a) em Informática',
    nota: '5.0',
    localizacao: 'Maceió - AL',
    imagem: eletricistaImg,
  },
  {
    nome: 'Wellington Soares',
    profissao: 'Tatuador(a)',
    nota: '4.9',
    localizacao: 'Maceió - AL',
    imagem: tatuadorImg,
  },
  {
    nome: 'Sandro Ribeiro',
    profissao: 'Fotógrafo(a)',
    nota: '4.9',
    localizacao: 'Maceió - AL',
    imagem: pintorImg,
  },
  {
    nome: 'João Carlos',
    profissao: 'Pedreiro(a)',
    nota: '4.9',
    localizacao: 'Maceió - AL',
    imagem: pedreiroImg,
  },
  {
    nome: 'Alberto Ferreira',
    profissao: 'Cozinheiro(a)',
    nota: '4.9',
    localizacao: 'Maceió - AL',
    imagem: diaristaImg,
  },
]

const solicitacoesRecentes = [
  {
    nome: 'Carlos Henrique',
    profissao: 'Eletricista',
    servico: 'Instalação elétrica residencial',
    data: '12/04/2024',
    status: 'Contato realizado',
    imagem: eletricistaImg,
  },
  {
    nome: 'Pedro Augusto',
    profissao: 'Mecânico(a)',
    servico: 'Revisão de motor e suspensão',
    data: '10/04/2024',
    status: 'Contato realizado',
    imagem: mecanicoImg,
  },
  {
    nome: 'Ana Maria',
    profissao: 'Técnico(a) em informática',
    servico: 'Aula de informática',
    data: '24/04/2024',
    status: 'Serviço finalizado',
    imagem: encanadorImg,
  },
  {
    nome: 'Paulo Almeida',
    profissao: 'Vidraceiro(a)',
    servico: 'Instalação de box para banheiro',
    data: '08/04/2024',
    status: 'Contato realizado',
    imagem: diaristaImg,
  },
  {
    nome: 'César Rodrigues',
    profissao: 'Barbeiro(a)',
    servico: 'Corte de cabelo',
    data: '04/03/2024',
    status: 'Serviço finalizado',
    imagem: tatuadorImg,
  },
]
</script>

<template>
  <div class="logged-home">

    <LoggedHeader />

    <main class="logged-main">
      <section class="hero">
        <div class="hero__content">
          <p class="hero__greeting">Olá, João!</p>

          <div class="hero__text-group">
            <h2 class="hero__title">Precisa de um serviço? Encontre especialistas em minutos.</h2>
            <p class="hero__subtitle">
              Busque prestadores avaliados, compare perfis e solicite serviços diretamente pela plataforma.
            </p>
          </div>

          <div class="hero__actions">
            <button type="button" class="btn btn--white">Buscar serviços</button>
            <button type="button" class="btn btn--outline-white">Tornar-se Prestador</button>
          </div>
        </div>
      </section>

      <section class="categories">
        <div class="section-heading">
          <h2>Categorias de Serviços</h2>
          <a href="#">Ver todos &gt;</a>
        </div>

        <div class="categories__track">
          <article v-for="categoria in categorias" :key="categoria.nome" class="category-card">
            <h3>{{ categoria.nome }}</h3>
            <p>{{ categoria.quantidade }}</p>
          </article>
        </div>

        <p class="categories__hint">Deslize para ver mais</p>
      </section>

      <section class="featured">
        <div class="section-heading">
          <div>
            <h2>Prestadores em destaque</h2>
            <p>Baseado em avaliações e serviços concluídos</p>
          </div>
        </div>

        <div class="featured__grid">
          <article
            v-for="prestador in prestadoresDestaque"
            :key="prestador.nome"
            class="professional-card"
          >
            <img :src="prestador.imagem" :alt="`Foto de ${prestador.nome}`" />
            <div class="professional-card__content">
              <h3>{{ prestador.nome }}</h3>
              <p class="professional-card__role">{{ prestador.profissao }}</p>

              <div class="professional-card__meta">
                <span>⭐ {{ prestador.nota }}</span>
                <span>{{ prestador.localizacao }}</span>
              </div>

              <div class="professional-card__actions">
                <button type="button" class="btn btn--ghost">Ver perfil</button>
                <button type="button" class="btn btn--primary-soft">Solicitar serviço</button>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section class="requests">
        <div class="section-heading">
          <div>
            <h2>Solicitações recentes</h2>
            <p>Acompanhe suas últimas solicitações</p>
          </div>
          <a href="#">Ver mais &gt;</a>
        </div>

        <div class="requests__grid">
          <article
            v-for="solicitacao in solicitacoesRecentes"
            :key="`${solicitacao.nome}-${solicitacao.data}`"
            class="request-card"
          >
            <div class="request-card__top">
              <img :src="solicitacao.imagem" :alt="`Foto de ${solicitacao.nome}`" />
              <button type="button" class="request-card__link">Ver perfil</button>
            </div>

            <div class="request-card__content">
              <h3>{{ solicitacao.nome }}</h3>
              <p class="request-card__role">{{ solicitacao.profissao }}</p>
              <p class="request-card__service">{{ solicitacao.servico }}</p>
              <p class="request-card__date">{{ solicitacao.data }}</p>
            </div>

            <div class="request-card__footer">
              <span
                class="request-card__status"
                :class="{
                  'request-card__status--done': solicitacao.status === 'Serviço finalizado',
                }"
              >
                {{ solicitacao.status }}
              </span>
              <button type="button" class="request-card__details">Detalhes</button>
            </div>
          </article>
        </div>
      </section>

      <section class="provider-cta">
        <div class="provider-cta__content">
          <h2>Transforme sua habilidade em oportunidades</h2>
          <p>
            Cadastre seu perfil e conecte-se com clientes de forma simples e rápida.
          </p>

          <div class="provider-cta__grid">
            <article class="provider-benefit">
              <h3>Crie um perfil profissional</h3>
              <p>Monte seu perfil e apresente suas habilidades para novos clientes.</p>
            </article>

            <article class="provider-benefit">
              <h3>Divulgue seus serviços</h3>
              <p>Mostre seus serviços de forma simples e aumente sua visibilidade.</p>
            </article>

            <article class="provider-benefit">
              <h3>Alcance clientes da sua região</h3>
              <p>
                Conecte-se com pessoas próximas que estão em busca de profissionais como você.
              </p>
            </article>
          </div>

          <button type="button" class="btn btn--light">Quero ser prestador &gt;</button>
        </div>
      </section>
    </main>

    <LoggedFooter />
  </div>
</template>

<style scoped>
.logged-home {
  min-height: 100vh;
  background-color: var(--color-neutral-light-lightest);
}

.hero,
.categories,
.featured,
.requests,
.provider-cta__content {
  width: min(90%, 75rem);
  margin: 0 auto;
}

.logged-main {
  padding: 2rem 0 0;
}

.hero {
  display: flex;
  align-items: flex-start;
  padding: 1.5rem;
  min-height: 31.25rem;
  border-radius: 1rem;
  background:
    linear-gradient(270deg, rgba(51, 48, 136, 0.9) 22.49%, rgba(30, 29, 82, 0.96) 134.64%),
    url('@/assets/images/loggedHomeHero.png');
  background-repeat: no-repeat;
  background-position: right center;
  background-size: cover;
  color: #fff;
  overflow: hidden;
}

.hero__content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  flex: 1;
  width: 100%;
  gap: 1.5rem;
}

.hero__greeting {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
}

.hero__text-group {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
}

.hero__title {
  margin: 0;
  max-width: 18.9375rem;
  font-size: 1.75rem;
  font-weight: 600;
  line-height: 2.375rem;
  color: #ffffff;
}

.hero__subtitle {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.375rem;
  color: #ffffff;
}

.hero__actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 3rem;
  padding: 1rem 1.5rem;
  font-size: 0.95rem;
  font-weight: 700;
  border-radius: 0.5rem;
  background: transparent;
  cursor: pointer;
}

.hero .btn {
  width: 100%;
}

.hero .btn--white {
  background: #fff;
  color: #333088;
  border: 2px solid #fff;
  border-radius: 0.5rem;
}

.hero .btn--outline-white {
  background: transparent;
  color: #fff;
  border: 2px solid #fff !important;
  border-radius: 0.5rem !important;
}

.section-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.section-heading h2 {
  font-size: 1.5rem;
  color: var(--color-neutral-darkest);
}

.section-heading p {
  color: var(--color-neutral-dark);
  margin-top: 0.25rem;
}

.section-heading a {
  text-decoration: none;
  color: var(--color-primary-medium);
  font-weight: 600;
  white-space: nowrap;
}

.categories,
.featured,
.requests {
  padding: 3rem 0 0;
}

.categories__track {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 16rem;
  gap: 1rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  scrollbar-width: thin;
}

.category-card {
  background-color: var(--color-neutral-light-white);
  border-radius: 1.25rem;
  padding: 1.25rem;
  box-shadow: 0 0.25rem 1rem #2a2a2a0d;
  min-height: 7.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.category-card h3 {
  font-size: 1rem;
  color: var(--color-neutral-darkest);
}

.category-card p {
  color: var(--color-neutral-dark);
  font-size: 0.95rem;
}

.categories__hint {
  margin-top: 0.75rem;
  color: var(--color-neutral-dark);
  font-size: 0.9rem;
}

.featured__grid,
.requests__grid,
.provider-cta__grid {
  display: grid;
  gap: 1rem;
}

.professional-card,
.request-card,
.provider-benefit {
  background-color: var(--color-neutral-light-white);
  border-radius: 1.5rem;
  box-shadow: 0 0.25rem 1rem #2a2a2a0d;
  overflow: hidden;
}

.professional-card img,
.request-card__top img {
  width: 100%;
  height: 13rem;
  object-fit: cover;
}

.professional-card__content,
.request-card__content,
.request-card__footer,
.provider-benefit {
  padding: 1rem 1.25rem;
}

.professional-card__content h3,
.request-card__content h3,
.provider-benefit h3 {
  font-size: 1.1rem;
  color: var(--color-neutral-darkest);
}

.professional-card__role,
.request-card__role,
.request-card__service,
.request-card__date,
.provider-benefit p {
  color: var(--color-neutral-dark);
}

.professional-card__meta {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  margin: 0.9rem 0 1rem;
  color: var(--color-neutral-dark);
}

.professional-card__actions,
.request-card__footer {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.request-card__top {
  position: relative;
}

.request-card__link {
  position: absolute;
  right: 1rem;
  top: 1rem;
  border: none;
  border-radius: 999px;
  padding: 0.5rem 0.9rem;
  background-color: #ffffffdd;
  font-weight: 600;
}

.request-card__service {
  margin: 0.75rem 0 0.5rem;
}

.request-card__date {
  font-size: 0.9rem;
}

.request-card__status {
  color: var(--color-warning-medium);
  font-weight: 700;
}

.request-card__status--done {
  color: var(--color-secondary-medium);
}

.request-card__details {
  border: none;
  background: transparent;
  color: var(--color-primary-medium);
  font-weight: 700;
}

.provider-cta {
  padding: 3rem 0;
}

.provider-cta__content {
  background: linear-gradient(135deg, var(--color-primary-medium), var(--color-secondary-medium));
  border-radius: 1.5rem;
  padding: 2rem 1.5rem;
  color: var(--color-neutral-light-white);
}

.provider-cta__content h2 {
  font-size: 1.75rem;
  margin-bottom: 0.75rem;
}

.provider-cta__content > p {
  margin-bottom: 1.5rem;
  max-width: 40rem;
}

.provider-benefit {
  background-color: #ffffff12;
  border: 1px solid #ffffff20;
}

.provider-benefit h3,
.provider-benefit p {
  color: var(--color-neutral-light-white);
}

.btn {
  border: none;
  border-radius: 999px;
  padding: 0.85rem 1.25rem;
  font-weight: 700;
  font-size: 0.95rem;
}

.btn--primary {
  background-color: var(--color-warning-medium);
  color: var(--color-neutral-light-white);
}

.btn--secondary {
  background-color: transparent;
  color: var(--color-neutral-light-white);
  border: 1px solid #ffffff60;
}

.btn--ghost {
  background-color: transparent;
  color: var(--color-primary-medium);
  border: 1px solid var(--color-primary-medium);
}

.btn--primary-soft {
  background-color: var(--color-primary-medium);
  color: var(--color-neutral-light-white);
}

.btn--light {
  background-color: var(--color-neutral-light-white);
  color: var(--color-primary-medium);
  margin-top: 1.5rem;
}

@media (min-width: 768px) {

  .search-box {
    display: flex;
    align-items: center;
    background-color: var(--color-neutral-light-lightest);
    border: 1px solid #00000010;
    border-radius: 999px;
    padding: 0.25rem 0.25rem 0.25rem 1rem;
  }

  .search-box input {
    border: none;
    outline: none;
    background: transparent;
    width: 16rem;
  }

  .search-box button,
  .profile-button {
    border: none;
    background: transparent;
  }

  .profile-button {
    width: 2.75rem;
    height: 2.75rem;
    border-radius: 999px;
    background-color: var(--color-neutral-light-lightest);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.15rem;
  }

  .hero {
    align-items: center;
    min-height: 31.25rem;
    margin-top: 2rem;
    padding: 3rem;
    border-radius: 1.5rem;
    background:
      linear-gradient(
      100deg,
      rgba(30, 29, 82, 1) 35%,
      rgba(51, 48, 136, 0.96) 50%,
      rgba(51, 48, 136, 0.82) 55%,
      rgba(62, 58, 166, 0.45) 70%,
      rgba(62, 58, 166, 0.18) 90%,
      rgba(62, 58, 166, 0.12) 100%
    ),
      url('@/assets/images/loggedHomeHero.png');
    background-repeat: no-repeat;
    background-position: right center;
    background-size: auto 115%;
  }

  .hero__content {
    max-width: 41.625rem;
    gap: 3rem;
    justify-content: center;
    position: relative;
    z-index: 1;
  }

  .hero__title {
    max-width: 41.625rem;
    font-size: 2.5rem;
    line-height: 3.4375rem;
  }

  .hero__subtitle {
    max-width: 36.875rem;
    font-size: 1.125rem;
    line-height: 1.875rem;
  }

  .hero__actions {
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    width: auto;
  }

  .hero .btn {
    width: auto;
  }

  .featured__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .requests__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .provider-cta__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .featured__grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .requests__grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .provider-cta__grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>
