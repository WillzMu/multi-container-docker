import React , { Component } from 'react'
import axios from 'axios'

class Fib extends Component {
  state = {
    seenIndexes: [],
    values: {},
    index: ''
  }

  componentDidMount () {
    this.fetchValues()
    this.fetchIndexes()
  }

  async fetchValues () {
    const values = await axios.get('/api/values/current')
    this.setState({ values: values.data })
  }

  async fetchIndexes () {
    const seenIndexes = await axios.get('/api/values/all')
    this.setState({
      seenIndexes: seenIndexes.data
    })
  }

  renderSeenIndexes () {
    const seenIndexes = this.state.seenIndexes.map(item => item.number).join(', ')
    return seenIndexes
  }

  renderValues () {
    const entries = []

    for ( let key in this.state.values ) {
      entries.push(
        <div key={key}>
          For index {key} I calculated {this.state.values[key]}
        </div>
      )
    }

    return entries
  }

  handleSubmit = async (event) => {
    event.preventDefault()

    await axios.post('/api/values', {
      index: this.state.index
    })

    this.setState({ index: '' }, ()  => {
      this.fetchValues()
      this.fetchIndexes()
    })
  }

  render () {
    const { seenIndexes } = this.state
    return (
      <div>
        <form onSubmit={ this.handleSubmit } >
          <label htmlFor="">Enter your index: </label>
          <input
          type="text"
          value={this.state.index}
          onChange={event => this.setState({ index: event.target.value })}
          />
          <button>Submit</button>

          <h3>Indexes I have seen</h3>
            { seenIndexes.length > 1 ? this.renderSeenIndexes() : null }
          <h3>Calculated Values:</h3>
          {this.renderValues()}
        </form>
      </div>
    )
  }
}

export default Fib