class Controlador{
    constructor(){};
    init(){
        document.addEventListener('DOMContentLoaded', () => {
            let elems = document.querySelectorAll('.chips');
            M.Chips.init(elems);
        });
    }

    getElementChipByTag(tagName){
        var indexTag = undefined;
        for(let i = 0; i < this.chips.length; i++){
            let name = this.chips[i].tag;
            if(tagName == name){
                indexTag = i;
            }
        }
        return this.instance.$chips[indexTag];
    }

    get instance(){
        const chips = document.querySelectorAll('#chips');
        let instance = chips[0].M_Chips;
        return instance;
    }

    get chips(){
        let chips = this.instance.chipsData;
        return chips;
    }
}