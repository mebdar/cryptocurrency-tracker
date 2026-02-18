// src/services/api.js
export const getCoins = async () => {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1"
    );
    const data = await response.json();
    return data; // must return data
  } catch (error) {
    console.error("Error fetching coins:", error);
    return []; // return empty array if API fails
  }
};
