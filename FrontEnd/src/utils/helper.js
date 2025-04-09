import dayjs from 'dayjs';
import 'dayjs/locale/tr';

export const IMG_BASE_URL = import.meta.env.VITE_IMAGE_URL;

dayjs.locale('tr');


export function prepareUrl(url) {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return 'http://' + url;
  } return url;
}

export function formatNumber(number, decimals = 2) {

  const fixedNumber = number.toFixed(decimals);

  return fixedNumber.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function newDateFormat(dateString) {
  let dateComponents = dateString.split('/');
  let day = parseInt(dateComponents[0], 10);
  let month = parseInt(dateComponents[1], 10) - 1;
  let year = parseInt(dateComponents[2], 10);

  let convertedDate = new Date(Date.UTC(year, month, day));
  return convertedDate.toISOString();
}

export function newTimeFormat(timeString) {
  let dummyDate = new Date();
  let timeComponents = timeString.split(':');
  let hours = parseInt(timeComponents[0], 10);
  let minutes = parseInt(timeComponents[1].split(' ')[0], 10);

  dummyDate.setHours(hours);
  dummyDate.setMinutes(minutes);

  return dummyDate.toTimeString().split(' ')[0];
}

export function splitTimeFormat(timeString) {
  let timeParts = timeString.split(':');
  return timeParts.slice(0, 2).join(':');
}

export function formatDate(dateString) {
  if (!dateString) return '';
  const date = dayjs(dateString);
  return date.format('DD/MM/YYYY HH:mm');
}
export function formatDateWithoutTime(dateString) {
  if (!dateString) return '';
  const date = dayjs(dateString);
  return date.format('DD/MM/YYYY');
}
export function formatDateInput(dateString) {
  const date = dayjs(dateString);
  return date.format('YYYY-MM-DD');
}

export function formatMinutes(_minutes) {
  var hours = Math.floor(_minutes / 60);
  var minutes = _minutes % 60;

  return `${hours} saat ${minutes} dk`;
}

export function formatPhone(value) {
  return value
    .replace(/[^0-9]/g, '')
    .replace(/(\d{3})(\d{3})(\d{2})(\d{2})/, '$1-$2-$3-$4');
}

//ilk değişken string,ikinci değişken kısaltılacak karakter sınırı değer verilmezse default olarak 20 karakter.
export function shortName(desc, size = 20) {
  return desc?.length > size ? desc?.substr(0, size) + ' ...' : desc;
}

export function emailValid(email) {
  const emailRegex = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/;
  return emailRegex.test(email);
}

export function passValid(pass) {
  const passRegex =
    /^((?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])|(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[^a-zA-Z0-9])|(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[^a-zA-Z0-9])|(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^a-zA-Z0-9])).{6,}$/;
  return passRegex.test(pass);
}

export function urlify(text) {
  var urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, function (url) {
    return '<a href="' + url + '">' + url + '</a>';
  });
}


export const getDaysString = (days) => {
  let str = '';
  if (days.length < 1) return str;

  days.forEach(({ value }, idx) => {
    str += `${value},`;
  });

  return str.slice(0, str.length - 1);
};

export const statuses = [
  { label: 'Publish', value: '1' },
  { label: 'Unpublish', value: '2' },
];

export const getPublishStatus = (value) => {
  if (!value) return '';

  return statuses.find((item) => item.value === value)?.label || value;
};


export const getGenderById = (id) => {
  if (!id) return null;

  return genders.find((item) => Number(item.value) === id);
};
export const NumberSeparator = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};


export const getCourseDetailById = (params) => {
  const { id, data } = params;
  if (!id) return null;

  return data?.find((item) => item?.course_id === id);
};

export const trimDays = (daysString) => {
  if (!daysString) return '';
  const daysArray = daysString
    .split(',')
    .map((day) => day.trim().substring(0, 3));
  const trimmedDaysString = daysArray.join(',');
  return trimmedDaysString;
};



export const convertCommaSeperatedStringToArray = (value) => value.split(',');

export const calculateAge = (dateString) => {
  if (!dateString || dateString === '') return '';

  var today = new Date();
  var birthDate = new Date(dateString);
  var age = today.getFullYear() - birthDate.getFullYear();
  var monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
};

export const getMinutes = (date1, date2) => {
  const parsedDate1 = new Date(date1);
  const parsedDate2 = new Date(date2);

  // Calculate the difference in milliseconds
  const differenceInMilliseconds = Math.abs(parsedDate2 - parsedDate1);

  // Convert milliseconds to minutes
  const minutes = Math.floor(differenceInMilliseconds / (1000 * 60));

  return minutes;
};

export const minuteOffset = (dateString) => {
  if (!dateString || dateString === '') return '';

  return dayjs(dateString).format('m');
};


export const getFileNameWithFolder = (path) => {
  if (!path) return '';

  const arr = path.split('/');
  const folderName = arr[arr.length - 2];
  const fileName = arr[arr.length - 1];

  return `${folderName}/${fileName}`;
};

export const getUpdatedCourseList = (data) => {
  let map = {};

  data.forEach((item) => {
    if (!map['facility_id']) {
      map[`${item.facility_id}`] = item.facility_name;
    }
  });

  return Object.entries(map).map((item) => ({
    id: Number(item[0]),
    name: item[1],
  }));
};

export const formatCurrency = (value) => {
  value = Math.round(value * 100) / 100;

  const formatter = new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return formatter.format(value);
};

// export const adjustDates = (startDateString, endDateString) => {
//     const startDate = new Date(startDateString);
//     const endDate = new Date(endDateString);

//     const startDayOfWeek = startDate.getDay();

//     // Calculate the next occurrence of the same day of the week after the original end date
//     let nextOccurrenceDate = new Date(endDate);
//     const daysToAdd = (startDayOfWeek - endDate.getDay() + 8) % 7;
//     nextOccurrenceDate.setDate(endDate.getDate() + daysToAdd);

//     // Calculate the difference in days between the first new start date and the original end date
//     const dayDifference = nextOccurrenceDate.getDate() - startDate.getDate();

//     // Calculate the new end date based on the total duration between the start and end dates
//     const durationInMilliseconds = endDate - startDate;
//     const newEndDate = new Date(nextOccurrenceDate);
//     newEndDate.setDate(nextOccurrenceDate.getDate() + durationInMilliseconds / (24 * 60 * 60 * 1000));
// };