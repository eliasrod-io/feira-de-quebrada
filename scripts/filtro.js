/* =======================================================================
 * LÓGICA DE FILTRAGEM E BUSCA DE RESULTADOS (PÁGINA DE FILTRO)
 * ======================================================================= */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. CAPTURA DE ELEMENTOS DO DOM
    // ==========================================
    const parametros = new URLSearchParams(window.location.search);
    const categoriaUrl = parametros.get("categoria"); // Pega o parâmetro ?categoria= da URL
    
    const seletorCategoria = document.getElementById("categoria");
    const campoBusca = document.getElementById("busca");
    const resultado = document.getElementById("resultado");
    const cards = document.querySelectorAll(".card-resultados");
    const botaoFiltro = document.querySelector(".aplica-filtro");

    // ==========================================
    // 2. FUNÇÃO DE INICIALIZAÇÃO DA PÁGINA
    // ==========================================
    function inicializarFiltro() {
        let quantidadeResultados = 0;

        // Se existir uma categoria na URL, define ela no Select. Se não, mantém "todas".
        if (categoriaUrl) {
            seletorCategoria.value = categoriaUrl;
        }

        const categoriaAtual = seletorCategoria.value;

        // Faz o loop para exibir os cards corretos no primeiro carregamento
        cards.forEach(card => {
            if (categoriaAtual === "todas" || card.dataset.categoria === categoriaAtual) {
                card.style.display = "block";
                quantidadeResultados++;
            } else {
                card.style.display = "none";
            }
        });

        // Atualiza o contador de resultados no topo da página
        if (resultado) {
            resultado.textContent = quantidadeResultados;
        }
    }

    // ==========================================
    // 3. EVENTO: CLIQUE NO BOTÃO "APLICAR FILTROS"
    // ==========================================
    if (botaoFiltro) {
        botaoFiltro.addEventListener("click", function() {
            const categoriaSelecionada = seletorCategoria.value;
            const textoBusca = campoBusca.value.toLowerCase().trim(); // .trim() remove espaços vazios acidentais
            let quantidadeResultados = 0;

            cards.forEach(card => {
                // Captura o nome do estabelecimento (tag h3) do card atual
                const nomeEstabelecimento = card.querySelector("h3").textContent.toLowerCase();

                // Regras de validação: bateu a categoria? bateu o texto digitado?
                const correspondeCategoria = (categoriaSelecionada === "todas" || card.dataset.categoria === categoriaSelecionada);
                const correspondeBusca = nomeEstabelecimento.includes(textoBusca);

                // Se passou nos dois filtros, exibe o card
                if (correspondeCategoria && correspondeBusca) {
                    card.style.display = "block";
                    quantidadeResultados++;
                } else {
                    card.style.display = "none";
                }
            });

            // Atualiza o contador de resultados após o usuário filtrar
            if (resultado) {
                resultado.textContent = quantidadeResultados;
            }
        });
    }

    // ==========================================
    // 4. EXECUÇÃO
    // ==========================================
    // Chama a função de inicialização assim que o script é carregado
    inicializarFiltro();

});