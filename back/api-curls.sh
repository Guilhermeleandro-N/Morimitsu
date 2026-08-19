# ============================================================
# API Morimitsu — Todos os curls
# {{endpoint}} = URL base do servidor (ex: http://localhost:3000)
# <token>      = token JWT obtido no login
# ============================================================

# ════════════════════════════════════════════════════════════
# APP
# ════════════════════════════════════════════════════════════

# GET /
curl -X GET {{endpoint}}/api/

# ════════════════════════════════════════════════════════════
# AUTH
# ════════════════════════════════════════════════════════════

# POST /auth/login
curl -X POST {{endpoint}}/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@morimitsu.com","senha":"Admin@123"}'

# POST /auth/refresh-token
curl -X POST {{endpoint}}/api/auth/refresh-token \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"<refreshToken>"}'

# POST /auth/logout
curl -X POST {{endpoint}}/api/auth/logout \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"<refreshToken>"}'

# ════════════════════════════════════════════════════════════
# USER
# ════════════════════════════════════════════════════════════

# POST /user — Criar usuário (público)
curl -X POST {{endpoint}}/api/user \
  -H "Content-Type: application/json" \
  -d '{"nome":"João Silva","email":"joao@email.com","senha":"Senha@123","telefone":"11999999999"}'

# GET /user — Listar usuários
curl -X GET {{endpoint}}/api/user \
  -H "Authorization: Bearer <token>"

# GET /user/:id — Buscar usuário
curl -X GET {{endpoint}}/api/user/<id> \
  -H "Authorization: Bearer <token>"

# PATCH /user/:id — Atualizar usuário
curl -X PATCH {{endpoint}}/api/user/<id> \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"nome":"João Souza","email":"joao.souza@email.com","telefone":"11988888888","status":"ENABLED"}'

# DELETE /user/:id — Deletar usuário
curl -X DELETE {{endpoint}}/api/user/<id> \
  -H "Authorization: Bearer <token>"

# ════════════════════════════════════════════════════════════
# ALUNO
# ════════════════════════════════════════════════════════════

# POST /aluno — Criar aluno
curl -X POST {{endpoint}}/api/aluno \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"usuarioId":"<usuarioId>","faixa":"BRANCA","grau_faixa":0,"frequencia_atual":0,"data_nascimento":"2005-02-20"}'

# GET /aluno/meu-perfil — Perfil do aluno logado


# GET /aluno — Listar alunos
curl -X GET {{endpoint}}/api/aluno \
  -H "Authorization: Bearer <token>"

# GET /aluno/minha-turma — Turmas em que o aluno logado participa
curl -X GET {{endpoint}}/api/aluno/minha-turma \
  -H "Authorization: Bearer <token>"

# GET /aluno/usuario/:usuarioId — Buscar aluno por usuário
curl -X GET {{endpoint}}/api/aluno/usuario/<usuarioId> \
  -H "Authorization: Bearer <token>"

# GET /aluno/:id — Buscar aluno
curl -X GET {{endpoint}}/api/aluno/<id> \
  -H "Authorization: Bearer <token>"

# PATCH /aluno/:id — Atualizar aluno
curl -X PATCH {{endpoint}}/api/aluno/<id> \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"faixa":"CINZA","grau_faixa":1,"frequencia_atual":35,"data_nascimento":"2005-02-20"}'

# PATCH /aluno/:id/graduar — Graduar automático
curl -X PATCH {{endpoint}}/api/aluno/<id>/graduar \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{}'

# PATCH /aluno/:id/graduar — Graduar manual
curl -X PATCH {{endpoint}}/api/aluno/<id>/graduar \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"faixa":"AZUL","grau_faixa":3}'

# DELETE /aluno/:id — Deletar aluno
curl -X DELETE {{endpoint}}/api/aluno/<id> \
  -H "Authorization: Bearer <token>"

# ════════════════════════════════════════════════════════════
# PROFESSOR
# ════════════════════════════════════════════════════════════

# POST /professor — Criar do zero
curl -X POST {{endpoint}}/api/professor \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"usuarioId":"<usuarioId>","faixa":"PRETA","grau":5}'

# POST /professor — Promover aluno
curl -X POST {{endpoint}}/api/professor \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"alunoId":"<alunoId>"}'

# POST /professor — Promover aluno com override
curl -X POST {{endpoint}}/api/professor \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"alunoId":"<alunoId>","faixa":"MARROM","grau":2}'

# GET /professor — Listar professores
curl -X GET {{endpoint}}/api/professor \
  -H "Authorization: Bearer <token>"

# GET /professor/painel — Painel do professor logado
curl -X GET {{endpoint}}/api/professor/painel \
  -H "Authorization: Bearer <token>"

# GET /professor/usuario/:usuarioId — Buscar por usuário
curl -X GET {{endpoint}}/api/professor/usuario/<usuarioId> \
  -H "Authorization: Bearer <token>"

# GET /professor/:id — Buscar professor
curl -X GET {{endpoint}}/api/professor/<id> \
  -H "Authorization: Bearer <token>"

# PATCH /professor/:id — Atualizar professor (sincroniza com aluno)
curl -X PATCH {{endpoint}}/api/professor/<id> \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"faixa":"PRETA","grau":6}'

# DELETE /professor/:id — Deletar professor
curl -X DELETE {{endpoint}}/api/professor/<id> \
  -H "Authorization: Bearer <token>"

# ════════════════════════════════════════════════════════════
# TURMA
# ════════════════════════════════════════════════════════════

# POST /turma — Criar turma
curl -X POST {{endpoint}}/api/turma \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"nome":"Karatê Kids","horario_inicio":"2025-01-01T08:00:00.000Z","horario_fim":"2025-01-01T09:00:00.000Z","segunda":true,"quarta":true,"sexta":true,"ativo":true}'

# GET /turma — Listar turmas
curl -X GET {{endpoint}}/api/turma \
  -H "Authorization: Bearer <token>"

# GET /turma/:id — Buscar turma
curl -X GET {{endpoint}}/api/turma/<id> \
  -H "Authorization: Bearer <token>"

# PATCH /turma/:id — Atualizar turma
curl -X PATCH {{endpoint}}/api/turma/<id> \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"nome":"Karatê Avançado","horario_inicio":"2025-01-01T10:00:00.000Z","horario_fim":"2025-01-01T11:00:00.000Z","segunda":false,"terca":true,"quinta":true,"ativo":true}'

# PATCH /turma/:id/status — Ativar/desativar
curl -X PATCH {{endpoint}}/api/turma/<id>/status \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"ativo":true}'

# DELETE /turma/:id — Deletar turma
curl -X DELETE {{endpoint}}/api/turma/<id> \
  -H "Authorization: Bearer <token>"

# --- Alunos na Turma ---

# POST /turma/:id/aluno — Adicionar aluno
curl -X POST {{endpoint}}/api/turma/<id>/aluno \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"aluno_id":"<alunoId>","frequente":"S"}'

# PATCH /turma/:id/aluno/:alunoId — Atualizar vínculo
curl -X PATCH {{endpoint}}/api/turma/<id>/aluno/<alunoId> \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"frequente":"N"}'

# GET /turma/:id/alunos — Listar alunos da turma
curl -X GET {{endpoint}}/api/turma/<id>/alunos \
  -H "Authorization: Bearer <token>"

# GET /turma/:id/alunos?incluirArquivados=true — Com arquivados
curl -X GET "{{endpoint}}/api/turma/<id>/alunos?incluirArquivados=true" \
  -H "Authorization: Bearer <token>"

# DELETE /turma/:id/aluno/:alunoId — Arquivar aluno
curl -X DELETE {{endpoint}}/api/turma/<id>/aluno/<alunoId> \
  -H "Authorization: Bearer <token>"

# --- Professores na Turma ---

# POST /turma/:id/professor — Adicionar professor
curl -X POST {{endpoint}}/api/turma/<id>/professor \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"professor_id":"<professorId>"}'

# GET /turma/:id/professores — Listar professores da turma
curl -X GET {{endpoint}}/api/turma/<id>/professores \
  -H "Authorization: Bearer <token>"

# ════════════════════════════════════════════════════════════
# FREQUÊNCIA (Aluno)
# ════════════════════════════════════════════════════════════

# POST /frequencia — Registrar frequência
curl -X POST {{endpoint}}/api/frequencia \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"aluno_id":"<alunoId>","professor_id":"<professorId>","turma_id":"<turmaId>","data":"2025-06-23T00:00:00.000Z","horario_inicio":"2025-06-23T08:00:00.000Z","horario_fim":"2025-06-23T09:00:00.000Z","status_presenca":"PRESENTE"}'

# PATCH /frequencia/:id — Atualizar frequência
curl -X PATCH {{endpoint}}/api/frequencia/<id> \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"status_presenca":"AUSENTE","data":"2025-06-23T00:00:00.000Z"}'

# GET /frequencia/aluno/:alunoId — Histórico do aluno
curl -X GET {{endpoint}}/api/frequencia/aluno/<alunoId> \
  -H "Authorization: Bearer <token>"

# GET /frequencia/turma/:turmaId — Frequências da turma
curl -X GET {{endpoint}}/api/frequencia/turma/<turmaId> \
  -H "Authorization: Bearer <token>"

# GET /frequencia/minhas-turmas — Frequências do professor logado
curl -X GET {{endpoint}}/api/frequencia/minhas-turmas \
  -H "Authorization: Bearer <token>"

# GET /frequencia/minhas-turmas — Com filtros
curl -X GET "{{endpoint}}/api/frequencia/minhas-turmas?turma_id=<turmaId>&aluno_id=<alunoId>&data_inicio=2025-06-01&data_fim=2025-06-30&frequente=S" \
  -H "Authorization: Bearer <token>"

# ════════════════════════════════════════════════════════════
# TREINO (Professor)
# ════════════════════════════════════════════════════════════

# POST /frequencia/treino — Registrar treino
curl -X POST {{endpoint}}/api/frequencia/treino \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"professor_id":"<professorId>","turma_id":"<turmaId>","data":"2025-06-23T00:00:00.000Z","status_aula":"REALIZADA"}'

# PATCH /frequencia/treino/:id — Atualizar treino
curl -X PATCH {{endpoint}}/api/frequencia/treino/<id> \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"status_aula":"CANCELADA","data_remarcacao":"2025-06-25T00:00:00.000Z"}'

# GET /frequencia/treino/professor/:professorId — Treinos do professor
curl -X GET {{endpoint}}/api/frequencia/treino/professor/<professorId> \
  -H "Authorization: Bearer <token>"

# ════════════════════════════════════════════════════════════
# PERFIL
# ════════════════════════════════════════════════════════════

# GET /perfil/permissoes — Catálogo de permissões
curl -X GET {{endpoint}}/api/perfil/permissoes \
  -H "Authorization: Bearer <token>"

# GET /perfil — Listar perfis
curl -X GET {{endpoint}}/api/perfil \
  -H "Authorization: Bearer <token>"

# GET /perfil/:id — Buscar perfil
curl -X GET {{endpoint}}/api/perfil/<id> \
  -H "Authorization: Bearer <token>"

# PATCH /perfil/:id/permissoes — Gerenciar permissões
curl -X PATCH {{endpoint}}/api/perfil/<id>/permissoes \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"adicionar":["aluno.read","professor.read"],"remover":["turma.update"]}'

# GET /perfil/usuario/:usuarioId — Perfis do usuário
curl -X GET {{endpoint}}/api/perfil/usuario/<usuarioId> \
  -H "Authorization: Bearer <token>"

# POST /perfil/usuario/:usuarioId — Atribuir perfil (promover)
curl -X POST {{endpoint}}/api/perfil/usuario/<usuarioId> \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"perfil_id":"perfil-professor","acao":"adicionar"}'

# POST /perfil/usuario/:usuarioId — Remover perfil (demitir)
curl -X POST {{endpoint}}/api/perfil/usuario/<usuarioId> \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"perfil_id":"perfil-professor","acao":"remover"}'

# ════════════════════════════════════════════════════════════
# NOTIFICAÇÃO
# ════════════════════════════════════════════════════════════

# GET /notificacao — Listar notificações
curl -X GET {{endpoint}}/api/notificacao \
  -H "Authorization: Bearer <token>"

# GET /notificacao/nao-lidas/count — Contar não lidas
curl -X GET {{endpoint}}/api/notificacao/nao-lidas/count \
  -H "Authorization: Bearer <token>"

# PATCH /notificacao/:id/lida — Marcar como lida
curl -X PATCH {{endpoint}}/api/notificacao/<id>/lida \
  -H "Authorization: Bearer <token>"
