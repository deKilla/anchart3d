/**
 * Created by Amar on 07.11.2016.
 */

/*
import '../src/utils/TrackballControls';
import * as THREE from "three/build/three";
 import * as data from './data.json';
*/

"use strict";

var data = [
    {
        "description": "Age(0-10)",
        "amount": 50123,
        "percent": 17.901071428571428571428571428571
    },
    {
        "description": "Age(11-20)",
        "amount": 55000,
        "percent": 19.642857142857142857142857142857
    },
    {
        "description": "Age(21-30)",
        "amount": 75000,
        "percent": 26.785714285714285714285714285714
    },
    {
        "description": "Age(31-45)",
        "amount": 41000,
        "percent": 14.642857142857142857142857142857
    },
    {
        "description": "Age(46-55)",
        "amount": 24236,
        "percent": 8.6557142857142857142857142857143
    },
    {
        "description": "Age(56+)",
        "amount": 34641,
        "percent": 12.371785714285714285714285714286
    }
]



var camera, controls, scene, renderer;

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
    var spotLight = new THREE.SpotLight(0xffffff, 0.75);
    spotLight.castShadow = true;
    spotLight.position.set(0,40,10);
    scene.add(spotLight);

    //add grouped PieChart to scene
    var groupedPieChart = create3DPieChart(data);
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


//function which finds intersections with objects in the scene trough a casted ray
function findIntersections(event){
    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2();

    mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;
    raycaster.setFromCamera( mouse, camera );
     //search for our object by name which we declared before and return it
    return raycaster.intersectObjects(scene.getObjectByName("groupedPieChart", true).children);
}



//on click function
function onDocumentMouseAction(event) {
    event.preventDefault();

    //call function which finds intersected objects
    var intersects = findIntersections(event);

    if(intersects[0] !== undefined && event.type === "mousedown") {
        //print percentage of the clicked section + the name of the object assigned in the 'create3DPieChart' function
        //intersects[0] because we want the first intersected object and every other object which may lies in the background is unnecessary
        console.log(intersects[0].object.name, "has a value of:", intersects[0].object.data, "%");
    }
    else if (intersects[0] !== undefined && event.type == "mousemove"){//if the event type is a mouse move (hover)
        //IMPLEMENT MOUSE HOVER ACTION HERE!
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
    //Group together all pieces
    var pieChart = new THREE.Group();

    //variable holds last position of the inserted segment of the pie
    var lastThetaStart = 0.0;

    //iterate over the jsonData and create for every data a new pie segment
    //data = one object in the json which holds the props "amount","percent" in this case.
    for (var data in jsonData){
        //call function which creates one segment at a time
        var segment = createSegment(3,lastThetaStart, lastThetaStart + THREE.Math.degToRad(jsonData[data].percent*3.6));

        //set the lastThetaStart to the length of the last segment, in order to not overlap segments
        lastThetaStart = lastThetaStart + THREE.Math.degToRad(jsonData[data].percent*3.6);

        //assign the object the name from the description of the JSON
        segment.name = jsonData[data].description;

        //define a new property for the segment to store the percent associated with it.
        //source: https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty
        Object.defineProperty(segment, 'data', {
            value: parseFloat(jsonData[data].percent).toFixed(3)
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
        shininess: 3,
    });
    
    return new THREE.Mesh(segmentGeom, segmentMat);
}