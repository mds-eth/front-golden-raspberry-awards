let currentWinner = undefined;
let currentYear = undefined;

let currentPage = 1;
let totalPages = 1;

async function listAllFilms(page = 1) {
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

    const response = await fetch(`http://localhost:3030/api/v1/awards-list?${params.toString()}`);

    const data = await response.json();

    const tableBody = document.querySelector('.table-list tbody');

    tableBody.innerHTML = '';

    const totalElements = data.totalElements;

    if (data.content.length === 0) {
      const row = document.createElement('tr');
      row.innerHTML = `<td colspan="4">Nenhum registro encontrado.</td>`;

      currentPage = 1;

      totalPages = Math.ceil(1 / 10);

      updatePagination();
      updateTextTotalRecords(data.content.length === 0 ? 0 : totalElements);

      return tableBody.appendChild(row);
    }
    data.content.forEach(film => {
      const row = document.createElement('tr');
      row.innerHTML = `
          <td>${film._id}</td>
          <td>${film.year}</td>
          <td>${film.title}</td>
          <td>${film.winner ? 'Yes' : 'No'}</td>
        `;
      tableBody.appendChild(row);
    });

    currentPage = page;

    totalPages = Math.ceil(totalElements / 10);

    updatePagination();
    updateTextTotalRecords(data.content.length === 0 ? 0 : totalElements);
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
  }
}

function updateTextTotalRecords(totalElements) {
  const totalRecordsElement = document.getElementById('total-records-value');
  totalRecordsElement.textContent = totalElements;
}

function updatePagination() {
  const pageNumbersList = document.getElementById('page-numbers');
  pageNumbersList.innerHTML = '';

  for (let i = 1; i <= totalPages; i++) {
    const pageNumberItem = document.createElement('li');
    pageNumberItem.textContent = i;
    pageNumberItem.addEventListener('click', () => {
      // Remova a classe 'active' de todos os itens de paginação
      const allPageNumberItems = document.querySelectorAll('#page-numbers li');
      allPageNumberItems.forEach(item => {
        item.classList.remove('active-click');
      });

      // Adicione a classe 'active-click' ao item clicado
      pageNumberItem.classList.add('active-click');

      // Chame a função listAllFilms com o número da página como argumento
      listAllFilms(i);
    });
    pageNumbersList.appendChild(pageNumberItem);
  }
}

function addWinnerChangeListener() {
  const selectWinner = document.getElementById('select-winner');
  selectWinner.addEventListener('change', async function () {
    currentWinner = this.value === '' ? undefined : this.value;
    await listAllFilms(currentPage);
  });
}

function addYearChangeListener() {
  const inputYear = document.getElementById('input-year');
  inputYear.addEventListener('input', async function () {
    currentYear = this.value === `` ? undefined : this.value;
    await listAllFilms(currentPage);
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

window.onload = function () {
  listAllFilms();
  addWinnerChangeListener();
  addYearChangeListener();
  configureInputNumber();
};
