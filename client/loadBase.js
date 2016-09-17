/**
 * loadBase.js
 *
 * Created by jrootham on 03/07/16.
 *
 * Copyright © 2016 Jim Rootham
 */

import React from "react";
import ReactDOM from "react-dom";

import {Constants} from "./data";
import {makeGoBack} from "./common";

export default class LoadBase extends React.Component {
    constructor() {
        super();
        this.getFile = this.getFile.bind(this);
    }

    getFile() {
        console.log("in getFile");
        const store = this.props.store;
        
        let fileInput = document.getElementById("localFile");
        let fileList = fileInput.files;

        console.log("length", fileList.length);
        if (fileList.length > 0) {
            let file = fileList[0];
            console.log(file);
            createImageBitmap(file).then(this.insertImage);
        }
        else {
            show("localNone");
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
                    <button onClick = {this.getFile}>OK</button>
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

