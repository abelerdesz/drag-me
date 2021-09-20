import { useCallback, useMemo, useState, useRef, useEffect, MouseEvent, ChangeEvent } from 'react'
import throttle from 'lodash.throttle'
import classNames from 'classnames'
import './App.css'

export default function App() {
  const [dragging, setDragging] = useState(false)
  const [untouched, setUntouched] = useState(true)
  const [position, setPosition] = useState([0, 0])
  const [mouseOffset, setMouseOffset] = useState([0, 0])
  const rectangleRef = useRef(null)

  const rectangleClasses = classNames({
    'rectangle': true,
    'rectangle-initial-position': untouched
  })

  const onChangeX = (event: ChangeEvent<HTMLInputElement>) => {
    setUntouched(false)
    const newPosition = parseInt(event.target.value) || 0
    setPosition([newPosition, position[1]])
  }

  const onChangeY = (event: ChangeEvent<HTMLInputElement>) => {
    setUntouched(false)
    const newPosition = parseInt(event.target.value) || 0
    setPosition([position[0], newPosition])
  }

  const onMouseDown = (event: MouseEvent) => {
    const { offsetX, offsetY } = event.nativeEvent
    setMouseOffset([offsetX, offsetY])
    setDragging(true)
  }

  const onMouseUp = () => setDragging(false)

  const onMouseMove = useCallback((event: MouseEvent) => {
    if (dragging) {
      const { clientX, clientY } = event
      setUntouched(false)
      setPosition([clientX - mouseOffset[0], clientY - mouseOffset[1]])
    }
  }, [dragging, mouseOffset])

  // Throttle to 100fps
  const throttledOnMouseMove = useMemo(() => throttle(onMouseMove, 10), [onMouseMove])

  // Display starting coordinates when component is mounted
  useEffect(() => {
    if (rectangleRef?.current) {
      const { offsetLeft, offsetTop } = rectangleRef.current
      setPosition([offsetLeft, offsetTop])
    }
  }, [])

  return (
    <div className="App" onMouseUp={onMouseUp} onMouseMove={throttledOnMouseMove}>
      <main className="App-main">
        <div
          ref= {rectangleRef}
          className={rectangleClasses}
          onMouseDown={onMouseDown}
          style={{
            left: `${position[0]}px`,
            top: `${position[1]}px`
          }}>Drag me</div>
        <div className="flex-row">
          <div className="flex-row mr-1">
            <label className="mr-1" htmlFor="position-X">
              X
            </label>
            <input
              type="number"
              value={position[0]}
              className="coordinate-input"
              id="position-X" onChange={onChangeX} />
          </div>
          <div className="flex-row">
            <label className="mr-1" htmlFor="position-Y">
              Y
            </label>
            <input
              type="number"
              value={position[1]}
              className="coordinate-input"
              id="position-X"
              onChange={onChangeY} />
          </div>
        </div>
      </main>
    </div>
  )
}
