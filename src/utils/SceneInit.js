/**
 * Created by Amar on 21.11.2016.
 */

"use strict";

class SceneInit {

    constructor(fov = 45,camera,scene,controls,renderer,INTERSECTED)
    {
        this.camera = camera;
        this.scene = scene;
        this.controls = controls;
        this.renderer = renderer;
        this.fov = fov;
        this.mouse = new THREE.Vector2();
        this.INTERSECTED = INTERSECTED;
        this.raycaster = new THREE.Raycaster();

    }



    initScene() {
        this.camera = new THREE.PerspectiveCamera(this.fov, window.innerWidth / window.innerHeight, 1, 1000);
        this.camera.position.z = 15;

        this.controls = new THREE.TrackballControls( this.camera );
        this.controls.addEventListener('change', this.render.bind(this));

        this.scene = new THREE.Scene();

        //specify a canvas which is already created in the HTML file and tagged by an id        //aliasing enabled
        this.renderer = new THREE.WebGLRenderer({canvas: document.getElementById('myThreeJsCanvas') , antialias: true});
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);


        //ambient light which is for the whole scene
        let ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        ambientLight.castShadow = false;
        this.scene.add(ambientLight);

        //spot light which is illuminating the chart directly
        let spotLight = new THREE.SpotLight(0xffffff, 0.55);
        spotLight.castShadow = true;
        spotLight.position.set(0,40,10);
        this.scene.add(spotLight);


        document.addEventListener('mousedown', this.onDocumentMouseAction.bind(this), false);
        document.addEventListener('mousemove', this.onDocumentMouseAction.bind(this), false);
        document.ondblclick = this.onDocumentDblClick.bind(this);


        //if window resizes
        window.addEventListener('resize', this.onWindowResize.bind(this) , false);
    }


    animate(){
        requestAnimationFrame( this.animate.bind(this) );
        this.render();
        this.controls.update();
    }


    render(){
        this.renderer.render( this.scene, this.camera );
    }


    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }


    findIntersections(event) {

        event.preventDefault();

        this.mouse.x = ( event.clientX / this.renderer.domElement.clientWidth ) * 2 - 1;
        this.mouse.y = - ( event.clientY / this.renderer.domElement.clientHeight ) * 2 + 1;
        this.raycaster.setFromCamera( this.mouse, this.camera );
        //search for our object by name which we declared before and return it
        return this.raycaster.intersectObjects(this.scene.getObjectByName("groupedPieChart", true).children);
    }



    onDocumentMouseAction(event){
        //call function which finds intersected objects
        let intersects = this.findIntersections(event);

        if (intersects[0] !== undefined && event.type === "mousedown") {//if the event type is a mouse click (one click)
            //print percentage of the clicked section + the name of the object assigned in the 'create3DPieChart' function
            //intersects[0] because we want the first intersected object and every other object which may lies in the background is unnecessary
            console.log(intersects[0].object.name);
        }
        else if (intersects[0] !== undefined && event.type == "mousemove") {//if the event type is a mouse move (hover)

            if ( this.INTERSECTED != intersects[ 0 ].object ) {
                if ( this.INTERSECTED ) this.INTERSECTED.material.emissive.setHex( this.INTERSECTED.currentHex );
                this.INTERSECTED = intersects[ 0 ].object;
                this.currentHex = this.INTERSECTED.material.emissive.getHex();
                this.INTERSECTED.material.emissive.setHex(0xa9a8a8);
            }
        }
        else {
            if ( this.INTERSECTED ) this.INTERSECTED.material.emissive.setHex( this.INTERSECTED.currentHex );
            this.INTERSECTED = null;
        }

    }


    onDocumentDblClick() {
        //IMPLEMENT DOUBLE CLICK FUNCTION HERE
    }



}


//export {SceneInit}