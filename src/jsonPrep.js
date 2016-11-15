/**
 * Created by Michael on 13.11.2016.
 */

//geht
//console.log(JSON.data1.values.length);
//geht auch
//console.log(JSON.data2.values[0].value1[0].value);

// TODO
// check if all data has the same amount of values (2 as of now)

// TODO
// sum up all values (alle value1s = 1st sum, all value2s = 2nd sum) of each data
// in this example we need sumV1 = 800 // sumV2 == 12

function getJsonText(file)
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                allText = rawFile.responseText;
            }
        }
    }
    rawFile.send(null);
    return allText;
}

let json = JSON.parse(getJsonText("../src/data.json"));

function calcsums(json) {
    var allsums = [];
    for (var i = 0; i < json[0].values.length; i++) {
        var r = json.reduce(function(t,cv,ci) {
            if (allsums[cv.values[i].name]) {
                allsums[cv.values[i].name] += cv.values[i].value;
            } else {
                allsums[cv.values[i].name] = cv.values[i].value;
            }
        }, {});
    }
    return allsums;
}

function calcpercent(json) {
    var output = ""; //temp
    var allsums = calcsums(json);
    var pp_ordered = [];
    for (var elements in json) {
        var values = json[elements].values;
        var gname = json[elements].name;
       
        for (var value in values) {
          
            var total = allsums[values[value].name];
            var currentval = values[value].value;
            var currentname = values[value].name; 
            
            var pp = currentval/(total/100);
            var pr = (currentval/(total/100)).toFixed(2);

            if (pp_ordered[values[value].name + "_" + gname]) {
                pp_ordered[values[value].name + "_" + gname] += pp;
            } else {
                pp_ordered[values[value].name + "_" + gname] = pp;
            }

            output = output.concat(genOutHTML(gname,total,currentval,currentname,pp,pr));
        }
    }
    
    //console.log(output);
    return output;

    //console.log(pp_ordered);
    //return pp_ordered;
    
}

//temp
function genOutHTML(gname,total,currentval,currentname,pp,pr) {
    var str_total = currentval + " (total: " + total + ")";
    var str_pp = "percent_precise: " + pp + "%";
    var str_rp = "percent_rounded: " + pr + "%";

    var singleout = "<h3>" + currentname + " " + gname + "</h3>" + str_total + "<br />" + str_pp + "<br />" + str_rp + "<br />"
    return singleout;
}

var html = calcpercent(json)
document.getElementById("pseudoconsole").innerHTML = html;

