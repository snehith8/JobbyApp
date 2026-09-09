import {Switch, Route, Redirect} from 'react-router-dom'
import './App.css'
import Login from './components/Login'
import NotFound from './components/NotFound'
import Home from './components/Home'
import Jobs from './components/Jobs'
import JobItemDetails from './components/JobItemDetaills'
import ProtectedRoute from './components/ProtectedRoute'

const App = () => (
  <Switch>
    <Route path="/login" component={Login} />
    <ProtectedRoute exact path="/" component={Home} />
    <ProtectedRoute exact path="/jobs" component={Jobs} />
    <ProtectedRoute exact path="/jobs/:id" component={JobItemDetails} />
    <Route component={NotFound} />
    <Redirect to="not-found" />
  </Switch>
)

export default App

/*
Retry button
type employment 
search
*/
