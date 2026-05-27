import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
    enviarCodigoRecuperacao,
    validarCodigoRecuperacao,
    alterarSenha
} from '@/services/recuperacaoSenha'
import type VerifyCodeModal from '@/components/recover/VerifyCodeModal.vue'

export function useRecuperacaoSenha() {
    const router = useRouter()

    const stepAtual = ref(1)
    const form = reactive({ email: '', senha: '', confirmarSenha: '' })
    const enviado = ref(false)
    const tocado = reactive({ email: false, senha: false, confirmarSenha: false })
    const agitando = ref(false)
    const senhaVisivel = ref(false)
    const confirmarVisivel = ref(false)
    const modalCodigoAberto = ref(false)
    const modalSucessoAberto = ref(false)
    const carregando = ref(false)
    const modalRef = ref<InstanceType<typeof VerifyCodeModal> | null>(null)
    const erroEmailServidor = ref('')
    const erroSenhaServidor = ref('')

    const requisitos = computed(() => ({
        maiuscula: /[A-Z]/.test(form.senha),
        minuscula: /[a-z]/.test(form.senha),
        numero: /[0-9]/.test(form.senha),
        especial: /[^A-Za-z0-9]/.test(form.senha),
        tamanho: form.senha.length >= 8
    }))

    const senhaForte = computed(() => Object.values(requisitos.value).every(Boolean))

    const mostrarRequisitos = computed(() =>
        (tocado.senha || enviado.value) && !!form.senha && !senhaForte.value
    )

    const senhasErro = computed(() =>
        (enviado.value || tocado.confirmarSenha) &&
        !!form.confirmarSenha &&
        form.senha !== form.confirmarSenha
    )

    function emailValido(email: string) {
        return email.includes('@') && email.includes('.')
    }

    function validarEmail() {
        return !!form.email && emailValido(form.email)
    }

    function validarSenha() {
        return !!form.senha && senhaForte.value && !!form.confirmarSenha && !senhasErro.value
    }

    function agitar() {
        agitando.value = true
        setTimeout(() => (agitando.value = false), 500)
    }

    function resetarEstado() {
        enviado.value = false
        tocado.email = false
        tocado.senha = false
        tocado.confirmarSenha = false
        erroEmailServidor.value = ''
        erroSenhaServidor.value = ''
    }

    function extrairMensagemErro(err: any, fallback: string) {
        const data = err?.response?.data
        const status = err?.response?.status
        if (typeof data === 'string' && data.trim()) return data.trim()
        const msg = data?.message
        if (typeof msg === 'string' && msg.trim()) return msg.trim()
        const errors = data?.errors
        if (status === 422 && errors && typeof errors === 'object') {
            for (const key of Object.keys(errors)) {
                const arr = errors[key]
                if (Array.isArray(arr) && typeof arr[0] === 'string' && arr[0].trim()) return arr[0].trim()
            }
            return fallback
        }
        if (typeof err?.message === 'string' && err.message.trim()) return err.message.trim()
        return fallback
    }

    async function enviarCodigo() {
        enviado.value = true
        erroEmailServidor.value = ''
        if (!validarEmail()) { agitar(); return }
        try {
            carregando.value = true
            await enviarCodigoRecuperacao(form.email)
            modalCodigoAberto.value = true
            setTimeout(() => {
                modalRef.value?.limparEstado()
                modalRef.value?.toastReenviado('Código enviado para e-mail cadastrado.')
            }, 0)
        } catch (err: any) {
            agitar()
            modalCodigoAberto.value = false
            erroEmailServidor.value = extrairMensagemErro(err, 'Não foi possível enviar o código.')
        } finally {
            carregando.value = false
        }
    }

    async function confirmarCodigo(token: string) {
        try {
            carregando.value = true
            const resp = await validarCodigoRecuperacao(token)
            const sucessoMsg =
                typeof resp?.data?.message === 'string' && resp.data.message.trim()
                    ? resp.data.message.trim()
                    : 'Código validado com sucesso.'
            modalRef.value?.toastSucesso(sucessoMsg)
            setTimeout(() => {
                modalCodigoAberto.value = false
                resetarEstado()
                stepAtual.value = 2
            }, 450)
        } catch (err: any) {
            const msg = extrairMensagemErro(err, 'O código informado é inválido ou expirou.')
            setTimeout(() => { modalRef.value?.toastErro(msg) }, 0)
        } finally {
            carregando.value = false
        }
    }

    async function reenviarCodigo() {
        if (!validarEmail()) { agitar(); return }
        try {
            carregando.value = true
            await enviarCodigoRecuperacao(form.email)
            modalRef.value?.toastReenviado('Código reenviado para seu email.')
        } catch (err: any) {
            modalRef.value?.toastErro(extrairMensagemErro(err, 'Não foi possível reenviar o código. Tente novamente.'))
        } finally {
            carregando.value = false
        }
    }

    async function redefinirSenha() {
        enviado.value = true
        erroSenhaServidor.value = ''
        if (!validarSenha()) { agitar(); return }
        try {
            carregando.value = true
            await alterarSenha(form.senha)
            modalSucessoAberto.value = true
        } catch (err: any) {
            agitar()
            erroSenhaServidor.value = extrairMensagemErro(err, 'Não foi possível redefinir a senha. Tente novamente.')
        } finally {
            carregando.value = false
        }
    }

    function voltarStep1() {
        resetarEstado()
        stepAtual.value = 1
    }

    function irParaLogin() {
        router.push('/entrar')
    }

    return {
        stepAtual, form, enviado, tocado, agitando,
        senhaVisivel, confirmarVisivel,
        modalCodigoAberto, modalSucessoAberto,
        carregando, modalRef,
        erroEmailServidor, erroSenhaServidor,
        requisitos, senhaForte, mostrarRequisitos, senhasErro,
        emailValido,
        enviarCodigo, confirmarCodigo, reenviarCodigo, redefinirSenha,
        voltarStep1, irParaLogin
    }
}