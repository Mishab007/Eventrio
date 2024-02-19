/* eslint-disable no-unused-vars */
import React, { useState } from "react";

function Signup() {
  const [errMsg, setErrMsg] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    emailOrPhone: "",
    password: "",
    confirmPassword: "",
    errors: {
      username: "",
      emailOrPhone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    console.log(name, value);

    let newErrors = { ...formData.errors };
    switch (name) {
      case "username":
        newErrors.username = value.trim() ? "" : "User name is required";
        break;
      case "emailOrPhone":
        newErrors.emailOrPhone = /^\d{10}$/.test(value)
          ? ""
          : "Invalid phone number or email";
        break;
      case "password":
        newErrors.password = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/.test(value)
          ? ""
          : "Password must contain at least one digit, one lowercase and one uppercase letter, and be at least 6 characters long";
        break;
      case "confirmPassword":
        newErrors.confirmPassword =
          value === formData.password ? "" : "Passwords do not match";
        break;
      default:
        break;
    }
    setFormData((prevstate) => ({
      ...prevstate,
      [name]: value,
      errors: newErrors,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Make a POST request to your backend API to signup the user
      const response = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json()

      if(responseData.message){
        setErrMsg(responseData.message)
        console.log(responseData.message)
      }
   
      // if (response.ok) {
      //   // Handle successful signup, e.g., redirect to a success page or display a success message
      //   console.log("User signed up successfully!");
      // } else {
      //   // Handle signup failure, e.g., display an error message
      //   console.error("Signup failed:", response.statusText);
      // }
    } catch (error) {
      console.error("Error during signup:", error);
      
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
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
              value={formData.username}
              name="username"
              className="sm:w-4/5 w-11/12 h-10 shadow-xl rounded-md pl-4 focus:outline-none"
              onChange={handleChange}
            />
            <div className="w-4/5">
            {formData.errors.username && <p className="text-red-700 text-sm">{formData.errors.username}</p> }
            </div>
            <input
              type="text"
              placeholder="Gmail or Phone number"
              name="emailOrPhone"
              className="sm:w-4/5 w-11/12 h-10 shadow-xl rounded-md pl-4 outline-none"
              onChange={handleChange}
            />
            <div className="w-4/5">
            {formData.errors.emailOrPhone && <p className="text-red-700 text-sm">{formData.errors.emailOrPhone}</p> }
            </div>
            <input
              type="text"
              placeholder="Password"
              name="password"
              className="sm:w-4/5 w-11/12 h-10 shadow-xl rounded-md pl-4 outline-none"
              onChange={handleChange}
            />
            <div className="w-4/5">
            {formData.errors.password && <p className="text-red-700 text-sm">{formData.errors.password}</p> }
            </div>
            <input
              type="text"
              placeholder="Confirm Password"
              name="confirmPassword"
              className="sm:w-4/5 w-11/12 h-10 shadow-xl rounded-md pl-4 outline-none"
              onChange={handleChange}
            />
             {/* <div className="w-4/5">

             {formData.errors.confirmPassword && <p className="text-red-700 text-sm">{formData.errors.confirmPassword}</p> }
             </div> */}
             <p className=" text-red-500">{errMsg}</p>
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
  );
}

export default Signup;
