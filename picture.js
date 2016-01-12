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
import {show, hide, redraw} from "./contents.js";
import {nothing} from "./edit.js";

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

const Builder = React.createClass({
    setPicture: function() {
        let canvas = document.getElementById("builder-canvas");
        let localPictureList = this.props.pictures;
        createImageBitmap(canvas).then(function(image) {
            localPicture.image = image;
            localPictureList.push(localPicture.copy());
            hide("builder");
            redraw();
        });
    },

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
                <div id="orient">
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
            </div>
        </div>
    }
});

const paint = setTransform => {
    let canvas = document.getElementById("builder-canvas");
    let context = canvas.getContext("2d");
    context.save();

    context.fillStyle = "white";
    context.fillRect(0, 0, Constants.MAX_WIDTH, Constants.MAX_HEIGHT);

    setTransform(context);
    context.drawImage(localPicture.image, 0, 0);

    context.restore();
};

const LocalNone = React.createClass({
    render: function() {
        return <div id="localNone">
            <div>
                No Files Selected
            </div>
            <div>
                <button onClick = {()=>{hide("localNone")}} >
                    OK
                </button>
            </div>
        </div>
    }
});

const Local = React.createClass({
    getFile: function() {
        let fileInput = document.getElementById("localFile");
        let fileList = fileInput.files;
        let pictureArray = this.props.data.pictures;

        if (fileList.length > 0) {
            let file = fileList[0];
            createImageBitmap(file).then(function(image) {
                localPicture = new Picture(image);
                localPicture.name = `Picture ${pictureArray.length}`;
                show("builder");
                paint(nothing);
            });
            hide("local");
        }
        else {
            show("localNone");
        }
    },

    render: function() {
        return <div id="local">
            <div>
                <input id="localFile" type="file"/>
            </div>
            <div>
                <div className="left">
                    <button onClick = {()=>{hide("local")}}>Cancel</button>
                </div>
                <div className="right">
                    <button onClick = {this.getFile}>OK</button>
                </div>
                <LocalNone />
            </div>
        </div>
    }
});

export const PictureEditor = React.createClass({
    local: function() {
        show ("local");
    },

    render: function()  {
        return <div id="picture">
            <div>
                Picture
            </div>
            <div>
                <button onClick={this.local}>Load from local</button>
            </div>
            <Local data = {this.props.store.data} />
            <Builder pictures = {this.props.store.data.pictures} />
            <div>
                <button>Load from server</button>
            </div>
        </div>

    }
});

