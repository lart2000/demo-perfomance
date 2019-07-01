class Utils {
    removeAccents(s) {
        let r = s.toLowerCase();
        r = r.replace(new RegExp(/[àáâãäå]/g), "a");
        r = r.replace(new RegExp(/[èéêë]/g), "e");
        r = r.replace(new RegExp(/[ìíîï]/g), "i");
        r = r.replace(new RegExp(/[òóôõö]/g), "o");
        r = r.replace(new RegExp(/[ùúûü]/g), "u");
        return r;
    }

    getMonthNumberByName(name){
        name = this.removeAccents(name);
        let months = ["enero","febrero","marzo","abril","mayo","junio","julio",
                    "agosto","setiembre","octubre","noviembre","diciembre"];
        let number = "0";
        months.forEach((element,key) => {
            if (name === element){
                number += (key + 1).toString();
                return false;
            }
        });
        return number.slice(-2);
    }

    getStringToDatepicker(dateString){
        let parts = dateString.split("-");
        let months = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio",
                    "Agosto","Setiembre","Octubre","Noviembre","Diciembre"];

        return "" + parseInt(parts[2]) + " " + months[parseInt(parts[1] - 1)]+", "+parts[0];
    }

    clearExcessiveSpaces(txt){
        return txt.replace(/\s\s+/g, ' ');
    }

    clearArticlesString(arrTxt){
        let articles = ["el","la","las","lo","los","en","un","y","o","se","es","de"];
        return this.arrayDiff(arrTxt,articles).join(" ");
    }

    arrayDiff(mainArray,arrayDiff){
        return mainArray.filter(item =>{
            return arrayDiff.indexOf(item) == -1;
        });
    }
    // static isDiferent(prev,current){//recursive method for {{{{...{}...}}}}   //compare except {...[]...}
    //     for (const key in prev) {
    //         // if(prev instanceof Array&& prev[key] instanceof Array){
    //         //     if(!current.indexOf(key)) return true
    //         // }
    //         if (typeof prev[key]==="object"&&!(prev instanceof Array)){//prev[key]
    //             if(this.isDiferent(prev[key],current[key])) return true      //
    //         }else if (!(prev instanceof Array)&&prev.hasOwnProperty(key)&&current.hasOwnProperty(key)&&prev[key]!==current[key]) {
    //             return true
    //         }
    //     }

    //     return false
    // }
    static isDiferent(prev,current){//recursive method for {{{{...{}...}}}} compare except {...[]...}
        for (const key in prev) {
            if (typeof prev[key]==="object"){
                if(!(prev[key] instanceof Array)&&this.isDiferent(prev[key],current[key])) return true
            }else if (prev.hasOwnProperty(key)&&current[key]!==prev[key]) {
                return true
            }
        }

        return false
    }


}

export default Utils;
