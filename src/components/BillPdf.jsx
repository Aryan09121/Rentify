/* eslint-disable no-unused-vars */
// eslint-disable-next-line react/prop-types
/* eslint-disable react-hooks/exhaustive-deps */
import generatePDF, { usePDF, Resolution, Margin } from "react-to-pdf";
import AdminSidebar from "./AdminSidebar";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getGst } from "../redux/actions/setting.action";

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
		DetailedMargin: {
			top: Margin.LARGE,
			right: Margin.SMALL,
			bottom: Margin.LARGE,
			left: Margin.SMALL,
		},
	},
};

const fixed = (n) => {
	return parseFloat(Number(n).toFixed(2));
};

function BillPdf() {
	const { targetRef } = usePDF();
	const [invoices, setInvoices] = useState([]);
	const { gst } = useSelector((state) => state.settings);
	const [invdata, setInvdata] = useState();
	const [total, setTotal] = useState([]);
	const location = useLocation();
	const searchParams = new URLSearchParams(location.search);
	const encodedInvoices = searchParams.get("invoices");
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const generate = () => {
		generatePDF(targetRef, option);
	};

	const seeAnexure = () => {
		const invoicesJson = encodeURIComponent(JSON.stringify(invdata));
		navigate(`/charges?invoices=${invoicesJson}`);
	};

	useEffect(() => {
		// Decode the encoded invoices and parse them back to an array
		if (encodedInvoices.length > 0) {
			const decodedInvoices = encodedInvoices ? JSON.parse(decodeURIComponent(encodedInvoices)) : [];
			// console.log(decodedInvoices);
			setInvdata(decodedInvoices);
		}
	}, [encodedInvoices]);

	useEffect(() => {
		console.log(invdata);
		if (invdata?.invoices?.length > 0) {
			const groupedInvoices = invdata.invoices.reduce((acc, inv) => {
				if (!acc[inv.model]) {
					acc[inv.model] = [];
				}
				acc[inv.model].push(inv);
				return acc;
			}, {});

			const data = Object.entries(groupedInvoices).map(([model, modelInvoices]) => {
				const totalDayQty = modelInvoices.reduce((total, inv) => total + (inv.days - inv.offroad), 0);
				const totalKmQty = modelInvoices.reduce((total, inv) => total + (inv.endKm - inv.startKm), 0);
				const totalDayAmount = fixed(modelInvoices.reduce((total, inv) => total + inv.dayAmount, 0));
				const totalKmAmount = fixed(modelInvoices.reduce((total, inv) => total + inv.kmAmount, 0));
				const fromDate = new Date(Math.min(...modelInvoices.map((inv) => new Date(inv.startDate))));
				const toDate = new Date(Math.max(...modelInvoices.map((inv) => new Date(inv.endDate))));
				const formattedFromDate = formatDate(fromDate);
				const formattedToDate = formatDate(toDate);
				const vehicleCount = modelInvoices.length;

				return {
					model: model,
					count: vehicleCount,
					periodFrom: formattedFromDate,
					periodTo: formattedToDate,
					totalDayQty: totalDayQty,
					totalKmQty: totalKmQty,
					totalDayAmount: totalDayAmount,
					totalKmAmount: totalKmAmount,
					dayRate: modelInvoices[0].rate.date,
					kmRate: modelInvoices[0].rate.km,
				};
			});
			console.log(data);
			setInvoices(data);
		}
	}, [invdata]);

	useEffect(() => {
		if (invoices.length > 0) {
			const subtotals = invoices.map((invoice) => {
				return invoice.totalDayAmount + invoice.totalKmAmount;
			});

			const totalAmount = subtotals.reduce((total, amount) => total + amount, 0);
			const gstAmount = totalAmount * (gst / 100);
			const billTotal = totalAmount + gstAmount;

			setTotal({
				subtotals: subtotals,
				totalAmount: totalAmount,
				gstAmount: gstAmount,
				billTotal: billTotal,
			});
		}
	}, [invoices]);

	useEffect(() => {
		dispatch(getGst());
	}, [dispatch]);

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
								<p>GST NO : {invdata?.companyGst}</p>
								<p>HSN Services : {invdata?.companyHsn}</p>
								<p>Pan Card No : {invdata?.companyPan}</p>
							</div>
							<div>
								<p>Invoice NO : invoiceId</p>
								<p>Date : {invdata && invdata?.data[3]}</p>
							</div>
						</div>
						<div className="inviceContainer">
							<div className="invoiceHeaders">
								<div>
									<h3>Bill to Address:</h3>
									<h5>{invdata?.companyName}</h5>
									<h4>
										<span style={{ fontWeight: 600 }}>Address: </span>
										{invdata?.companyAddress}
									</h4>
								</div>
								<div>
									<p>{invdata && invdata?.data[3]}</p>
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
												<p>{invoices.length + idx + 1}</p>
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
