# Sistema de procesamiento de movimientos contables (Segunda prueba de actuación - M7B - 2025)

## 📚 Descripción

Este proyecto implementa un sistema de procesamiento de movimientos contables con arquitectura distribuida:

- **Express** como API REST
- **MySQL** como base de datos relacional (persistencia oficial)
- **Redis** como sistema de caché para optimizar consultas
- **RabbitMQ** como sistema de mensajería (Pub/Sub)
- **MongoDB** como base de datos NoSQL para el procesamiento en el Server B

---

## 🚀 Flujos implementados

### 🔵 Flujo Azul (Ingreso y procesamiento del dato)

- **POST** `http://localhost:3000/api/movements`
- Valida el movimiento:
    - Campos no vacíos.
    - `movementDate` debe ser la fecha actual.
    - Los códigos de banco deben contener `-`.
- Persiste el dato en **MySQL**.
- Publica el movimiento a la queue `movements` en **RabbitMQ**.

### 🔴 Flujo Rojo (Consulta de un movimiento)

- **GET** `http://localhost:3000/api/movements/:authorizationNumber`
- Búsqueda priorizada:
    1. En **Redis**:
        - Si está → devuelve con `"status": "obtenido del caché"`.
    2. En **MySQL**:
        - Si no estaba en cache → busca en MySQL.
        - Guarda en Redis.
        - Devuelve con `"status": "obtenido de base de datos"`.
- Si no existe → `404 "dato no encontrado"`.

### 🟢 Flujo Verde (Consultas avanzadas)

- **GET** `http://localhost:3001/api/movements-between-dates?fromDate=YYYY-MM-DD&toDate=YYYY-MM-DD`
    - Permite obtener movimientos filtrados por fecha.
    - Al menos una de las dos fechas es obligatoria.

- **GET** `http://localhost:3001/api/movements-grouped-by-month`
    - Devuelve movimientos agrupados por `yyyymm` con suma total de `amount`.

    Ejemplo de respuesta:

    ```json
    [
      { "yyyymm": "202401", "amount": 50000 },
      { "yyyymm": "202402", "amount": 30000 }
    ]
    ```

- Los datos del Flujo Verde se obtienen desde **MongoDB** (server B).

---

## 🧪 Pruebas automáticas

Levantar con docker-compose up -d
luego ir a `/tester` y ejecutar npm run test


