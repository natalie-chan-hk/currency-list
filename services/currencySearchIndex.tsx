import { CurrencyInfo } from "../types/currency";

type InvertedIndex = {
  [token: string]: string[]; // Maps tokens or prefixes to coin IDs
};

class CurrencySearchIndex {
  private coins: CurrencyInfo[];
  private index: InvertedIndex;

  constructor(coins: CurrencyInfo[]) {
    this.coins = coins;
    this.index = this.buildIndex(coins);
  }

  // Build the inverted index from the coin data
  private buildIndex(coins: CurrencyInfo[]): InvertedIndex {
    const index: InvertedIndex = {};

    coins.forEach((coin) => {
      const lowerName = coin.name.toLowerCase();
      const lowerSymbol = coin.symbol.toLowerCase();
      const tokens = lowerName.split(" ");

      // Add full name and symbol as tokens
      this.addToIndex(lowerName, coin.id, index);
      this.addToIndex(lowerSymbol, coin.id, index);

      // Add individual tokens from the name
      tokens.forEach((token: string) => {
        this.addToIndex(token, coin.id, index);
      });
    });

    return index;
  }

  // Add a token and its prefixes to the index
  private addToIndex(token: string, coinId: string, index: InvertedIndex) {
    for (let i = 1; i <= token.length; i++) {
      const prefix = token.slice(0, i);
      if (!index[prefix]) {
        index[prefix] = [];
      }
      if (!index[prefix].includes(coinId)) {
        index[prefix].push(coinId);
      }
    }
  }

  // Search for coins matching the query
  public search(query: string): CurrencyInfo[] {
    if (!query.trim()) return this.coins;

    const lowerQuery = query.toLowerCase();
    const matchingCoinIds = this.index[lowerQuery] || [];

    return matchingCoinIds.map(
      (id) => this.coins.find((coin) => coin.id === id)!,
    );
  }
}

export default CurrencySearchIndex;
