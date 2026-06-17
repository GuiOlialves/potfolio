document.addEventListener('DOMContentLoaded', () => {
    // === CONTROLE DE NAVEGAÇÃO SPA ===
    const sections = document.querySelectorAll('.secao-pagina');
    const navLinks = document.querySelectorAll('.navitem');

    function showSection(hash) {
        if (!hash) hash = '#inicio'; // Se não houver hash, vai para Início

        // Remove a classe ativa de todos os links do menu
        navLinks.forEach(link => link.classList.remove('active-nav'));

        // Esconde todas as seções
        sections.forEach(sec => {
            sec.classList.remove('active-grid', 'active-block');
        });

        // Mostra a seção correspondente
        const target = document.querySelector(hash);
        if (target) {
            // Usa active-grid para as seções que usam CSS Grid, e active-block para as demais
            if (hash === '#inicio' || hash === '#Experiencia') {
                target.classList.add('active-grid');
            } else {
                target.classList.add('active-block');
            }
        }

        // Destaca o link correspondente no menu
        const activeLink = document.querySelector(`.navitem[href="${hash}"]`);
        if (activeLink) activeLink.classList.add('active-nav');
    }

    // Escuta mudanças na URL (quando o usuário clica no menu)
    window.addEventListener('hashchange', () => showSection(window.location.hash));

    // Carrega a seção correta assim que o site abre
    showSection(window.location.hash || '#inicio');

    // === EFEITO DE DIGITAÇÃO (TYPING EFFECT) ===
    const textEl = document.querySelector('.type-effect');
    const textToType = "Front-end e \nBack-end"; // O \n quebra a linha
    let i = 0;

    function typeWriter() {
        if (i < textToType.length) {
            if (textToType.charAt(i) === '\n') {
                textEl.innerHTML += '<br/>';
            } else {
                textEl.innerHTML += textToType.charAt(i);
            }
            i++;
            setTimeout(typeWriter, 100); // Velocidade da digitação
        } else {
            // Pisca o cursor infinitamente após terminar
            document.querySelector('.cursor').style.animation = 'blink 1s infinite';
        }
    }
    
    // Inicia o efeito
    setTimeout(typeWriter, 500);
});
