/**
 * editPicture.js
 *
 * Created by jrootham on 18/01/16.
 *
 * Copyright © 2016 Jim Rootham
 */
import React from "react";
import ReactDOM from "react-dom";
import RadioGroup from "react-radio";

import {Constants} from "./data"
import {redraw} from "./index";
import {inBox, inRect, getPicturePoints ,PICTURE_RECT} from "./edit";
import {expand} from "./imageProcess";

const BUFFER = 15;

class Zoom extends React.Component {
    render() {
        var zoom = [
            {
                value: 1 / 16,
                label: "1 / 16",
                style: {display:"block"}
            },
            {
                value: 1 / 8,
                label: "1 / 8",
                style: {display:"block"}
            },
            {
                value: 1 / 4,
                label: "1 / 4",
                style: {display:"block"}
            },
            {
                value: 1 / 2,
                label: "1 / 2",
                style: {display:"block"}
            },
            {
                value: 1,
                label: "1",
                style: {display:"block"}
            },
            {
                value: 2,
                label: "2",
                style: {display:"block"}
            },
            {
                value: 4,
                label: "4",
                style: {display:"block"}
            },
            {
                value: 8,
                label: "8",
                style: {display:"block"}
            }
        ];

        const makeChange = store => {
            return (value, event) => {
                store.display.picture.zoom = parseFloat(value);
                redraw();
            }
        }

        return <div className="control_container">
            Zoom
            <RadioGroup
                name="zoom"
                defaultValue={1}
                items={zoom}
                onChange={makeChange(this.props.store)}
            />
        </div>
    }
}


const makeLeft = store => {

};

const makeRight = store => {

};

const makeFlip = store => {

};


class Orient extends React.Component{
    render() {
        return <div className="control_container">
            <div>Orient</div>
            <div>
                <button onClick={makeLeft(this.props.store)}>Left</button>
            </div>
            <div>
                <button onClick={makeRight(this.props.store)}>Right</button>
            </div>
            <div>
                <button onClick={makeFlip(this.props.store)}>Flip</button>
            </div>
        </div>
    }
};

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

class Transparent extends React.Component{
    flood(event) {
        transformImageData(transparentColour, event);
    }

    edges(event) {
        transformImageData(transparentEdges, event);
    }

    despeckle(event) {
        transformImageData(transparentSpeckles, event);
    }

    reset(event) {

    }

    done(event) {
        this.props.store.display.which = Constants.NONE;
        hide("picture");
        redraw();
    }

    render() {
        return <div className="control_container">
            <div>Transparent</div>
            <div>
                <button onClick={this.flood}>Colour</button>
            </div>
            <div>
                <button onClick={this.edges}>Edges</button>
            </div>
            <div>
                <button onClick={this.despeckle}>Speckles</button>
            </div>
            <div>
                <button onClick={this.reset}>Reset</button>
            </div>
        </div>
    }
}

class Overlay extends React.Component {
    render() {
        const overlay = [
            {
                value: Constants.picture.NOTHING,
                label: "Nothing",
                style: {display:"block"}
            },
            {
                value: Constants.picture.CLIP,
                label: "Clip",
                style: {display:"block"}
            },
            {
                value: Constants.picture.CENTROID,
                label: "Centroid",
                style: {display:"block"}
            }
        ];

        const makeChange = store => {
            return (value, event) => {
                store.display.picture.layout = parseInt(value);
                redraw();
            }
        };


        return <div className="control_container">
            Set
            <RadioGroup
                name="overlay"
                defaultValue={Constants.picture.NOTHING}
                items={overlay}
                onChange={makeChange(this.props.store)}
            />
        </div>
    }
}

class Features extends React.Component {
    render() {
        return <div>
            <Zoom store={this.props.store}/>
            <Orient store={this.props.store}/>
            <Transparent store={this.props.store}/>
            <Overlay store={this.props.store}/>
            <div>
                <button onClick={this.done}>Done</button>
            </div>
        </div>
    }
}

export default class EditPicture extends React.Component {
    render() {
        const builderStyle = {
            height:     95 + "vh"
        };

        const containerStyle = {
            display:    "inline-block",
            width:      (Constants.MAX_WIDTH + BUFFER) + "px",
            height:     (Constants.MAX_HEIGHT + BUFFER) + "px",
            overflow:   "scroll"
        };

        const canvasStyle ={

        };

        const invisible = {
            display:    "none"
        };

        const controllersStyle = {
            display:        "inline-block",
            verticalAlign:  "top"
        };

        return <div style={builderStyle}>
            <div style={containerStyle}>
                <canvas id="builder-canvas" style={canvasStyle}>
                    Canvas not supported
                </canvas>
                <div style={invisible}>
                    <canvas id="invisible">Not supported</canvas>
                </div>
            </div>
            <div style={controllersStyle} className="control_container">
                <Features store={this.props.store} />
            </div>
        </div>
    }
}

export const paintPicture = store => {
    let canvas = document.getElementById("builder-canvas");
    let picture = store.data.pictures[store.display.which];
    let image = picture.image;
    let zoom = store.display.picture.zoom;
    let width = image.width * zoom;
    let height = image.height * zoom;

    canvas.width = width;
    canvas.height = height;

    let context = canvas.getContext("2d");
    context.save();

    if (zoom > 1) {
        const invisible = document.getElementById("invisible");
        image = expand(invisible, image, zoom);
    }

    context.drawImage(image, 0, 0, image.width, image.height,
        0, 0, width, height);

    context.restore();
};
