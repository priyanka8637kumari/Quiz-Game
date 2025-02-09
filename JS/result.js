// Function to get query parameters
function getQueryParams() {
  const params = {};
  const queryString = window.location.search.substring(1);
  const queryArray = queryString.split("&");
  queryArray.forEach((param) => {
    const [key, value] = param.split("=");
    params[key] = decodeURIComponent(value);
  });
  return params;
}

const params = getQueryParams();
// Default to 0 if score is not found
const finalScore = params.score || 0;
document.getElementById("finalScore").innerText = finalScore;
