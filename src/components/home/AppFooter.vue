<template>
    <footer>
        <div class="footer-content">
            <div class="logo section reveal">
                <h1>Workinhoo</h1>
                <div>
                    <img src="@/assets/icons/toolbox.svg" alt="ícone de caixa de ferramentas" />
                    <p>Conectando você a profissionais locais</p>
                </div>
            </div>

            <div class="menu-nav section reveal reveal--delay-1">
                <h1>Links rápidos</h1>
                <ul>
                    <li><a href="#sobre">Sobre</a></li>
                    <li><a href="#como-funciona">Como funciona</a></li>
                    <li><a href="#servicos">Serviços</a></li>
                    <li><router-link to="/entrar">Entrar</router-link></li>
                    <li><router-link to="/cadastrar">Cadastrar</router-link></li>
                </ul>
            </div>

            <div class="contato section reveal reveal--delay-2">
                <h1>Contato</h1>
                <div>
                    <img src="@/assets/icons/mail.svg" alt="ícone de e-mail" />
                    <p>workinhoo@gmail.com</p>
                </div>
            </div>
        </div>
        <div class="footer-copyright">
            <p>© 2026 Workinhoo. Todos os direitos reservados.</p>
        </div>
    </footer>
</template>

<style scoped>
footer {
    background-color: var(--color-neutral-darkest);
    color: var(--color-neutral-light-white);
    margin-top: 2rem;
}

.footer-content {
    display: flex;
    flex-direction: column;
    gap: 2.5rem;
    width: 90%;
    padding: 3rem 0;
    margin: 0 auto;
}

.footer-content .section {
    display: flex;
    flex-direction: column;
    width: 100%;
}

footer .logo div {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1rem;
    margin-top: 0.75rem;
}

footer .logo div img {
    width: 26px;
    height: 26px;
}

footer .logo div p {
    font-size: 0.9rem;
    width: 70%;
}

footer .menu-nav ul {
    list-style-position: inside;
    padding: 0;
    margin-top: 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

footer .menu-nav ul a {
    color: var(--color-neutral-light-white);
    font-size: 0.9rem;
    transition: color 0.2s ease, transform 0.2s ease;
    display: inline-block;
}

footer .menu-nav ul a:hover {
    color: var(--color-secondary-medium);
    transform: translateX(4px);
}

footer .contato div img {
    width: 26px;
    height: 26px;
}

footer .contato div {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1rem;
    margin-top: 0.75rem;
}

.footer-copyright {
    border-top: 1px solid var(--color-neutral-light-white);
    padding: 1.5rem 0;
}

.footer-copyright p {
    font-size: 0.85rem;
    width: 90%;
    margin: 0 auto;
    text-align: center;
}

.reveal {
    opacity: 0;
    transform: translateY(32px);
    transition: opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1),
        transform 0.65s cubic-bezier(0.16, 1, 0.3, 1);
}

.reveal.reveal--visivel {
    opacity: 1;
    transform: translateY(0);
}

.reveal--delay-1 {
    transition-delay: 0.1s;
}

.reveal--delay-2 {
    transition-delay: 0.2s;
}

.reveal--delay-3 {
    transition-delay: 0.3s;
}

.reveal--delay-4 {
    transition-delay: 0.4s;
}

@media (prefers-reduced-motion: reduce) {
    .reveal {
        opacity: 1;
        transform: none;
        transition: none;
    }
}

@media (min-width: 768px) {
    footer {
        margin-top: 0;
    }

    .footer-content {
        flex-direction: row;
        justify-content: space-between;
        gap: 3rem;
        width: 90%;
        padding: 3rem 0;
        margin-bottom: 2rem;
    }

    .footer-content .section {
        width: 33%;
    }

    .footer-copyright p {
        text-align: left;
    }
}

@media (min-width: 1280px) {
    .footer-content {
        gap: 3rem;
        width: 85%;
        padding: 3rem 0;
        margin-bottom: 3rem;
    }

    footer .logo div img {
        width: 28px;
        height: 28px;
    }

    footer .logo div p {
        font-size: 1rem;
        width: 50%;
    }

    footer .menu-nav ul a {
        font-size: 1rem;
    }

    footer .contato div img {
        width: 28px;
        height: 28px;
    }

    .footer-copyright p {
        font-size: 1rem;
        width: 85%;
    }
}
</style>