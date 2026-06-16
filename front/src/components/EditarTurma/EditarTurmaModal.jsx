import React, { useState } from "react";
import "./EditarTurmaModal.css";
import  {AtualizarTurma}  from "../../services/turmaService";

function EditarTurmaModal({ turma, onClose, onSave }) {
    console.log("TURMA RECEBIDA:", turma);
    const [formData, setFormData] = useState({
        id: turma.id,
        nome: turma.nome || "",

        horario_inicio: turma.horario_inicio
            ? new Date(turma.horario_inicio)
                .toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                })
            : "",

        horario_fim: turma.horario_fim
            ? new Date(turma.horario_fim)
                .toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                })
            : "",

        data_especifica: turma.data_especifica
            ? turma.data_especifica.split("T")[0]
            : "",

        segunda: turma.segunda || false,
        terca: turma.terca || false,
        quarta: turma.quarta || false,
        quinta: turma.quinta || false,
        sexta: turma.sexta || false,
        sabado: turma.sabado || false,
        domingo: turma.domingo || false,
    });

    function handleChange(e) {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    function toggleDia(dia) {
        setFormData((prev) => ({
            ...prev,
            [dia]: !prev[dia],
        }));
    }

    async function handleSubmit() {
    const payload = {
        nome: formData.nome,
        horario_inicio: `2024-01-01T${formData.horario_inicio}:00.000Z`,
        horario_fim: `2024-01-01T${formData.horario_fim}:00.000Z`,
        data_especifica: formData.data_especifica
            ? `${formData.data_especifica}T00:00:00.000Z`
            : null,
        segunda: formData.segunda,
        terca: formData.terca,
        quarta: formData.quarta,
        quinta: formData.quinta,
        sexta: formData.sexta,
        sabado: formData.sabado,
        domingo: formData.domingo,
    };

    await AtualizarTurma(formData.id, payload);

    await onSave(formData);
}

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <h2>Editar Turma</h2>

                <div className="modal-form">

                    <div className="input-group full-width">
                        <label>Nome da turma</label>

                        <input
                            type="text"
                            name="nome"
                            value={formData.nome}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="input-group">
                        <label>Horário início</label>

                        <input
                            type="time"
                            name="horario_inicio"
                            value={formData.horario_inicio}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="input-group">
                        <label>Horário fim</label>

                        <input
                            type="time"
                            name="horario_fim"
                            value={formData.horario_fim}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="input-group full-width">
                        <label>Data específica</label>

                        <input
                            type="date"
                            name="data_especifica"
                            value={formData.data_especifica}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="input-group full-width">
                        <label>Dias da semana</label>

                        <div className="week-buttons">

                            <button
                                type="button"
                                className={formData.segunda ? "active-day" : ""}
                                onClick={() => toggleDia("segunda")}
                            >
                                SEG
                            </button>

                            <button
                                type="button"
                                className={formData.terca ? "active-day" : ""}
                                onClick={() => toggleDia("terca")}
                            >
                                TER
                            </button>

                            <button
                                type="button"
                                className={formData.quarta ? "active-day" : ""}
                                onClick={() => toggleDia("quarta")}
                            >
                                QUA
                            </button>

                            <button
                                type="button"
                                className={formData.quinta ? "active-day" : ""}
                                onClick={() => toggleDia("quinta")}
                            >
                                QUI
                            </button>

                            <button
                                type="button"
                                className={formData.sexta ? "active-day" : ""}
                                onClick={() => toggleDia("sexta")}
                            >
                                SEX
                            </button>

                            <button
                                type="button"
                                className={formData.sabado ? "active-day" : ""}
                                onClick={() => toggleDia("sabado")}
                            >
                                SAB
                            </button>

                            <button
                                type="button"
                                className={formData.domingo ? "active-day" : ""}
                                onClick={() => toggleDia("domingo")}
                            >
                                DOM
                            </button>

                        </div>
                    </div>

                </div>

                <div className="modal-buttons">

                    <button
                        className="btn-sair"
                        onClick={onClose}
                    >
                        Cancelar
                    </button>

                    <button
                        className="btn-salvar"
                        onClick={handleSubmit}
                    >
                        Salvar
                    </button>

                </div>
            </div>
        </div>
    );
}

export default EditarTurmaModal;