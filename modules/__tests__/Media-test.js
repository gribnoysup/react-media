import React from 'react'
import ReactDOM from 'react-dom'
import ReactDOMServer from 'react-dom/server'
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

  describe('with a children function', () => {
    beforeEach(() => {
      window.matchMedia = createMockMediaMatcher(true)
    })

    it('should render expected result of the children function call', () => {
      beforeEach(() => {
        window.matchMedia = createMockMediaMatcher(true)
      })

      const element = (
        <Media queries={{ sm: { maxWidth: 1000 }}}>
          {({ sm }) => sm && <div>hello</div>}
        </Media>
      )

      ReactDOM.render(element, node, () => {
        expect(node.firstChild.innerHTML || '').toMatch(/hello/)
      })
    })
  })

  describe('with a render prop', () => {
    beforeEach(() => {
      window.matchMedia = createMockMediaMatcher(true)
    })

    it('should render expected result of the render prop call', () => {
      beforeEach(() => {
        window.matchMedia = createMockMediaMatcher(true)
      })

      const element = (
        <Media
          queries={{ sm: { maxWidth: 1000 }}}
          render={({ sm }) => sm && <div>goodbye</div>}
        />
      )

      ReactDOM.render(element, node, () => {
        expect(node.firstChild.innerHTML || '').toMatch(/goodbye/)
      })
    })
  })

  describe('with a query that matches', () => {
    beforeEach(() => {
      window.matchMedia = createMockMediaMatcher(true)
    })

    const queries = {
      sm: '(max-width: 1000px)',
      lg: '(max-width: 2000px)',
    }

    const expected = {
      sm: true,
      lg: true,
    }

    describe('and a children function', () => {
      it('should call children with expected values', () => {
        ReactDOM.render(
          <Media queries={queries}>
            {matches => {
              expect(matches).toMatchObject(expected)
              return null
            }}
          </Media>, node)
      })
    })

    describe('and a render prop', () => {
      it('should call children with expected values', () => {
        ReactDOM.render(
          <Media queries={queries} render={matches => {
            expect(matches).toMatchObject(expected)
            return null
          }} />, node)
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

    const expected = {
      sm: false,
      lg: false,
    }

    describe('and a children function', () => {
      it('should call children with expected values', () => {
        ReactDOM.render(
          <Media queries={queries}>
            {matches => {
              expect(matches).toMatchObject(expected)
              return null
            }}
          </Media>, node)
      })
    })

    describe('and a render prop', () => {
      it('should call children with expected values', () => {
        ReactDOM.render(
          <Media queries={queries} render={matches => {
            expect(matches).toMatchObject(expected)
            return null
          }} />, node)
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

    const expected = {
      sm: true,
      lg: false,
    }

    describe('and a children function', () => {
      it('should call children with expected values', () => {
        ReactDOM.render(
          <Media queries={queries}>
            {matches => {
              expect(matches).toMatchObject(expected)
              return null
            }}
          </Media>, node)
      })
    })

    describe('and a render prop', () => {
      it('should call children with expected values', () => {
        ReactDOM.render(
          <Media queries={queries} render={matches => {
            expect(matches).toMatchObject(expected)
            return null
          }} />, node)
      })
    })
  })

  // describe('with a query that matches', () => {
  //   beforeEach(() => {
  //     window.matchMedia = createMockMediaMatcher(true)
  //   })

  //   describe('and a children element', () => {
  //     it('renders its child', () => {
  //       const element = (
  //         <Media query="">
  //           <div>hello</div>
  //         </Media>
  //       )

  //       ReactDOM.render(element, node, () => {
  //         expect(node.firstChild.innerHTML).toMatch(/hello/)
  //       })
  //     })
  //   })

  //   describe('and a children function', () => {
  //     it('renders its child', () => {
  //       const element = (
  //         <Media query="">
  //           {matches => (
  //             matches ? <div>hello</div> : <div>goodbye</div>
  //           )}
  //         </Media>
  //       )

  //       ReactDOM.render(element, node, () => {
  //         expect(node.firstChild.innerHTML).toMatch(/hello/)
  //       })
  //     })
  //   })

  //   describe('and a render function', () => {
  //     it('renders its child', () => {
  //       const element = (
  //         <Media query="" render={() => (
  //           <div>hello</div>
  //         )}/>
  //       )

  //       ReactDOM.render(element, node, () => {
  //         expect(node.firstChild.innerHTML).toMatch(/hello/)
  //       })
  //     })
  //   })
  // })

  // describe('with a query that does not match', () => {
  //   beforeEach(() => {
  //     window.matchMedia = createMockMediaMatcher(false)
  //   })

  //   describe('and a children element', () => {
  //     it('renders its child', () => {
  //       const element = (
  //         <Media query="">
  //           <div>hello</div>
  //         </Media>
  //       )

        // ReactDOM.render(element, node, () => {
        //   expect(node.firstChild.innerHTML || '').not.toMatch(/hello/)
        // })
  //     })
  //   })

  //   describe('and a children function', () => {
  //     it('renders its child', () => {
  //       const element = (
  //         <Media query="">
  //           {matches => (
  //             matches ? <div>hello</div> : <div>goodbye</div>
  //           )}
  //         </Media>
  //       )

  //       ReactDOM.render(element, node, () => {
  //         expect(node.firstChild.innerHTML).toMatch(/goodbye/)
  //       })
  //     })
  //   })

  //   describe('and a render function', () => {
  //     it('does not render', () => {
  //       let renderWasCalled = false
  //       const element = (
  //         <Media query="" render={() => {
  //           renderWasCalled = true
  //           return <div>hello</div>
  //         }}/>
  //       )

  //       ReactDOM.render(element, node, () => {
  //         expect(node.firstChild.innerHTML || '').not.toMatch(/hello/)
  //         expect(renderWasCalled).toBe(false)
  //       })
  //     })
  //   })
  // })

  // describe('rendered on the server', () => {
  //   beforeEach(() => {
  //     window.matchMedia = createMockMediaMatcher(true)
  //   })

  //   it('renders its child', () => {
  //     const markup = ReactDOMServer.renderToStaticMarkup(
  //       <Media query="">
  //         <div>hello</div>
  //       </Media>
  //     )

  //     expect(markup).toMatch(/hello/)
  //   })
  // })
})
