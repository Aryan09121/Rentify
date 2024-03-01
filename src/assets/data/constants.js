const CUSTOME_STYLES = {
	control: (provided) => ({
		...provided,
		padding: "0.3rem 0.6rem",
		cursor: "pointer",
		backgroundColor: "#fff",
		"&:hover, &:focus": {
			backgroundColor: "#029e9d",
			padding: "0.3rem 0.6rem",
			color: "#fcfcfc",
		},
	}),
	singleValue: (provided) => ({
		...provided,
		padding: "0.3rem 0.6rem",
		marginRight: "1rem",
		borderRadius: "5px",
		"&:hover, &:focus": {
			padding: "0.3rem 0.6rem",
			color: "#fcfcfc",
		},
	}),
	dropdownIndicator: (provided) => ({
		...provided,
		color: "#000",
		"&:hover, &:focus": {
			color: "#fcfcfc",
		},
	}),
};

export { CUSTOME_STYLES };
