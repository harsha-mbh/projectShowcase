import './index.css'

const CategoryItem = props => {
  const {category} = props
  const {id, displayText} = category
  return (
    <option value={id} className="option">
      {displayText}
    </option>
  )
}

export default CategoryItem
