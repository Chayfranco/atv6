const fs = require('fs');
const os = require('os');
const process = require('process');
const pidusage = require('pidusage');
const { performance } = require('perf_hooks');

// Função Quick Sort
function quickSort(arr) {
    if (arr.length <= 1) {
        return arr;
    }

    const pivot = arr[arr.length - 1];  // Pivô é o último elemento
    const left = []; // Elementos menores que o pivô
    const right = []; // Elementos maiores ou iguais ao pivô

    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] < pivot) {
            left.push(arr[i]);
        } else {
            right.push(arr[i]);
        }
    }

    return [...quickSort(left), pivot, ...quickSort(right)];
}

// Função para ler o arquivo e medir desempenho
function processarArquivo(nomeArquivo) {
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

        // Ordena os números usando o Quick Sort
        const numerosOrdenados = quickSort(numeros);
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

    // Processa o arquivo
    processarArquivo(nomeArquivo);
}

main();
