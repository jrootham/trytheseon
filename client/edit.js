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
import {EditSize} from "./editSize.js";

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

    editor: undefined,

    continue: false,

    onPointerDown: function(event) {
        this.point.x = event.clientX;
        this.point.y = event.clientY;

        let [x, y] = this.fixXY(this.point);

        this.start.x = x;
        this.start.y = y;

        switch (this.props.store.display.which) {
            case Constants.NONE:
                this.editor = undefined;
                break;

            case Constants.SIZE:
                this.editor = new EditSize(this);
                break;

            default:
                this.editor = undefined;
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
    let x = point.x;
    let y = point.y;
    return x > left && y > top && x < left + size && y < top + size;
};

export const getSizePoints = size => {
    let left = size.width - SIZE_RECT;
    let top = size.height - SIZE_RECT;
    let midBottom = Math.round(left / 2);
    let midSide = Math.round(top / 2);

    return [left, top, midBottom, midSide];
};
