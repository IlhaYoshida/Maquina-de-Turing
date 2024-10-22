const fs = require('fs');

class MaquinaDeTuring {
    constructor(config) {
        this.estados = config.transitions; 
        this.estadoInicial = config.initial; 
        this.estadosFinais = config.final; 
        this.fita = [];
        this.posicaoAtual = 0;
        this.estadoAtual = this.estadoInicial;
    }

    carregarFita(entrada) {
        this.fita = [...entrada.split(''), '_']; 
    }

    execucao() {
        const simboloAtual = this.fita[this.posicaoAtual];

        for (const transicao of this.estados) {
            if (transicao.from === this.estadoAtual && transicao.read === simboloAtual) {
                this.fita[this.posicaoAtual] = transicao.write;

                if (transicao.dir === 'R') {
                    this.posicaoAtual++;
                } else if (transicao.dir === 'L') {
                    this.posicaoAtual--;
                }

                this.estadoAtual = transicao.to;
                return true;
            }
        }
        return false;
    }

    run() {
        while (true) {
            if (this.estadosFinais.includes(this.estadoAtual)) {
                return true; 
            }
            if (!this.execucao()) {
                return false; 
            }
        }
    }
}

function carregarJSON(caminhoArquivo) {
    const data = fs.readFileSync(caminhoArquivo);
    return JSON.parse(data);
}

function main(arquivoJson, arquivoEntrada, arquivoSaida) {
    const config = carregarJSON(arquivoJson);
    const entrada = fs.readFileSync(arquivoEntrada, 'utf8').trim();

    const maquina = new MaquinaDeTuring(config);
    maquina.carregarFita(entrada);
    const aceito = maquina.run();

    fs.writeFileSync(arquivoSaida, maquina.fita.join('') + '\n');
    console.log(aceito ? 1 : 0);
}

if (require.main === module) {
    const [arquivoJson, arquivoEntrada, arquivoSaida] = process.argv.slice(2);
    
    if (!arquivoJson || !arquivoEntrada || !arquivoSaida) {
        console.error("Uso: node maquina_turing.js <config.json> <entrada.txt> <saida.txt>");
        process.exit(1);
    }
    
    main(arquivoJson, arquivoEntrada, arquivoSaida);
}


