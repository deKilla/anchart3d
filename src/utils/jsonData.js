class JsonData {

    constructor(file = "../src/data.json") {
        this.file = file;
        this.jsonText = this.getJsonText();
        this.parsedJson = this.getParsedJson();
        this.sums = this.getSums();
        this.percent = this.getPercent();
    }

        getJsonText(file = this.file)
        {
            var rawFile = new XMLHttpRequest();
            var rawText;
            rawFile.open("GET", file, false);
            rawFile.onreadystatechange = function ()
            {
                if(rawFile.readyState === 4)
                {
                    if(rawFile.status === 200 || rawFile.status == 0)
                    {
                        rawText = rawFile.responseText;
                    }
                }
            }
            rawFile.send(null);
            this.rawText = rawText;
            return this.rawText;
        }

        getParsedJson(file = this.file){
            this.parsedJson = JSON.parse(this.jsonText);
            return this.parsedJson;
        }

        getSums() {
            var sums = [];
            for (var i = 0; i < this.parsedJson[0].values.length; i++) {
                this.parsedJson.reduce(function(t,cv) {
                    if (sums[cv.values[i].name]) {
                        sums[cv.values[i].name] += cv.values[i].value;
                    } else {
                        sums[cv.values[i].name] = cv.values[i].value;
                    }
                }, {});
            }
            this.sums = sums;
            return this.sums;
        }

        getPercent() {
            let percentjson = this.parsedJson;
            let sums = this.sums;
            for (var elements in percentjson) {
                var values = percentjson[elements].values;
                for (var value in values) {

                    var total = sums[values[value].name];
                    var percent = values[value].value/(total/100);

                    //set calculated percent and total to the corresponding dataset
                    percentjson[elements].values[value]["percent"] = percent;
                    percentjson[elements].values[value]["total"] = total;
                }
            }
            this.percentjson = percentjson;
            return this.percentjson;
        }

}


//export {JsonData}