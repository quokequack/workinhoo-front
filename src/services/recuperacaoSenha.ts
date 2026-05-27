import api from '@/services/api'

export async function enviarCodigoRecuperacao(email: string) {
    await api.get('/sanctum/csrf-cookie')
    return api.post('/recuperar-senha/enviar-codigo', { email })
}

export async function validarCodigoRecuperacao(codigo: string) {
    await api.get('/sanctum/csrf-cookie')
    return api.post('/recuperar-senha/validar', { codigo })
}

export async function alterarSenha(senha: string) {
    await api.get('/sanctum/csrf-cookie')
    return api.post('recuperar-senha/alterar', { senha })
}