import React, { useState } from "react";
import "./CriarTurmaModal.css";

import { criarTurma } from "../../services/turmaService";

function CriarTurmaModal({ onClose, onCreate }) {

  const [formData, setFormData] = useState({
    nome: "",
    horario_inicio: "",
    horario_fim: "",
    data_especifica: "",

    segunda: false,
    terca: false,
    quarta: false,
    quinta: false,
    sexta: false,
    sabado: false,
    domingo: false,
  });

  const [message, setMessage] = useState("");

  function handleChange(e) {

    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox"
        ? checked
        : value,
    });

  }

  function criarDataHora(hora) {

    if (!hora) return null;

    const hoje = new Date();

    const [horas, minutos] = hora.split(":");

    hoje.setHours(horas);
    hoje.setMinutes(minutos);
    hoje.setSeconds(0);

    return hoje;

  }

  async function handleSubmit() {

    try {

      const response = await criarTurma(
        formData.nome,

        criarDataHora(formData.horario_inicio),

        criarDataHora(formData.horario_fim),

        formData.data_especifica || null,

        formData.segunda,
        formData.terca,
        formData.quarta,
        formData.quinta,
        formData.sexta,
        formData.sabado,
        formData.domingo
      );

      if (
        response?.status === 201 ||
        response?.status === 200
      ) {

        setMessage("Turma criada com sucesso");

        if (onCreate) {
          onCreate(response.data);
        }

        setTimeout(() => {
          onClose();
        }, 1000);

      } else {

        setMessage("Erro ao criar turma");

      }

    } catch (error) {

      console.log(error);
      setMessage("Erro ao conectar com servidor");

    }

  }

  return (
    <div className="modal-overlay">

      <div className="modal-container">

        <h2>Criar nova turma</h2>

        <div className="modal-form">

          {/* NOME */}
          <div className="input-group full-width">

            <label>Nome da turma</label>

            <input
              type="text"
              name="nome"
              placeholder="Ex: Turma Quinta à noite"
              value={formData.nome}
              onChange={handleChange}
            />

          </div>

          {/* HORÁRIO INÍCIO */}
          <div className="input-group">

            <label>Horário início</label>

            <input
              type="time"
              name="horario_inicio"
              value={formData.horario_inicio}
              onChange={handleChange}
            />

          </div>

          {/* HORÁRIO FIM */}
          <div className="input-group">

            <label>Horário fim</label>

            <input
              type="time"
              name="horario_fim"
              value={formData.horario_fim}
              onChange={handleChange}
            />

          </div>

          {/* DATA ESPECÍFICA */}
          <div className="input-group full-width">

            <label>Data específica (opcional)</label>

            <input
              type="date"
              name="data_especifica"
              value={formData.data_especifica}
              onChange={handleChange}
            />

          </div>

          {/* DIAS DA SEMANA */}
          <div className="input-group full-width">

            <label>Dias da semana</label>

            <div className="week-buttons">

              <button
                type="button"
                className={formData.segunda ? "active-day" : ""}
                onClick={() =>
                  setFormData({
                    ...formData,
                    segunda: !formData.segunda,
                  })
                }
              >
                SEG
              </button>

              <button
                type="button"
                className={formData.terca ? "active-day" : ""}
                onClick={() =>
                  setFormData({
                    ...formData,
                    terca: !formData.terca,
                  })
                }
              >
                TER
              </button>

              <button
                type="button"
                className={formData.quarta ? "active-day" : ""}
                onClick={() =>
                  setFormData({
                    ...formData,
                    quarta: !formData.quarta,
                  })
                }
              >
                QUA
              </button>

              <button
                type="button"
                className={formData.quinta ? "active-day" : ""}
                onClick={() =>
                  setFormData({
                    ...formData,
                    quinta: !formData.quinta,
                  })
                }
              >
                QUI
              </button>

              <button
                type="button"
                className={formData.sexta ? "active-day" : ""}
                onClick={() =>
                  setFormData({
                    ...formData,
                    sexta: !formData.sexta,
                  })
                }
              >
                SEX
              </button>

              <button
                type="button"
                className={formData.sabado ? "active-day" : ""}
                onClick={() =>
                  setFormData({
                    ...formData,
                    sabado: !formData.sabado,
                  })
                }
              >
                SAB
              </button>

              <button
                type="button"
                className={formData.domingo ? "active-day" : ""}
                onClick={() =>
                  setFormData({
                    ...formData,
                    domingo: !formData.domingo,
                  })
                }
              >
                DOM
              </button>

            </div>

          </div>

        </div>

        {message && (
          <p className="message">
            {message}
          </p>
        )}

        <div className="modal-buttons">

          <button
            className="btn-sair"
            onClick={onClose}
          >
            Sair
          </button>

          <button
            className="btn-salvar"
            onClick={handleSubmit}
          >
            Criar Turma
          </button>

        </div>

      </div>

    </div>
  );
}

export default CriarTurmaModal;