// eslint-disable-next-line react/prop-types
/* eslint-disable react-hooks/exhaustive-deps */
import generatePDF, { usePDF, Resolution, Margin } from "react-to-pdf";
import AdminSidebar from "./AdminSidebar";
import BillTableHOC from "./BillTableHOC";
import { useCallback, useEffect, useState } from "react";
import { invoice as invoicedata } from "../assets/data/bill";
import { useLocation, useParams } from "react-router-dom";

const option = {
	filename: "Invoice.pdf",
	method: "save",
	resolution: Resolution.MEDIUM,
	page: {
		margin: Margin.MEDIUM,
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

const findInvoiceByBillId = (billId) => {
	for (const invoiceObj of invoicedata) {
		const bill = invoiceObj.bills.find((bill) => bill._id === billId);
		if (bill) {
			return invoiceObj;
		}
	}
	return null;
};

const gst = 18;

function BillPdf() {
	const { targetRef } = usePDF();
	const location = useLocation();
	const [owner, setOwner] = useState({});
	const [bills, setBills] = useState([]);
	const [invoice, setInvoice] = useState({});
	const { id } = useParams();
	const billType = location.state && location.state.billType;

	const generate = () => {
		generatePDF(targetRef, option);
	};

	const Table = useCallback(BillTableHOC(columns, bills, "dashboard-product-box", "Bill Details", false));

	useEffect(() => {
		if (billType !== "individual") {
			const invoice = invoicedata.find((invoice) => invoice._id === id);
			const billsdata = invoice.bills.map((bill) => ({
				item: bill.description,
				days: bill.days,
				rate: bill.rate,
				amount: bill.amount,
			}));
			const inv = {
				_id: invoice._id,
				invoiceno: invoice._id,
				amount: invoice.amount,
				issuedate: invoice.issuedate,
				status: invoice.status,
				gstinno: invoice.gstin,
			};
			setInvoice(inv);
			setOwner(invoice.owner);
			setBills(billsdata);
		} else {
			const invoice = findInvoiceByBillId(id);
			const bill = invoice.bills.find((bill) => bill._id === id);
			setOwner(invoice.owner);
			setBills([
				{
					item: bill.description,
					days: bill.days,
					rate: bill.rate,
					amount: bill.amount,
				},
			]);
			setInvoice({
				_id: invoice._id,
				invoiceno: invoice._id,
				amount: bill.amount,
				issuedate: invoice.issuedate,
				status: invoice.status,
				gstinno: invoice.gstin,
			});
		}
	}, []);

	return (
		<div className="admin-container">
			<AdminSidebar />
			<main className="pdfContainer">
				<button className="downloadbtn" onClick={generate}>
					Download PDF
				</button>
				<div className="pdf" ref={targetRef}>
					<header>
						<div className="companyDetails">
							<img src="/public/travels.png" alt="company logo" />
							<div className="details">
								<h3 className="regular">CRM Dashboard</h3>
								<h4 className="regular">Street Address, City, Country</h4>
								<h4 className="regular">462042</h4>
							</div>
						</div>
						<div className="invoiceDetails">
							<h3 className="regular">
								Invoice# <span>{invoice.invoiceno}</span>
							</h3>
							<h3 className="regular">Issue Date</h3>
							<h3 className="regular">{invoice.issuedate}</h3>
						</div>
					</header>
					<main>
						<h2>INVOICE DETAILS</h2>
						<h3 className="gstin">
							GSTIN# <span>{invoice.gstinno}</span>
						</h3>
						<p className="regular">
							Here are your invoice details. Thank you for choosing our vehicle tracking system for your rental cars.
						</p>
						<div className="ownerDetails">
							<h2>Bill To:</h2>
							<div className="details">
								<h3>
									Name: <span>{owner.name}</span>
								</h3>
								<h3>
									Email: <span>{owner.email}</span>
								</h3>
								<h3>
									Phone Number: <span>{owner.phone}</span>
								</h3>
								<h3>
									Address: <span>{owner.address}</span>
								</h3>
							</div>
						</div>
						<div className="bills">{Table()}</div>
						<div className="billTotal">
							<h2>Bill Total</h2>
							<div className="subtotal">
								<h3>Sub total</h3>
								<h5>₹ {bills.reduce((total, bill) => total + parseFloat(bill.amount), 0)}</h5>
							</div>
							<div className="gst">
								<h3>GST</h3>
								<h5>₹ {parseFloat(bills.reduce((total, bill) => total + parseFloat(bill.amount), 0) * (gst / 100)).toFixed(2)}</h5>
							</div>
							<div className="total">
								<h3>Total Amount</h3>
								<h5>
									₹
									{(
										parseFloat(bills.reduce((total, bill) => total + parseFloat(bill.amount), 0)) * (gst / 100) +
										parseFloat(bills.reduce((total, bill) => total + parseFloat(bill.amount), 0))
									).toFixed(2)}
								</h5>
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
