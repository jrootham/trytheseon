/**
 * picture.js
 *
 * Created by jrootham on 06/01/16.
 *
 * Copyright © 2016 Jim Rootham
 */
import React from "react";
import ReactDOM from "react-dom";

import {Constants, Picture} from "./data.js";
import {show, hide, redraw} from "./index.js";
import {nothing} from "./edit.js";

const BORDER_SIZE = 15;
const COLOUR_DISTANCE = 40;

let localPicture = undefined;
let tempImage = undefined;
let temp = [];

const scale = context => {
    let size = Math.min(localPicture.image.height, localPicture.image.width);
    let amount = Constants.MAX_HEIGHT / size;
    context.scale(amount, amount);
}

const left = () => {
    let transform = context => {
        scale(context);
        context.rotate(Math.PI / 2);
        context.translate(0, -localPicture.image.height);
    };

    paint(transform);
};

const right = () => {
    let transform = context => {
        scale(context);
        context.rotate(-Math.PI / 2);
        context.translate(-localPicture.image.width, 0);
    };

    paint(transform);
};

const flip = () => {
    let transform = context => {
        scale(context);
        context.rotate(Math.PI);
        context.translate(-localPicture.image.width, -localPicture.image.height);
    };

    paint(transform);
};

const plain = () => {
    let transform = context => {
        scale(context);
    };

    paint(transform);
};

const Orient = React.createClass({
    setPicture: function() {
        let canvas = document.getElementById("builder-canvas");
        let localStore = this.props.store;
        createImageBitmap(canvas).then(function(image) {
            localPicture.image = image;
            localStore.display.which = localStore.data.pictures.length;
            localStore.data.pictures.push(localPicture.copy());
            hide("orient");
            show("features");
        });
    },

    render: function() {
        return <div id="orient">
            <div>Orient</div>
            <div>
                <button onClick={left}>Left</button>
            </div>
            <div>
                <button onClick={right}>Right</button>
            </div>
            <div>
                <button onClick={flip}>Flip</button>
            </div>
            <div>
                <button onClick={plain}>Plain</button>
            </div>
            <div>
                <button onClick={this.setPicture}>Set</button>
            </div>
        </div>
    }
});

const transformImageData = (process, event) => {
    let canvas = document.getElementById("builder-canvas");
    let imageData = canvas.getImageData(0, 0, canvas.width, canvas.height);
    process(event, imageData);
    canvas.putImageData(0, 0);
};

const fixXY = raw => {
    let canvas = document.getElementById("builder-canvas");
    let box = canvas.getBoundingClientRect();
    let x = (raw.x - box.left) - BORDER_SIZE;
    let y = (raw.y - box.top) - BORDER_SIZE;
    return [x, y];
};

const index = (imageData, i, j, k) => {
    return k + (j * 4) + (i * 4 * imageData.width * j);
};

const transparentColour = (event, imageData) => {

};

const transparentEdges = (event, imageData) => {

};

const transparentSpeckles = (event, imageData) => {

};

const Features = React.createClass({
    flood: function(event) {
        transformImageData(transparentColour, event);
    },

    edges: function(event) {
        transformImageData(transparentEdges, event);
    },

    despeckle: function(event) {
        transformImageData(transparentSpeckles, event);
    },

    reset: function(event) {

    },

    done: function(event) {
        this.props.store.display.which = Constants.NONE;
        hide("picture");
        redraw();
    },

    render: function() {
        return <div id="features">
            <div>
                <button onClick={this.flood}>Set Colour Transparent</button>
            </div>
            <div>
                <button onClick={this.edges}>Set Edges Transparent</button>
            </div>
            <div>
                <button onClick={this.despeckle}>Set Speckles Transparent</button>
            </div>
            <div>
                <button onClick={this.reset}>Reset</button>
            </div>
            <div>
                <button onClick={this.done}>Done</button>
            </div>
        </div>
    }
});

const Builder = React.createClass({
render: function() {
        return <div id="builder">
            <div id="build-canvas-container">
                <canvas id="builder-canvas"
                        width={Constants.MAX_WIDTH}
                        height={Constants.MAX_HEIGHT}>
                    Canvas not supported
                </canvas>
            </div>
            <div id="build_controllers">
                <Features store={this.props.store} />
            </div>
        </div>
    }
});

const paint = setTransform => {
    let canvas = document.getElementById("builder-canvas");
    let context = canvas.getContext("2d");
    context.save();

    setTransform(context);
    context.drawImage(localPicture.image, 0, 0);

    context.restore();
};
