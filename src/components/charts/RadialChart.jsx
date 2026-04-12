import ReactApexChart from "react-apexcharts";
import { useTheme } from "../../contexts/theme/ThemeContext";
import { chartBase } from "../../utils/chartDefaults";

export function RadialChart({ series = [], labels = [], height = 300, title }) {
    const { isDark } = useTheme();

    const options = {
        ...chartBase,
        ...(isDark ? { theme: { mode: "dark" } } : {}),
        chart: { ...chartBase.chart, type: "radialBar" },
        labels,
        plotOptions: {
            radialBar: {
                track: { background: "#F0F0F0", strokeWidth: "80%" },
                dataLabels: {
                    name: {
                        fontFamily: "Aumovio",
                        fontWeight: 700,
                        fontSize: "13px",
                    },
                    value: {
                        fontFamily: "Aumovio",
                        fontWeight: 700,
                        fontSize: "20px",
                    },
                },
                hollow: { size: "30%" },
            },
        },
        title: title ? { text: title, style: { fontFamily: "Aumovio", fontWeight: 700 } } : undefined,
    };

    return <ReactApexChart type="radialBar" options={options} series={series} height={height} />;
}
