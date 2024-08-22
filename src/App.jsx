
import "./App.css";
import Slider from "./Slider";
import data from "./data.jsx";
import "./Slider.css";

function App() {
  return (
    <>
      <div className="center">
        <Slider data={data} activeSlide={2} />
      </div>
    </>
  );
}

export default App;
