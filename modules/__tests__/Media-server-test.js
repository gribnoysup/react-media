/**
 * @jest-environment node
 */

import React from 'react'
import ReactDOMServer from 'react-dom/server'
import Media from '../Media'

describe('A <Media> in server environment', () => {
  const queries = {
    sm: '(max-width: 1000px)',
    lg: '(max-width: 2000px)',
    xl: '(max-width: 3000px)',
  }

  describe('when no default matches prop provided', () => {
    const expected = {
      sm: true,
      lg: true,
      xl: true,
    }

    it('should call children function with all queries matching', () => {
      ReactDOMServer.renderToStaticMarkup(
        <Media queries={queries}>
          {matches => {
            expect(matches).toMatchObject(expected)
            return null
          }}
        </Media>
      )
    })
  })

  describe('when default matches prop provided', () => {
    const defaultMatches = {
      sm: true,
      lg: false,
      xl: false,
    }

    it('should call children function with expected values', () => {
      ReactDOMServer.renderToStaticMarkup(
        <Media queries={queries} defaultMatches={defaultMatches}>
          {matches => {
            expect(matches).toMatchObject(defaultMatches)
            return null
          }}
        </Media>
      )
    })
  })
})
