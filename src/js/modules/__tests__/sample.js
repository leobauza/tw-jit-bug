// import the module we want to test
import Sample from '../sample'
// dom testing library helpers
import { getByText, getByTestId } from '@testing-library/dom'
// adds special assertions like toHaveTextContent

/**
 * The point of this test (partly) is to describe what the DOM structure
 * needs to be for this particular module. In this case the DOM structure
 * looks like this:
 *
 * <div>
 *  <p class="counter"></p>
 *  <button class="button">Button</button>
 * </div>
 */
const createDOMStructure = () => {
  const div = document.createElement('div')
  div.innerHTML = `
    <p data-testid="counter" class="counter"></p>
    <button class="btn">Button</button>
  `

  return div
}

describe('Sample module', () => {
  /**
   * Assign the DOM structure to the element that is passed into the module.
   * This simulates the automatic way modules are loaded in the `data-module`
   * pattern. ie. pretend that the div has the attr `data-module="sample"`
   */
  const el = createDOMStructure()
  const sample = new Sample(el)

  // Testing assignments
  test('sets vars correctly', () => {
    expect(sample.btn).toBe(el.querySelector('.btn'))
    expect(sample.counter).toBe(el.querySelector('.counter'))
    expect(sample.message).toBe('a click!')
    expect(sample.count).toBe(0)
    expect(sample.el).toBe(el)
  })

  // Testing a random function in the `sample` module
  test('can calculate stuff', () => {
    expect(sample.calculateStuff(1, 1)).toBe(2)
  })

  /**
   * The most important test here is this. It tests the actual user interaction
   * using the DOM Testing Library.
   */
  test('alerts and counts', () => {
    // Mock window.alert so we can check how many times it is called
    jest.spyOn(window, 'alert').mockImplementation(() => {
      return true
    })

    // Get the button by it's text
    const button = getByText(el, 'Button')

    // First click should alert with 'a click!' and update the counter to show "1"
    button.click()
    expect(window.alert).toBeCalledWith('a click!')
    expect(getByTestId(el, 'counter').innerHTML).toBe('1')

    /**
     * Second click should NOT alert (ie. it shouldn't be called a second time)
     * and update the counter to show "2"
     */
    button.click()
    expect(window.alert).toHaveBeenCalledTimes(1)
    expect(getByTestId(el, 'counter').innerHTML).toBe('2')

    // cleanup
    window.alert.mockRestore()
  })
})
