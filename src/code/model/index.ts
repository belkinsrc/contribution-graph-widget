import { fetchContributionData } from "../api";
import { format } from "date-fns";

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

    squares.forEach(square => {
      const contribution = Number(square.dataset.contribution);

      if (contribution === 0) {
        square.style.backgroundColor = styles.getPropertyValue("--level0");
      } else if (contribution >= 1 && contribution < 5) {
        square.style.backgroundColor = styles.getPropertyValue("--level1");
      } else if (contribution >= 5 && contribution < 10) {
        square.style.backgroundColor = styles.getPropertyValue("--level2");
      } else if (contribution >= 10 && contribution < 15) {
        square.style.backgroundColor = styles.getPropertyValue("--level3");
      } else if (contribution >= 15) {
        square.style.backgroundColor = styles.getPropertyValue("--level4");
      } else {
        square.style.backgroundColor = styles.getPropertyValue("--level0");
      }
    })
  }

  private selectSquare(): void {
    document.addEventListener("click", event => {
      const target = event.target as HTMLElement;
  
      if (!target.matches(".graph__square")) {
        this.hideSelectedSquareInfo();
      }
    });

    const activity: HTMLDivElement = document.querySelector(".graph__activity")!;
    
    activity.addEventListener("click", event => {
      const target = event.target as HTMLDivElement;

      if (target && target.matches(".graph__square")) {

        if (target.classList.contains("graph__square--selected")) {
          return;
        }

        if (GraphModel.selectedSquare) {
          GraphModel.selectedSquare.classList.remove("graph__square--selected");
          GraphModel.selectedSquare.innerHTML = "";
        }
        target.classList.add("graph__square--selected");
        GraphModel.selectedSquare = target;
        this.showSquareInfo(target);
      }
    });
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
    if (GraphModel.selectedSquare) {
      GraphModel.selectedSquare.classList.remove("graph__square--selected");
      GraphModel.selectedSquare.innerHTML = "";
      GraphModel.selectedSquare = null;
    }
  }
}