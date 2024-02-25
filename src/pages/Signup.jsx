import travelsImg from "../assets/travels.png";
import signupImg from "../assets/signup.png";
import { FaGoogle, FaFacebookF } from "react-icons/fa";
import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function SignUp() {
	const navigate = useNavigate();
	const [isLoginPage, setIsLoginPage] = useState(true);
	const [loginDetails, setLoginDetails] = useState({
		username: "",
		password: "",
	});
	const [signupDetails, setSignupDetails] = useState({
		username: "",
		password: "",
		phone: "",
	});

	const onChangeHandler = (e) => {
		const name = e.target.name;
		const value = e.target.value;
		if (isLoginPage) {
			setLoginDetails({ ...loginDetails, [name]: value });
		} else {
			setSignupDetails({ ...loginDetails, [name]: value });
		}
	};

	const loginSubmitHandler = (e) => {
		e.preventDefault();
		toast.success("Logged In Success");
		navigate("/dashboard", { replace: true });
	};
	const signupSubmitHandler = (e) => {
		e.preventDefault();
	};

	return (
		<div className="signup">
			<nav className="login-nav">
				<img src={travelsImg} alt="travels image" />
				<button>Sign Up</button>
			</nav>
			<main className="login-main">
				<section>
					<img src={signupImg} alt="sign up image" />
					<form onSubmit={isLoginPage ? loginSubmitHandler : signupSubmitHandler}>
						<h2>{isLoginPage ? "Log In" : "Sign Up"}</h2>
						<p>Please Enter your details</p>
						<input
							value={isLoginPage ? loginDetails.username : signupDetails.username}
							onChange={onChangeHandler}
							name="username"
							type="text"
							placeholder="Email or Phone Number ..."
						/>
						{isLoginPage ? null : (
							<input onChange={onChangeHandler} value={signupDetails.phone} name="phone" type="text" placeholder="Phone Number" />
						)}
						<input
							onChange={onChangeHandler}
							value={isLoginPage ? loginDetails.password : signupDetails.password}
							name="password"
							type="password"
							placeholder="password"
						/>
						<button className="submitBtn" type="submit">
							{isLoginPage ? "Log In" : "Sign Up"}
						</button>
						<aside>OR</aside>
						<div>
							<button>
								<FaGoogle />
								{isLoginPage ? "Log In" : "Sign Up"} with Google
							</button>
							<button>
								<FaFacebookF />
								{isLoginPage ? "Log In" : "Sign Up"} with Facebook
							</button>
						</div>
						<p className="account">
							{isLoginPage ? "Don't" : "Already"} have an Account?{" "}
							<span onClick={() => setIsLoginPage((curr) => !curr)}>{isLoginPage ? "Sign Up" : "Log In"}</span>
						</p>
					</form>
				</section>
			</main>
		</div>
	);
}

export default SignUp;
