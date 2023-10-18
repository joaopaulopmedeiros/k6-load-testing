FROM grafana/k6

COPY src/script.js src/script.js

CMD ["run", "src/script.js"]