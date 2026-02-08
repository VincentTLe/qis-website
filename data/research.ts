export interface ResearchPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  tags: string[];
  featured: boolean;
}

export const researchPosts: ResearchPost[] = [
  {
    slug: "cointegration-pairs-trading",
    title: "Cointegration-Based Pairs Trading: A Practical Guide",
    excerpt:
      "An end-to-end walkthrough of building a pairs trading strategy using cointegration tests, dynamic hedge ratios, and walk-forward validation.",
    content: `Pairs trading is one of the most well-known market-neutral strategies in quantitative finance. The core idea is simple: find two assets whose prices move together over time, and trade the spread when it diverges from its historical mean.

## Why Cointegration Matters

Many beginners confuse correlation with cointegration. Two assets can be highly correlated but not cointegrated. Correlation measures the degree to which two price series move in the same direction. Cointegration measures whether a linear combination of two non-stationary series is stationary.

For pairs trading, we need cointegration — a stable, mean-reverting spread.

## The Pipeline

Our pipeline consists of four stages:

1. **Universe Selection**: Screen for pairs with high correlation as a first filter, then test for cointegration using the Engle-Granger two-step method.

2. **Hedge Ratio Estimation**: Use a rolling OLS regression or Kalman filter to estimate the dynamic hedge ratio between the two assets.

3. **Signal Generation**: Compute the z-score of the spread. Enter long when z < -2, short when z > 2. Exit at z = 0.

4. **Backtesting**: Walk-forward validation with out-of-sample testing windows. We use a 252-day training window and 63-day test window.

## Results

Our backtested pipeline achieved an 18% annualized return with a Sharpe ratio of 1.4 over the 2020-2024 period. Maximum drawdown was 8.2%.

## Key Takeaways

- Always use cointegration tests, not just correlation
- Dynamic hedge ratios outperform static ones
- Walk-forward validation prevents overfitting
- Transaction costs matter — factor them into your backtest`,
    author: "QIS Research Team",
    date: "2026-02-01",
    readTime: "8 min read",
    tags: ["pairs-trading", "cointegration", "backtesting"],
    featured: true,
  },
  {
    slug: "monte-carlo-portfolio-risk",
    title: "Monte Carlo Methods for Portfolio Risk Assessment",
    excerpt:
      "How to use Monte Carlo simulation to estimate Value at Risk, stress test portfolios, and quantify uncertainty in return distributions.",
    content: `Monte Carlo simulation is a cornerstone technique in quantitative risk management. By generating thousands of possible future scenarios, we can estimate the probability distribution of portfolio returns and quantify risk metrics like Value at Risk (VaR).

## The Basic Approach

1. Model each asset's returns using a statistical distribution (e.g., Geometric Brownian Motion)
2. Generate correlated random samples using Cholesky decomposition
3. Simulate portfolio value across thousands of scenarios
4. Compute risk metrics from the simulated distribution

## Value at Risk (VaR)

VaR answers the question: "What is the maximum loss I can expect with X% confidence over Y days?"

For a 95% VaR with a 1-day horizon, we sort our simulated returns and find the 5th percentile. If our simulation shows that 95% of the time our portfolio loses less than $50,000, then our 1-day 95% VaR is $50,000.

## Conditional VaR (CVaR)

CVaR, also known as Expected Shortfall, answers: "Given that we've exceeded our VaR threshold, what's the expected loss?" This is computed as the average of all losses beyond the VaR threshold.

## Implementation Notes

We implemented our Monte Carlo engine in Python using NumPy for vectorized simulation. A 10,000-path simulation for a 50-asset portfolio runs in under 2 seconds on a standard laptop.

Key considerations:
- Use enough simulation paths (10,000+ for stable estimates)
- Model fat tails with Student-t distributions instead of normal
- Incorporate correlation structure via Cholesky decomposition
- Validate against analytical solutions where available`,
    author: "QIS Research Team",
    date: "2026-01-20",
    readTime: "6 min read",
    tags: ["monte-carlo", "risk-management", "VaR"],
    featured: false,
  },
  {
    slug: "market-making-primer",
    title: "Market Making Under Uncertainty: A Primer",
    excerpt:
      "An introduction to market making strategies, order book dynamics, and the economics of providing liquidity in competitive markets.",
    content: `Market making is the business of providing liquidity to financial markets. A market maker continuously quotes both bid and ask prices, earning the spread as compensation for bearing inventory risk.

## The Economics

The spread compensates market makers for three types of risk:
1. **Inventory risk**: The risk that prices move against your accumulated position
2. **Adverse selection**: The risk of trading with informed counterparties
3. **Operational risk**: Technology failures, latency, and execution errors

## The Avellaneda-Stoikov Model

One of the most influential academic models for optimal market making is the Avellaneda-Stoikov framework. It provides closed-form solutions for optimal bid/ask quotes as a function of:
- Current inventory
- Time horizon
- Risk aversion parameter
- Volatility of the underlying asset

## Key Insights

- Wider spreads compensate for higher volatility
- Inventory management is crucial — skew quotes to reduce position
- Speed matters in competitive markets
- The winner's curse is real: if you get filled, the price probably moved against you

## Competition Application

In IMC Prosperity, market making is one of the core strategies. Understanding order book dynamics and optimal quoting gives you a significant edge. Our team used a modified Avellaneda-Stoikov approach combined with momentum signals to place in the top 1%.`,
    author: "QIS Research Team",
    date: "2026-01-10",
    readTime: "7 min read",
    tags: ["market-making", "order-books", "IMC"],
    featured: false,
  },
  {
    slug: "statistical-arbitrage-crypto",
    title: "Statistical Arbitrage in Cryptocurrency Markets",
    excerpt:
      "Exploring mean-reversion and momentum strategies in crypto markets, where inefficiencies are more pronounced and data is freely available.",
    content: `Cryptocurrency markets present unique opportunities for quantitative strategies due to their 24/7 trading, high volatility, and relatively lower institutional participation compared to traditional markets.

## Why Crypto?

Several factors make crypto markets attractive for statistical arbitrage:
- **24/7 markets**: No market hours means continuous data and trading
- **Free data**: Most exchanges provide free historical and real-time data
- **Higher volatility**: More opportunities for mean-reversion strategies
- **Cross-exchange inefficiencies**: Price discrepancies between exchanges

## Strategies We Explored

### 1. Cross-Exchange Arbitrage
Simple price discrepancies between exchanges. While pure arbitrage is heavily competed, incorporating transfer times and fees reveals persistent small opportunities.

### 2. Pairs Trading on Correlated Tokens
DeFi tokens within the same ecosystem tend to be cointegrated. We found persistent mean-reversion in pairs like ETH/MATIC and various DeFi protocol tokens.

### 3. Funding Rate Arbitrage
Perpetual futures funding rates create predictable cash flows. Going long spot and short perps (or vice versa) when funding rates are extreme can generate consistent returns.

## Challenges

- Counterparty risk is real on crypto exchanges
- Slippage on smaller tokens can be significant
- Regulatory uncertainty adds tail risk
- Smart contract risk for DeFi strategies`,
    author: "QIS Research Team",
    date: "2025-12-15",
    readTime: "9 min read",
    tags: ["crypto", "statistical-arbitrage", "mean-reversion"],
    featured: false,
  },
  {
    slug: "backtesting-pitfalls",
    title: "Backtesting Pitfalls: How to Avoid Fooling Yourself",
    excerpt:
      "Common mistakes in strategy backtesting that lead to overfitting, and techniques like walk-forward analysis to build robust trading systems.",
    content: `Every quant has been fooled by a beautiful backtest that fails in live trading. This article covers the most common pitfalls and how to avoid them.

## The Seven Deadly Sins of Backtesting

### 1. Lookahead Bias
Using information that wouldn't have been available at the time of the trade. Common sources: using today's close to make today's trading decision, or using a full-sample parameter estimate.

### 2. Survivorship Bias
Only backtesting on assets that exist today, ignoring delisted stocks that may have been in your universe historically.

### 3. Overfitting
Adding too many parameters or rules until your strategy perfectly fits historical data but has no predictive power.

### 4. Ignoring Transaction Costs
A strategy that makes 10bps per trade sounds great until you realize execution costs are 8bps.

### 5. Cherry-Picking Time Periods
Showing only the period where your strategy worked while ignoring drawdown periods.

### 6. Data Snooping
Testing hundreds of hypotheses on the same dataset without correcting for multiple comparisons.

### 7. Unrealistic Assumptions
Assuming you can trade at the close price, that there's infinite liquidity, or that your orders don't move the market.

## The Solution: Walk-Forward Validation

Walk-forward analysis is the gold standard for strategy validation:
1. Train on a historical window (e.g., 252 days)
2. Test on the next out-of-sample window (e.g., 63 days)
3. Roll forward and repeat
4. Aggregate out-of-sample results

This simulates how the strategy would have actually been deployed.`,
    author: "QIS Research Team",
    date: "2025-12-01",
    readTime: "10 min read",
    tags: ["backtesting", "overfitting", "methodology"],
    featured: false,
  },
];

export function getResearchBySlug(slug: string): ResearchPost | undefined {
  return researchPosts.find((p) => p.slug === slug);
}

export function getRelatedPosts(currentSlug: string, limit = 3): ResearchPost[] {
  const current = getResearchBySlug(currentSlug);
  if (!current) return [];
  return researchPosts
    .filter((p) => p.slug !== currentSlug)
    .filter((p) => p.tags.some((t) => current.tags.includes(t)))
    .slice(0, limit);
}

export function getAllTags(): string[] {
  const tags = new Set<string>();
  researchPosts.forEach((p) => p.tags.forEach((t) => tags.add(t)));
  return Array.from(tags).sort();
}
