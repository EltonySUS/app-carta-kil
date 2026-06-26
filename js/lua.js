document.addEventListener('DOMContentLoaded', function() {
    
    // --- 1. DECLARAÇÃO DE VARIÁVEIS ---
    const lua = document.getElementById('lua');
    const vitrolaContainer = document.getElementById('vitrola-container');
    const vitrolaOff = document.getElementById('vitrola-off');
    const vitrolaOn = document.getElementById('vitrola-on');
    const scrollPrompt = document.getElementById('scroll-prompt');
    const carrossel = document.querySelector('.carrossel-container');
    const cards = document.querySelectorAll('.card');
    const galeria = document.querySelector('.galeria-secao');
    const tituloGaleria = document.getElementById('galeria-titulo');
    const secaoFinal = document.querySelector('.secao-final-surpresa');
    const frasesSequenciais = document.querySelectorAll('.frase-seq');

    // --- 2. LÓGICA DE SCROLL (LUA, VITROLA, PROMPT) ---
    window.addEventListener('scroll', function() {
        let value = window.scrollY;

        if (lua) {
            lua.style.opacity = 1 - value / 600; 
            lua.style.top = 50 - value * 0.2 + 'px'; 
        }

        if (vitrolaContainer) {
            vitrolaContainer.style.opacity = Math.max(0, 1 - value / 400); 
            vitrolaContainer.style.top = 50 - value * 0.2 + 'px';
        }

        if (scrollPrompt) {
            const startFade = 100;
            const endFade = 400;
            let promptOpacity = (value > startFade) ? 1 - (value - startFade) / (endFade - startFade) : 1;
            scrollPrompt.style.opacity = Math.max(0, promptOpacity);
        }
    });

    // --- 3. CONTROLE DE MÚSICA ---
    // --- 3. CONTROLE DE MÚSICA ATUALIZADO (SELETOR DE PLAYLIST) ---
    let musicaAtual = null; 
    let isPlaying = false;
    const menuMusicas = document.getElementById('menu-musicas');
    const botoesMusica = document.querySelectorAll('.btn-musica');
    const btnPausar = document.getElementById('btn-pausar-tudo');

    if (vitrolaContainer) {
        // Ao clicar na área da vitrola, abre/fecha o menu de opções
        vitrolaContainer.addEventListener('click', function(e) {
            // Impede fechar se estiver clicando nos botões de dentro do menu
            if (e.target.closest('#menu-musicas')) return; 
            
            menuMusicas.classList.toggle('mostrar');
        });

        // Configuração para cada botão de música
        botoesMusica.forEach(botao => {
            botao.addEventListener('click', function() {
                const caminhoAudio = this.getAttribute('data-src');

                // Se houver uma música tocando, para ela antes de iniciar a nova
                if (musicaAtual) {
                    musicaAtual.pause();
                }

                // Cria o novo áudio selecionado
                musicaAtual = new Audio(caminhoAudio);
                musicaAtual.loop = true;

                musicaAtual.play()
                    .then(() => {
                        isPlaying = true;
                        vitrolaOff.classList.remove('active');
                        vitrolaOn.classList.add('active'); // Liga a animação da vitrola
                        menuMusicas.classList.remove('mostrar'); // Fecha o menu de escolha
                    })
                    .catch(error => console.error("Erro ao reproduzir faixa:", error));
            });
        });

        // Botão de Pausar Tudo
        if (btnPausar) {
            btnPausar.addEventListener('click', function() {
                if (musicaAtual) {
                    musicaAtual.pause();
                }
                isPlaying = false;
                vitrolaOn.classList.remove('active');
                vitrolaOff.classList.add('active'); // Volta para a imagem estática
                menuMusicas.classList.remove('mostrar');
            });
        }

        // Fecha o menu se o utilizador clicar em qualquer outro lugar do site
        document.addEventListener('click', function(e) {
            if (!vitrolaContainer.contains(e.target)) {
                menuMusicas.classList.remove('mostrar');
            }
        });
    }

    // --- 4. CARROSSEL E CARDS (MOUSE + SUPORTE EM TOUCHSCREEN DO APP) ---
    if (carrossel) {
        let isDown = false, startX, scrollLeft;

        // Funções Genéricas para Web/Mobile
        const startDragging = (clientX) => {
            isDown = true;
            carrossel.classList.add('active-dragging');
            startX = clientX - carrossel.offsetLeft;
            scrollLeft = carrossel.scrollLeft;
        };

        const stopDragging = () => {
            isDown = false;
            carrossel.classList.remove('active-dragging');
        };

        const moveDragging = (clientX) => {
            if (!isDown) return;
            const x = clientX - carrossel.offsetLeft;
            const walk = (x - startX) * 1.5; // Multiplicador de velocidade de arraste
            carrossel.scrollLeft = scrollLeft - walk;
        };

        // Eventos do Mouse
        carrossel.addEventListener('mousedown', (e) => startDragging(e.pageX));
        carrossel.addEventListener('mouseleave', stopDragging);
        carrossel.addEventListener('mouseup', stopDragging);
        carrossel.addEventListener('mousemove', (e) => {
            e.preventDefault();
            moveDragging(e.pageX);
        });

        // Eventos Touch (Essencial para o Aplicativo Mobile)
        carrossel.addEventListener('touchstart', (e) => startDragging(e.touches[0].pageX));
        carrossel.addEventListener('touchend', stopDragging);
        carrossel.addEventListener('touchmove', (e) => moveDragging(e.touches[0].pageX));
    }

    cards.forEach(card => {
        card.addEventListener('click', (e) => {
            e.stopPropagation();
            const isActive = card.classList.contains('active');
            cards.forEach(c => c.classList.remove('active', 'dimmed'));
            if (!isActive) {
                card.classList.add('active');
                cards.forEach(c => { if (c !== card) c.classList.add('dimmed'); });
            }
        });
    });

    document.addEventListener('click', () => cards.forEach(c => c.classList.remove('active', 'dimmed')));

    // --- 5. CONTAGEM REGRESSIVA ---
    const dataFinal = new Date("2024-12-25T00:00:00").getTime(); 
    const timerDiv = document.getElementById('countdown-timer');
    
    if (timerDiv) {
        const dS = timerDiv.querySelector('.dias'), hS = timerDiv.querySelector('.horas'), 
              mS = timerDiv.querySelector('.minutos'), sS = timerDiv.querySelector('.segundos');

        setInterval(() => {
            const agora = new Date().getTime();
            const dist = dataFinal - agora;
            if (dist < 0) {
                timerDiv.innerHTML = "🎉 O Evento Chegou! 🎉";
                return;
            }
            dS.textContent = Math.floor(dist / (1000 * 60 * 60 * 24));
            hS.textContent = Math.floor((dist % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            mS.textContent = Math.floor((dist % (1000 * 60 * 60)) / (1000 * 60));
            sS.textContent = Math.floor((dist % (1000 * 60)) / 1000);
        }, 1000);
    }

    // --- 6. PARTÍCULAS (CORAÇÕES E BRILHOS) ---
    const secoesComEfeitos = [];
    if (galeria) secoesComEfeitos.push(galeria);
    if (secaoFinal) secoesComEfeitos.push(secaoFinal);

    function criarCoracao() {
        if (secoesComEfeitos.length === 0) return;
        const alvo = secoesComEfeitos[Math.floor(Math.random() * secoesComEfeitos.length)];
        const coracao = document.createElement('span');
        coracao.classList.add('coracao');
        coracao.innerHTML = '💖';
        coracao.style.left = Math.random() * 100 + '%';
        coracao.style.animationDuration = (6 + Math.random() * 6) + 's';
        coracao.style.fontSize = (14 + Math.random() * 20) + 'px';
        alvo.appendChild(coracao);
        setTimeout(() => coracao.remove(), 12000);
    }
    setInterval(criarCoracao, 600);

    secoesComEfeitos.forEach(secao => {
        for (let i = 0; i < 30; i++) {
            const b = document.createElement('span');
            b.classList.add('brilho');
            b.style.top = Math.random() * 100 + '%';
            b.style.left = Math.random() * 100 + '%';
            b.style.animationDelay = Math.random() * 4 + 's';
            secao.appendChild(b);
        }
    });

    // --- 7. ANIMAÇÃO DE TÍTULO (LETRA POR LETRA) ---
    if (galeria && tituloGaleria) {
        const texto = tituloGaleria.textContent;
        tituloGaleria.textContent = '';
        texto.split('').forEach(l => {
            const s = document.createElement('span');
            s.textContent = l === ' ' ? '\u00A0' : l;
            tituloGaleria.appendChild(s);
        });

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                tituloGaleria.querySelectorAll('span').forEach((s, i) => {
                    s.style.animationDelay = `${i * 0.08}s`;
                    s.style.animationPlayState = 'running';
                });
                observer.disconnect();
            }
        }, { threshold: 0.4 });
        observer.observe(galeria);
    }

    // --- 8. FRASES SEQUENCIAIS (APARECER AO VER) ---
    if (secaoFinal && frasesSequenciais.length > 0) {
        const observerFinal = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                frasesSequenciais.forEach(f => f.style.animationPlayState = 'running');
                observerFinal.disconnect();
            }
        }, { threshold: 0.3 });
        observerFinal.observe(secaoFinal);
    }
});