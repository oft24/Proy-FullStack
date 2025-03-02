# Proy-FullStack

// ...existing content...

## Despliegue en Render usando Docker

Para desplegar este proyecto en Render usando Docker, sigue estos pasos:

1. Asegúrate de tener Docker instalado en tu máquina. Puedes descargarlo desde [Docker](https://www.docker.com/get-started).

2. Crea un archivo `Dockerfile` en la raíz del proyecto con el siguiente contenido:

    ```Dockerfile
    // filepath: /c:/Users/luisi/OneDrive/Desktop/lastlast/Proy-FullStack/Dockerfile
    FROM node:14

    # Crear directorio de la aplicación
    WORKDIR /usr/src/app

    # Instalar dependencias de la aplicación
    COPY package*.json ./
    RUN npm install

    # Copiar el resto del código de la aplicación
    COPY . .

    # Exponer el puerto en el que la aplicación correrá
    EXPOSE 3000

    # Comando para correr la aplicación
    CMD ["npm", "start"]
    ```

3. Crea un archivo `docker-compose.yml` en la raíz del proyecto con el siguiente contenido:

    ```yaml
    // filepath: /c:/Users/luisi/OneDrive/Desktop/lastlast/Proy-FullStack/docker-compose.yml
    version: '3'
    services:
      web:
        build: .
        ports:
          - "3000:3000"
        environment:
          - NODE_ENV=production
    ```

4. Inicia sesión en tu cuenta de Render y crea un nuevo servicio web.

5. Selecciona la opción para desplegar desde un repositorio de Git y conecta tu repositorio.

6. En la configuración del servicio, selecciona la opción para usar Docker y asegúrate de que el nombre del archivo Dockerfile sea correcto.

7. Guarda la configuración y Render comenzará a construir y desplegar tu aplicación.

8. Una vez que el despliegue esté completo, tu aplicación estará disponible en la URL proporcionada por Render.

````