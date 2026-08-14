import React, { useState } from "react";
import "./CriarTurmaModal.css";

import { criarTurma } from "../../services/turmaService";
import { useToast } from "../../context/ToastContext";

function CriarTurmaModal({ onClose, onCreate }) {
  const { mostrar } = useToast();

  const [formData, setFormData] = useState({
    nome: "",
    horario_inicio: "",
    horario_fim: "",

    segunda: false,
    terca: false,
    quarta: false,
    quinta: false,
    sexta: false,
    sabado: false,
    domingo: false,
  });

  const { addToast } = useToast();

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  }

  function criarDataHora(hora) {
    if (!hora) return null;

    const hoje = new Date();

    const [horas, minutos] = hora.split(":");

    hoje.setUTCHours(horas);
    hoje.setUTCMinutes(minutos);
    hoje.setUTCSeconds(0);
    hoje.setUTCMilliseconds(0);

    return hoje;
  }

  function validarFormulario() {
    const nome = formData.nome.trim();
    const inicio = formData.horario_inicio;
    const fim = formData.horario_fim;
    const diasSelecionados = [
      formData.segunda,
      formData.terca,
      formData.quarta,
      formData.quinta,
      formData.sexta,
      formData.sabado,
      formData.domingo,
    ].some(Boolean);

    if (!nome) {
      addToast("Preencha o nome da turma.", "error");
      return false;
    }

    if (!inicio || !fim) {
      addToast("Informe o horário de início e fim da turma.", "error");
      return false;
    }

    if (!diasSelecionados) {
      addToast("Selecione ao menos um dia da semana.", "error");
      return false;
    }

    const inicioEmMinutos =
      Number(inicio.split(":")[0]) * 60 + Number(inicio.split(":")[1]);
    const fimEmMinutos =
      Number(fim.split(":")[0]) * 60 + Number(fim.split(":")[1]);

    if (fimEmMinutos <= inicioEmMinutos) {
      addToast("O horário de fim deve ser maior que o de início.", "error");
      return false;
    }

    return true;
  }

  async function handleSubmit() {
    if (!validarFormulario()) {
      return;
    }

    try {
      const response = await criarTurma(
        formData.nome.trim(),

        criarDataHora(formData.horario_inicio),

        criarDataHora(formData.horario_fim),

        formData.segunda,
        formData.terca,
        formData.quarta,
        formData.quinta,
        formData.sexta,
        formData.sabado,
        formData.domingo,
      );

      if (response?.status === 201 || response?.status === 200) {
        addToast("Turma criada com sucesso!", "success");

        if (onCreate) {
          onCreate(response.data);
        }

        setTimeout(() => {
          onClose();
        }, 2500);
      } else {
        addToast("Erro ao criar turma.", "error");
      }
    } catch (error) {
      console.log(error);
      addToast("Erro ao conectar com o servidor.", "error");
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2>Criar nova turma</h2>

        <div className="modal-form">
          {/* NOME */}
          <div className="input-group full-width">
            <label>
              Nome da turma
              <span className="required-mark">*</span>
            </label>

            <input
              type="text"
              name="nome"
              placeholder="Ex: Turma Quinta à noite"
              value={formData.nome}
              onChange={handleChange}
              required
            />
          </div>

          {/* HORÁRIO INÍCIO */}
          <div className="input-group">
            <label>
              Horário início
              <span className="required-mark">*</span>
            </label>

            <input
              type="time"
              name="horario_inicio"
              value={formData.horario_inicio}
              onChange={handleChange}
              required
            />
          </div>

          {/* HORÁRIO FIM */}
          <div className="input-group">
            <label>
              Horário fim
              <span className="required-mark">*</span>
            </label>

            <input
              type="time"
              name="horario_fim"
              value={formData.horario_fim}
              onChange={handleChange}
              required
            />
          </div>

          {/* DIAS DA SEMANA */}
          <div className="input-group full-width">
            <label>
              Dias da semana
              <span className="required-mark">*</span>
            </label>

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

        <div className="modal-buttons">
          <button className="btn-sair" onClick={onClose}>
            Sair
          </button>

          <button className="btn-salvar" onClick={handleSubmit}>
            Criar Turma
          </button>
        </div>
      </div>
    </div>
  );
}

export default CriarTurmaModal;
