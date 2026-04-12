import ReactApexChart from "react-apexcharts";
import { useTheme } from "../../contexts/theme/ThemeContext";
import { chartBase } from "../../utils/chartDefaults";

export function AreaChart({ series = [], categories = [], height = 300, title, gradient = true }) {
    const { isDark } = useTheme();

    const options = {
        ...chartBase,
        ...(isDark ? { theme: { mode: "dark" } } : {}),
        chart: { ...chartBase.chart, type: "area" },
        fill: gradient
            ? {
                  type: "gradient",
                  gradient: {
                      opacityFrom: 0.5,
                      opacityTo: 0.05,
                      shadeIntensity: 1,
                  },
              }
            : { type: "solid", opacity: 0.2 },
        xaxis: { categories, labels: { style: { fontFamily: "Aumovio" } } },
        yaxis: { labels: { style: { fontFamily: "Aumovio" } } },
        title: title ? { text: title, style: { fontFamily: "Aumovio", fontWeight: 700 } } : undefined,
        markers: { size: 0, hover: { size: 6 } },
    };

    return <ReactApexChart type="area" options={options} series={series} height={height} />;
}
