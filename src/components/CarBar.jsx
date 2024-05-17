/* eslint-disable react/prop-types */
import { BsSearch } from "react-icons/bs";
import userImg from "../assets/userImage.png";
import { IoIosSettings } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { IoLogOut } from "react-icons/io5";
import { logoutUser } from "../redux/actions";

function Bar({ query, handleSearch }) {
	const { user } = useSelector((state) => state.user);
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const logoutHandler = () => {
		dispatch(logoutUser());
		navigate("/");
	};

	return (
		<div className="bar">
			<div>
				<BsSearch />
				<input value={query} onChange={handleSearch} type="text" placeholder="Search Owners..." />
			</div>
			<article>
				<i onClick={() => navigate("/settings")}>
					<IoIosSettings />
				</i>
				<i onClick={logoutHandler}>
					<IoLogOut style={{ color: "red" }} />
				</i>
				<img src={userImg} alt="user iamge" />
				<div>
					<h5>Perfect Travels</h5>
					<p>Admin</p>
				</div>
			</article>
		</div>
	);
}

export default Bar;
