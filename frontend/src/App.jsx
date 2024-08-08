import "./App.css";
import Header from "./components/Header";
import Login from "./components/Login";
import Body from "./components/Body";
import Footer from "./components/Footer";
import { ToastContainer } from "react-toastify";
import '@fontsource/roboto/400.css';

function App() {
  return (
    <div className="App">
      <ToastContainer />
      <Header />
      <Body />
      <Footer />
    </div>
  );
}

export default App;
