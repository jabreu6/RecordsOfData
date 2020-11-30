import React, {useState} from 'react';
import axios from 'axios';
import './LoginForm.css';
import {API_LOGIN_URL, ACCESS_TOKEN_NAME} from '../../constants/apiConstants';
import { withRouter } from "react-router-dom";

function LoginForm(props) {
    props.updateTitle('Inicio de Sesión')
    
    const [state , setState] = useState({
        username : "",
        password : "",
        successMessage: null
    })

    const handleChange = (e) => {
        const {id , value} = e.target   
        setState(prevState => ({
            ...prevState,
            [id] : value
        }))
    }

    const handleSubmitClick = (e) => {
        console.log("en la funcion iniciar")
        e.preventDefault();
        axios({
            method: 'PUT',
            url: API_LOGIN_URL,
            headers: {
                'Content-Type': 'application/json',
                email: state.username,
                password:state.password,
                app: "APP_BCK"
            }
        })
        .then(function (response) {
            console.log("response")
            console.log(response.data.sessionTokenBck)
            if(response.status === 200){
                setState(prevState => ({
                    ...prevState,
                    'successMessage' : 'Login successful. Redirecting to home page..'
                }))
                localStorage.setItem(ACCESS_TOKEN_NAME,response.data.sessionTokenBck);
                redirectToHome();
                props.showError(null)
            }
            else{
                props.showError("Error Inesperado");
            }
        })
        .catch(function (error) {
            console.log(error.statusCode);
            console.log(error);
            props.showError("Error Inesperado");
        });
    }
    const redirectToHome = () => {
        props.history.push('/home');
        props.updateTitle('')
    }
   
    return(
        <div className="card col-12 col-lg-4 p-4 hv-center">
            <form>
                <div className="form-group text-left">
                    <label htmlFor="exampleInputEmail1">Nombre de usuario</label>
                    <input type="email" className="form-control" id="username" aria-describedby="emailHelp" placeholder="Nombre de usuario" value={state.username} onChange={handleChange}/>
                </div>
                <div className="form-group text-left">
                    <label htmlFor="exampleInputPassword1">Contraseña</label>
                    <input type="password" className="form-control" id="password" placeholder="contraseña" value={state.password} onChange={handleChange}/>
                </div>
                <button type="submit" className="btn btn-primary" onClick={handleSubmitClick}>Iniciar</button>
            </form>
            <div className="alert alert-success mt-2" style={{display: state.successMessage ? 'block' : 'none' }} role="alert">
                {state.successMessage}
            </div>
        </div>
    )
}

export default withRouter(LoginForm);