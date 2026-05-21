import api from '@/services/api'

export async function enviarCodigoRecuperacao(email: string) {
    return api.post('api/auth/recuperar-senha/enviar-codigo', { email })
}

export async function validarCodigoRecuperacao(token: string) {
    return api.post('api/auth/recuperar-senha/validar', { token })
}