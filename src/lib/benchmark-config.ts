type PublicBenchmarkConfig = {
  benchmark_name: string;
  benchmark_year_start_value: number;
  benchmark_latest_value: number;
  benchmark_as_of_date: string;
};

// Update this file manually until live benchmark data is wired up.
// Methodology: first trading day close of the current calendar year vs latest available close.
export const publicBenchmarkConfig: PublicBenchmarkConfig = {
  benchmark_name: "SPX",
  benchmark_year_start_value: 6858.76,
  benchmark_latest_value: 6685.46,
  benchmark_as_of_date: "2026-03-12",
};

export function calculateBenchmarkReturnPct(config: PublicBenchmarkConfig) {
  if (config.benchmark_year_start_value <= 0) {
    return 0;
  }

  return (
    ((config.benchmark_latest_value - config.benchmark_year_start_value) /
      config.benchmark_year_start_value) *
    100
  );
}

export function getPublicBenchmarkSummary() {
  return {
    label: publicBenchmarkConfig.benchmark_name,
    asOfDate: publicBenchmarkConfig.benchmark_as_of_date,
    returnPct: calculateBenchmarkReturnPct(publicBenchmarkConfig),
  };
}
