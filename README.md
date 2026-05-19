# Job Portal

Full stack Job Portal with Spring Boot, JWT authentication, PostgreSQL, React, Vite, Axios, React Router, and Tailwind CSS.

## Structure

- `jobportal/` - Java 21 Spring Boot backend
- `frontend/` - React Vite frontend

## Database

Create PostgreSQL database and user:

```sql
CREATE DATABASE jobportal_db;
CREATE USER akbar WITH PASSWORD 'akbar';
GRANT ALL PRIVILEGES ON DATABASE jobportal_db TO akbar;
```

Backend configuration is in `jobportal/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/jobportal_db
spring.datasource.username=akbar
spring.datasource.password=akbar
```

## Backend Run

```bash
cd jobportal
./mvnw spring-boot:run
```

On Windows PowerShell:

```powershell
cd jobportal
.\mvnw.cmd spring-boot:run
```

API runs on `http://localhost:8080`.

## Frontend Run

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

## Main API

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/profile`
- `GET /api/jobs`
- `GET /api/jobs/{id}`
- `POST /api/jobs/create`
- `PUT /api/jobs/update/{id}`
- `DELETE /api/jobs/delete/{id}`
- `GET /api/jobs/search?title=java`
- `GET /api/jobs/filter?category=Software&location=Bishkek&minSalary=500&maxSalary=5000`
- `GET /api/jobs/mine`
- `GET /api/chats/conversations`
- `GET /api/chats/jobs/{jobId}?participantId={userId}`
- `POST /api/chats/jobs/{jobId}/messages`

Jobs use salary in Kyrgyz soms. Job details show employer phone, chat, and a 2GIS location map.

Protected endpoints require:

```http
Authorization: Bearer <jwt-token>
```

## Verification

Backend:

```powershell
cd jobportal
.\mvnw.cmd clean test
```

Frontend:

```powershell
cd frontend
npm run build
```
