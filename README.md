# 🧩 Objetivo General
Desarrollar una API de gestión de tareas colaborativas usando arquitectura CQRS, bases de datos separadas y sincronización mediante Redis Pub/Sub.

# 🔧 Tecnologías y Herramientas
- Node.js, Express, TypeScript
- MySQL → escritura (comandos: crear y actualizar tareas)
- MongoDB → lectura (consultas)
- Redis (Pub/Sub) → para sincronización entre MySQL y MongoDB
- JWT → autenticación
- GitHub → nuevo repositorio bajo la misma organización

# 📌 Requisitos Funcionales
1. Login → retornar JWT válido.
2. Crear Tarea → asociada a un proyecto (requiere JWT).
3. Actualizar Estado de Tarea → requiere JWT.
4. Consultar Tareas de un Proyecto → lectura desde MongoDB (requiere JWT).
5. Control de Acceso → solo ver tareas del equipo del usuario.
6. Sincronización Automática:
   - Guardar cambios en MySQL.
   - Emitir eventos Redis.
   - Servicio "sincronizador" escucha y actualiza MongoDB.

# 👥 Usuarios
Puedes optar entre:

- **Opción A**: Asumir que los usuarios ya existen → incluir script de inicialización con 2 usuarios (email, password, equipo).
- **Opción B**: Implementar registro de nuevos usuarios con asignación de equipo.

# 🧪 Pruebas y Documentación
- Código HTTP estándar.
- ADR (Architecture Decision Records) → documentar decisiones importantes del diseño. Usar [MADR template](https://github.com/adr/madr/blob/develop/template/adr-template.md)
- Subir colección de Postman utilizada en desarrollo/pruebas.

📅 Entrega
- Deadline: Martes 09 de Junio, antes de las 23:59
- Evaluación: Vale 4 puntos de ejercicios prácticos.