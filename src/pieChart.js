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
    camera.position.z = 20;

    controls = new THREE.TrackballControls( camera );
    controls.addEventListener('change', render);

    scene = new THREE.Scene();

    //specify a canvas which is already created in the HTML file and tagged by an id        //aliasing enabled
    renderer = new THREE.WebGLRenderer({canvas: document.getElementById('myThreeJsCanvas') , antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement);

    //ambient light which is for the whole scene
    var ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    ambientLight.castShadow = false;
    scene.add(ambientLight);

    //spot light which is illuminating the chart directly
    var spotLight = new THREE.SpotLight(0xffffff, 0.6);
    spotLight.castShadow = true;
    spotLight.position.set(0,50,0);
    scene.add(spotLight);

    //add grouped PieChart to scene
    var groupedPieChart = create2DPieChart(data);
    //set the name of the object so it is easier to find in the scene again for the click function
    groupedPieChart.name = "groupedPieChart";
    scene.add(groupedPieChart);

    //addEventListener for certain events
    document.addEventListener( 'mousedown', onDocumentMouseDown, false );
    document.addEventListener( 'mousemove', onDocumentMouseDown, false );

    //if window resizes
    window.addEventListener( 'resize', onWindowResize, false );
}



//on click function
function onDocumentMouseDown( event ) {
    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2();

    event.preventDefault();

    mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;
    raycaster.setFromCamera( mouse, camera );
    var intersects = raycaster.intersectObjects(scene.getObjectByName("groupedPieChart", true).children); //search for our object by name which we declared before

    if(intersects[0] !== undefined && event.type === "mousedown") {
        //print percentage of the clicked section + the name of the object assigned in the 'createXPieChart' function
        //intersects[0] because we want the first intersected object and every other object which may lies in the background is unnecessary
        console.log(intersects[0].object.name, ":", parseFloat(((intersects[0].object.geometry.parameters.thetaLength * 100) / Math.PI) / 2).toFixed(5), "%");
    }
    else if (intersects[0] !== undefined && event.type == "mousemove"){//if the event type is a mouse move (hover)
        //IMPLEMENT MOUSE HOVER ACTION HERE!
    }
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
 * @input: JSON Object with data, scene object
 * @output: one ore more meshes which are then added to the scene (void)
 */
function create2DPieChart(jsonData) {
    //Group together all pieces
    var pieChart = new THREE.Group();

    //variable holds last position of the inserted segment of the pie
    var lastThetaStart = 0;

    //iterate over the jsonData and create for every data a new pie segment
    //data = one object in the json which holds the props "amount","percent" in this case.
    for (var data in jsonData){
        //Cylinder Geometry: (radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength)
        var segment = new THREE.Mesh(new THREE.CylinderGeometry(5,5,1.5,50,50,false,lastThetaStart,(Math.PI*2)*(jsonData[data].percent/100)),
            new THREE.MeshPhongMaterial({
                ambient: 0x808080,
                color: Math.random() * 0xffffff
            }));

        //assign the object the name from the description of the JSON
        segment.name = jsonData[data].description;

        //set the lastThetaStart to the length of the last segment, in order to not overlap segments
        lastThetaStart = lastThetaStart + (Math.PI*2)*(jsonData[data].percent/100);

        //add new piece to the grouped pieChart
        pieChart.add(segment);
    }
    return pieChart;
}
