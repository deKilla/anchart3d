/**
 * Created by Amar on 21.11.2016.
 */

"use strict";

class SceneInit {

    constructor(domtarget = "anchart3d",fov = 45,camera,scene,controls,renderer,INTERSECTED,sprite,context,texture)
    {
        this.domtarget = domtarget;
        this.camera = camera;
        this.scene = scene;
        this.controls = controls;
        this.renderer = renderer;
        this.fov = fov;
        this.mouse = new THREE.Vector2();
        this.INTERSECTED = INTERSECTED;
        this.raycaster = new THREE.Raycaster();
        //used for labeling
        this.sprite = sprite;
        this.context = context;
        this.texture = texture;
    }



    initScene() {
        this.camera = new THREE.PerspectiveCamera(this.fov, window.innerWidth / window.innerHeight, 1, 1000);
        this.camera.position.z = 15;

        this.controls = new THREE.TrackballControls( this.camera );
        this.controls.addEventListener('change', this.render.bind(this));

        this.scene = new THREE.Scene();

        //specify a canvas which is already created in the HTML file and tagged by an id        //aliasing enabled
        this.renderer = new THREE.WebGLRenderer({canvas: document.getElementById(this.domtarget) , antialias: true});
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

        //define sprite on 2d canvas to draw tooltip at mouse hover
        this.defineTextSprite("create");


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

        this.mouse.x = ( event.clientX / this.renderer.domElement.clientWidth ) * 2 - 1;
        this.mouse.y = - ( event.clientY / this.renderer.domElement.clientHeight ) * 2 + 1;
        this.raycaster.setFromCamera( this.mouse, this.camera );

        //update the label position when hovering over a segment
        this.getLabelPos();

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
            document.getElementById("details").innerHTML = intersects[0].object.details;
        }
        else if (intersects[0] !== undefined && event.type == "mousemove") {//if the event type is a mouse move (hover)

            if ( this.INTERSECTED != intersects[ 0 ].object ) {
                if ( this.INTERSECTED ) this.INTERSECTED.material.emissive.setHex( this.INTERSECTED.currentHex );
                this.INTERSECTED = intersects[ 0 ].object;
                this.currentHex = this.INTERSECTED.material.emissive.getHex();
                this.INTERSECTED.material.emissive.setHex(0xa9a8a8);

                // update text, if it has a "name" field.
                if ( intersects[ 0 ].object.name )
                {
                    this.defineTextSprite("showOnSegment",intersects[0].object.name,24);
                }
                else
                {
                    this.defineTextSprite("hide");
                }

            }
        }
        else {
            if ( this.INTERSECTED ) this.INTERSECTED.material.emissive.setHex( this.INTERSECTED.currentHex );
            this.INTERSECTED = null;

            this.defineTextSprite("hide");
        }

    }


    onDocumentDblClick() {
        //IMPLEMENT DOUBLE CLICK FUNCTION HERE
    }


     defineTextSprite(option,message,fontsize) {
        let spriteMat, canvas;
        message = (message != undefined) ? message : "";
        fontsize = (fontsize != undefined || !isNaN(fontsize)) ? fontsize : 20;

        if(option != undefined){
             switch(option) {
                 case "create":
                     /////// draw text on canvas /////////
                     // create a canvas element
                     canvas = document.createElement('canvas');
                     this.context = canvas.getContext('2d');
                     this.context.font = "" + fontsize + "px Arial";
                     this.context.fillStyle = "rgba(0,0,0,0.95)";

                     // canvas contents will be used for a texture
                     this.texture = new THREE.Texture(canvas);
                    this.texture.minFilter = THREE.LinearFilter;
                     this.texture.needsUpdate = true;

                     spriteMat = new THREE.SpriteMaterial( { map: this.texture /*, useScreenCoordinates: true*/ } );
                     this.sprite = new THREE.Sprite( spriteMat );
                     this.sprite.scale.set(200,100,1.0);
                     this.scene.add( this.sprite );
                     break;

                 case "showOnSegment":
                     this.context.clearRect(0,0,640,480);
                     let metrics = this.context.measureText(message);
                     let width = metrics.width;
                     this.context.fillStyle = "rgba(0,0,0,0.95)"; // black border
                     this.context.fillRect( 0,0, width+8,20+8);
                     this.context.fillStyle = "rgba(255,255,255,0.95)"; // white filler
                     this.context.fillRect( 2,2, width+10, fontsize);
                     this.context.fillStyle = "rgba(0,0,0,1)"; // text color
                     this.context.fillText( message, fontsize, fontsize/2);
                     this.texture.needsUpdate = true;
                     break;

                 case "hide":
                     this.context.clearRect(0,0,300,300);
                     this.texture.needsUpdate = true;
                     break;

                 default:
                     console.error("No option was defined!");
            }
        }

     }



    getLabelPos(){
        let vector = new THREE.Vector3(this.mouse.x -0.27, this.mouse.y -0.27, 0.9);
        vector.unproject( this.camera );
        let dir = vector.sub( this.camera.position ).normalize();
        let distance =  this.camera.position.z / dir.z +500;
        let pos = this.camera.position.clone().add( dir.multiplyScalar( distance ) );
        //set the label at the mouse position
        this.sprite.position.copy(pos);

    }
}


//export {SceneInit}