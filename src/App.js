import React, { Component } from "react";
import "./App.css";

const AddCookieButton = ({ cookies, handelClick }) => {
  return (
    <div className="cookieContainer">
      <p>
        Number of cookies:{" "}
        <span className="bold" id="brown">
          {cookies}
        </span>
      </p>
      <button className="cookieButton" onClick={handelClick}>
        <span>Another one</span>
        <Emoji symbol="🍪" label="Cookie" />{" "}
      </button>
    </div>
  );
};

const ItemStore = ({
  cursorCounter,
  cursorPrice,
  granmaCounter,
  granmaPrice,
  handleClick
}) => {
  return (
    <div className="items">
      <div className="items--cursor">
        Number of cursors: <span className="bold">{cursorCounter} </span>
        <br />
        price: <span className="bold green">{cursorPrice}</span> <br />
        <button className="buybtn" onClick={e => handleClick("cursor")}>
          Buy
        </button>
      </div>

      <div className="items--cursor">
        Number of Granmas: <span className="bold">{granmaCounter} </span>
        <br />
        price: <span className="bold green">{granmaPrice}</span> <br />
        <button className="buybtn" onClick={e => handleClick("granma")}>
          Buy
        </button>
      </div>
    </div>
  );
};

const ResetGame = ({ handleClick }) => {
  return (
    <div>
      <button className="btnReset" onClick={handleClick}>
        Reset game
      </button>
    </div>
  );
};

const Emoji = props => (
  <span
    className="emoji"
    role="img"
    aria-label={props.label ? props.label : ""}
    aria-hidden={props.label ? "false" : "true"}
  >
    {props.symbol}
  </span>
);

const Logo = () => <h1> Letter</h1>;

const ColorLetter = ({ letter, color }) => (
  <span style={{ color: `${color}` }}>{letter}</span>
);

const initialState = {
  cookie_counter: 0,
  cursor_counter: 0,
  cursor_price: 10,
  cursor_cps: 1,
  granma_counter: 0,
  granma_price: 100,
  granma_cps: 5,
  fps: 100
};

class App extends Component {
  state = initialState;

  componentDidMount() {
    this.loadStateWithLocalStorage();

    // add event listener to save state to localStorage
    // when user leaves/refreshes the page
    window.addEventListener(
      "beforeunload",
      this.saveStateToLocalStorage.bind(this)
    );
    setInterval(this.updateGameValues, this.state.fps);
  }

  componentWillUnmount() {
    window.removeEventListener(
      "beforeunload",
      this.saveStateToLocalStorage.bind(this)
    );

    // saves if component has a chance to unmount
    this.saveStateToLocalStorage();
  }

  loadStateWithLocalStorage() {
    // for all items in state
    for (let key in this.state) {
      // if the key exists in localStorage
      if (localStorage.hasOwnProperty(key)) {
        // get the key's value from localStorage
        let value = localStorage.getItem(key);

        // parse the localStorage string and setState
        try {
          value = JSON.parse(value);
          this.setState({ [key]: value });
        } catch (e) {
          // handle empty string
          this.setState({ [key]: value });
        }
      }
    }
  }

  saveStateToLocalStorage() {
    // for every item in React state
    for (let key in this.state) {
      // save to localStorage
      localStorage.setItem(key, JSON.stringify(this.state[key]));
    }
  }

  addCookie = () => {
    this.setState(prevState => {
      return { cookie_counter: prevState.cookie_counter + 1 };
    });
  };

  updateGameValues = () =>
    this.setState({
      cookie_counter:
        this.state.cookie_counter +
        this.state.cursor_cps *
          this.state.cursor_counter *
          (this.state.fps / 1000) +
        this.state.granma_cps *
          this.state.granma_counter *
          (this.state.fps / 1000)
    });

  handleResetClick = () => this.setState(initialState);

  handleClickItem(item) {
    if (
      item === "cursor" &&
      this.state.cookie_counter >= this.state.cursor_price
    ) {
      this.setState({
        cookie_counter: this.state.cookie_counter - this.state.cursor_price,
        cursor_counter: this.state.cursor_counter + 1,
        cursor_price: parseInt(this.state.cursor_price * (Math.random() + 1))
      });
    } else if (
      item === "granma" &&
      this.state.cookie_counter >= this.state.granma_price
    ) {
      this.setState({
        cookie_counter: this.state.cookie_counter - this.state.granma_price,
        granma_counter: this.state.granma_counter + 1,
        granma_price: parseInt(this.state.granma_price * (Math.random() + 1))
      });
    }
  }

  render() {
    const {
      cookie_counter,
      cursor_counter,
      cursor_price,
      granma_counter,
      granma_price
    } = this.state;
    return (
      <div className="App">
        <h1 className="logo">
          <ColorLetter color="#97C774" letter="C" />
          <ColorLetter color="#B63E98" letter="o" />
          <ColorLetter color="#B63E98" letter="o" />
          <ColorLetter color="#DB3E41" letter="k" />
          <ColorLetter color="#DB3E41" letter="i" />
          <ColorLetter color="#1BABA5" letter="e" /> Clicker
        </h1>
        <AddCookieButton
          cookies={parseInt(cookie_counter)}
          handelClick={this.addCookie}
        />
        <ItemStore
          cursorCounter={cursor_counter}
          cursorPrice={cursor_price}
          granmaCounter={granma_counter}
          granmaPrice={granma_price}
          handleClick={e => this.handleClickItem(e)}
        />
        <ResetGame handleClick={this.handleResetClick} />
      </div>
    );
  }
}

export default App;
