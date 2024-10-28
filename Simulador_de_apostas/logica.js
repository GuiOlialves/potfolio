function iniciarSimulacao() {
    const numApostadores = parseInt(document.getElementById("numApostadores").value);
    const saldoInicial = parseFloat(document.getElementById("saldoInicial").value);
    const numRodadas = parseInt(document.getElementById("numRodadas").value);
    const porcCasa = parseFloat(document.getElementById("porcCasa").value) / 100;
    const porcApostador = parseFloat(document.getElementById("porcApostador").value) / 100;
    const apostaPorRodada = parseInt(document.getElementById("apostaPorRodada").value);
    /*const apostaPorRodada = 20;*/
    const resultados = simularApostas(numApostadores, saldoInicial, numRodadas, porcCasa, porcApostador, apostaPorRodada);
    renderizarGrafico(resultados);

    // Calcular total apostado e ganhos/perdas
    const totalApostado = numApostadores * saldoInicial;
    let saldoFinalJogadores = 0;
    resultados.forEach(saldos => {
        saldoFinalJogadores += saldos[saldos.length - 1];
       /* totalApostado += (saldos.length - 1) * apostaPorRodada;*/ // Total apostado por cada jogador
    });

    // O valor que ficou com a casa é o total apostado menos o saldo final dos jogadores
   /* const valorCasa = totalApostado - (saldoFinalJogadores - (numApostadores * saldoInicial));
    const valorJogadores = saldoFinalJogadores - (numApostadores * saldoInicial);*/
      const valorCasa = (saldoInicial* numApostadores) - saldoFinalJogadores  ;
    const valorJogadores = (numApostadores * saldoInicial) - valorCasa;

    // Exibição dos valores no resumo
    document.getElementById("totalApostado").textContent = `Total Apostado: R$ ${totalApostado.toFixed(2)}`;
    document.getElementById("valorCasa").textContent = `Valor que ficou com a Casa: R$ ${valorCasa.toFixed(2)}`;
    document.getElementById("valorJogadores").textContent = `Valor que ficou com os Jogadores: R$ ${valorJogadores.toFixed(2)}`;
}



function simularApostas(numApostadores, saldoInicial, numRodadas, porcCasa, porcApostador, apostaPorRodada) {
const resultados = [];

for (let i = 0; i < numApostadores; i++) {
    let saldo = saldoInicial;
    const saldos = [saldo];

    for (let j = 0; j < numRodadas; j++) {
        if (saldo <= 0) break; // Interromper se o saldo for zero ou negativo

        // Aposta uma porcentagem do saldo atual (ex: 5%)
        const apostaAtual = saldo * 0.05;

        const random = Math.random();
        if (random < porcApostador) {
            // Jogador ganha a aposta
            saldo += apostaAtual * 0.8; // Ganho de 80% sobre o valor apostado
        } else {
            // Jogador perde a aposta
            saldo -= apostaAtual;
        }

        saldos.push(saldo);
    }
    resultados.push(saldos);
}
return resultados;
}

    function renderizarGrafico(resultados) {
        const labels = Array.from({ length: resultados[0].length }, (_, i) => `Rodada ${i}`);

        const datasets = resultados.map((saldos, index) => ({
            label: `Apostador ${index + 1}`,
            data: saldos,
            borderColor: saldos[saldos.length - 1] > saldos[0] ? 'green' : 'red',
            fill: false,
        }));

        const ctx = document.getElementById("grafico").getContext("2d");

        new Chart(ctx, {
            type: 'line',
            data: { labels, datasets },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }