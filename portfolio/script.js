document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll(".secao-pagina");
  const navLinks = document.querySelectorAll(".navitem");

  function showSection(hash) {
    if (!hash) hash = "#inicio";

    // Remove destaque do menu
    navLinks.forEach((link) => {
      link.classList.remove("active-nav");
    });

    // Esconde todas as seções
    sections.forEach((section) => {
      section.classList.remove("active");
    });

    // Mostra a seção clicada
    const target = document.querySelector(hash);

    if (target) {
      target.classList.add("active");
    }

    // Destaca item do menu
    const activeLink = document.querySelector(`.navitem[href="${hash}"]`);

    if (activeLink) {
      activeLink.classList.add("active-nav");
    }
  }

  // Navegação
  window.addEventListener("hashchange", () => {
    showSection(window.location.hash);
  });

  showSection(window.location.hash || "#inicio");

  // Efeito de digitação
  const textEl = document.querySelector(".type-effect");

  if (textEl) {
    const textToType = "Front-end e \nBack-end";
    let i = 0;

    function typeWriter() {
      if (i < textToType.length) {
        if (textToType.charAt(i) === "\n") {
          textEl.innerHTML += "<br>";
        } else {
          textEl.innerHTML += textToType.charAt(i);
        }

        i++;
        setTimeout(typeWriter, 100);
      } else {
        const cursor = document.querySelector(".cursor");

        if (cursor) {
          cursor.style.animation = "blink 1s infinite";
        }
      }
    }

    setTimeout(typeWriter, 500);
  }
});
