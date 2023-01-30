import {Component} from 'react'
import Loader from 'react-loader-spinner'
import CategoryItem from '../CategoryItem'
import ProjectItem from '../ProjectItem'
import Header from '../Header'
import './index.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  loading: 'LOADING',
  failure: 'FAILURE',
}

class Projects extends Component {
  state = {
    activeOptionId: categoriesList[0].id,
    projectsList: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.setState({apiStatus: apiStatusConstants.loading}, this.getProjects)
  }

  onResponseSuccess = projectsData => {
    const formattedData = projectsData.map(eachProject => ({
      id: eachProject.id,
      imageUrl: eachProject.image_url,
      name: eachProject.name,
    }))
    console.log(formattedData)
    this.setState({
      projectsList: formattedData,
      apiStatus: apiStatusConstants.success,
    })
  }

  onClickRetry = () => {
    this.setState({apiStatus: apiStatusConstants.loading}, this.getProjects)
  }

  onResponseFailure = () => {
    this.setState({apiStatus: apiStatusConstants.failure})
  }

  getProjects = async () => {
    const {activeOptionId} = this.state
    const apiUrl = `https://apis.ccbp.in/ps/projects?category=${activeOptionId}`
    const response = await fetch(apiUrl)
    const data = await response.json()
    if (response.ok) {
      return this.onResponseSuccess(data.projects)
    }
    return this.onResponseFailure()
  }

  onChangeActiveOption = event => {
    this.setState({activeOptionId: event.target.value}, this.getProjects)
  }

  renderLoadingView = () => (
    <div data-testid="loader">
      <Loader type="TailSpin" color="#00BFFF" height={50} width={50} />
    </div>
  )

  renderSuccessView = () => {
    const {projectsList} = this.state
    return (
      <ul className="projects-list-container">
        {projectsList.map(eachProject => (
          <ProjectItem key={eachProject.id} project={eachProject} />
        ))}
      </ul>
    )
  }

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="failure-image"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-description">
        We cannot seem to find the page you are looking for
      </p>
      <button className="retry-btn" type="button" onClick={this.onClickRetry}>
        Retry
      </button>
    </div>
  )

  renderResultsPage = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case 'SUCCESS':
        return this.renderSuccessView()
      case 'FAILURE':
        return this.renderFailureView()
      case 'LOADING':
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="page-container">
          <div>
            <select
              className="select-item"
              onChange={this.onChangeActiveOption}
            >
              {categoriesList.map(eachCategory => (
                <CategoryItem category={eachCategory} key={eachCategory.id} />
              ))}
            </select>
          </div>

          {this.renderResultsPage()}
        </div>
      </>
    )
  }
}

export default Projects
