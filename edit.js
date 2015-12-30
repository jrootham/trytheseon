/**
 * edit.js
 *
 * Created by jrootham on 27/12/15.
 *
 * Copyright © 2015 Jim Rootham
 */
import React from "react";
import ReactDOM from "react-dom";

import {Constants} from "./data.js";

console.log(Constants);

const SIZE_RECT = 30;
const PICTURE_RECT = 20;

const nothing = () => {};

let startEvent = nothing;
let displayOverlay = nothing;

export const Edit = React.createClass({
    componentDidMount: function() {
        console.log("Mounting");
        paintAll(this.props.store);
    },

    render: function() {
        let width = this.props.store.data.size.width;
        let height = this.props.store.data.size.height;
        return <div id="edit">
            <canvas id="canvas" width={width} height={height}>
                Canvas not supported
            </canvas>
        </div>
    }
});

export const setOverlay = store => {
    switch (store.display.which) {
        case Constants.NONE:
            startEvent = nothing;
            displayOverlay = nothing;
            paint(store);
            break;

        case Constants.SIZE:
            startEvent = nothing;
            displayOverlay = sizeOverlay;
            paintAll(store);
            break;
    }
};

const sizeOverlay = store => {
    let canvas = document.getElementById("canvas");
    let context = canvas.getContext("2d");
    context.save();

    let [left, top, midBottom, midSide] = getSizePoints(store.data.size);

    drawBox(context, left, top, SIZE_RECT);
    drawBox(context, left, midSide, SIZE_RECT);
    drawBox(context, midBottom, top, SIZE_RECT);

    context.restore();
};

const getSizePoints = size => {
    let left = size.width - SIZE_RECT;
    let top = size.height - SIZE_RECT;
    let midBottom = Math.round(left / 2);
    let midSide = Math.round(top / 2);

    return [left, top, midBottom, midSide];
};


const drawBox = (context, left, top, size) => {
    context.strokeStyle = "black";
    context.strokeRect(left, top, size, size);

    context.fillStyle = "white";
    context.fillRect(left, top, size, size);
};

const paint = store => {
    let canvas = document.getElementById("canvas");
    let context = canvas.getContext("2d");
    context.save();

    context.fillStyle = "white";
    context.fillRect(0, 0, store.data.size.width, store.data.size.height);

    context.restore();
};

export const paintAll = store => {
    paint(store);
    displayOverlay(store);
};
