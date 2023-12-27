import "../sass/main.scss";
import { Graph } from "./ui";

const graph = new Graph();

document.querySelector("._page").innerHTML = graph.render();