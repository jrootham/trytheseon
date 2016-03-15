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
import {EditLayout} from "./editLayout";

export const SIZE_RECT = 20;
export const PICTURE_RECT = 40;
const BORDER_SIZE = 15;

export const nothing = () => {};

export default class Edit extends React.Component{
    start = {
        x: 0,
        y :0
    };

    point = {
        x: 0,
        y: 0
    };

    continue = false;

    onPointerDown(event) {
        this.point.x = event.clientX;
        this.point.y = event.clientY;

        let [x, y] = this.fixXY(this.point);

        this.start.x = x;
        this.start.y = y;

        switch (this.props.store.display.which) {
            case Constants.layout.NOTHING:
                break;

            case Constants.layout.SIZE:
                EditSize.start(this);
                break;

            default:
                EditLayout.start(this);
                break;
        }
    }

    fixXY(raw) {
        let box = this.canvasRef.getBoundingClientRect();
        let x = (raw.x - box.left) - BORDER_SIZE;
        let y = (raw.y - box.top) - BORDER_SIZE;
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
        let size = this.props.store.data.size;
        let width = size.width;
        let height = size.height;

        const style = {
            display:  "inline-block",
            overflow: "auto"
        };

        const canvasStyle = {
            borderStyle:    "solid",
            borderWidth:    BORDER_SIZE + "px",
            borderColor:    "red"
        };

        return <div style={style}>
            <canvas id="canvas" style={canvasStyle} width={width} height={height}
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
    }
};

export const getSizePoints = size => {
    let left = size.width - SIZE_RECT;
    let top = size.height - SIZE_RECT;
    let midBottom = Math.round(left / 2);
    let midSide = Math.round(top / 2);

    return [left, top, midBottom, midSide];
};

export const getPicturePoints = picture => {
    const boxSize = PICTURE_RECT / picture.scale;
    const width = picture.clipWidth * picture.factor;
    const height = picture.clipHeight * picture.factor;

    let left = width - boxSize;
    let top = height - boxSize;
    let midSide = Math.round(top / 2);

    return [left, top, midSide];
};
