

function login() {
  return (
    <div>
      <div className=" bg-cover   h-screen  flex items-center justify-center ">
      <div className="h-[400px] w-[300px] sm:w-[400px] shadow-2xl bg-slate-50 rounded-md flex flex-col justify-around items-center">
        <div>
          <h1 className="font-semibold text-2xl sm:text-3xl"><span className="font-semibold text-2xl sm:text-3xl text-cyan-800">Sign</span>in</h1>
          <p>Level up your buissness</p>
        </div>
        <input
          type="text"
          placeholder="User Name, Gmail or Phone number"
          className="text-[13px] w-3/4 h-10 shadow-xl rounded-md pl-4 focus:outline-none"
        />
        <input
          type="text"
          placeholder="Password"
          className="text-[13px] w-3/4 h-10 shadow-xl rounded-md pl-4 outline-none"
        />
        <button className="w-52 h-10 shadow-xl rounded-md  hover:bg-sky-700">Sign In</button>
        <a href="/signup">Don,t have an account? <button className="px-2 rounded-md hover:bg-slate-100">SignUp</button></a>
      </div>
    </div>
    </div>
  )
}

export default login
