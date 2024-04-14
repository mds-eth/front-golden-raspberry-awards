import { fetchListMovies } from "../http";

let currentWinner = undefined;
let currentYear = undefined;

let currentPage = 0;
let totalPages = 1;

async function listAllFilms(page = 0) {
  try {

    const params = new URLSearchParams();

    params.append('page', page);
    params.append('size', '10');

    if (currentWinner) {
      params.append('winner', currentWinner);
    }

    if (currentYear) {
      params.append('year', currentYear);
    }

    const response = await fetchListMovies(params.toString());

    const data = await response.json();

    const tableBody = document.querySelector('.table-list tbody');

    tableBody.innerHTML = '';

    const totalElements = data.totalElements;

    if (data.content.length === 0) {
      const row = document.createElement('tr');
      row.innerHTML = `<td colspan="4">Nenhum registro encontrado.</td>`;

      currentPage = 0;

      totalPages = data.totalPages;

      updatePagination();
      updateTextTotalRecords(data.content.length === 0 ? 0 : totalElements);

      return tableBody.appendChild(row);
    }
    data.content.forEach(film => {
      const row = document.createElement('tr');
      row.innerHTML = `
          <td>${film.id}</td>
          <td>${film.year}</td>
          <td>${film.title}</td>
          <td>${film.winner ? 'Yes' : 'No'}</td>
        `;
      tableBody.appendChild(row);
    });

    currentPage = page;

    totalPages = Math.ceil(totalElements / 10);

    if (totalElements > 10) {
      updatePagination();
    }

    updateTextTotalRecords(data.content.length === 0 ? 0 : totalElements);
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
  }
}

function updateTextTotalRecords(totalElements) {
  const totalRecordsElement = document.getElementById('total-records-value');
  if (totalRecordsElement) {
    totalRecordsElement.textContent = totalElements;
  }
}

function updatePagination() {
  const pageNumbersList = document.getElementById('page-numbers');

  if (pageNumbersList) {
    pageNumbersList.innerHTML = '';

    for (let i = 0; i <= totalPages; i++) {
      const pageNumberItem = document.createElement('li');
      pageNumberItem.textContent = i + 1;
      pageNumberItem.addEventListener('click', () => {
        const allPageNumberItems = document.querySelectorAll('#page-numbers li');
        allPageNumberItems.forEach(item => {
          item.classList.remove('active-click');
        });

        pageNumberItem.classList.add('active-click');

        listAllFilms(i);
      });
      pageNumbersList.appendChild(pageNumberItem);
    }
  }
}

function addWinnerChangeListener() {
  const selectWinner = document.getElementById('select-winner');

  if (selectWinner) {
    selectWinner.addEventListener('change', async function () {
      currentWinner = this.value === '' ? undefined : this.value;
      await listAllFilms(currentPage);
    });
  }
}

function addYearChangeListener() {
  const inputYear = document.getElementById('input-year');
  if (inputYear) {
    inputYear.addEventListener('input', async function () {
      currentYear = this.value === `` ? undefined : this.value;
      await listAllFilms(currentPage);
    });
  }
}

function configureInputNumber() {
  const numberInputs = document.querySelectorAll('input[type="number"]');

  if (numberInputs) {
    numberInputs.forEach(input => {
      input.addEventListener('input', function (event) {
        if (this.value < 0) {
          this.value = 0;
        }
      });
    });
  }
}

window.onload = function () {
  listAllFilms();
  addWinnerChangeListener();
  addYearChangeListener();
  configureInputNumber();
};
