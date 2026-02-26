FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
# Usamos install para evitar errores si falta el lockfile
RUN npm install
COPY . .
RUN npm run build

FROM nginx:1.27.4-alpine3.21 AS runner
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 5173
CMD ["nginx", "-g", "daemon off;"]
