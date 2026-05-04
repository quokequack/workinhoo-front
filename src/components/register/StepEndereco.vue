<script setup lang="ts">
import { reactive, ref } from 'vue'
import SelectCustom from '@/components/register/SelectCustom.vue'

interface Endereco { rua: string; numero: string; cidade: string; bairro: string; cep: string; complemento: string }

const props = defineProps<{ dados: Endereco }>()
const emit = defineEmits<{ proximo: [dados: Endereco]; voltar: [] }>()

const form = reactive({ ...props.dados })
const enviado = ref(false)
const agitando = ref(false)
const entrou = ref(false)
const buscandoCep = ref(false)
const cepInvalido = ref(false)
const tocado = reactive({ cep: false })

const cidades = [
  { value: 'maceio', label: 'Maceió' },
  { value: 'arapiraca', label: 'Arapiraca' },
  { value: 'marechal-deodoro', label: 'Marechal Deodoro' },
  { value: 'rio-largo', label: 'Rio Largo' },
  { value: 'palmeira-dos-indios', label: 'Palmeira dos Índios' },
  { value: 'uniao-dos-palmares', label: 'União dos Palmares' },
]

const bairros = [
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

function slugify(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, '-')
}

function formatarCep(digits: string): string {
  const d = digits.slice(0, 8)
  if (d.length > 5) return d.replace(/^(\d{5})(\d{1,3})$/, '$1-$2')
  return d
}

function mascaraCep(e: Event) {
  const input = e.target as HTMLInputElement
  const digits = input.value.replace(/\D/g, '').slice(0, 8)
  form.cep = formatarCep(digits)
  cepInvalido.value = false

  if (digits.length === 8) buscarCep(digits)
}

async function buscarCep(digits: string) {
  buscandoCep.value = true
  cepInvalido.value = false
  try {
    const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`)
    const data = await res.json()

    if (data.erro) {
      cepInvalido.value = true
      return
    }

    if (data.logradouro) form.rua = data.logradouro

    if (data.bairro) {
      const slug = slugify(data.bairro)
      const encontrado = bairros.find(b => b.value === slug || slugify(b.label) === slugify(data.bairro))
      if (encontrado) form.bairro = encontrado.value
    }

    if (data.localidade) {
      const slug = slugify(data.localidade)
      const encontrada = cidades.find(c => c.value === slug || slugify(c.label) === slugify(data.localidade))
      if (encontrada) form.cidade = encontrada.value
    }
  } catch {

  } finally {
    buscandoCep.value = false
  }
}

function validar() {
  return form.rua && form.numero && form.cidade && form.bairro && form.cep && form.cep.replace(/\D/g, '').length === 8
}

function onAnimacaoEntrar() {
  entrou.value = true
}

function handleProximo() {
  enviado.value = true
  if (!validar()) {
    agitando.value = true
    setTimeout(() => (agitando.value = false), 500)
    return
  }
  emit('proximo', { ...form })
}
</script>

<template>
  <form @submit.prevent="handleProximo" class="step-form" :class="{
    'step-form-entrar': !entrou,
    'form-agitando': agitando
  }" @animationend="onAnimacaoEntrar" novalidate>

    <div class="form-grupo">
      <label class="form-rotulo">CEP</label>
      <div class="input-wrapper">
        <input :value="form.cep" @input="mascaraCep" @blur="tocado.cep = true"
          @keypress="(e) => !/\d/.test(e.key) && e.preventDefault()" type="text" class="form-input"
          :class="{ 'input-erro': (enviado && !form.cep) || (tocado.cep && cepInvalido) }" placeholder="00000-000"
          inputmode="numeric" autocomplete="postal-code" maxlength="9" />
        <span v-if="buscandoCep" class="input-icone">
          <svg class="spin" width="15" height="15" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2.5" stroke-dasharray="40"
              stroke-dashoffset="15" stroke-linecap="round" />
          </svg>
        </span>
      </div>
      <p v-if="enviado && !form.cep" class="erro-texto">Campo obrigatório</p>
      <p v-else-if="tocado.cep && cepInvalido" class="erro-texto">CEP não encontrado</p>
    </div>

    <div class="form-linha">
      <div class="form-grupo form-grupo-flex">
        <label class="form-rotulo">Rua</label>
        <input v-model="form.rua" type="text" class="form-input" :class="{ 'input-erro': enviado && !form.rua }"
          placeholder="Ex: Rua das Flores" autocomplete="street-address" />
        <p v-if="enviado && !form.rua" class="erro-texto">Obrigatório</p>
      </div>

      <div class="form-grupo form-grupo-numero">
        <label class="form-rotulo">Número</label>
        <input v-model="form.numero" type="text" class="form-input" :class="{ 'input-erro': enviado && !form.numero }"
          placeholder="Ex: 123" inputmode="numeric" />
        <p v-if="enviado && !form.numero" class="erro-texto">Obrigatório</p>
      </div>
    </div>

    <div class="form-grupo">
      <label class="form-rotulo">Cidade</label>
      <SelectCustom v-model="form.cidade" :opcoes="cidades" placeholder="Ex: Maceió"
        :class="{ 'select-erro': enviado && !form.cidade }" />
      <p v-if="enviado && !form.cidade" class="erro-texto">Campo obrigatório</p>
    </div>

    <div class="form-grupo">
      <label class="form-rotulo">Bairro</label>
      <SelectCustom v-model="form.bairro" :opcoes="bairros" placeholder="Ex: Centro"
        :class="{ 'select-erro': enviado && !form.bairro }" />
      <p v-if="enviado && !form.bairro" class="erro-texto">Campo obrigatório</p>
    </div>

    <div class="form-grupo">
      <label class="form-rotulo">Complemento <span class="rotulo-opcional">(opcional)</span></label>
      <input v-model="form.complemento" type="text" class="form-input" placeholder="Bloco, casa, etc."
        autocomplete="address-line2" />
    </div>

    <div class="form-acoes">
      <button type="button" class="btn-secundario" @click="$emit('voltar')">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round" />
        </svg>
        Voltar
      </button>
      <button type="submit" class="btn-primario">Próximo</button>
    </div>
  </form>
</template>

<style scoped>
.step-form {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
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

.form-linha {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
}

.form-grupo {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.form-grupo-flex {
  flex: 1;
}

.form-grupo-numero {
  width: 100px;
  flex-shrink: 0;
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

.input-wrapper {
  position: relative;
}

.input-wrapper .form-input {
  padding-right: 2.2rem;
}

.input-icone {
  position: absolute;
  right: 0.65rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  color: var(--color-primary-medium);
  pointer-events: none;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.spin {
  animation: spin 0.75s linear infinite;
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
  margin-top: 0.5rem;
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

@media (min-width: 768px) {
  .step-form {
    gap: 1rem;
  }

  .form-grupo-numero {
    width: 120px;
  }
}
</style>