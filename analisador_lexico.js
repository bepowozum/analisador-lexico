class AnalisadorLexico {
    globalState = 0;
    tableData = [];
    states = [[]];

    constructor(){
        this.tableData = [];
        this.states = [[]];
        this.chipsController = undefined;
    }

    init(){
        this.chipsController = new Controlador();
        this.chipsController.init();
        this.validation();
    }

    validation(){
        let input = document.getElementById('word');
        input.addEventListener('keyup', this.validationWords.bind(null,this), false);
    }

    validationWords($this){

        let chipsLength = $this.chipsController.chips.length;

        if (chipsLength > 0) {
            let word = document.getElementById('word').value.toLowerCase();
            let lines = document.querySelectorAll('tr');
            let columns = document.querySelectorAll('td');

            if (word.length == 0){
                lines.forEach((line)=> {line.classList.remove('line-foc')});
                columns.forEach((column) => {column.classList.remove('focus-column')});
            }

            let state = 0;
            
            let stateError = false;
            
            for (let i=0; i < word.length; i++) {
                let regularExpression = /([a-z_])/;

                if(regularExpression.test(word[i]) && stateError == false) {
                    $this.tableFocus(state, word[i], $this.tableData[state][word[i]]);
                    
                    if($this.tableData[state][word[i]] != '-') {
                        state = $this.tableData[state][word[i]];
                    } else { 
                        stateError = true;
                    }
                        } else if(word[i] == ' ' || word[i] == '/n') {
                            let elementChip = $this.chipsController.getElementChipByTag(word.replace(/^\s+|\s+$/g, ''));
                            
                            if(elementChip != undefined){
                                let input = document.getElementById('word');
                                input.value = '';
                                
                                AnalisadorLexico.removeFocus();
                                
                                $this.wordFocus(elementChip);
                            }
                        } 
            }
        }
    };

    wordState(){
        const chips = this.chipsController.chips;
        for (let i=0; i<chips.length; i++) {
            let currentState = 0;
            let word = chips[i].tag;

            for (let j=0; j<word.length; j++){
                if(typeof this.states[currentState][word[j]] === 'undefined'){

                    let nextState = this.globalState + 1;
                    this.states[currentState][word[j]] = nextState;
                    this.states[nextState] = [];
                    this.globalState = currentState = nextState;

                } else {
                    currentState = this.states[currentState][word[j]];
                }
    
                if(j == word.length - 1){
                    this.states[currentState]['finished'] = true;
                }
            }
        }
    };

    createTable(tableData){
        let tableBody = this.table.children[1];

        tableBody.innerHTML = ''

        for (let i=0; i < tableData.length; i++) {
            let tr = document.createElement('tr');
            let td = document.createElement('td');
            
            if (tableData[i]['finished']){
                td.innerText = 'q' + tableData[i]['state'] + '*';
            } else {
                td.innerText = 'q' + tableData[i]['state'];
            }

                td.classList.add('tem-sel');
                td.classList.add('center');
                td.classList.add('bCustom');
                tr.append(td);
                tr.classList.add('line_' + tableData[i]['state']);

                let firstLetter = 'a';
                let lastLetter = 'z';

                    for(let j = firstLetter.charCodeAt(0); j <= lastLetter.charCodeAt(0); j++) {
                        let char = String.fromCharCode(j);
                        let td = document.createElement('td');
                        
                        td.classList.add('column_'+char);
                        td.classList.add('center');

                        if(tableData[i][char] != '-'){
                            td.innerText = 'q' + tableData[i][char];
                            td.classList.add('tem-sel');
                        } else {
                            td.innerText = '-';
                            td.classList.add('bCustom');
                        }

                        tr.append(td);
                    }
                    tableBody.append(tr);
	    }
    }

    addLineTable(){
        let stateArray = [];
        for (let i=0; i < this.states.length; i++) {
            let aux = [];
            
            aux['state'] = i;

            let firstLetter = 'a';
            let lastLetter = 'z';

            for (var j=firstLetter.charCodeAt(0); j<=lastLetter.charCodeAt(0); j++) {
                let char = String.fromCharCode(j);
                if(typeof this.states[i][char] === 'undefined'){
                    aux[char] = '-';
                } else {
                    aux[char] = this.states[i][char];
                }
            }
            if (typeof this.states[i]['finished'] !== 'undefined'){
                aux['finished'] = true;
            }
            stateArray.push(aux);
        }

        return stateArray;
    }

    tableFocus(state, char, stateError){
        AnalisadorLexico.removeFocus();
        AnalisadorLexico.addFocus(state, char, stateError);
    };

    wordFocus(element){
        element.classList.add('word-founded');
    }

    static addFocus(state, char, stateError){
        let tableLine = document.querySelectorAll('.line_' + state);
        let tableColumn = document.querySelectorAll('.column_' + char);

        if (stateError == '-'){
            tableLine.forEach((line) => {line.classList.add('erro-column-foc')});
            tableColumn.forEach((column) => {column.classList.add('erro-column-foc')});
        } else {
            tableLine.forEach((line) => {line.classList.add('line-foc')});
            tableColumn.forEach((column) => {column.classList.add('focus-column')});
        }
    }

    static removeFocus() {
        let lines = document.querySelectorAll('tr');
        let columns = document.querySelectorAll('td');
        
        lines.forEach((line)=>{
            line.classList.remove('line-foc');
            line.classList.remove('erro-column-foc')
        });
        
        columns.forEach((column) => {
            column.classList.remove('focus-column');
            column.classList.remove('erro-column-foc');
        });
    }

    updateTable() {
        this.wordState();
        this.tableData = this.addLineTable();
        this.createTable(this.tableData);
    }

    get table() {
        const table = document.getElementById('tabela-lexica');
        return table;
    }
    
}