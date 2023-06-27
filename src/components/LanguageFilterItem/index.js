// Write your code here
import './index.css'

const LanguageFilterItem = props => {
  const {itemDetails, isActiveId, onChangeActiveId} = props

  const {id, language} = itemDetails

  const activeClassName = isActiveId ? 'active-id' : 'inactive-id'

  const changeActiveId = () => {
    onChangeActiveId(id)
  }

  return (
    <li className={activeClassName}>
      <button className="item-button" type="button" onClick={changeActiveId}>
        {language}
      </button>
    </li>
  )
}

export default LanguageFilterItem
