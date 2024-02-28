/* eslint-disable react/prop-types */
import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";

function NewInvoice({ isOpen, setIsOpen }) {
	const [invoice, setInvoice] = useState({
		name: "",
		email: "",
		amount: 0,
	});

	const addNewInvoiceSubmitHandler = (e) => {
		e.preventDefault();
		toast.success(`Invoice Addes ✔️`);
		setInvoice({
			name: "",
			email: "",
			amount: 0,
		});
	};

	const onInputChangeHandler = (e) => {
		const name = e.target.name;
		const value = e.target.value;

		setInvoice((curr) => {
			return {
				...curr,
				[name]: value,
			};
		});
	};

	return (
		<dialog className="newInvoiceDropdown" open={isOpen}>
			<div>
				<IoClose onClick={() => setIsOpen(false)} />
				<h2>Add New Invoice</h2>
				<form onSubmit={addNewInvoiceSubmitHandler}>
					<div>
						<label htmlFor="username">Owner Name:</label>
						<input
							value={invoice.name}
							onChange={onInputChangeHandler}
							type="text"
							name="name"
							id="username"
							placeholder="Vehicle Owner Name"
						/>
					</div>
					<div>
						<label htmlFor="email">Email Id:</label>
						<input value={invoice.email} onChange={onInputChangeHandler} type="email" name="email" id="email" placeholder="Email" />
					</div>
					<div>
						<label htmlFor="amount">Invoice Amount:</label>
						<input
							value={invoice.amount}
							onChange={onInputChangeHandler}
							type="number"
							name="amount"
							id="amount"
							placeholder="Invoice Amount"
						/>
					</div>
					<button type="submit">Add Invoice</button>
				</form>
			</div>
		</dialog>
	);
}

export default NewInvoice;
