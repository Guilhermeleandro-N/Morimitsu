import React from "react";
import {Routes, Route, Navigate} from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Login from "../pages/login/Login";
import Home from "../pages/Home/Home";
import CadastrarAluno from "../pages/CadastrarAluno/CadastrarAluno";
import EditarAluno from "../pages/EditarAluno/EditarAluno";
import VisualizarTurmas from "../pages/Turmas/VisualizarTurmas";
export default function AppRoutes(){
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<MainLayout/>}>
                <Route path="/" element={<Home/>} />
                <Route path="/cadastrarAluno" element={<CadastrarAluno/>}></Route>
                <Route path="/editarAluno" element={<EditarAluno/>} ></Route>
                <Route path="/turmas" element={<VisualizarTurmas />} />
            </Route>
        </Routes>
    )
}