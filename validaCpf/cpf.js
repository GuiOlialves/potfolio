const cpfTexto2 = document.querySelector(".cpfTexto");
const botao = document.querySelector(".btn-cpf");

function validaCpf(cpfEnviado) {
  Object.defineProperty(this, "cpfLimpo", {
    enumerable: true,
    get: function () {
      return cpfEnviado.replace(/\D+/g, "");
    },
  });
}

validaCpf.prototype.valida = function () {
  if (typeof this.cpfLimpo === "undefined") return false;
  if (this.cpfLimpo.length !== 11) return false;
  if (this.isSequencia()) return false;

  const cpfParcial = this.cpfLimpo.slice(0, -2);
  const digito1 = this.criaDigito(cpfParcial);
  const digito2 = this.criaDigito(cpfParcial + digito1);
  const novoCpf = cpfParcial + digito1 + digito2;

  return novoCpf === this.cpfLimpo;
};

validaCpf.prototype.criaDigito = function (cpfParcial) {
  const cpfArray = Array.from(cpfParcial);

  let regressivo = cpfArray.length + 1;
  const total = cpfArray.reduce((ac, val) => {
    ac += regressivo * Number(val);
    regressivo--;
    return ac;
  }, 0);
  const digito = 11 - (total % 11);

  return digito > 9 ? "0" : String(digito);
};

validaCpf.prototype.isSequencia = function () {
  const sequencia = this.cpfLimpo[0].repeat(this.cpfLimpo.length);
  return sequencia === this.cpfLimpo;
};

function criaP() {
  const p = document.createElement("p");
  return p;
}

botao.addEventListener("click", function () {
  const cpfTexto = cpfTexto2.value;
  const cpf = new validaCpf(cpfTexto);
  const valido = document.querySelector(".valido");
  valido.innerHTML = "";
  if (cpf.valida()) {
    const p = criaP();
    p.innerHTML = "Cpf valido";
    valido.appendChild(p);
  } else {
    const p = criaP();

    p.innerHTML = "Cpf invalido";
    valido.appendChild(p);
  }
});
