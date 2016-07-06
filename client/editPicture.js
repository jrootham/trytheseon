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

import {Constants, setFactor,Scene,ScenePicture} from "./data"
import {redraw} from "./index";
import {inBox, inRect ,PICTURE_RECT} from "./edit";
import {expand, left, right, flip} from "./imageProcess";
import {transparentColour, transparentEdges, transparentSpeckles, reset} from "./imageProcess";
import {dashedLine, drawBoxList, inBoxList} from "./common";
import persistence from "./persistence";

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
        const picture = store.picture;
        transform(picture.image).then(image =>{
            picture.setImage(image);
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

const makeEdges = store => {
    return () => {
        transparentEdges(store.picture);
    }
}

const makeDespeckle = store => {
    return () => {
        transparentSpeckles(store.picture);
    }
}

const makeReset = store => {
    return () => {
        reset(store.picture);
    }
}

const makeDone = store => {
    return () => {
        const scenePicture = new ScenePicture(store.picture);
        if (store.scene) {
            store.scene.add(scenePicture);
            store.display.which = store.scene.scenePictures.length - 1;
        }
        else {
            const scene = new Scene(Constants.MAX_WIDTH, Constants.MAX_HEIGHT, [scenePicture]);
            store.scene = scene;
            store.display.which = store.scene.scenePictures.length - 1;
        }
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

class Values extends React.Component {
    render() {
        let result = <div></div>

        const store = this.props.store;

        const picture = store.picture;
        result = <div className="control_container">
            <div>Values</div>
            <div>Name:{picture.name}</div>
            <div>Left:{picture.clipX}</div>
            <div>Top:{picture.clipY}</div>
            <div>Width:{picture.clipWidth}</div>
            <div>Height:{picture.clipHeight}</div>
            <div>Centroid X:{picture.centroidX}</div>
            <div>Centroid Y:{picture.centroidY}</div>
        </div>

        return result;
    }
}

const handleError = (store, error) => {
    store.display.error = error.message;
    store.display.page = Constants.page.START;
    redraw();
};

const makePictureURL = picture => {
    let canvas = document.getElementById("invisible");
    let context = canvas.getContext("2d");

    let image = picture.image;

    canvas.width = image.width;
    canvas.height = image.height;

    context.drawImage(image, 0, 0, image.width, image.height);

    const result = canvas.toDataURL();
    return `"${result}"`;
};

const convert = picture => {
    return {
        name: `${picture.name}`,
        clipX: picture.clipX,
        clipY: picture.clipY,
        clipWidth: picture.clipWidth,
        clipHeight: picture.clipHeight,
        centroidX: picture.centroidX,
        centroidY: picture.centroidY,
        image: makePictureURL(picture)
    }
};


const makeSavePicture = store => {
    const savePicture = () => {

        if (store.signon.on) {
            if (store.picture.id === 0) {
                const promise = persistence.savePicture(convert(store.picture));
                promise.then(result => {
                    if ("errors" in result) {
                        handleError(store, result.errors[0]);
                    }
                    else {
                        store.display.error = undefined;
                        store.picture.id = result.data.savePicture.id;
                    }
                });
            }
            else {
                const data = convert(store.picture);
                data.id = store.picture.id;
                const promise = persistence.updatePicture(data);
                promise.then(result => {
                    store.display.error = undefined;

                    if ("errors" in result) {
                        handleError(store, result.errors[0]);
                    }
                });
            }
        }
        else {
            handleError(store, new Error("Not signed on"));
        }
    };

    return savePicture;
};

class Features extends React.Component {
    render() {
        return <div>
            <Zoom store={this.props.store}/>
            <Orient store={this.props.store}/>
            <Transparent store={this.props.store}/>
            <Overlay store={this.props.store}/>
            <Values store={this.props.store}/>
            <div>
                <button onClick={makeDone(this.props.store)}>Done</button>
            </div>
            <div>
                <button onClick={makeSavePicture(this.props.store)}>Save</button>
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
    startClipX = 0;
    startClipY = 0;
    startClipWidth = 0;
    startClipHeight = 0;

    continue = false;

    getPictureData() {
        const store = this.props.store;
        const picture = store.picture;
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

    setClipX(time) {
        const [store, zoom, picture, x, y] = this.getPictureData();
        const dX = (x - this.start.x) / zoom;
        let newClipX = this.startClipX + dX;
        let newClipWidth = this.startClipWidth - dX;

        picture.clipX = newClipX;
        picture.clipWidth = newClipWidth;

        if (this.continue) {
            paintAllPicture(store);
            window.requestAnimationFrame(this.setClipX.bind(this));
        }
        else {
            redraw();
        }
    }

    setClipWidth(time) {
        const [store, zoom, picture, x, y] = this.getPictureData();
        let dX = (x - this.start.x) / zoom;
        let newClipX = this.startClipX;
        let newClipWidth = this.startClipWidth + dX;

        picture.clipX = newClipX;
        picture.clipWidth = newClipWidth;

        if (this.continue) {
            paintAllPicture(store);
            window.requestAnimationFrame(this.setClipWidth.bind(this));
        }
        else {
            redraw();
        }
    }

    setClipY(time) {
        const [store, zoom, picture, x, y] = this.getPictureData();
        const dY = (y - this.start.y) / zoom;

        let newClipY = this.startClipY + dY;
        let newClipHeight = this.startClipHeight - dY;

        picture.clipY = newClipY;
        picture.clipHeight = newClipHeight;

        if (this.continue) {
            paintAllPicture(store);
            window.requestAnimationFrame(this.setClipY.bind(this));
        }
        else {
            redraw();
        }
    }

    setClipHeight(time) {
        const [store, zoom, picture, x, y] = this.getPictureData();
        const dY = (y - this.start.y) / zoom;

        let newClipY = this.startClipY;
        let newClipHeight = this.startClipHeight + dY;

        picture.clipY = newClipY;
        picture.clipHeight = newClipHeight;

        if (this.continue) {
            paintAllPicture(store);
            window.requestAnimationFrame(this.setClipHeight.bind(this));
        }
        else {
            redraw();
        }
    }

    onPointerDown(event) {
        this.point.x = event.clientX;
        this.point.y = event.clientY;

        let [x, y] = this.fixXY(this.point);

        this.start.x = x;
        this.start.y = y;

        const store = this.props.store;
        const [canvas, context, picture, zoom, width, height] = getInfo(store);

        if (store.display.picture.colourTransparent) {
            transparentColour(picture, Math.round(x/zoom), Math.round(y/zoom));
            store.display.picture.colourTransparent = false;
        }
        else {
            switch (store.display.picture.layout) {
                case Constants.picture.NOTHING:
                    break;

                case Constants.picture.CENTROID:
                    const x = picture.centroidX * zoom;
                    const y = picture.centroidY * zoom;

                    if (inBoxList(this.start, makeCentroidXList(x, height))) {
                        this.startCentroidX = picture.centroidX;
                        this.continue = true;
                        window.requestAnimationFrame(this.setCentroidX.bind(this));
                    }
                    else if (inBoxList(this.start, makeCentroidYList(y, width))) {
                        this.startCentroidY = picture.centroidY;
                        this.continue = true;
                        window.requestAnimationFrame(this.setCentroidY.bind(this));
                    }
                    break;

                case Constants.picture.CLIP:
                    const leftX = picture.clipX * zoom;
                    const rightX = (picture.clipX + picture.clipWidth) * zoom;
                    const topY = picture.clipY * zoom;
                    const bottomY = (picture.clipY + picture.clipHeight) * zoom;

                    if (inBoxList(this.start, makeClipLeftList(leftX, height))) {
                        this.startClipX = picture.clipX;
                        this.startClipWidth = picture.clipWidth;
                        this.continue = true;
                        window.requestAnimationFrame(this.setClipX.bind(this));
                    }
                    else if (inBoxList(this.start, makeClipRightList(rightX, height))) {
                        this.startClipX = picture.clipX;
                        this.startClipWidth = picture.clipWidth;
                        this.continue = true;
                        window.requestAnimationFrame(this.setClipWidth.bind(this));
                    }
                    else if (inBoxList(this.start, makeClipTopList(topY, width))) {
                        this.startClipY = picture.clipY;
                        this.startClipHeight = picture.clipHeight;
                        this.continue = true;
                        window.requestAnimationFrame(this.setClipY.bind(this));
                    }
                    else if (inBoxList(this.start, makeClipBottomList(bottomY, width))) {
                        this.startClipY = picture.clipY;
                        this.startClipHeight = picture.clipHeight;
                        this.continue = true;
                        window.requestAnimationFrame(this.setClipHeight.bind(this));
                    }
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
            </div>
            <div style={controllersStyle} className="control_container">
                <Features store={this.props.store} />
            </div>
        </div>
    }

    componentDidMount() {
        paintAllPicture(this.props.store);
    }

    componentDidUpdate(prevProps, prevState) {
        paintAllPicture(this.props.store);
    }
}

export const paintAllPicture = store => {
    if (store.picture) {
        paintPicture(store);
        paintOverlay(store);
    }
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

    let picture = store.picture;
    let image = picture.image;
    let zoom = store.display.picture.zoom;
    let width = image.width * zoom;
    let height = image.height * zoom;

    return [canvas, context, picture, zoom, width, height]
};

const makeCentroidXList = (x, height) => {
    return [
        {left:x - TARGET / 2, top:1, scene:TARGET},
        {left:x - TARGET / 2, top:height - (TARGET +1), scene:TARGET}
    ];
}

const makeCentroidYList = (y, width) => {
    return [
        {left:1, top:y - TARGET / 2, scene:TARGET},
        {left:width - (TARGET + 1), top:y - TARGET / 2, scene:TARGET}
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

const makeClipLeftList = (x, height) => {
    return [
        {left:x - TARGET / 2, top:1, scene:TARGET},
        {left:x - TARGET / 2, top:(height - TARGET) / 2, scene:TARGET},
        {left:x - TARGET / 2, top:height - (TARGET + 1), scene:TARGET}
    ];
}

const makeClipRightList = (x, height) => {
    return [
        {left: x - TARGET / 2, top: 1, scene: TARGET},
        {left: x - TARGET / 2, top: (height - TARGET) / 2, scene: TARGET},
        {left: x - TARGET / 2, top: height - (TARGET + 1), scene: TARGET}
    ];
}

const makeClipTopList = (y, width) => {
    return [
        {left:1, top:y - TARGET / 2, scene:TARGET},
        {left:(width - TARGET) / 2, top:y - TARGET / 2, scene:TARGET},
        {left:width - (TARGET + 1), top:y - TARGET / 2, scene:TARGET}
    ];
}

const makeClipBottomList = (y, width) => {
    return [
        {left: 1, top: y - TARGET / 2, scene: TARGET},
        {left: (width - TARGET) / 2, top: y - TARGET / 2, scene: TARGET},
        {left: width - (TARGET + 1), top: y - TARGET / 2, scene: TARGET}
    ];
}

const paintClip = store => {
    let [canvas, context, picture, zoom, width, height] = getInfo(store);

    context.save();

    let x = picture.clipX * zoom;
    dashedLine(context, x, 0, x, height);
    drawBoxList(context, makeClipLeftList(x, height));

    x = (picture.clipX + picture.clipWidth) * zoom;
    dashedLine(context, x, 0, x, height);
    drawBoxList(context, makeClipRightList(x, height));

    let y = picture.clipY * zoom;
    dashedLine(context, 0, y, width, y);
    drawBoxList(context, makeClipTopList(y, width));

    y = (picture.clipY + picture.clipHeight) * zoom;
    dashedLine(context, 0, y, width, y);
    drawBoxList(context, makeClipBottomList(y, width));

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

