import React from 'react'
import PropTypes from 'prop-types'
import json2mq from 'json2mq'

const queryType = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.object,
  PropTypes.arrayOf(PropTypes.object.isRequired)
])

/**
 * Conditionally renders based on whether or not a media query matches.
 */
class Media extends React.Component {
  static propTypes = {
    defaultMatches: PropTypes.objectOf(PropTypes.bool),
    queries: PropTypes.objectOf(queryType).isRequired,
    render: PropTypes.func,
    children: PropTypes.func
  }

  queries = []

  state = {
    matches:
      this.props.defaultMatches ||
      Object.keys(this.props.queries).reduce((acc, key) => ({ ...acc, [key]: true }), {})
  }

  updateMatches = () => {
    const newMatches = this.queries.reduce(
      (acc, { name, mqList }) => ({ ...acc, [name]: mqList.matches }), {}
    )

    this.setState({ matches: newMatches })
  }

  componentWillMount() {
    if (typeof window !== 'object')
      return

    const { queries } = this.props

    this.queries = Object.keys(queries).map(name => {
      const query = queries[name]
      const qs = typeof query !== 'string' ? json2mq(query) : query
      const mqList = window.matchMedia(qs)

      mqList.addListener(this.updateMatches)

      return { name, qs, mqList }
    })

    this.updateMatches()
  }

  componentWillUnmount() {
    this.queries.forEach(({ mqList }) =>
      mqList.removeListener(this.updateMatches)
    )
  }

  render() {
    const { children, render } = this.props
    const { matches } = this.state

    // Preact defaults to empty children array
    return children && !Array.isArray(children) ? children(matches) : render ? render(matches) : null
  }
}

export default Media
