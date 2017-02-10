

var app = new Vue({
    el: '#pipeline',
    // Valores usados na view e nos cálculos do pipeline
    data: {
        newTodoText: '',
        i: 0,
        begin: 0,
        op: '',
        ind : 0,
        index: 0,
        addI: 1, multI: 1, divI: 1, multD: 7, divD: 20, addD: 4,
        rt: -1, rs: -1, rd: -1,
        selected: 0,
        fowarding: false,
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
        'DIV.D'],

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
            {id:0, type: 'FLOAT',operation: 'L.D', rt: 0, rs: -1, rd: 1},
            {id:1, type: 'FLOAT',operation: 'L.D', rt: 2, rs: -1, rd: 2},
            {id:2, type: 'FLOAT',operation: 'MULT.D', rt: 0, rs: 0, rd: 2},
            {id:3, type: 'FLOAT',operation: 'ADD.D', rt: 1, rs: 0, rd: 1},
            {id:4, type: 'INTEGER',operation: 'DADDUI', rt: 1, rs: -1, rd: 1},
            {id:5, type: 'INTEGER',operation: 'DADDUI', rt: 2, rs: -1, rd: 2},
            {id:6, type: 'INTEGER',operation: 'SUB', rt: 4, rs: 3, rd: 1},
        //{id:7, type: 'INTEGER',operation: 'BNZ', rt: 0, rs: -1, rd: -1}
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
                r: [
                {id: 0, name:"R1", readyAt: -1},
                {id: 1, name:"R2", readyAt: -1},
                {id: 2, name:"R3", readyAt: -1},
                {id: 3, name:"R4", readyAt: -1},
                {id: 4, name:"R5", readyAt: -1},
                {id: 5, name:"R6", readyAt: -1},
                {id: 6, name:"R7", readyAt: -1},
                {id: 7, name:"R8", readyAt: -1},
                {id: 8, name:"R9", readyAt: -1},
                {id: 9, name:"R10", readyAt: -1},
                {id: 10, name:"R11", readyAt: -1},
                {id: 11, name:"R12", readyAt: -1},
                {id: 12, name:"R13", readyAt: -1}

                ],

        /*
            Vetor que contem os registradores float

            f é:
                id: 0 a 15
                name: F0 até F30
                readyAt: valor que representa em qual ciclo o registrador poderá ser usado (-1 pode ser usado)
                */
                f: [
                {id: 0, name:"F0", readyAt: -1},
                {id: 1, name:"F2", readyAt: -1},
                {id: 2, name:"F4", readyAt: -1},
                {id: 3, name:"F6", readyAt: -1},
                {id: 4, name:"F8", readyAt: -1},
                {id: 5, name:"F10", readyAt: -1},
                {id: 6, name:"F12", readyAt: -1},
                {id: 7, name:"F14", readyAt: -1},
                {id: 8, name:"F16", readyAt: -1},
                {id: 9, name:"F18", readyAt: -1},
                {id: 10, name:"F20", readyAt: -1}
                ],
                pipeline: []

            },
            methods: {
        //Método que insere uma instrução no vetor data.instructions
        insertInstruction: function() {
            this.instructions.push({id: this.instructions.length,
                type: this.selected,
                operation:this.op,
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
            for(var i = 0; i < inst.length; i++) {
                switch(inst[i].operation) {
                    case 'SUB':


                    case 'LD':
                    case 'DADDUI':
                    case 'SUBI':
                    case 'SW':
                        //Executa a instrução com valor default de 1
                        executaInstrucao(1,inicio,stall,registersInt,inst[i],pipe,this.fowarding)
                        break;
                        case 'ADD':
                        executaInstrucao(this.addI,inicio,stall,registersInt,inst[i],pipe,this.fowarding)
                        break;
                        case 'DIV':
                        executaInstrucao(this.divI,inicio,stall,registersInt,inst[i],pipe,this.fowarding)
                        break;
                        case 'MULT':
                        executaInstrucao(this.multI,inicio,stall,registersInt,inst[i],pipe,this.fowarding)
                        break;
                        case 'ADD.D':
                        executaInstrucao(this.addD,inicio,stall,registersFloat,inst[i],pipe,this.fowarding)
                        break;
                        case 'MULT.D':
                        executaInstrucao(this.multD,inicio,stall,registersFloat,inst[i],pipe,this.fowarding)
                        break;
                        case 'L.D':
                        executaInstrucaoLS(1,inicio,stall,registersFloat,registersInt,inst[i],pipe,this.fowarding)

                        break;


                    }

                    inicio = pipe[i].f

                }
                console.log("fowaaaaarding", this.fowarding)
                printTable(pipe,stall)
                this.stalls = stall
            },

            resetReg: function() {
                for (i = 0 ; i < this.r.length; i++) {
                    this.r[i].readyAt = -1
                }
                for (i = 0 ; i < this.f.length; i++) {
                    this.f[i].readyAt = -1
                }

                this.stalls = []
                this.pipeline = []
            },
            resetAll : function() {
                this.resetReg()
                this.instructions = []
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


function checkStall (pos, stalls) {

    if(findValue(pos,stalls) < 0) {
        return pos
    }
    return checkStall(pos+1,stalls)
}

function insertStall (pos, vetor, inst) {
    ////console.log("INSERT")
    if (findValue(pos,vetor) < 0) {
        vetor.push({
            pos: pos,
            inst: inst
        })
    }
}

function findValue (value,array) {
    ////console.log("PROCURA")
    for (i = 0; i < array.length; i++) {
        if (array[i].pos == value) {
            return i
        }
    }
    return -1
}

function maiorValor (pipeline) {
    var maior = 0
    for (var i = 0; i < pipeline.length; i++) {
        if (pipeline[i].w > maior)
            maior = pipeline[i].w
    }

    return maior;
}

//Função que executa todas as instruções menos
function executaInstrucao(cycleTime,inicio,stalls,registers,instrucao,pipeline,fowarding) {
    var f,d,ex,m,w = -1
    f = checkStall(inicio+1,stalls)
    
    /*
        Checa se registrador não é offset ou inteiro
        e se o primeiro registrador está liberado pra uso
        */
        if (instrucao.operation != 'BEQ' && instrucao.operation != 'BNZ') {
            id = checkStall(f+1,stalls)
            id_aux = id
            if (instrucao.rs != -1 && registers[instrucao.rs].readyAt > id_aux ){

        //registrador não está liberado, precisa inserir stall até que esteje
        do {
            id_aux= id_aux+1
            insertStall(id_aux,stalls,instrucao.id)
        } while (id_aux < registers[instrucao.rs].readyAt)

    }

    /*
        Checa se o segundo registrador é offset ou inteiro
        se não verifica se está pronto pra uso
        */
        if (instrucao.rd != -1 && registers[instrucao.rd].readyAt > id_aux){
            do {
                id_aux= id_aux+1
                insertStall(id_aux,stalls, instrucao.id)

            } while (id_aux < registers[instrucao.rd].readyAt)
        }
    } else if(instrucao.operation != 'BEQ') { 
        id_aux = f

    }
    ex = id_aux + 1
    m = ex + cycleTime
    w = m + 1
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
    console.log(f,id,ex,m,w, " INICIO ", inicio )

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

function executaInstrucaoLS(cycleTime,inicio,stalls,registersFloat,registersInt,instrucao,pipeline,fowarding) {
    var f,d,ex,m,w = -1
    f = checkStall(inicio+1,stalls)
    id = checkStall(f+1,stalls)
    id_aux = id


    //Se o registrador RS for -1 a instrução é de Load ou Store
    //e o registrador rs será inteiro ao invés de flaot
    if (registersInt[instrucao.rd].readyAt > id_aux){
        //aqui tem que adicionar no vetor stalls
        do {
            id_aux= id_aux+1
            insertStall(id_aux,stalls, instrucao.id)

        } while (id_aux < registersInt[instrucao.rd].readyAt)
    }

    for (var i = 0; i < stalls.length; i++ ) {
        //console.log(stalls[i].pos)
    }

    ex = id_aux + 1
    m = ex + cycleTime
    w = m + 1
    if (fowarding == 1) {

        registersFloat[instrucao.rt].readyAt = m

    } else {
        registersFloat[instrucao.rt].readyAt = w
    }
    console.log(f,id,ex,m,w, "INIC")
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
function printTable(pipeline,stalls) {
    var table = document.getElementById("pipeline-table")
    var value = ""
    var x = 0
    while ( table.rows.length > 0 )
    {
      table.deleteRow(0);
  }

  var row = table.insertRow(0)
  for (var k = 0; k < maiorValor(pipeline); k++) {
    row.insertCell(k).innerHTML = k+1
}
for (var i = 0; i < pipeline.length; i ++) {
        //console.log("insere linha")
        row = table.insertRow(i+1)
        //console.log("valooooooooooor do W", pipeline[i].w)

        for (var j = 1; j <= pipeline[i].w; j++) {
            tableValue = j - 1
            while( j < pipeline[i].f) {
                row.insertCell(tableValue).innerHTML = " - "
                tableValue = j
                j = j + 1

            }
            if (j == pipeline[i].f) {
                //console.log("IF: ",pipeline[i].f)
                row.insertCell(tableValue).innerHTML = " IF "
            }
            else if (j == pipeline[i].id) {
                //console.log("ID: 	",pipeline[i].id)
                row.insertCell(tableValue).innerHTML = " ID "
            }
            else if (j == pipeline[i].ex) {
                //console.log("EX: ",pipeline[i].ex)
                for (;j < pipeline[i].m;j++) {
                    //console.log(j)
                    row.insertCell(tableValue).innerHTML = " EX"
                }
                j = j - 1
            }
            else if (j == pipeline[i].m) {
                //console.log("M: ",pipeline[i].m)
                row.insertCell(tableValue).innerHTML = " M "
            }

            else if (j == pipeline[i].w) {
                //console.log("W: ",pipeline[i].w)
                row.insertCell(tableValue).innerHTML = " W "
            }

            else {
                row.insertCell(tableValue).innerHTML = " S "
            }

        }

    }
}


