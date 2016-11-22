/**
 * Created by Amar on 07.11.2016.
 */

/*
 import '../src/utils/TrackballControls';
 import * as THREE from "three/build/three";
 import * as data from './data.json';
 */

"use strict";


class PieChart {

    constructor(jsonData, radius, angleStart, angleEnd, legendMap){

        this.jsonData = jsonData;
        this.radius = radius;
        this.angleStart = angleStart;
        this.angleEnd = angleEnd;
        this.object = this.create3DPieChart();
        this.legendMap = legendMap;
   
    }

    createSegment(radius, angleStart, angleEnd) {
        let extrudeOptions = {
            curveSegments: 50,
            steps: 1,
            amount: 1.1,
            bevelEnabled: false,
        };

        let shape = new THREE.Shape();
        shape.moveTo(0, 0);
        shape.absarc(0, 0, radius, angleStart, angleEnd, false); //false: to not go clockwise (otherwise it will fail)
        shape.lineTo(0, 0);
        let segmentGeom = new THREE.ExtrudeGeometry(shape,extrudeOptions);
        let segmentMat = new THREE.MeshPhongMaterial({
            color: Math.random() * 0xffffff,
            shading: THREE.SmoothShading,
            specular: 0xffffff,
            shininess: 1.5,
   		});

    	return new THREE.Mesh(segmentGeom, segmentMat);
	}

    create3DPieChart(jsonData = this.jsonData) {
        //calculate percent of every data set in json first
        const calculatedData = jsonData.percent;

        //Group together all pieces
        let pieChart = new THREE.Group();
        pieChart.name = "groupedPieChart";

        //variable holds last position of the inserted segment of the pie
        let lastThetaStart = 0.0;

        let legendMap = new Map();
        //iterate over the jsonData and create for every data a new pie segment
        //data = one object in the json which holds the props "amount","percent" in this case.
        for (let data in calculatedData) {
            let values = calculatedData[data].values;
            for (let val in values){
                //get first data set of the first object
                if(val == 0){
                    var data1Name = values[val].name;
                    var data1Value = values[val].value;
                    var data1Percent = values[val].percent;
                }
                else if (val == 1){
                    var data2Name = values[val].name;
                    var data2Value = values[val].value;
                    var data2Percent = values[val].percent;
                }
            }
            //call function which creates one segment at a time
            let segment = this.createSegment(3,lastThetaStart, lastThetaStart + THREE.Math.degToRad(data1Percent*3.6));

            //scale in z (show second data set)
            segment.scale.z = (data2Percent/10);

            //adding elements to the legendMap
            legendMap.set(calculatedData[data].name,segment.material.color.getHexString());


            //set the lastThetaStart to the length of the last segment, in order to not overlap segments
            lastThetaStart = lastThetaStart + THREE.Math.degToRad(data1Percent*3.6);

            //assign the object the name from the description of the JSON
            //TODO save data somewhere else
            segment.name = calculatedData[data].name + "\n" +
                           "Fläche: " + data1Name +"= " + data1Percent.toFixed(2) +"% " + "(" + data1Value + ")" + "\n" +
                           "Höhe: " + data2Name +"(€)= " + data2Percent.toFixed(2) +"% " + "(" + data2Value + ")";

            segment.details = "<h3>" + calculatedData[data].name + "</h3>" +
                           "<b>Fläche:</b> " + data1Name + " = " + data1Percent.toFixed(2) +"% " + "(" + data1Value + ")" + "<br />" +
                           "<b>Höhe:</b> " + data2Name + " = " + data2Percent.toFixed(2) +"% " + "(€ " + data2Value + ",-)";
            
            //define a new property for the segment to store the percent associated with it.
            //source: https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty
            Object.defineProperty(segment, 'percent', {
                value: data1Percent.toFixed(2)
            });

            //add new piece to the grouped pieChart
            pieChart.add(segment);
        }
        let pieChartLegend = new Legend(legendMap);
        pieChartLegend.generateLegend();
        return pieChart;
	}
}