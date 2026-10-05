# Etapa 1: Compilación con Maven
FROM maven:3.9.9-amazoncorretto-23-alpine AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Etapa 2: Ejecución de la aplicación
FROM amazoncorretto:23-alpine
WORKDIR /app
COPY --from=build /app/target/examenU1Front-0.0.1-SNAPSHOT.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]