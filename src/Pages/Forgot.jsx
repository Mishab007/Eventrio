


/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import AccountFinder from '../components/AccountFinder';
import Otp from '../components/Otp';
import PassUpdate from '../components/PassUpdate';

function Forgot() {
  const[verify,setVerify] = useState(false)
  const[otp,setOtp] = useState(false)
  return (
    <div>
        
        {!verify? <AccountFinder/>:<Otp/>}
            
      <PassUpdate/>
    </div>
  )
}

export default Forgot;

