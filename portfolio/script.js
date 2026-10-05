/* Progressive enhancement: all content and anchor links work without JavaScript. */
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu() {
  navigation.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}
menuButton.addEventListener('click', () => {
  const isOpen = navigation.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
});
navigation.addEventListener('click', event => {
  if (event.target.closest('a')) closeMenu();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && navigation.classList.contains('open')) {
    closeMenu();
    menuButton.focus();
  }
});
document.addEventListener('click', event => {
  if (!header.contains(event.target)) closeMenu();
});
window.matchMedia('(min-width: 761px)').addEventListener('change', closeMenu);
const links = [...document.querySelectorAll('.navitem')];
const sections = links.map(link => document.getElementById(link.hash.slice(1)));
let scrollQueued = false;
function updateScroll() {
  header.classList.toggle('scrolled', window.scrollY > 20);
  let active = sections[0];
  for (const section of sections) {
    if (section.getBoundingClientRect().top <= window.innerHeight * .35) active = section;
  }
  if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 10) active = sections.at(-1);
  links.forEach(link => {
    if (link.hash === '#' + active.id) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
  scrollQueued = false;
}
window.addEventListener('scroll', () => {
  if (!scrollQueued) { scrollQueued = true; requestAnimationFrame(updateScroll); }
}, { passive: true });
window.addEventListener('resize', updateScroll);
updateScroll();
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.remove('pending');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .08 });
  document.querySelectorAll('.reveal').forEach(element => {
    if (!reducedMotion.matches && element.getBoundingClientRect().top > window.innerHeight) {
      element.classList.add('pending');
      observer.observe(element);
    }
  });
  document.addEventListener('focusin', event => event.target.closest('.pending')?.classList.remove('pending'));
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) document.querySelectorAll('.pending').forEach(el => el.classList.remove('pending'));
  });
}
const modes = {
  code: { symbol: '</>', label: 'CONSTRUIR', nodes: ['entrada', 'lógica', 'processo', 'solução'], command: '> explorar("desenvolvimento")', description: 'Desenvolvimento de interfaces com HTML, CSS e JavaScript.' },
  data: { symbol: '[ ]', label: 'DESCOBRIR', nodes: ['dados', 'Python', 'análise', 'insights'], command: '> explorar("dados")', description: 'Análise de dados com Python e machine learning.' },
  auto: { symbol: '↻', label: 'SIMPLIFICAR', nodes: ['entrada', 'rotina', 'Python', 'resultado'], command: '> explorar("automação")', description: 'Automação de tarefas repetitivas com Python.' }
};
const lab = document.querySelector('.lab');
lab.querySelectorAll('[data-lab]').forEach(button => {
  button.addEventListener('click', () => {
    const mode = modes[button.dataset.lab];
    lab.querySelectorAll('[data-lab]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    lab.querySelector('.network').dataset.mode = button.dataset.lab;
    lab.querySelector('.core-symbol').textContent = mode.symbol;
    lab.querySelector('.core-label').textContent = mode.label;
    lab.querySelectorAll('.network-label').forEach((label, index) => label.textContent = mode.nodes[index]);
    lab.querySelector('.console-command').textContent = mode.command;
    lab.querySelector('.console-description').textContent = mode.description;
  });
});
// SVG motion respects the same system preference as CSS, including live changes.
const connections = document.querySelector('.connections');
function syncMotion() {
  if (reducedMotion.matches) connections.pauseAnimations();
  else connections.unpauseAnimations();
}
reducedMotion.addEventListener('change', syncMotion);
syncMotion();
document.querySelector('#year').textContent = new Date().getFullYear();
