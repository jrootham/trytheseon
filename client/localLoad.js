/**
 * localLoad.js
 *
 * Created by jrootham on 15/02/16.
 *
 * Copyright © 2016 Jim Rootham
 */
import React from "react";
import ReactDOM from "react-dom";

import {Constants, Picture} from "./data";
import {show, hide, makeGoBack} from "./common";
import {redraw} from "./index";

export default class LocalLoad extends React.Component {
    makeGetFile(store) {
        return () => {
            let fileInput = document.getElementById("localFile");
            let fileList = fileInput.files;

            if (fileList.length > 0) {
                let file = fileList[0];
                createImageBitmap(file).then(image => {
                    let pictureArray = store.data.pictures;
                    let localPicture = new Picture(image);
                    localPicture.name = `Picture ${pictureArray.length}`;
                    localPicture.zIndex = pictureArray.length;

                    store.display.which = pictureArray.length;
                    pictureArray.push(localPicture);

                    store.display.page = Constants.page.EDIT_PICTURE;
                    store.display.previous = store.display.page;
                    redraw();
                });
            }
            else {
                show("localNone");
            }
        }
    }

    render() {
        return <div id="local">
            <div>
                <input id="localFile" type="file"/>
            </div>
            <div>
                <div className="left">
                    <button onClick = {makeGoBack(this.props.store)}>Cancel</button>
                </div>
                <div className="right">
                    <button onClick = {this.makeGetFile(this.props.store)}>OK</button>
                </div>
                <LocalNone />
            </div>
        </div>
    }
}

const LocalNone = React.createClass({
    render: function() {
        const style = {
            display : "none"
        };

        return <div id="localNone" style={style}>
            <div>No Files Selected</div>
            <div><button onClick = {()=>{hide("localNone")}}>OK</button></div>
        </div>
    }
});

