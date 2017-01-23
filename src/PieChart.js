/**
 * @author Amar Bajric (https://github.com/amarbajric)
 * @author Michael Fuchs (https://github.com/deKilla)
 * @author Timo Hasenbichler (https://github.com/timoooo)
 */

import Chart from './Chart';
import Legend from './utils/Legend';
import {animateZ} from "./utils/animation";
var THREE = require('three');
THREE.orbitControls = require('three-orbit-controls')(THREE);


class PieChart {

    //TODO: maybe use object ...
    constructor(jsonData,sceneConfig,radius, angleStart, angleEnd) {

        this.jsonData = jsonData;
        this.sceneConfig = sceneConfig;
        this.radius = radius;
        this.angleStart = angleStart;
        this.angleEnd = angleEnd;
        this.object = this.create3DPieChart();

    }


    createSegment(radius, angleStart, angleEnd) {
        const extrudeOptions = {
            curveSegments: 50,
            steps: 1,
            amount: 1.0,
            bevelEnabled: false,
        };

        let shape = new THREE.Shape();
        shape.moveTo(0, 0);
        shape.absarc(0, 0, radius, angleStart, angleEnd, false); //false: to not go clockwise (otherwise it will fail)
        shape.lineTo(0, 0);
        let segmentGeom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
        let segmentMat = new THREE.MeshPhongMaterial({
            color: Math.random() * 0xffffff,
            shading: THREE.SmoothShading,
            shininess: 0.8,
        });

        return new THREE.Mesh(segmentGeom, segmentMat);
    }

    create3DPieChart(jsonData = this.jsonData) {
        //calculate percent of every data set in json first
        const calculatedData = jsonData.file;

        //Group together all pieces
        let pieChart = new THREE.Group();
        pieChart.name = "groupedChart";
        //define type of chart...necessary for live data swapping
        pieChart.chartType = "pieChart";
        //variable holds last position of the inserted segment of the pie
        let lastThetaStart = 0.0;
        let legendMap = new Map();
        //iterate over the jsonData and create for every data a new pie segment
        //data = one object in the json which holds the props "amount","percent" in this case.
        //TODO: I don't like this - needs review
        for (let dataset = 0; dataset < calculatedData.length; dataset++) {
            let values = calculatedData[dataset].values;
            let segment;
            for (let value = 0; value < values.length; value++) {
                //get first data set of the first object
                if (value == 0) {
                    let data1Name = values[value].name;
                    let data1Value = values[value].value;
                    let data1Percent = values[value].percent;

                    //call function which creates one segment at a time
                    segment = this.createSegment(3, lastThetaStart, lastThetaStart + THREE.Math.degToRad(data1Percent * 3.6));

                    //set the lastThetaStart to the length of the last segment, in order to not overlap segments
                    lastThetaStart = lastThetaStart + THREE.Math.degToRad(data1Percent * 3.6);

                    //adding elements to the legendMap
                    legendMap.set(calculatedData[dataset].name, segment.material.color.getHexString());

                    segment.name = calculatedData[dataset].name;
                    segment.data1 = {};
                    segment.data1.name = data1Name;
                    segment.data1.value = data1Value;
                    segment.data1.percent = data1Percent;
                }
                else if (value == 1) {
                    let data2Name = values[value].name;
                    let data2Value = values[value].value;
                    let data2Percent = values[value].percent;

                    segment.data2 = {};
                    segment.data2.name = data2Name;
                    segment.data2.value = data2Value;
                    segment.data2.percent = data2Percent;


                    //tween.js animation for the scale on z-axis
                    if(this.sceneConfig.chartAnimation) {
                        let finalPos = (data2Percent / 10);
                        let startPos = {z: segment.scale.z};

                        animateZ(segment, startPos, finalPos,3000,3000);
                    }
                    else{
                        segment.scale.z = (data2Percent / 10);
                    }

                }
                //add new piece to the grouped pieChart
                pieChart.add(segment);
            }
        }
        let pieChartLegend = new Legend(legendMap,this.sceneConfig);
        pieChartLegend.removeLegend();
        pieChartLegend.generateLegend();


        return pieChart;
    }
}



export default PieChart