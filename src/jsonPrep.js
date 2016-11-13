/**
 * Created by Michael on 13.11.2016.
 */

var JSON = { 
    "data1": {
        "values": [
            {"value1": [{
                "name":"Value1",
            	"value":200
                }]
            },
            {"value2": [{
                "name":"Value2",
            	"value":5
                }]
            }
        ]
    },
    "data2": {
        "values": [
            {"value1": [{
                "name":"Value1",
            	"value":500
                }]
            },
            {"value2": [{
                "name":"Value2",
            	"value":4
                }]
            }
        ]
    },
    "data3": {
        "values": [
            {"value1": [{
                "name":"Value1",
            	"value":100
                }]
            },
            {"value2": [{
                "name":"Value2",
            	"value":3
                }]
            }
        ]
    }
};

console.log(JSON.data1.values.length);
console.log(JSON.data2.values[0].value1[0].value);

