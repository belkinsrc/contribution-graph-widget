import axios from "axios";

import { reconstructData, sortDataByDate } from "./config"; 

export async function fetchContributionData(): Promise<ContributionData> {
  const originalData: ContributionData = await fetchDataAndSort("https://dpg.gg/test/calendar.json");

  return reconstructData(originalData);
}

async function fetchDataAndSort(url: string): Promise<ContributionData> {
  const data: ContributionData = await fetchData(url);
  return sortDataByDate(data);
}

async function fetchData(url: string): Promise<ContributionData> {
  return (await axios.get<ContributionData>(url)).data;
}