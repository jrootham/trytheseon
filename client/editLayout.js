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
        this.placement = this.parent.props.store.scene.placements[index];

        let pictureWidth = this.placement.picture.clipWidth;
        let pictureHeight = this.placement.picture.clipHeight;

        let [left, top, midSide] = getPicturePoints(this.placement);

        this.constant = this.placement.copy();

        this.startPoint = map(this.constant, this.parent.start);

        const picture = this.placement.picture;
        const centroidX = picture.centroidX - picture.clipX;
        const centroidY = picture.centroidY - picture.clipY;

        let boxSize = PICTURE_RECT / (this.placement.scale * this.placement.factor);

        if (inBox(this.startPoint, left, top, boxSize)
            || inBox(this.startPoint, left, 0, boxSize)) {
            this.parent.continue = true;
            let dx = (this.startPoint.x - centroidX);
            let dy = (this.startPoint.y - centroidY);

            this.startLength = dist(dx, dy);
            this.startScale = this.placement.scale;
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
            this.startX = this.placement.translateX;
            this.startY = this.placement.translateY;
            window.requestAnimationFrame(setTranslate.bind(this));
        }
    }
}

const map = (placement, point) => {
    let x = point.x / placement.factor;
    let y = point.y / placement.factor;

    const centroidX = placement.picture.centroidX - placement.picture.clipX;
    const centroidY = placement.picture.centroidY - placement.picture.clipY;

    x -= placement.translateX / placement.factor;
    y -= placement.translateY / placement.factor;

    x -= centroidX;
    y -= centroidY;

    const minusRotate = - placement.rotate;

    let xPrime = x * Math.cos(minusRotate) - y * Math.sin(minusRotate);
    let yPrime = x * Math.sin(minusRotate) + y * Math.cos(minusRotate);

    x = xPrime;
    y = yPrime;

    x /= placement.scale;
    y /= placement.scale;

    x += centroidX;
    y += centroidY;

    return {x:x, y:y};
};

const dist = (dx, dy) => {return Math.sqrt(dx * dx + dy * dy)};

function setScale(timestamp) {
    const [x, y] = this.parent.fixXY(this.parent.point);
    const point = map(this.constant, {x:x, y:y});

    const picture = this.placement.picture;
    const dx = point.x - (picture.centroidX - picture.clipX);
    const dy = point.y - (picture.centroidY - picture.clipY);

    const currentLength = dist(dx, dy);

    const newScale = this.constant.scale * (currentLength / this.startLength);

    this.placement.scale = Math.max(0.1, Math.min(1.0, newScale));

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
    const picture = this.placement.picture;
    const dx = point.x - (picture.centroidX - picture.clipX);
    const dy = point.y - (picture.centroidY - picture.clipY);

    let deltaRotate = Math.atan2(dy, dx) - this.startRotate;

    let newRotate = this.constant.rotate + deltaRotate;
    const MAX_ROTATE = 2 * Math.PI;
    this.placement.rotate = (newRotate + MAX_ROTATE) % MAX_ROTATE;

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

    this.placement.translateX = this.constant.translateX + dx;
    this.placement.translateY = this.constant.translateY + dy;

    if (this.parent.continue) {
        paintAll(this.parent.props.store);
        window.requestAnimationFrame(setTranslate.bind(this));
    }
    else {
        redraw();
    }
}
