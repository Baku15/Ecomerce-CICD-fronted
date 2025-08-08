# Build stage
FROM node:18 AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build -- --configuration production

# Serve stage
FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /app/dist/proyecto-tienda /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
