import { defineStore } from 'pinia'
import api from '@/services/api'

export interface AuthUser {
    uuid: string
    nome: string
    email: string
    is_prestador: boolean
}

interface AuthState {
    user: AuthUser | null
    initialized: boolean
    loading: boolean
}

export const useAuthStore = defineStore('auth', {
    state: (): AuthState => ({
        user: null,
        initialized: false,
        loading: false,
    }),

    getters: {
        isAuthenticated: (state) => !!state.user,
        isPrestador: (state) => !!state.user?.is_prestador,
    },

    actions: {
        async fetchMe() {
            this.loading = true

            try {
                const { data } = await api.get<AuthUser>('/auth/me')
                this.user = data
            } catch (error) {
                this.user = null
            } finally {
                this.loading = false
                this.initialized = true
            }
        },

        async ensureUserLoaded() {
            if (!this.initialized) {
                await this.fetchMe()
            }
        },

        clearAuth() {
            this.user = null
            this.initialized = true
        },
    },
})