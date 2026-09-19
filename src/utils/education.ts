import type { InsiderTrade } from '../types/trade';

/**
 * The exact disclaimer required by the brief. Rendered verbatim on the details
 * screen and kept in one place so it cannot drift.
 */
export const REQUIRED_DISCLAIMER =
  'This prototype uses mock data for demonstration only. Insider-trading filings ' +
  'are public disclosures and do not constitute investment advice. Past activity ' +
  'does not guarantee future stock performance.';

/**
 * Plain-language context for one demo transaction.
 *
 * Deliberately descriptive: it explains what the disclosure *is* and states its
 * limits. It never suggests an action, a direction or an outcome.
 */
export function explainTrade(trade: InsiderTrade): string {
  const who = `${trade.insider.split(' ')[0]} is listed as ${
    trade.role === 'Officer' ? 'an officer' : `the ${trade.role}`
  } of ${trade.company}`;

  if (trade.type === 'purchase') {
    return (
      `${who}, so this demo filing records someone close to the company adding to ` +
      'a position with their own money. A purchase like this is one data point for ' +
      'further research because it is a disclosed, dated transaction. It does not ' +
      "reveal the person's full financial situation, their reasons, or anything " +
      'about future performance.'
    );
  }

  return (
    `${who}, so this demo filing records a disclosed reduction in their holding. ` +
    'Sales happen for many ordinary reasons — taxes, diversification, scheduled ' +
    'plans, personal expenses — so a sale on its own says little about the ' +
    'company. Treat it as a fact to research, not a conclusion.'
  );
}
