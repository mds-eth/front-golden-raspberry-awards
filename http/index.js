const BASE_URL = 'https://tools.texoit.com/backend-java/api/movies'

export async function fetchListMovies(query) {
  return await fetch(`${BASE_URL}?${query}`);
}
export async function fetchYearsWithMultipleWinners() {
  return await fetch(`${BASE_URL}?projection=years-with-multiple-winners`);
}
export async function fetchStudiosWithWinCount() {
  return await fetch(`${BASE_URL}?projection=studios-with-win-count`);
}
export async function fetchMinMaxInterval() {
  return await fetch(`${BASE_URL}?projection=max-min-win-interval-for-producers`);
}
export async function fetchAwardsByYear(year) {
  return await fetch(`${BASE_URL}?winner=true&year=${year}`);
}
