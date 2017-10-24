import React from 'react'
import ReactDOM from 'react-dom'
import Media from '../Media'

const createMockMediaMatcher = (matchesOrMapOfMatches) => (qs) => ({
  matches: (matchesOrMapOfMatches && typeof matchesOrMapOfMatches === 'object')
    ? matchesOrMapOfMatches[qs]
    : matchesOrMapOfMatches,
  addListener: () => {},
  removeListener: () => {}
})

describe('A <Media> in browser environment', () => {
  let originalMatchMedia
  beforeEach(() => {
    originalMatchMedia = window.matchMedia
  })

  afterEach(() => {
    window.matchMedia = originalMatchMedia
  })

  let node
  beforeEach(() => {
    node = document.createElement('div')
  })

  describe('with a query that matches', () => {
    beforeEach(() => {
      window.matchMedia = createMockMediaMatcher(true)
    })

    const queries = {
      sm: '(max-width: 1000px)',
      lg: '(max-width: 2000px)',
    }

    describe('and a child component', () => {
      it('should render child and provide matches as a prop', () => {
        const Component = (props) => props.matches.sm && props.matches.lg && <span>fully matched</span>

        const element = (
          <Media queries={queries}>
            <Component />
          </Media>
        )

        ReactDOM.render(element, node, () => {
          expect(node.firstChild.innerHTML).toMatch('fully matched')
        })
      })
    })

    describe('and a children function', () => {
      it('should render its children function call result', () => {
        const element = (
          <Media queries={queries}>
            {matches => matches.sm && matches.lg && <span>children as a function</span>}
          </Media>
        )

        ReactDOM.render(element, node, () => {
          expect(node.firstChild.innerHTML).toMatch('children as a function')
        })
      })
    })

    describe('and a render prop', () => {
      it('should render `render` prop call result', () => {
        const element = <Media queries={queries} render={matches => matches.sm && matches.lg && <span>render prop</span>} />

        ReactDOM.render(element, node, () => {
          expect(node.firstChild.innerHTML).toMatch('render prop')
        })
      })
    })
  })

  describe('with a query that does not match', () => {
    beforeEach(() => {
      window.matchMedia = createMockMediaMatcher(false)
    })

    const queries = {
      sm: '(max-width: 1000px)',
      lg: '(max-width: 2000px)',
    }

    describe('and a child component', () => {
      it('should not render anything', () => {
        const Component = () => <span>I'm not rendered</span>

        const element = (
          <Media queries={queries}>
            <Component />
          </Media>
        )

        ReactDOM.render(element, node, () => {
          expect(node.innerHTML).not.toMatch('I\'m not rendered')
        })
      })
    })

    describe('and a children function', () => {
      it('should render children function call result', () => {
        const element = (
          <Media queries={queries}>
            {matches => !matches.sm && !matches.lg && <span>no matches at all</span>}
          </Media>
        )

        ReactDOM.render(element, node, () => {
          expect(node.firstChild.innerHTML).toMatch('no matches at all')
        })
      })
    })

    describe('and a render prop', () => {
      it('should not call render prop at all', () => {
        const render = jest.fn()

        const element = <Media queries={queries} render={render} />

        ReactDOM.render(element, node, () => {
          expect(render).not.toBeCalled()
        })
      })
    })
  })

  describe('with a query that partially match', () => {
    const queries = {
      sm: '(max-width: 1000px)',
      lg: '(max-width: 2000px)',
    }

    const matches = {
      '(max-width: 1000px)': true,
      '(max-width: 2000px)': false,
    }

    beforeEach(() => {
      window.matchMedia = createMockMediaMatcher(matches)
    })

    describe('and a child component', () => {
      it('should render child and provide matches as a prop', () => {
        const Component = (props) => props.matches.sm && !props.matches.lg && <span>partially matched</span>

        const element = (
          <Media queries={queries}>
            <Component />
          </Media>
        )

        ReactDOM.render(element, node, () => {
          expect(node.firstChild.innerHTML).toMatch('partially matched')
        })
      })
    })

    describe('and a children function', () => {
      it('should render children function call result', () => {
        const element = (
          <Media queries={queries}>
            {matches => matches.sm && !matches.lg && <span>yep, something definetly matched</span>}
          </Media>
        )

        ReactDOM.render(element, node, () => {
          expect(node.firstChild.innerHTML).toMatch('yep, something definetly matched')
        })
      })
    })

    describe('and a render prop', () => {
      it('should render `render` prop call result', () => {
        const element = <Media queries={queries} render={matches => matches.sm && !matches.lg && <span>please render me</span>} />

        ReactDOM.render(element, node, () => {
          expect(node.firstChild.innerHTML).toMatch('please render me')
        })
      })
    })
  })

})
