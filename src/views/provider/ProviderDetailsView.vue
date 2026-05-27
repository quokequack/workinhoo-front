<script setup lang="ts">
import { ref, computed } from 'vue'
import ProfileHero from '@/components/provider/ProfileHero.vue'
import ProfileTabs from '@/components/provider/ProfileTabs.vue'
import TabSobre from '@/components/provider/TabSobre.vue'
import TabPortfolio from '@/components/provider/TabPortfolio.vue'
import TabAvaliacoes from '@/components/provider/TabAvaliacoes.vue'
import type { TabId } from '@/components/provider/ProfileTabs.vue'
import type { Prestador } from '@/types/prestador'

const prestador = ref<Prestador>({
    id: 1,
    nome: 'Rafaela Pereira',
    roles: ['Nutricionista', 'Personal Trainer'],
    nota: 4.0,
    totalAvaliacoes: 6,
    instagram: '@rafaela_nutri',
    fotoPerfil: 'https://marketplace.canva.com/4WvRU/MAEFIV4WvRU/1/tl/canva-profile-picture-of-smiling-attractive-mixed-race-woman.-MAEFIV4WvRU.jpg',
    bio: 'Nutricionista e personal trainer apaixonada por transformar vidas através da saúde, do movimento e da alimentação equilibrada. Atuo com acompanhamento personalizado, unindo planejamento nutricional e treinamento físico para ajudar cada aluno a alcançar seus objetivos de forma saudável, sustentável e eficiente. Trabalho com metodologias baseadas em evidências científicas, sempre com uma abordagem humanizada e adaptada à rotina de cada pessoa. Acredito que mudanças duradouras começam com pequenos passos conscientes. Minha missão é guiar você com segurança e motivação em cada etapa da sua jornada de saúde.',
    area: {
        cidade: 'Maceió',
        estado: 'AL',
        bairros: ['Jaraguá', 'Ponta Verde', 'Pajuçara', 'Jatiúca'],
    },
    especialidades: [
        {
            id: 1,
            nome: 'Nutricionista',
            servicos: ['Avaliação nutricional', 'Plano alimentar personalizado', 'Acompanhamento mensal'],
            precoBase: 80,
        },
        {
            id: 2,
            nome: 'Personal Trainer',
            servicos: ['Avaliação física', 'Treino personalizado', 'Personal presencial', 'Personal online', 'Consultoria fitness'],
            precoBase: 70,
        },
    ],
    portfolio: [
        {
            id: 1,
            imagemUrl: 'https://picsum.photos/seed/food1/400/400',
            alt: 'Marmitas e plano alimentar',
            titulo: 'Marmitas Fitness',
            descricao: 'Marmitas preparadas com alimentos balanceados, incluindo legumes, proteínas e salada colorida.',
            data: 'Abril de 2026',
            categorias: ['Avaliação nutricional', 'Plano alimentar personalizado']
        },
        {
            id: 2,
            imagemUrl: 'https://picsum.photos/seed/food2/400/400',
            alt: 'Preparação de refeições balanceadas',
            titulo: 'Refeições Balanceadas',
            descricao: 'Organização de refeições práticas para rotina alimentar com foco em equilíbrio, saciedade e constância.',
            data: 'Abril de 2026',
            categorias: ['Avaliação nutricional', 'Plano alimentar personalizado']
        },
        {
            id: 3,
            imagemUrl: 'https://picsum.photos/seed/fitness3/400/400',
            alt: 'Resultado de transformação corporal',
            titulo: 'Transformação Corporal',
            descricao: 'Evolução física acompanhada com ajustes alimentares e acompanhamento mensal orientado por objetivos.',
            data: 'Março de 2026',
            categorias: ['Plano alimentar personalizado', 'Acompanhamento mensal']
        },
        {
            id: 4,
            imagemUrl: 'https://picsum.photos/seed/gym1/400/400',
            alt: 'Treinamento personalizado',
            titulo: 'Treino Personalizado',
            descricao: 'Sessão com foco em execução correta, progressão de carga e adaptação ao perfil do aluno.',
            data: 'Maio de 2026',
            categorias: ['Treino personalizado', 'Personal presencial']
        },
        {
            id: 5,
            imagemUrl: 'https://picsum.photos/seed/gym2/400/400',
            alt: 'Treino de musculação',
            titulo: 'Musculação Orientada',
            descricao: 'Planejamento e acompanhamento de treino voltado para ganho de força, hipertrofia e consistência.',
            data: 'Maio de 2026',
            categorias: ['Treino personalizado', 'Personal presencial']
        },
        {
            id: 6,
            imagemUrl: 'https://picsum.photos/seed/gym3/400/400',
            alt: 'Consultoria fitness online',
            titulo: 'Consultoria Fitness Online',
            descricao: 'Atendimento remoto com direcionamento estratégico para treinos, rotina e evolução física.',
            data: 'Fevereiro de 2026',
            categorias: ['Consultoria fitness', 'Personal online']
        },
        {
            id: 7,
            imagemUrl: 'https://picsum.photos/seed/gym4/400/400',
            alt: 'Aluna em treino de força',
            titulo: 'Treino de Força',
            descricao: 'Treino voltado para fortalecimento, técnica e melhora do desempenho com supervisão presencial.',
            data: 'Janeiro de 2026',
            categorias: ['Treino personalizado', 'Personal presencial']
        },
        {
            id: 8,
            imagemUrl: 'https://picsum.photos/seed/gym5/400/400',
            alt: 'Exercício funcional',
            titulo: 'Exercício Funcional',
            descricao: 'Treinamento funcional com foco em mobilidade, resistência e condicionamento para diferentes objetivos.',
            data: 'Abril de 2026',
            categorias: ['Treino personalizado', 'Personal presencial', 'Consultoria fitness']
        },
        {
            id: 9,
            imagemUrl: 'https://picsum.photos/seed/gym6/400/400',
            alt: 'Treino cardio na esteira',
            titulo: 'Cardio Orientado',
            descricao: 'Estratégia de treino cardiovascular integrada ao planejamento físico para melhora de condicionamento.',
            data: 'Março de 2026',
            categorias: ['Treino personalizado', 'Personal online']
        }
    ],
    avaliacoes: [
        {
            id: 1,
            nota: 5,
            texto: 'A melhor nutricionista que já passei! O plano alimentar foi super fácil de seguir e consegui perder 8kg sem passar fome.',
            autor: 'Igor Rocha',
            avatarUrl: 'https://picsum.photos/seed/igor-avatar/80/80',
            data: 'Maio de 2026',
        },
        {
            id: 2,
            nota: 4,
            texto: 'Treinos dinâmicos e motivadores. Em poucos meses consegui melhorar muito meu condicionamento físico.',
            autor: 'Eduardo Carado',
            avatarUrl: 'https://picsum.photos/seed/eduardo-avatar/80/80',
            data: 'Maio de 2026',
        },
        {
            id: 3,
            nota: 3,
            texto: 'Excelente profissional! As marmitas e orientações nutricionais me ajudaram bastante na minha rotina corrida.',
            autor: 'Maria Luísa',
            avatarUrl: 'https://picsum.photos/seed/maria-avatar/80/80',
            data: 'Abril de 2026',
        },
        {
            id: 4,
            nota: 2,
            texto: 'Atendimento ok, mas achei que o retorno poderia ser mais rápido.',
            autor: 'Igor Rocha',
            avatarUrl: 'https://picsum.photos/seed/igor-avatar/80/80',
            data: 'Maio de 2026',
        },
        {
            id: 5,
            nota: 1,
            texto: 'Treinos bons, mas senti falta de mais acompanhamento.',
            autor: 'Eduardo Carado',
            avatarUrl: 'https://picsum.photos/seed/eduardo-avatar/80/80',
            data: 'Maio de 2026',
        },
        {
            id: 6,
            nota: 1,
            texto: 'Não gostei da experiência.',
            autor: 'Maria Luísa',
            avatarUrl: 'https://picsum.photos/seed/maria-avatar/80/80',
            data: 'Abril de 2026',
        },
    ],
})

const totalAvaliacoes = computed(() => prestador.value.avaliacoes.length)

const notaMedia = computed(() => {
    if (prestador.value.avaliacoes.length === 0) return 0

    const soma = prestador.value.avaliacoes.reduce((acc, avaliacao) => {
        return acc + avaliacao.nota
    }, 0)

    return soma / prestador.value.avaliacoes.length
})

const prestadorComResumo = computed(() => ({
    ...prestador.value,
    nota: Number(notaMedia.value.toFixed(1)),
    totalAvaliacoes: totalAvaliacoes.value,
}))

const activeTab = ref<TabId>('sobre')
</script>

<template>
    <main class="page-main" id="main-content">
        <ProfileHero :prestador="prestadorComResumo" @solicitar-orcamento="() => { }"
            @avaliar="() => activeTab = 'avaliacoes'" />

        <ProfileTabs :active-tab="activeTab" @change="(tab) => activeTab = tab" />

        <Transition name="tab-fade" mode="out-in">
            <TabSobre v-if="activeTab === 'sobre'" :prestador="prestador" :key="'sobre'" />
            <TabPortfolio v-else-if="activeTab === 'portfolio'" :prestador="prestador" :key="'portfolio'" />
            <TabAvaliacoes v-else-if="activeTab === 'avaliacoes'" :prestador="prestadorComResumo" :key="'avaliacoes'" />
        </Transition>
    </main>
</template>

<style scoped>
.page-main {
    position: relative;
    width: min(100%, 90rem);
    max-width: 90%;
    margin-inline: auto;
    padding: 2rem 1rem 4rem;
    background-color: var(--color-neutral-light-white);
    animation: page-fade-up 0.75s cubic-bezier(0.22, 1, 0.36, 1);
    z-index: 0;
    overflow: visible;
}

.page-main::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 50%;
    width: 100dvw;
    transform: translateX(-50%);
    background: var(--color-neutral-light-white);
    z-index: -2;
    pointer-events: none;
}

.page-main::after {
    content: '';
    position: absolute;
    inset: 0 auto auto 50%;
    width: min(80vw, 42rem);
    height: 14rem;
    transform: translateX(-50%);
    background: radial-gradient(circle,
            color-mix(in srgb, var(--color-primary-lightest) 24%, transparent) 0%,
            transparent 72%);
    filter: blur(2.25rem);
    opacity: 0.7;
    pointer-events: none;
    z-index: -1;
}

.page-main>* {
    position: relative;
    z-index: 1;
}

.tab-fade-enter-active,
.tab-fade-leave-active {
    transition:
        opacity 220ms ease,
        transform 220ms cubic-bezier(0.22, 1, 0.36, 1),
        filter 220ms ease;
    will-change: opacity, transform, filter;
}

.tab-fade-enter-from {
    opacity: 0;
    transform: translateY(0.5rem) scale(0.992);
    filter: blur(0.25rem);
}

.tab-fade-leave-to {
    opacity: 0;
    transform: translateY(-0.375rem) scale(0.996);
    filter: blur(0.125rem);
}

@keyframes page-fade-up {
    from {
        opacity: 0;
        transform: translateY(0.875rem);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@media (max-width: 90rem) {
    .page-main {
        max-width: 92%;
    }
}

@media (max-width: 64rem) {
    .page-main {
        max-width: 94%;
        padding: 1.5rem 1rem 3.5rem;
    }

    .page-main::after {
        width: min(90vw, 34rem);
        height: 12rem;
        filter: blur(2rem);
    }
}

@media (max-width: 48rem) {
    .page-main {
        max-width: 96%;
        padding: 1rem 0.75rem 3rem;
    }

    .page-main::after {
        width: min(96vw, 28rem);
        height: 10rem;
        opacity: 0.6;
        filter: blur(1.75rem);
    }
}

@media (max-width: 30rem) {
    .page-main {
        max-width: 100%;
        padding: 0.875rem 0.75rem 2.5rem;
    }

    .page-main::after {
        width: 100%;
        height: 8rem;
        opacity: 0.5;
        filter: blur(1.5rem);
    }
}

@media (prefers-reduced-motion: reduce) {

    .page-main,
    .page-main::before,
    .page-main::after,
    .tab-fade-enter-active,
    .tab-fade-leave-active {
        animation: none !important;
        transition: none !important;
    }
}
</style>