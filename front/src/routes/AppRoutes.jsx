import React from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Login from "../pages/login/Login";
import EsqueciSenha from "../pages/EsqueciSenha/EsqueciSenha";
import Cadastros from "../pages/Cadastros/Cadastros";
import EditarAluno from "../pages/EditarAluno/EditarAluno";
import VisualizarTurmas from "../pages/Turmas/VisualizarTurmas";
import PerfilAluno from "../pages/PerfilAluno/PerfilAluno";
import ProtectedRoute from "./ProtectedRoutes";
import RedirectPorPerfil from "./RedirectPorPerfil";
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

const TODOS_PERFIS = ["admin", "professor", "aluno"];
const PROFESSOR = ["admin", "professor"];

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/esqueciSenha" element={<EsqueciSenha />} />
      <Route path="/cadastrarUsuario" element={<CadastrarUsuario />} />

      <Route
        element={
          <ProtectedRoute rolesPermitidas={TODOS_PERFIS}>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<RedirectPorPerfil />} />

        <Route
          path="/turmas"
          element={
            <ProtectedRoute rolesPermitidas={TODOS_PERFIS}>
              <VisualizarTurmas />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cadastros"
          element={
            <ProtectedRoute
              rolesPermitidas={PROFESSOR}
              permissoesNecessarias={["screen.aluno.criar"]}
            >
              <Cadastros />
            </ProtectedRoute>
          }
        />

        <Route
          path="/editarAluno"
          element={
            <ProtectedRoute
              rolesPermitidas={PROFESSOR}
              permissoesNecessarias={["screen.aluno.perfil"]}
            >
              <EditarAluno />
            </ProtectedRoute>
          }
        />

        <Route
          path="/perfilAluno"
          element={
            <ProtectedRoute
              rolesPermitidas={TODOS_PERFIS}
              permissoesNecessarias={["screen.perfil"]}
            >
              <PerfilAluno />
            </ProtectedRoute>
          }
        />

        <Route
          path="/turmasArquivadas"
          element={
            <ProtectedRoute
              rolesPermitidas={PROFESSOR}
              permissoesNecessarias={["screen.turma.listar"]}
            >
              <TurmasArquivadas />
            </ProtectedRoute>
          }
        />

        <Route
          path="/listarAluno"
          element={
            <ProtectedRoute
              rolesPermitidas={PROFESSOR}
              permissoesNecessarias={["screen.aluno.listar"]}
            >
              <ListarAluno />
            </ProtectedRoute>
          }
        />

        <Route
          path="/alunosTurma"
          element={
            <ProtectedRoute
              rolesPermitidas={PROFESSOR}
              permissoesNecessarias={["screen.aluno.listar"]}
            >
              <AlunosTurma />
            </ProtectedRoute>
          }
        />

        <Route
          path="/historicoTreinos"
          element={
            <ProtectedRoute
              rolesPermitidas={PROFESSOR}
              permissoesNecessarias={["screen.treino.visualizar"]}
            >
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
            <ProtectedRoute
              rolesPermitidas={PROFESSOR}
              permissoesNecessarias={["screen.professor.perfil"]}
            >
              <PerfilProfessor />
            </ProtectedRoute>
          }
        />

        <Route
          path="/painelProfessor"
          element={
            <ProtectedRoute
              rolesPermitidas={PROFESSOR}
              permissoesNecessarias={["screen.dashboard"]}
            >
              <PainelProfessor />
            </ProtectedRoute>
          }
        />

        <Route
          path="/editarProfessor"
          element={
            <ProtectedRoute rolesPermitidas={["admin", "professor"]}>
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
