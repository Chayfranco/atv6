const fs = require('fs');
const os = require('os');
const process = require('process');
const pidusage = require('pidusage');
const { performance } = require('perf_hooks');

// Função Merge Sort
function mergeSort(arr) {
    if (arr.length <= 1) {
        return arr;
    }

    // Divide o array ao meio
    const meio = Math.floor(arr.length / 2);
    const esquerda = arr.slice(0, meio);
    const direita = arr.slice(meio);

    // Chama a recursão para cada metade e depois combina
    return merge(mergeSort(esquerda), mergeSort(direita));
}

// Função para combinar dois arrays ordenados
function merge(esquerda, direita) {
    const resultado = [];
    let i = 0, j = 0;

    // Combina os elementos das duas metades
    while (i < esquerda.length && j < direita.length) {
        if (esquerda[i] < direita[j]) {
            resultado.push(esquerda[i]);
            i++;
        } else {
            resultado.push(direita[j]);
            j++;
        }
    }

    // Adiciona os elementos restantes
    return resultado.concat(esquerda.slice(i)).concat(direita.slice(j));
}

// Função para ler o arquivo e medir desempenho
function processarArquivoMergeSort(nomeArquivo) {
    // Começa a medição de tempo
    const start = performance.now();

    fs.readFile(nomeArquivo, 'utf8', (err, data) => {
        if (err) {
            console.error("Erro ao ler o arquivo:", err);
            return;
        }

        // Converte o conteúdo do arquivo para uma lista de números
        const numeros = data.split(/\s+/).map(Number);
        console.log("Lista original:", numeros);

        // Ordena os números usando o Merge Sort
        const numerosOrdenados = mergeSort(numeros);
        console.log("Lista ordenada:", numerosOrdenados);

        // Para a medição de tempo
        const end = performance.now();
        const tempoExecucao = (end - start) / 1000; // Converte ms para segundos

        // Monitorando a memória do processo
        pidusage(process.pid, (err, stats) => {
            if (err) {
                console.error("Erro ao monitorar o uso de memória:", err);
                return;
            }

            console.log(`Tempo de execução: ${tempoExecucao.toFixed(2)} segundos`);
            console.log(`Memória utilizada pelo processo: ${(stats.memory / (1024 * 1024)).toFixed(2)} MB`);
        });
    });
}

// Função principal
function main() {
    const nomeArquivo = 'arq.txt';

    // Exibe informações do sistema
    const memoriaTotal = os.totalmem() / (1024 * 1024);
    console.log(`Memória total do sistema: ${memoriaTotal.toFixed(2)} MB`);

    // Processa o arquivo com Merge Sort
    processarArquivoMergeSort(nomeArquivo);
}

main();
