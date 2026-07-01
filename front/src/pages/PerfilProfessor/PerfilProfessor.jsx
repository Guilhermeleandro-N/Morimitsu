import React from "react";
import "./PerfilProfessor.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  buscarProfessorEUsuario
} from "../../services/professorService";

import RoleGuard from "../../routes/RoleGuard";

const PerfilProfessor = () => {

  const navigate = useNavigate();
  const location = useLocation();

  const userId = location.state?.id;

  const [professorData, setProfessorData] =
    useState(null);

  const [primeiraLetra, setPrimeiraLetra] =
    useState("");

  async function buscarProfessor() {

    if (!userId) return;

    try {

      const response =
        await buscarProfessorEUsuario(
          userId
        );

      setProfessorData(
        response.professor
      );

      setPrimeiraLetra(
        response.professor.nome
          ?.charAt(0) ?? ""
      );

    } catch (error) {

      console.error(error);

    }

  }

  useEffect(() => {

    buscarProfessor();

  }, [userId]);

  const dadosProfessor =
    professorData || {};

  function formatarTelefone(
    telefone
  ) {

    if (!telefone) return "--";

    return telefone;

  }

  return (

    <div className="main">

      <div className="container">

        <header className="page-header">

          <div className="header-info">

            <h1>
              Perfil do Professor
            </h1>

            <p>
              Visualize os dados do professor
            </p>

          </div>

          <RoleGuard
            allowedRoutes={["admin"]}
          >

            <button
              className="btn-edit"
              onClick={() =>
                alert(
                  "Tela de edição ainda não implementada."
                )
              }
            >
              Editar Professor
            </button>

          </RoleGuard>

        </header>

        <main className="profile-grid">

          <aside className="sidebar-card">

            <h2 className="card-title">
              Dados Pessoais
            </h2>

            <div className="avatar-container">

              <div className="avatar-placeholder">

                {primeiraLetra}

              </div>

            </div>

            <h3 className="student-name">

              {dadosProfessor.nome ||
                "Professor"}

            </h3>

            <span
              className={`status-badge ${String(
                "enabled"
              ).toLowerCase()}`}
            >
              Ativo
            </span>

            <div className="personal-details">

              <p>

                <strong>
                  E-mail:
                </strong>{" "}

                {dadosProfessor.email ||
                  "--"}

              </p>

              <p>

                <strong>
                  Telefone:
                </strong>{" "}

                {formatarTelefone(
                  dadosProfessor.telefone
                )}

              </p>

              <p>

                <strong>
                  Faixa:
                </strong>{" "}

                {dadosProfessor.faixa ||
                  "--"}

              </p>

              <p>

                <strong>
                  Grau:
                </strong>{" "}

                {dadosProfessor.grau ??
                  "--"}

              </p>

            </div>

          </aside>

          <section className="content-card">

            <div className="history-header">

              <h3>
                Histórico de Frequências
              </h3>

            </div>

            {/*
            Futuramente será utilizado para listar
            as frequências ministradas pelo professor.

            <table className="history-table">

              <thead>

                <tr>

                  <th>Data</th>
                  <th>Turma</th>
                  <th>Horário</th>

                </tr>

              </thead>

              <tbody>

                {historico.map((item) => (

                  <tr key={item.id}>

                    <td>
                      {item.data}
                    </td>

                    <td>
                      {item.turma}
                    </td>

                    <td>
                      {item.horario}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>
            */}

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "350px",
                color: "#888",
                fontSize: "18px"
              }}
            >

              Histórico de frequências ainda
              não disponível.

            </div>

          </section>

        </main>

      </div>

    </div>

  );

};

export default PerfilProfessor;