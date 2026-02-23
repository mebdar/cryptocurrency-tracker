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
export const getCoinHistory = async (id = "bitcoin") => {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=7&interval=daily`
    );
    const data = await response.json();
    return data.prices.map((price) => ({
      name: new Date(price[0]).toLocaleDateString("en-US", { weekday: "short" }),
      volume: price[1], // Using price as 'volume' for the bar chart demonstration
    }));
  } catch (error) {
    console.error("Error fetching coin history:", error);
    return [];
  }
};
export const getCoinOHLC = async (id = "bitcoin") => {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${id}/ohlc?vs_currency=usd&days=7`
    );
    const data = await response.json();
    // CoinGecko OHLC format: [time, open, high, low, close]
    return data.map((item) => ({
      x: new Date(item[0]),
      y: [item[1], item[2], item[3], item[4]],
    }));
  } catch (error) {
    console.error("Error fetching coin OHLC:", error);
    return [];
  }
};
