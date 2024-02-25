import { BsSearch } from "react-icons/bs";
import userImg from "../assets/userImage.png";
import { IoIosSettings, IoMdMail } from "react-icons/io";
import { FaBell } from "react-icons/fa";

function Bar() {
	return (
		<div className="bar">
			<div>
				<BsSearch />
				<input type="text" placeholder="Search..." />
			</div>
			<article>
				<i>
					<IoMdMail />
				</i>
				<i>
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
