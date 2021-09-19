import { useCallback, useMemo, useState, MouseEvent, ChangeEvent } from 'react';
import throttle from 'lodash.throttle'
import './App.css';

function App() {
  const [dragging, setDragging] = useState(false)
  const [mouseOffset, setMouseOffset] = useState([0, 0])
  const [position, setPosition] = useState([0, 0])

  const onChangeX = (event: ChangeEvent<HTMLInputElement>) => setPosition([parseInt(event.target.value), position[1]])
  const onChangeY = (event: ChangeEvent<HTMLInputElement>) => setPosition([position[0], parseInt(event.target.value)])

  const onMouseDown = (event: MouseEvent) => {
    const { offsetX, offsetY } = event.nativeEvent
    setMouseOffset([offsetX, offsetY])
    setDragging(true)
  }

  const onMouseUp = () => setDragging(false)

  const onMouseMove = useCallback((event: MouseEvent) => {
    if (dragging) {
      const { clientX, clientY } = event
      setPosition([clientX - mouseOffset[0], clientY - mouseOffset[1]])
    }
  }, [dragging, mouseOffset])

  const throttledOnMouseMove = useMemo(() => throttle(onMouseMove, 10), [onMouseMove]) // throttle to 100fps

  return (
    <div className="App" onMouseUp={onMouseUp} onMouseMove={throttledOnMouseMove}>
      <header className="App-header">
        <div className="rectangle" onMouseDown={onMouseDown} style={{
          left: position[0],
          top: position[1]
        }}></div>
        <div className="flex-row">
          <label htmlFor="position-X">
            X
          </label>
          <input type="number" value={position[0]} id="position-X" onChange={onChangeX} />
        </div>
        <div className="flex-row">
          <label htmlFor="position-Y">
            Y
          </label>
          <input type="number" value={position[1]} id="position-X" onChange={onChangeY} />
        </div>
      </header>
    </div>
  );
}

export default App;
