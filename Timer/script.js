function criaHora(segundos) {
  const data = new Date(segundos * 1000);
  return data.toLocaleTimeString("pt-BR", {
    hour12: false,
    timeZone: "UTC",
  });
}

const relogio = document.querySelector(".relogio");
const iniciar = document.querySelector(".iniciar");
const pausar = document.querySelector(".pausar");
const reiniciar = document.querySelector(".reiniciar");
let segundos = 0;
let timer;

function iniciaRelogio() {
  timer = setInterval(function () {
    segundos++;
    relogio.innerHTML = criaHora(segundos);
  }, 1000);
}

document.addEventListener("click", function (e) {
  const elementoClicado = e.target;

  if (elementoClicado.classList.contains("iniciar")) {
    relogio.classList.remove("pausado");
    clearInterval(timer);
    iniciaRelogio();
  }
  if (elementoClicado.classList.contains("reiniciar")) {
    relogio.classList.remove("pausado");
    clearInterval(timer);
    relogio.innerHTML = "00:00:00";
    segundos = 0;
  }
  if (elementoClicado.classList.contains("pausar")) {
    relogio.classList.add("pausado");
    clearInterval(timer);
  }
});

//segundo metodo de clique com evento em cada botao

// iniciar.addEventListener("click", function (event) {
//   relogio.classList.remove("pausado");
//   clearInterval(timer);
//   iniciaRelogio();
// });
// pausar.addEventListener("click", function (event) {
//   relogio.classList.add("pausado");
//   clearInterval(timer);
// });
// reiniciar.addEventListener("click", function (event) {
//   clearInterval(timer);
//   relogio.innerHTML = "00:00:00";
//   segundos = 0;
// });
