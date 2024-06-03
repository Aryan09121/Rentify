/* eslint-disable react/prop-types */
import { useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getGst } from "../redux/actions/setting.action";
import { getAllInvoices } from "../redux/actions/invoice.action";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast } from "react-toastify"; // Assuming you're using react-toastify for notifications

function formatDate(date) {
	if (!(date instanceof Date)) {
		date = new Date(date);
	}

	const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	const year = date.getFullYear();
	const month = date.getMonth();
	const day = date.getDate();

	return `${day}, ${months[month]}, ${year}`;
}

const fixed = (n) => parseFloat(Number(n).toFixed(2));

function OwnerPdf() {
	const dispatch = useDispatch();
	const location = useLocation();
	const params = new URLSearchParams(location.search);
	const ownerId = params.get("id");
	const [total, setTotal] = useState([]);
	const invoiceDate = params.get("date");
	const { invoices: backendData, message, error } = useSelector((state) => state.invoice);
	const [invdata, setInvData] = useState([]);
	const [invoices, setInvoices] = useState([]);
	const targetRef = useRef(null);

	useEffect(() => {
		dispatch(getAllInvoices());
		dispatch(getGst());
	}, [dispatch]);

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

	useEffect(() => {
		// console.log(invoices);
		if (backendData?.length > 0) {
			const ownerInvoiceData = {};
			backendData.forEach((invoice) => {
				const { owner, months } = invoice;
				const { _id, name, contact, address: ownerAddress } = owner;
				if (!ownerInvoiceData[_id]) {
					ownerInvoiceData[_id] = {
						ownerId: _id,
						ownerName: name,
						contact,
						ownerAddress,
						monthlyInvoices: [],
					};
				}
				months.forEach((monthInvoice, index) => {
					const monthlyInvoice = { month: formatDate(monthInvoice.invoiceDate), ...monthInvoice };
					if (!ownerInvoiceData[_id].monthlyInvoices[index]) {
						ownerInvoiceData[_id].monthlyInvoices[index] = [];
					}
					ownerInvoiceData[_id].monthlyInvoices[index].push(monthlyInvoice);
				});
			});
			const ownerInvoiceArray = Object.values(ownerInvoiceData);
			const invData = ownerInvoiceArray.flatMap((invoice) =>
				invoice.monthlyInvoices.map((invoiceMonth) => ({
					data: [
						invoice.ownerName,
						invoice.contact,
						invoiceMonth[0].month,
						fixed(invoiceMonth.reduce((acc, data) => acc + data.totalDays * data.rent, 0)),
					],
					status: invoiceMonth[0].ownerStatus === "paid" ? "paid" : "unpaid",
					ownerId: invoice.ownerId,
					ownerName: invoice.ownerName,
					contact: invoice.contact,
					ownerAddress: invoice.ownerAddress,
					ownerPan: invoice.ownerPan,
					invoices: invoiceMonth,
				}))
			);
			console.log(invData);
			// console.log(ownerId);
			console.log(invData.find((inv) => inv.ownerId === ownerId && inv.data[2] === invoiceDate));
			setInvData(invData.find((inv) => inv.ownerId === ownerId && inv.data[2] === invoiceDate));
		}
	}, [backendData, ownerId]);

	useEffect(() => {
		if (invdata?.invoices?.length > 0) {
			const groupedInvoices = invdata.invoices.reduce((acc, inv) => {
				if (!acc[inv.car.model]) {
					acc[inv.car.model] = [];
				}
				acc[inv.car.model].push(inv);
				return acc;
			}, {});

			const data = Object.entries(groupedInvoices).map(([model, modelInvoices]) => {
				const totalDayQty = modelInvoices.reduce((total, inv) => total + (inv.days - inv.offroad), 0);
				const totalDayAmount = fixed(modelInvoices.reduce((total, inv) => total + inv.rent * inv.totalDays, 0));
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
					totalDayAmount: totalDayAmount,
					kmRate: modelInvoices[0].rate.km,
				};
			});
			setInvoices(data);
		}
	}, [invdata]);

	const generatePDF = () => {
		const input = targetRef.current;
		html2canvas(input).then((canvas) => {
			const imgData = canvas.toDataURL("image/png");
			const pdf = new jsPDF();
			const imgProperties = pdf.getImageProperties(imgData);
			const pdfWidth = pdf.internal.pageSize.getWidth();
			const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;
			pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
			pdf.save(`invoice_${ownerId}.pdf`);
		});
	};

	useEffect(() => {
		console.log(invoices);
		if (invoices.length > 0) {
			const subtotals = invoices.map((invoice) => invoice.totalDayAmount);
			const totalAmount = subtotals.reduce((total, amount) => total + amount, 0);
			const gstAmount = totalAmount * (10 / 100);
			const billTotal = totalAmount + gstAmount;

			setTotal({
				subtotals: subtotals,
				totalAmount: totalAmount,
				gstAmount: gstAmount,
				billTotal: billTotal,
			});
		}
	}, [invoices]);

	return (
		<div className="admin-contaner">
			<main className="pdfContainer">
				<div style={{ display: "flex", padding: "0 6rem" }}>
					<button className="downloadbtn" onClick={generatePDF}>
						Download PDF
					</button>
				</div>
				<div className="pdf" ref={targetRef}>
					<header className="header"></header>
					<main className="pdfBody">
						<h2>Tax Invoice</h2>
						<div className="basicDetails">
							<div>
								<p>GST NO : {"{GST NUMBER}"}</p>
								<p>HSN Services : {"{HSN NUMBER}"}</p>
								<p>Pan Card No : {"{PAN NUMBER}"}</p>
							</div>
							<div>
								<p>Invoice NO : invoiceId</p>
								<p>Date : {!invdata && invdata?.data[2]}</p>
							</div>
						</div>
						<div className="inviceContainer">
							<div className="invoiceHeaders">
								<div>
									<h3>Bill to Address:</h3>
									<h5>{invdata?.ownerName}</h5>
									<h4>
										<span style={{ fontWeight: 600 }}>Address: </span>
										{invdata?.ownerAddress?.street}
									</h4>
								</div>
								<div>
									<p>{!invdata && invdata?.data[2]}</p>
									<p>Vehicle Monthly Rental Basis PO No -</p>
								</div>
							</div>
							<div className="invoiceBody ownerBody">
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
												<p>{invoice.totalDayAmount.toFixed(2)}</p>
											</div>
										</div>
									);
								})}
							</div>
							<div className="invoiceFooter ownerFooter">
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

export default OwnerPdf;
