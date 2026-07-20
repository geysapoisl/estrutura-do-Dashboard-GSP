/* =========================================================
   DASHBOARD DE PERFORMANCE COMERCIAL - GSP
   Arquivo: js/script.js
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    const home = document.getElementById("home");
    const dashboard = document.getElementById("dashboard");
    const btnEntrar = document.getElementById("btnEntrar");

    const linksMenu = document.querySelectorAll(".menu a");
    const paginas = document.querySelectorAll(".page");
    const filtrosGaleria = document.querySelectorAll(".gallery-filter");

    let graficosCriados = false;
    let numerosAnimados = false;

    /* =====================================================
       1. ABRIR O DASHBOARD
       ===================================================== */

    function abrirDashboard() {
        if (home) {
            home.classList.add("saindo");
        }

        setTimeout(() => {
            if (home) {
                home.style.display = "none";
            }

            if (dashboard) {
                dashboard.classList.add("visivel");
            }

            abrirPagina("visao-geral");
            criarGraficos();

            if (!numerosAnimados) {
                animarNumeros();
                numerosAnimados = true;
            }
        }, 420);
    }

    if (btnEntrar) {
        btnEntrar.addEventListener("click", abrirDashboard);
    }

    /* =====================================================
       2. NAVEGAÇÃO ENTRE AS PÁGINAS
       ===================================================== */

    function abrirPagina(idPagina) {
        paginas.forEach((pagina) => {
            pagina.classList.toggle("ativa", pagina.id === idPagina);
        });

        linksMenu.forEach((link) => {
            link.classList.toggle("ativo", link.dataset.page === idPagina);
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

        atualizarGraficosVisiveis();
    }

    linksMenu.forEach((link) => {
        link.addEventListener("click", (evento) => {
            evento.preventDefault();

            const paginaSelecionada = link.dataset.page;

            if (paginaSelecionada) {
                abrirPagina(paginaSelecionada);
                history.replaceState(null, "", `#${paginaSelecionada}`);
            }
        });
    });

    /* =====================================================
       3. ANIMAÇÃO DOS NÚMEROS
       ===================================================== */

    function formatarNumero(valor) {
        return new Intl.NumberFormat("pt-BR").format(valor);
    }

    function animarNumero(elemento) {
        const alvo = Number(elemento.dataset.target || 0);
        const duracao = 1300;
        const inicio = performance.now();

        function atualizar(tempoAtual) {
            const progresso = Math.min((tempoAtual - inicio) / duracao, 1);
            const suavizacao = 1 - Math.pow(1 - progresso, 3);
            const valorAtual = Math.floor(alvo * suavizacao);

            elemento.textContent = formatarNumero(valorAtual);

            if (progresso < 1) {
                requestAnimationFrame(atualizar);
            } else {
                elemento.textContent = formatarNumero(alvo);
            }
        }

        requestAnimationFrame(atualizar);
    }

    function animarNumeros() {
        document.querySelectorAll(".kpi-number").forEach(animarNumero);
    }

    /* =====================================================
       4. CONFIGURAÇÕES GERAIS DOS GRÁFICOS
       ===================================================== */

    if (typeof Chart !== "undefined") {
        Chart.defaults.font.family = "Poppins, Arial, sans-serif";
        Chart.defaults.color = "#657083";
        Chart.defaults.borderColor = "rgba(213, 220, 231, 0.70)";
    }

    const cores = {
        azul: "#1d4f91",
        azulClaro: "#78a6df",
        verde: "#2ea67c",
        laranja: "#f59b45",
        roxo: "#7657c8",
        vermelho: "#d95c5c",
        amarelo: "#f2c14e",
        cinza: "#a5afbd"
    };

    const graficos = {};

    function opcoesBase() {
        return {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 900,
                easing: "easeOutQuart"
            },
            plugins: {
                legend: {
                    labels: {
                        usePointStyle: true,
                        pointStyle: "circle",
                        padding: 18
                    }
                },
                tooltip: {
                    backgroundColor: "#07152b",
                    padding: 12,
                    titleFont: {
                        weight: "600"
                    },
                    bodyFont: {
                        size: 12
                    }
                }
            }
        };
    }

    function criarGrafico(idCanvas, configuracao) {
        const canvas = document.getElementById(idCanvas);

        if (!canvas || typeof Chart === "undefined") {
            return null;
        }

        if (graficos[idCanvas]) {
            graficos[idCanvas].destroy();
        }

        graficos[idCanvas] = new Chart(canvas, configuracao);
        return graficos[idCanvas];
    }

    /* =====================================================
       5. CRIAÇÃO DOS GRÁFICOS
       ===================================================== */

    function criarGraficos() {
        if (graficosCriados || typeof Chart === "undefined") {
            return;
        }

        graficosCriados = true;

        criarGrafico("graficoPecas", {
            type: "doughnut",
            data: {
                labels: ["Distribuidores", "Varejo"],
                datasets: [{
                    data: [10504, 5127],
                    backgroundColor: [cores.azul, cores.laranja],
                    borderWidth: 0,
                    hoverOffset: 8
                }]
            },
            options: {
                ...opcoesBase(),
                cutout: "68%",
                plugins: {
                    ...opcoesBase().plugins,
                    tooltip: {
                        ...opcoesBase().plugins.tooltip,
                        callbacks: {
                            label: (contexto) =>
                                `${contexto.label}: ${formatarNumero(contexto.raw)} peças`
                        }
                    }
                }
            }
        });

        criarGrafico("graficoResultados", {
            type: "bar",
            data: {
                labels: [
                    "Visitas",
                    "Pesquisas",
                    "Campanhas",
                    "Novos clientes",
                    "Capacitações"
                ],
                datasets: [{
                    label: "Total",
                    data: [152, 23, 41, 19, 2],
                    backgroundColor: [
                        cores.azul,
                        cores.verde,
                        cores.laranja,
                        cores.vermelho,
                        cores.amarelo
                    ],
                    borderRadius: 10,
                    borderSkipped: false
                }]
            },
            options: {
                ...opcoesBase(),
                scales: {
                    x: {
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            precision: 0
                        }
                    }
                },
                plugins: {
                    ...opcoesBase().plugins,
                    legend: {
                        display: false
                    }
                }
            }
        });

        criarGrafico("graficoVisitasMensais", {
            type: "line",
            data: {
                labels: ["Maio", "Junho"],
                datasets: [{
                    label: "Visitas realizadas",
                    data: [74, 78],
                    borderColor: cores.azul,
                    backgroundColor: "rgba(29, 79, 145, 0.12)",
                    pointBackgroundColor: cores.azul,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    borderWidth: 3,
                    fill: true,
                    tension: 0.35
                }]
            },
            options: {
                ...opcoesBase(),
                scales: {
                    x: {
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            precision: 0
                        }
                    }
                }
            }
        });

        criarGrafico("graficoMarcasPesquisa", {
            type: "bar",
            data: {
                labels: ["Tecfil", "Wega", "Mahle", "Fram", "Outras"],
                datasets: [{
                    label: "Participação",
                    data: [38, 26, 16, 11, 9],
                    backgroundColor: [
                        cores.azul,
                        cores.laranja,
                        cores.verde,
                        cores.roxo,
                        cores.cinza
                    ],
                    borderRadius: 8,
                    borderSkipped: false
                }]
            },
            options: {
                ...opcoesBase(),
                indexAxis: "y",
                scales: {
                    x: {
                        beginAtZero: true,
                        max: 45,
                        ticks: {
                            callback: (valor) => `${valor}%`
                        }
                    },
                    y: {
                        grid: {
                            display: false
                        }
                    }
                },
                plugins: {
                    ...opcoesBase().plugins,
                    legend: {
                        display: false
                    },
                    tooltip: {
                        ...opcoesBase().plugins.tooltip,
                        callbacks: {
                            label: (contexto) => `${contexto.raw}%`
                        }
                    }
                }
            }
        });

        criarGrafico("graficoTipoEstabelecimento", {
            type: "doughnut",
            data: {
                labels: [
                    "Autopeças",
                    "Oficinas",
                    "Distribuidores",
                    "Outros"
                ],
                datasets: [{
                    data: [43, 30, 17, 10],
                    backgroundColor: [
                        cores.azul,
                        cores.verde,
                        cores.laranja,
                        cores.roxo
                    ],
                    borderWidth: 0,
                    hoverOffset: 8
                }]
            },
            options: {
                ...opcoesBase(),
                cutout: "62%",
                plugins: {
                    ...opcoesBase().plugins,
                    tooltip: {
                        ...opcoesBase().plugins.tooltip,
                        callbacks: {
                            label: (contexto) =>
                                `${contexto.label}: ${contexto.raw}%`
                        }
                    }
                }
            }
        });

        criarGrafico("graficoModalidadesCampanha", {
            type: "bar",
            data: {
                labels: [
                    "Rodadas de Prêmios",
                    "Campanhas por Notas",
                    "Outras ações"
                ],
                datasets: [{
                    label: "Campanhas",
                    data: [18, 15, 8],
                    backgroundColor: [
                        cores.laranja,
                        cores.azul,
                        cores.verde
                    ],
                    borderRadius: 10,
                    borderSkipped: false
                }]
            },
            options: {
                ...opcoesBase(),
                scales: {
                    x: {
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            precision: 0
                        }
                    }
                },
                plugins: {
                    ...opcoesBase().plugins,
                    legend: {
                        display: false
                    }
                }
            }
        });

        criarGrafico("graficoPecasCampanhas", {
            type: "doughnut",
            data: {
                labels: ["Distribuidores", "Varejo"],
                datasets: [{
                    data: [10504, 5127],
                    backgroundColor: [cores.azul, cores.laranja],
                    borderWidth: 0,
                    hoverOffset: 8
                }]
            },
            options: {
                ...opcoesBase(),
                cutout: "65%",
                plugins: {
                    ...opcoesBase().plugins,
                    tooltip: {
                        ...opcoesBase().plugins.tooltip,
                        callbacks: {
                            label: (contexto) =>
                                `${contexto.label}: ${formatarNumero(contexto.raw)} peças`
                        }
                    }
                }
            }
        });

        criarGrafico("graficoRankingCampanhas", {
            type: "bar",
            data: {
                labels: [
                    "Campanha A",
                    "Campanha B",
                    "Campanha C",
                    "Campanha D",
                    "Campanha E"
                ],
                datasets: [{
                    label: "Peças alcançadas",
                    data: [3680, 3120, 2840, 2270, 1721],
                    backgroundColor: cores.azul,
                    borderRadius: 9,
                    borderSkipped: false
                }]
            },
            options: {
                ...opcoesBase(),
                indexAxis: "y",
                scales: {
                    x: {
                        beginAtZero: true,
                        ticks: {
                            callback: (valor) => formatarNumero(valor)
                        }
                    },
                    y: {
                        grid: {
                            display: false
                        }
                    }
                },
                plugins: {
                    ...opcoesBase().plugins,
                    legend: {
                        display: false
                    },
                    tooltip: {
                        ...opcoesBase().plugins.tooltip,
                        callbacks: {
                            label: (contexto) =>
                                `${formatarNumero(contexto.raw)} peças`
                        }
                    }
                }
            }
        });

        preencherIndicadoresCampanhas();
    }

    /* =====================================================
       6. INDICADORES COMPLEMENTARES DE CAMPANHAS
       ===================================================== */

    function definirTexto(id, valor) {
        const elemento = document.getElementById(id);

        if (elemento) {
            elemento.textContent = valor;
        }
    }

    function preencherIndicadoresCampanhas() {
        definirTexto("totalRodadasPremio", "18");
        definirTexto("totalCampanhasNotas", "15");
        definirTexto("totalCampanhasDistribuidores", "24");
        definirTexto("totalCampanhasVarejo", "17");
    }

    /* =====================================================
       7. GALERIA DE FOTOS
       ===================================================== */

    filtrosGaleria.forEach((botao) => {
        botao.addEventListener("click", () => {
            filtrosGaleria.forEach((item) => {
                item.classList.remove("ativo");
            });

            botao.classList.add("ativo");

            const filtro = botao.dataset.filter;
            const fotos = document.querySelectorAll(".gallery-item");

            fotos.forEach((foto) => {
                const categoria = foto.dataset.category;
                const mostrar = filtro === "todas" || categoria === filtro;

                foto.classList.toggle("oculto", !mostrar);
            });
        });
    });

    /* =====================================================
       8. AJUSTE DOS GRÁFICOS AO TROCAR DE PÁGINA
       ===================================================== */

    function atualizarGraficosVisiveis() {
        setTimeout(() => {
            Object.values(graficos).forEach((grafico) => {
                if (grafico) {
                    grafico.resize();
                }
            });
        }, 80);
    }

    window.addEventListener("resize", atualizarGraficosVisiveis);

    /* =====================================================
       9. ABERTURA DIRETA POR ENDEREÇO
       ===================================================== */

    const paginaNaUrl = window.location.hash.replace("#", "");

    if (paginaNaUrl && document.getElementById(paginaNaUrl)) {
        if (home) {
            home.style.display = "none";
        }

        if (dashboard) {
            dashboard.classList.add("visivel");
        }

        abrirPagina(paginaNaUrl);
        criarGraficos();
        animarNumeros();
        numerosAnimados = true;
    }
});