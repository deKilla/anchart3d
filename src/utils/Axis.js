/**
 * Created by Timo on 29.01.2017.
 */
/**
 * Created by Timo on 24.01.2017.
 */
import * as THREE from "three";


class Axis {

    constructor(sceneConfig) {
        this.sceneConfig = sceneConfig;

    }

    roundRect(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    makeTextSprite(message, parameters) {
        if (parameters === undefined) parameters = {};

        var fontface = parameters.hasOwnProperty("fontface") ?
            parameters["fontface"] : "Arial";

        var fontsize = parameters.hasOwnProperty("fontsize") ?
            parameters["fontsize"] : 11;

        var borderThickness = parameters.hasOwnProperty("borderThickness") ?
            parameters["borderThickness"] : 1;

        var borderColor = parameters.hasOwnProperty("borderColor") ?
            parameters["borderColor"] : {r: 0, g: 0, b: 0, a: 1.0};

        var backgroundColor = parameters.hasOwnProperty("backgroundColor") ?
            parameters["backgroundColor"] : {r: 255, g: 255, b: 255, a: 1.0};

        //var spriteAlignment = THREE.SpriteAlignment.topLeft;

        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        context.font = "Bold " + fontsize + "px " + fontface;

        // get size data (height depends only on font size)
        var metrics = context.measureText(message);
        var textWidth = metrics.width;

        // background color
        context.fillStyle = "rgba(" + backgroundColor.r + "," + backgroundColor.g + ","
            + backgroundColor.b + "," + backgroundColor.a + ")";
        // border color
        context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + ","
            + borderColor.b + "," + borderColor.a + ")";

        context.lineWidth = borderThickness;
        this.roundRect(context, borderThickness / 2, borderThickness / 2, textWidth + borderThickness, fontsize * 1.4 + borderThickness, 6);
        // 1.4 is extra height factor for text below baseline: g,j,p,q.

        // text color
        context.fillStyle = "rgba(0, 0, 0, 1.0)";

        context.fillText(message, borderThickness, fontsize + borderThickness);

        // canvas contents will be used for a texture
        let texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;

        var spriteMaterial = new THREE.SpriteMaterial(
            {map: texture, fog: true}); //,alignment: spriteAlignment

        var sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(5, 2.5, 1);

        sprite.position.normalize();
        return sprite;
    }


    initAxis(y) {
        var material = new THREE.LineBasicMaterial({
            color: 0x000000 //black
        });


        var geometry = new THREE.Geometry();
        geometry.vertices.push(
            new THREE.Vector3(-0.7, -2, 0),
            new THREE.Vector3(-0.7, y + 0.7, 0),
            new THREE.Vector3(3, y + 0.7, 0),
            new THREE.Vector3(-0.7, y + 0.7, 0),
            new THREE.Vector3(-0.7, y + 0.7, 3)
        );

        var line = new THREE.Line(geometry, material);



        return line;
    }


    generateGridlines(y) {
        let arrayOfLines = [];
        let materialDashed = new THREE.Line({
            color: 0x000000 //black
        });

        /*
        for (let i = 0; i < 5; i++) {
            let geometry = new THREE.Geometry();

            geometry.vertices.push(
                new THREE.Vector3(-0.7, -2, i),
                new THREE.Vector3(-0.7, y + 0.7, i),
                new THREE.Vector3(3, y + 0.7, i)
            );

            let helpLine = new THREE.Line(geometry, materialDashed);
            arrayOfLines.push(helpLine);
        }
        */

        let geometry = new THREE.Geometry();

        geometry.vertices.push(
            new THREE.Vector3(-0.7, -2, 1),
            new THREE.Vector3(-0.7, y + 0.7, 1),
            new THREE.Vector3(3, y + 0.7, 1)
        );

        let helpLine = new THREE.Line(geometry, materialDashed);


        return helpLine;
    }


}

export default Axis
