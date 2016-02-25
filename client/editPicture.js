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
import {expand, left, right, flip} from "./imageProcess";
import {transparentColour, transparentEdges, transparentSpeckles, reset} from "./imageProcess";

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
            picture.image = image;
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
            <div>
                <button onClick={makeReset(this.props.store)}>Reset</button>
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

    continue = false;

    makeOnPointerDown() {
        const that = this;
        return event => {
            that.point.x = event.clientX;
            that.point.y = event.clientY;

            const store = that.props.store;
            const index = store.display.which;

            const picture = store.data.pictures[index];
            let [x, y] = that.fixXY(that.point, store.display.picture.zoom);

            that.start.x = x;
            that.start.y = y;

            if (store.display.picture.colourTransparent) {
                transparentColour(picture, x, y);
                store.display.picture.colourTransparent = false;
            }
            else {
                switch (store.display.picture.layout) {
                    case Constants.picture.NOTHING:
                        break;
                }
            }
        }
    }

    fixXY(raw, zoom) {
        let box = this.canvasRef.getBoundingClientRect();
        let x = raw.x - box.left;
        let y = raw.y - box.top;
        return [Math.round(x / zoom), Math.round(y /zoom)];
    }

    makeOnPointerMove() {
        const that = this;
        return event => {
            if (that.continue) {
                that.point.x = event.clientX;
                that.point.y = event.clientY;
            }
        }
    }

    makeOnPointerUp() {
        const that = this;
        return event => {
            that.continue = false;
            that.point.x = event.clientX;
            that.point.y = event.clientY;
        }
    }

    makeOnPointerOut() {
        const that = this;
        return event => {
            that.continue = false;
        }
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
                        onMouseMove={this.makeOnPointerMove()}
                        onMouseDown={this.makeOnPointerDown()}
                        onMouseUp={this.makeOnPointerUp()}
                        onMouseLeave={this.makeOnPointerOut()}
                        onTouchMove={this.makeOnPointerMove()}
                        onTouchDown={this.makeOnPointerDown()}
                        onTouchUp={this.makeOnPointerUp()}
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

    if (zoom > 1) {
        const invisible = document.getElementById("invisible");
        image = expand(invisible, image, zoom);
    }

    context.drawImage(image, 0, 0, image.width, image.height,
        0, 0, width, height);
};
