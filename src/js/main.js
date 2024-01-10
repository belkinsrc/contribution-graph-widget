import "../sass/main.scss";
import { GraphModel } from "./model";
import { Graph } from "./ui";

new Promise(resolve => {
  const graph = new Graph();
  document.querySelector("._page").innerHTML = graph.render();
  resolve();

}).then(() => {
  const graphModel = new GraphModel();
  graphModel.run();
})



