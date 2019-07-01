import React, { Component } from 'react';
import validator from 'validator';
import { connect } from 'react-redux';

import * as action from '../../../../../redux/actions/intranet/theses/form';
import IconSave from "../../../../../icons/svg_save.svg";

import Utils from "../../../../utils/utils.jsx";

class InpPerson extends Component {
    constructor(props) {
        super(props);
        this.utils = new Utils();
        this.selectDiv = React.createRef();
        this.selectTag = React.createRef();
        this.changeTxt       = this.changeTxt.bind(this);
        this.onClearSelected = this.onClearSelected.bind(this);
        this.onChangeHover   = this.onChangeHover.bind(this);
        this.changeFocus     = this.changeFocus.bind(this);
        this.onCreatePerson  = this.onCreatePerson.bind(this);

        this.order         = this.props.order - 1;
        this.arrayCharges  = this.props.arrayData;
        this.type          = this.props.type;
        this.title         = this.props.title;
        this.findData      = this.props.findData;
        this.createPerson  = this.props.createPerson;
        let current = this.props.dataFormJury[this.order];
        this.dataCurrent   = (current !== undefined) ? current : null;

        this.state = {
            listData    : [],
            last_names  : "",
            names       : "",
            onFocus     : false,
            onHover     : false,
            itemSelected: this.dataCurrent,
            reaload     : false
        };
        this.onCreate = false;
        this.showToAssign = false;
    }

    componentDidMount() {
        $('select').material_select();
    }

    onClearSelected() {
        if (!this.showToAssign){
            this.props.clearDataArrayForm(this.order,this.type);
        }
        this.showToAssign = false;
        this.setState({
            itemSelected: null,
            last_names: "",
            names: "",
        });
    }

    componentDidUpdate() {
        if (this.state.itemSelected === null) {
            $('select').material_select();
        }
    }

    changeTxt(event) {
        let newTxt = event.target.value;
        let last_names = newTxt;
        let names = newTxt;
        let old = this.state.last_names + " " + this.state.names;
        let attr = event.target.getAttribute("type_data");
        if (attr === "last_names") {
            this.setState({ last_names });
            names = this.state.names;
        } else if (attr === "names") {
            this.setState({ names });
            last_names = this.state.last_names;
        }
        let fullNames = last_names + " " + names;
        if (fullNames.length > 3) {
            let currentValue = fullNames.trim();
            currentValue = currentValue.replace(/\s\s+/g, ' ');
            currentValue = this.utils.removeAccents(currentValue);
            if (old != fullNames) {
                this.findData(currentValue, this.type).then((rpta) => {
                    this.setState({ listData: rpta });
                });
            }
        } else {
            if (this.state.listData.length != 0) {
                this.setState({ listData: [] });
            }
        }
    }

    onClickItem(item) {
        let id = item.id,
            name = item.last_name + " " + item.name;
        this.showToAssign = true;
        this.setState({
            itemSelected: item,
            listData: [],
            onFocus: false
        });
    }

    changeFocus(st) {
        this.setState({ onFocus: st });
    }
    onChangeHover(st) {
        this.setState({ onHover: st });
    }

    render() {
        return <div className="content_inputs">
            {(()=>{
                let itemSelected = this.state.itemSelected;
                if (itemSelected !== null) {
                    let fullName = itemSelected.last_name + " " + itemSelected.name;
                    let detail = this.getDetailPerDetailID(itemSelected.detail_id);
                    detail = (detail != null || detail != undefined) ? (" - " + detail.name) : "";
                    return <div className="content_inputs">
                                <span>{fullName + detail}</span>
                                <div className="item_selected tooltip_design">
                                    <div className="across tooltip_item" onClick={this.onClearSelected}>
                                        <div className="space_tooltip z-depth-1">
                                            <span>Cambiar</span>
                                        </div>
                                    </div>
                                </div>
                        </div>
                } else {
                    return (
                        <div className="">
                            <div className="inp_groups">
                                <div className="input-field">
                                    <input type="text" value={this.state.last_names}
                                        type_data="last_names"
                                        readOnly={this.onCreate ? "readOnly" : ""}
                                        onChange={this.changeTxt} placeholder="Apellidos"
                                        onFocus={() => { this.changeFocus(true) }}
                                        onBlur={() => { this.changeFocus(false) }} />
                                </div>
                                <div className="input-field">
                                    <input type="text" value={this.state.names}
                                        type_data="names"
                                        readOnly={this.onCreate ? "readOnly" : ""}
                                        onChange={this.changeTxt} placeholder="Nombres"
                                        onFocus={() => { this.changeFocus(true) }}
                                        onBlur={() => { this.changeFocus(false) }} />
                                </div>
                                {(() => {
                                    let listData = this.state.listData || [];
                                    let view = this.state.onFocus || this.state.onHover;
                                    if (view && listData.length != 0) {
                                        return <div className="content_coincidences z-depth-3"
                                            onMouseEnter={() => { this.onChangeHover(true) }}
                                            onMouseLeave={() => { this.onChangeHover(false) }}>
                                            {(() => {
                                                return listData.map((item, key) => {
                                                    let fullName = item.last_name + " " + item.name;
                                                    let detail = this.getDetailPerDetailID(item.detail_id);
                                                    detail = (detail != null || detail != undefined) ? (" - " + detail.name) : "";
                                                    return <span onClick={() => { this.onClickItem(item); }}>
                                                        {fullName + detail}</span>;
                                                });
                                            })()}
                                        </div>;
                                    }
                                })()}
                            </div>
                        </div>
                    )
                }
            })()}
            {(() => {
                let itemSelected = this.state.itemSelected;
                if (itemSelected !== null){
                    if (!!itemSelected.detail_id){
                        return null;
                    }
                }
                return <div className="content_select">
                    <select id="select_school" ref={this.selectTag}>
                        <option value="" disabled selected>{this.props.titleSelect}</option>
                        {(() => {
                            let arrayData = this.arrayCharges;
                            return arrayData.map((data, key) => {
                                return <option value={data.id} id={key}>{data.name}</option>;
                            });
                        })()}
                    </select>
                </div>;
            })()}
            {(() => {
                let listData = this.state.listData || [];
                let lastNames = this.state.last_names.trim().replace(/\s\s+/g, ' ');
                let names = this.state.names.trim().replace(/\s\s+/g, ' ');
                let withMinLengt = lastNames.length > 2 && names.length > 2;
                if (listData.length === 0 && withMinLengt) {
                    if (!this.onCreate) {
                        let txtToolTip = "Crear y asignar " + this.title.toLowerCase();
                        return <div className="icon_save tooltip_design"
                                onClick={this.onCreatePerson}>
                                <IconSave />
                                <div className="space_tooltip z-depth-1">
                                    <span>{txtToolTip}</span>
                                </div>
                            </div>;
                    } else {
                        return this.getPreloaderMiniSmall();
                    }
                }else if(this.showToAssign){
                    let txtToolTip = "Asignar " + this.title.toLowerCase();
                    return <div className="icon_save tooltip_design"
                                onClick={this.onCreatePerson}>
                                <IconSave />
                                <div className="space_tooltip z-depth-1">
                                    <span>{txtToolTip}</span>
                                </div>
                            </div>;
                }
            })()}
        </div>
    }

    onCreatePerson() {
        let detailID = this.selectTag.current.value;
        if (detailID == "") {
            Materialize.toast("Falta seleccionar " + this.props.titleSelect.toLowerCase() + ".", 4000);
        } else if (validator.isUUID(detailID)) {
            let itemSelected = this.state.itemSelected;
            if (itemSelected != null){
                this.showToAssign = false;
                itemSelected.detail_id = detailID;
                itemSelected.detail = this.getDetailPerDetailID(detailID).name;
                this.props.updateDataArrayForm(this.order,this.type,itemSelected);
                this.setState({itemSelected: itemSelected});
            }else{
                let names = this.state.names;
                let lastNames = this.state.last_names;
                this.onCreate = true;
                let data = new FormData();
                data.append("names", names);
                data.append("last_names", lastNames);
                this.createPerson(this.type, data).then((rpta) => {
                    this.onCreate = false;
                    let obj = {
                        last_names: "",
                        names: "",
                        itemSelected: null
                    };
                    if (rpta !== false) {
                        obj.itemSelected = {
                            id        : rpta,
                            last_name : lastNames,
                            name      : names,
                            detail_id : detailID,
                            detail    : this.getDetailPerDetailID(detailID).name
                        };
                        this.props.updateDataArrayForm(this.order,this.type, obj.itemSelected);
                    } else {
                        this.props.clearDataArrayForm(this.order,this.type);
                        Materialize.toast("¡Ha ocurrido un error!", 4000);
                    }
                    this.setState(obj);
                });
            }
        } else {
            this.props.clearDataArrayForm(this.order,this.type);
            Materialize.toast("¡Ha ocurrido un error!", 4000);
        }
    }

    getDetailPerDetailID(id) {
        let item = null;
        this.arrayCharges.forEach(element => {
            if (element.id == id) {
                item = element;
                return false;
            }
        });
        return item;
    }

    getPreloaderMiniSmall() {
        return <div className="preloader-wrapper small active">
            <div className="spinner-layer spinner-green-only">
                <div className="circle-clipper left">
                    <div className="circle"></div>
                </div><div className="gap-patch">
                    <div className="circle"></div>
                </div><div className="circle-clipper right">
                    <div className="circle"></div>
                </div>
            </div>
        </div>;
    }
}

const mapStateToProps = state => {
    return { dataFormJury: state.dataFormTheses.jury}
};

export default connect(mapStateToProps,action) (InpPerson);
