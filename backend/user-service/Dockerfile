FROM node:18-alpine
WORKDIR /app

COPY user-service/package*.json ./
RUN npm install --production    

COPY user-service ./             
COPY shared ./shared

CMD ["npm","run","dev"]