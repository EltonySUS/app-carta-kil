// Data de início do namoro: 27 de Dezembro de 2025 às 00:00:00
const dataInicio = new Date('2025-12-27T00:00:00');

function atualizarTemporizador() {
    const agora = new Date();
    const diferencaEmMilissegundos = agora - dataInicio;

    if (diferencaEmMilissegundos < 0) {
        document.getElementById('tempo-contagem').innerText = "O amor está quase a começar!";
        return;
    }

    // Cálculos do tempo total detalhado
    const segundosTotais = Math.floor(diferencaEmMilissegundos / 1000);
    const minutosTotais = Math.floor(segundosTotais / 60);
    const horasTotais = Math.floor(minutosTotais / 60);
    const diasTotais = Math.floor(horasTotais / 24);

    const horasRestantes = horasTotais % 24;
    const minutosRestantes = minutosTotais % 60;
    const segundosRestantes = segundosTotais % 60;

    // Atualiza o texto do temporizador segundo a segundo
    const stringTempo = `${diasTotais} dias, ${horasRestantes}h ${minutosRestantes}m ${segundosRestantes}s`;
    document.getElementById('tempo-contagem').innerText = stringTempo;
}

function verificarAniversarioNamoro() {
    const agora = new Date();
    
    // Só roda a verificação se já passou da data de início
    if (agora < dataInicio) return;

    // Se o dia atual for igual ao dia do início (Dia 27)
    if (agora.getDate() === dataInicio.getDate()) {
        
        // Calcula a quantidade exata de meses passados
        let meses = (agora.getFullYear() - dataInicio.getFullYear()) * 12;
        meses += agora.getMonth() - dataInicio.getMonth();

        // Se o número de meses for maior que zero (para não disparar no exato dia 27/12/2025)
        if (meses > 0) {
            
            // 1. DISPARA NOTIFICAÇÃO DO NAVEGADOR
            solicitarEDispararNotificacao(meses);

            // 2. DISPARA MENSAGEM BEM NA FRENTE DO SITE (POP-UP)
            const popup = document.getElementById('popup-aniversario');
            const mensagemPopup = document.getElementById('popup-mensagem-meses');
            
            mensagemPopup.innerText = `Feliz ${meses}º Mês de Namoro!`;
            
            // Exibe o Pop-up com animação suave
            popup.classList.add('mostrar');
        }
    }
}

// Função para fechar a surpresa na tela ao clicar no "X"
function fecharPopup() {
    document.getElementById('popup-aniversario').classList.remove('mostrar');
}

// Lógica de Notificação Push Push (Sistema Operativo/Telemóvel)
function solicitarEDispararNotificacao(meses) {
    if (!("Notification" in window)) return; // Navegador não suporta

    // Se a permissão já foi concedida, envia a notificação
    if (Notification.permission === "granted") {
        new Notification("💖 Nosso Aniversário de Namoro!", {
            body: `Parabéns, meu amor! Hoje completamos oficialmente ${meses} meses juntos! 🥰`,
            icon: 'img/mar.png' // Caminho opcional de um ícone do seu projeto
        });
    } 
    // Se não tiver negado, pede autorização
    else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                new Notification("💖 Nosso Aniversário de Namoro!", {
                    body: `Parabéns, meu amor! Hoje completamos oficialmente ${meses} meses juntos! 🥰`
                });
            }
        });
    }
}

// Execuções ao carregar a página
window.addEventListener('DOMContentLoaded', () => {
    // Inicia e atualiza o temporizador a cada 1 segundo
    atualizarTemporizador();
    setInterval(atualizarTemporizador, 1000);

    // Verifica se hoje é dia de comemoração (dia 27)
    verificarAniversarioNamoro();
});