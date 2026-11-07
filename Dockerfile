FROM node:22-bookworm-slim

WORKDIR /app
ENV DIRECT_URL="postgresql://sstb:sstb@localhost:5432/placeholder"
RUN apt-get update && apt-get install -y --no-install-recommends openssl && rm -rf /var/lib/apt/lists/*

# Install deps (postinstall runs `prisma generate`, so the schema must be present)
COPY package.json package-lock.json prisma.config.ts ./
COPY prisma ./prisma
ENV DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder"
RUN npm ci

# Build the app (migrations run at container start, not at build time)
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN RESEND_API_KEY=re_build_placeholder npx next build

ENV NODE_ENV=production
EXPOSE 3000
CMD ["sh", "-c", "npx prisma migrate deploy && npx next start -H 0.0.0.0 -p 3000"]
