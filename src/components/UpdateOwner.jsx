import AdminSidebar from "./AdminSidebar";
import Bar from "./Bar";
import userImg from "../assets/userImage.png";
import Files from "react-files";
import { useState } from "react";

const UpdateOwner = () => {
	const [photo, setPhoto] = useState("");

	const handlePhotoChange = (files) => {
		setPhoto(files[0].preview.url);
	};

	const handleError = (error) => {
		console.log("error code " + error.code + ": " + error.message);
	};
	return (
		<div className="admin-container">
			<AdminSidebar />
			<main className="updateOwner">
				<Bar />
				<div className="basicDetails">
					<div className="imgContainer">
						<img src={photo ? photo : userImg} alt="profile" />
						<Files
							className="files-dropzone"
							onChange={handlePhotoChange}
							onError={handleError}
							accepts={["image/*"]}
							multiple={false}
							maxFileSize={10000000}
							clickable
							minFileSize={0}
						>
							Upload Logo
						</Files>
					</div>
					<div className="details">
						<div>
							<input type="text" placeholder="Name" />
							<input type="email" placeholder="Email" />
						</div>
						<div>
							<input type="text" placeholder="Gender" />
							<input type="number" placeholder="Phone Number" />
						</div>
						<div>
							<textarea name="address" id="address" placeholder="Your Message here..."></textarea>
						</div>
					</div>
				</div>
				<div className="btnsUpdate">
					<button>Add Cars</button>
					<button>Update Details</button>
				</div>
			</main>
		</div>
	);
};

export default UpdateOwner;
