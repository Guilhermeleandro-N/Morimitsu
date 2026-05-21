import {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {GiHamburgerMenu} from "react-icons/gi";
import { IoIosLogOut } from "react-icons/io";
import logo from "../../assets/morimitsu.png";
import "./Header.css"
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
const Header = ({isOpen, setIsOpen}) => {
  let nome;
  const {user} = useContext(AuthContext)
  if (!user){
     nome = "Saulo";
  }else{
     nome = user.nome;
  }


  const handleMenuToggle = () => {
      setIsOpen(!isOpen)
  };

  return (
    <header className='header'>
      <div className='header-left' >
        <button className='hamburguer' onClick={handleMenuToggle} >
                <GiHamburgerMenu size={24} />
        </button>
      
      <div className='nome-logo'>
        <img src={logo} alt="logo" />
        <div className="nome-logo-text">
          <span className="titulo">Morimitsu</span>
          <span className="subtitulo">{nome}</span>
        </div>
      </div>
        
      </div>

    <div className='header-right'>
      
    </div>
    </header>
  )
}

export default Header