<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'

interface Opcao { value: string | number; label: string }

interface Props {
  modelValue: string | number | (string | number)[]
  opcoes: Opcao[]
  placeholder?: string
  multiplo?: boolean
  carregando?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Selecione...',
  multiplo: false,
  carregando: false,
  disabled: false,
})

const emit = defineEmits<{ 'update:modelValue': [value: string | number | (string | number)[]] }>()

const aberto = ref(false)
const containerRef = ref<HTMLElement | null>(null)
const inputPesquisa = ref<HTMLInputElement | null>(null)
const pesquisa = ref('')

const opcoesFiltradas = computed(() =>
  pesquisa.value.trim()
    ? props.opcoes.filter(o =>
      o.label.toLowerCase().includes(pesquisa.value.toLowerCase())
    )
    : props.opcoes
)

const valoresSelecionados = computed<(string | number)[]>(() =>
  props.multiplo
    ? (props.modelValue as (string | number)[])
    : (props.modelValue !== '' && props.modelValue !== null && props.modelValue !== undefined
      ? [props.modelValue as string | number]
      : [])
)

const labelValor = computed(() => {
  if (props.multiplo) return ''
  return props.opcoes.find(o => String(o.value) === String(props.modelValue))?.label ?? ''
})

function isSelecionado(value: string | number) {
  return valoresSelecionados.value.map(String).includes(String(value))
}

async function abrirDropdown() {
  if (props.disabled || props.carregando) return
  aberto.value = !aberto.value
  if (aberto.value) {
    pesquisa.value = ''
    await nextTick()
    inputPesquisa.value?.focus()
  }
}

function selecionar(opcao: Opcao) {
  if (props.multiplo) {
    const atual = [...(props.modelValue as (string | number)[])]
    const idx = atual.map(String).indexOf(String(opcao.value))
    if (idx === -1) atual.push(opcao.value)
    else atual.splice(idx, 1)
    emit('update:modelValue', atual)
  } else {
    emit('update:modelValue', opcao.value)
    aberto.value = false
    pesquisa.value = ''
  }
}

function removerTag(value: string | number, e: MouseEvent) {
  e.stopPropagation()
  emit(
    'update:modelValue',
    (props.modelValue as (string | number)[]).filter(v => String(v) !== String(value))
  )
}

function clickFora(e: MouseEvent) {
  if (containerRef.value && !containerRef.value.contains(e.target as Node)) {
    aberto.value = false
    pesquisa.value = ''
  }
}

onMounted(() => document.addEventListener('mousedown', clickFora))
onUnmounted(() => document.removeEventListener('mousedown', clickFora))
</script>

<template>
  <div class="select" :class="{ 'select-aberto': aberto, 'select-disabled': disabled }" ref="containerRef">
    <button type="button" class="select-gatilho" @click="abrirDropdown" :disabled="disabled">
      <div class="select-valor">
        <template v-if="carregando">
          <span class="select-placeholder">Carregando...</span>
        </template>
        <template v-else-if="multiplo && (modelValue as (string | number)[]).length">
          <div class="select-tags">
            <span v-for="val in (modelValue as (string | number)[])" :key="val" class="select-tag">
              {{opcoes.find(o => String(o.value) === String(val))?.label}}
              <button type="button" class="tag-remover" @click="removerTag(val, $event)">
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
                </svg>
              </button>
            </span>
          </div>
        </template>
        <span v-else-if="!multiplo && labelValor" class="select-texto-valor">{{ labelValor }}</span>
        <span v-else class="select-placeholder">{{ placeholder }}</span>
      </div>
      <svg class="select-chevron" :class="{ 'chevron-cima': aberto }" width="15" height="15" viewBox="0 0 24 24"
        fill="none">
        <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"
          stroke-linejoin="round" />
      </svg>
    </button>

    <Transition name="dropdown">
      <div v-if="aberto" class="select-dropdown">
        <div class="pesquisa-wrapper">
          <svg class="pesquisa-icone" width="13" height="13" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2.2" />
            <path d="M21 21l-4.35-4.35" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" />
          </svg>
          <input ref="inputPesquisa" v-model="pesquisa" type="text" class="pesquisa-input" placeholder="Pesquisar..."
            @keydown.escape="aberto = false" />
          <button v-if="pesquisa" type="button" class="pesquisa-limpar" @click="pesquisa = ''">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
            </svg>
          </button>
        </div>

        <div class="dropdown-lista">
          <button v-for="opcao in opcoesFiltradas" :key="opcao.value" type="button" class="select-opcao"
            :class="{ 'opcao-marcada': isSelecionado(opcao.value) }" @click="selecionar(opcao)">
            <span>{{ opcao.label }}</span>
            <svg v-if="isSelecionado(opcao.value)" width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
          </button>

          <div v-if="!opcoesFiltradas.length" class="sem-resultados">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2" />
              <path d="M21 21l-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            </svg>
            <span>Nenhum resultado</span>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.select {
  position: relative;
  width: 100%;
}

.select-disabled {
  opacity: 0.5;
  pointer-events: none;
}

.select-gatilho {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.52rem 0.75rem;
  background: var(--color-neutral-light-white);
  border: 1.5px solid var(--color-neutral-light-medium);
  border-radius: 10px;
  cursor: pointer;
  min-height: 40px;
  text-align: left;
  transition: border-color 0.22s ease, box-shadow 0.22s ease;
  font-family: 'Poppins';
}

.select-aberto .select-gatilho {
  border-color: var(--color-primary-medium);
  box-shadow: 0 0 0 3px rgba(62, 58, 168, 0.13);
}

.select-valor {
  flex: 1;
  min-width: 0;
}

.select-placeholder {
  color: var(--color-neutral-light-dark);
  font-size: 0.82rem;
  font-family: inherit;
}

.select-texto-valor {
  color: var(--color-neutral-dark);
  font-size: 0.82rem;
}

.select-chevron {
  flex-shrink: 0;
  color: var(--color-neutral-light-dark);
  transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);
}

.chevron-cima {
  transform: rotate(180deg);
}

.select-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.select-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  background: rgba(62, 58, 168, 0.1);
  color: var(--color-primary-dark);
  padding: 0.12rem 0.45rem 0.12rem 0.55rem;
  border-radius: 6px;
  font-size: 0.72rem;
  font-weight: 600;
  animation: tag-entrar 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes tag-entrar {
  from {
    opacity: 0;
    transform: scale(0.65);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

.tag-remover {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-primary-medium);
  transition: color 0.15s ease, transform 0.15s ease;
}

.tag-remover:hover {
  color: var(--color-primary-darkest);
  transform: scale(1.25);
}

.select-dropdown {
  position: absolute;
  top: calc(100% + 5px);
  left: 0;
  right: 0;
  background: var(--color-neutral-light-white);
  border: 1.5px solid var(--color-neutral-light-light);
  border-radius: 10px;
  box-shadow: 0 10px 28px rgba(31, 41, 55, 0.13);
  z-index: 50;
  overflow: hidden;
}

.pesquisa-wrapper {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 0.6rem;
  border-bottom: 1px solid var(--color-neutral-light-light);
  background: var(--color-neutral-light-lightest);
}

.pesquisa-icone {
  flex-shrink: 0;
  color: var(--color-neutral-light-dark);
}

.pesquisa-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 0.8rem;
  font-family: inherit;
  color: var(--color-neutral-dark);
  min-width: 0;
}

.pesquisa-input::placeholder {
  color: var(--color-neutral-light-dark);
}

.pesquisa-limpar {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-neutral-light-dark);
  flex-shrink: 0;
  transition: color 0.15s ease, transform 0.15s ease;
}

.pesquisa-limpar:hover {
  color: var(--color-neutral-dark);
  transform: scale(1.2);
}

.dropdown-lista {
  max-height: 180px;
  overflow-y: auto;
  padding: 0.3rem;
}

.dropdown-lista::-webkit-scrollbar {
  width: 4px;
}

.dropdown-lista::-webkit-scrollbar-track {
  background: transparent;
}

.dropdown-lista::-webkit-scrollbar-thumb {
  background: var(--color-neutral-light-medium);
  border-radius: 4px;
}

.select-opcao {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.48rem 0.7rem;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 0.82rem;
  color: var(--color-neutral-dark);
  border-radius: 7px;
  font-family: inherit;
  transition: background 0.15s ease, transform 0.15s ease;
  text-align: left;
}

.select-opcao:hover {
  background: var(--color-neutral-light-lightest);
  transform: translateX(2px);
}

.opcao-marcada {
  color: var(--color-primary-medium);
  font-weight: 600;
  background: rgba(62, 58, 168, 0.05);
}

.opcao-marcada:hover {
  background: rgba(62, 58, 168, 0.09);
}

.opcao-marcada svg {
  color: var(--color-primary-medium);
}

.sem-resultados {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.85rem 0.7rem;
  font-size: 0.8rem;
  color: var(--color-neutral-light-dark);
  font-style: italic;
}

.dropdown-enter-active {
  transition: opacity 0.18s ease, transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.dropdown-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-8px) scale(0.97);
}

.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.98);
}
</style>
