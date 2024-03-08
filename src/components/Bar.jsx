/* eslint-disable react/prop-types */
import { BsSearch } from "react-icons/bs";
import userImg from "../assets/userImage.png";
import { IoIosSettings, IoMdMail } from "react-icons/io";
import { FaBell } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Bar({ query, handleSearch }) {
	const navigate = useNavigate();
	const handleSearchClick = () => {
		navigate("/search");
	};

	return (
		<div className="bar">
			<div>
				<BsSearch />
				<input onClick={handleSearchClick} value={query} onChange={handleSearch} type="text" placeholder="Search Owners..." />
			</div>
			<article>
				{/* <i>
					<IoMdMail />
				</i> */}
				<i onClick={() => navigate("/settings")}>
					<IoIosSettings />
				</i>
				<i>
					<FaBell />
				</i>
				<img src={userImg} alt="user iamge" />
				<div>
					<h5>Marvin</h5>
					<p>sales</p>
				</div>
			</article>
		</div>
	);
}

export default Bar;
