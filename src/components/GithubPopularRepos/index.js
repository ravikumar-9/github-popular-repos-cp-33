import {Component} from 'react'

import Loader from 'react-loader-spinner'

import LanguageFilterItem from '../LanguageFilterItem'

import RepositoryItem from '../RepositoryItem'

import './index.css'

const languageFiltersData = [
  {id: 'ALL', language: 'All'},
  {id: 'JAVASCRIPT', language: 'Javascript'},
  {id: 'RUBY', language: 'Ruby'},
  {id: 'JAVA', language: 'Java'},
  {id: 'CSS', language: 'CSS'},
]

// Write your code here

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class GithubPopularRepos extends Component {
  state = {
    activeOptionId: languageFiltersData[0].id,
    apiStatus: apiStatusConstants.initial,
    repositoriesList: [],
  }

  componentDidMount() {
    this.getRepositories()
  }

  onChangeActiveId = id => {
    this.setState({activeOptionId: id}, this.getRepositories)
  }

  getRepositories = async () => {
    const {activeOptionId} = this.state
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const url = `https://apis.ccbp.in/popular-repos?language=${activeOptionId}`

    const response = await fetch(url)
    if (response.ok === true) {
      const fetchedData = await response.json()
      const repoData = fetchedData.popular_repos

      const updatedData = repoData.map(eachRepo => ({
        id: eachRepo.id,
        name: eachRepo.name,
        starsCount: eachRepo.stars_count,
        forksCount: eachRepo.forks_count,
        issuesCount: eachRepo.issues_count,
        avatarUrl: eachRepo.avatar_url,
      }))

      this.setState({
        repositoriesList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else if (response.status === 401) {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderSuccessView = () => {
    const {repositoriesList} = this.state
    return repositoriesList.map(each => (
      <RepositoryItem details={each} key={each.id} />
    ))
  }

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        className="failure-img"
        alt="failure view"
      />
    </div>
  )

  renderLoader = () => (
    <div data-testid="loader" className="loader-container">
      <Loader type="ThreeDots" color="#0284c7" height={80} width={80} />
    </div>
  )

  renderSwitchCases = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()

      case apiStatusConstants.failure:
        return this.renderFailureView()

      case apiStatusConstants.inProgress:
        return this.renderLoader()

      default:
        return null
    }
  }

  render() {
    const {activeOptionId, apiStatus, repositoriesList} = this.state

    console.log(activeOptionId)
    console.log(apiStatus)
    console.log(repositoriesList)
    return (
      <div className="bg-container">
        <div className="repo-main-container">
          <h1 className="popular-heading">Popular</h1>
          <ul className="filter-items-container">
            {languageFiltersData.map(eachItem => (
              <LanguageFilterItem
                itemDetails={eachItem}
                key={eachItem.id}
                isActiveId={eachItem.id === activeOptionId}
                onChangeActiveId={this.onChangeActiveId}
              />
            ))}
          </ul>
          <ul className="repo-lists-container">{this.renderSwitchCases()}</ul>
        </div>
      </div>
    )
  }
}

export default GithubPopularRepos
