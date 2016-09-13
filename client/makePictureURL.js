/**
 * makePictureURL.js
 *
 * Created by jrootham on 19/07/16.
 *
 * Copyright © 2016 Jim Rootham
 */

export const makePictureURL = image => {
    let canvas = document.getElementById("invisible");
    let context = canvas.getContext("2d");

    canvas.width = image.width;
    canvas.height = image.height;

    context.drawImage(image, 0, 0, image.width, image.height);

    const result = canvas.toDataURL();
    return `"${result}"`;
};
