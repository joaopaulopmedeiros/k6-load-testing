// example rampage
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Kubernetes } from 'k6/x/kubernetes';

const manifest = `
apiVersion: apps/v1
kind: Deployment
metadata:
  name: k6-executor
  namespace: performance
spec:
  replicas: 2
  selector: 
    matchLabels:
      app: k6-executor
  template:
    metadata:
      labels:
        app: k6-executor
    spec:
      containers:
      - name: k6-executor
        image: grafana/k6
        command: ["k6", "run", "./script.js"]
`

export const options = {
  stages: [
    { duration: '1m', target: 3 },
  ],
};

export function setup() {
  const kubernetes = new Kubernetes();
 
  kubernetes.apply(manifest);

  const pods = kubernetes.list('pod', 'performance');

  console.log(`${pods.length} pods found:`);
  
  pods.map(function (pod) {
    console.log(`${pod.metadata.name}`);
  });
}

export default function () {
  const res = http.get('https://httpbin.test.k6.io/');
  check(res, { 'status was 200': (r) => r.status == 200 });
  sleep(1);
}