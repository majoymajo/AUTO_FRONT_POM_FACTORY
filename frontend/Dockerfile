# -----------------------------------------------------------------------------
# Stage 1: Builder — install deps and build static assets
# -----------------------------------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .
RUN npm run build

# -----------------------------------------------------------------------------
# Stage 2: Runner — serve built files with Nginx
# -----------------------------------------------------------------------------
FROM nginx:alpine AS runner

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 5173

CMD ["nginx", "-g", "daemon off;"]
