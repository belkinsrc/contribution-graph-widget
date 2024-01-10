import { format, nextFriday, nextMonday, nextWednesday } from "date-fns";
import { block } from "../lib";

const getClassName = block("graph");

export class Graph {

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
    const weeks = Array.from({ length: 51 }, () => this.#createWeek()).join("");
    return `
      <div class="${getClassName("activity")}">
        ${weeks}    
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

  #createWeek() {
    const convertToHTML = () => {
      const squares = this.#createSquares(7);

      return squares.map(square =>
        `<div class="${square.className}"></div>`
      ).join("");
    }
    return `
      <div class="${getClassName("week")}">
        ${convertToHTML()}
      </div>
    `;
  }

  #createWeekdays() {
    return [
      nextMonday(new Date()),
      nextWednesday(new Date()),
      nextFriday(new Date())
    ].map(weekday => format(weekday, "EEE"));
  }
}