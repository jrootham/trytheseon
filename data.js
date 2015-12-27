/**
 * data.js
 *
 * Created by jrootham on 24/12/15.
 *
 * Copyright © 2015 Jim Rootham
 */

export const Constants = {
    MAX_WIDTH:      800,
    MAX_HEIGHT :    800,

    NONE:           -3,
    SIZE:           -2,
    PICTURE:        -1
};

export let store = {
    data: {
        size: {
            ratio : 1,
            scale : 1,
            width : Constants.MAX_WIDTH,
            height: Constants.MAX_HEIGHT
        }
    },
    display : {
        which:  Constants.NONE
    }
};

