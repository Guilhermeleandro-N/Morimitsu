import React from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Login from "../pages/login/Login";
import Cadastros from "../pages/Cadastros/Cadastros";
import EditarAluno from "../pages/EditarAluno/EditarAluno";
import VisualizarTurmas from "../pages/Turmas/VisualizarTurmas";
import PerfilAluno from "../pages/PerfilAluno/PerfilAluno";
import ProtectedRoute from "./ProtectedRoutes";
import ListarAluno from "../pages/ListarAlunos/ListarALunos";
import AlunosTurma from "../pages/AlunosTurma/AlunosTurma";
import HistoricoTreinos from "../pages/HistoricoTreinos/HistoricoTreinos";
import CadastrarUsuario from "../pages/CadastrarUsuario/CadastrarUsuario";
import ListarProfessores from "../pages/ListarProfessores/ListarProfessores";
import ConcederPermissoes from "../pages/ConcederPermissoes/ConcederPermissoes";
import PerfilProfessor from "../pages/PerfilProfessor/PerfilProfessor";
import PainelProfessor from "../pages/PainelProfessor/PainelProfessor";
import EditarProfessor from "../pages/EditarProfessor/EditarProfessor";
import TurmasArquivadas from "../pages/TurmasArquivadas/TurmasArquivadas";
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/cadastrarUsuario" element={<CadastrarUsuario />} />

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
            path="/cadastros"
            element={
              <ProtectedRoute rolesPermitidas={["admin", "professor"]}>
                <Cadastros />
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
            path="/turmasArquivadas"
            element={
              <ProtectedRoute rolesPermitidas={["admin", "professor"]}>
                <TurmasArquivadas />
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
          <Route
            path="/perfilProfessor"
            element={
              <ProtectedRoute rolesPermitidas={["admin", "professor"]}>
                <PerfilProfessor />
              </ProtectedRoute>
            }
          />

          <Route
            path="/painelProfessor"
            element={
              <ProtectedRoute rolesPermitidas={["admin", "professor"]}>
                <PainelProfessor />
              </ProtectedRoute>
            }
          />

          <Route
            path="/editarProfessor"
            element={
              <ProtectedRoute rolesPermitidas={["admin"]}>
                <EditarProfessor />
              </ProtectedRoute>
            }
          />

          <Route
            path="/concederPermissoes"
            element={
              <ProtectedRoute rolesPermitidas={["admin"]}>
                <ConcederPermissoes />
              </ProtectedRoute>
            }
          />

      </Route>


      
    </Routes>
  );
}
