import userImg from "../assets/userImage.png";
import { RxUpdate } from "react-icons/rx";
import Files from "react-files";
import AdminSidebar from "../components/AdminSidebar";
import Bar from "../components/Bar";
import { useState } from "react";
import { toast } from "react-toastify";

const Settings = () => {
	const [selectedSettings, setSelectedSettings] = useState("logo");

	return (
		<>
			<div className="admin-container">
				<AdminSidebar />
				<main className="settings">
					<Bar />
					<h2>Settings</h2>
					<section className="formUpdation">
						{selectedSettings === "logo" && <LogoUpdate />}
						{selectedSettings === "photo" && <AdminUpdate />}
						{selectedSettings === "gst" && <UpdateGst />}
					</section>
					<section className="updateContainer">
						<button onClick={() => setSelectedSettings("logo")}>
							Update Logo <RxUpdate />
						</button>
						<button onClick={() => setSelectedSettings("photo")}>
							Update Admin photo <RxUpdate />
						</button>
						<button onClick={() => setSelectedSettings("gst")}>
							Update GST VALUE
							<RxUpdate />
						</button>
					</section>
				</main>
			</div>
		</>
	);
};

export default Settings;

// eslint-disable-next-line no-unused-vars
const LogoUpdate = () => {
	const [photo, setPhoto] = useState("");

	const handlePhotoChange = (files) => {
		setPhoto(files[0].preview.url);
	};

	const handleError = (error) => {
		console.log("error code " + error.code + ": " + error.message);
	};

	return (
		<div className="logoUpdate">
			<img src={photo ? photo : userImg} alt="phot" />
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
	);
};
// eslint-disable-next-line no-unused-vars
const AdminUpdate = () => {
	const [photo, setPhoto] = useState("");

	const handlePhotoChange = (files) => {
		setPhoto(files[0].preview.url);
	};

	const handleError = (error) => {
		console.log("error code " + error.code + ": " + error.message);
	};

	return (
		<div className="logoUpdate">
			<img src={photo ? photo : userImg} alt="phot" />
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
				Upload Profile Photo
			</Files>
		</div>
	);
};
const UpdateGst = () => {
	const [gst, setGst] = useState(18);

	return (
		<div className="logoUpdate">
			<input type="text" placeholder="gst in %" value={gst} onChange={(e) => setGst(e.target.value)} />
			<button onClick={() => toast.success("GST Upda Successfullylly")}>Update GST</button>
		</div>
	);
};
