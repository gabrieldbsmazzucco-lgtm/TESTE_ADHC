# ADHC

## Backend Java (Calendário)

Este projeto possui um backend em Java (Spring Boot) para persistir as partidas do calendário para todos os usuários.

### Rodando o backend

```bash
cd backend
mvn spring-boot:run
```

API disponível em `http://localhost:8080/api/partidas`.

### Login de administrador

A edição no painel admin exige login.

Credenciais padrão:
- usuário: `admin`
- senha: `adhc2026`

Você pode sobrescrever em produção com argumentos Java:

```bash
mvn spring-boot:run -Dspring-boot.run.jvmArguments="-Dadhc.admin.username=seu_usuario -Dadhc.admin.password=sua_senha_forte"
```

### Endpoints

- `GET /api/partidas` → lista partidas (público)
- `POST /api/partidas/login` → valida credenciais admin (`X-Admin-User`, `X-Admin-Pass`)
- `PUT /api/partidas` → substitui/salva todas as partidas (requer headers admin)
- `POST /api/partidas/reset` → restaura partidas padrão (requer headers admin)