import { format, parseISO, addDays } from "date-fns";

export function sortDataByDate(data: ContributionData): ContributionData {
  const sortedKeys = Object.keys(data)
    .sort((a, b) => parseISO(a).getTime() - parseISO(b).getTime());

  const sortedData: Partial<ContributionData> = {};
  sortedKeys.forEach(key => {
    sortedData[key as keyof ContributionData] = data[key as keyof ContributionData];
  });
  
  return sortedData as ContributionData;
}

export function reconstructData(originalData: ContributionData): ContributionData {
  const dateKeys = Object.keys(originalData);
  const minDate = parseISO(dateKeys[0]);
  const maxDate = parseISO(dateKeys[dateKeys.length - 1]);

  const allDates = generateAllDates(minDate, maxDate);

  const reconstructedData: Partial<ContributionData> = {};
  allDates.forEach(date => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    reconstructedData[formattedDate as keyof ContributionData] = 
      originalData[formattedDate as keyof ContributionData] || 0;
  });

  return reconstructedData as ContributionData;
}

export function generateAllDates(minDate: Date, maxDate: Date): Date[] {
  const allDates: Date[] = [];
  let currentDate = minDate;
  while (currentDate <= maxDate) {
    allDates.push(currentDate);
    currentDate = addDays(currentDate, 1);
  }
  
  return allDates;
}