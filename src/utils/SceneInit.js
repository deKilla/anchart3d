/**
 * Created by Amar on 21.11.2016.
 */

"use strict";

class SceneInit {

    constructor(jsonConfig,camera,scene,controls,renderer)
    {
        this.camera = camera;
        this.scene = scene;
        this.controls = controls;
        this.renderer = renderer;
        this.jsonConfig = jsonConfig;
    }

    add(object){
        scene.add(object);
    }

    update(){
        controls.update();
    }

    initScene() {
        camera = new THREE.PerspectiveCamera(this.jsonConfig.cameraFov, window.innerWidth / window.innerHeight, 1, 1000);
        camera.position.z = 15;

        controls = new THREE.TrackballControls( camera );
        controls.addEventListener('change', this.renderScene);

        scene = new THREE.Scene();

        //specify a canvas which is already created in the HTML file and tagged by an id        //aliasing enabled
        renderer = new THREE.WebGLRenderer({canvas: document.getElementById('myThreeJsCanvas') , antialias: true});
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);


        //ambient light which is for the whole scene
        let ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        ambientLight.castShadow = false;
        scene.add(ambientLight);

        //spot light which is illuminating the chart directly
        let spotLight = new THREE.SpotLight(0xffffff, 0.55);
        spotLight.castShadow = true;
        spotLight.position.set(0,40,10);
        scene.add(spotLight);
    }


    animate(){
    requestAnimationFrame( this.animate );
    this.renderScene();
    controls.update();
}


    renderScene(){
    renderer.render( scene, camera );
}

}