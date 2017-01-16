/**
 * Created by timo on 16.01.17.
 */
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


class BarChart {

    //TODO: maybe use object ...
    constructor(jsonData, sceneConfig) {

        this.jsonData = jsonData;
        this.sceneConfig = sceneConfig;
        this.object = this.create3DBarChart();

    }

    createSegment(lastBarStartX, lastBarStartY, height) {

        let barGeometry = new THREE.CubeGeometry(0.5, 0.5, height);
        let segmentMat = new THREE.MeshPhongMaterial({
            color: Math.random() * 0xffffff,
            shading: THREE.SmoothShading,
            shininess: 0.8,
        });

        let bar = new THREE.Mesh(barGeometry, segmentMat);
        bar.translateX(2+lastBarStartX);
        return bar;
    }


    create3DBarChart(jsonData = this.jsonData) {
        //calculate percent of every data set in json first
        const calculatedData = jsonData.file;
        console.log(calculatedData);
        //Group together all pieces
        let barChart = new THREE.Group();
        barChart.name = "groupedChart";
        //variable holds last position of the inserted segment of the barchart
        let lastBarStartX = 0.0;
        let lastBarStartY = 0.0;
        //Saves the Color and the name of the chart
        let legendMap = new Map();
        //iterate over the jsonData and create for every data a new Bar
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
                    segment = this.createSegment(lastBarStartX,lastBarStartY, data1Percent /10);

                    //set the lastThetaStart to the length of the last segment, in order to not overlap segments
                    //lastThetaStart = lastThetaStart + THREE.Math.degToRad(data1Percent * 3.6);
                    console.log("segment klappt   jop")
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
                    if (this.sceneConfig.chartAnimation) {
                        let finalPos = (data2Percent / 10);
                        let startPos = {z: segment.scale.z};


                        animateZ(segment, startPos, finalPos, 3000, 3000);
                    }
                    else {
                        segment.scale.z = (data2Percent / 10);
                    }

                }
                //add new piece to the grouped pieChart
                //add new piece to the grouped pieChart
                barChart.add(segment);
            }
        }
        let barChartLegend = new Legend(legendMap, this.sceneConfig);
        barChartLegend.generateLegend();


        return barChart;
    }
}


export default BarChart