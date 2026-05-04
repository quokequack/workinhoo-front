<script setup lang="ts">
import { ref } from 'vue'
import RegisterSidebar from '@/components/register/RegisterSidebar.vue'
import StepIndicator from '@/components/register/StepIndicator.vue'
import StepDadosPessoais from '@/components/register/StepDadosPessoais.vue'
import StepEndereco from '@/components/register/StepEndereco.vue'
import StepServicos from '@/components/register/StepServicos.vue'

interface DadosPessoais { nome: string; cpf: string; telefone: string; email: string; senha: string; confirmarSenha: string }
interface Endereco { rua: string; numero: string; cidade: string; bairro: string; cep: string; complemento: string }
interface Servicos { prestador: boolean; servicosPrestados: string[]; bairrosAtendidos: string[]; descricao: string; telefoneProfissional: string }

const stepAtual = ref(1)

const formData = ref({
  dadosPessoais: { nome: '', cpf: '', telefone: '', email: '', senha: '', confirmarSenha: '' } as DadosPessoais,
  endereco: { rua: '', numero: '', cidade: '', bairro: '', cep: '', complemento: '' } as Endereco,
  servicos: { prestador: false, servicosPrestados: [], bairrosAtendidos: [], descricao: '', telefoneProfissional: '' } as Servicos
})

function handleProximoDados(dados: DadosPessoais) { formData.value.dadosPessoais = dados; stepAtual.value++ }
function handleProximoEndereco(endereco: Endereco) { formData.value.endereco = endereco; stepAtual.value++ }
function handleCadastrar(servicos: Servicos) { formData.value.servicos = servicos; console.log('Cadastrar:', formData.value) }
function voltar() { if (stepAtual.value > 1) stepAtual.value-- }
</script>

<template>
  <div class="cadastrar-pagina">
    <RegisterSidebar />

    <main class="cadastrar-main">
      <div class="mobile-banner">
        <div class="mobile-banner-topo">
          <router-link to="/" class="btn-inicio-banner">Início</router-link>
          <p class="mobile-entrar-banner">
            Já tem conta?
            <router-link to="/entrar" class="link-banner">Entrar</router-link>
          </p>
        </div>
        <div class="mobile-banner-conteudo">
          <span class="mobile-banner-logo">Workinhoo</span>
          <p class="mobile-banner-slogan">Crie sua conta gratuitamente ✨</p>
        </div>
        <div class="mobile-banner-onda" />
      </div>

      <StepIndicator :step-atual="stepAtual" />

      <div class="form-area">
        <Transition name="step" mode="out-in">
          <StepDadosPessoais v-if="stepAtual === 1" :dados="formData.dadosPessoais" @proximo="handleProximoDados" />
          <StepEndereco v-else-if="stepAtual === 2" :dados="formData.endereco" @proximo="handleProximoEndereco"
            @voltar="voltar" />
          <StepServicos v-else-if="stepAtual === 3" :dados="formData.servicos" @cadastrar="handleCadastrar"
            @voltar="voltar" />
        </Transition>
      </div>
    </main>
  </div>
</template>

<style scoped>
.cadastrar-pagina {
  display: flex;
  min-height: 100dvh;
}

.cadastrar-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: var(--color-neutral-light-white);
  min-height: 100dvh;
  overflow-y: auto;
}

.mobile-banner {
  display: flex;
  flex-direction: column;
  background: var(--color-primary-medium);
  padding: 1.25rem 1.25rem 2.75rem;
  position: relative;
  overflow: hidden;
}

.mobile-banner::before {
  content: '';
  position: absolute;
  top: -50px;
  right: -40px;
  width: 170px;
  height: 170px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.06);
  pointer-events: none;
}

.mobile-banner::after {
  content: '';
  position: absolute;
  bottom: 10px;
  left: -35px;
  width: 130px;
  height: 130px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  pointer-events: none;
}

.mobile-banner-topo {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.35rem;
  position: relative;
  z-index: 1;
}

.btn-inicio-banner {
  border: 1.5px solid rgba(255, 255, 255, 0.5);
  color: white;
  padding: 0.28rem 0.8rem;
  border-radius: 8px;
  font-size: 0.76rem;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.2s ease;
}

.btn-inicio-banner:hover {
  background: rgba(255, 255, 255, 0.15);
}

.mobile-entrar-banner {
  font-size: 0.76rem;
  color: rgba(255, 255, 255, 0.72);
}

.link-banner {
  color: white;
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.mobile-banner-conteudo {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.mobile-banner-logo {
  font-size: 1.55rem;
  font-weight: 800;
  color: white;
  letter-spacing: -0.03em;
}

.mobile-banner-slogan {
  font-size: 0.82rem;
  color: rgba(255, 255, 255, 0.75);
  font-weight: 500;
  line-height: 1.4;
}

.mobile-banner-onda {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 32px;
  background: var(--color-neutral-light-white);
  clip-path: ellipse(55% 100% at 50% 100%);
}

@media (min-width: 768px) {
  .mobile-banner {
    display: none;
  }
}

.form-area {
  flex: 1;
  padding: 1.25rem 1.25rem 2rem;
}

.step-enter-active,
.step-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.step-enter-from {
  opacity: 0;
  transform: translateX(14px);
}

.step-leave-to {
  opacity: 0;
  transform: translateX(-14px);
}

@media (min-width: 768px) {
  .form-area {
    padding: 1.5rem 5rem 2.5rem;
  }
}
</style>
