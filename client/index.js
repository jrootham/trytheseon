import React from "react";
import ReactDOM from "react-dom";

import "./../trytheseon.css"

import {store, Constants} from "./data";
import Start from "./start";
import Signon from "./signon";
import LocalLoad from "./localLoad";
import ServerlLoad from "./serverLoad";
import Catalogue from "./catalogue";
import SaveAs from "./saveAs";
import EditPicture from "./editPicture";
import Layout from "./layout";
import {paintAll} from "./paint";
import {paintAllPicture} from "./editPicture";

class Paint {
    constructor() {
        this.paintFn = undefined;
    }

    setPaintFn(fn) {
        this.paintFn = fn;
    }

    paint(store) {
        console.log(this.paintFn);
        if (this.paintFn) {
            this.paintFn(store);
        }
    }
}

const paint = new Paint();

class Title extends React.Component{
    render()  {
        const style = {
            textAlign: "center"
        }

        return <div style={style}>
            <h1>Try These</h1>
        </div>
    }
};

class Before extends React.Component{
    makeSignOn() {
        let store = this.props.store;

        return () => {
            store.display.page = Constants.page.SIGNON;
            redraw();
        }
    }

    makeSignOff() {
        let store = this.props.store;

        return () => {
            redraw();
        }
    }

    makeLoadLocal() {
        let store = this.props.store;

        return () => {
            store.display.page = Constants.page.LOCAL_LOAD;
            redraw();
        }
    }

    makeLoadServer() {
        let store = this.props.store;

        return () => {
            store.display.page = Constants.page.SERVER_LOAD;
            redraw();
        }
    }

    makeCatalogue() {
        let store = this.props.store;

        return () => {
            store.display.page = Constants.page.CATALOGUE;
            redraw();
        }
    }

    makeSave() {
        let store = this.props.store;

        return () => {
            redraw();
        }
    }

    makeSaveAs() {
        let store = this.props.store;

        return () => {
            store.display.page = Constants.page.SAVE_AS;
            redraw();
        }
    }

    render() {
        const style = {
            display:    "inline-block",
            width:      "14vw",
            border:     "solid 1px black"
        }

        return <div style={style}>
            <div><button onClick={this.makeSignOn()}>Sign On</button></div>
            <div><button onClick={this.makeSignOff()}>Sign Off</button></div>
            <div><button onClick={this.makeLoadLocal()}>Load Local Picture</button></div>
            <div><button onClick={this.makeLoadServer()}>Load Server Picture</button></div>
            <div><button onClick={this.makeCatalogue()}>Catalogue</button></div>
            <div><button onClick={this.makeSave()}>Save</button></div>
            <div><button onClick={this.makeSaveAs()}>Save As</button></div>
        </div>
    }
};

class Container extends React.Component {
    render() {
        const style = {
            display:            "inline-block",
            verticalAlign:      "top",
            height:             "90.5vh"
        }


        let contents;
        const page = this.props.store.display.page;

        console.log("Page", page);

        switch (page) {
            case Constants.page.START:
                contents = <Start />
                paint.setPaintFn(undefined);
                break;

            case Constants.page.SIGNON:
                contents = <Signon store={this.props.store}/>
                paint.setPaintFn(undefined);
                break;

            case Constants.page.LOCAL_LOAD:
                contents = <LocalLoad store={this.props.store}/>
                paint.setPaintFn(undefined);
                break;

            case Constants.page.SERVER_LOAD:
                contents = <ServerlLoad store={this.props.store}/>
                paint.setPaintFn(undefined);
                break;

            case Constants.page.CATALOGUE:
                contents = <Catalogue store={this.props.store}/>
                paint.setPaintFn(undefined);
                break;

            case Constants.page.SAVE_AS:
                contents = <SaveAs store={this.props.store}/>
                paint.setPaintFn(undefined);
                break;

            case Constants.page.EDIT_PICTURE:
                contents = <EditPicture store={this.props.store}/>
                paint.setPaintFn(paintAllPicture);
                break;

            case Constants.page.LAYOUT:
                contents = <Layout store={this.props.store}/>
                paint.setPaintFn(paintAll);
                break;

            default: {
                contents = `Internal error, bad page id ${page}`;
                paint.setPaintFn(undefined);
            }

        }
        return <div style={style}>
            {contents}
        </div>
    }
};

class Parent extends React.Component {
    render() {

        return <div id ="parent">
            <Title />
            <Before store = {this.props.store} />
            <Container store={this.props.store}/>
        </div>
    }
};

export const redraw = function() {
    ReactDOM.render(<Parent store={store}/>, document.getElementById('bigbox'));
    console.log("Redraw");
    paint.paint(store);
}

redraw();
