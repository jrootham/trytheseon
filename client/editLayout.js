/**
 * editLayout.js
 *
 * Created by jrootham on 17/02/16.
 *
 * Copyright © 2016 Jim Rootham
 */

import {PICTURE_RECT, getPicturePoints} from "./edit";
import {inBox, inRect} from "./common";
import {paintAll} from "./paint";
import {redraw} from "./index";

export const EditLayout = {
    start(parent) {
        this.parent = parent;
        let index = this.parent.props.store.display.which;
        this.picture = this.parent.props.store.data.pictures[index];

        let pictureWidth = this.picture.clipWidth;
        let pictureHeight = this.picture.clipHeight;

        let [left, top, midSide] = getPicturePoints(this.picture);

        this.constant = this.picture.copy();
        this.startPoint = map(this.constant, this.parent.start);

        const centroidX = this.picture.centroidX - this.picture.clipX;
        const centroidY = this.picture.centroidY - this.picture.clipY;

        let boxSize = PICTURE_RECT / (this.picture.scale * this.picture.factor);

        if (inBox(this.startPoint, left, top, boxSize)
            || inBox(this.startPoint, left, 0, boxSize)) {
            this.parent.continue = true;
            let dx = (this.startPoint.x - centroidX);
            let dy = (this.startPoint.y - centroidY);

            this.startLength = dist(dx, dy);
            this.startScale = this.picture.scale;
            window.requestAnimationFrame(setScale.bind(this));
        }
        else if (inBox(this.startPoint, 0, midSide, boxSize)) {
            this.parent.continue = true;
            let dx = this.startPoint.x - centroidX;
            let dy = this.startPoint.y - centroidY;
            this.startRotate = Math.atan2(dy, dx);
            window.requestAnimationFrame(setRotate.bind(this));
        }
        else if (inRect(this.startPoint, 0, 0, pictureWidth, pictureHeight)){
            this.parent.continue = true;
            this.startX = this.picture.translateX;
            this.startY = this.picture.translateY;
            window.requestAnimationFrame(setTranslate.bind(this));
        }
    }
}

const map = (picture, point) => {
    let x = point.x / picture.factor;
    let y = point.y / picture.factor;

    const centroidX = picture.centroidX - picture.clipX;
    const centroidY = picture.centroidY - picture.clipY;

    x -= picture.translateX / picture.factor;
    y -= picture.translateY / picture.factor;

    x -= centroidX;
    y -= centroidY;

    const minusRotate = - picture.rotate;

    let xPrime = x * Math.cos(minusRotate) - y * Math.sin(minusRotate);
    let yPrime = x * Math.sin(minusRotate) + y * Math.cos(minusRotate);

    x = xPrime;
    y = yPrime;

    x /= picture.scale;
    y /= picture.scale;

    x += centroidX;
    y += centroidY;

    return {x:x, y:y};
};

const dist = (dx, dy) => {return Math.sqrt(dx * dx + dy * dy)};

function setScale(timestamp) {
    let [x, y] = this.parent.fixXY(this.parent.point);
    let point = map(this.constant, {x:x, y:y});

    let dx = point.x - (this.picture.centroidX - this.picture.clipX);
    let dy = point.y - (this.picture.centroidY - this.picture.clipY);

    let currentLength = dist(dx, dy);

    let newScale = this.constant.scale * (currentLength / this.startLength);

    this.picture.scale = Math.max(0.1, Math.min(1.0, newScale));

    if (this.parent.continue) {
        paintAll(this.parent.props.store);
        window.requestAnimationFrame(setScale.bind(this));
    }
    else {
        redraw();
    }
}

function setRotate(timestamp) {
    let [x, y] = this.parent.fixXY(this.parent.point);
    let point = map(this.constant, {x:x, y:y});
    let dx = point.x - (this.picture.centroidX - this.picture.clipX);
    let dy = point.y - (this.picture.centroidY - this.picture.clipY);

    let deltaRotate = Math.atan2(dy, dx) - this.startRotate;

    let newRotate = this.constant.rotate + deltaRotate;
    const MAX_ROTATE = 2 * Math.PI;
    this.picture.rotate = (newRotate + MAX_ROTATE) % MAX_ROTATE;

    if (this.parent.continue) {
        paintAll(this.parent.props.store);
        window.requestAnimationFrame(setRotate.bind(this));
    }
    else {
        redraw();
    }

}

function setTranslate(timestamp) {
    let [x, y] = this.parent.fixXY(this.parent.point);
    let dx = x - this.parent.start.x;
    let dy = y - this.parent.start.y;

    this.picture.translateX = this.constant.translateX + dx;
    this.picture.translateY = this.constant.translateY + dy;

    if (this.parent.continue) {
        paintAll(this.parent.props.store);
        window.requestAnimationFrame(setTranslate.bind(this));
    }
    else {
        redraw();
    }
}
