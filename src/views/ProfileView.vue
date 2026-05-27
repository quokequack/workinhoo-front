<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import ProviderProfile from '@/views/profile/ProviderProfileView.vue'
import UsuarioProfile from '@/views/profile/UsuarioProfileView.vue'

const authStore = useAuthStore()

const perfilComponent = computed(() =>
    authStore.isPrestador
        ? ProviderProfile
        : UsuarioProfile
)
</script>

<template>
    <div class="perfil-page">
        <component :is="perfilComponent" />
    </div>
</template>

<style scoped>
.perfil-page {
    background-color: var(--color-neutral-light-white);
    min-height: 100vh;
    min-width: 100vw;
}
</style>