import { format } from "date-fns";
import { fetchContributionData } from "../api";

export class GraphModel {

  private static selectedSquare: HTMLDivElement | null = null;

  run(): void {
    const squares: NodeListOf<HTMLDivElement> = document.querySelectorAll(".graph__square");

    fetchContributionData()
      .then(data => {
        this.setDataAttributes(squares, data);
        this.setActivityLevel(squares);
        this.selectSquare();
      })
  }

  private setDataAttributes(squares: NodeListOf<HTMLDivElement>, data: ContributionData): void {
    squares.forEach((square, i) => {
      const currentDateKey: string = Object.keys(data)[i];
      const currentValueOfKey: number = data[currentDateKey as keyof ContributionData];
      square.dataset.date = currentDateKey;
      square.dataset.contribution = currentValueOfKey.toString(); // ?
    })
  }

  private setActivityLevel(squares: NodeListOf<HTMLDivElement>): void {
    const styles = getComputedStyle(document.documentElement);

    const thresholds = [0, 1, 5, 10, 15];
    const colorVariables = ["--level0", "--level1", "--level2", "--level3", "--level4"];

    squares.forEach(square => {
      const contribution = Number(square.dataset.contribution);

      const colorVariable = thresholds.reduce((acc, threshold, index) => {
        return contribution >= threshold ? colorVariables[index] : acc;
      }, colorVariables[0]);

      square.style.backgroundColor = styles.getPropertyValue(colorVariable);
    });
  }

  private selectSquare(): void {
    const activity: HTMLDivElement = document.querySelector(".graph__activity")!;

    activity.addEventListener("click", this.handleSquareClick);
    document.addEventListener("click", this.handleDocumentClick);
  }

  private showSquareInfo(parentNode: HTMLDivElement): void {
    const contributionCount = `${parentNode.dataset.contribution} contributions`;
    const currentDate = format(parentNode.dataset.date!, 'EEEE, MMMM dd, Y');

    parentNode.innerHTML = `
      <div class="info">
        <p class="info__text">${contributionCount}</p>
        <p class="info__date">${currentDate}</p>
      </div>
    `;
  }

  private hideSelectedSquareInfo(): void {
    GraphModel.selectedSquare!.classList.remove("graph__square--selected");
    GraphModel.selectedSquare!.innerHTML = "";
    GraphModel.selectedSquare = null;
  }

  private setSelectedSquare(square: HTMLDivElement): void {
    if (square.classList.contains("graph__square--selected")) {
      return;
    }

    if (GraphModel.selectedSquare) {
      this.hideSelectedSquareInfo();
    }
    square.classList.add("graph__square--selected");
    GraphModel.selectedSquare = square;
    this.showSquareInfo(square);
  }

  private handleSquareClick = (event: MouseEvent): void => {
    const target = event.target as HTMLDivElement;

    if (target && target.matches(".graph__square")) {
      this.setSelectedSquare(target);
    }
  };

  private handleDocumentClick = (event: MouseEvent): void => {
    const target = event.target as HTMLElement;

    if (!target.matches(".graph__square") && GraphModel.selectedSquare) {
      this.hideSelectedSquareInfo();
    }
  };
}