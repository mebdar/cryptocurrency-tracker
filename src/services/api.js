const CACHE_KEY = "coingecko_coins_cache";
const CACHE_EXPIRY = 2 * 60 * 1000; // 2 minutes in milliseconds

export const getCoins = async () => {
  try {
    // 1. Check if we have cached data
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      // 2. If data is less than 2 minutes old, return it directly
      if (Date.now() - timestamp < CACHE_EXPIRY) {
        console.log("Serving coins from cache...");
        return data;
      }
    }

    // 3. Fallback to API if no cache or cache expired
    console.log("Fetching fresh coins from API...");
    const response = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1"
    );
    const data = await response.json();

    // 4. Update the cache
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      data,
      timestamp: Date.now()
    }));

    return data;
  } catch (error) {
    console.error("Error fetching coins:", error);
    // 5. If API fails, try to return expired cache as absolute last resort
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      return JSON.parse(cached).data;
    }
    return [];
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
