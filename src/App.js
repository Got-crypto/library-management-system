import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import UserContext from "./context/user-context";
import UseAuthListener from "./hooks/use-Auth-Listener";
import * as ROUTES from './constants/routes'
import Footer from "./components/footer";


const Login = lazy(() => import("./pages/login"))
const Signup = lazy(() => import("./pages/signup"))
const Dashboard = lazy(() => import("./pages/dashboard"))

export default function App(){

  const {user} = UseAuthListener()

  return (
    <UserContext.Provider value={{user}}>
      <Router>
        <Suspense fallback={<p>Loading Page...</p>}>
          <Switch>
            <Route component={Login} path={ROUTES.LOGIN} />
            <Route component={Signup} path={ROUTES.SIGNUP} />
            <Route component={Dashboard} path={ROUTES.DASHBOARD} />
          </Switch>
          <Footer />
        </Suspense>
      </Router>
    </UserContext.Provider>
  )
}