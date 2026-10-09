FROM node:22-alpine
WORKDIR /app
COPY . .
ENV NODE_ENV=production PORT=3000 HOST=0.0.0.0 TRUST_PROXY=1
# Montez un volume persistant sur /app/storage (base de données + médias envoyés)
VOLUME ["/app/storage"]
EXPOSE 3000
RUN chown -R node:node /app
USER node
CMD ["node", "--disable-warning=ExperimentalWarning", "server.js"]
