import { useQuery } from "react-query";
import styled from "styled-components";
import { fetchCoinHistory } from "../api"
import ApexChart from "react-apexcharts";

interface PriceProps {
    coinId: string;
}

interface IHistorical {
    time_open: number;
    time_close: number;
    open: string;
    high: string;
    low: string;
    close: string;
    volume: string;
    market_cap: number;
}

function Price({coinId}: PriceProps) {
    const { isLoading, data } = useQuery<IHistorical[]>(
        ["ohlcv", coinId],
        () => fetchCoinHistory(coinId),
        {refetchInterval: 20000}
    );

    const Loader = styled.span`
    text-align: center;
    display: block;
    padding-top: 100px;
    color: white;
    `;

    return(
        <div>
            {isLoading ? <Loader>Loading...</Loader> : (
                <ApexChart
                    type="line"
                    series={[
                        {
                            name: "Price",
                            data: data?.map((price) => parseFloat(price.close)) ?? [],
                        }
                    ]}
                    options={{
                        xaxis: {
                            type: "datetime",
                            categories: data?.map((price) => (price.time_close * 1000)),
                            axisBorder: { show: false },
                            axisTicks: { show: false },
                            labels: { show: false },
                        },
                        yaxis: { show: false },
                        chart: {
                            width: 500,
                            height: 500,
                            toolbar: {
                                show: false,
                            },
                            background: "transparent",
                        },
                        colors: ["#45d483"],
                        theme: {
                            mode: "dark",
                        },
                        stroke: {
                            curve: "smooth",
                            width: 4,
                        },
                        grid: { show: false, },
                    }}
                />
            )}
        </div>
    );
}

export default Price;