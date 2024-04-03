async function getDataDashboard() {

  try {

    const [yearsWithMultipleWinners, studiosWithWinCount, minMaxInterval] = await Promise.all([
      fetch('http://localhost:3030/api/v1/awards-projection?projection=years-with-multiple-winners'),
      fetch('http://localhost:3030/api/v1/awards-projection?projection=studios-with-win-count'),
      fetch('http://localhost:3030/api/v1/awards-projection?projection=max-min-win-interval-for-producers')
    ]);

    await createTableMultiplesWinners(await yearsWithMultipleWinners.json());
    await createTableTopStudios(await studiosWithWinCount.json());
    await createTableMinMaxInterval(await minMaxInterval.json());
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
  }
}

async function createTableMultiplesWinners(winners) {
  const tableBody = document.querySelector('.year-win-table-body');

  tableBody.innerHTML = '';

  winners.forEach((winner, index) => {

    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${winner.year}</td>
        <td>${winner.winnerCount}</td>
        `;
    tableBody.appendChild(row);
  });
}

async function createTableTopStudios(topStudios) {
  const tableBody = document.querySelector('.studio-win-table-body');

  tableBody.innerHTML = '';

  topStudios.forEach(winner => {

    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${winner.studio}</td>
        <td>${winner.winCount}</td>
        `;
    tableBody.appendChild(row);
  });
}

async function createTableMinMaxInterval(minMaxInterval) {
  const { min, max } = minMaxInterval;

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
    const response = await fetch(`http://localhost:3030/api/v1/awards-by-year?year=${year}`);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const movies = await response.json();

    const tableBody = document.querySelector('.list-movie-by-year');

    tableBody.innerHTML = '';

    movies.forEach(winner => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${winner._id}</td>
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
