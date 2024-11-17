import {Routes, Route, BrowserRouter as Router} from 'react-router-dom'
import Layout from "./components/Layout";
import Lend from "./pages/lend";
import Panel from "./pages/panel";
import Overview from "./pages/overview";
import LeaderboardPage from "./pages/leaderboard";
import NotFoundPage from "./pages/404";
import Providers from "./providers/Providers.tsx";

function App() {
    return (
        <>
            <Providers>
                {/*{showDisclaimer && <DisclaimerBanner onAccept={handleAccept} />}*/}
                <Router>
                    <Layout>
                        <Routes>
                            <Route path={'/'} element={<Lend/>}/>
                            <Route path={'/lend'} element={<Lend/>}/>
                            <Route path={'/lend/:type/:asset'} element={<Panel/>}/>
                            <Route path={'*'} element={<NotFoundPage/>}/>
                        </Routes>
                    </Layout>
                </Router>
            </Providers>
        </>
    )
}

export default App
