"use client";

import type { CSSProperties } from "react";

type PriceRangeProps = {
  idPrefix: string;
  max: number;
  /** Current bounds; `undefined` means "unbounded" on that side. */
  maxValue?: number;
  minValue?: number;
  onChange: (min: number | undefined, max: number | undefined, commit: boolean) => void;
};

/** Dual-thumb price slider plus numeric inputs, named like the live theme's facet form. */
export function PriceRange({ idPrefix, max, maxValue, minValue, onChange }: PriceRangeProps) {
  const low = minValue ?? 0;
  const high = maxValue ?? max;
  const percent = (value: number) => (max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0);
  const normalize = (value: number | undefined, fallback: number) => (value === undefined || value === fallback ? undefined : value);

  const fromNumber = (raw: string) => (raw.trim() === "" ? undefined : Math.max(0, Math.min(max, Number(raw))));

  return (
    <div className="nwg-col-price">
      <div
        className="nwg-col-price__track"
        style={{ "--range-min": `${percent(low)}%`, "--range-max": `${percent(high)}%` } as CSSProperties}
      >
        <input
          aria-label="From price"
          className="nwg-col-price__range"
          max={max}
          min={0}
          onChange={(event) => onChange(normalize(Math.min(Number(event.target.value), high), 0), maxValue, false)}
          onPointerUp={() => onChange(minValue, maxValue, true)}
          onKeyUp={() => onChange(minValue, maxValue, true)}
          step={1}
          type="range"
          value={low}
        />
        <input
          aria-label="To price"
          className="nwg-col-price__range"
          max={max}
          min={0}
          onChange={(event) => onChange(minValue, normalize(Math.max(Number(event.target.value), low), max), false)}
          onPointerUp={() => onChange(minValue, maxValue, true)}
          onKeyUp={() => onChange(minValue, maxValue, true)}
          step={1}
          type="range"
          value={high}
        />
      </div>
      <div className="nwg-col-price__inputs">
        <label className="nwg-col-price__field" htmlFor={`${idPrefix}-price-gte`}>
          <span>$</span>
          <input
            aria-label="From price"
            id={`${idPrefix}-price-gte`}
            inputMode="numeric"
            max={max}
            min={0}
            name="filter.v.price.gte"
            onBlur={() => onChange(minValue, maxValue, true)}
            onChange={(event) => onChange(fromNumber(event.target.value), maxValue, false)}
            placeholder="0"
            type="number"
            value={minValue ?? ""}
          />
        </label>
        <span className="nwg-col-price__to">to</span>
        <label className="nwg-col-price__field" htmlFor={`${idPrefix}-price-lte`}>
          <span>$</span>
          <input
            aria-label="To price"
            id={`${idPrefix}-price-lte`}
            inputMode="numeric"
            max={max}
            min={0}
            name="filter.v.price.lte"
            onBlur={() => onChange(minValue, maxValue, true)}
            onChange={(event) => onChange(minValue, fromNumber(event.target.value), false)}
            placeholder={String(max)}
            type="number"
            value={maxValue ?? ""}
          />
        </label>
      </div>
    </div>
  );
}
