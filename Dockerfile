FROM node

WORKDIR /app

COPY package.json .
COPY vite.config.js .
COPY .eslintrc.cjs .

RUN npm i

COPY . .

EXPOSE 5173
CMD ["npm", "run", "dev"]