import React from 'react'
import MessageContainer from './MessageContainer'
import Sidebear from './Sidebear'

function Homepage() {
  return (
    <div className='flex rounded-lg sm:h-[450px] md:h-[550px] overflow-hidden bg-gray-00 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border border-gray-200'>
     <Sidebear/>
      <MessageContainer/>
    </div>
  )
}

export default Homepage
