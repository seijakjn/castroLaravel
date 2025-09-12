import React from 'react'

export default function About() {
  return (
    <div>
        <h1>About Page</h1>
    </div>
  )
}

if (document.getElementById('about')) {
    ReactDOM.render(<About />, document.getElementById('about'));
}
