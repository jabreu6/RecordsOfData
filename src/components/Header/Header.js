import React from 'react';
import { withRouter } from "react-router-dom";
import { ACCESS_TOKEN_NAME } from '../../constants/apiConstants';
function Header(props) {
    const capitalize = (s) => {
        if (typeof s !== 'string') return ''
        return s.charAt(0).toUpperCase() + s.slice(1)
    }
    let title = ''
    if(props.location.pathname === '/') {
        title = 'Inicio de Sesión'
    }
    function renderLogout() {
        if(props.location.pathname === '/home'){
            return(
                <div className="ml-auto">
                    <button className="btn btn-outline-danger" onClick={() => handleLogout()}>Cerrar Sesión</button>
                </div>
            )
        }
    }
    function handleLogout() {
        localStorage.removeItem(ACCESS_TOKEN_NAME)
        props.history.push('/login')
    }
    return(
        <nav className="navbar navbar-dark mt-5">
            <div className="row col-12 d-flex justify-content-center text-black">
                <span className="h3">{props.title || title}</span>
                {renderLogout()}
            </div>
        </nav>
    )
}
export default withRouter(Header);