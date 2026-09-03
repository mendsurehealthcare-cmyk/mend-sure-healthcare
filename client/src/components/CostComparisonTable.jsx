import { formatUSD, savingsPercent } from '../lib/format';

export default function CostComparisonTable({ treatment }) {
  const savings = savingsPercent(treatment.price_min_usd, treatment.avg_price_usa_usd);

  return (
    <div className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-body-md">
          <thead className="bg-surface-container-low text-label-sm tracking-wide text-on-surface-variant uppercase">
            <tr>
              <th className="px-space-lg py-space-sm">Where</th>
              <th className="px-space-lg py-space-sm">Typical Cost</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/20">
            <tr>
              <td className="px-space-lg py-space-md font-medium text-on-surface">
                With Mend Sure (India)
              </td>
              <td className="px-space-lg py-space-md font-semibold text-on-tertiary-fixed-variant">
                {formatUSD(treatment.price_min_usd)} – {formatUSD(treatment.price_max_usd)}
              </td>
            </tr>
            <tr>
              <td className="px-space-lg py-space-md font-medium text-on-surface">
                Average in the USA
              </td>
              <td className="px-space-lg py-space-md text-on-surface-variant line-through decoration-outline">
                {formatUSD(treatment.avg_price_usa_usd)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {savings && (
        <div className="bg-tertiary-fixed px-space-lg py-space-sm text-label-md font-semibold text-on-tertiary-fixed">
          You could save up to {savings}% by treating in India
        </div>
      )}
    </div>
  );
}
