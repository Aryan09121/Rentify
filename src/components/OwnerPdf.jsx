/* eslint-disable no-unused-vars */
// eslint-disable-next-line react/prop-types
/* eslint-disable react-hooks/exhaustive-deps */
import generatePDF, { usePDF, Resolution, Margin } from "react-to-pdf";
import AdminSidebar from "./AdminSidebar";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getGst, sendPdf } from "../redux/actions/setting.action";
import { IoLogoWhatsapp } from "react-icons/io5";
import { toast } from "react-toastify";

function formatDate(date) {
	// Ensure date is in the correct format
	if (!(date instanceof Date)) {
		date = new Date(date);
	}

	// Array of month names
	const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

	// Get components of the date
	const year = date.getFullYear();
	const month = date.getMonth();
	const day = date.getDate();

	// Format the date
	const formattedDate = `${day}, ${months[month]}, ${year}`;

	return formattedDate;
}

const option = {
	filename: "Invoice.pdf",
	method: "open",
	resolution: Resolution.MEDIUM,
	page: {
		margin: Margin.SMALL,
	},
};

const fixed = (n) => {
	return parseFloat(Number(n).toFixed(2));
};

function OwnerPdf() {
	const { targetRef } = usePDF();
	const [invoices, setInvoices] = useState([]);
	const [total, setTotal] = useState([]);
	const [owner, setOwner] = useState();
	const location = useLocation();
	const searchParams = new URLSearchParams(location.search);
	const { gst, error, message } = useSelector((state) => state.settings);
	const encodedOwner = searchParams.get("owner");
	const dispatch = useDispatch();

	const generate = () => {
		generatePDF(targetRef, option);
	};

	const generateAndSendPDF = (invoices, email) => {
		// console.log(invoices);
		dispatch(sendPdf(invoices, email));
	};

	const sendToEmail = () => {
		console.log(invoices);
		generateAndSendPDF(invoices, owner.email);
	};

	const sendToWhatsapp = () => {
		window.open("https://wa.me/917415721902?text=Your%20custom%20message%20here");
	};

	useEffect(() => {
		if (encodedOwner) {
			const decodedOwner = encodedOwner ? JSON.parse(decodeURIComponent(encodedOwner)) : null;
			setOwner(decodedOwner);
		}
	}, [encodedOwner]);

	useEffect(() => {
		if (owner) {
			// console.log(owner);
			const data = owner.bills.map((bill) => {
				// console.log(bill);
				// Calculate dayQty - offroad and then sum of all dayQty
				const totalDayQty = bill.invoices.reduce((total, current) => {
					return total + (current.days - current.offroad);
				}, 0);

				// Sum of all dayAmount
				const totalDayAmount = bill.invoices.reduce((total, current) => {
					return total + current.amount;
				}, 0);

				// Find the earliest and latest dates
				const fromDate = bill.invoices.reduce((earliest, current) => {
					return earliest < new Date(current.start) ? earliest : new Date(current.start);
				}, new Date(bill.invoices[0].start));

				const toDate = bill.invoices.reduce((latest, current) => {
					return latest > new Date(current.end) ? latest : new Date(current.end);
				}, new Date(bill.invoices[0].end));
				// Format the dates
				const formattedFromDate = formatDate(fromDate);
				const formattedToDate = formatDate(toDate);
				const distinctCarCount = new Set(bill.invoices.map((invoice) => invoice.car)).size;
				// console.log(distinctCarCount);
				return {
					model: bill?.model,
					count: distinctCarCount,
					periodFrom: formattedFromDate,
					periodTo: formattedToDate,
					totalDayQty: totalDayQty,
					totalDayAmount: totalDayAmount,
					length: length,
					_id: bill?._id,
				};
			});
			setInvoices(data);
		}
	}, [owner]);

	useEffect(() => {
		if (invoices.length > 0) {
			// Calculate the sum of totalDayAmount and totalKmAmount for each invoice
			const subtotals = invoices.reduce((acc, inv) => {
				return acc + inv.totalDayAmount;
			}, 0);

			const gstAmount = fixed(subtotals * gst) / 100;

			// Calculate GST (5%)
			// const gstAmount = totalAmount * (gst / 100);

			// Calculate the bill total
			const billTotal = subtotals + gstAmount;

			// Set the total state
			setTotal({
				subtotals: subtotals,
				gstAmount: gstAmount,
				billTotal: billTotal,
			});
		}
	}, [invoices, gst]);

	useEffect(() => {
		dispatch(getGst());
	}, []);

	useEffect(() => {
		if (error) {
			toast.error(error);
			dispatch({ type: "CLEAR_ERRORS" });
		}
		if (message) {
			toast.success(message);
			dispatch({ type: "CLEAR_MESSAGES" });
		}
	}, [message, error, dispatch]);

	return (
		<div className="admin-container">
			<AdminSidebar />
			<main className="pdfContainer">
				<div style={{ display: "flex", padding: "0 6rem" }}>
					<button className="downloadbtn" onClick={sendToEmail}>
						Email
					</button>
					<button className="downloadbtn" onClick={sendToWhatsapp}>
						<IoLogoWhatsapp />
					</button>
					<button className="downloadbtn" onClick={generate}>
						Download PDF
					</button>
				</div>
				<div className="pdf" ref={targetRef}>
					<header className="header"></header>
					<main className="pdfBody">
						<h2>Tax Invoice</h2>
						<div className="basicDetails">
							<div>
								<p>GST NO : {owner?.gst}</p>
								<p>HSN Services : {owner?.hsn}</p>
								<p>Pan Card No : {owner?.pan}</p>
							</div>
							{/* <div>
								<p>Invoice NO : </p>
								<p>Date : </p>
							</div> */}
						</div>
						<div className="inviceContainer">
							<div className="invoiceHeaders">
								<div>
									<h3>Bill to Address:</h3>
									<h5>{owner?.name}</h5>
									<h4>
										<span style={{ fontWeight: 600 }}>Address: </span>
										{owner?.address?.street +
											", " +
											owner?.address?.city +
											",\n" +
											owner?.address?.state +
											", India, " +
											owner?.address?.pincode}
									</h4>
								</div>
								<div>
									<p></p>
									<p>Vehicle Monthly Rental Basis PO No -</p>
								</div>
							</div>
							<div className="invoiceBody">
								{invoices?.map((invoice, idx) => {
									return (
										<div key={invoice.from + idx}>
											<div>
												<p>{idx + 1}</p>
												<article>
													Rental (Hiring Charges) - {invoice.model}
													<br />
													Description: Hiring Charges for {invoice.model} Vehicles on per day basis
													<br />
													Vehicle Count - {invoice.count} Nos
													<br />
													Period - {invoice.periodFrom} To {invoice.periodTo}
												</article>
											</div>
											<div style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
												<p>{invoice.totalDayQty}</p>
												<p>Days</p>
												{/* <p>{invoice.dayRate}</p> */}
												<p>{invoice.totalDayAmount.toFixed(2)}</p>
											</div>
										</div>
									);
								})}
							</div>
							<div className="invoiceFooter">
								<div>
									<p>Taxable Value (Rs): </p>
									{/* <p>2882549.64</p> */}
									<p>{Number(total?.subtotals).toFixed(2)}</p>
								</div>
								<div>
									<p>GST 5%: </p>
									{/* <p>144127.48</p> */}
									<p>{Number(total?.gstAmount).toFixed(2)}</p>
								</div>
								<div>
									<p>Total (Rs): </p>
									{/* <p>3026677.12</p> */}
									<p>{Number(total?.billTotal).toFixed(2)}</p>
								</div>
							</div>
						</div>
					</main>
					<footer className="footer"></footer>
				</div>
			</main>
		</div>
	);
}

export default OwnerPdf;
