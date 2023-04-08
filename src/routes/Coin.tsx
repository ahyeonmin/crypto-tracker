import { Switch, Route, useRouteMatch, useLocation, useParams } from "react-router";
import { Link } from "react-router-dom";
import {useQuery} from 'react-query';
import styled from "styled-components";
import Price from "./Price";
import Chart from "./Chart";
import { fetchCoinsInfo, fetchCoinsTickers } from "../api";
import Helmet from "react-helmet";
import { useSetRecoilState } from "recoil";
import { isDarkAtom } from "../atom";

interface RouteParams {
    coinId: string;
}
interface RouteState {
    name: string;
}
interface InfoData {
    id: string;
    name: string;
    symbol: string;
    rank: number;
    is_new: boolean;
    is_active: boolean;
    type: string;
    logo: string;
    description: string;
    message: string;
    open_source: boolean;
    started_at: string;
    development_status: string;
    hardware_wallet: boolean;
    proof_type: string;
    org_structure: string;
    hash_algorithm: string;
    first_data_at: string;
    last_data_at: string;
}
interface TickersData {
    id: string;
    name: string;
    symbol: string;
    rank: number;
    circulating_supply: number;
    total_supply: number;
    max_supply: number;
    beta_value: number;
    first_data_at: string;
    last_updated: string;
    quotes: {
        USD: {
            price: number;
            volume_24h: number;
            volume_24h_change_24h: number;
            market_cap: number;
            market_cap_change_24h: number;
            percent_change_15m: number;
            percent_change_30m: number;
            percent_change_1h: number;
            percent_change_6h: number;
            percent_change_12h: number;
            percent_change_24h: number;
            percent_change_7d: number;
            percent_change_30d: number;
            percent_change_1y: number;
            ath_price: number;
            ath_date: string;
            percent_from_price_ath: number;
        };
    };
}

function Coin() {
    const { coinId } = useParams<RouteParams>();
    const { state } = useLocation<RouteState>();
    const {isLoading: infoLoading, data: infoData} = useQuery<InfoData>(["info", coinId], () => fetchCoinsInfo(coinId));
    const {isLoading: tickersLoading, data: tickersData} = useQuery<TickersData>(
        ["tickers", coinId],
        () => fetchCoinsTickers(coinId),
        {refetchInterval: 10000}
    );
    const loading = infoLoading || tickersLoading;
    /*
    const [loading, setLoading] = useState(true);
    const [info, setInfo] = useState<InfoData>();
    const [price, setPrice] = useState<PriceData>();
    useEffect(() => {
        (async() => {
            const infoData = await (await fetch(`https://api.coinpaprika.com/v1/coins/${coinId}`)).json();
            const priceData = await (await fetch(`https://api.coinpaprika.com/v1/tickers/${coinId}`)).json();
            setInfo(infoData);
            setPrice(priceData);
            setLoading(false);
        })();
    }, []);
    */

    const setDarkAtom = useSetRecoilState(isDarkAtom);
    const toggleDarkAtom = () => setDarkAtom((prev) => !prev);

    const priceMatch = useRouteMatch(`/${coinId}/price`);
    const chartMatch = useRouteMatch(`/${coinId}/chart`);

    const Loader = styled.span`
        text-align: center;
        display: block;
        padding-top: 100px;
    `;

    const Container = styled.div`
        padding: 50px 0;
        max-width: 480px;
        margin: 0 auto;
    `;

    const Header = styled.div`
        height: 10%;
        display: flex;
        justify-content: center;
        padding-bottom: 20px;
    `;

    const Title = styled.h1`
        color: ${(props) => props.theme.accentColor};
        font-family: 'Poppins', sans-serif;
        font-size: 45px;
    `;

    const Overview = styled.div`
        display: flex;
        justify-content: space-between;
        padding: 10px 20px;
        background-color: ${(props) => props.theme.cardBgColor};
        color: ${(props) => props.theme.textColor};
        border-radius: 10px;
        margin: 30px 0;
    `;

    const OverviewItem = styled.div`
        display: flex;
        flex-direction: column;
        align-items: center;
        span:first-child {
            font-size: 11px;
            font-weight: 300;
            padding-bottom: 5px;
            text-transform: uppercase;
        }
    `;

    const Description = styled.div`
        color: ${(props) => props.theme.textColor};
    `;

    const Tabs = styled.div`
        display: flex;
        justify-content: space-between;
        margin-bottom: 30px;
    `;

    const Tab = styled.div<{isActive: boolean}>`
        background-color: ${(props) => props.theme.cardBgColor};
        border-radius: 10px;
        color: ${(props) => props.isActive ? props.theme.accentColor : props.theme.textColor};
        a {
            padding: 15px 98px;
            display: block;
        }
    `;

    return (
        <Container>
            <Helmet>
                <title>
                    {state?.name ? state.name : loading ? "Loading..." : infoData?.name}
                </title>
            </Helmet>
            <Header>
                <Link to={`/`}>←</Link>
                <Title>
                    {state?.name ? state.name : loading ? "Loading..." : infoData?.name}
                </Title>
            </Header>
            <div>
                {loading ? <Loader>Loading...</Loader> : 
                    <>
                        <Overview>
                            <OverviewItem>
                                <span>rank:</span>
                                <span>{infoData?.rank}</span>
                            </OverviewItem>
                            <OverviewItem>
                                <span>symbol:</span>
                                <span>${infoData?.symbol}</span>
                            </OverviewItem>
                            <OverviewItem>
                                <span>price:</span>
                                <span>{tickersData?.quotes.USD.price.toFixed(2)}</span>
                            </OverviewItem>
                        </Overview>
                        <Description>{infoData?.description}</Description>
                        <Overview>
                            <OverviewItem>
                                <span>total suply:</span>
                                <span>{tickersData?.total_supply}</span>
                            </OverviewItem>
                            <OverviewItem>
                                <span>max suply:</span>
                                <span>{tickersData?.max_supply}</span>
                            </OverviewItem>
                        </Overview>
                        <Tabs>
                            <Tab isActive={chartMatch !== null}>
                                <Link to={`/${coinId}/chart`}>Chart</Link>
                            </Tab>
                            <Tab isActive={priceMatch !== null}>
                                <Link to={`/${coinId}/price`}>Price</Link>
                            </Tab>
                        </Tabs>
                        <Switch>
                            <Route path={`/:coinId/chart`}>
                                <Chart coinId={coinId}/>
                            </Route>
                            <Route path={`/:coinId/price`}>
                                <Price coinId={coinId}/>
                            </Route>
                        </Switch>
                    </>
                }
            </div>
            <footer>
                <button onClick={toggleDarkAtom}>mode</button>
            </footer>
        </Container>
    );
}

export default Coin;