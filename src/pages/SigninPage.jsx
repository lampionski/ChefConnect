import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SigninPage.module.css";

const SigninPage = () => {
  const [isLogin, setIsLogin] = useState(false); // Toggle between sign-in and sign-up
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Handle Sign-Up
  const handleSignUp = async (e) => {
    e.preventDefault();
    if (password !== repeatPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullname: name, email, password }),
      });
      console.log(response)

      const result = await response.json();
      if (response.status === 201) {
        setIsLogin(true); // Redirect to login form after successful sign-up
      } else {
        setError(result.error || 'Sign-up failed');
      }
    } catch (err) {
      setError("Server error: " + err.message);
    }
  };

  // Handle Sign-In
  const handleSignIn = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (response.status === 200) {
        navigate("/")
        // Redirect based on role
      }
    } catch (err) {
      setError("Server error: " + err.message);
    }
  };

  return (
    <div className="signin-container">
      {!isLogin && (
        <form onSubmit={handleSignUp}>
          <h2>Sign Up</h2>
          {error && <p className="error">{error}</p>}
          <div className="input-box">
            <label>Username</label>
            <input
              className="field"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your username"
            />
          </div>
          <div className="input-box">
            <label>Email</label>
            <input
              className="field"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>
          <div className="input-box">
            <label>Password</label>
            <input
              className="field"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>
          <div className="input-box">
            <label>Repeat Password</label>
            <input
              className="field"
              type="password"
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
              placeholder="Repeat your password"
            />
          </div>
          <button className="signin-button" type="submit">
            Sign Up
          </button>
          <p>
            Already have an account?{" "}
            <button onClick={() => setIsLogin(true)} className="toggle-link">
              Log in here
            </button>
          </p>
        </form>
      )}

      {isLogin && (
        <form onSubmit={handleSignIn}>
          <h2>Sign In</h2>
          {error && <p className="error">{error}</p>}
          <div className="input-box">
            <label>Email</label>
            <input
              className="field"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>
          <div className="input-box">
            <label>Password</label>
            <input
              className="field"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>
          <button className="signin-button" type="submit">
            Sign In
          </button>
          <p>
            Don't have an account?{" "}
            <button onClick={() => setIsLogin(false)} className="toggle-link">
              Sign up here
            </button>
          </p>
        </form>
      )}
    </div>
  );
};

export default SigninPage;




// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom"; // For navigation
// import { FaGoogle, FaApple } from "react-icons/fa";
// import "./SigninPage.module.css";

// const SigninPage = () => {
//   // State hooks for form data
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [repeatPassword, setRepeatPassword] = useState("");
//   const [error, setError] = useState("");
//   const [isLogin, setIsLogin] = useState(false); // State to toggle between sign in and sign up
//   const navigate = useNavigate(); // For navigating between routes

//   // Handle form submit for sign up
//   const handleSignUp = async (e) => {
//     e.preventDefault();

//     // Check if passwords match
//     if (password !== repeatPassword) {
//       setError("Passwords do not match");
//       return;
//     }

//     try {
//       const response = await fetch("http://localhost:12345/api/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ name, email, password }),
//       });

//       const result = await response.json();

//       if (response.status === 201) {
//         console.log("User registered:", result);
//         setIsLogin(true); // After registration, show the login form
//       } else {
//         setError(result.error || "Something went wrong");
//       }
//     } catch (err) {
//       setError("Server error: " + err.message);
//     }
//   };

//   // Handle form submit for sign in
//   const handleSignIn = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await fetch("http://localhost:12345/api/signin", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//       });

//       const result = await response.json();

//       if (response.status === 200) {
//         // Redirect based on role
//         if (result.user.role === "admin") {
//           navigate("/admin-dashboard"); // Admin redirected to the dashboard
//         } else {
//           navigate("/home"); // Regular user redirected to the home page
//         }
//       } else {
//         setError(result.error || "Invalid credentials");
//       }
//     } catch (err) {
//       setError("Server error: " + err.message);
//     }
//   };

//   return (
//     <div className="signin-container">
//       {/* Sign-Up Form */}
//       {!isLogin && (
//         <form onSubmit={handleSignUp}>
//           <h2>Sign Up</h2>
//           {error && <p className="error">{error}</p>}
//           <div className="input-box">
//             <label>Username</label>
//             <input
//               className="field"
//               type="text"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               placeholder="Enter your username"
//             />
//           </div>
//           <div className="input-box">
//             <label>Email</label>
//             <input
//               className="field"
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="Enter your email"
//             />
//           </div>
//           <div className="input-box">
//             <label>Password</label>
//             <input
//               className="field"
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="Enter your password"
//             />
//           </div>
//           <div className="input-box">
//             <label>Repeat Password</label>
//             <input
//               className="field"
//               type="password"
//               value={repeatPassword}
//               onChange={(e) => setRepeatPassword(e.target.value)}
//               placeholder="Repeat your password"
//             />
//           </div>
//           <button className="signin-button" type="submit">
//             Sign Up
//           </button>

//           <div className="login-redirect">
//             <p>
//               Already have an account?{" "}
//               <button onClick={() => setIsLogin(true)} className="login-link">
//                 Click here to log in
//               </button>
//             </p>
//           </div>
//         </form>
//       )}

//       {/* Sign-In Form */}
//       {isLogin && (
//         <form onSubmit={handleSignIn}>
//           <h2>Sign In</h2>
//           {error && <p className="error">{error}</p>}
//           <div className="input-box">
//             <label>Email</label>
//             <input
//               className="field"
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="Enter your email"
//             />
//           </div>
//           <div className="input-box">
//             <label>Password</label>
//             <input
//               className="field"
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="Enter your password"
//             />
//           </div>
//           <button className="signin-button" type="submit">
//             Sign In
//           </button>

//           <div className="login-redirect">
//             <p>
//               Don't have an account?{" "}
//               <button onClick={() => setIsLogin(false)} className="login-link">
//                 Click here to sign up
//               </button>
//             </p>
//           </div>
//         </form>
//       )}
//     </div>
//   );
// };

// export default SigninPage;
