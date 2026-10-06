/* =======================================================================
 * CARROSSEL DO HERO (DESTAQUES)
 * ======================================================================= */
// Alterna os slides automaticamente, expõe controle de pausa/retomada ao usuário,
// respeita a preferência do sistema por movimento reduzido (prefers-reduced-motion), 
// e suspende a troca automática quando a aba do navegador está em segundo plano.
(function () {
    const INTERVALO_SLIDE_MS = 10000;

    const container = document.querySelector('.carrossel-slides');
    const slides = document.querySelectorAll('.carrossel-slides .slide');

    if (!container || slides.length === 0) return;

    const preferenciaMovimentoReduzido = window.matchMedia('(prefers-reduced-motion: reduce)');

    let indiceAtual = 0;
    let intervaloId = null;
    let emReproducao = false;

    // Identifica o carrossel como uma região de conteúdo rotativo para
    // tecnologias assistivas, e cada slide como um item dentro dela.
    container.setAttribute('role', 'region');
    container.setAttribute('aria-roledescription', 'carrossel');
    container.setAttribute('aria-label', 'Destaques da Feira de Quebrada');

    slides.forEach((slide, indice) => {
        slide.setAttribute('role', 'group');
        slide.setAttribute('aria-roledescription', 'slide');
        slide.setAttribute('aria-label', `${indice + 1} de ${slides.length}`);
        slide.setAttribute('aria-hidden', indice === 0 ? 'false' : 'true');
    });

    slides[0].classList.add('ativo');

    // Botão de pausa/retomada, inserido antes das mídias. O rótulo e o
    // estado "aria-pressed" são mantidos em sincronia com a reprodução.
    const botaoPausa = document.createElement('button');
    botaoPausa.type = 'button';
    botaoPausa.className = 'carrossel-botao-pausa';
    container.insertAdjacentElement('beforebegin', botaoPausa);

    function atualizarBotaoPausa() {
        botaoPausa.textContent = emReproducao ? 'Pausar apresentação' : 'Retomar apresentação';
        botaoPausa.setAttribute('aria-pressed', String(!emReproducao));
    }

    function irParaSlide(novoIndice) {
        slides[indiceAtual].classList.remove('ativo');
        slides[indiceAtual].setAttribute('aria-hidden', 'true');

        indiceAtual = novoIndice;

        slides[indiceAtual].classList.add('ativo');
        slides[indiceAtual].setAttribute('aria-hidden', 'false');
    }

    function avancarSlide() {
        irParaSlide((indiceAtual + 1) % slides.length);
    }

    function iniciarReproducao() {
        if (intervaloId !== null) return;
        intervaloId = setInterval(avancarSlide, INTERVALO_SLIDE_MS);
        emReproducao = true;
        atualizarBotaoPausa();
    }

    function pausarReproducao() {
        clearInterval(intervaloId);
        intervaloId = null;
        emReproducao = false;
        atualizarBotaoPausa();
    }

    // O botão é a única forma de pausar: o carrossel não para ao passar o
    // mouse sobre ele, por decisão de usabilidade do projeto.
    botaoPausa.addEventListener('click', () => {
        emReproducao ? pausarReproducao() : iniciarReproducao();
    });

    // Em segundo plano a troca automática é suspensa para economizar
    // processamento; ao voltar, só é retomada se o usuário estava com a reprodução ativa.
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            clearInterval(intervaloId);
            intervaloId = null;
        } else if (emReproducao) {
            intervaloId = setInterval(avancarSlide, INTERVALO_SLIDE_MS);
        }
    });

    // Usuários com preferência por movimento reduzido começam com a
    // apresentação pausada; a troca automática só começa por ação explícita.
    if (preferenciaMovimentoReduzido.matches) {
        atualizarBotaoPausa();
    } else {
        iniciarReproducao();
    }
})();

/* =======================================================================
 * EFEITO DO CABEÇALHO (HEADER ESCURO NO SCROLL)
 * ======================================================================= */
// A altura do hero e do header só mudam com o layout da página (resize),
// não a cada pixel rolado — por isso o limite de troca é calculado uma
// única vez e reaproveitado a cada evento de scroll, evitando reflow contínuo.
(function () {
    const header = document.querySelector('.cabecalho-principal');
    const hero = document.querySelector('.hero-carrossel');

    if (!header || !hero) return;

    let limiteHero = 0;

    function recalcularLimite() {
        limiteHero = hero.offsetHeight - header.offsetHeight;
    }

    function atualizarHeader() {
        header.classList.toggle('header-escuro', window.scrollY > limiteHero);
    }

    recalcularLimite();
    atualizarHeader();

    // Evento passive: true melhora a performance de rolagem no navegador
    window.addEventListener('scroll', atualizarHeader, { passive: true });
    window.addEventListener('resize', () => {
        recalcularLimite();
        atualizarHeader();
    });
})();

/* =======================================================================
 * MENU DROPDOWN (BALÃO DE CATEGORIAS)
 * ======================================================================= */
(function () {
    const btnCategorias = document.getElementById('btn-categorias');
    const listaCategorias = document.getElementById('lista-categorias');

    if (!btnCategorias || !listaCategorias) return;

    // Ação de clicar no botão "Categorias"
    btnCategorias.addEventListener('click', function(evento) {
        // Impede que a tela pule para o topo da página (comportamento padrão de links vazios)
        evento.preventDefault(); 
        
        if (listaCategorias.classList.contains('escondido')) {
            listaCategorias.classList.remove('escondido');
            listaCategorias.classList.add('mostrar');
            btnCategorias.setAttribute('aria-expanded', 'true'); // Acessibilidade para leitores de tela
        } else {
            listaCategorias.classList.add('escondido');
            listaCategorias.classList.remove('mostrar');
            btnCategorias.setAttribute('aria-expanded', 'false');
        }
    });

    // Ação para fechar o balãozinho quando o usuário clica fora da área do menu
    document.addEventListener('click', function(evento) {
        if (!btnCategorias.contains(evento.target) && !listaCategorias.contains(evento.target)) {
            listaCategorias.classList.add('escondido');
            listaCategorias.classList.remove('mostrar');
            btnCategorias.setAttribute('aria-expanded', 'false');
        }
    });
})();

/* =======================================================================
 * MENU SANDUÍCHE LATERAL (OFF-CANVAS) - ATUALIZADO
 * ======================================================================= */
document.addEventListener('DOMContentLoaded', function() {
    const btnMenu = document.getElementById('btn-menu-mobile');
    const menuColapsavel = document.getElementById('menu-colapsavel');
    const btnFechar = document.getElementById('btn-fechar-menu');
    const overlay = document.getElementById('overlay-menu');

    if (!btnMenu || !menuColapsavel) return;

    function alternarMenu() {
        // Abre ou fecha o menu lateral
        menuColapsavel.classList.toggle('aberto');
        
        // Mostra ou esconde o fundo escuro
        if (overlay) {
            overlay.classList.toggle('ativo');
        }
        
        // CORREÇÃO DO PROBLEMA 4: Trava a rolagem do corpo da página e do HTML inteiro
        if (menuColapsavel.classList.contains('aberto')) {
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden'; 
        } else {
            // Destrava a rolagem quando fecha o menu
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        }
    }

    // CORREÇÃO DO PROBLEMA 3: Usa .onclick direto para evitar cliques duplicados ou não registrados
    btnMenu.onclick = alternarMenu;
    if (btnFechar) btnFechar.onclick = alternarMenu;
    if (overlay) overlay.onclick = alternarMenu;
});

