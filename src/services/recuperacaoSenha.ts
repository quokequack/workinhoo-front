import api from '@/services/api'

export async function enviarCodigoRecuperacao(email: string) {
    return api.post('/recuperar-senha/enviar-codigo', { email })
}

export async function validarCodigoRecuperacao(token: string) {
    return api.post('/recuperar-senha/validar', { token })
}

export async function alterarSenha(senha: string) {
    return api.post('/alterar', { senha })
}