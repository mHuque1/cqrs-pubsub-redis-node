---
status: "accepted"
date: 2025-06-05
decision-makers: Equipo de desarrollo (Mathias y colaboradores)
consulted: Profesor de la materia de Arquitectura de Software
informed: Resto del equipo y stakeholders
---

# ADR-0001: Elección de Arquitectura CQRS con Pub/Sub para Sincronización

## Context and Problem Statement

Estamos desarrollando un Gestor de Tareas Colaborativas que debe permitir a usuarios de distintos equipos crear, actualizar y consultar tareas asociadas a proyectos. La carga de trabajo puede ser alta en operaciones de lectura (consultar listas de tareas) y, al mismo tiempo, necesitamos mantener la consistencia de los datos cuando se ejecutan operaciones de escritura (crear/actualizar tareas). Queremos:

1. Aislar la lógica de escritura (comandos) de la lógica de lectura (consultas).
2. Optimizar la base de datos de lectura para respuestas rápidas.
3. Garantizar la sincronización eventual entre la base de escritura (MySQL) y la base de lectura (MongoDB) sin incurrir en bloqueos o latencias excesivas.

La pregunta clave es:  
> ¿Cómo separamos de forma clara las operaciones de modificación de estado de las de consulta, y a la vez mantenemos ambas bases sincronizadas de forma eficiente?

## Decision Drivers

* **Escalabilidad de lectura**: Mucho tráfico de consultas a la lista de tareas de un proyecto.
* **Aislamiento de responsabilidades**: Evitar que las operaciones de lectura ralenticen las escrituras, y viceversa.
* **Consistencia eventual**: Mantener los datos sincronizados entre MySQL y MongoDB sin incurrir en bloqueos de larga duración.
* **Simplicidad en la sincronización**: No queremos desarrollar un mecanismo manual complejo para replicar datos entre bases.
* **Facilidad de extensión**: En el futuro podrían añadirse más eventos o proyecciones (por ejemplo, historiales, estadísticas).

## Considered Options

* **Opción A: SQL único (MySQL) para lectura y escritura**  
* **Opción B: Arquitectura CQRS con tablas separadas en MySQL (una para comandos y otra para lecturas)**  
* **Opción C: Arquitectura CQRS con MySQL para comandos y MongoDB para lecturas, sincronizados mediante Pub/Sub (Redis)**  
* **Opción D: Event Sourcing completo (almacenar todos los eventos en un log y proyectar desde ahí)**

## Decision Outcome

Chosen option: **"Opción C: Arquitectura CQRS con MySQL para comandos y MongoDB para lecturas, sincronizados mediante Pub/Sub (Redis)"**, porque:

- Cumple el requisito de **separar lectura/escritura** en bases de datos distintas (MySQL para escritura, MongoDB para lectura), lo que permite optimizar cada una según su propósito.
- La sincronización por **Pub/Sub (Redis)** es un mecanismo ligero y probado, que facilita la distribución de eventos de cambio de estado.
- Evitamos la complejidad de implementar un Event Sourcing completo, manteniendo el diseño relativamente sencillo.
- Permite escalabilidad horizontal en la capa de lectura y escritura de forma independiente.

### Consequences

* **Good, porque**:
  - Las consultas de tareas solo tocan MongoDB, lo que reduce carga de MySQL cuando hay muchas lecturas.
  - Las escrituras (crear/actualizar) se llevan a MySQL nativamente con Prisma, garantizando transacciones ACID.
  - Redis Pub/Sub envía únicamente los eventos de cambio, evitando replicaciones completas o sincronizaciones batch.
  - Facilita añadir nuevas suscripciones o proyecciones en el futuro (por ejemplo, otra base de datos para analytics).

* **Bad, porque**:
  - Introduce complejidad operacional: hay tres componentes (MySQL, Redis, MongoDB) que deben estar correctamente orquestados.
  - Consistencia eventual: la información de lectura puede sufrir un pequeño retraso desde que se publica el evento hasta que MongoDB queda actualizado.
  - Mayor superficie de monitoreo y logging para detectar fallos en la sincronización.
  - Deberemos mantener escritas las lógicas de publicación en MySQL y las lógicas de suscripción en MongoDB, aumentando el esfuerzo de desarrollo.

### Confirmation

- **Implementación**:  
  1. En el Servidor A (Node.js + Prisma + MySQL), cada operación de creación/actualización de tarea publica un evento en Redis.  
  2. En el Servidor B (Express + Mongoose + MongoDB), se suscribe al canal “tareas” de Redis y ejecuta upsert sobre la colección `Tarea` en Mongo.  
  3. El endpoint de lectura (`GET /api/tareas/:proyectoId`) recupera datos desde Mongo y filtra por `equipoId` extraído del JWT.

- **Validación**:  
  - Pruebas manuales con Postman:  
    1. Crear tarea en MySQL → observar en consola de Redis y verificar documento en Mongo.  
    2. Actualizar tarea en MySQL → verificar cambio en el documento de Mongo.  
    3. Llamar endpoint de lectura y comprobar que devuelve datos actualizados.  
  - Tests automatizados:  
    - Mockear publicación en Redis y verificar que el suscriptor actualiza correctamente Mongo.  
    - Tests de integración con instancias locales de MySQL/Redis/Mongo.

---

## Pros and Cons of the Options

### Opción A: SQL único (MySQL) para lectura y escritura

Un solo esquema en MySQL donde se manejan tanto los comandos (INSERT/UPDATE) como las consultas (SELECT).

* Good, porque:
  - Simplicidad de despliegue: sólo se necesita MySQL.
  - Menos componentes a configurar y monitorear.
* Neutral, porque:
  - Prisma ya maneja transacciones y puede optimizar índices para lectura.
* Bad, porque:
  - Carga de lecturas intensivas puede afectar el rendimiento de las escrituras.
  - No se aprovecha la flexibilidad de un modelo de documento para consultas complejas.
  - Dificulta escalar lecturas de forma independiente a las escrituras.

### Opción B: CQRS con dos tablas en MySQL (misma base, tablas diferentes)

Mantener dos tablas:  
- `tarea_comando` (para CREATE/UPDATE),  
- `tarea_consulta` (para SELECT),  
ambas en la misma base MySQL, replicando datos entre ellas mediante triggers o lógica en la aplicación.

* Good, porque:
  - Se mantiene todo en MySQL, evitando introducir MongoDB.
  - Aun así se separan claramente comandos de consultas.
* Neutral, porque:
  - Podría usarse triggers de MySQL para replicar a la tabla de consulta.
* Bad, porque:
  - Triggers en MySQL pueden penalizar el rendimiento y complicar el esquema.
  - Es más costoso en términos de mantenimiento: cambios en el modelo requieren modificar triggers y lógica de replicación dentro de MySQL.
  - Sigue sin escalar lecturas tan bien como una base NoSQL optimizada para consultas.

### Opción C: CQRS con MySQL (comandos) + MongoDB (lecturas) + Pub/Sub (Redis)

Separar las bases (MySQL y MongoDB) y sincronizarlas mediante eventos en Redis.

* Good, porque:
  - Optimiza cada base según su caso de uso: transacciones ACID en MySQL, consultas rápidas en Mongo.
  - Redis Pub/Sub es ligero y desacopla la publicación de eventos de la lógica de suscripción.
  - Facilita escalar cada componente por separado (varios réplicas de Mongo para lecturas, varios procesos de comando para MySQL, etc.).
* Neutral, porque:
  - Se añade una capa extra (Redis) que debe gestionarse.
* Bad, porque:
  - La consistencia es eventual, puede haber un lapso breve entre la escritura y la disponibilidad en lectura.
  - Si Redis falla o el suscriptor no está disponible, las lecturas quedan desactualizadas hasta que se recupere la sincronización.
  - Mayor complejidad operativa: monitoreo y despliegue de 3 servicios en lugar de 1.

### Opción D: Event Sourcing completo

Almacenar cada evento (CREACIÓN_TAREA, ACTUALIZACIÓN_TAREA) en un log inmutable, y luego proyectar el estado actual a bases de lectura (Mongo, caches, etc.).

* Good, porque:
  - Historia completa de todos los eventos (útil para auditoría, retrocesos en el estado, reconstrucción de proyecciones).
  - Muy flexible para proyectar a múltiples vistas (reportes, estadísticas, etc.).
* Neutral, porque:
  - Incrementa la complejidad del diseño arquitectónico.
* Bad, porque:
  - Se requiere un motor de eventos (por ejemplo, Kafka) o una lógica elaborada para almacenar y reproducir eventos.
  - Curva de aprendizaje alta y tiempo de implementación muy superior al alcance del mini proyecto.
  - El beneficio de tolerancia a fallos y auditabilidad total no compensa en este alcance académico.

---

## More Information

- **Referencias**:  
  - Patrón CQRS: https://martinfowler.com/bliki/CQRS.html  
  - Redis Pub/Sub: https://redis.io/topics/pubsub  
  - Arquitecturas híbridas SQL/NoSQL: casos de uso y mejores prácticas.  
- **Revisiones futuras**:  
  - En un proyecto en producción, considerar el uso de Redis Streams o un broker como Kafka para mayor fiabilidad en la entrega de eventos.  
  - Si aparecen necesidades de auditoría muy estricta, migrar a un Event Sourcing completo.  
  - Evaluar monitorización y alertas en Redis para detectar retrasos en la sincronización.  

