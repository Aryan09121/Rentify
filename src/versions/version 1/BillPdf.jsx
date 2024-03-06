/* eslint-disable react-hooks/exhaustive-deps */
import generatePDF, { usePDF, Resolution, Margin } from "react-to-pdf";
import AdminSidebar from "./AdminSidebar";
import BillTableHOC from "./BillTableHOC";
import { useCallback, useEffect, useState } from "react";
import { invoice as invoicedata } from "../assets/data/bill";
import { useParams } from "react-router-dom";

const option = {
	method: "open",
	resolution: Resolution.MEDIUM,
	page: {
		// margin is in MM, default is Margin.NONE = 0
		margin: Margin.MEDIUM,
		// default is 'A4'
		// format: "letter",
		// default is 'portrait'
		orientation: "portrait",
	},
};

const columns = [
	{
		Header: "Item",
		accessor: "item",
	},
	{
		Header: "Days",
		accessor: "days",
	},
	{
		Header: "Rate",
		accessor: "rate",
	},
	{
		Header: "Amount",
		accessor: "amount",
	},
];

function BillPdf() {
	const { targetRef } = usePDF();
	const [owner, setOwner] = useState([]);
	const [bills, setBills] = useState([{}]);
	const { id } = useParams();

	const generate = () => {
		console.log(bills.length);
		console.log(owner);
		generatePDF(targetRef, option);
	};

	const Table = useCallback(BillTableHOC(columns, bills, "dashboard-product-box", "Bill Details", false, bills.length));

	useEffect(() => {
		const invoice = invoicedata.filter((invoice) => invoice._id === id);
		console.log(invoice[0].bills);
		const billsdata = invoice[0].bills.map((bill) => {
			return {
				item: bill.description,
				days: bill.days,
				rate: bill.rate,
				amount: 5600,
			};
		});
		console.log(billsdata.length);
		setOwner(invoice[0].owner);
		setBills(billsdata);
	}, []);

	return (
		<div className="admin-container">
			<AdminSidebar />
			<main className="pdfContainer">
				<button className="downloadbtn" onClick={() => generate()}>
					Download PDF
				</button>
				<div className="pdf" ref={targetRef}>
					<header>
						<div className="companyDetails">
							<img src="/public/travels.png" alt="company logo" />
							<div className="details">
								<h3 className="regular">CRM Dashboard</h3>
								<h4 className="regular">Street Address, City, Country</h4>
								<h4 className="regular">Zip Code</h4>
							</div>
						</div>
						<div className="invoiceDetails">
							<h3 className="regular">
								Invoice# <span>432233</span>
							</h3>
							<h3 className="regular">Issue Date</h3>
							<h3 className="regular">MM/DD/YYYY</h3>
						</div>
					</header>
					<main>
						<h2>INVOICE DETAILS</h2>
						<h3 className="gstin">
							GSTIN# <span>GSTIN656554</span>
						</h3>
						<p className="regular">
							Here are your invoice details. Thank you for choosing our vehicle tracking system for your rental cars.
						</p>
						<div className="ownerDetails">
							<h2>Bill To:</h2>
							<div className="details">
								<h3>
									Name: <span>Rakesh Gupta</span>
								</h3>
								<h3>
									Email: <span>sample@gmail.com</span>
								</h3>
								<h3>
									Phone Number: <span>7415721902</span>
								</h3>
								<h3>
									Address: <span>24 G-6 Apartment 3, Roshanpura, Bhopal, Madhya Pradesh, 462042</span>
								</h3>
							</div>
						</div>
						<div className="bills">{Table()}</div>
						<div className="billTotal">
							<h2>Bill Total</h2>
							<div className="subtotal">
								<h3>Sub total</h3>
								<h5>₹ 4900</h5>
							</div>
							<div className="gst">
								<h3>GST</h3>
								<h5>₹ 9009</h5>
							</div>
							<div className="total">
								<h3>Total Amount</h3>
								<h5>₹ 490000</h5>
							</div>
						</div>
					</main>
					<footer className="footer">©️ Copyright &nbsp; Reserved with</footer>
				</div>
			</main>
		</div>
	);
}

export default BillPdf;
