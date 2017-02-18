/**
 * @author Amar Bajric (https://github.com/amarbajric)
 * @author Michael Fuchs (https://github.com/deKilla)
 * @author Timo Hasenbichler (https://github.com/timoooo)
 */

import TWEEN from "tween.js";
var THREE = require("three");
THREE.OrbitControls = require("three-orbit-controls")(THREE);
import {entryAnimation, resetCameraPosition, resetChartPosition} from "./animation";
import Legend from './Legend';


class SceneInit {

    //TODO: ebenfalls object ...
    constructor(domNode, sceneConfig, chartName, legendMap, camera, scene, controls, renderer, mouse, INTERSECTED) {

        
        this.domNode = document.getElementById(domNode);

        this.parentWidth = window.getComputedStyle(this.domNode).getPropertyValue("width").slice(0,-2) || 400;
        this.parentHeight = window.getComputedStyle(this.domNode).getPropertyValue("height").slice(0,-2) || 300;
        this.sceneConfig = sceneConfig; //custom user options held here
        this.chartName = chartName;
        this.legendMap = legendMap;
        this.camera = camera;
        this.scene = scene;
        this.controls = controls;
        this.renderer = renderer;
        this.mouse = new THREE.Vector2();
        this.INTERSECTED = INTERSECTED;

        this.canvas = this.createDomElement("canvas");
        this.details = this.createDomElement("details");
        this.control = this.createDomElement("control");
        this.legend = this.createDomElement("legend");
        this.tooltip = null;
        this.cameraDefaultPos = {x: 0, y: -9, z: 2}; //camera default pos

    }


    initScene() {
        this.camera = new THREE.PerspectiveCamera(this.sceneConfig.fov || 45, this.parentWidth / this.parentHeight, 1, 1000);
        this.details.style.visibility = "hidden";

        this.controls = new THREE.OrbitControls(this.camera, this.domNode);
        this.controls.addEventListener('change', this.render.bind(this));

        //OrbitControls custom settings
        this.controls.enableKeys = false; //disable keys (arrow keys on keyboard) because we have a D-Pad
        this.controls.enablePan = false;  // disable panning (right mouse button moving chart)

        this.scene = new THREE.Scene();

        //specify a canvas which is already created in the HTML file and tagged by an id
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: this.sceneConfig.antialias,
            alpha: this.sceneConfig.transparency
        });

        this.renderer.setSize(this.parentWidth, this.parentHeight);
        this.domNode.appendChild(this.renderer.domElement);

        //transparent background won't work when a background-color is defined
        if(this.sceneConfig.transparency == true) {
            this.renderer.setClearColor( 0xffffff, 0 );
        } else {
            this.scene.background = new THREE.Color(
                this.sceneConfig.bgcolor ||
                window.getComputedStyle(this.domNode).getPropertyValue("background-color")// ||
                //window.getComputedStyle(document.body).getPropertyValue("background-color") // pseudo transparency
            );
        }

        //ambient light which is for the whole scene
        let ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        ambientLight.castShadow = false;
        this.scene.add(ambientLight);

        //spot light which is illuminating the chart directly
        let spotLight = new THREE.SpotLight(0xffffff, 0.70);
        spotLight.castShadow = true;
        spotLight.position.set(0, 40, 10);
        this.scene.add(spotLight);

        if (this.sceneConfig.startAnimation) {
            this.camera.position.set(0, -10, 1100);
            let endPos = this.cameraDefaultPos;
            entryAnimation(this.camera, endPos, 2500, 800);
        }
         else {
            this.camera.position.set(this.cameraDefaultPos.x,this.cameraDefaultPos.y,this.cameraDefaultPos.z);
        }

        document.addEventListener('mousedown', this.onDocumentMouseAction.bind(this), false);
        document.addEventListener('mousemove', this.onDocumentMouseAction.bind(this), false);
        document.addEventListener('keydown', this.onDocumentKeyAction.bind(this), false);
        document.ondblclick = this.onDocumentDblClick.bind(this);

        //if window resizes
        window.addEventListener('resize', this.onWindowResize.bind(this), false);

        if (this.sceneConfig.showOnScreenControls) {
            this.showOnScreenControls(this.sceneConfig.controlMethod || "mouseover", this.scene, this.camera, this.cameraDefaultPos);
        }

        let legend = new Legend(this.legendMap, this.sceneConfig, this.domNode);
        legend.generateLegend();

    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.render();
        this.controls.update();
    }

    render() {
        this.renderer.render(this.scene, this.camera);
        TWEEN.update();
    }


    onWindowResize() {
        this.camera.aspect = this.parentWidth / this.parentHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.parentWidth, this.parentHeight);
    }


    findIntersections(event) {
        let raycaster = new THREE.Raycaster();
        this.mouse.x = (( event.pageX - this.domNode.offsetLeft ) / this.canvas.width ) * 2 - 1;
        this.mouse.y = - (( event.pageY - this.domNode.offsetTop ) / this.canvas.height ) * 2 + 1;

        raycaster.setFromCamera(this.mouse, this.camera);

        return raycaster.intersectObjects(this.scene.getObjectByName(this.chartName, true).children);
    
    }


    onDocumentKeyAction(event) {
       // https://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
        switch (event.keyCode) {
            case 82: //R key
                break;
            case 67: //C key
                break;
        }
    }


    showOnScreenControls(method = "click", currentChart, camera, defaultPos) {
        let repeater;
        let interval;

        if (method == "hover") {
            method = "mouseover"
        }
        if (method == "mouseover") {
            interval = 100
        }

        this.control.innerHTML = `<a class="btnup">&uarr;</a>`;
        this.control.innerHTML += `<a class="btnleft">&larr;</a>`;
        this.control.innerHTML += `<a class="btnreset">R</a>`;
        this.control.innerHTML += `<a class="btnright">&rarr;</a>`;
        this.control.innerHTML += `<a class="btndown">&darr;</a>`;

        this.domNode.querySelector(".btnreset").addEventListener("click", function () {
            resetChartPosition(currentChart,{x: 0, y: 0, z: 0},4000);
            resetCameraPosition(camera,defaultPos,4000);
        });
        this.domNode.querySelector(".btnleft").addEventListener(method, function () {
            repeater = setInterval(function () {
                currentChart.rotation.z += 0.1
            }, interval)
        });
        this.domNode.querySelector(".btnup").addEventListener(method, function () {
            repeater = setInterval(function () {
                currentChart.rotation.x -= 0.1
            }, interval)
        });
        this.domNode.querySelector(".btnright").addEventListener(method, function () {
            repeater = setInterval(function () {
                currentChart.rotation.z -= 0.1
            }, interval)
        });
        this.domNode.querySelector(".btndown").addEventListener(method, function () {
            repeater = setInterval(function () {
                currentChart.rotation.x += 0.1
            }, interval)
        });

        if (method == "mouseover") {
            this.domNode.querySelector(".btnleft").addEventListener("mouseout", function () {
                clearInterval(repeater)
            });
            this.domNode.querySelector(".btnup").addEventListener("mouseout", function () {
                clearInterval(repeater)
            });
            this.domNode.querySelector(".btnright").addEventListener("mouseout", function () {
                clearInterval(repeater)
            });
            this.domNode.querySelector(".btndown").addEventListener("mouseout", function () {
                clearInterval(repeater)
            });
        }
    }


    onDocumentMouseAction(event) {

        let intersectedObjects = this.findIntersections(event); // == aktuell immer null wenn die Maus im oberen Chart is
        //let scaled = false;

        if(intersectedObjects[0]) {
            // remove luminance if different segment is hovered
            if (this.INTERSECTED && this.INTERSECTED != intersectedObjects[0].object) {
                this.INTERSECTED.material.emissive.setHex();
                this.showTooltip(false);
            }
            this.INTERSECTED = intersectedObjects[0].object;
        } else if (this.INTERSECTED) {
            //remove luminance if no segment is hovered
            this.INTERSECTED.material.emissive.setHex();
            this.showTooltip(false);
            this.INTERSECTED = null;
        }
        
        //click event
        if (this.INTERSECTED && event.type == "mousedown") {
            this.showDetails(true);
        } else if (!this.INTERSECTED && event.type == "mousedown") { //click elsewhere
            this.showDetails(false);
        }

        //hover event
        if (this.INTERSECTED && event.type == "mousemove") {
            this.showTooltip(true);
            this.INTERSECTED.material.emissive.setHex(this.colorLuminance(this.INTERSECTED.material.color.getHexString(), 0.03));
            //console.log(intersectedObjects[0]);           
        }
    }

    showDetails(status) {
      

        if (status && this.sceneConfig.details) {
            this.details.innerHTML =
            `<h2>${this.INTERSECTED.name}</h2>`;
            for(let dataset = 0; dataset < Object.keys(this.INTERSECTED).length; dataset++){
                if(this.INTERSECTED.hasOwnProperty("data"+dataset)){
                    this.details.innerHTML +=
                        `<b>${this.INTERSECTED["data"+dataset].name}:</b> ${this.INTERSECTED["data"+dataset].percent.toFixed(2)}% (${this.INTERSECTED["data"+dataset].value})<br>`;
                }
            }
            this.details.style.visibility = "visible";
        }
        else if (!status && this.details) {
            this.details.style.visibility = "hidden";
        }
    }

    showTooltip(status) {

        let tooltip = document.getElementById("tooltip") || null;
        
        if (status && this.sceneConfig.tooltip) {

            if (!document.getElementById("tooltip")) {
                tooltip = document.createElement("div");
            } else {
                tooltip = document.getElementById("tooltip");
            }

            tooltip.setAttribute("id", "tooltip");

            tooltip.innerHTML =
                `<h4>${this.INTERSECTED.name}</h4>`;
            for(let dataset = 0; dataset < Object.keys(this.INTERSECTED).length; dataset++){
                if(this.INTERSECTED.hasOwnProperty("data"+dataset)){
                    tooltip.innerHTML += `<b>${this.INTERSECTED["data"+dataset].name}</b>: ${this.INTERSECTED["data"+dataset].value} (${this.INTERSECTED["data"+dataset].percent.toFixed(2)}%)<br/>`;
                }
            }
            tooltip.style.position = "absolute";
            tooltip.style.left = event.pageX + 'px';
            tooltip.style.top = event.pageY + 'px';


            document.body.appendChild(tooltip);
        } else if (!status && tooltip) {
            document.body.removeChild(tooltip);
        }

    }

    colorLuminance(hex, lum) {//function for mouse hover "glow effect" to illuminate the color of selected segment

    // validate hex string
        hex = String(hex).replace(/[^0-9a-f]/gi, '');
        if (hex.length < 6) {
            hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
        }
        lum = lum || 0;

        // convert to decimal and change luminosity
        let threeHex = "0x", c, i;
        for (i = 0; i < 3; i++) {
            c = parseInt(hex.substr(i*2,2), 16);
            c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
            threeHex += ("00"+c).substr(c.length);
        }
    return threeHex;
    }



    onDocumentDblClick() {
    }


    createDomElement(name) {
        let elementByClass = this.domNode.getElementsByClassName(name)[0];
        let elementByTag = this.domNode.getElementsByTagName(name)[0];
        let returnNode = null;
        let create = false;

        if(elementByClass && elementByTag) {
            throw "multiple elements found - make sure you only have either an element with id or with the tagname";
        }

        if(elementByClass && !elementByTag) {
            returnNode = elementById;
        }

        if(!elementByClass && elementByTag) {
            returnNode = elementByTag;
        }
        
        if(!elementByClass && !elementByTag) {

            if(name == "canvas") {
                // http://stackoverflow.com/questions/37339375/how-to-add-closing-tag-for-canvas-in-three-js-rendered-canvas#answer-37375664
                returnNode = document.createElement(name);
                create = true;
            } else if (name == "legend") {
                returnNode = document.createElement("ul");
                create = true;
                returnNode.className = name;
            } else {
                returnNode = document.createElement("div");
                create = true;
                returnNode.className = name;
            }

        }    

    if (create) {
        this.domNode.appendChild(returnNode);
    }
    return returnNode;
    }



}

export default SceneInit

