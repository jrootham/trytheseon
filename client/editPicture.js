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

import {Constants, setFactor} from "./data"
import {redraw} from "./index";
import {inBox, inRect, getPicturePoints ,PICTURE_RECT} from "./edit";
import {expand, left, right, flip} from "./imageProcess";
import {transparentColour, transparentEdges, transparentSpeckles, reset} from "./imageProcess";
import {dashedLine, drawBoxList, inBoxList} from "./common";

const BUFFER = 15;
const TARGET = 30;

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

const makeTransform = (store, transform) => {
    return () => {
        let picture = store.data.pictures[store.display.which];
        transform(picture.image).then(image =>{
            picture.setImage(image);
            setFactor(picture);
            redraw();
        });
        ;
    }
};

class Orient extends React.Component{
    render() {
        return <div className="control_container">
            <div>Orient</div>
            <div>
                <button onClick={makeTransform(this.props.store, left)}>
                    Left
                </button>
            </div>
            <div>
                <button onClick={makeTransform(this.props.store, right)}>
                    Right
                </button>
            </div>
            <div>
                <button onClick={makeTransform(this.props.store, flip)}>
                    Flip
                </button>
            </div>
        </div>
    }
};

const makeFlood = store => {
    return () => {
        store.display.picture.colourTransparent = true;
        redraw();
    }
}

const makeTransparent = (store, x, y) => {
    return () => {
        let picture = store.data.pictures[store.display.which];
        transparentColour(picture.image, x , y);
    }
};


const makeEdges = store => {
    return () => {
        transparentEdges(store.data.pictures[store.display.which]);
    }
}

const makeDespeckle = store => {
    return () => {
        transparentSpeckles(store.data.pictures[store.display.which]);
    }
}

const makeReset = store => {
    return () => {
        reset(store.data.pictures[store.display.which]);
    }
}

const makeDone = store => {
    return () => {
        store.display.page = Constants.page.LAYOUT;
        redraw();
    }
}

class Transparent extends React.Component{
    render() {
        const setTransparent = this.props.store.display.picture.colourTransparent;

        const transparentStyle = {
            style:  {
                border:  setTransparent ? "solid green 2px" : "none"
            }
        }

        const message = setTransparent ? "Pick spot" : "";

        return <div className="control_container">
            <div>Transparent</div>
            <div style={transparentStyle}>
                <button onClick={makeFlood(this.props.store)}>Colour</button>
            </div>
            <div>{message}</div>
            <div>
                <button onClick={makeEdges(this.props.store)}>Edges</button>
            </div>
            <div>
                <button onClick={makeDespeckle(this.props.store)}>Speckles</button>
            </div>
            {
//              <div>
//                  <button onClick={makeReset(this.props.store)}>Reset</button>
//              </div>
            }
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
                <button onClick={makeDone(this.props.store)}>Done</button>
            </div>
        </div>
    }
}

export default class EditPicture extends React.Component {
    start = {
        x: 0,
        y :0
    };

    point = {
        x: 0,
        y: 0
    };

    startCentroidX = 0;
    startCentroidY = 0;
    startLeftClipX = 0;
    startTopClipY = 0;
    startRightClipX = 0;
    startBottomClipY = 0;

    continue = false;

    getPictureData() {
        const store = this.props.store;
        const picture = store.data.pictures[store.display.which];
        const [x, y] = this.fixXY(this.point);

        const zoom = store.display.picture.zoom;

        return [store, zoom, picture, x, y];
    }

    setCentroidX(time) {
        const [store, zoom, picture, x, y] = this.getPictureData();
        let dX = (x - this.start.x) / zoom;
        picture.centroidX = this.startCentroidX + dX;

        if (this.continue) {
            paintAllPicture(store);
            window.requestAnimationFrame(this.setCentroidX.bind(this));
        }
        else {
            redraw();
        }
    }

    setCentroidY(time) {
        const [store, zoom, picture, x, y] = this.getPictureData();
        let dY = (y - this.start.y) / zoom;
        picture.centroidY = this.startCentroidY + dY;

        if (this.continue) {
            paintAllPicture(store);
            window.requestAnimationFrame(this.setCentroidY.bind(this));
        }
        else {
            redraw();
        }
    }

    onPointerDown(event) {
        this.point.x = event.clientX;
        this.point.y = event.clientY;

        const store = this.props.store;
        const index = store.display.which;

        const picture = store.data.pictures[index];
        let [x, y] = this.fixXY(this.point);

        this.start.x = x;
        this.start.y = y;

        if (store.display.picture.colourTransparent) {
            transparentColour(picture, x, y);
            store.display.picture.colourTransparent = false;
        }
        else {
            switch (store.display.picture.layout) {
                case Constants.picture.NOTHING:
                    break;

                case Constants.picture.CENTROID:
                    let [canvas, context, picture, zoom, width, height] = getInfo(store);
                    let x = picture.centroidX * zoom;
                    let y = picture.centroidY * zoom;

                    if (inBoxList(this.start, makeCentroidXList(x, height))) {
                        this.startCentroidX = picture.centroidX;
                        this.continue = true;
                        window.requestAnimationFrame(this.setCentroidX.bind(this));
                    }
                    else {
                        if (inBoxList(this.start, makeCentroidYList(y, width))) {
                            this.startCentroidY = picture.centroidY;
                            this.continue = true;
                            window.requestAnimationFrame(this.setCentroidY.bind(this));
                        }
                    }
                    break;

                case Constants.picture.CLIP:
                    break;
            }
        }
    }

    fixXY(raw) {
        let box = this.canvasRef.getBoundingClientRect();
        let x = raw.x - box.left;
        let y = raw.y - box.top;
        return [x, y];
    }

    onPointerMove(event) {
        if (this.continue) {
            this.point.x = event.clientX;
            this.point.y = event.clientY;
        }
    }

    onPointerUp(event) {
        this.continue = false;
        this.point.x = event.clientX;
        this.point.y = event.clientY;
    }

    onPointerOut(event) {
        this.continue = false;
    }

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

        const store = this.props.store;

        return <div style={builderStyle}>
            <div style={containerStyle}>
                <canvas id="builder-canvas"
                        style={canvasStyle}
                        ref={(ref) => this.canvasRef = ref}
                        onMouseMove={this.onPointerMove.bind(this)}
                        onMouseDown={this.onPointerDown.bind(this)}
                        onMouseUp={this.onPointerUp.bind(this)}
                        onMouseLeave={this.onPointerOut.bind(this)}
                        onTouchMove={this.onPointerMove.bind(this)}
                        onTouchDown={this.onPointerDown.bind(this)}
                        onTouchUp={this.onPointerUp.bind(this)}
                >
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

export const paintAllPicture = store => {
    paintPicture(store);
    paintOverlay(store);
};

const paintOverlay = store => {
    switch (store.display.picture.layout) {
        case Constants.picture.NOTHING:
            break;

        case Constants.picture.CENTROID:
            paintCentroid(store);
            break;

        case Constants.picture.CLIP:
            paintClip(store);
            break;
    }
};

const getInfo = store => {
    let canvas = document.getElementById("builder-canvas");
    let context = canvas.getContext("2d");

    let picture = store.data.pictures[store.display.which];
    let image = picture.image;
    let zoom = store.display.picture.zoom;
    let width = image.width * zoom;
    let height = image.height * zoom;

    return [canvas, context, picture, zoom, width, height]
};

const makeCentroidXList = (x, height) => {
    return [
        {left:x - TARGET / 2, top:1, size:TARGET},
        {left:x - TARGET / 2, top:height - (TARGET +1), size:TARGET}
    ];
}

const makeCentroidYList = (y, width) => {
    return [
        {left:1, top:y - TARGET / 2, size:TARGET},
        {left:width - (TARGET + 1), top:y - TARGET / 2, size:TARGET}
    ];
}

const paintCentroid = store => {
    let [canvas, context, picture, zoom, width, height] = getInfo(store);

    context.save();

    let x = picture.centroidX * zoom;
    dashedLine(context, x, 0, x, height);
    drawBoxList(context, makeCentroidXList(x, height));

    let y = picture.centroidY * zoom;
    dashedLine(context, 0, y, width, y);
    drawBoxList(context, makeCentroidYList(y, width));

    context.restore();
};

const paintClip = store => {
    let [canvas, context, picture, zoom, width, height] = getInfo(store);

    context.save();

    let x = picture.clipX * zoom;
    dashedLine(context, x, 0, x, height);
    drawBox(context, x - TARGET / 2, 0, TARGET);
    drawBox(context, x - TARGET / 2, (height - TARGET) / 2 , TARGET);
    drawBox(context, x - TARGET / 2, height - TARGET, TARGET);

    x = (picture.clipX + picture.clipWidth) * zoom;
    dashedLine(context, x, 0, x, height);
    drawBox(context, x - TARGET / 2, 0, TARGET);
    drawBox(context, x - TARGET / 2, (height - TARGET) / 2, TARGET);
    drawBox(context, x - TARGET / 2, height - TARGET, TARGET);

    let y = picture.clipY * zoom;
    dashedLine(context, 0, y, width, y);
    drawBox(context, 0, y - TARGET / 2, TARGET);
    drawBox(context, (width - TARGET) / 2, y - TARGET / 2, TARGET);
    drawBox(context, width - TARGET, y - TARGET / 2, TARGET);

    y = (picture.clipY + picture.clipHeight) * zoom;
    dashedLine(context, 0, y, width, y);
    drawBox(context, 0, y - TARGET / 2, TARGET);
    drawBox(context, (width - TARGET) / 2, y - TARGET / 2, TARGET);
    drawBox(context, width - TARGET, y - TARGET / 2, TARGET);

    context.restore();
};

const paintPicture = store => {
    let [canvas, context, picture, zoom, width, height] = getInfo(store);

    canvas.width = width;
    canvas.height = height;

    let image = picture.image;

    context.drawImage(image, 0, 0, image.width, image.height,
        0, 0, width, height);
};
