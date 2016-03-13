/**
 * layout.js
 *
 * Created by jrootham on 09/02/16.
 *
 * Copyright © 2016 Jim Rootham
 */
import React from "react";
import ReactDOM from "react-dom";
import RadioGroup from "react-radio";

import "./../trytheseon.css"

import {redraw} from "./index"
import {store, Constants} from "./data";
import Edit from "./edit";
import {setOverlay, paintAll} from "./paint";
import {PictureEditor} from "./picture";

const THREESIXTY = Math.PI / 180;

class Select extends React.Component {
    render() {
        const which = [
            {
                value: Constants.layout.NOTHING,
                label: "None",
                style: {display:"block"}
            },
            {
                value: Constants.layout.SIZE,
                label: "Size",
                style: {display:"block"}
            }
        ];

        this.props.store.data.pictures.forEach((element, index) => {
            which.push({
                value:index,
                label:element.name,
                style: {display:"block"}
            });
        });

        const makeChange = store => {
            return (value, event) => {
                this.props.store.display.which = parseInt(value);
                redraw();
            }
        }

        return <div>
            <RadioGroup
                name="which"
                defaultValue={this.props.store.display.which}
                items={which}
                onChange={makeChange(this.props.store)}
            />
        </div>
    }
}

class Size extends React.Component {
    render() {
        return <div>
            <div>Width {this.props.size.width}</div>
            <div>Height {this.props.size.height}</div>
        </div>
    }
}

class PictureData extends React.Component {
    plus() {
        let pictureList = this.props.store.data.pictures;
        let index = this.props.store.display.which;
        let picture = pictureList[index];
        let length = pictureList.length;
        if (length > 1 && picture.zIndex < length - 1) {
            let other = pictureList.find(element => {
                return element.zIndex === picture.zIndex + 1;
            });

            other.zIndex--;
            picture.zIndex++;
        }
        redraw();
    }

    minus() {
        let pictureList = this.props.store.data.pictures;
        let index = this.props.store.display.which;
        let picture = pictureList[index];
        let length = pictureList.length;
        if (length > 1 && picture.zIndex > 0) {
            let other = pictureList.find(element => {
                return element.zIndex === picture.zIndex - 1;
            });

            other.zIndex++;
            picture.zIndex--;
        }
        redraw();
    }

    render() {
        let index = this.props.store.display.which;
        let picture = this.props.store.data.pictures[index];

        return <div>
            <div>Name: {picture.name}</div>
            <div>X: {picture.translateX}</div>
            <div>Y: {picture.translateY}</div>
            <div>Scale: {Math.round(picture.scale * 100) / 100}</div>
            <div>Rotate: {Math.round(picture.rotate / THREESIXTY)}</div>
            <div>Z: {picture.zIndex}</div>
            <div>
                <button onClick={this.plus.bind(this)}>+</button>
                <button onClick={this.minus.bind(this)}>-</button>
            </div>
        </div>
    }
};

class Display extends React.Component {
    render() {
        let output = <div></div>

        switch (this.props.store.display.which) {
            case Constants.layout.NOTHING:
                output = <div></div>
                break;

            case Constants.layout.SIZE:
                output = <div id="display">
                    <Size size = {this.props.store.data.size} />
                </div>
                break;

            default:
                if (this.props.store.display.which >= 0) {
                    output = <div id="display">
                        <PictureData store ={this.props.store} />
                    </div>
                }
        }

        return output;
    }
};

class After extends React.Component{
    render() {
        const style = {
            display:        "inline-block",
            verticalAlign:  "top"
        };

        return <div className="control-container" style={style}>
            <Select store = {this.props.store}/>
            <Display store = {this.props.store} />
        </div>
    }
};

export default class Layout extends React.Component{
    componentDidMount() {
        paintAll(this.props.store);
    }

    render() {
        return <div id="container">
            <Edit store = {this.props.store} />
            <After store = {this.props.store} />
        </div>
    }
};

