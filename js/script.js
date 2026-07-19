document.addEventListener("DOMContentLoaded", () => {
    const botaoEntrar = document.getElementById("btnEntrar");
    const telaInicial = document.getElementById("home");
    const dashboard = document.getElementById("dashboard");

    if (botaoEntrar && telaInicial && dashboard) {
        botaoEntrar.addEventListener("click", () => {
            telaInicial.style.display = "none";
            dashboard.classList.add("ativo");
            window.scrollTo({ top: 0, behavior: "smooth" });

            criarGraficos();
        });
    }

    const linksMenu = document.querySelectorAll(".menu a");

    linksMenu.forEach((link) => {
        link.addEventListener("click", (evento) => {
            evento.preventDefault();

            linksMenu.forEach((item) => item.classList.remove("ativo"));
            link.classList.add("ativo");
        });
    });
});

let graficoPecas;
let graficoResultados;

function criarGraficos() {
    if (typeof Chart === "undefined") {
        console.error("A biblioteca Chart.js não foi carregada.");
        return;
    }

    const canvasPecas = document.getElementById("graficoPecas");
    const canvasResultados = document.getElementById("graficoResultados");

    if (canvasPecas && !graficoPecas) {
        graficoPecas = new Chart(canvasPecas, {
            type: "pie",
            data: {
                labels: ["Distribuidores", "Varejo"],
                datasets: [
                    {
                        data: [10504, 5127],
                        backgroundColor: ["#0f4c81", "#f5c400"],
                        borderColor: "#ffffff",
                        borderWidth: 4,
                        hoverOffset: 10
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: "bottom",
                        labels: {
                            usePointStyle: true,
                            padding: 20,
                            font: {
                                family: "Poppins",
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: (contexto) => {
                                const valor = contexto.raw.toLocaleString("pt-BR");
                                return `${contexto.label}: ${valor} peças`;
                            }
                        }
                    }
                }
            }
        });
    }

    if (canvasResultados && !graficoResultados) {
        graficoResultados = new Chart(canvasResultados, {
            type: "bar",
            data: {
                labels: [
                    "Visitas",
                    "Pesquisas",
                    "Campanhas",
                    "Novos clientes",
                    "Capacitações"
                ],
                datasets: [
                    {
                        label: "Resultados",
                        data: [152, 23, 41, 19, 2],
                        backgroundColor: [
                            "#0f4c81",
                            "#2f6fa3",
                            "#4e89b8",
                            "#7da9cc",
                            "#f5c400"
                        ],
                        borderRadius: 10,
                        borderSkipped: false
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            precision: 0,
                            font: {
                                family: "Poppins"
                            }
                        },
                        grid: {
                            color: "rgba(102, 112, 133, 0.12)"
                        }
                    },
                    x: {
                        ticks: {
                            font: {
                                family: "Poppins"
                            }
                        },
                        grid: {
                            display: false
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: (contexto) => `Total: ${contexto.raw}`
                        }
                    }
                }
            }
        });
    }
}