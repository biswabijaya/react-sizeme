import React from 'react'
import { render, screen } from '@testing-library/react'
import withSizeMock from '../with-size'
import SizeMe from '../component'

jest.mock('../with-size.js')

const noop = () => undefined

const sizeMeConfig = {
  monitorHeight: true,
  monitorWidth: true,
  refreshRate: 80,
  refreshMode: 'debounce',
  noPlaceholder: true,
  resizeDetectorStrategy: 'foo',
}

describe('<SizeMe />', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    withSizeMock.mockImplementation(() => (Component) => Component)
  })

  it('should pass down props as configuration to withSize', () => {
    render(<SizeMe render={noop} {...sizeMeConfig} />)
    expect(withSizeMock).lastCalledWith(sizeMeConfig)
  })

  it('should monitor and provide the size to the render func', () => {
    let actualSize
    render(
      <SizeMe
        render={({ size }) => {
          actualSize = size
        }}
        {...sizeMeConfig}
      />,
    )
    // Simulate the onSize prop call
    const {onSize} = screen.getByTestId('sizeme-component').props
    onSize({ width: 100, height: 50 })
    expect(actualSize).toEqual({ width: 100, height: 50 })
  })

  it('should update the sizeme component when a new configuration is provided', () => {
    const { rerender } = render(<SizeMe {...sizeMeConfig}>{noop}</SizeMe>)
    const newSizeMeConfig = {
      ...sizeMeConfig,
      monitorHeight: false,
    }
    rerender(<SizeMe {...newSizeMeConfig}>{noop}</SizeMe>)
    expect(withSizeMock).toHaveBeenCalledTimes(2)
    expect(withSizeMock).lastCalledWith(newSizeMeConfig)
  })

  it('should not update the sizeme component when a new configuration is provided', () => {
    const { rerender } = render(<SizeMe render={noop} {...sizeMeConfig} />)
    rerender(<SizeMe render={() => 'NEW!'} {...sizeMeConfig} />)
    expect(withSizeMock).toHaveBeenCalledTimes(1)
  })
})
