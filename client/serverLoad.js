/**
 * serverLoad.js
 *
 * Created by jrootham on 15/02/16.
 *
 * Copyright © 2016 Jim Rootham
 */
import React from "react";
import ReactDOM from "react-dom";
import {Picture, Constants} from "./data";
import persistence from "./persistence";
import {redraw} from "./index";

export default class ServerlLoad extends React.Component {
    load() {
        const store = this.props.store;

        const pictureId = parseInt(document.getElementById("pickPicture").value);

        persistence.getPicture(pictureId).then(result => {
            const values = result.data.getPicture;

            const image = new Image();
            image.src = values.image;

            const picture = new Picture(image);
            picture.id = values.id;
            picture.image = image;
            picture.name = values.name;
            picture.owned = values.owned;
            picture.clipX = values.clipX;
            picture.clipY = values.clipY;
            picture.clipWidth = values.clipWidth;
            picture.clipHeight = values.clipHeight;
            picture.centroidX = values.centroidX;
            picture.centroidY = values.centroidY;

            store.picture = picture;

            store.display.page = Constants.page.EDIT_PICTURE;
            store.display.picture.layout = Constants.picture.NOTHING;

            redraw();
        });
    }
    
    render() {
        const store = this.props.store;
        let result = undefined;

        if (store.signon.on) {
            const pictureList = store.display.pictureList.data.getPictureList;

            const pick = <div>
                <div>
                    <select id="pickPicture">
                        {pictureList.map(picture => {
                            const id = picture.id;

                            return <option key={`${id}`} value={`${id}`}>
                                {`${picture.id}  ${picture.name}`}
                                </option>
                        })}
                    </select>
                </div>
                <button onClick={this.load.bind(this)}>Load</button>
            </div>

            result = pick;
        }
        else {
            result =<div>Not signed on</div>
        }

        return result;
    }
}
