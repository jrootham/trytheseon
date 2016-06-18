import React from "react";
import ReactDOM from "react-dom";

import "./../trytheseon.css"

import {store, Constants} from "./data";
import Start from "./start";
import Signon from "./signon";
import persistence from "./persistence";
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

        const signon = this.props.store.signon;

        return <div style={style}>
            <h1>Try These</h1>
            <h2>{signon.on ? signon.name : ""}</h2>
        </div>
    }
};

class Before extends React.Component{
    signOnOff() {
        let store = this.props.store;
        if (store.signon.on) {
            const promise = persistence.signOff(store.signon.name);
            promise.then(result => {
                const store = this.props.store;

                store.display.error = undefined;
                store.signon.name = result.data.signoffUser.name;
                store.signon.on = result.data.signoffUser.signedOn;
                store.display.page = store.display.previous;
                redraw();
            });
        }
        else {
            store.display.page = Constants.page.SIGNON;
        }
        redraw();
    }

    loadLocal() {
        let store = this.props.store;
        store.display.page = Constants.page.LOCAL_LOAD;
        redraw();
    }

    catalogue() {
        let store = this.props.store;
        store.display.page = Constants.page.CATALOGUE;
        redraw();
    }


    loadServer() {
        const list = persistence.getPictureList();
        list.then(result => {
            let store = this.props.store;
            
            store.display.pictureList = result;
            store.display.page = Constants.page.SERVER_LOAD;
            redraw();
        });
        
    }

    render() {
        const style = {
            display:    "inline-block",
            width:      "14vw",
            border:     "solid 1px black"
        }

        const signOnOffMsg = this.props.store.signon.on ? "Sign Off" : "Sign On/Register";
        
        return <div style={style}>
            <div><button onClick={this.signOnOff.bind(this)}>{signOnOffMsg}</button></div>
            <div><button onClick={this.loadLocal.bind(this)}>Load Local Picture</button></div>
            <div><button onClick={this.loadServer.bind(this)}>Load Server Picture</button></div>
            <div><button onClick={this.catalogue.bind(this)}>Catalogue</button></div>
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

        switch (page) {
            case Constants.page.START:
                this.props.store.display.previous = Constants.page.START;
                contents = <Start />;
                paint.setPaintFn(undefined);
                break;

            case Constants.page.SIGNON:
            case Constants.page.REGISTER:
                contents = <Signon store={this.props.store}/>
                paint.setPaintFn(undefined);
                break;

            case Constants.page.LOCAL_LOAD:
                contents = <LocalLoad store={this.props.store}/>
                paint.setPaintFn(undefined);
                break;

            case Constants.page.SERVER_LOAD:
                this.props.store.display.previous = Constants.page.SERVER_LOAD;
                contents = <ServerlLoad store={this.props.store}/>
                paint.setPaintFn(undefined);
                break;

            case Constants.page.CATALOGUE:
                contents = <Catalogue store={this.props.store}/>
                paint.setPaintFn(undefined);
                break;

            case Constants.page.EDIT_PICTURE:
                paint.setPaintFn(paintAllPicture);
                this.props.store.display.previous = Constants.page.EDIT_PICTURE;
                contents = <EditPicture store={this.props.store}/>
                break;

            case Constants.page.LAYOUT:
                paint.setPaintFn(paintAll);
                this.props.store.display.previous = Constants.page.LAYOUT;
                contents = <Layout store={this.props.store}/>
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
}

class Invisible extends React.Component {
    render(){
        const invisible = {
            display:    "none"
        };

        return <div style={invisible}>
            <canvas id="invisible">Not supported</canvas>
        </div>
    }
}

class Parent extends React.Component {
    render() {

        return <div id ="parent">
            <Title store = {this.props.store}/>
            <Before store = {this.props.store} />
            <Container store={this.props.store}/>
            <Invisible />
        </div>
    }
}

export const redraw = function() {
    ReactDOM.render(<Parent store={store}/>, document.getElementById('bigbox'));
    paint.paint(store);
}

redraw();
