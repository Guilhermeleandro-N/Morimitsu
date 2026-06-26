import React from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Login from "../pages/login/Login";
import Home from "../pages/Home/Home";
import CadastrarAluno from "../pages/CadastrarAluno/CadastrarAluno";
import EditarAluno from "../pages/EditarAluno/EditarAluno";
import VisualizarTurmas from "../pages/Turmas/VisualizarTurmas";
import PerfilAluno from "../pages/PerfilAluno/PerfilAluno";
import ProtectedRoute from "./ProtectedRoutes";
import ListarAluno from "../pages/ListarAlunos/ListarALunos";
import AlunosTurma from "../pages/AlunosTurma/AlunosTurma";
import HistoricoTreinos from "../pages/HistoricoTreinos/HistoricoTreinos";
import ListarProfessores from "../pages/ListarProfessores/ListarProfessores";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        element={
          <ProtectedRoute rolesPermitidas={["admin", "professor", "aluno"]}>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path="/"
          element={
            <ProtectedRoute rolesPermitidas={["admin", "professor", "aluno"]}>
              <VisualizarTurmas />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cadastrarAluno"
          element={
            <ProtectedRoute rolesPermitidas={["admin", "professor"]}>
              <CadastrarAluno />
            </ProtectedRoute>
          }
        />

        <Route
          path="/editarAluno"
          element={
            <ProtectedRoute rolesPermitidas={["admin", "professor"]}>
              <EditarAluno />
            </ProtectedRoute>
          }
        />

        <Route
          path="/turmas"
          element={
            <ProtectedRoute rolesPermitidas={["admin", "professor"]}>
              <VisualizarTurmas />
            </ProtectedRoute>
          }
        />

        <Route
          path="/perfilAluno"
          element={
            <ProtectedRoute rolesPermitidas={["admin", "professor", "aluno"]}>
              <PerfilAluno />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teste"
          element={
            <ProtectedRoute rolesPermitidas={["admin", "professor"]}>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/listarAluno"
          element={
            <ProtectedRoute rolesPermitidas={["admin", "professor"]}>
              <ListarAluno />
            </ProtectedRoute>
          }
        />

        <Route path="/alunosTurma" element={<AlunosTurma />} />

        <Route
          path="/historicoTreinos"
          element={
            <ProtectedRoute rolesPermitidas={["admin", "professor"]}>
              <HistoricoTreinos />
            </ProtectedRoute>
          }
        />

        <Route
          path="/listarProfessores"
          element={
            <ProtectedRoute rolesPermitidas={["admin"]}>
              <ListarProfessores />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}