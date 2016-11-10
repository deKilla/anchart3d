/**
 * Created by Amar on 07.11.2016.
 */

/*
import '../src/utils/TrackballControls';
import * as THREE from "three/build/three";
 import * as data from './data.json';
*/

"use strict";

var data = {
    "age_0-10": {
        "amount": 50123,
        "percent": 17.901071428571428571428571428571,
        "pieChartColor": "#9205FA"
    },
    "age_11-20": {
        "amount": 55000,
        "percent": 19.642857142857142857142857142857,
        "pieChartColor": "#17FA05"
    },
    "age_21-35": {
        "amount": 75000,
        "percent": 26.785714285714285714285714285714,
        "pieChartColor": "#05E4FA"
    },
    "age_36-50": {
        "amount": 41000,
        "percent": 14.642857142857142857142857142857,
        "pieChartColor": "#FA0535"
    },
    "age_51-65": {
        "amount": 24236,
        "percent": 8.6557142857142857142857142857143,
        "pieChartColor": "#FAC305"
    },
    "age_66-75": {
        "amount": 34641,
        "percent": 12.371785714285714285714285714286,
        "pieChartColor": "#47470A"
    }
}



var camera, controls, scene, renderer;

init();
animate();

function init(){
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 20;

    controls = new THREE.TrackballControls( camera );
    controls.addEventListener('change', render);

    scene = new THREE.Scene();


    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement);

    //add grouped PieChart to scene
    var groupedPieChart = create2DPieChart(data);
    scene.add(groupedPieChart);


}

function animate(){
    requestAnimationFrame( animate );
    controls.update();
}

function render(){
    renderer.render( scene, camera );
}


/**
 * @input: JSON Object with data, scene object
 * @output: one ore more meshes which are then added to the scene (void)
 */
function create2DPieChart(jsonData) {
    //Group together all pieces
    var pieChart = new THREE.Group();

    //variable holds last position of the inserted segment of the pie
    var lastThetaStart = 0;

    //iterate over the jsonData and create for every data a new pie segment
    //data = one object in the json which holds the props "amount","percent" and "pieChartColor" in this case.
    for (var data in jsonData){
        var newMesh = new THREE.Mesh(new THREE.CircleGeometry(5,30,lastThetaStart,(Math.PI*2)*(jsonData[data].percent/100)),new THREE.MeshBasicMaterial({
            color: jsonData[data].pieChartColor,
        }));

        //set the lastThetaStart to the length of the last segment, in order to not overlap segments
        lastThetaStart = lastThetaStart + (Math.PI*2)*(jsonData[data].percent/100);
        //add new piece to the grouped pieChart
        pieChart.add(newMesh);

        //this should demonstrate how to make one special piece invisible
        /*
        if(jsonData[data].amount === 41000){
            newMesh.visible = false;
        }
        */
    }
    return pieChart;
}
