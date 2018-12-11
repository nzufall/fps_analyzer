import React, { Component } from "react";
import axios from "axios";

import DropdownSelector from "./DropdownSelector";

class App extends Component {
  constructor(props) {
    super(props);

    // Setup Empty State with nothing selected
    this.state = {
      selectedAct: "",
      selectedWorld: "",
      availableActs: [],
      availableWorlds: [],
      currentFPS: 0
    };

    // Setup all custom functionality to reference this object
    this.renderActs = this.renderActs.bind(this);
    this.renderWorlds = this.renderWorlds.bind(this);
    this.handleActSelect = this.handleActSelect.bind(this);
    this.handleWorldSelect = this.handleWorldSelect.bind(this);
    this.getFPS = this.getFPS.bind(this);
  }

  componentWillMount() {
    // Populate Acts list before loading
    axios.get("http://localhost:3000/acts").then(response => {
      this.setState({ availableActs: response.data.acts });
      this.renderActs();
    });
  }

  handleActSelect(e) {
    // Update page state to be desired act then update Worlds dropdown
    this.setState({ selectedAct: e.target.value }, () => {
      if (this.state.selectedAct === "") {
        this.setState({ availableWorlds: [] });
      } else {
        axios
          .get(`http://localhost:3000/acts/${this.state.selectedAct}`)
          .then(response => {
            this.setState({ availableWorlds: response.data.worlds }, () => {
              this.renderWorlds();
            });
          });
      }
    });
  }

  handleWorldSelect(e) {
    this.setState({ selectedWorld: e.target.value });
  }

  getFPS() {
    // Request the appropriate endpoint for data based on selected act and world, if none are selected get all data
    if (this.state.selectedAct !== "") {
      if (this.state.selectedWorld !== "") {
        axios
          .get(
            `http://localhost:3000/acts/${this.state.selectedAct}/worlds/${this
              .state.selectedWorld}/fps`
          )
          .then(response => {
            this.setState({ currentFPS: response.data.averageFPS });
          });
      } else {
        axios
          .get(`http://localhost:3000/acts/${this.state.selectedAct}/fps`)
          .then(response => {
            this.setState({ currentFPS: response.data.averageFPS });
          });
      }
    } else {
      axios.get("http://localhost:3000/fps").then(response => {
        this.setState({ currentFPS: response.data.averageFPS });
      });
    }
  }

  renderWorlds() {
    if (this.state.availableWorlds.length > 0) {
      return this.state.availableWorlds.map(world => {
        return (
          <option key={world} value={world}>
            {world}
          </option>
        );
      });
    } else {
      return;
    }
  }

  renderActs() {
    if (this.state.availableActs.length > 0) {
      return this.state.availableActs.map(act => {
        return (
          <option key={act} value={act}>
            {act}
          </option>
        );
      });
    } else {
      return;
    }
  }

  render() {
    return (
      <div>
        <span>Act: </span>
        <DropdownSelector
          id="acts"
          value={this.state.selectedAct}
          onChange={this.handleActSelect}
        >
          <option value="">All</option>
          {this.renderActs()}
        </DropdownSelector>

        <span> World: </span>
        <DropdownSelector
          id="worlds"
          value={this.state.selectedWorld}
          onChange={this.handleWorldSelect}
        >
          <option value="">All</option>
          {this.renderWorlds()}
        </DropdownSelector>

        <span> </span>
        <button onClick={this.getFPS}>Get FPS</button>
        <br />
        <p>FPS: {this.state.currentFPS}</p>
      </div>
    );
  }
}

export default App;
