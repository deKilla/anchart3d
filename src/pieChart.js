/**
 * Created by Amar on 07.11.2016.
 */

/*
 import '../src/utils/TrackballControls';
 import * as THREE from "three/build/three";
 import * as data from './data.json';
 */

"use strict";


var camera, controls, scene, renderer;
var mouse = new THREE.Vector2(), INTERSECTED;
var raycaster = new THREE.Raycaster();

init();
animate();

function init(){
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 15;

    controls = new THREE.TrackballControls( camera );
    controls.addEventListener('change', render);

    scene = new THREE.Scene();

    //specify a canvas which is already created in the HTML file and tagged by an id        //aliasing enabled
    renderer = new THREE.WebGLRenderer({canvas: document.getElementById('myThreeJsCanvas') , antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement);


    //ambient light which is for the whole scene
    var ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    ambientLight.castShadow = false;
    scene.add(ambientLight);

    //spot light which is illuminating the chart directly
    var spotLight = new THREE.SpotLight(0xffffff, 0.55);
    spotLight.castShadow = true;
    spotLight.position.set(0,40,10);
    scene.add(spotLight);

    //get JSON with data
    let jsonData = JSON.parse(getJsonText("../src/data.json"));

    //add grouped PieChart to scene
    var groupedPieChart = create3DPieChart(jsonData);
    //set the name of the object so it is easier to find in the scene again for the click function
    groupedPieChart.name = "groupedPieChart";
    scene.add(groupedPieChart);

    //addEventListener for certain events
    document.addEventListener('mousedown', onDocumentMouseAction, false);
    document.addEventListener('mousemove', onDocumentMouseAction, false);
    document.ondblclick = onDocumentDblClick();

    //if window resizes
    window.addEventListener('resize', onWindowResize, false);

}



//on click function
function findIntersections(event) {

    event.preventDefault();

    mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;
    raycaster.setFromCamera( mouse, camera );
    //search for our object by name which we declared before and return it
    return raycaster.intersectObjects(scene.getObjectByName("groupedPieChart", true).children);
}


function onDocumentMouseAction(event){
    //call function which finds intersected objects
    var intersects = findIntersections(event);

    if (intersects[0] !== undefined && event.type === "mousedown") {//if the event type is a mouse click (one click)
        //print percentage of the clicked section + the name of the object assigned in the 'create3DPieChart' function
        //intersects[0] because we want the first intersected object and every other object which may lies in the background is unnecessary
        console.log(intersects[0].object.name);
    }
    else if (intersects[0] !== undefined && event.type == "mousemove") {//if the event type is a mouse move (hover)

        if ( INTERSECTED != intersects[ 0 ].object ) {
            if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
            INTERSECTED = intersects[ 0 ].object;
            INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
            INTERSECTED.material.emissive.setHex(0xa9a8a8);
        }
    }
    else {
        if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
        INTERSECTED = null;
    }

}


//Double click event function
function onDocumentDblClick() {
    //IMPLEMENT DOUBLE CLICK FUNCTION HERE
}



function animate(){
    requestAnimationFrame( animate );
    render();
    controls.update();
}


function render(){
    renderer.render( scene, camera );
}


function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}



/**
 * Creates a 3D pie chart which is at the end grouped together.
 * @input: JSON Object with data, scene object
 * @output: multiple segments which are grouped together.
 */
function create3DPieChart(jsonData) {
    //calculate percent of every data set in json first
    var calculatedData = calcPercent(jsonData);

    //Group together all pieces
    var pieChart = new THREE.Group();

    //variable holds last position of the inserted segment of the pie
    var lastThetaStart = 0.0;

    //iterate over the jsonData and create for every data a new pie segment
    //data = one object in the json which holds the props "amount","percent" in this case.
    for (var data in jsonData) {
        var values = jsonData[data].values;
        for (var val in values){
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
        var segment = createSegment(3,lastThetaStart, lastThetaStart + THREE.Math.degToRad(data1Percent*3.6));

        //scale in z (show second data set)
        segment.scale.z = (data2Percent/10);

        //set the lastThetaStart to the length of the last segment, in order to not overlap segments
        lastThetaStart = lastThetaStart + THREE.Math.degToRad(data1Percent*3.6);

        //assign the object the name from the description of the JSON
        //TODO save data somewhere else
        segment.name = jsonData[data].name + ": " + data1Name +"= " + data1Percent.toFixed(2) +"% " + "(" + data1Value + ")" + "\n"
                     + jsonData[data].name + ": " + data2Name +"(€)= " + data2Percent.toFixed(2) +"% " + "(" + data2Value + ")";

        //define a new property for the segment to store the percent associated with it.
        //source: https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty
        Object.defineProperty(segment, 'percent', {
            value: data1Percent.toFixed(2)
        });

        //add new piece to the grouped pieChart
        pieChart.add(segment);
    }
    return pieChart;
}


/**
 * Creates a segment (of a pie chart) and returns one segment as a shape which is extruded.
 * @param radius
 * @param angleStart
 * @param angleEnd
 * @returns {Raycaster.params.Mesh|{}|SEA3D.Mesh|THREE.SEA3D.Mesh|*|Mesh}
 */
function createSegment(radius, angleStart, angleEnd) {
    var extrudeOptions = {
        curveSegments: 50,
        steps: 1,
        amount: 1.1,
        bevelEnabled: false,
    };

    var shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.absarc(0, 0, radius, angleStart, angleEnd, false);//false: to not go clockwise (otherwise it will fail)
    shape.lineTo(0, 0);
    var segmentGeom = new THREE.ExtrudeGeometry(shape,extrudeOptions);
    var segmentMat = new THREE.MeshPhongMaterial({
        color: Math.random() * 0xffffff,
        shading: THREE.SmoothShading,
        specular: 0xffffff,
        shininess: 1.5,
    });

    return new THREE.Mesh(segmentGeom, segmentMat);
}



function calcSums(json) {
    var allsums = [];
    for (var i = 0; i < json[0].values.length; i++) {
        json.reduce(function(t,cv) {
            if (allsums[cv.values[i].name]) {
                allsums[cv.values[i].name] += cv.values[i].value;
            } else {
                allsums[cv.values[i].name] = cv.values[i].value;
            }
        }, {});
    }
    return allsums;
}

function calcPercent(json) {

    var allSums = calcSums(json);

    for (var elements in json) {
        var values = json[elements].values;
        for (var value in values) {

            var total = allSums[values[value].name];
            var percent = values[value].value/(total/100);

            //set calculated percent and total to the corresponding dataset
            json[elements].values[value]["percent"] = percent;
            json[elements].values[value]["total"] = total;
        }
    }
    return json;
}


function getJsonText(file)
{
    var rawFile = new XMLHttpRequest();
    var allText;
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
};