/**
 * Created by Timo on 24.01.2017.
 */
import * as THREE from "three";
//import TextToSVG from "text-to-svg";



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
    /*
    toBinaryInt(num) {
        "use strict";
        return (num >>> 0).toString(2);  // jshint ignore:line
    }



    getNextPowerOfTwo(num) {
       "use strict";

        if (num < 0) {
            throw new Error("Argument must be positive");
        }

        var bin_str = this.toBinaryInt(num - 1);

        if (bin_str.indexOf("0") < 0 || bin_str === "0") {
            return num;
        }
        else {
            return Math.pow(2, bin_str.length);
        }
    }

    adaptCanvasToText(canvas, message, font_size, font_face) {
        /**
         *  @author Marco Sulla (marcosullaroma@gmail.com)
         *  @date Feb 17, 2016


        "use strict";

        var context = canvas.getContext('2d');

        if (canvas.height > canvas.width) {
            canvas.width = canvas.height;
        }


        while (true) {
            var side = this.getNextPowerOfTwo(canvas.width);

            if (side < 128) {
                side = 128;
            }

            canvas.width = canvas.height = side;

            context.font = "Bold " + font_size + "pt " + font_face;

            var metrics = context.measureText(message);
            var text_width = metrics.width;
            var text_side = this.getNextPowerOfTwo(Math.max(text_width, font_size));

            if (text_side >= 128) {
                if (side !== text_side) {
                    canvas.width = text_side;
                    continue;
                }
            }
            else if (side !== 128) {
                continue;
            }
        }
    }
     */

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
            {map: texture, fog:true}); //,alignment: spriteAlignment

        var sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(5, 2.5, 1);

        sprite.position.normalize();
        return sprite;
    }







    initAxis(y) {

        var material = new THREE.LineBasicMaterial({
            color: 0xffffff
        });


        var geometry = new THREE.Geometry();

        //sets the axis 0.2 behind the last chart
        geometry.vertices.push(
            new THREE.Vector3(-0.7, -2, 0),
            new THREE.Vector3(-0.7, y+0.2, 0),
            new THREE.Vector3(3, y+0.2, 0),
            new THREE.Vector3(-0.7, y+0.2, 0),
            new THREE.Vector3(-0.7, y+0.2, 3)
        );



        var line = new THREE.Line(geometry, material);

        return line;
    }
}

export default Axis
