/* =========================================================
   DASHBOARD DE PERFORMANCE COMERCIAL - GSP
   Arquivo: js/script.js
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    const home = document.getElementById("home");
    const dashboard = document.getElementById("dashboard");
    const btnEntrar = document.getElementById("btnEntrar");
    const menuLinks = document.querySelectorAll(".menu a[data-page]");
    const pages = document.querySelectorAll(".page");
    const chartInstances = {};

    const formatNumber = (value) =>
        new Intl.NumberFormat("pt-BR").format(value);

    function animateNumbers(container = document) {
        const numbers = container.querySelectorAll(".kpi-number");

        numbers.forEach((element) => {
            if (element.dataset.animated === "true") return;

            const target = Number(element.dataset.target || 0);
            const duration = 900;
            const startTime = performance.now();

            element.dataset.animated = "true";

            function update(currentTime) {
                const progress = Math.min(
                    (currentTime - startTime) / duration,
                    1
                );

                const eased = 1 - Math.pow(1 - progress, 3);
                const current = Math.round(target * eased);

                element.textContent = formatNumber(current);

                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    element.textContent = formatNumber(target);
                }
            }

            requestAnimationFrame(update);
        });
    }

    function destroyChart(id) {
        if (chartInstances[id]) {
            chartInstances[id].destroy();
            delete chartInstances[id];
        }
    }

    function createChart(id, config) {
        const canvas = document.getElementById(id);

        if (!canvas || typeof Chart === "undefined") return;

        destroyChart(id);
        chartInstances[id] = new Chart(canvas, config);
    }

    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,

        animation: {
            duration: 850
        },

        plugins: {
            legend: {
                position: "bottom",

                labels: {
                    usePointStyle: true,
                    boxWidth: 10,
                    padding: 18,

                    font: {
                        family: "Poppins"
                    }
                }
            },

            tooltip: {
                callbacks: {
                    label(context) {
                        const label = context.dataset.label
                            ? `${context.dataset.label}: `
                            : "";

                        return `${label}${formatNumber(context.raw)}`;
                    }
                }
            }
        }
    };

    function renderOverviewCharts() {
        createChart("graficoPecas", {
            type: "doughnut",

            data: {
                labels: [
                    "Distribuidores",
                    "Varejo"
                ],

                datasets: [{
                    data: [
                        10504,
                        5127
                    ],

                    backgroundColor: [
                        "#1d4f91",
                        "#2ea67c"
                    ],

                    borderWidth: 0,
                    hoverOffset: 8
                }]
            },

            options: {
                ...commonOptions,
                cutout: "68%"
            }
        });

        createChart("graficoResultados", {
            type: "bar",

            data: {
                labels: [
                    "Visitas",
                    "Pesquisas",
                    "Campanhas",
                    "Novos Clientes",
                    "Capacitações"
                ],

                datasets: [{
                    label: "Total",

                    data: [
                        152,
                        24,
                        51,
                        19,
                        2
                    ],

                    backgroundColor: [
                        "#1d4f91",
                        "#2ea67c",
                        "#f59b45",
                        "#d95c5c",
                        "#f2c14e"
                    ],

                    borderRadius: 10,
                    borderSkipped: false
                }]
            },

            options: {
                ...commonOptions,

                scales: {
                    x: {
                        grid: {
                            display: false
                        },

                        ticks: {
                            font: {
                                family: "Poppins"
                            }
                        }
                    },

                    y: {
                        beginAtZero: true,

                        grid: {
                            color: "rgba(124, 135, 152, 0.14)"
                        },

                        ticks: {
                            precision: 0,

                            font: {
                                family: "Poppins"
                            }
                        }
                    }
                }
            }
        });
    }

    function renderVisitsCharts() {
        const visitsPlugins =
            typeof ChartDataLabels !== "undefined"
                ? [ChartDataLabels]
                : [];

        createChart("graficoVisitasMensais", {
            type: "bar",

            data: {
                labels: [
                    "Maio",
                    "Junho"
                ],

                datasets: [{
                    label: "Visitas",

                    data: [
                        89,
                        63
                    ],

                    backgroundColor: [
                        "#3b82f6",
                        "#1d4f91"
                    ],

                    borderRadius: 12,
                    borderSkipped: false,
                    maxBarThickness: 90
                }]
            },

            plugins: visitsPlugins,

            options: {
                ...commonOptions,

                layout: {
                    padding: {
                        top: 24
                    }
                },

                plugins: {
                    ...commonOptions.plugins,

                    legend: {
                        display: false
                    },

                    tooltip: {
                        enabled: true,

                        callbacks:
                            commonOptions.plugins.tooltip.callbacks
                    },

                    datalabels: {
                        display: true,
                        anchor: "end",
                        align: "top",
                        offset: 4,
                        clamp: true,
                        clip: false,
                        color: "#1f2937",

                        font: {
                            family: "Poppins",
                            weight: "700",
                            size: 14
                        },

                        formatter: (value) =>
                            formatNumber(value)
                    }
                },

                scales: {
                    x: {
                        grid: {
                            display: false
                        },

                        ticks: {
                            font: {
                                family: "Poppins",
                                weight: "600"
                            }
                        }
                    },

                    y: {
                        beginAtZero: true,
                        suggestedMax: 105,

                        grid: {
                            color: "rgba(124, 135, 152, 0.14)"
                        },

                        ticks: {
                            stepSize: 20,
                            precision: 0,

                            font: {
                                family: "Poppins"
                            }
                        }
                    }
                }
            }
        });

        createChart("graficoVisitasCanal", {
            type: "doughnut",

            data: {
                labels: [
                    "Distribuidores",
                    "Varejo"
                ],

                datasets: [{
                    data: [
                        38,
                        114
                    ],

                    backgroundColor: [
                        "#f59e0b",
                        "#10b981"
                    ],

                    borderWidth: 0,
                    hoverOffset: 10
                }]
            },

            options: {
                ...commonOptions,
                cutout: "64%"
            }
        });
    }
    function renderResearchCharts() {
        const researchPlugins =
            typeof ChartDataLabels !== "undefined"
                ? [ChartDataLabels]
                : [];

        createChart("graficoMarcasPesquisa", {
            type: "bar",

            data: {
                labels: [
                    "WEGA",
                    "TECFIL",
                    "VOX",
                    "MANN",
                    "MAHLE",
                    "HENGST"
                ],

                datasets: [{
                    label: "Participação (%)",

                    data: [
                        43.15,
                        32.36,
                        14.52,
                        5.39,
                        3.32,
                        1.24
                    ],

                    backgroundColor: [
                        "#6b7280",
                        "#1d4f91",
                        "#f59b45",
                        "#9ca3af",
                        "#cbd5e1",
                        "#e5e7eb"
                    ],

                    borderRadius: 10,
                    borderSkipped: false,
                    maxBarThickness: 72
                }]
            },

            plugins: researchPlugins,

            options: {
                ...commonOptions,

                layout: {
                    padding: {
                        top: 28
                    }
                },

                plugins: {
                    ...commonOptions.plugins,

                    legend: {
                        display: false
                    },

                    tooltip: {
                        enabled: true,

                        callbacks: {
                            label(context) {
                                return `${context.raw.toLocaleString(
                                    "pt-BR",
                                    {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    }
                                )}%`;
                            }
                        }
                    },

                    datalabels: {
                        display: true,
                        anchor: "end",
                        align: "top",
                        offset: 4,
                        clamp: true,
                        clip: false,
                        color: "#1f2937",

                        font: {
                            family: "Poppins",
                            weight: "700",
                            size: 13
                        },

                        formatter: (value) =>
                            `${value.toLocaleString(
                                "pt-BR",
                                {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                }
                            )}%`
                    }
                },

                scales: {
                    x: {
                        grid: {
                            display: false
                        },

                        ticks: {
                            font: {
                                family: "Poppins",
                                weight: "600"
                            }
                        }
                    },

                    y: {
                        beginAtZero: true,
                        max: 50,

                        grid: {
                            color: "rgba(124, 135, 152, 0.14)"
                        },

                        ticks: {
                            stepSize: 10,

                            callback(value) {
                                return value + "%";
                            },

                            font: {
                                family: "Poppins"
                            }
                        }
                    }
                }
            }
        });

        createChart("graficoTipoEstabelecimento", {
            type: "doughnut",

            data: {
                labels: [
                    "Posto de Combustível",
                    "Centro Automotivo",
                    "Oficina Mecânica",
                    "Autopeças"
                ],

                datasets: [{
                    data: [
                        11,
                        8,
                        3,
                        2
                    ],

                    backgroundColor: [
                        "#1d4f91",
                        "#2ea67c",
                        "#f59b45",
                        "#d95c5c"
                    ],

                    borderWidth: 0,
                    hoverOffset: 8
                }]
            },

            options: {
                ...commonOptions,
                cutout: "64%"
            }
        });
    }

 function renderCampaignCharts() {

    const modalidades = document.getElementById('graficoModalidadesCampanha');

    if (modalidades) {
        new Chart(modalidades, {
            type: 'bar',
            data: {
                labels: [
                    'Filtros NF',
                    'Rodadas',
                    'Distribuidores'
                ],
                datasets: [{
                    label: 'Campanhas',
                    data: [30, 14, 7],
                    borderRadius: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            precision: 0
                        }
                    }
                }
            }
        });
    }

}
    function renderChartsForPage(pageId) {
        requestAnimationFrame(() => {
            if (pageId === "visao-geral") {
                renderOverviewCharts();
            }

            if (pageId === "visitas") {
                renderVisitsCharts();
            }

            if (pageId === "pesquisas") {
                renderResearchCharts();
            }

            if (pageId === "campanhas") {
                renderCampaignCharts();
            }
        });
    }

    function showPage(pageId, updateHash = true) {
        const targetPage = document.getElementById(pageId);

        if (!targetPage) return;

        pages.forEach((page) => {
            page.classList.remove("ativa");
        });

        menuLinks.forEach((link) => {
            link.classList.remove("ativo");
        });

        targetPage.classList.add("ativa");

        const activeLink = document.querySelector(
            `.menu a[data-page="${pageId}"]`
        );

        if (activeLink) {
            activeLink.classList.add("ativo");
        }

        if (updateHash) {
            history.replaceState(
                null,
                "",
                `#${pageId}`
            );
        }

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

        animateNumbers(targetPage);
        renderChartsForPage(pageId);
    }

    function openDashboard() {
        if (home) {
            home.classList.add("saindo");
        }

        window.setTimeout(() => {
            if (home) {
                home.style.display = "none";
            }

            if (dashboard) {
                dashboard.classList.add("visivel");
            }

            const initialPage =
                location.hash.replace("#", "") ||
                "visao-geral";

            showPage(initialPage, false);
        }, 450);
    }

    if (btnEntrar) {
        btnEntrar.addEventListener(
            "click",
            openDashboard
        );
    }

    menuLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            showPage(link.dataset.page);
        });
    });

    window.addEventListener("hashchange", () => {
        if (
            !dashboard ||
            !dashboard.classList.contains("visivel")
        ) {
            return;
        }

        const pageId =
            location.hash.replace("#", "") ||
            "visao-geral";

        showPage(pageId, false);
    });

    const galleryFilters =
        document.querySelectorAll(".gallery-filter");

    galleryFilters.forEach((button) => {
        button.addEventListener("click", () => {
            galleryFilters.forEach((item) => {
                item.classList.remove("ativo");
            });

            button.classList.add("ativo");

            const filter = button.dataset.filter;

            const galleryItems =
                document.querySelectorAll(
                    "#galeriaFotos .gallery-item"
                );

            galleryItems.forEach((item) => {
                const category = item.dataset.category;

                const shouldShow =
                    filter === "todas" ||
                    category === filter;

                item.classList.toggle(
                    "oculto",
                    !shouldShow
                );
            });
        });
    });
});
document.addEventListener('DOMContentLoaded', () => {
    const photoItems = document.querySelectorAll('.photo-item');
    const lightbox = document.getElementById('photoLightbox');
    const lightboxImage = document.getElementById('photoLightboxImage');
    const lightboxClose = document.getElementById('photoLightboxClose');

    if (!lightbox || !lightboxImage) {
        console.warn('Lightbox da galeria não encontrado.');
        return;
    }

    photoItems.forEach((item) => {
        item.addEventListener('click', () => {
            const image = item.querySelector('img');

            if (!image) return;

            lightboxImage.src = image.src;
            lightboxImage.alt = image.alt || 'Foto ampliada';

            lightbox.classList.add('is-open');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        });
    });

    function closePhotoLightbox() {
        lightbox.classList.remove('is-open');
        lightbox.setAttribute('aria-hidden', 'true');
        lightboxImage.src = '';
        document.body.style.overflow = '';
    }

    if (lightboxClose) {
        lightboxClose.addEventListener('click', closePhotoLightbox);
    }

    lightbox.addEventListener('click', (event) => {
        if (event.target === lightbox) {
            closePhotoLightbox();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && lightbox.classList.contains('is-open')) {
            closePhotoLightbox();
        }
    });
});
document.addEventListener('DOMContentLoaded', () => {
    const splashScreen = document.getElementById('splashScreen');

    if (!splashScreen) return;

    window.setTimeout(() => {
        splashScreen.classList.add('is-hidden');

        window.setTimeout(() => {
            splashScreen.remove();
        }, 700);
    }, 2200);
});