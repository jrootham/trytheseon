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
    MIN_WIDTH:      80,
    MIN_HEIGHT :    80,

    NONE:           0,
    SIZE:           1,
    PICTURE:        2,
    CATALOGUE:      3
};

export let store = {
    data: {
        size: {
            width : Constants.MAX_WIDTH,
            height: Constants.MAX_HEIGHT
        },
        pictures:   [],
        catalogue:  []
    },
    display : {
        which:  Constants.NONE,
        index:  -1
    }
};

