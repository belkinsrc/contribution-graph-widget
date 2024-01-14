import { format, nextFriday, nextMonday, nextWednesday } from "date-fns";
import { block } from "../lib";

export class Graph {

  private static baseClassName: string = "graph";

  private static getClassName = block(Graph.baseClassName);

  render(): string {
    return `
      <article class="${Graph.getClassName()}">
        ${this.getActivity()}
        ${this.getMonths()}
        ${this.getWeekdays()}
      </article>
    `;
  }

  private getActivity(): string {
    const weeks: string = Array.from({ length: 51 }, () => this.createWeek()).join("");
    return `
      <div class="${Graph.getClassName("activity")}">
        ${weeks}    
      </div>
    `;
  }

  private getMonths(): string {
    const months: string[] = this.createMonths();
    return `
      <div class="${Graph.getClassName("months")}">
        ${this.convertToHTML(months, Graph.getClassName("month"))}
      </div>
    `;
  }

  private getWeekdays(): string {
    const weekdays: string[] = this.createWeekdays();
    return `
      <div class="${Graph.getClassName("weekdays")}">
        ${this.convertToHTML(weekdays, Graph.getClassName("weekday"))}
      </div>
    `;
  }

  private createSquares(count: number): HTMLDivElement[] {
    return Array.from({ length: count }, () => {
      const square = document.createElement("div");
      square.classList.add(Graph.getClassName("square"));
      return square;
    });
  }

  private createMonths(): string[] {
    return Array.from({ length: 12 }, (_, i) => format(new Date(1970, i), "MMM"));
  }

  private createWeek(): string {
    const convertSquaresToHTML = (): string => {
      const squares: HTMLDivElement[] = this.createSquares(7);

      return squares.map(square =>
        `<div class="${square.className}"></div>`
      ).join("");
    }
    return `
      <div class="${Graph.getClassName("week")}">
        ${convertSquaresToHTML()}
      </div>
    `;
  }

  private createWeekdays(): string[] {
    return [
      nextMonday(new Date()),
      nextWednesday(new Date()),
      nextFriday(new Date())
    ].map(weekday => format(weekday, "EEE"));
  }

  private convertToHTML<T>(target: T[], className: string): string {
    return target.map(elem =>
      `<div class="${className}">${elem}</div>`
    ).join("");
  }
}