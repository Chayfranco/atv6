const fs = require('fs');
const os = require('os');
const process = require('process');
const pidusage = require('pidusage');
const { performance } = require('perf_hooks');

// Função Heap Sort
function heapSort(arr) {
    const n = arr.length;

    // Função para ajustar o heap
    function heapify(arr, n, i) {
        let largest = i; // Inicializa o maior como raiz
        const left = 2 * i + 1; // Filho esquerdo
        const right = 2 * i + 2; // Filho direito

        // Se o filho esquerdo é maior que a raiz
        if (left < n && arr[left] > arr[largest]) {
            largest = left;
        }

        // Se o filho direito é maior que o maior atual
        if (right < n && arr[right] > arr[largest]) {
            largest = right;
        }

        // Se o maior não for a raiz
        if (largest !== i) {
            [arr[i], arr[largest]] = [arr[largest], arr[i]]; // Troca

            // Recursivamente ajusta o sub-heap afetado
            heapify(arr, n, largest);
        }
    }

    // Constrói o heap (reorganiza o array)
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        heapify(arr, n, i);
    }

    // Extrai os elementos do heap
    for (let i = n - 1; i > 0; i--) {
        [arr[0], arr[i]] = [arr[i], arr[0]]; // Move a raiz para o fim
        heapify(arr, i, 0); // Chama o heapify no heap reduzido
    }

    return arr;
}

// Função para ler o arquivo e medir desempenho
function processarArquivoHeapSort(nomeArquivo) {
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

        // Ordena os números usando o Heap Sort
        const numerosOrdenados = heapSort(numeros);
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

    // Processa o arquivo com Heap Sort
    processarArquivoHeapSort(nomeArquivo);
}

main();
