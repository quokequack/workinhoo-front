<script setup lang="ts">
import { reactive, ref, nextTick } from 'vue'
import SelectCustom from '@/components/register/SelectCustom.vue'

interface Servicos {
  prestador: boolean
  servicosPrestados: string[]
  bairrosAtendidos: string[]
  descricao: string
  telefoneProfissional: string
}

const props = defineProps<{ dados: Servicos }>()
const emit = defineEmits<{ cadastrar: [dados: Servicos]; voltar: [] }>()

const form = reactive({
  ...props.dados,
  servicosPrestados: [...props.dados.servicosPrestados],
  bairrosAtendidos: [...props.dados.bairrosAtendidos]
})
const enviado = ref(false)
const agitando = ref(false)
const entrou = ref(false)
const tocado = reactive({ telefoneProfissional: false })

const opcoes_servicos = [
  { value: 'eletricista', label: 'Eletricista' },
  { value: 'encanador', label: 'Encanador' },
  { value: 'pintor', label: 'Pintor' },
  { value: 'pedreiro', label: 'Pedreiro' },
  { value: 'marceneiro', label: 'Marceneiro' },
  { value: 'mecanico', label: 'Mecânico' },
  { value: 'diarista', label: 'Diarista' },
  { value: 'tatuador', label: 'Tatuador' },
  { value: 'cabeleireiro', label: 'Cabeleireiro / Barbeiro' },
  { value: 'personal-trainer', label: 'Personal Trainer' },
  { value: 'fotografo', label: 'Fotógrafo' },
  { value: 'professor', label: 'Professor particular' },
  { value: 'ti', label: 'TI / Informática' },
]

const opcoes_bairros = [
  { value: 'pajucara', label: 'Pajuçara' },
  { value: 'ponta-verde', label: 'Ponta Verde' },
  { value: 'jatiuca', label: 'Jatiúca' },
  { value: 'centro', label: 'Centro' },
  { value: 'farol', label: 'Farol' },
  { value: 'pinheiro', label: 'Pinheiro' },
  { value: 'mangabeiras', label: 'Mangabeiras' },
  { value: 'gruta-de-lourdes', label: 'Gruta de Lourdes' },
  { value: 'levada', label: 'Levada' },
  { value: 'bebedouro', label: 'Bebedouro' },
  { value: 'poco', label: 'Poço' },
  { value: 'feitosa', label: 'Feitosa' },
  { value: 'benedito-bentes', label: 'Benedito Bentes' },
  { value: 'tabuleiro', label: 'Tabuleiro' },
  { value: 'jacintinho', label: 'Jacintinho' },
  { value: 'clima-bom', label: 'Clima Bom' },
]

function formatarTelefone(digits: string): string {
  const d = digits.slice(0, 11)
  if (d.length > 7) return d.replace(/^(\d{2})(\d{5})(\d{1,4})$/, '($1) $2-$3')
  if (d.length > 2) return d.replace(/^(\d{2})(\d+)$/, '($1) $2')
  return d
}

function aplicarMascara(
  input: HTMLInputElement,
  formatar: (digits: string) => string,
  setter: (v: string) => void
) {
  const cursorAntes = input.selectionStart ?? 0
  const digitosAntes = input.value.slice(0, cursorAntes).replace(/\D/g, '').length

  const digits = input.value.replace(/\D/g, '')
  const formatado = formatar(digits)
  setter(formatado)

  nextTick(() => {
    let digitosContados = 0
    let novoCursor = 0
    for (let i = 0; i < formatado.length; i++) {
      const char = formatado[i] ?? ''
      if (/\d/.test(char)) digitosContados++
      if (digitosContados === digitosAntes) { novoCursor = i + 1; break }
      novoCursor = i + 1
    }
    input.setSelectionRange(novoCursor, novoCursor)
  })
}

function mascaraTelefone(e: Event) {
  aplicarMascara(e.target as HTMLInputElement, formatarTelefone, v => { form.telefoneProfissional = v })
}

function telefoneValido(tel: string): boolean {
  const d = tel.replace(/\D/g, '')
  return d.length === 10 || d.length === 11
}

function validar() {
  if (!form.prestador) return true
  return (
    form.servicosPrestados.length > 0 &&
    form.bairrosAtendidos.length > 0 &&
    form.descricao.trim() &&
    (!form.telefoneProfissional || telefoneValido(form.telefoneProfissional))
  )
}

function onAnimacaoEntrar() {
  entrou.value = true
}

function handleCadastrar() {
  enviado.value = true
  if (!validar()) {
    agitando.value = true
    setTimeout(() => (agitando.value = false), 500)
    return
  }
  emit('cadastrar', { ...form })
}
</script>

<template>
  <form @submit.prevent="handleCadastrar" class="step-form" :class="{
    'step-form-entrar': !entrou,
    'form-agitando': agitando
  }" @animationend="onAnimacaoEntrar" novalidate>

    <div class="pergunta-wrapper">
      <h3 class="pergunta-titulo">Você deseja oferecer serviços na plataforma?</h3>
      <div class="radio-grupo">
        <label class="radio-item">
          <input type="radio" :value="false" v-model="form.prestador" class="radio-input" />
          <span class="radio-circulo"></span>
          <span class="radio-texto">Não</span>
        </label>
        <label class="radio-item">
          <input type="radio" :value="true" v-model="form.prestador" class="radio-input" />
          <span class="radio-circulo"></span>
          <span class="radio-texto">Sim, quero prestar serviços</span>
        </label>
      </div>
    </div>

    <Transition name="servicos-expandir">
      <div v-if="form.prestador" class="servicos-bloco">
        <div class="separador">
          <div class="separador-linha"></div>
          <div class="separador-icone">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
          </div>
          <div class="separador-linha"></div>
        </div>

        <h3 class="servicos-titulo">Serviços prestados</h3>

        <div class="form-grupo">
          <label class="form-rotulo">Serviços prestados</label>
          <SelectCustom v-model="form.servicosPrestados" :opcoes="opcoes_servicos"
            placeholder="Ex: Eletricista, Encanador, Pintor" :multiplo="true"
            :class="{ 'select-erro': enviado && !form.servicosPrestados.length }" />
          <p v-if="enviado && !form.servicosPrestados.length" class="erro-texto">Selecione ao menos um serviço</p>
        </div>

        <div class="form-grupo">
          <label class="form-rotulo">Bairros atendidos</label>
          <SelectCustom v-model="form.bairrosAtendidos" :opcoes="opcoes_bairros"
            placeholder="Ex: Centro, Jatiúca, Ponta Verde" :multiplo="true"
            :class="{ 'select-erro': enviado && !form.bairrosAtendidos.length }" />
          <p v-if="enviado && !form.bairrosAtendidos.length" class="erro-texto">Selecione ao menos um bairro</p>
        </div>

        <div class="form-grupo">
          <label class="form-rotulo">Descrição profissional</label>
          <textarea v-model="form.descricao" class="form-textarea"
            :class="{ 'input-erro': enviado && !form.descricao.trim() }"
            placeholder="Descreva seus serviços e experiência" rows="4" />
          <p v-if="enviado && !form.descricao.trim()" class="erro-texto">Campo obrigatório</p>
        </div>

        <div class="form-grupo">
          <label class="form-rotulo">
            Telefone profissional
            <span class="rotulo-opcional">(opcional)</span>
          </label>
          <input :value="form.telefoneProfissional" @input="mascaraTelefone" @blur="tocado.telefoneProfissional = true"
            @keypress="(e) => !/\d/.test(e.key) && e.preventDefault()" type="tel" class="form-input"
            :class="{ 'input-erro': tocado.telefoneProfissional && form.telefoneProfissional && !telefoneValido(form.telefoneProfissional) }"
            placeholder="(00) 00000-0000" autocomplete="tel" maxlength="15" />
          <p v-if="tocado.telefoneProfissional && form.telefoneProfissional && !telefoneValido(form.telefoneProfissional)"
            class="erro-texto">
            Telefone inválido
          </p>
        </div>
      </div>
    </Transition>

    <div class="form-acoes">
      <button type="button" class="btn-secundario" @click="$emit('voltar')">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round" />
        </svg>
        Voltar
      </button>
      <button type="submit" class="btn-primario">Cadastrar</button>
    </div>
  </form>
</template>

<style scoped>
.step-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.step-form-entrar {
  animation: form-entrar 0.3s ease;
}

@keyframes form-entrar {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes agitar {

  0%,
  100% {
    transform: translateX(0);
  }

  20% {
    transform: translateX(-6px);
  }

  40% {
    transform: translateX(6px);
  }

  60% {
    transform: translateX(-4px);
  }

  80% {
    transform: translateX(4px);
  }
}

.form-agitando {
  animation: agitar 0.45s cubic-bezier(0.36, 0.07, 0.19, 0.97);
}

.pergunta-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.pergunta-titulo {
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-neutral-darkest);
  line-height: 1.4;
}

.radio-grupo {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.radio-item {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  cursor: pointer;
  padding: 0.2rem 0;
}

.radio-input {
  display: none;
}

.radio-circulo {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid var(--color-neutral-light-medium);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.22s ease, background 0.22s ease;
  position: relative;
}

.radio-circulo::after {
  content: '';
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--color-primary-medium);
  opacity: 0;
  transform: scale(0);
  transition: opacity 0.22s ease, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.radio-input:checked+.radio-circulo {
  border-color: var(--color-primary-medium);
}

.radio-input:checked+.radio-circulo::after {
  opacity: 1;
  transform: scale(1);
}

.radio-item:hover .radio-circulo {
  border-color: var(--color-primary-light);
}

.radio-texto {
  font-size: 0.85rem;
  color: var(--color-neutral-dark);
  font-weight: 500;
  transition: color 0.2s ease;
}

.radio-input:checked~.radio-texto {
  color: var(--color-neutral-darkest);
  font-weight: 600;
}

.servicos-bloco {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.separador {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.separador-linha {
  flex: 1;
  height: 1px;
  background: var(--color-neutral-light-light);
}

.separador-icone {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1.5px solid var(--color-neutral-light-medium);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-neutral-light-dark);
  flex-shrink: 0;
}

.servicos-titulo {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--color-neutral-darkest);
}

.form-grupo {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.form-rotulo {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--color-neutral-dark);
}

.rotulo-opcional {
  font-weight: 400;
  color: var(--color-neutral-light-dark);
}

.form-input {
  width: 100%;
  padding: 0.52rem 0.75rem;
  border: 1.5px solid var(--color-neutral-light-medium);
  border-radius: 10px;
  font-size: 0.82rem;
  font-family: inherit;
  color: var(--color-neutral-dark);
  background: var(--color-neutral-light-white);
  transition: border-color 0.22s ease, box-shadow 0.22s ease, transform 0.22s ease;
  outline: none;
  height: 40px;
}

.form-input::placeholder {
  color: var(--color-neutral-light-dark);
}

.form-input:focus {
  border-color: var(--color-primary-medium);
  box-shadow: 0 0 0 3px rgba(62, 58, 168, 0.13);
  transform: translateY(-1px);
}

.form-textarea {
  width: 100%;
  padding: 0.6rem 0.75rem;
  border: 1.5px solid var(--color-neutral-light-medium);
  border-radius: 10px;
  font-size: 0.82rem;
  font-family: inherit;
  color: var(--color-neutral-dark);
  background: var(--color-neutral-light-white);
  resize: vertical;
  min-height: 90px;
  transition: border-color 0.22s ease, box-shadow 0.22s ease;
  outline: none;
  line-height: 1.55;
}

.form-textarea::placeholder {
  color: var(--color-neutral-light-dark);
}

.form-textarea:focus {
  border-color: var(--color-primary-medium);
  box-shadow: 0 0 0 3px rgba(62, 58, 168, 0.13);
}

.input-erro {
  border-color: var(--color-error-medium) !important;
  box-shadow: 0 0 0 3px rgba(255, 97, 109, 0.12) !important;
}

.select-erro :deep(.select-gatilho) {
  border-color: var(--color-error-medium) !important;
  box-shadow: 0 0 0 3px rgba(255, 97, 109, 0.12) !important;
}

.erro-texto {
  font-size: 0.72rem;
  color: var(--color-error-dark);
  font-weight: 500;
}

.form-acoes {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.25rem;
}

.btn-primario,
.btn-secundario {
  flex: 1;
  height: 44px;
  border-radius: 12px;
  font-size: 0.88rem;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.25s ease;
  position: relative;
  overflow: hidden;
}

.btn-primario {
  background: var(--color-primary-medium);
  color: white;
  border: none;
}

.btn-primario::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, transparent 55%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.btn-primario:hover {
  transform: translateY(-3px) scale(1.01);
  box-shadow: 0 12px 32px rgba(62, 58, 168, 0.42);
}

.btn-primario:hover::after {
  opacity: 1;
}

.btn-primario:active {
  transform: translateY(0) scale(0.98);
  box-shadow: none;
}

.btn-secundario {
  background: transparent;
  color: var(--color-primary-medium);
  border: 1.5px solid var(--color-primary-medium);
}

.btn-secundario:hover {
  background: rgba(62, 58, 168, 0.05);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(62, 58, 168, 0.15);
}

.btn-secundario:active {
  transform: translateY(0) scale(0.98);
}

.servicos-expandir-enter-active {
  transition: opacity 0.3s ease, transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.servicos-expandir-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.servicos-expandir-enter-from {
  opacity: 0;
  transform: translateY(-12px);
}

.servicos-expandir-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

@media (min-width: 768px) {
  .step-form {
    gap: 1.1rem;
  }

  .pergunta-titulo {
    font-size: 1.05rem;
  }

  .servicos-titulo {
    font-size: 1.2rem;
  }
}
</style>