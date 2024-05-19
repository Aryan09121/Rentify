/* eslint-disable react-hooks/exhaustive-deps */
import logo from "../assets/logo.png";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userLogin } from "../redux/actions";

function SignUp() {
	const navigate = useNavigate();
	const [loginDetails, setLoginDetails] = useState({
		username: "",
		password: "",
	});
	const { error, message, loading, user, isAuthenticated } = useSelector((state) => state.user);

	const dispatch = useDispatch();

	const onChangeHandler = (e) => {
		const name = e.target.name;
		const value = e.target.value;
		setLoginDetails({ ...loginDetails, [name]: value });
	};

	const loginSubmitHandler = (e) => {
		e.preventDefault();
		dispatch(userLogin(loginDetails));
	};

	useEffect(() => {
		if (message) {
			toast.success(message);
			dispatch({ type: "CLEAR_MESSAGES" });
		}
		if (error) {
			toast.error(error);
			dispatch({ type: "CLEAR_ERRORS" });
		}
	}, [message, error, user]);

	useEffect(() => {
		if (isAuthenticated) {
			navigate("/dashboard");
		}
	}, [isAuthenticated]);

	return (
		<div className="signup">
			<main className="login-main">
				<section>
					<form onSubmit={loginSubmitHandler}>
						<img src={logo} alt="logo" />
						<h2>Log In</h2>
						<p>Please Enter your details</p>
						<input
							value={loginDetails.username}
							onChange={onChangeHandler}
							name="username"
							type="text"
							placeholder="Email or Phone Number ..."
						/>
						<input onChange={onChangeHandler} value={loginDetails.password} name="password" type="password" placeholder="password" />
						<button className="submitBtn" type="submit">
							{loading ? "Loading..." : "Log In"}
						</button>
					</form>
				</section>
			</main>
		</div>
	);
}

export default SignUp;
