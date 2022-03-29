const { Worker, isMainThread, workerData } = require("worker_threads");

if (isMainThread) {
  console.log(`Main ${process.pid}`);
  new Worker(__filename, { workerData: [7, 6, 8, 1] });
  new Worker(__filename, { workerData: [3, 8, 1, 5] });
} else {
  // console.log(`Worker ${process.pid}`);
  console.log(`${workerData} sorted id ${workerData.sort()}`);
}
