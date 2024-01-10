import { fetchContributionData } from "../api";
import { format } from "date-fns";

export class GraphModel {

  static selectedSquare;

  run() {
    const squares = document.querySelectorAll(".graph__square");

    fetchContributionData()
      .then(data => {
        this.#setDataAttributes(squares, data);
        this.#setActivityLevel(squares);
        this.#selectSquare();
      })
  }

  #setDataAttributes(squares, data) {
    squares.forEach((square, i) => {
      const currentDateKey = Object.keys(data)[i];
      const currentValueOfKey = data[currentDateKey];
      square.dataset.date = currentDateKey;
      square.dataset.contribution = currentValueOfKey;
    })
  }

  #setActivityLevel(squares) {
    const styles = getComputedStyle(document.documentElement);

    squares.forEach(square => {
      const contribution = square.dataset.contribution;
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

    // const styles = getComputedStyle(document.documentElement);

    // const contributionColors = {
    //     0: "--level0",
    //     1: "--level1",
    //     5: "--level2",
    //     10: "--level3",
    //     15: "--level4"
    // };

    // squares.forEach(square => {
    //     const contribution = parseInt(square.dataset.contribution) || 0;

    //     let level = Object.keys(contributionColors).find(key => contribution >= key) || "--level0";
    //     square.style.backgroundColor = styles.getPropertyValue(contributionColors[level]);
    // });
  }

  #selectSquare() {
    const activity = document.querySelector(".graph__activity");

    activity.addEventListener("click", (event) => {
      const target = event.target;

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
        this.#createSquareInfo(target);
      }
    });
  }

  #createSquareInfo(parentNode) {
    const contributionCount = `${parentNode.dataset.contribution} contributions`;
    const currentDate = format(parentNode.dataset.date, 'EEEE, MMMM dd, Y');

    parentNode.innerHTML = `
      <div class="info">
        <p class="info__text">${contributionCount}</p>
        <p class="info__date">${currentDate}</p>
      </div>
    `;
  }
}