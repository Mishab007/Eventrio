/* eslint-disable no-unused-vars */
import React from 'react'
import Sidebar from '../components/Sidebar'

function Home() {
  return (
    <>
    <form 
      // onSubmit={handleSubmit}
      >
        <div className=" bg-cover   h-screen  flex items-center justify-center ">
          <div className="sm:h-[525px] md:h-[600px] w-[350px] h-[450px] sm:w-[500px] md:w-[500px] shadow-2xl bg-slate-50 rounded-md flex flex-col justify-around items-center">
            <div>
              <h1 className="font-semibold text-3xl">
                <span className="font-semibold text-3xl text-cyan-800">
                  Sign
                </span>
                Up
              </h1>
              <p>Level up your buissness</p>
            </div>

            <input
              type="text"
              placeholder="User Name"
              // value={formData.username}
              name="username"
              className="sm:w-4/5 w-11/12 h-10 shadow-xl rounded-md pl-4 focus:outline-none"
              // onChange={ }
            />
            <div className="w-4/5">
            {/* {formData.errors.username && <p className="text-red-700 text-sm">{formData.errors.username}</p> } */}
            </div>
            <input
              type="text"
              placeholder="Gmail or Phone number"
              name="emailOrPhone"
              className="sm:w-4/5 w-11/12 h-10 shadow-xl rounded-md pl-4 outline-none"
              // onChange={handleChange}
            />
            <div className="w-4/5">
            {/* {formData.errors.emailOrPhone && <p className="text-red-700 text-sm">{formData.errors.emailOrPhone}</p> } */}
            </div>
            <input
              type="text"
              placeholder="Password"
              name="password"
              className="sm:w-4/5 w-11/12 h-10 shadow-xl rounded-md pl-4 outline-none"
              // onChange={handleChange}
            />
            <div className="w-4/5">
            {/* {formData.errors.password && <p className="text-red-700 text-sm">{formData.errors.password}</p> } */}
            </div>
            <input
              type="text"
              placeholder="Confirm Password"
              name="confirmPassword"
              className="sm:w-4/5 w-11/12 h-10 shadow-xl rounded-md pl-4 outline-none"
              // onChange={handleChange}
            />
             {/* <div className="w-4/5">

             {formData.errors.confirmPassword && <p className="text-red-700 text-sm">{formData.errors.confirmPassword}</p> }
             </div> */}
             {/* <p className=" text-red-500">{errMsg}</p> */}
            <button className="w-52 h-10 shadow-xl rounded-md  hover:bg-sky-700">
              Sign Up
            </button>
            <a href="/login">
              Have an account?{" "}
              <button
                type="submit"
                className="px-2 rounded-md hover:bg-slate-100"
              >
                Login
              </button>
            </a>
          </div>
        </div>
      </form>
    </>
  )
}

export default Home
