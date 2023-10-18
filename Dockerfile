FROM grafana/k6

COPY src/script.js src/script.js

CMD ["run", "--vus", "10", "--duration", "30s", "src/script.js"]