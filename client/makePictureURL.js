/**
 * makePictureURL.js
 *
 * Created by jrootham on 19/07/16.
 *
 * Copyright © 2016 Jim Rootham
 */

import {Constants} from "./data";

export const makePictureURL = image => {
    const canvas = document.getElementById("invisible");
    const context = canvas.getContext("2d");

    canvas.width = image.width;
    canvas.height = image.height;

    context.drawImage(image, 0, 0, image.width, image.height);

    const result = canvas.toDataURL();
    return `"${result}"`;
};

export const setThumbnailURL = picture => {
    const canvas = document.getElementById("invisible");
    const context = canvas.getContext("2d");

    let width = Constants.THUMB_SIZE;
    let height = Constants.THUMB_SIZE;

    const aspect = picture.clipWidth / picture.clipHeight;

    if (aspect > 1) {
        height = Constants.THUMB_SIZE / aspect;
    }
    else {
        width = Constants.THUMB_SIZE * aspect;
    }

    canvas.width = width;
    canvas.height = height;

    context.drawImage(image, 0, 0, width, height,
        picture.clipX, picture.clipY, picture.clipWidth, picture.clipHeight);

    const result = canvas.toDataURL();
    picture.thumbnail = `"${result}"`;
};
