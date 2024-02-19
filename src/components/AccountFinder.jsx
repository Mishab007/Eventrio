/* eslint-disable no-unused-vars */
import React from 'react'

function AccountFinder() {
  return (
    <div>
     <>
      <form 
      // onSubmit={handleSubmit}
      >
        <div className=" bg-cover   h-screen  flex items-center justify-center ">
          <div className="sm:h-[525px] md:h-[250px] w-[350px] h-[250px] sm:w-[500px] md:w-[500px] shadow-2xl bg-slate-50 rounded-md flex flex-col justify-around items-center">
            <div>
              <h1 className="font-semibold text-3xl">
                <span className="font-semibold text-3xl text-cyan-800">Find Your </span>Account</h1>
            </div>
            <input
              type="text"
              placeholder="Username, Gmail or Phone number"
              name="emailOrPhone"
              className="sm:w-4/5 w-11/12 h-10 shadow-xl rounded-md pl-4 outline-none"
              // onChange={handleChange}
            />
            <div className="w-4/5">
            {/* {formData.errors.emailOrPhone && <p className="text-red-700 text-sm">{formData.errors.emailOrPhone}</p> } */}
            </div>
            <button className="w-52 h-10 shadow-xl rounded-md  hover:bg-sky-700">
              Verify
            </button>
            <a href="/login">
              Remember Password
            </a>
          </div>
        </div>
      </form>
    </>
    </div>
  )
}

export default AccountFinder
