import React,{ useEffect, useState, Component } from 'react';
import { withRouter } from 'react-router-dom';
import { ACCESS_TOKEN_NAME, API_HOME_URL} from '../../constants/apiConstants';
import axios from 'axios'

import DataGrid from 'react-data-grid';
import 'react-data-grid/dist/react-data-grid.css';

const columns = [
  { key: 'BookingId', name: 'BookingId' },
  { key: 'firstName', name: 'Cliente', width: 150, resizable:true },
  { key: 'bookingTime', name: 'Fecha de Creación' },
  { key: 'streetAddress', name: 'Dirección', width: 500, resizable:true },
  { key: 'bookingPrice', name: 'Precio' }
];
 
class Home extends Component {
  state = {
    selectedCondition : "",
    selectedColumn : "",
    val: "",
    dataRows: [],
    dataRowsShow: []
  }

  callApi(){
    if (localStorage.getItem(ACCESS_TOKEN_NAME) === null) {
      this.redirectToLogin()
    }
    else{
      axios({
        method: 'GET',
        url: API_HOME_URL,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            adminemail: "testapis@tuten.cl",
            email: "contacto@tuten.cl",
            current: true,
            app: "APP_BCK",
            token:localStorage.getItem(ACCESS_TOKEN_NAME)
        },
        credentials: "same-origin",
        withCredentials: true,
      })
      .then( (response) => {
        if(response.status === 200){
          let finalRecords = []
          for (let i = 0; i < response.data.length; i++) {
            let fecha = new Date (response.data[i].bookingTime)
            fecha = fecha.getDate() +'/'+ fecha.getMonth() +'/'+ fecha.getFullYear()
            finalRecords.push({ 
              BookingId: response.data[i].bookingId, 
              firstName: response.data[i].locationId.tutenUser.firstName + ' ' + response.data[i].locationId.tutenUser.lastName, 
              bookingTime: fecha, 
              streetAddress: response.data[i].locationId.streetAddress, 
              bookingPrice: response.data[i].bookingPrice 
            })
          }
          this.setState({dataRowsShow: finalRecords, dataRows: finalRecords})
        }
        else{
          this.props.showError("Error Inesperado");
        }
      })
      .catch( (error) => {
        this.props.showError("Error Inesperado");
      });
    }
  }

  componentDidMount(){
    this.callApi()
  }

  componentDidUpdate(prevProps){
    this.callApi()
  }
  
  handleChange = (e) => {
    const {id , value} = e.target   
    this.setState(prevState => ({
        ...prevState,
        [id] : value
    }))
  }
 
  redirectToLogin() {
    this.props.history.push('/login');
  }

  filters = () => {
    let arra = []
    switch (this.state.selectedColumn) {
      case "1":
        switch (this.state.selectedCondition) {
          case '1':
            arra = this.state.dataRows.filter(dr => dr.BookingId.toString().includes(this.state.val))
          break;
          case '2':
            arra = this.state.dataRows.filter(dr => dr.BookingId  >= this.state.val)
          break;
          case '3':
            arra = this.state.dataRows.filter(dr => dr.BookingId  <= this.state.val)
          break;
        
          default:
            break;
        }
      break;
      case "2":
        switch (this.state.selectedCondition) {
          case '1':
            arra = this.state.dataRows.filter(dr => dr.bookingPrice.toString().includes(this.state.val))
          break;
          case '2':
            arra = this.state.dataRows.filter(dr => dr.bookingPrice  >= this.state.val)
          break;
          case '3':
            arra = this.state.dataRows.filter(dr => dr.bookingPrice  <= this.state.val)
          break;
          default:
            break;
        }
      break;
      default:
      break;
    }
    if (arra.length > 0) {
      this.setState({dataRowsShow: arra})
    }
    else{
      this.setState({dataRowsShow: this.state.dataRows})
      this.props.showError("Los parámetros no coinciden");
    }
  }

  render(){
    return (
      <div className="container mt-2" style={{backgroundColor: ''}} >
        <h2 class="mt-3 mb-4">Listado de Datos</h2>
        <form class="mb-3">
          <div class="form-row">
            <div class="col"> 
              <select value={this.state.selectedColumn} onChange={this.handleChange} class="custom-select " id="selectedColumn">
                <option value="0">Columna</option>
                <option value="1">BookingId</option>
                <option value="2">Precio</option>
              </select>
            </div>
            <div class="col"> 
              <select value={this.state.selectedCondition} onChange={this.handleChange} class="custom-select " id="selectedCondition">
                  <option value="0">Condición...</option>
                  <option value="1">like</option>
                  <option value="2"> Mayor igual </option>
                  <option value="3"> Menor igual </option>
                </select>
            </div>
            <div class="col"> 
              <div>
              <form class="form-inline">
                <input onChange={this.handleChange} type="text" class="form-control mb-2 mr-sm-2" id="val" placeholder="Valor"></input>
                <button  onClick={this.filters} type="button" class="btn btn-outline-dark mb-2" >Filtrar</button>
              </form>
              </div>
            </div>
          </div>
        </form> 
        <DataGrid columns={columns} rows={this.state.dataRowsShow} />
      </div>
    )
  }
}

export default withRouter(Home)