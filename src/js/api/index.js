import axios from "axios";
import { parseISO, format, addDays } from 'date-fns';

export async function fetchContributionData() {
  const data = await fetchData();

  // Получаем отсортированный массив дат
  const sortedKeys = Object.keys(data)
    .sort((a, b) => parseISO(a) - parseISO(b));

  // Определение минимальной и максимальной дат
  const minDate = parseISO(sortedKeys[0]);
  const maxDate = parseISO(sortedKeys[sortedKeys.length - 1]);

  // Создание массива всех дат между minDate и maxDate включительно
  const allDates = [];
  let currentDate = minDate;

  while (currentDate <= maxDate) {
    allDates.push(currentDate);
    currentDate = addDays(currentDate, 1);
  }

  // Создание нового объекта с утерянными датами и значениями
  const reconstructedData = {};
  allDates.forEach(date => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    reconstructedData[formattedDate] = data[formattedDate] || 0;
  });

  return reconstructedData; 
}

async function fetchData() {
  const response = await axios.get("https://dpg.gg/test/calendar.json")
  return await response.data
}