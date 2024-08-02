import React from 'react';
import {Button as GeneralButton} from 'react-bootstrap';
import {ButtonType} from "./button.type.ts";
import "./button.css"

const Button:React.FC<ButtonType> = ({label, onClick, disabled}) => {
    return (
        <GeneralButton onClick={onClick} className={"button-container container"} disabled={disabled}>{label}</GeneralButton>
    );
};

export default Button;