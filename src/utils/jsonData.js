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
     * 2.) Optionally sort data (if sorting was enabled in configuration)
     * 3.) Calculate sum(s) and percentage of datasets
     */
    initFile() {
        /*
        TODO: Check if json structure valid
        TODO: Implement sorting function to call optionally in Chart.js
         */
        this.getSums();
        this.getPercent();
        return this.init;
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
        for (let elements in this.file) {
            let values = this.file[elements].values;
            for (let value in values) {

                let total = sums[values[value].name];
                //set calculated percent and total to the corresponding dataset
                this.file[elements].values[value]["percent"] = values[value].value / (total / 100);
                this.file[elements].values[value]["total"] = total;
            }
        }
    }
}


export {JsonData}