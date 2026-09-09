import Header from '../Header'
import './index.css'

const NotFound = () => (
  <>
    <Header />
    <div className="notfound-card">
      <img
        src="https://assets.ccbp.in/frontend/react-js/jobby-app-not-found-img.png"
        alt="not found"
        className="notfound-image"
      />
      <h1 className="notfound-head">Page Not Found</h1>
      <p className="notfound-para">
        We are sorry, the page you requested could not found
      </p>
    </div>
  </>
)

export default NotFound
