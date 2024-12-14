const form = document.querySelector(".form");

form.addEventListener("submit", function (event) {
  event.preventDefault();
  const inputPeso = event.target.querySelector(".peso");
  const inputAltura = event.target.querySelector(".altura");
  const peso = Number(inputPeso.value);
  const altura = Number(inputAltura.value);
  console.log(peso, altura);

  if (!peso) {
    setResultado("peso Invalido", false);
    return;
  }
  if (!altura) {
    setResultado("Altura Invalido", false);
    return;
  }

  const imc = getImc(altura, peso);
  const nivelImc = getNivelImc(imc);
  const msg = `seu nivel de IMC é ${imc} ${nivelImc}`;
  setResultado(msg, true);
});

function getNivelImc(imc) {
  const nivel = [
    "abaixo do peso",
    "peso normal",
    "sobrepso",
    "obsediade grau 1",
    "obesidade grau 2 ",
    "obesidade grau 3",
  ];
  if (imc >= 39.9) return nivel[5];

  if (imc >= 34.9) return nivel[4];

  if (imc >= 29.9) return nivel[3];

  if (imc >= 24.9) return nivel[2];

  if (imc >= 18.5) return nivel[1];

  if (imc < 18.5) return nivel[0];
}

function getImc(altura, peso) {
  const imc = peso / altura ** 2;
  return imc.toFixed(2);
}

function criaP() {
  const p = document.createElement("p");
  return p;
}

function setResultado(msg, isValid) {
  const resultado = document.querySelector(".resultado");
  resultado.innerHTML = "";

  const p = criaP();
  if (isValid) {
    p.classList.add("resultado-bom");
  }
  if (!isValid) {
    p.classList.add("resultado-ruim");
  }
  p.innerHTML = msg;
  resultado.appendChild(p);
}
