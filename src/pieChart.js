/**
 * Created by Amar on 07.11.2016.
 */

"use strict";

import * as THREE from '../node_modules/three/build/three';
import '../src/utils/OrbitControls';
import {Legend} from './utils/legend';
import {Chart} from './Chart';


class PieChart extends Chart {

    constructor(jsonData, radius, angleStart, angleEnd) {

        super(jsonData);
        this.jsonData = jsonData;
        this.radius = radius;
        this.angleStart = angleStart;
        this.angleEnd = angleEnd;
        this.object = this.create3DPieChart();

    }


    animateZ(obj, startpos, finpos,) {
        return new TWEEN.Tween(startpos)
            .to({z: finpos}, 3000)
            .easing(TWEEN.Easing.Cubic.Out)
            .onUpdate(function () {
                obj.scale.z = startpos.z;
            });
    }


    createSegment(radius, angleStart, angleEnd) {
        let extrudeOptions = {
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
            specular: 0xffffff,
            shininess: 1.0,
        });

        return new THREE.Mesh(segmentGeom, segmentMat);
    }

    create3DPieChart(jsonData = this.jsonData) {

        //calculate percent of every data set in json first
        const calculatedData = jsonData.percent;
        //Group together all pieces
        let pieChart = new THREE.Group();
        pieChart.name = "groupedChart";

        //variable holds last position of the inserted segment of the pie
        let lastThetaStart = 0.0;

        let legendMap = new Map();
        //iterate over the jsonData and create for every data a new pie segment
        //data = one object in the json which holds the props "amount","percent" in this case.
        for (let data in calculatedData) {
            let values = calculatedData[data].values;
            for (let val in values) {
                var segment;
                //get first data set of the first object
                if (val == 0) {
                    let data1Name = values[val].name;
                    let data1Value = values[val].value;
                    let data1Percent = values[val].percent;

                    //call function which creates one segment at a time
                    segment = this.createSegment(3, lastThetaStart, lastThetaStart + THREE.Math.degToRad(data1Percent * 3.6));

                    //set the lastThetaStart to the length of the last segment, in order to not overlap segments
                    lastThetaStart = lastThetaStart + THREE.Math.degToRad(data1Percent * 3.6);

                    //adding elements to the legendMap
                    legendMap.set(calculatedData[data].name, segment.material.color.getHexString());

                    segment.name = calculatedData[data].name;
                    segment.data1 = {};
                    segment.data1.name = data1Name;
                    segment.data1.value = data1Value;
                    segment.data1.percent = data1Percent;

                }
                else if (val == 1) {
                    let data2Name = values[val].name;
                    let data2Value = values[val].value;
                    let data2Percent = values[val].percent;

                    segment.data2 = {};
                    segment.data2.name = data2Name;
                    segment.data2.value = data2Value;
                    segment.data2.percent = data2Percent;

                    /**
                     * Animation with Tween.js (scaling in z-axis)
                     * @type {number}
                     */

                    if (sceneConfig.startAnimation) {
                        let finalPos = (data2Percent / 10);
                        let startPos = {z: segment.scale.z};
                        //tween.js animation for the scale on z-axis

                        let animation = this.animateZ(segment, startPos, finalPos);
                        animation.delay(3000);
                        animation.start();
                    }

                }

                //add new piece to the grouped pieChart
                pieChart.add(segment);
            }
        }
        let pieChartLegend = new Legend(legendMap);
        pieChartLegend.generateLegend();
        return pieChart;
    }
}


export {PieChart}