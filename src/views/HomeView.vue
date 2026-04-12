<script setup lang="ts">
import pintorImg from '@/assets/images/pintor.jpg'
import eletristaImg from '@/assets/images/eletricista.jpg'
import daristaImg from '@/assets/images/diarista.jpg'
import mecanicoImg from '@/assets/images/mecanico.jpg'
import tatuadorImg from '@/assets/images/tatuador.jpg'
import encanadorImg from '@/assets/images/encanador.jpg'
import pedreiroImg from '@/assets/images/pedreiro.jpg'
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
  </header>

  <main>
    <section class="criar-conta">
      <div class="left-content">
        <h1>Encontre <span class="texto-highlight">profissionais perto de você</span>, sem complicação</h1>
        <p>Conectamos você a profissionais locais de forma simples e rápida.</p>
        <router-link to="/cadastrar" class="btn-criar-conta">Criar conta <img src="@/assets/icons/arrow.svg"
            alt="ícone de seta"></router-link>
      </div>
      <div class="right-content">
        <img src="@/assets/images/greeting.svg" alt="imagem de pessoas se cumprimentando" />
      </div>
    </section>

    <section class="sobre" id="sobre">
      <div class="content">
        <h1>
          O que é o Workinhoo?
        </h1>
        <p>
          O <b>Workinhoo</b> é uma plataforma que conecta você a profissionais autônomos da sua região, facilitando a
          busca por serviços do dia a dia.
        </p>
        <div class="cards">
          <div class="card card-verde">
            <div class="card-texto">
              <h3>Simples</h3>
              <p>Serviços em poucos passos</p>
            </div>
            <div class="card-icone">
              <img src="@/assets/icons/check.svg" alt="ícone de check" />
            </div>
          </div>

          <div class="card card-cinza">
            <div class="card-texto">
              <h3>Local</h3>
              <p>Profissionais perto de você</p>
            </div>
            <div class="card-icone">
              <img src="@/assets/icons/map.svg" alt="ícone de mapa" />
            </div>
          </div>

          <div class="card card-amarelo">
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
      <h1>Para quem é o Workinhoo?</h1>
      <div>
        <div class="icon">
          <img src="@/assets/icons/user.svg" alt="ícone de usuário" />
        </div>
        <p class="title">Para quem <b>precisa de serviços</b></p>
        <p class="text">Encontre profissionais perto de você para te ajudar</p>
      </div>
      <div>
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

      <div class="como-funciona-passo como-funciona-passo-normal">
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

      <div class="como-funciona-passo como-funciona-passo-invertido">
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

      <div class="como-funciona-passo como-funciona-passo-normal">
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

      <div class="banner">
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
      <div class="servicos-header">
        <h1>O <b>Workinhoo</b> reúne profissionais de inúmeras áreas</h1>
        <p>Serviços para diversas necessidades do seu dia a dia</p>
      </div>

      <div class="servicos-grid">
        <div class="servicos-linha">
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
        <div class="servicos-linha">
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
      </div>
    </section>
  </main>
</template>

<style scoped>
header {
  background-color: var(--color-neutral-light-white);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;
  width: 80%;
  height: 7rem;
  padding: 0 2rem;
  border-bottom-left-radius: 24px;
  border-bottom-right-radius: 24px;
  box-shadow: 0px 4px 16px 0px #2A2A2A0D;
}

.logo {
  color: var(--color-primary-medium);
  font-weight: 700;
  font-size: 1.5rem;
}

.menu-nav nav ul {
  display: flex;
  align-items: center;
  gap: 3rem;
  list-style: none;
  padding: 0;
}

.menu-nav nav ul a {
  color: var(--color-neutral-dark);
  font-family: Poppins;
  font-weight: 600;
  font-size: 1.2rem;
}

.menu-login {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.btn-entrar {
  color: var(--color-neutral-dark);
  font-family: Poppins;
  font-weight: 600;
  font-size: 1.2rem;
}

.btn-cadastrar {
  background-color: var(--color-primary-medium);
  color: var(--color-neutral-light-lightest);
  font-family: Poppins;
  padding: 1rem 1.5rem;
  border-radius: 24px;
  font-weight: 600;
  font-size: 1.2rem;
}

.criar-conta {
  background-color: var(--color-primary-medium);
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 2rem auto;
  padding: 6rem 6rem;
  width: 80%;
  box-shadow: 0px 0px 10px 2px #0000001A;
}

.criar-conta .left-content {
  width: 60%;
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.criar-conta .left-content h1 {
  color: var(--color-neutral-light-lightest);
  font-size: 3.5rem;
  width: 70%;
  line-height: 1.3;
}

.criar-conta .left-content .texto-highlight {
  color: var(--color-warning-light);
}

.criar-conta .left-content p {
  color: var(--color-neutral-light-lightest);
  font-size: 2rem;
  width: 70%;
}

.criar-conta .left-content .btn-criar-conta {
  background-color: var(--color-secondary-medium);
  color: var(--color-neutral-light-lightest);
  width: fit-content;
  border-radius: 24px;
  font-size: 2rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: space-between;
  padding: 1rem 2rem;
}

.criar-conta .left-content .btn-criar-conta img {
  width: 1.5rem;
}

.criar-conta .right-content {
  width: 40%;
}

.criar-conta .right-content img {
  width: 100%;
}

.sobre {
  padding: 4rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-neutral-light-white);
}

.sobre .content {
  width: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5rem;
}

.sobre h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-neutral-dark);
  text-align: center;
}

.sobre p {
  font-size: 1.2rem;
  color: var(--color-neutral-dark);
}

.cards {
  display: flex;
  gap: 4rem;
}

.card {
  flex: 1;
  border-radius: 24px;
  padding: 2rem;
  display: flex;
  justify-content: space-between;
  width: 22rem;
  height: 15rem;
  position: relative;
  overflow: hidden;
}

.card-texto {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  z-index: 1;
}

.card-texto h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-neutral-light-white);
}

.card-texto p {
  font-size: 1.1rem;
  margin-top: 1rem;
  font-weight: 600;
  color: var(--color-neutral-light-white);
  max-width: 160px;
  line-height: 1.4;
}

.card-verde {
  background-color: var(--color-secondary-medium);
}

.card-verde .card-icone {
  position: absolute;
  right: -90px;
  bottom: -50px;
}

.card-verde .card-icone img {
  width: 300px;
  height: 300px;
  object-fit: contain;
}

.card-cinza {
  background-color: var(--color-neutral-light-dark);
}

.card-cinza .card-icone {
  position: absolute;
  right: -110px;
  bottom: -30px;
}

.card-cinza .card-icone img {
  width: 280px;
  height: 280px;
  object-fit: contain;
}

.card-amarelo {
  background-color: var(--color-warning-medium);
}

.card-amarelo .card-icone {
  position: absolute;
  right: -80px;
  bottom: -20px;
}

.card-amarelo .card-icone img {
  width: 240px;
  height: 240px;
  object-fit: contain;
}

.card-verde .card-icone img,
.card-cinza .card-icone img,
.card-amarelo .card-icone img {
  filter: drop-shadow(0px 5px 10px #5D5D5D1A);
}

.para-quem {
  width: 80%;
  margin: 0 auto;
  padding: 8rem 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.para-quem h1 {
  font-size: 2.5rem;
  max-width: 300px;
  text-align: center;
  font-weight: 600;
  color: var(--color-neutral-dark);
}

.para-quem div {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.para-quem div div {
  background-color: var(--color-primary-medium);
  border-radius: 24px;
  box-shadow: 0px 0px 20px 2px #5656561A;
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.para-quem .icon img {
  width: 70px;
  height: 70px;
}

.para-quem .title {
  font-size: 1.5rem;
  font-weight: 500;
  color: var(--color-neutral-dark);
  text-align: center;
}

.para-quem .text {
  font-size: 1rem;
  font-weight: 400;
  color: var(--color-neutral-dark);
  text-align: center;
  max-width: 70%;
}

.como-funciona {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4rem;
  background-color: #AEBDD526;
}

.como-funciona-title {
  background-color: #A6B4CA;
  width: 100%;
  padding: 2rem 0;
}

.como-funciona-titulo {
  font-size: 2.5rem;
  font-weight: 600;
  color: var(--color-neutral-light-white);
  text-align: center;
}

.como-funciona-passo {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4rem;
  max-width: 80%;
}

.como-funciona-passo-invertido {
  flex-direction: row;
}

.como-funciona-conteudo {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  flex: 1;
}

.como-funciona-numero {
  font-size: 5rem;
  font-weight: 800;
  color: var(--color-neutral-darkest);
  line-height: 1;
  margin: 0;
}

.como-funciona-cabecalho {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.como-funciona-icone-wrapper {
  width: 80px;
  height: 80px;
  background-color: var(--color-primary-medium);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.como-funciona-icone {
  width: 50px;
  height: 50px;
  filter: brightness(0) invert(1);
}

.como-funciona-subtitulo {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-neutral-darkest);
  margin: 0;
}

.como-funciona-descricao {
  font-size: 1.2rem;
  color: var(--color-neutral-dark);
  line-height: 1.5;
  margin: 0;
}

.como-funciona-imagem-wrapper {
  flex: 1;
  background-color: var(--color-neutral-light-white);
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  box-shadow: 0px 0px 20px 2px #2DB4871A;
  height: 22rem;
  max-width: 35rem;
  padding: 1.5rem;
}

.como-funciona-imagem {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.como-funciona .banner {
  background-color: var(--color-primary-medium);
  width: 80%;
  border-radius: 24px;
  box-shadow: 0px 5px 20px 2px #8B8B8B1A;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4rem;
  padding: 4rem;
  margin: 4rem 0;
}

.como-funciona .banner h1 {
  font-size: 2.5rem;
  font-weight: 600;
  color: var(--color-neutral-light-white);
}

.como-funciona .banner p {
  font-size: 1.5rem;
  font-weight: 400;
  width: 80%;
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
  width: 11rem;
  height: 11rem;
}

.como-funciona .banner div img {
  width: 11rem;
  height: 11rem;
}

.star-icon {
  margin-bottom: -50px;
}

.servicos {
  padding: 8rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3rem;
  background-color: var(--color-neutral-light-white);
}

.servicos-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  text-align: center;
}

.servicos-header h1 {
  font-size: 2rem;
  font-weight: 500;
  color: var(--color-neutral-dark);
}

.servicos-header p {
  font-size: 1.3rem;
  color: var(--color-neutral-dark);
}

.servicos-grid {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 80%;
}

.servicos-linha {
  display: flex;
  gap: 2rem;
  height: 18vw;
  min-height: 160px;
}

.servico-card {
  position: relative;
  border-radius: 22px;
  overflow: hidden;
  box-shadow: 0px 0px 19.05px 1.9px #5656561A;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
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
  image-rendering: high-quality;
  will-change: transform;
}

.servico-card span {
  position: absolute;
  bottom: 50%;
  left: 50%;
  transform: translate(-50%, 50%);
  color: var(--color-neutral-light-white);
  font-size: 1.3rem;
  font-weight: 700;
  white-space: nowrap;
  z-index: 1;
}
</style>
