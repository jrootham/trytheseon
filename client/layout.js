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

import {show, hide} from "./index"
import {store, Constants} from "./data";
import {Edit} from "./edit";
import {setOverlay, paintAll} from "./paint";
import {PictureEditor} from "./picture";

const THREESIXTY = Math.PI / 180;

class Select extends React.Component {
    render() {
        var which = [
            {
                value: Constants.NONE,
                label: "None"
            },
            {
                value: Constants.SIZE,
                label: "Size"
            }
        ];

        this.props.store.data.pictures.forEach((element, index) => {
            which.push({value:index, label:element.name})
        });

        const makeChange = store => {
            return (value, event) => {
                store.display.which = parseInt(value);
                setOverlay(store);
                redraw();
            }
        }

        return <div>
            <RadioGroup
                name="which"
                defaultValue={Constants.NONE}
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
            <div>Scale: {picture.scale}</div>
            <div>Rotate: {Math.round(picture.rotate / THREESIXTY)}</div>
            <div>Z: {picture.zIndex}</div>
            <div>
                <button onClick={this.plus}>+</button>
                <button onClick={this.minus}>-</button>
            </div>
        </div>
    }
};

class Display extends React.Component {
    render() {
        let output = <div></div>

        switch (this.props.store.display.which) {
            case Constants.NONE:
                output = <div></div>
                break;

            case Constants.SIZE:
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
        return <div id="after">
            <Select store = {this.props.store}/>
            <Display store = {this.props.store} />
        </div>
    }
};

export default class Layout extends React.Component{
    render() {
        return <div id="container">
            <Edit store = {this.props.store} />
            <After store = {this.props.store} />
        </div>
    }
};

