import {Link} from 'react-router-dom'
import Header from '../Header'
import './index.css'

const Home = () => (
  <>
    <Header />
    <div className="home-body details">
      <h1 className="find-jobs-title">Find The Job That Fits Your Life</h1>
      <p className="find-jobs-para">
        Millions of people are searching for jobs . This could be because the
        text is broken up by multiple elements. In this case, you can provide a
        function for your text matcher to make your matcher more flexible.
      </p>
      <Link to="/jobs">
        <button type="button" className="find-jobs-button">
          Find Jobs
        </button>
      </Link>
    </div>
  </>
)
export default Home

/* const onClickFindJobs = () => {
    const {history} = props
    history.replace('/jobs')
  } */
