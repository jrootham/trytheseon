/**
 * data.js
 *
 * Created by jrootham on 24/12/15.
 *
 * Copyright © 2015 Jim Rootham
 */

export const Constants = {
    MAX_WIDTH:          800,
    MAX_HEIGHT :        800,
    MIN_WIDTH:          80,
    MIN_HEIGHT :        80,

    layout: {
        NOTHING:        -2,
        SIZE:           -1,
    },

    picture: {
        NOTHING:        0,
        CLIP:           1,
        CENTROID:       2
    },

    page: {
        START:          0,
        SIGNON:         1,
        REGISTER:       2,
        LOCAL_LOAD:     3,
        LOCAL_LAYOUT:   4,
        SERVER_LOAD:    5,
        SCENE_LOAD:     6,
        SERVER_LAYOUT:  7,
        CATALOGUE:      8,
        EDIT_PICTURE:   9,
        LAYOUT:         10,
        NEW_TAG:        11,
        PICK_LINK:      12,
        LINK_PICTURE:   13
    }
};

export let store = {
    signon: {
        on:     false,
        name:   ""
    },

    scene: undefined,
    picture: undefined,

    display : {
        previous:               Constants.page.START,
        page:                   Constants.page.START,
        next:                   Constants.page.START,

        error:                  undefined,

        which:                  Constants.layout.NOTHING,

        picture: {
            zoom:               1,
            colourTransparent:  false,
            layout:             Constants.picture.NOTHING
        },
        
        pictureList: [],
        sceneList: [],
        tagList: []
    }
};

export class Scene {
    constructor(name, width, height, scenePictures) {
        this.id = 0;
        this.name = name;
        this.savedAt = "";
        this.width = width;
        this.height = height;
        this.scenePictures = scenePictures;
    }

    add(scenePicture) {
        scenePicture.z = this.scenePictures.length
        this.scenePictures.push(scenePicture);
    }
}

export const makeScenePicture = picture => {
    const scenePicture = new ScenePicture();
    
    scenePicture.id = 0;
    scenePicture.name = picture.name;
    scenePicture.image = picture.image;
    scenePicture.clipX = picture.clipX;
    scenePicture.clipY = picture.clipY;
    scenePicture.clipWidth = picture.clipWidth;
    scenePicture.clipHeight = picture.clipHeight;
    scenePicture.centroidX = picture.centroidX;
    scenePicture.centroidY = picture.centroidY;
    scenePicture.rotate = 0;
    scenePicture.x = 0;
    scenePicture.y = 0;
    scenePicture.scale = 1;
    scenePicture.z = 0;
    scenePicture.setFactor();

    return scenePicture;
}

export class ScenePicture {
    setFactor() {
        const width = Constants.MAX_WIDTH / this.clipWidth;
        const height = Constants.MAX_HEIGHT / this.clipHeight;
        this.factor = Math.min(1.0, Math.min(width, height));
    }

    // Partial copy is used to create a temporary anchor for direct manipulation

    copy() {
        const other = {};

        other.clipX = this.clipX;
        other.clipY = this.clipY;
        other.clipWidth = this.clipWidth;
        other.clipHeight = this.clipHeight;
        other.centroidX = this.centroidX;
        other.centroidY = this.centroidY;

        other.factor = this.factor;

        other.rotate = this.rotate;
        other.x = this.x;
        other.y = this.y;
        other.scale = this.scale;
        other.z = this.z;

        return other;
    }
}

export class PictureLabel {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }    
}

export class Picture {
    constructor(image) {
        this.id = 0;
        this.name = "Picture";
        this.owned = true;
        this.image = image;
        this.thumbnail = "";
        this.clipX = 0;
        this.clipY = 0;
        this.setPoints();
        this.name = "";
    }

    setPoints() {
        this.clipWidth = this.image.width;
        this.clipHeight = this.image.height;
        this.centroidX = this.image.width / 2;
        this.centroidY = this.image.height / 2;
    }

    setImage(image) {
        this.image = image;
        this.setPoints();
    }

};
