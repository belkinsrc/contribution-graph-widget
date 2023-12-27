import { format, nextFriday, nextMonday, nextWednesday } from "date-fns";
import { block } from "../lib";

const getClassName = block("graph");

export class Graph {

  static #NUMBER_OF_SQUARES = 357;

  render() {
    return `
      <article class="${getClassName()}">
        ${this.#getActivity()}
        ${this.#getMonths()}
        ${this.#getWeekdays()}
      </article>
    `;
  }

  #getActivity() {
    const convertToHTML = () => {
      const squares = this.#createSquares(Graph.#NUMBER_OF_SQUARES);
  
      return squares.map(square => 
        `<div class="${square.className}"></div>`).join("");
    }
    return `
      <div class="${getClassName("activity")}">
        ${convertToHTML()}
      </div>
    `;
  }

  #getMonths() {
    const convertToHTML = () => {
      const months = this.#createMonths();
  
      return months.map(month => 
        `<div class="${getClassName("month")}">${month}</div>`).join("");
    }
    return `
      <div class="${getClassName("months")}">
        ${convertToHTML()}
      </div>
    `;
  }

  #getWeekdays() {
    const convertToHTML = () => {
      const weekdays = this.#createWeekdays();
  
      return weekdays.map(weekday => 
        `<div class="${getClassName("weekday")}">${weekday}</div>`).join("");
    }
    return `
      <div class="${getClassName("weekdays")}">
        ${convertToHTML()}
      </div>
    `;
  }

  #createSquares(count) {
    return Array.from({ length: count }, () => {
      const square = document.createElement("div");
      square.classList.add(getClassName("square"));
      return square;
    });
  }

  #createMonths() {
    return Array.from({ length: 12 }, (_, i) => format(new Date(1970, i), "MMM"));
  }
  
  #createWeekdays() {
    return [
      nextMonday(new Date()),
      nextWednesday(new Date()),
      nextFriday(new Date())
    ]
    .map(weekday => format(weekday, "EEE"));
  }
}