import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {Link} from 'react-router-dom'
import {IoLocationOutline, IoStar, IoBagSharp} from 'react-icons/io5'
import {BsSearch} from 'react-icons/bs'
import Header from '../Header'
import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const locationList = [
  {
    label: 'Hyderabad',
    locationId: 'HYDERABAD',
  },
  {
    label: 'Bangalore',
    locationId: 'BANGALORE',
  },
  {
    label: 'Chennai',
    locationId: 'CHENNAI',
  },
  {
    label: 'Delhi',
    locationId: 'DELHI',
  },
  {
    label: 'Mumbai',
    locationId: 'MUMBAI',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

class Jobs extends Component {
  state = {
    isLoading: false,
    isError: false,
    profileDetails: {},
    jobsList: [],
    searchInputValue: '',
    salaryRange: salaryRangesList[0].salaryRangeId,
    typeOfEmployment: [],
    typeOfLocation: [],
  }

  componentDidMount() {
    this.getProfile()
    this.getJobs()
  }

  getProfile = async () => {
    this.setState({isLoading: true})
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/profile'
    const option = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, option)
    const data = await response.json()
    if (response.ok) {
      const profileData = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }
      this.setState({
        profileDetails: profileData,
        isLoading: false,
        isError: false,
      })
    } else {
      this.setState({isLoading: false, isError: true})
    }
  }

  getJobs = async () => {
    this.setState({isLoading: true})
    const {typeOfEmployment, salaryRange, searchInputValue, typeOfLocation} =
      this.state
    const employment = typeOfEmployment.join(',')
    console.log(employment, typeOfEmployment)
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs?minimum_package=${salaryRange}&employment_type=${employment}&search=${searchInputValue}`
    const option = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, option)
    const data = await response.json()
    if (response.ok) {
      const jobsData = data.jobs.map(jobitem => ({
        companyLogoUrl: jobitem.company_logo_url,
        employmentType: jobitem.employment_type,
        id: jobitem.id,
        jobDescription: jobitem.job_description,
        location: jobitem.location,
        rating: jobitem.rating,
        title: jobitem.title,
        packagePerAnnum: jobitem.package_per_annum,
      }))
      const filteredJobs = jobsData.filter(job =>
        typeOfLocation.length === 0
          ? true
          : typeOfLocation.some(
              loc => loc.toLowerCase() === job.location.toLowerCase(),
            ),
      )
      this.setState({
        jobsList: filteredJobs,
        isLoading: false,
        isError: false,
      })
    } else {
      this.setState({isLoading: false, isError: true})
    }
  }

  requestAccess = () => {
    this.setState(this.getProfile)
  }

  toggleSelectedChecked = event => {
    const {value, checked} = event.target
    this.setState(prevState => {
      if (checked) {
        return {typeOfEmployment: [...prevState.typeOfEmployment, value]}
      }
      return {
        typeOfEmployment: prevState.typeOfEmployment.filter(
          eachItem => eachItem !== value,
        ),
      }
    }, this.getJobs)
  }

  toggleLocationSelectedChecked = event => {
    const {value, checked} = event.target
    this.setState(prevState => {
      if (checked) {
        return {typeOfLocation: [...prevState.typeOfLocation, value]}
      }
      return {
        typeOfLocation: prevState.typeOfLocation.filter(
          eachItem => eachItem !== value,
        ),
      }
    }, this.getJobs)
  }

  getSalarySelected = event => {
    this.setState({salaryRange: event.target.value}, this.getJobs)
  }

  setInputValueChange = event => {
    this.setState({searchInputValue: event.target.value}, this.getJobs)
  }

  renderSuccesProfile = () => {
    const {profileDetails} = this.state
    return (
      <div className="emp-card">
        <div className="profile-card">
          <img src={profileDetails.profileImageUrl} alt="profile" />
          <h1>{profileDetails.name}</h1>
          <p>{profileDetails.shortBio}</p>
        </div>
      </div>
    )
  }

  renderJobDetails = () => {
    const {jobsList} = this.state
    return (
      <ul className="unorder-list">
        {jobsList.map(jobsItemDetails => (
          <li key={jobsItemDetails.id}>
            <Link to={`/jobs/${jobsItemDetails.id}`} className="link">
              <div className="emp-card job-card">
                <div className="row">
                  <img
                    src={jobsItemDetails.companyLogoUrl}
                    alt="company logo"
                  />
                  <div className="card-job">
                    <h1 className="job-title">{jobsItemDetails.title}</h1>
                    <div className="row">
                      <IoStar className="start-icon" />
                      <p className="job-rating">{jobsItemDetails.rating}</p>
                    </div>
                  </div>
                </div>
                <div className="row row2">
                  <div className="row row2">
                    <div className="row width-1">
                      <IoLocationOutline className="icon" />
                      <p className="job-location">{jobsItemDetails.location}</p>
                    </div>
                    <div className="row width-0">
                      <IoBagSharp className="icon" />
                      <p className="job-emp">
                        {jobsItemDetails.employmentType}
                      </p>
                    </div>
                  </div>
                  <p className="job-pack">{jobsItemDetails.packagePerAnnum}</p>
                </div>
                <hr />
                <div>
                  <h1 className="description">Description</h1>
                  <p className="description-content">
                    {jobsItemDetails.jobDescription}
                  </p>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    )
  }

  renderSuccesJobs = () => {
    const {jobsList} = this.state
    return (
      <div className="">
        {jobsList.length === 0 ? (
          <div>
            <img
              src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
              alt="no jobs"
            />
            <h1>No Jobs Found</h1>
            <p>We could not find any jobs. Try other filters</p>
            <div className="failure-button">
              <button type="button" className="retry-button">
                Retry
              </button>
            </div>
          </div>
        ) : (
          this.renderJobDetails()
        )}
      </div>
    )
  }

  renderProfileFailure = () => (
    <button type="button" className="retry-button" onClick={this.requestAccess}>
      Retry
    </button>
  )

  renderFailure = () => (
    <div className="failure-button">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button type="button" className="retry-button" onClick={this.getJobs}>
        Retry
      </button>
    </div>
  )

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderEmploymentMethod = () => (
    <div className="emp-card">
      <h1 className="head">Type Of Employment</h1>
      <ul className="unorder-list">
        {employmentTypesList.map(type => (
          <li className="list" key={type.employmentTypeId}>
            <input
              type="checkbox"
              id={type.employmentTypeId}
              value={type.employmentTypeId}
              name={type.label}
              onChange={this.toggleSelectedChecked}
            />
            <label htmlFor={type.employmentTypeId}>{type.label}</label>
          </li>
        ))}
      </ul>
    </div>
  )

  renderLocationMethod = () => (
    <div className="emp-card">
      <h1 className="head">Location</h1>
      <ul className="unorder-list">
        {locationList.map(type => (
          <li className="list" key={type.locationId}>
            <input
              type="checkbox"
              id={type.locationId}
              value={type.locationId}
              name={type.label}
              onChange={this.toggleLocationSelectedChecked}
            />
            <label htmlFor={type.locationId}>{type.label}</label>
          </li>
        ))}
      </ul>
    </div>
  )

  renderSalaryRange = () => {
    const {salaryRange} = this.state

    return (
      <div className="emp-card">
        <h1 className="head">Salary Range</h1>
        <ul className="unorder-list">
          {salaryRangesList.map(salary => (
            <li key={salary.salaryRangeId}>
              <input
                type="radio"
                value={salary.salaryRangeId}
                id={salary.salaryRangeId}
                checked={this.salaryRangeId === {salaryRange}}
                name={salary.label}
                onChange={this.getSalarySelected}
              />
              <label htmlFor={salary.salaryRangeId}>{salary.label}</label>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  renderMethodProfile() {
    const {isError, isLoading} = this.state
    if (isLoading) {
      return this.renderLoader()
    }
    if (isError) {
      return this.renderProfileFailure()
    }
    return this.renderSuccesProfile()
  }

  renderMethodJobs() {
    const {isError, isLoading} = this.state
    if (isLoading) {
      return this.renderLoader()
    }
    if (isError) {
      return this.renderFailure()
    }
    return this.renderSuccesJobs()
  }

  render() {
    const {searchInputValue} = this.state
    return (
      <>
        <Header />
        <div className="body">
          <div className="content-left">
            {this.renderMethodProfile()}
            <hr />
            {this.renderEmploymentMethod()}
            <hr />
            {this.renderSalaryRange()}
            <hr />
            {this.renderLocationMethod()}
          </div>
          <div className="content-right">
            <div className="row-3">
              <input
                type="search"
                placeholder="Search"
                value={searchInputValue}
                onChange={this.setInputValueChange}
              />
              <button
                type="button"
                data-testid="searchButton"
                className="button"
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            <div className="job-content">{this.renderMethodJobs()}</div>
          </div>
        </div>
      </>
    )
  }
}
export default Jobs
