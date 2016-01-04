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
import {redraw} from "./contents.js";

const SIZE_RECT = 20;
const PICTURE_RECT = 20;
const BORDER_SIZE = 15;

const nothing = () => {};

let displayOverlay = nothing;

export const Edit = React.createClass({
    start: {
        x: 0,
        y :0
    },

    point: {
        x: 0,
        y: 0
    },

    continue: false,

    onPointerDown: function(event) {
        this.point.x = event.clientX;
        this.point.y = event.clientY;

        let [x, y] = this.fixXY(this.point);

        this.start.x = x;
        this.start.y = y;

        let size = this.props.store.data.size;
        let [left, top, midBottom, midSide] = getSizePoints(size);

        if (inBox(this.start, left, top, SIZE_RECT)) {
            this.continue = true;
            this.startWidth = this.props.store.data.size.width;
            this.startHeight = this.props.store.data.size.height;
            window.requestAnimationFrame(this.setSize);
        }
        else if (inBox(this.start, left, midSide, SIZE_RECT)){
            this.continue = true;
            this.startWidth = this.props.store.data.size.width;
            window.requestAnimationFrame(this.setWidth);
        }
        else if (inBox(this.start, midBottom, top, SIZE_RECT)){
            this.continue = true;
            this.startHeight = this.props.store.data.size.height;
            window.requestAnimationFrame(this.setHeight);
        }
    },

    setSize: function(timestamp) {
        let [x, y] = this.fixXY(this.point);
        let dx = x - this.start.x;
        let dy = y - this.start.y;

        let scale = 1.0;

        if (dx < dy ) {
            scale = x / this.start.x;
        }
        else {
            scale = y / this.start.y;
        }

        scale = Math.min(Constants.MAX_WIDTH / this.startWidth, scale);
        scale = Math.max(Constants.MIN_WIDTH / this.startWidth, scale);
        scale = Math.min(Constants.MAX_HEIGHT / this.startHeight, scale);
        scale = Math.max(Constants.MIN_HEIGHT / this.startHeight, scale);

        this.props.store.data.size.width = Math.round(this.startWidth * scale);
        this.props.store.data.size.height = Math.round(this.startHeight * scale);

        if (this.continue) {
            window.requestAnimationFrame(this.setSize);
        }
        redraw();
    },

    setWidth: function(timestamp) {
        let [x, y] = this.fixXY(this.point);
        let width = this.startWidth + (x - this.start.x);
        width = Math.min(Constants.MAX_WIDTH, width);
        width = Math.max(Constants.MIN_WIDTH, width);
        this.props.store.data.size.width = width;
        if (this.continue) {
            window.requestAnimationFrame(this.setWidth);
        }
        redraw();
    },

    setHeight: function(timestamp) {
        let [x, y] = this.fixXY(this.point);
        let height = this.startHeight + (y - this.start.y);
        height = Math.min(Constants.MAX_HEIGHT, height);
        height = Math.max(Constants.MIN_HEIGHT, height);
        this.props.store.data.size.height = height;
        if (this.continue) {
            window.requestAnimationFrame(this.setHeight);
        }
        redraw();
    },

    fixXY: function(raw) {
        let box = this.canvasRef.getBoundingClientRect();
        let x = (raw.x - box.left) - BORDER_SIZE;
        let y = (raw.y - box.top) - BORDER_SIZE;
        return [x, y];
    },

    onPointerMove: function (event) {
        if (this.continue) {
            this.point.x = event.clientX;
            this.point.y = event.clientY;
        }
    },

    onPointerUp: function (event) {
        this.continue = false;
        this.point.x = event.clientX;
        this.point.y = event.clientY;
    },

    onPointerOut: function (event) {
        this.continue = false;
    },

    render: function() {
        let size = this.props.store.data.size;
        let width = size.width;
        let height = size.height;

        return <div id="edit">
            <canvas id="canvas" width={width} height={height}
                    ref={(ref) => this.canvasRef = ref}
                    onMouseMove={this.onPointerMove}
                    onMouseDown={this.onPointerDown}
                    onMouseUp={this.onPointerUp}
                    onMouseLeave={this.onPointerOut}
                    onTouchMove={this.onPointerMove}
                    onTouchDown={this.onPointerDown}
                    onTouchUp={this.onPointerUp}
                >
                Canvas not supported
            </canvas>
        </div>
    }
});

const inBox = (point, left, top, size) => {
    let x = point.x;
    let y = point.y;
    return x > left && y > top && x < left + size && y < top + size;
};

export const setOverlay = store => {
    switch (store.display.which) {
        case Constants.NONE:
            displayOverlay = nothing;
            paint(store);
            break;

        case Constants.SIZE:
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
