import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import logo from '../assets/logo-bg-trimmed-solo.png'

import { useMatch, useResolvedPath } from "react-router-dom"

import '../styles/Navbar.css';

export default function Navbar() {

    const [isOpen, setIsOpen] = useState(false);

    const toggleNav = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className='dabba'>
            <link 
            rel="stylesheet" 
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css" 
            integrity="sha512-SzlrxWUlpfuzQ+pcUCosxcglQRNAq/DZjVsC0lE40xsADsfeQoEypE+enwcOiGjk/bSuGGKHEyjSoQ1zVisanQ==" 
            crossOrigin="anonymous" referrerPolicy="no-referrer" />
            <link href='https://fonts.googleapis.com/css?family=Rock Salt' rel='stylesheet'></link>
            <div className = "logo">
                <CustomLink to = "/"><img src = {logo} alt = 'logo'></img></CustomLink>
            </div>
            <div className = "navbar">                
                <ul className = "links">
                    <CustomLink to = "/booking">Book Tickets</CustomLink>
                    <CustomLink to = "/profile">Profile</CustomLink>
                </ul>
                <CustomLink className = "action_btn" to = "/contact">Contact</CustomLink>
                <div className = "toggle_btn" onClick = {toggleNav} >
                    <i className={'fa-solid ' + (isOpen ? 'fa-xmark' : 'fa-bars')}></i>
                </div>
            </div>

            {isOpen && (
                <div className = "dropdown_menu">
                    <CustomLink className = "item" to = "/booking">Book Tickets</CustomLink>
                    <CustomLink className = "item" to = "/profile">Profile</CustomLink>
                    <CustomLink className = "action_btn" to = "/contact">Contact</CustomLink>
                </div>
            )}
        </div>
    )
}

function CustomLink({ to, children, ...props }) {
    const resolvedPath = useResolvedPath(to)
    const isActive = useMatch({ path: resolvedPath.pathname, end: true })
  
    return (
      <li>
        <Link to={to} {...props} style={{ textDecoration: 'none' }}>
          {children}
        </Link>
      </li>
    )
  }