/* eslint-disable no-unused-vars */
import React from 'react'

function Otp() {
  return (
    <div className="flex sm:flex-row flex-col gap-2 sm:gap-6 justify-around  items-center">
            <div className="flex gap-1">
              {[...Array(6)].map((_, index) => (
                <input
                  key={index}
                  type="text"
                  placeholder="0"
                  className="w-8 h-10 shadow-xl rounded-md pl-3 outline-none"
                />
              ))}
            </div>
            <div>
              <button className="bg-slate-100 hover:bg-sky-700 shadow-xl p-2 rounded-lg">
                Sent Otp
              </button>
            </div>
          </div>
  )
}

export default Otp
