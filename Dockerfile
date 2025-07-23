FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --production || npm install --legacy-peer-deps --production
COPY . .
RUN npm run build
CMD ["npm", "start"]
