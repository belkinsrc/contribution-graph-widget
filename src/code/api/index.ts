import axios from "axios";
import { parseISO, format, addDays } from "date-fns";

export async function fetchContributionData(): Promise<ContributionData> {
  const data: ContributionData = await fetchData("https://dpg.gg/test/calendar.json");

  // Получаем отсортированный массив дат
  const sortedKeys = Object.keys(data)
    .sort((a, b) => parseISO(a).getTime() - parseISO(b).getTime());

  // Определение минимальной и максимальной дат
  const minDate = parseISO(sortedKeys[0]);
  const maxDate = parseISO(sortedKeys[sortedKeys.length - 1]);

  // Создание массива всех дат между minDate и maxDate включительно
  const allDates: Date[] = [];

  let currentDate = minDate;
  while (currentDate <= maxDate) {
    allDates.push(currentDate);
    currentDate = addDays(currentDate, 1);
  }

  // Создание нового объекта с утерянными датами и значениями
  const reconstructedData: Partial<ContributionData> = {};
  allDates.forEach(date => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    reconstructedData[formattedDate as keyof ContributionData] =
      data[formattedDate as keyof ContributionData] || 0;
  });

  return reconstructedData as ContributionData; 
}

async function fetchData(url: string): Promise<ContributionData> {
  return (await axios.get<ContributionData>(url)).data;
}