<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'

const props = defineProps<{ aberto: boolean; imagemSrc: string | null }>()
const emit = defineEmits<{ fechar: []; confirmar: [file: File] }>()

const canvasRef = ref<HTMLCanvasElement | null>(null)

const zoom = ref(1)
const offsetX = ref(0)
const offsetY = ref(0)

const arrastando = ref(false)
const dragStart = ref({ x: 0, y: 0 })
const offsetStart = ref({ x: 0, y: 0 })

const IMG_SIZE = 280

let imagemObj: HTMLImageElement | null = null

function carregarImagem() {
    if (!props.imagemSrc) return
    imagemObj = new Image()
    imagemObj.onload = () => {
        zoom.value = 1
        offsetX.value = 0
        offsetY.value = 0
        desenhar()
    }
    imagemObj.src = props.imagemSrc
}

function clampOffsets() {
    if (!imagemObj) return

    const ratio = Math.max(IMG_SIZE / imagemObj.width, IMG_SIZE / imagemObj.height)
    const w = imagemObj.width * ratio * zoom.value
    const h = imagemObj.height * ratio * zoom.value

    const maxX = (w - IMG_SIZE) / 2
    const maxY = (h - IMG_SIZE) / 2

    offsetX.value = Math.min(maxX, Math.max(-maxX, offsetX.value))
    offsetY.value = Math.min(maxY, Math.max(-maxY, offsetY.value))
}

function desenhar() {
    const canvas = canvasRef.value
    if (!canvas || !imagemObj) return
    const ctx = canvas.getContext('2d')!
    ctx.clearRect(0, 0, IMG_SIZE, IMG_SIZE)

    ctx.fillStyle = '#f0f0f0'
    ctx.fillRect(0, 0, IMG_SIZE, IMG_SIZE)

    const ratio = Math.max(IMG_SIZE / imagemObj.width, IMG_SIZE / imagemObj.height)
    const w = imagemObj.width * ratio * zoom.value
    const h = imagemObj.height * ratio * zoom.value
    const x = (IMG_SIZE - w) / 2 + offsetX.value
    const y = (IMG_SIZE - h) / 2 + offsetY.value

    ctx.save()
    ctx.beginPath()
    ctx.arc(IMG_SIZE / 2, IMG_SIZE / 2, IMG_SIZE / 2, 0, Math.PI * 2)
    ctx.clip()
    ctx.drawImage(imagemObj, x, y, w, h)
    ctx.restore()

    ctx.beginPath()
    ctx.arc(IMG_SIZE / 2, IMG_SIZE / 2, IMG_SIZE / 2 - 1, 0, Math.PI * 2)
    ctx.strokeStyle = 'rgba(0,0,0,0.08)'
    ctx.lineWidth = 2
    ctx.stroke()
}

watch(zoom, () => {
    clampOffsets()
    desenhar()
})
watch(() => props.imagemSrc, carregarImagem)
watch(() => props.aberto, (v) => { if (v) carregarImagem() })

function onMouseDown(e: MouseEvent) {
    arrastando.value = true
    dragStart.value = { x: e.clientX, y: e.clientY }
    offsetStart.value = { x: offsetX.value, y: offsetY.value }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
}

function onMouseUp() {
    arrastando.value = false
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseup', onMouseUp)
}

function onMouseMove(e: MouseEvent) {
    if (!arrastando.value) return
    offsetX.value = offsetStart.value.x + (e.clientX - dragStart.value.x)
    offsetY.value = offsetStart.value.y + (e.clientY - dragStart.value.y)
    clampOffsets()
    desenhar()
}

function onTouchStart(e: TouchEvent) {
    const t = e.touches[0]
    if (!t) return
    arrastando.value = true
    dragStart.value = { x: t.clientX, y: t.clientY }
    offsetStart.value = { x: offsetX.value, y: offsetY.value }
}

function onTouchMove(e: TouchEvent) {
    if (!arrastando.value) return
    const t = e.touches[0]
    if (!t) return
    offsetX.value = offsetStart.value.x + (t.clientX - dragStart.value.x)
    offsetY.value = offsetStart.value.y + (t.clientY - dragStart.value.y)
    clampOffsets()
    desenhar()
}

function onTouchEnd() { arrastando.value = false }

function confirmar() {
    const canvas = canvasRef.value
    if (!canvas) return
    canvas.toBlob((blob) => {
        if (!blob) return
        const file = new File([blob], 'foto-perfil.png', { type: 'image/png' })
        emit('confirmar', file)
    }, 'image/png')
}

onUnmounted(() => {
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseup', onMouseUp)
})
</script>

<template>
    <Teleport to="body">
        <Transition name="modal">
            <div v-if="aberto" class="modal-overlay">
                <div class="modal-card" role="dialog" aria-modal="true" aria-label="Editar foto de perfil">

                    <button class="btn-fechar" type="button" aria-label="Fechar" @click="emit('fechar')">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2.2"
                                stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </button>

                    <div class="modal-cabecalho">
                        <h2 class="modal-titulo">Editar foto de perfil</h2>
                        <p class="modal-subtitulo">Arraste para reposicionar e use o controle para ajustar o zoom.</p>
                    </div>

                    <div class="crop-wrapper">
                        <canvas ref="canvasRef" :width="280" :height="280" class="crop-canvas"
                            :class="{ 'cursor-grab': !arrastando, 'cursor-grabbing': arrastando }"
                            @mousedown="onMouseDown" @touchstart.prevent="onTouchStart"
                            @touchmove.prevent="onTouchMove" @touchend="onTouchEnd" />
                        <div class="crop-dica">
                            Arraste a imagem
                        </div>
                    </div>

                    <div class="zoom-wrapper">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" class="zoom-icon">
                            <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2" />
                            <path d="M21 21l-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                            <path d="M8 11h6" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                        </svg>

                        <input type="range" min="1" max="3" step="0.01" v-model.number="zoom" class="zoom-slider"
                            aria-label="Zoom da foto" />

                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" class="zoom-icon">
                            <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2" />
                            <path d="M21 21l-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                            <path d="M8 11h6M11 8v6" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                        </svg>
                    </div>

                    <div class="form-acoes modal-acoes">
                        <button class="btn-secundario btn-bloco" type="button" @click="emit('fechar')">
                            Cancelar
                        </button>
                        <button class="btn-primario btn-bloco" type="button" @click="confirmar">
                            Confirmar foto
                        </button>
                    </div>

                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped>
.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(17, 17, 17, 0.45);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.25rem;
    z-index: 50;
}

.modal-card {
    width: 100%;
    max-width: 400px;
    background: var(--color-neutral-light-white);
    border-radius: 18px;
    border: 1px solid var(--color-neutral-light-light);
    box-shadow: 0 24px 80px rgba(0, 0, 0, 0.18);
    padding: 2rem 2rem 1.75rem;
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
}

.btn-fechar {
    position: absolute;
    right: 1rem;
    top: 1rem;
    border: none;
    background: transparent;
    cursor: pointer;
    color: var(--color-neutral-medium);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.3rem;
    border-radius: 6px;
    transition: color 0.2s ease, background 0.2s ease;
}

.btn-fechar:hover {
    color: var(--color-neutral-dark);
    background: var(--color-neutral-light-light);
}

.modal-cabecalho {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    padding-top: 0.25rem;
}

.modal-titulo {
    font-size: 1.15rem;
    font-weight: 700;
    color: var(--color-neutral-dark);
    line-height: 1.2;
}

.modal-subtitulo {
    font-size: 0.8rem;
    color: var(--color-neutral-medium);
    line-height: 1.4;
}

.crop-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
}

.crop-canvas {
    border-radius: 50%;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.22);
    display: block;
    max-width: 100%;
}

.cursor-grab {
    cursor: grab;
}

.cursor-grabbing {
    cursor: grabbing;
}

.crop-dica {
    display: flex;
    align-items: center;
    gap: 0.3rem;
    font-size: 0.7rem;
    color: var(--color-neutral-medium);
    font-weight: 500;
}

.zoom-wrapper {
    display: flex;
    align-items: center;
    gap: 0.65rem;
}

.zoom-icon {
    color: var(--color-neutral-medium);
    flex-shrink: 0;
}

.zoom-slider {
    flex: 1;
    -webkit-appearance: none;
    appearance: none;
    height: 4px;
    border-radius: 4px;
    background: var(--color-neutral-light-medium);
    outline: none;
    cursor: pointer;
    transition: background 0.2s ease;
}

.zoom-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--color-primary-medium);
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(62, 58, 168, 0.35);
    transition: transform 0.15s ease;
}

.zoom-slider::-webkit-slider-thumb:hover {
    transform: scale(1.2);
}

.zoom-slider::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--color-primary-medium);
    cursor: pointer;
    border: none;
    box-shadow: 0 2px 6px rgba(62, 58, 168, 0.35);
}

.modal-acoes {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.65rem;
    margin-top: 0;
}

.btn-primario,
.btn-secundario {
    border-radius: 12px;
    font-size: 0.88rem;
    font-weight: 700;
    font-family: inherit;
    height: 44px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.25s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
}

.btn-primario {
    background: var(--color-primary-medium);
    color: white;
}

.btn-primario::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, transparent 55%);
    opacity: 0;
    transition: opacity 0.3s ease;
    border-radius: inherit;
}

.btn-primario:hover {
    transform: translateY(-3px) scale(1.01);
    box-shadow: 0 12px 32px rgba(62, 58, 168, 0.42);
}

.btn-primario:hover::after {
    opacity: 1;
}

.btn-primario:active,
.btn-secundario:active {
    transform: translateY(0) scale(0.98);
    box-shadow: none;
}

.btn-secundario {
    background: var(--color-neutral-light-lightest);
    color: var(--color-neutral-dark);
    border: 1.5px solid var(--color-neutral-light-medium);
}

.btn-secundario:hover {
    background: var(--color-neutral-light-light);
    transform: translateY(-2px);
}

.btn-bloco {
    width: 100%;
}

.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.16s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

.modal-enter-active .modal-card {
    animation: modal-pop 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes modal-pop {
    from {
        transform: translateY(14px) scale(0.98);
        opacity: 0;
    }

    to {
        transform: translateY(0) scale(1);
        opacity: 1;
    }
}
</style>