const inputTarefa = document.querySelector(".input-tarefa");
const btnTarefa = document.querySelector(".btn-tarefa");
const tarefas = document.querySelector(".tarefas");

function criaLi() {
  const li = document.createElement("li");
  return li;
}

function limpa() {
  inputTarefa.value = "";
  inputTarefa.focus();
}
function criaTarefa(textoInput) {
  const li = criaLi();
  li.innerHTML = textoInput;
  tarefas.appendChild(li);
  criaBotaoApagar(li);
  salvaTarefa();
}

function criaBotaoApagar(li) {
  li.innerText += "     ";
  const apagar = document.createElement("button");
  apagar.setAttribute("class", "btn btn-primary apagar");
  apagar.innerText = "Apagar";
  li.appendChild(apagar);
}

inputTarefa.addEventListener("keypress", function (e) {
  if (e.keyCode === 13) {
    if (!inputTarefa.value) return;
    criaTarefa(inputTarefa.value);
    limpa();
  }
});
btnTarefa.addEventListener("click", function () {
  if (!inputTarefa.value) return;
  criaTarefa(inputTarefa.value);
  limpa();
});
document.addEventListener("click", function (e) {
  const el = e.target;
  if (el.classList.contains("apagar")) {
    el.parentElement.remove();
    salvaTarefa();
  }
});
function salvaTarefa() {
  const liTarefas = tarefas.querySelectorAll("li");
  const listaTarefas = [];
  for (let tarefa of liTarefas) {
    let tarefaTexto = tarefa.innerText;
    tarefaTexto = tarefaTexto.replace("Apagar", "").trim();
    listaTarefas.push(tarefaTexto);
  }
  const tarefaJSON = JSON.stringify(listaTarefas);
  localStorage.setItem("tarefas", tarefaJSON);
}

function adicionaTarefaSalva() {
  const tarefas = localStorage.getItem("tarefas");
  const listaTarefas = JSON.parse(tarefas);

  for (let tarefa of listaTarefas) {
    criaTarefa(tarefa);
  }
  console.log("tarefas");
}
adicionaTarefaSalva();
