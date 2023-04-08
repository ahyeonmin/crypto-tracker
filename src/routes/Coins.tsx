import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { fetchCoins } from "../api";
import Helmet from "react-helmet";
import { useSetRecoilState } from "recoil";
import { isDarkAtom } from '../atom';

function Coins() {
    interface ICoins {
        id: string;
        name: string;
        symbol: string;
        rank: number;
        is_new: boolean;
        is_active: boolean;
        type: string;
    }

    const { isLoading, data } = useQuery<ICoins[]>("allCoins", fetchCoins);

    const setDarkAtom = useSetRecoilState(isDarkAtom);
    const toggleDarkAtom = () => setDarkAtom((prev) => !prev);
   
    const Img = styled.img`
        width: 25px;
        height: 25px;
        margin-right: 10px;
    `;

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

    const CoinsList = styled.ul``;

    const Coins = styled.li`
        margin-bottom: 15px;
        background-color: ${(props) => props.theme.cardBgColor};
        color: ${(props) => props.theme.textColor};
        border-radius: 5px;
        font-size: 17px;
        a {
            display: flex;
            align-items: center;
            padding: 10px;
            transition: color 0.1s ease-in;
            &:hover {
                color: ${(props) => props.theme.accentColor};
            }
        }
    `;

    return (
        <Container>
            <Helmet>
                <title>Crypto Tracker</title>
            </Helmet>
            <Header>
                <Title>Crypto Tracker</Title>
            </Header>
            <div>
                {isLoading ? (
                    <Loader>Loading...</Loader>
                    ) : (
                        <CoinsList>
                            {data?.slice(0, 100).map((coin) => (
                                <Coins key={coin.id}>
                                    <Link to={{
                                        pathname: `/${coin.id}`,
                                        state: {name: coin.name},
                                    }}>
                                    <Img src={`https://coinicons-api.vercel.app/api/icon/${coin.symbol.toLowerCase()}`} />{coin.name} &rarr;
                                    </Link>
                                </Coins>
                            ))}
                        </CoinsList>
                    )
                }
            </div>
            <footer>
                <button onClick={toggleDarkAtom}>mode</button>
            </footer>
        </Container>
    );
}

export default Coins;