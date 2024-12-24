/* eslint-disable react/prop-types */

import React from 'react'
import { render, screen, act } from '@testing-library/react'
import { renderToStaticMarkup } from 'react-dom/server'
import withSize from '../with-size'


describe('withSize', () => {
  let resizeDetectorMock
  // const placeholderHtml = '<div style="width: 100%; height: 100%;"></div>'
  function SizeRender({ size = {}, debug }) {
    if (size == null) {
      return <div>No given size</div>
    }

    const { width, height } = size
    const result = (
      <div>
        w: {width || 'null'}, h: {height || 'null'}
      </div>
    )
    if (debug) {
      // console.log(result)
    }
    return result
  }

  const expected = ({ width, height }) =>
    `w: ${width || 'null'}, h: ${height || 'null'}`

  const delay = (fn, time) =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          fn()
        } catch (err) {
          reject(err)
        }
        resolve()
      }, time)
    })

  beforeEach(() => {
    resizeDetectorMock = {
      removeAllListeners: jest.fn(),
      uninstall: jest.fn(),
      listenTo: jest.fn(),
    }
    jest.doMock('../resize-detector.js', () =>
      jest.fn(() => resizeDetectorMock),
    )
  })

  describe('When providing a configuration object', () => {
    describe('And the refresh rate is below 16', () => {
      it('Then an error should be thrown', () => {
        const action = () => withSize({ refreshRate: 15 })
        expect(action).toThrow(/don't put your refreshRate lower than 16/)
      })
    })

    describe('And setting an invalid refreshMode to "debounce"', () => {
      it('Then an error should be thrown', () => {
        const action = () => withSize({ refreshMode: 'foo' })
        expect(action).toThrow(/refreshMode should have a value of/)
      })
    })

    describe('And both monitor values are set to false', () => {
      it('Then an error should be thrown', () => {
        const action = () =>
          withSize({ monitorHeight: false, monitorWidth: false })
        expect(action).toThrow(
          /You have to monitor at least one of the width or height/,
        )
      })
    })
  })

  describe('When disabling placeholders via the component config', () => {
    it('Then the component should render without any size info', () => {
      const SizeAwareComponent = withSize({ noPlaceholder: true })(SizeRender)
      render(<SizeAwareComponent />)
      expect(screen.getByText('No given size')).toBeInTheDocument()
    })
  })

  describe('When disabling placeholders via the global config', () => {
    beforeEach(() => {
      withSize.noPlaceholders = true
    })

    afterEach(() => {
      withSize.noPlaceholders = false
    })

    it('should not use placeholders when the global config is set', () => {
      const SizeAwareComponent = withSize()(SizeRender)
      render(<SizeAwareComponent />)
      expect(screen.getByText('No given size')).toBeInTheDocument()
    })
  })

  describe('When using the sizeCallback fn', () => {
    it('should pass the size data to the callback and pass down no size prop', async () => {
      const SizeAwareComponent = withSize({
        monitorHeight: true,
      })(SizeRender)

      class SizeCallbackWrapper extends React.Component {
        // onSize = (size) => {
        //   // handle size change
        // }

        render() {
          return <SizeAwareComponent onSize={this.onSize} />
        }
      }

      render(<SizeCallbackWrapper />)

      const { listenTo } = resizeDetectorMock
      const checkIfSizeChangedCallback = listenTo.mock.calls[0][1]
      checkIfSizeChangedCallback({
        getBoundingClientRect: () => ({
          width: 100,
          height: 50,
        }),
      })

      await act(async () => {
        await delay(() => {}, 20)
      })

      expect(screen.getByText('No given size')).toBeInTheDocument()
    })
  })

  describe('When running is SSR mode', () => {
    beforeEach(() => {
      withSize.enableSSRBehaviour = true
    })

    it('Then it should render the wrapped rather than the placeholder', () => {
      const SizeAwareComponent = withSize({
        monitorHeight: true,
        monitorWidth: true,
      })(SizeRender)

      const actual = renderToStaticMarkup(
        <SizeAwareComponent otherProp="foo" />,
      )

      expect(actual).toContain(expected({}))
    })
  })
})
