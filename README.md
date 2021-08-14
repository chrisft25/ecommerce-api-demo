# E-Commerce Demo API
# Requerimientos
- [Node.js](https://nodejs.org/es/download/) (probado en última LTS: ```14.17.5```)
- [Docker](https://docs.docker.com/get-docker/) (Esto es por si quieres agilizar el proceso de despliegue)
- [Docker Compose](https://docs.docker.com/compose/install/) (Permite ejecutar facilmente una orquestación de contenedores)
- [Serverless Framework](https://www.npmjs.com/package/serverless) (Si no lo deseas correr con Docker, necesitarás este paquete)
- [MySQL o PostgreSQL](https://www.prisma.io/docs/) (Puedes usar tú gestor favorito. Prisma se encargará del resto :))
- [Redis](https://redis.io/) (opcional. Redis funciona para el caché de peticiones, pero puedes desactivarlo colocando la variable de entorno ```REDIS_ACTIVE=0``` en tu archivo ```.env```)

# Clonar repositorio
- Clona el repositorio utilizando ```git clone git@github.com:chrisft25/ecommerce-api-demo.git```
- Crea el archivo ```.env``` en la raíz del proyecto, tomando como ejemplo el archivo ```.env-example```
> Aquí iran las configuraciones necesarias del proyecto. Para la variable de DATABASE_URL puedes leer la siguiente documentación: https://www.prisma.io/docs/concepts/database-connectors

# Ejecutando con Docker 🐳
- Ejecuta el comando ```docker-compose up``` para correr los contenedores y listo :)

# Ejecutando en local 💻
- Ejecuta ```npm install``` para instalar las dependencias.
- Ejecuta ```npm install -g serverless``` para instalar el paquete de [Serverless Framework](https://www.npmjs.com/package/serverless).
- Ejecuta ```npm run db:deploy``` para crear las tablas de la Base de Datos.
- Ejecuta ```npm run db:generate``` para crear el cliente de Prisma que vamos a utilizar.
- Ejecuta ```npm run dev``` para correr localmente tu proyecto en el puerto 3000.

# Tareas

- [X] Configuración inicial del proyecto.
- [X] Implementación de base de datos.
- [X] Sistema de migraciones de base de datos.
- [X] Configuración de contenedores Docker para desarrollo.
- [X] Lógica de Middlewares en funciones serverless.
- [X] Estrategia de despliegue a development y production.
- [X] Crear workflows de Github Actions para CI/CD.
- [X] Log management (Cloudwatch).
- [ ] Implementación de Redis.
- [ ] Autenticación por JWT.
- [X] CRUD de usuarios.
- [ ] CRUD de categorías.
- [ ] CRUD de direcciones de usuario.
- [ ] CRUD de productos.
- [ ] Especificar cobertura con ISO 3166 de nombres de países en productos.
- [ ] Especificar contenido por geolocalización.
- [ ] Especificar precios por geolocalización.
- [ ] Crear reviews en productos.
- [ ] Identificación de geolocalización por IP.
- [ ] Filtros de productos por geolocalización por IP o dirección default de usuario.
- [ ] Filtros de productos por precio.
- [ ] Ordenar productos por promedio de reviews y geolocalización.
- [ ] Test unitarios.