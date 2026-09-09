import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {IoLocationOutline, IoStar, IoBagSharp} from 'react-icons/io5'
import Header from '../Header'

import './index.css'

class JobItemDetails extends Component {
  state = {
    isError: false,
    isLoading: false,
    jobDetail: {},
    skillsList: [],
    companyLifeDetails: {},
    similarJobsList: [],
  }

  componentDidMount() {
    this.getJobDetails()
  }

  getJobDetails = async () => {
    this.setState({isLoading: true})
    const token = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params
    const url = `https://apis.ccbp.in/jobs/${id}`
    const option = {
      method: 'GET',
      headers: {
        Authorization: `barer ${token}`,
      },
    }
    const response = await fetch(url, option)
    if (response.ok) {
      const data = await response.json()
      const jobDetailsData = {
        companyLogoUrl: data.job_details.company_logo_url,
        companyWebsiteUrl: data.job_details.company_website_url,
        employmentType: data.job_details.employment_type,
        jobDescription: data.job_details.job_description,
        location: data.job_details.location,
        id: data.job_details.id,
        rating: data.job_details.rating,
        packagePerAnnum: data.job_details.package_per_annum,
        title: data.job_details.title,
      }
      const skills = data.job_details.skills.map(skill => ({
        skillImageUrl: skill.image_url,
        skillName: skill.name,
      }))
      const companyLife = {
        companyDescription: data.job_details.life_at_company.description,
        companyImageUrl: data.job_details.life_at_company.image_url,
      }
      const similarJobs = data.similar_jobs.map(similar => ({
        similarCompanyLogoUrl: similar.company_logo_url,
        similarEmploymentType: similar.employment_type,
        id: similar.id,
        similarJobDescription: similar.job_description,
        similarLocation: similar.location,
        similarRating: similar.rating,
        similarTitle: similar.title,
      }))
      this.setState({
        isLoading: false,
        isError: false,
        jobDetail: jobDetailsData,
        skillsList: skills,
        companyLifeDetails: companyLife,
        similarJobsList: similarJobs,
      })
    } else {
      this.setState({isError: true, isLoading: false})
    }
  }

  getRequest = () => {
    this.setState(this.getJobDetails)
  }

  renderOnSuccess = () => (
    <div className="emp-card">
      {this.renderSelectedJob()}
      <h1 className="similar-head">Similar Jobs</h1>
      {this.renderSimilarJobs()}
    </div>
  )

  renderSelectedJob = () => {
    const {skillsList, companyLifeDetails, jobDetail} = this.state
    return (
      <div className="emp-card job-card">
        <div className="row">
          <img src={jobDetail.companyLogoUrl} alt="job details company logo" />
          <div className="card-job">
            <h1 className="job-title">{jobDetail.title}</h1>
            <div className="row">
              <IoStar className="start-icon" />
              <p className="job-rating">{jobDetail.rating}</p>
            </div>
          </div>
        </div>
        <div className="row row2">
          <div className="row row2">
            <div className="row width-1">
              <IoLocationOutline className="icon" />
              <p className="job-location">{jobDetail.location}</p>
            </div>
            <div className="row width-0">
              <IoBagSharp className="icon" />
              <p className="job-emp">{jobDetail.employmentType}</p>
            </div>
          </div>
          <p className="job-pack">{jobDetail.packagePerAnnum}</p>
        </div>
        <hr />
        <div className="row row2">
          <h1 className="description">Description</h1>
          <a href={jobDetail.companyWebsiteUrl}>Visit</a>
        </div>
        <p className="description-content">{jobDetail.jobDescription}</p>
        <hr />
        <div>
          <h1 className="description">Skills</h1>
          <ul className="similar-card unlist">
            {skillsList.map(skillItem => (
              <li
                className="row row-2 similar-skill-card"
                key={skillItem.skillName}
              >
                <img src={skillItem.skillImageUrl} alt={skillItem.skillName} />
                <p className="skill-name">{skillItem.skillName}</p>
              </li>
            ))}
          </ul>
        </div>
        <br />
        <div>
          <h1 className="description">Life At Company</h1>
          <div className="row row-2">
            <p className="company-para">
              {companyLifeDetails.companyDescription}
            </p>
            <img
              src={companyLifeDetails.companyImageUrl}
              alt="life at company"
            />
          </div>
        </div>
      </div>
    )
  }

  renderSimilarJobs = () => {
    const {similarJobsList} = this.state
    return (
      <div className="similar-card">
        <ul className="unlist">
          {similarJobsList.map(similarJobsItemDetails => (
            <li
              key={similarJobsItemDetails.id}
              className="emp-card job-card similar-job-card"
            >
              <div className="row">
                <img
                  src={similarJobsItemDetails.similarCompanyLogoUrl}
                  alt="similar job company logo"
                />
                <div className="card-job">
                  <h1 className="job-title">
                    {similarJobsItemDetails.similarTitle}
                  </h1>
                  <div className="row">
                    <IoStar className="start-icon" />
                    <p className="job-rating">
                      {similarJobsItemDetails.similarRating}
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <h1 className="description">Description</h1>
                <p className="description-content">
                  {similarJobsItemDetails.similarJobDescription}
                </p>
              </div>
              <div className="row row2">
                <div className="row row2">
                  <div className="row width-1">
                    <IoLocationOutline className="icon" />
                    <p className="job-location">
                      {similarJobsItemDetails.similarLocation}
                    </p>
                  </div>
                  <div className="row width-0">
                    <IoBagSharp className="icon" />
                    <p className="job-emp">
                      {similarJobsItemDetails.similarEmploymentType}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  renderOnFailure = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <div className="failure-button">
        <button
          type="button"
          className="retry-button"
          onClick={this.getRequest}
        >
          Retry
        </button>
      </div>
    </div>
  )

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderJobDetails() {
    const {isError, isLoading} = this.state
    if (isLoading) {
      return this.renderLoader()
    }
    if (isError) {
      return this.renderOnFailure()
    }
    return this.renderOnSuccess()
  }

  render() {
    return (
      <div>
        <Header />
        <div className="body">{this.renderJobDetails()}</div>
      </div>
    )
  }
}

export default JobItemDetails
