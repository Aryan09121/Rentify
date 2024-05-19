/* eslint-disable no-unused-vars */
// eslint-disable-next-line react/prop-types
/* eslint-disable react-hooks/exhaustive-deps */
import generatePDF, { usePDF, Resolution, Margin } from "react-to-pdf";
import AdminSidebar from "./AdminSidebar";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

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

const gst = 5;

function BillPdf() {
	const { targetRef } = usePDF();
	const [invoices, setInvoices] = useState([]);
	const [invdata, setInvdata] = useState([]);
	const [total, setTotal] = useState([]);
	const [company, setCompany] = useState();
	const location = useLocation();
	const searchParams = new URLSearchParams(location.search);
	const encodedInvoices = searchParams.get("invoices");
	const encodedOwner = searchParams.get("owner");
	const invId = JSON.parse(searchParams.get("invId"));
	const date = JSON.parse(searchParams.get("date"));
	const navigate = useNavigate();

	const generate = () => {
		generatePDF(targetRef, option);
	};

	const seeAnexure = () => {
		// console.log(company._id);
		navigate(`/charges?id=${company._id}`);
	};

	useEffect(() => {
		// Decode the encoded invoices and parse them back to an array
		if (encodedInvoices.length > 0) {
			const decodedInvoices = encodedInvoices ? JSON.parse(decodeURIComponent(encodedInvoices)) : [];
			console.log(decodedInvoices);
			setInvdata(decodedInvoices);
		}
		if (encodedOwner) {
			const decodedOwner = encodedOwner ? JSON.parse(decodeURIComponent(encodedOwner)) : null;
			setCompany(decodedOwner);
		}
	}, [encodedInvoices, encodedOwner]);

	useEffect(() => {
		if (invdata.length > 0) {
			const length = invdata?.length;

			const data = invdata.map((inv) => {
				// console.log(inv);
				// Calculate dayQty - offroad and then sum of all dayQty
				const totalDayQty = inv.invoice.reduce((total, current) => {
					return total + (current.dayQty - current.offroad);
				}, 0);

				// Sum of all kmQty
				const totalKmQty = inv.invoice.reduce((total, current) => {
					return total + current.kmQty;
				}, 0);

				// Sum of all dayAmount
				const totalDayAmount = inv.invoice.reduce((total, current) => {
					return total + current.dayAmount;
				}, 0);

				// Sum of all kmAmount
				const totalKmAmount = inv.invoice.reduce((total, current) => {
					return total + current.kmAmount;
				}, 0);

				// Find the earliest and latest dates
				const fromDate = inv.invoice.reduce((earliest, current) => {
					return earliest < new Date(current.from) ? earliest : new Date(current.from);
				}, new Date(inv.invoice[0].from));

				const toDate = inv.invoice.reduce((latest, current) => {
					return latest > new Date(current.to) ? latest : new Date(current.to);
				}, new Date(inv.invoice[0].to));

				// Format the dates
				const formattedFromDate = formatDate(fromDate);
				const formattedToDate = formatDate(toDate);

				const vehicleCount = inv?.invoice?.reduce((acc, inv) => {
					console.log(inv);
					if (!acc.includes(inv.car)) {
						// If it doesn't exist, add it to the accumulator
						acc.push(inv.car);
					}
					return acc;
				}, []).length;

				return {
					model: inv?.model,
					count: vehicleCount,
					periodFrom: formattedFromDate,
					periodTo: formattedToDate,
					totalDayQty: totalDayQty,
					totalKmQty: totalKmQty,
					totalDayAmount: totalDayAmount,
					totalKmAmount: totalKmAmount,
					dayRate: inv?.invoice[0].dayRate,
					kmRate: inv?.invoice[0].kmRate,
					length: length,
					_id: inv?.invoice?._id,
				};
			});
			setInvoices(data);
		}
	}, [invdata]);

	useEffect(() => {
		if (invoices.length > 0) {
			// Calculate the sum of totalDayAmount and totalKmAmount for each invoice
			const subtotals = invoices.map((invoice) => {
				return invoice.totalDayAmount + invoice.totalKmAmount;
			});

			// Calculate the total of subtotals
			const totalAmount = subtotals.reduce((total, amount) => {
				return total + amount;
			}, 0);

			// Calculate GST (5%)
			const gstAmount = totalAmount * (gst / 100);

			// Calculate the bill total
			const billTotal = totalAmount + gstAmount;

			// Set the total state
			setTotal({
				subtotals: subtotals,
				totalAmount: totalAmount,
				gstAmount: gstAmount,
				billTotal: billTotal,
			});
		}
	}, [invoices]);

	return (
		<div className="admin-container">
			<AdminSidebar />
			<main className="pdfContainer">
				<div style={{ display: "flex", padding: "0 6rem" }}>
					<button className="downloadbtn" onClick={generate}>
						Download PDF
					</button>
					<button onClick={seeAnexure} className="downloadbtn" style={{ marginLeft: "0" }}>
						See Anexure
					</button>
				</div>
				<div className="pdf" ref={targetRef}>
					<header className="header"></header>
					<main className="pdfBody">
						<h2>Tax Invoice</h2>
						<div className="basicDetails">
							<div>
								<p>GST NO : {company?.gst}</p>
								<p>HSN Services : {company?.hsn}</p>
								<p>Pan Card No : {company?.pan}</p>
							</div>
							<div>
								<p>Invoice NO : {invId}</p>
								<p>Date : {date}</p>
							</div>
						</div>
						<div className="inviceContainer">
							<div className="invoiceHeaders">
								<div>
									<h3>Bill to Address:</h3>
									<h5>{company?.name}</h5>
									<h4>
										<span style={{ fontWeight: 600 }}>Address: </span>
										{company?.address?.street +
											", " +
											company?.address?.city +
											",\n" +
											company?.address?.state +
											", India, " +
											company?.address?.pincode}
									</h4>
								</div>
								<div>
									<p>{date}</p>
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
													Description: Hiring Charges for {invoice.model} Vehicles on per day basis as per Annexure - 1
													<br />
													Vehicle Count - {invoice.count} Nos
													<br />
													Period - {invoice.periodFrom} To {invoice.periodTo}
												</article>
											</div>
											<div>
												<p>{invoice.totalDayQty}</p>
												<p>Days</p>
												<p>{invoice.dayRate}</p>
												<p>{invoice.totalDayAmount.toFixed(2)}</p>
											</div>
										</div>
									);
								})}
								{invoices?.map((invoice, idx) => {
									return (
										<div key={invoice.from + idx}>
											<div>
												<p>{invoice?.length + idx + 1}</p>
												<article>
													Minor Maint Charges - {invoice.model}
													<br />
													Description: Minor maintainance charges for {invoice.model} Vehicles on actual per KM reading
													basis
													<br />
													Vehicle Count - {invoice.count} Nos
													<br />
													Period - {invoice.periodFrom} To {invoice.periodTo}
												</article>
											</div>
											<div>
												<p>{invoice.totalKmQty}</p>
												<p>KM</p>
												<p>{invoice.kmRate}</p>
												<p>{invoice.totalKmAmount.toFixed(2)}</p>
											</div>
										</div>
									);
								})}
							</div>
							<div className="invoiceFooter">
								<div>
									<p>Taxable Value (Rs): </p>
									{/* <p>2882549.64</p> */}
									<p>{Number(total?.totalAmount).toFixed(2)}</p>
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

export default BillPdf;
