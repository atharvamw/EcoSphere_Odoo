FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm install

COPY . .

# Expose port for Next.js dev server
EXPOSE 3000

CMD ["npm", "run", "dev"]
