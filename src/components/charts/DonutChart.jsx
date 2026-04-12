import ReactApexChart from "react-apexcharts";
import { useTheme } from "../../contexts/theme/ThemeContext";
import { chartBase } from "../../utils/chartDefaults";

export function DonutChart({ series = [], labels = [], height = 300, title, donut = true }) {
    const { isDark } = useTheme();

    const options = {
        ...chartBase,
        ...(isDark ? { theme: { mode: "dark" } } : {}),
        chart: { ...chartBase.chart, type: donut ? "donut" : "pie" },
        labels,
        plotOptions: donut
            ? {
                  pie: {
                      donut: {
                          size: "65%",
                          labels: {
                              show: true,
                              total: {
                                  show: true,
                                  fontFamily: "Aumovio",
                                  fontWeight: 700,
                              },
                          },
                      },
                  },
              }
            : {},
        title: title ? { text: title, style: { fontFamily: "Aumovio", fontWeight: 700 } } : undefined,
    };

    return <ReactApexChart type={donut ? "donut" : "pie"} options={options} series={series} height={height} />;
}
