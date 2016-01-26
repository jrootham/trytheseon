/**
 * edit.js
 *
 * Created by jrootham on 27/12/15.
 *
 * Copyright © 2015 Jim Rootham
 */
import React from "react";
import ReactDOM from "react-dom";

import {Constants} from "./data";
import {EditSize} from "./editSize";
import {EditPicture} from "./editPicture";

export const SIZE_RECT = 20;
export const PICTURE_RECT = 40;
const BORDER_SIZE = 15;

export const nothing = () => {};

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

        console.log("mousedown", x, y);

        this.start.x = x;
        this.start.y = y;

        switch (this.props.store.display.which) {
            case Constants.NONE:
                break;

            case Constants.SIZE:
                EditSize.start(this);
                break;

            default:
                EditPicture.start(this);
                break;
        }
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

export const inBox = (point, left, top, size) => {
    return inRect(point, left, top, size, size);
}

export const inRect = (point, left, top, width, height) => {
    let x = point.x;
    let y = point.y;
    let result = x > left && y > top && x < left + width && y < top + height;

    console.log(x, y, left, top, width, height, result);
    return result;
};

export const getSizePoints = size => {
    let left = size.width - SIZE_RECT;
    let top = size.height - SIZE_RECT;
    let midBottom = Math.round(left / 2);
    let midSide = Math.round(top / 2);

    return [left, top, midBottom, midSide];
};

export const getPicturePoints = picture => {
    let boxSize = PICTURE_RECT / (picture.scale * picture.ratio);

    let left = picture.image.width - boxSize;
    let top = picture.image.height - boxSize;
    let midSide = Math.round(top / 2);

    return [left, top, midSide];
};
