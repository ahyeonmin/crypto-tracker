import { useQuery } from "react-query";
import styled from "styled-components";
import { fetchCoinHistory } from "../api";
import ApexChart from "react-apexcharts";
import { useRecoilValue } from "recoil";
import { isDarkAtom } from "../atom";
import { darkTheme } from "../Theme";

interface ChartProps {
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

function Chart({coinId}: ChartProps) {
    const isDark = useRecoilValue(isDarkAtom);

    const { isLoading, data } = useQuery<IHistorical[]>(
        ["ohlcv", coinId],
        () => fetchCoinHistory(coinId),
        {refetchInterval: 20000}
    );

    const exceptData = data ?? [];
    const chartData = exceptData.map((price) => {
        return {
            x: price.time_close,
            y: [
                price.open,
                price.high,
                price.low,
                price.close,
            ],
        };
    });
    
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
                    type="candlestick"
                    series={[
                        {
                            data: chartData,
                        }
                    ]}
                    options={{
                        theme: {mode: 'dark'},
                        chart: {
                            type: 'candlestick',
                            width: 500,
                            height: 500,
                            toolbar: {
                                show: false
                            },
                            background: 'transparent',
                        },
                        grid: {
                            show: false
                        },
                        xaxis: {
                            type: 'datetime',
                            categories: data?.map((price) => price.time_close),
                            tooltip: {
                             enabled: false
                            },
                            labels: {
                                style: {
                                  colors: 'lightgreen'
                                }
                            }
                        },
                        yaxis: { show: false },
                    }}
                />
            )}
        </div>
    );
}

export default Chart;