/**
 * @author Amar Bajric (https://github.com/amarbajric)
 * @author Michael Fuchs (https://github.com/deKilla)
 * @author Timo Hasenbichler (https://github.com/timoooo)
 */

class JsonData {

    constructor(file) {
        this.file = file;
        this.init = this.initFile();
    }

    /**
     * Initializes all steps, which need to be done, for the json with the data!
     * 1.) Check consistency of json structure and correct property names!
     * 2.) Calculate sum(s) and percentage of datasets
     */
    initFile() {
        this.checkJsonStruc();
        this.getPercent(); //already calls getSums()
        return this.init;
    }

    /**
     * •Checks if json has consistent naming convention for property key names.
     * •Checks consistency of data entries (one or two...must be same for each dataset).
     * •Checks consistency of property value names of each data entry (crucial for getSums() function)
     */
    checkJsonStruc() {
        let datasetCount = 0;
        let data1Name, data2Name;
        for(let x = 0; x < Object.keys(this.file).length; x++){
            if(x === 0) datasetCount = Object.keys(this.file[x].values).length;

            if(!this.file[x].hasOwnProperty("name") || !this.file[x].hasOwnProperty("values")){
                throw "ParseError: Structure of Json not valid!\nDataset number \"" + (x+1) +"\" has an inconsistent property name!";
            }

            else if(Object.keys(this.file[x].values).length !== datasetCount){
                throw "DataCountError: Inconsistent number of data entries found for different datasets!\n"
                + "Number of data entries in first dataset: " + datasetCount + "\nNumber of data entries found in dataset \"" + this.file[x].name +"\": " + this.file[x].values.length;
            }

            for(let i = 0; i < Object.keys(this.file[x].values).length; i++){
                if(x === 0 && i === 0){
                    data1Name = this.file[x].values[i].name;
                    if(datasetCount > 1) data2Name = this.file[x].values[i+1].name;
                }
                if(!this.file[x].values[i].hasOwnProperty("name") || !this.file[x].values[i].hasOwnProperty("value")){
                    throw "ParseError: Structure of Json not valid!\nDataset with name \"" + this.file[x].name
                        +"\" has an inconsistent property name in a data entry!";
                }
                else{
                    if(i === 0 && this.file[x].values[i].name !== data1Name)
                        throw "NamingError: Data entry \"" + this.file[x].values[i].name + "\" in dataset \"" + this.file[x].name +"\" does not equal \"" + data1Name + "\"!";
                    else if(i === 1 && this.file[x].values[i].name !== data2Name)
                        throw "NamingError: Data entry \"" + this.file[x].values[i].name + "\" in dataset \"" + this.file[x].name +"\" does not equal \"" + data2Name + "\"!";
                }
            }
        }
    }


    getSums() {
        let sums = [];
        for (let i = 0; i < this.file[0].values.length; i++) {
            this.file.reduce(function (t, cv) {
                if (sums[cv.values[i].name]) {
                    sums[cv.values[i].name] += cv.values[i].value;
                } else {
                    sums[cv.values[i].name] = cv.values[i].value;
                }
            }, {});
        }
        return sums;
    }

    /**
     * Does not need to return object as JavaScript does pass OBJECTS by reference IF it is saved under a variable!!
     * See link for more info: http://stackoverflow.com/a/6605700/4809932
     */
    getPercent() {
        let sums = this.getSums();
        for (let elements = 0; elements < Object.keys(this.file).length; elements++) {
            let values = this.file[elements].values;
            for (let value = 0; value < values.length; value++) {
                let total = sums[values[value].name];
                //set calculated percent and total to the corresponding dataset
                this.file[elements].values[value]["percent"] = values[value].value / (total / 100);
                this.file[elements].values[value]["total"] = total;
            }
        }
    }


    sortData(sortBy){
        if(sortBy && typeof sortBy === "string"){
            if(sortBy === "data1") this.file.sort(function(a,b){return a.values[0].value - b.values[0].value});
            else if(sortBy === "data2") this.file.sort(function(a,b){return a.values[1].value - b.values[1].value});
            return new JsonData(this.file);
        }
        else{
            console.error("Wrong type of argument passed for sorting data!\nType found: " + typeof sortBy + ".\nType required: \"string\".");
        }

    }
}


export default JsonData