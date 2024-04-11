import { fetchMinMaxInterval, fetchStudiosWithWinCount, fetchYearsWithMultipleWinners, fetchAwardsByYear } from "../http";

async function getDataDashboard() {

  try {

    const [yearsWithMultipleWinners, studiosWithWinCount, minMaxInterval] = await Promise.all([
      fetchYearsWithMultipleWinners(),
      fetchStudiosWithWinCount(),
      fetchMinMaxInterval()
    ]);

    await createTableMultiplesWinners(await yearsWithMultipleWinners.json());
    await createTableTopStudios(await studiosWithWinCount.json());
    await createTableMinMaxInterval(await minMaxInterval.json());
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
  }
}

async function createTableMultiplesWinners(response) {

  const { years } = response;

  const tableBody = document.querySelector('.year-win-table-body');

  tableBody.innerHTML = '';

  years.forEach(winner => {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${winner.year}</td>
        <td>${winner.winnerCount}</td>
        `;
    tableBody.appendChild(row);
  });
}

async function createTableTopStudios(response) {

  const { studios } = response;

  const tableBody = document.querySelector('.studio-win-table-body');

  tableBody.innerHTML = '';

  studios.slice(0, 3).forEach(winner => {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${winner.name}</td>
        <td>${winner.winCount}</td>
        `;
    tableBody.appendChild(row);
  });
}

async function createTableMinMaxInterval(response) {
  const { min, max } = response;

  Promise.all([
    await createTableBody(max, document.querySelector('.maximum-interval-table-body')),
    await createTableBody(min, document.querySelector('.minimum-interval-table-body'))
  ]);
}

async function createTableBody(intervalData, tableBodyElement) {
  tableBodyElement.innerHTML = '';

  intervalData.forEach(winner => {
    const row = document.createElement('tr');
    row.innerHTML = `
            <td>${winner.producer}</td>
            <td>${winner.interval}</td>
            <td>${winner.previousWin}</td>
            <td>${winner.followingWin}</td>
            `;
    tableBodyElement.appendChild(row);
  });
}

function configureInputNumber() {
  const numberInputs = document.querySelectorAll('input[type="number"]');

  numberInputs.forEach(input => {
    input.addEventListener('input', function (event) {
      if (this.value < 0) {
        this.value = 0;
      }
    });
  });
}

function eventListenerInput() {
  const inputYear = document.querySelector('.input-year');
  inputYear.addEventListener('input', function (event) {
    const year = event.target.value;

    if (year === '') {
      const tableBody = document.querySelector('.list-movie-by-year');

      return tableBody.innerHTML = '';
    }

    if (year.length >= 4 && year.length <= 5) {
      fetchData(year);
    }
  });
}

async function fetchData(year) {

  try {
    const response = await fetchAwardsByYear(year);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const movies = await response.json();

    const tableBody = document.querySelector('.list-movie-by-year');

    tableBody.innerHTML = '';

    movies.forEach(winner => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${winner.id}</td>
        <td>${winner.year}</td>
        <td>${winner.title}</td>
        `;
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
  }
}

window.onload = function () {
  getDataDashboard();
  configureInputNumber();
  eventListenerInput();
};
