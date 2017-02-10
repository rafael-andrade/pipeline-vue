var app = new Vue({
    el: '#pipeline',
    // Valores usados na view e nos cálculos do pipeline
    data: {
        newTodoText: '',
        i: 0,
        begin: 0,
        op: '',
        ind: 0,
        index: 0,
        addI: 1,
        multI: 1,
        divI: 1,
        multD: 7,
        divD: 20,
        addD: 4,
        rt: -1,
        rs: -1,
        rd: -1,
        selected: 0,
        fowarding: 0,
        types: [
            'INTEGER',
            'FLOAT'
        ],

        //Vetor com todas opeações inteiras possíveis
        operationsInt: [
            'LW',
            'SW',
            'ADD',
            'DADDUI',
            'SUBI',
            'SUB',
            'MULT',
            'DIV',
            'BEQ',
            'BNZ'
        ],

        // Vetor com todas operações float possíveis
        operationsFloat: [
            'L.D',
            'S.D',
            'ADD.D',
            'SUB.D',
            'MULT.D',
            'DIV.D'
        ],

        //Vetor que armazena todas as instruções
        /* Instrução contém:
            id: inteiro;
            type: {"FLOAT" ou "INTEGER"}
            operation {"operationsInt" ou "operationsFloat"}
            rt: registrador destino
            rs: primeiro registrador
            rd: segundo registrador
            */
        instructions: [

            /* Exemplo do slide 
            {
                id: 0,
                type: 'FLOAT',
                operation: 'L.D',
                rt: 0,
                rs: -1,
                rd: 1
            },
            {
                id: 1,
                type: 'FLOAT',
                operation: 'L.D',
                rt: 2,
                rs: -1,
                rd: 2
            },
            {
                id: 2,
                type: 'FLOAT',
                operation: 'MULT.D',
                rt: 0,
                rs: 0,
                rd: 2
            },
            {
                id: 3,
                type: 'FLOAT',
                operation: 'ADD.D',
                rt: 1,
                rs: 0,
                rd: 1
            },
            {
                id: 4,
                type: 'INTEGER',
                operation: 'DADDUI',
                rt: 1,
                rs: -1,
                rd: 1
            },
            {
                id: 5,
                type: 'INTEGER',
                operation: 'DADDUI',
                rt: 2,
                rs: -1,
                rd: 2
            },
            {
                id: 6,
                type: 'INTEGER',
                operation: 'SUB',
                rt: 4,
                rs: 3,
                rd: 1
            },
            {
                id: 7,
                type: 'INTEGER',
                operation: 'BNZ',
                rt: 4,
                rs: -1,
                rd: -1
            } */
        ],

        //Vetor que armazena stall
        /*
            Stall contém:
                pos: posição do stall,
                inst: id da instrução que começou o stall

                */
        stalls: [],

        /*
            Vetor que contem os registradores inteiros
            r é:
                id: 0 a 31
                name: R1 até R32
                readyAt: valor que representa em qual ciclo o registrador poderá ser usado (-1 pode ser usado)
                */
        r: [{
                id: 0,
                name: "R1",
                readyAt: -1
            },
            {
                id: 1,
                name: "R2",
                readyAt: -1
            },
            {
                id: 2,
                name: "R3",
                readyAt: -1
            },
            {
                id: 3,
                name: "R4",
                readyAt: -1
            },
            {
                id: 4,
                name: "R5",
                readyAt: -1
            },
            {
                id: 5,
                name: "R6",
                readyAt: -1
            },
            {
                id: 6,
                name: "R7",
                readyAt: -1
            },
            {
                id: 7,
                name: "R8",
                readyAt: -1
            },
            {
                id: 8,
                name: "R9",
                readyAt: -1
            },
            {
                id: 9,
                name: "R10",
                readyAt: -1
            },
            {
                id: 10,
                name: "R11",
                readyAt: -1
            },
            {
                id: 11,
                name: "R12",
                readyAt: -1
            },
            {
                id: 12,
                name: "R13",
                readyAt: -1
            }

        ],

        /*
            Vetor que contem os registradores float

            f é:
                id: 0 a 15
                name: F0 até F30
                readyAt: valor que representa em qual ciclo o registrador poderá ser usado (-1 pode ser usado)
                */
        f: [{
                id: 0,
                name: "F0",
                readyAt: -1
            },
            {
                id: 1,
                name: "F2",
                readyAt: -1
            },
            {
                id: 2,
                name: "F4",
                readyAt: -1
            },
            {
                id: 3,
                name: "F6",
                readyAt: -1
            },
            {
                id: 4,
                name: "F8",
                readyAt: -1
            },
            {
                id: 5,
                name: "F10",
                readyAt: -1
            },
            {
                id: 6,
                name: "F12",
                readyAt: -1
            },
            {
                id: 7,
                name: "F14",
                readyAt: -1
            },
            {
                id: 8,
                name: "F16",
                readyAt: -1
            },
            {
                id: 9,
                name: "F18",
                readyAt: -1
            },
            {
                id: 10,
                name: "F20",
                readyAt: -1
            }
        ],
        pipeline: [],
        csv: ""

    },
    methods: {
        //Método que insere uma instrução no vetor data.instructions
        insertInstruction: function() {
            this.instructions.push({
                id: this.instructions.length,
                type: this.selected,
                operation: this.op,
                rt: this.rt,
                rs: this.rs,
                rd: this.rd
            })
        },
        //Executa operação usando ou não fowarding
        //Necessita alteração - FOWARDING SERÁ definido
        executarNoFowarding: function() {
            this.resetReg()
            //console.log("entrou no metodo")
            var inst = this.instructions
            var pipe = this.pipeline
            var inicio = this.begin
            var registersInt = this.r
            var registersFloat = this.f
            stall = this.stalls


            //Faz a execução de todas as instruções
            for (var i = 0; i < inst.length; i++) {
                switch (inst[i].operation) {
                    case 'SUB':
                    case 'LW':
                    case 'DADDUI':
                    case 'SUBI':
                    case 'SW':
                        //Executa a instrução com valor default de 1
                        executaInstrucao(1, inicio, stall, registersInt, inst[i], pipe, this.fowarding);
                        break;
                    case 'ADD':
                        executaInstrucao(this.addI, inicio, stall, registersInt, inst[i], pipe, this.fowarding)
                        break;
                    case 'DIV':
                        executaInstrucao(this.divI, inicio, stall, registersInt, inst[i], pipe, this.fowarding)
                        break;
                    case 'MULT':
                        executaInstrucao(this.multI, inicio, stall, registersInt, inst[i], pipe, this.fowarding)
                        break;
                    case 'ADD.D':
                        executaInstrucao(this.addD, inicio, stall, registersFloat, inst[i], pipe, this.fowarding)
                        break;
                    case 'MULT.D':
                        executaInstrucao(this.multD, inicio, stall, registersFloat, inst[i], pipe, this.fowarding)
                        break;
                    case 'L.D':
                        executaInstrucaoLS(1, inicio, stall, registersFloat, registersInt, inst[i], pipe, this.fowarding)
                        break;
                    case 'BNZ':
                    case 'BEQ':
                        executaInstrucaoBNZorBEQ(1, inicio, stall, registersInt, inst[i], pipe, this.fowarding)
                        break;
                }

                inicio = pipe[i].f

            }
            console.log("fowaaaaarding", this.fowarding)
            this.csv = printTable(pipe, stall, registersInt, registersFloat)
            this.stalls = stall
        },

        resetReg: function() {
            for (i = 0; i < this.r.length; i++) {
                this.r[i].readyAt = -1
            }
            for (i = 0; i < this.f.length; i++) {
                this.f[i].readyAt = -1
            }

            this.stalls = []
            this.pipeline = []
        },
        resetAll: function() {
            this.resetReg()
            this.instructions = []
        },
        download: function() {
            download(this.csv, "pipeline.csv", "text/plain")
        }


    }

})
/*
function checkStall (valor, vetor) {
    if(!vetor.includes(valor)) {
        return valor
    }
    return checkStall(valor+1,vetor)
}

function insertStall (valor, vetor) {
    if (!vetor.includes(valor)) {
        vetor = vetor.push(valor)
    }
}

*/


function checkStall(pos, stalls) {

    if (findValue(pos, stalls) < 0) {
        return pos
    }
    return checkStall(pos + 1, stalls)
}

function insertStall(pos, vetor, inst) {
    ////console.log("INSERT")
    if (findValue(pos, vetor) < 0) {
        vetor.push({
            pos: pos,
            inst: inst
        })
    }
}

function findValue(value, array) {
    ////console.log("PROCURA")
    for (i = 0; i < array.length; i++) {
        if (array[i].pos == value) {
            return i
        }
    }
    return -1
}

function maiorValor(pipeline) {
    var maior = 0
    for (var i = 0; i < pipeline.length; i++) {
        if (pipeline[i].w > maior)
            maior = pipeline[i].w
    }

    return maior;
}

//Função que executa todas as instruções menos
function executaInstrucao(cycleTime, inicio, stalls, registers, instrucao, pipeline, fowarding) {
    var f, d, ex, m, w = -1
    f = checkStall(inicio + 1, stalls)

    /*
        Checa se registrador não é offset ou inteiro
        e se o primeiro registrador está liberado pra uso
        */
    id = checkStall(f + 1, stalls)
    id_aux = id

    if (instrucao.rs != -1 && registers[instrucao.rs].readyAt > id_aux) {

        //registrador não está liberado, precisa inserir stall até que esteje
        do {
            id_aux = id_aux + 1
            insertStall(id_aux, stalls, instrucao.id)
        } while (id_aux < registers[instrucao.rs].readyAt)

    }

    /*
        Checa se o segundo registrador é offset ou inteiro
        se não verifica se está pronto pra uso
        */
    if (instrucao.rd != -1 && registers[instrucao.rd].readyAt > id_aux) {
        do {
            id_aux = id_aux + 1
            insertStall(id_aux, stalls, instrucao.id)

        } while (id_aux < registers[instrucao.rd].readyAt)
    }

    ex = id_aux + 1
    m = checkStall(ex + cycleTime, stalls)
    w = checkStall(m + 1, stalls)
    if (fowarding == 1) {
        switch (instrucao.operation) {
            //Nas operações de Load e Store o valor só fica pronto no fowarding após a leitura da memória
            case 'LD':
            case 'SW':
                registers[instrucao.rt].readyAt = m
                break;

                //Nas demais operações o operador fica pronto logo após a execução
                //Então, dependendo da stall eu acho que não funciona , precisava achar um contra exemplo =(
            default:
                registers[instrucao.rt].readyAt = m - 1
                break;
        }

    }
    //Sem fowarding sempre ficará pronto depois do write (W)
    else {
        registers[instrucao.rt].readyAt = w
    }
    inicio = f
    console.log(f, id, ex, m, w, " INICIO ", inicio)

    //Insere as informações no pipeline
    pipeline.push({
        inst: instrucao,
        f: f,
        id: id,
        ex: ex,
        m: m,
        w: w
    })
}

/*

Mas porque outra função ? 

O load e o store usam registradores float e inteiros
logo precisamos passar ambos como parametros

dá pra refatorar ? Sim mas fazemos isso na próxima oportunidade    
*/

function executaInstrucaoLS(cycleTime, inicio, stalls, registersFloat, registersInt, instrucao, pipeline, fowarding) {
    var f, d, ex, m, w = -1
    f = checkStall(inicio + 1, stalls)
    id = checkStall(f + 1, stalls)
    id_aux = id


    //Se o registrador RS for -1 a instrução é de Load ou Store
    //e o registrador rs será inteiro ao invés de flaot
    if (registersInt[instrucao.rd].readyAt > id_aux) {
        //aqui tem que adicionar no vetor stalls
        do {
            id_aux = id_aux + 1
            insertStall(id_aux, stalls, instrucao.id)

        } while (id_aux < registersInt[instrucao.rd].readyAt)
    }
    ex = id_aux + 1
    m = checkStall(ex + cycleTime, stalls)
    w = checkStall(m + 1, stalls)
    if (fowarding == 1) {

        registersFloat[instrucao.rt].readyAt = m

    } else {
        registersFloat[instrucao.rt].readyAt = w
    }
    console.log(f, id, ex, m, w, "INIC")
    pipeline.push({
        inst: instrucao,
        f: f,
        id: id,
        ex: ex,
        m: m,
        w: w
    })
    //console.log("vetor de bolha",stalls)
}

function executaInstrucaoBNZorBEQ(cycleTime, inicio, stalls, registers, instrucao, pipeline, fowarding) {

    console.log("exucutando " , instrucao.rd)
    var f, d, ex, m, w = -1 
    f = checkStall(inicio + 1, stalls)

    id_aux = f


    //Se o registrador RS for -1 a instrução é de Load ou Store
    //e o registrador rs será inteiro ao invés de flaot
    if (registers[instrucao.rt].readyAt > id_aux) {
        //aqui tem que adicionar no vetor stalls
        do {
            id_aux = id_aux + 1
            insertStall(id_aux, stalls, instrucao.id)

        } while (id_aux < registers[instrucao.rt].readyAt)
    }

    if (instrucao.rd != -1 && registers[instrucao.rd].readyAt > id_aux) {
        //aqui tem que adicionar no vetor stalls
        do {
            id_aux = id_aux + 1
            insertStall(id_aux, stalls, instrucao.id)
        } while (id_aux < registers[instrucao.rd].readyAt)
    }

    console.log("exucutando " , instrucao.rd)
    if(id_aux == f) {
       id = id_aux + 1
    } else {
        id = id_aux
    }
    
    ex = checkStall(id + 1, stalls)
    m = checkStall(ex + cycleTime, stalls)
    w = checkStall(m + 1, stalls)
    if (fowarding == 1) {
        registers[instrucao.rt].readyAt = ex + cycleTime

    } else {
        registers[instrucao.rt].readyAt = m
    }
    console.log(id_aux, f, id, ex, m, w, "INIC")
    pipeline.push({
        inst: instrucao,
        f: f,
        id: id,
        ex: ex,
        m: m,
        w: w
    })
    //console.log("vetor de bolha",stalls)
}

//Imprime a table
function printTable(pipeline, stalls, registersInt, registersFloat) {
    var table = document.getElementById("pipeline-table")
    var value = ""
    var x = 0
    var csv = ""
    while (table.rows.length > 0) {
        table.deleteRow(0);
    }


    var row = table.insertRow(0)
    for (var k = 0; k < maiorValor(pipeline); k++) {
        row.insertCell(k).innerHTML = k + 1
    }
    for (var i = 0; i < pipeline.length; i++) {

        console.log("AQUI ESTÁ DANDO ERRO 1:", pipeline[i].inst.rd)
        csv = csv.concat(pipeline[i].inst.operation, ",")
        if (pipeline[i].inst.type == "INTEGER") {
            csv = csv.concat(registersInt[pipeline[i].inst.rt].name, ",")
            if (pipeline[i].inst.rs == -1) {
                csv = csv.concat("off,")
            } else {
                csv = csv.concat(registersInt[pipeline[i].inst.rs].name, ",")
            }
            if (pipeline[i].inst.rd == -1) {
                csv = csv.concat("off,")
            } else {
                console.log("AQUI ESTÁ DANDO ERRO 2:", pipeline[i].inst.rd)
                csv = csv.concat(registersInt[pipeline[i].inst.rd].name, ",")
            }
        } else {
            csv = csv.concat(registersFloat[pipeline[i].inst.rt].name, ",")
            if (pipeline[i].inst.rs == -1) {
                csv = csv.concat("off,")
            } else {
                csv = csv.concat(registersFloat[pipeline[i].inst.rs].name, ",")
            } if (pipeline[i].inst.rd == -1) {
                csv = csv.concat("off,")
            } else {
                 csv = csv.concat(registersFloat[pipeline[i].inst.rd].name, ",")
            }

        }
        row = table.insertRow(i + 1)
        for (var j = 1; j <= pipeline[i].w; j++) {
            tableValue = j - 1
            while (j < pipeline[i].f) {
                row.insertCell(tableValue).innerHTML = " - "
                csv = csv.concat(",")
                tableValue = j
                j = j + 1

            }
            if (j == pipeline[i].f) {
                //console.log("IF: ",pipeline[i].f)
                row.insertCell(tableValue).innerHTML = " IF "
                csv = csv.concat("if,")
            } else if (j == pipeline[i].id) {
                //console.log("ID:  ",pipeline[i].id)
                row.insertCell(tableValue).innerHTML = " ID "
                csv = csv.concat("id,")
            } else if (j == pipeline[i].ex) {
                //console.log("EX: ",pipeline[i].ex)
                for (; j < pipeline[i].m; j++) {
                    //console.log(j)
                    row.insertCell(tableValue).innerHTML = " EX"
                    csv = csv.concat("ex,")
                }
                j = j - 1
            } else if (j == pipeline[i].m) {
                //console.log("M: ",pipeline[i].m)
                row.insertCell(tableValue).innerHTML = " M "
                csv = csv.concat("m,")
            } else if (j == pipeline[i].w) {
                //console.log("W: ",pipeline[i].w)
                row.insertCell(tableValue).innerHTML = " W "
                csv = csv.concat("w,")
            } else {
                row.insertCell(tableValue).innerHTML = " S "
                csv = csv.concat("s,")
            }

        }

        csv = csv.concat("\n")

    }
    return csv
}

/*


CÓDIGO RETIRADO DO STACKOVERFLOW

LINK: http://stackoverflow.com/questions/21012580/is-it-possible-to-write-data-to-file-using-only-javascript

*/


function download(strData, strFileName, strMimeType) {
    var D = document,
        A = arguments,
        a = D.createElement("a"),
        d = A[0],
        n = A[1],
        t = A[2] || "text/plain";

    //build download link:
    a.href = "data:" + strMimeType + "charset=utf-8," + escape(strData);


    if (window.MSBlobBuilder) { // IE10
        var bb = new MSBlobBuilder();
        bb.append(strData);
        return navigator.msSaveBlob(bb, strFileName);
    } /* end if(window.MSBlobBuilder) */



    if ('download' in a) { //FF20, CH19
        a.setAttribute("download", n);
        a.innerHTML = "downloading...";
        D.body.appendChild(a);
        setTimeout(function() {
            var e = D.createEvent("MouseEvents");
            e.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            a.dispatchEvent(e);
            D.body.removeChild(a);
        }, 66);
        return true;
    }; /* end if('download' in a) */



    //do iframe dataURL download: (older W3)
    var f = D.createElement("iframe");
    D.body.appendChild(f);
    f.src = "data:" + (A[2] ? A[2] : "application/octet-stream") + (window.btoa ? ";base64" : "") + "," + (window.btoa ? window.btoa : escape)(strData);
    setTimeout(function() {
        D.body.removeChild(f);
    }, 333);
    return true;
}