<script setup lang="ts">
import { onMounted } from 'vue'
import AppHeader from '@/components/home/AppHeader.vue'
import AppFooter from '@/components/home/AppFooter.vue'
import pintorImg from '@/assets/images/pintor.jpg'
import eletristaImg from '@/assets/images/eletricista.jpg'
import daristaImg from '@/assets/images/diarista.jpg'
import mecanicoImg from '@/assets/images/mecanico.jpg'
import tatuadorImg from '@/assets/images/tatuador.jpg'
import encanadorImg from '@/assets/images/encanador.jpg'
import pedreiroImg from '@/assets/images/pedreiro.jpg'

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--visivel')
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.15 }
  )

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
})
</script>

<template>
  <AppHeader />

  <main>
    <section class="criar-conta">
      <div class="left-content reveal">
        <h1>Encontre <span class="texto-highlight">profissionais perto de você</span>, sem complicação</h1>
        <p>Conectamos você a profissionais locais de forma simples e rápida.</p>
        <router-link to="/cadastrar" class="btn-criar-conta">Criar conta <img src="@/assets/icons/arrow.svg"
            alt="ícone de seta"></router-link>
      </div>
      <div class="right-content reveal reveal--delay-2">
        <img src="@/assets/images/greeting.svg" alt="imagem de pessoas se cumprimentando" />
      </div>
    </section>

    <section class="sobre" id="sobre">
      <div class="content">
        <h1 class="reveal">
          O que é o Workinhoo?
        </h1>
        <p class="reveal reveal--delay-1">
          O <b>Workinhoo</b> é uma plataforma que conecta você a profissionais autônomos da sua região, facilitando a
          busca por serviços do dia a dia.
        </p>
        <div class="cards">
          <div class="card card-verde reveal reveal--delay-1">
            <div class="card-texto">
              <h3>Simples</h3>
              <p>Serviços em poucos passos</p>
            </div>
            <div class="card-icone">
              <img src="@/assets/icons/check.svg" alt="ícone de check" />
            </div>
          </div>

          <div class="card card-cinza reveal reveal--delay-2">
            <div class="card-texto">
              <h3>Local</h3>
              <p>Profissionais perto de você</p>
            </div>
            <div class="card-icone">
              <img src="@/assets/icons/map.svg" alt="ícone de mapa" />
            </div>
          </div>

          <div class="card card-amarelo reveal reveal--delay-3">
            <div class="card-texto">
              <h3>Prático</h3>
              <p>Fale direto com o profissional</p>
            </div>
            <div class="card-icone">
              <img src="@/assets/icons/chat.svg" alt="ícone de chat" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="para-quem">
      <h1 class="reveal">Para quem é o Workinhoo?</h1>
      <div class="reveal reveal--delay-1">
        <div class="icon">
          <img src="@/assets/icons/user.svg" alt="ícone de usuário" />
        </div>
        <p class="title">Para quem <b>precisa de serviços</b></p>
        <p class="text">Encontre profissionais perto de você para te ajudar</p>
      </div>
      <div class="reveal reveal--delay-2">
        <div class="icon">
          <img src="@/assets/icons/tools.svg" alt="ícone de usuário" />
        </div>
        <p class="title">Para quem <b>oferece serviços</b></p>
        <p class="text">Divulgue seu trabalho e alcance novos clientes</p>
      </div>
    </section>

    <section class="como-funciona" id="como-funciona">
      <div class="como-funciona-title">
        <h1 class="como-funciona-titulo">Como funciona</h1>
      </div>

      <div class="como-funciona-passo como-funciona-passo-normal reveal">
        <div class="como-funciona-conteudo">
          <h1 class="como-funciona-numero">01</h1>
          <div class="como-funciona-cabecalho">
            <div class="como-funciona-icone-wrapper">
              <img src="@/assets/icons/search.svg" alt="ícone de lupa" class="como-funciona-icone" />
            </div>
            <h2 class="como-funciona-subtitulo">Busque o serviço</h2>
          </div>
          <p class="como-funciona-descricao">Encontre profissionais próximos informando o que você precisa.</p>
        </div>
        <div class="como-funciona-imagem-wrapper">
          <img src="@/assets/images/searching.svg" alt="imagem de uma pessoa procurando" class="como-funciona-imagem" />
        </div>
      </div>

      <div><img src="@/assets/icons/arrow-down.svg" alt="ícone de seta pra baixo"></div>

      <div class="como-funciona-passo como-funciona-passo-invertido reveal">
        <div class="como-funciona-imagem-wrapper">
          <img src="@/assets/images/profiles.svg" alt="imagem de perfis" class="como-funciona-imagem" />
        </div>
        <div class="como-funciona-conteudo">
          <h1 class="como-funciona-numero">02</h1>
          <div class="como-funciona-cabecalho">
            <div class="como-funciona-icone-wrapper">
              <img src="@/assets/icons/user.svg" alt="ícone de usuário" class="como-funciona-icone" />
            </div>
            <h2 class="como-funciona-subtitulo">Escolha o profissional</h2>
          </div>
          <p class="como-funciona-descricao">Veja as opções disponíveis, analise os perfis e escolha o profissional
            ideal.</p>
        </div>
      </div>

      <div><img src="@/assets/icons/arrow-down.svg" alt="ícone de seta pra baixo"></div>

      <div class="como-funciona-passo como-funciona-passo-normal reveal">
        <div class="como-funciona-conteudo">
          <h1 class="como-funciona-numero">03</h1>
          <div class="como-funciona-cabecalho">
            <div class="como-funciona-icone-wrapper">
              <img src="@/assets/icons/message.svg" alt="ícone de mensagem" class="como-funciona-icone" />
            </div>
            <h2 class="como-funciona-subtitulo">Entre em contato</h2>
          </div>
          <p class="como-funciona-descricao">Fale diretamente pelo WhatsApp para combinar os detalhes do serviço.</p>
        </div>
        <div class="como-funciona-imagem-wrapper">
          <img src="@/assets/images/chating.svg" alt="imagem de chat de internet" class="como-funciona-imagem" />
        </div>
      </div>

      <div class="banner reveal">
        <h1>É prestador de serviço?</h1>
        <p><b>Cadastre-se</b> na plataforma e <b>divulgue seus serviços</b> para encontrar novos clientes e aumentar
          suas oportunidades de trabalho.</p>
        <div>
          <img src="@/assets/icons/handshake.svg" alt="ícone de aperto de mão" />
        </div>
      </div>

      <img src="@/assets/icons/star.svg" alt="ícone de estrela" class="star-icon">
    </section>

    <section class="servicos" id="servicos">
      <div class="servicos-header reveal">
        <h1>O <b>Workinhoo</b> reúne profissionais de inúmeras áreas</h1>
        <p>Serviços para diversas necessidades do seu dia a dia</p>
      </div>

      <div class="servicos-grid reveal">
        <div class="servicos-linha servicos-linha--desktop">
          <div class="servico-card" :style="{ flex: 209, backgroundImage: `url(${pintorImg})` }">
            <span>Pintor</span>
          </div>
          <div class="servico-card" :style="{ flex: 406, backgroundImage: `url(${eletristaImg})` }">
            <span>Eletricista</span>
          </div>
          <div class="servico-card" :style="{ flex: 271, backgroundImage: `url(${daristaImg})` }">
            <span>Diarista</span>
          </div>
          <div class="servico-card" :style="{ flex: 214, backgroundImage: `url(${mecanicoImg})` }">
            <span>Mecânico</span>
          </div>
        </div>

        <div class="servicos-linha servicos-linha--mobile">
          <div class="servico-card" :style="{ flex: 209, backgroundImage: `url(${pintorImg})` }">
            <span>Pintor</span>
          </div>
          <div class="servico-card" :style="{ flex: 406, backgroundImage: `url(${eletristaImg})` }">
            <span>Eletricista</span>
          </div>
        </div>

        <div class="servicos-linha servicos-linha--mobile">
          <div class="servico-card" :style="{ flex: 271, backgroundImage: `url(${daristaImg})` }">
            <span>Diarista</span>
          </div>
          <div class="servico-card" :style="{ flex: 214, backgroundImage: `url(${mecanicoImg})` }">
            <span>Mecânico</span>
          </div>
        </div>

        <div class="servicos-linha servicos-linha--desktop">
          <div class="servico-card" :style="{ flex: 342, backgroundImage: `url(${tatuadorImg})` }">
            <span>Tatuador</span>
          </div>
          <div class="servico-card" :style="{ flex: 273, backgroundImage: `url(${encanadorImg})` }">
            <span>Encanador</span>
          </div>
          <div class="servico-card" :style="{ flex: 511, backgroundImage: `url(${pedreiroImg})` }">
            <span>Pedreiro</span>
          </div>
        </div>

        <div class="servicos-linha servicos-linha--mobile">
          <div class="servico-card" :style="{ flex: 342, backgroundImage: `url(${tatuadorImg})` }">
            <span>Tatuador</span>
          </div>
          <div class="servico-card" :style="{ flex: 273, backgroundImage: `url(${encanadorImg})` }">
            <span>Encanador</span>
          </div>
        </div>

        <div class="servicos-linha servicos-linha--mobile">
          <div class="servico-card" :style="{ flex: 1, backgroundImage: `url(${pedreiroImg})` }">
            <span>Pedreiro</span>
          </div>
        </div>
      </div>
    </section>

    <section class="comece-agora reveal">
      <h1>
        Comece agora no <b>Workinhoo</b>
      </h1>
      <p><b>Encontre profissionais</b> ou <b>divulgue seus serviços</b> de forma simples.</p>
      <router-link to="/cadastrar" class="btn-criar-conta">Criar conta <img src="@/assets/icons/arrow.svg"
          alt="ícone de seta"></router-link>
    </section>
  </main>

  <AppFooter />
</template>

<style scoped>
main {
  padding-top: 5rem;
}

.criar-conta {
  background-color: var(--color-primary-medium);
  border-radius: 0 0 0px 0px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2.5rem 1.5rem;
  width: 100%;
  gap: 2rem;
  box-shadow: 0px 0px 10px 2px #0000001A;
}

.criar-conta .left-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.criar-conta .left-content h1 {
  color: var(--color-neutral-light-lightest);
  font-size: 1.75rem;
  width: 100%;
  line-height: 1.3;
}

.criar-conta .left-content .texto-highlight {
  color: var(--color-warning-light);
}

.criar-conta .left-content p {
  color: var(--color-neutral-light-lightest);
  font-size: 1rem;
  width: 100%;
}

.criar-conta .left-content .btn-criar-conta {
  background-color: var(--color-secondary-medium);
  color: var(--color-neutral-light-lightest);
  width: fit-content;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
}

.criar-conta .left-content .btn-criar-conta img {
  width: 1rem;
}

.criar-conta .right-content {
  width: 80%;
  max-width: 260px;
}

.criar-conta .right-content img {
  width: 100%;
}

.sobre {
  padding: 3rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-neutral-light-white);
}

.sobre .content {
  width: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
}

.sobre h1 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-neutral-dark);
  text-align: center;
}

.sobre p {
  font-size: 1rem;
  color: var(--color-neutral-dark);
  text-align: center;
}

.cards {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  width: 100%;
}

.card {
  border-radius: 24px;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 10rem;
  position: relative;
  overflow: hidden;
  isolation: isolate;
  transform: translateZ(0);
  mask-image: radial-gradient(white, black);
  -webkit-mask-image: -webkit-radial-gradient(white, black);
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow 0.3s ease;
  cursor: default;
}

.card:hover {
  transform: translateY(-6px) scale(1.01);
  box-shadow: 0 20px 48px rgba(0, 0, 0, 0.13);
}

.card:hover .card-icone img {
  transform: scale(1.06) rotate(-4deg);
}

.card-icone img {
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.card-texto {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  z-index: 1;
}

.card-texto h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-neutral-light-white);
}

.card-texto p {
  font-size: 0.95rem;
  margin-top: 0.5rem;
  font-weight: 600;
  color: var(--color-neutral-light-white);
  max-width: 160px;
  line-height: 1.4;
  text-align: left;
}

.card-verde {
  background-color: var(--color-secondary-medium);
}

.card-verde .card-icone {
  position: absolute;
  right: -70px;
  bottom: -30px;
}

.card-verde .card-icone img {
  width: clamp(160px, 50vw, 270px);
  height: clamp(160px, 50vw, 270px);
  object-fit: contain;
}

.card-cinza {
  background-color: var(--color-neutral-light-dark);
}

.card-cinza .card-icone {
  position: absolute;
  right: -70px;
  bottom: -30px;
}

.card-cinza .card-icone img {
  width: clamp(150px, 48vw, 250px);
  height: clamp(150px, 48vw, 250px);
  object-fit: contain;
}

.card-amarelo {
  background-color: var(--color-warning-medium);
}

.card-amarelo .card-icone {
  position: absolute;
  right: -40px;
  bottom: -20px;
}

.card-amarelo .card-icone img {
  width: clamp(130px, 42vw, 210px);
  height: clamp(130px, 42vw, 210px);
  object-fit: contain;
}

.card-verde .card-icone img,
.card-cinza .card-icone img,
.card-amarelo .card-icone img {
  filter: drop-shadow(0px 5px 10px #5D5D5D1A);
}

.para-quem {
  width: 90%;
  margin: 0 auto;
  padding: 3rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
}

.para-quem h1 {
  font-size: 1.5rem;
  max-width: 100%;
  text-align: center;
  font-weight: 600;
  color: var(--color-neutral-dark);
}

.para-quem>div {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  width: 100%;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.para-quem>div:hover {
  transform: translateY(-4px);
}

.para-quem div div.icon,
.para-quem>div>div:first-child {
  background-color: var(--color-primary-medium);
  border-radius: 24px;
  box-shadow: 0px 0px 20px 2px #5656561A;
  width: 90px;
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow 0.3s ease;
}

.para-quem>div:hover div.icon {
  transform: scale(1.08) rotate(-6deg);
  box-shadow: 0 12px 30px rgba(88, 60, 196, 0.3);
}

.para-quem .icon img {
  width: 55px;
  height: 55px;
}

.para-quem .title {
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--color-neutral-dark);
  text-align: center;
}

.para-quem .text {
  font-size: 0.9rem;
  font-weight: 400;
  color: var(--color-neutral-dark);
  text-align: center;
  max-width: 80%;
}

.como-funciona {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  background-color: #AEBDD526;
}

.como-funciona-title {
  background-color: #A6B4CA;
  width: 100%;
  padding: 1.5rem 0;
}

.como-funciona-titulo {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-neutral-light-white);
  text-align: center;
}

.como-funciona-passo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  width: 90%;
}

.como-funciona-passo-invertido {
  flex-direction: column-reverse;
}

.como-funciona-conteudo {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}

.como-funciona-numero {
  font-size: 3.5rem;
  font-weight: 800;
  color: var(--color-neutral-darkest);
  line-height: 1;
  margin: 0;
}

.como-funciona-cabecalho {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.como-funciona-icone-wrapper {
  width: 60px;
  height: 60px;
  background-color: var(--color-primary-medium);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow 0.3s ease;
}

.como-funciona-icone-wrapper:hover {
  transform: scale(1.12) rotate(-5deg);
  box-shadow: 0 8px 24px rgba(88, 60, 196, 0.35);
}

.como-funciona-icone {
  width: 38px;
  height: 38px;
  filter: brightness(0) invert(1);
}

.como-funciona-subtitulo {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-neutral-darkest);
  margin: 0;
}

.como-funciona-descricao {
  font-size: 1rem;
  color: var(--color-neutral-dark);
  line-height: 1.5;
  margin: 0;
}

.como-funciona-imagem-wrapper {
  width: 100%;
  background-color: var(--color-neutral-light-white);
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-shadow: 0px 0px 20px 2px #2DB4871A;
  height: 14rem;
  padding: 1rem;
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow 0.35s ease;
}

.como-funciona-imagem-wrapper:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(45, 180, 135, 0.18);
}

.como-funciona-imagem {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.como-funciona .banner {
  background-color: var(--color-primary-medium);
  width: 90%;
  border-radius: 24px;
  box-shadow: 0px 5px 20px 2px #8B8B8B1A;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  padding: 2rem 1.5rem;
  margin: 2rem 0;
}

.como-funciona .banner h1 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-neutral-light-white);
  text-align: center;
}

.como-funciona .banner p {
  font-size: 1rem;
  font-weight: 400;
  width: 100%;
  margin: 0 auto;
  color: var(--color-neutral-light-white);
  text-align: center;
}

.como-funciona .banner div {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--color-neutral-light-white);
  border-radius: 100%;
  width: 8rem;
  height: 8rem;
  animation: pulse-suave 3s ease-in-out infinite;
}

.como-funciona .banner div img {
  width: 8rem;
  height: 8rem;
}

@keyframes pulse-suave {

  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.06);
  }
}

.star-icon {
  margin-bottom: -50px;
  animation: girar-lento 12s linear infinite;
  transform-origin: center;
}

@keyframes girar-lento {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.como-funciona>div>img[alt="ícone de seta pra baixo"] {
  animation: bounce-down 1.8s ease-in-out infinite;
}

@keyframes bounce-down {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(6px);
  }
}

.servicos {
  padding: 4rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  background-color: var(--color-neutral-light-white);
  margin-bottom: 2rem;
}

.servicos-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  text-align: center;
  padding: 0 1.25rem;
}

.servicos-header h1 {
  font-size: 1.25rem;
  font-weight: 500;
  color: var(--color-neutral-dark);
}

.servicos-header p {
  font-size: 1rem;
  color: var(--color-neutral-dark);
}

.servicos-linha--desktop {
  display: none;
}

.servicos-linha--mobile {
  display: flex;
  gap: 1rem;
  height: 40vw;
  min-height: 100px;
}

.servicos-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 90%;
}

.servico-card {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0px 0px 19.05px 1.9px #5656561A;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-width: 0;
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow 0.35s ease;
}

.servico-card:hover {
  transform: scale(1.03);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.22);
  z-index: 2;
}

.servico-card::after {
  content: '';
  position: absolute;
  inset: 0;
  background: #1F29374D;
}

.servico-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.servico-card:hover img {
  transform: scale(1.08);
}

.servico-card span {
  position: absolute;
  bottom: 50%;
  left: 50%;
  transform: translate(-50%, 50%);
  color: var(--color-neutral-light-white);
  font-size: 0.85rem;
  font-weight: 700;
  white-space: nowrap;
  z-index: 1;
  transition: letter-spacing 0.3s ease;
}

.servico-card:hover span {
  letter-spacing: 0.05em;
}

.comece-agora {
  background-color: var(--color-primary-medium);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  padding: 3rem 1.5rem;
}

.comece-agora h1 {
  font-size: 1.5rem;
  font-weight: 500;
  color: var(--color-neutral-light-white);
  text-align: center;
}

.comece-agora p {
  font-size: 1rem;
  font-weight: 400;
  color: var(--color-neutral-light-white);
  text-align: center;
}

.comece-agora .btn-criar-conta {
  background-color: var(--color-secondary-medium);
  color: var(--color-neutral-light-lightest);
  width: fit-content;
  border-radius: 24px;
  font-size: 1.1rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
}

.comece-agora .btn-criar-conta img {
  width: 1rem;
}

.btn-criar-conta {
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow 0.25s ease;
  text-decoration: none;
}

.btn-criar-conta:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.2);
}

.btn-criar-conta img {
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.btn-criar-conta:hover img {
  transform: translateX(4px);
}

.reveal {
  opacity: 0;
  transform: translateY(32px);
  transition: opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.65s cubic-bezier(0.16, 1, 0.3, 1);
}

.reveal.reveal--visivel {
  opacity: 1;
  transform: translateY(0);
}

.reveal--delay-1 {
  transition-delay: 0.1s;
}

.reveal--delay-2 {
  transition-delay: 0.2s;
}

.reveal--delay-3 {
  transition-delay: 0.3s;
}

.reveal--delay-4 {
  transition-delay: 0.4s;
}

@media (prefers-reduced-motion: reduce) {
  .reveal {
    opacity: 1;
    transform: none;
    transition: none;
  }

  .card,
  .servico-card,
  .btn-criar-conta,
  .star-icon,
  .como-funciona .banner div,
  .como-funciona>div>img {
    animation: none !important;
    transition: none !important;
  }
}

@media (min-width: 768px) {
  main {
    padding: 0;
  }

  .criar-conta {
    border-radius: 24px;
    flex-direction: row;
    justify-content: space-between;
    margin: 1.5rem auto;
    padding: 3rem 3rem;
    width: 90%;
  }

  .criar-conta .left-content {
    width: 60%;
    gap: 2rem;
  }

  .criar-conta .left-content h1 {
    font-size: 2rem;
    width: 90%;
  }

  .criar-conta .left-content p {
    font-size: 1.1rem;
    width: 85%;
  }

  .criar-conta .left-content .btn-criar-conta {
    font-size: 1.1rem;
    padding: 0.85rem 1.75rem;
    border-radius: 24px;
  }

  .criar-conta .left-content .btn-criar-conta img {
    width: 1.1rem;
  }

  .criar-conta .right-content {
    width: 38%;
    max-width: none;
  }

  .sobre .content {
    width: 90%;
    gap: 3rem;
  }

  .sobre h1 {
    font-size: 2rem;
  }

  .sobre p {
    font-size: 1.1rem;
  }

  .cards {
    flex-direction: row;
    justify-content: center;
    gap: 2rem;
  }

  .card {
    height: 12rem;
    padding: 1.5rem;
  }

  .card-verde .card-icone {
    bottom: -60px;
  }

  .card-amarelo .card-icone {
    bottom: -25px;
  }

  .card-cinza .card-icone {
    bottom: -50px;
  }

  .card-texto h3 {
    font-size: 1.35rem;
  }

  .card-texto p {
    font-size: 1rem;
  }

  .para-quem {
    width: 90%;
    padding: 5rem 0;
    flex-direction: row;
    justify-content: space-between;
    gap: 1.5rem;
  }

  .para-quem h1 {
    font-size: 2rem;
    max-width: 220px;
  }

  .para-quem>div {
    width: auto;
  }

  .para-quem div div.icon,
  .para-quem>div>div:first-child {
    width: 100px;
    height: 100px;
  }

  .para-quem .icon img {
    width: 60px;
    height: 60px;
  }

  .para-quem .title {
    font-size: 1.2rem;
  }

  .para-quem .text {
    font-size: 0.95rem;
    max-width: 200px;
  }

  .como-funciona {
    gap: 3rem;
  }

  .como-funciona-title {
    padding: 1.75rem 0;
  }

  .como-funciona-titulo {
    font-size: 2rem;
  }

  .como-funciona-passo {
    flex-direction: row;
    justify-content: space-between;
    gap: 3rem;
    width: 90%;
  }

  .como-funciona-passo-invertido {
    flex-direction: row;
  }

  .como-funciona-numero {
    font-size: 4.5rem;
  }

  .como-funciona-icone-wrapper {
    width: 68px;
    height: 68px;
  }

  .como-funciona-icone {
    width: 44px;
    height: 44px;
  }

  .como-funciona-subtitulo {
    font-size: 1.25rem;
  }

  .como-funciona-descricao {
    font-size: 1.1rem;
  }

  .como-funciona-imagem-wrapper {
    height: 18rem;
    max-width: 28rem;
  }

  .como-funciona .banner {
    width: 90%;
    padding: 3rem;
    gap: 3rem;
    margin: 3rem 0;
  }

  .como-funciona .banner h1 {
    font-size: 2rem;
  }

  .como-funciona .banner p {
    font-size: 1.2rem;
    width: 85%;
  }

  .como-funciona .banner div {
    width: 9.5rem;
    height: 9.5rem;
  }

  .como-funciona .banner div img {
    width: 9.5rem;
    height: 9.5rem;
  }

  .servicos {
    padding: 5rem 0;
    gap: 2.5rem;
    margin-bottom: 3rem;
  }

  .servicos-header h1 {
    font-size: 1.6rem;
  }

  .servicos-header p {
    font-size: 1.1rem;
  }

  .servicos-grid {
    gap: 1.25rem;
    width: 90%;
  }

  .servicos-linha {
    gap: 1.25rem;
    height: 22vw;
    min-height: 130px;
  }

  .servicos-linha--desktop {
    display: flex;
    gap: 1.25rem;
    height: 22vw;
    min-height: 130px;
  }

  .servicos-linha--mobile {
    display: none;
  }

  .servico-card {
    border-radius: 18px;
  }

  .servico-card span {
    font-size: 1rem;
  }

  .comece-agora {
    gap: 3rem;
    padding: 4rem 3rem;
  }

  .comece-agora h1 {
    font-size: 2rem;
  }

  .comece-agora p {
    font-size: 1.2rem;
  }

  .comece-agora .btn-criar-conta {
    font-size: 1.35rem;
    padding: 0.9rem 1.75rem;
  }

  .comece-agora .btn-criar-conta img {
    width: 1.2rem;
  }
}

@media (min-width: 1280px) {
  .criar-conta {
    margin: 1.5rem auto;
    padding: 4rem;
    width: 85%;
  }

  .criar-conta .left-content {
    gap: 2rem;
  }

  .criar-conta .left-content h1 {
    font-size: 2.5rem;
    width: 80%;
  }

  .criar-conta .left-content p {
    font-size: 1.4rem;
    width: 80%;
  }

  .criar-conta .left-content .btn-criar-conta {
    font-size: 1.35rem;
    padding: 0.85rem 1.75rem;
    border-radius: 24px;
  }

  .criar-conta .left-content .btn-criar-conta img {
    width: 1.2rem;
  }

  .sobre .content {
    width: 85%;
    gap: 3.5rem;
  }

  .sobre h1 {
    font-size: 2rem;
  }

  .sobre p {
    font-size: 1.1rem;
  }

  .cards {
    gap: 2.5rem;
  }

  .card {
    width: 18rem;
    height: 13rem;
    padding: 1.75rem;
  }

  .card-texto h3 {
    font-size: 1.35rem;
  }

  .card-texto p {
    font-size: 1rem;
  }

  .card-verde .card-icone img {
    width: 240px;
    height: 240px;
  }

  .card-verde .card-icone {
    right: -80px;
    bottom: -35px;
  }

  .card-cinza .card-icone img {
    width: 220px;
    height: 220px;
  }

  .card-cinza .card-icone {
    right: -85px;
    bottom: -35px;
  }

  .card-amarelo .card-icone img {
    width: 190px;
    height: 190px;
  }

  .card-amarelo .card-icone {
    right: -55px;
    bottom: -20px;
  }

  .para-quem {
    width: 85%;
    padding: 5rem 0;
  }

  .para-quem h1 {
    font-size: 2rem;
    max-width: 250px;
  }

  .para-quem div div.icon,
  .para-quem>div>div:first-child {
    width: 110px;
    height: 110px;
  }

  .para-quem .icon img {
    width: 62px;
    height: 62px;
  }

  .para-quem .title {
    font-size: 1.25rem;
  }

  .para-quem .text {
    font-size: 1rem;
    max-width: 70%;
  }

  .como-funciona {
    gap: 3rem;
  }

  .como-funciona-titulo {
    font-size: 2rem;
  }

  .como-funciona-passo {
    gap: 3rem;
    max-width: 85%;
    width: auto;
  }

  .como-funciona-numero {
    font-size: 4.5rem;
  }

  .como-funciona-icone-wrapper {
    width: 70px;
    height: 70px;
    border-radius: 16px;
  }

  .como-funciona-icone {
    width: 44px;
    height: 44px;
  }

  .como-funciona-subtitulo {
    font-size: 1.25rem;
  }

  .como-funciona-descricao {
    font-size: 1.1rem;
  }

  .como-funciona-imagem-wrapper {
    height: 18rem;
    max-width: 30rem;
    padding: 1.25rem;
  }

  .como-funciona .banner {
    width: 85%;
    gap: 3rem;
    padding: 3rem;
    margin: 3rem 0;
  }

  .como-funciona .banner h1 {
    font-size: 2rem;
  }

  .como-funciona .banner p {
    font-size: 1.2rem;
    width: 80%;
  }

  .como-funciona .banner div {
    width: 9.5rem;
    height: 9.5rem;
  }

  .como-funciona .banner div img {
    width: 9.5rem;
    height: 9.5rem;
  }

  .servicos {
    padding: 5rem 0;
    gap: 2.5rem;
    margin-bottom: 3rem;
  }

  .servicos-header h1 {
    font-size: 1.75rem;
  }

  .servicos-header p {
    font-size: 1.15rem;
  }

  .servicos-grid {
    gap: 1.5rem;
    width: 85%;
  }

  .servicos-linha {
    gap: 1.5rem;
    height: 18vw;
    min-height: 140px;
  }

  .servico-card {
    border-radius: 20px;
  }

  .servico-card span {
    font-size: 1.1rem;
  }

  .comece-agora {
    gap: 3rem;
    padding: 4rem;
  }

  .comece-agora h1 {
    font-size: 2rem;
  }

  .comece-agora p {
    font-size: 1.2rem;
  }

  .comece-agora .btn-criar-conta {
    font-size: 1.5rem;
    padding: 0.9rem 1.75rem;
  }

  .comece-agora .btn-criar-conta img {
    width: 1.2rem;
  }
}
</style>