/* eslint-disable react/prop-types */
// import { Filter } from "../pages/InvoiceDetails";
import AdminSidebar from "./AdminSidebar";
import Bar from "./Bar";
// import Table from "./Table";

import { billDetailsHeaders } from "../assets/data/bill";
import { BillDetailsRow, Table, TableBody, TableContainer, TableFooter, TableHeaders, TableHeading } from "./TableHOC";
// import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { payOwnerBill } from "../redux/actions/invoice.action";
import { toast } from "react-toastify";
import TxtLoader from "./TxtLoader";
import { getGst } from "../redux/actions/setting.action";
import Loader from "./Loader";
import axios from "axios";

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

const fixed = (n) => {
	return parseFloat(Number(n).toFixed(2));
};

function BillDetails() {
	const [invoices, setInvoices] = useState([]);
	const { gst, loading } = useSelector((state) => state.settings);
	const { message, error } = useSelector((state) => state.invoice);
	const [isOpen, setIsOpen] = useState(false);
	const [invdata, setInvdata] = useState();
	const [total, setTotal] = useState([]);
	const location = useLocation();
	const searchParams = new URLSearchParams(location.search);
	const encodedInvoices = searchParams.get("invoices");
	const dispatch = useDispatch();

	const onConfirm = () => {
		setIsOpen(true);
	};

	const payBill = (data, transaction) => {
		const billdata = {
			ownerId: invdata.ownerId,
			invDate: invdata.invoices[0].invoiceDate,
			transaction,
		};
		dispatch(payOwnerBill(billdata));
		// alert("payed");
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
				// console.log(inv.car.model);
				if (!acc[inv.car.model]) {
					acc[inv.car.model] = [];
				}
				acc[inv.car.model].push(inv);
				return acc;
			}, {});

			const data = Object.entries(groupedInvoices).map(([model, modelInvoices], idx) => {
				console.log(modelInvoices);
				const totalDayQty = modelInvoices.reduce((total, inv) => total + (inv.days - inv.offroad), 0);
				const totalDayAmount = fixed(modelInvoices.reduce((total, inv) => total + inv.rent * inv.totalDays, 0));
				const fromDate = new Date(Math.min(...modelInvoices.map((inv) => new Date(inv.startDate))));
				const toDate = new Date(Math.max(...modelInvoices.map((inv) => new Date(inv.endDate))));
				const formattedFromDate = formatDate(fromDate);
				const formattedToDate = formatDate(toDate);
				const vehicleCount = modelInvoices.length;

				return {
					data: [
						idx + 1,
						`Rental (Hiring Charges) for - ${model} Vehicles on per day basis as per Annexure - 1 Vehicle Count - ${vehicleCount} Nos Period - ${formattedFromDate} To , ${formattedToDate}`,
						totalDayQty,
						"Day",
						totalDayAmount,
					],
					model: model,
					count: vehicleCount,
					periodFrom: formattedFromDate,
					periodTo: formattedToDate,
					totalDayQty: totalDayQty,
					totalDayAmount: totalDayAmount,
					kmRate: modelInvoices[0].rate.km,
				};
			});
			// console.log(data);
			setInvoices(data);
		}
	}, [invdata]);

	const handleClick = async () => {
		if (invdata && invdata.data && invdata.data[2]) {
			const longUrl = `http://localhost:5173/ownerbill?id=${invdata.ownerId}&date=${encodeURIComponent(invdata.data[2])}`;
			console.log(`Redirecting to WhatsApp with URL: https://api.whatsapp.com/send?phone=${7723831279}&text=${encodeURIComponent(longUrl)}`);
			window.location.href = `https://api.whatsapp.com/send?phone=${7723831279}&text=${encodeURIComponent(longUrl)}`;
		} else {
			console.error("Date or other invoice data is missing:", invdata);
			alert("Date or other invoice data is missing.");
		}
	};

	useEffect(() => {
		if (invoices.length > 0) {
			const subtotals = invoices.map((invoice) => {
				return invoice.totalDayAmount;
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

	if (loading) {
		return <Loader />;
	}

	return (
		<div className="admin-container">
			<AdminSidebar />
			<main className="ownerProfile">
				<Bar />
				<h2>Bills</h2>
				{/* <Filter /> */}
				<TableContainer>
					<TableHeading>
						<div className="billHeaders">
							<div>
								<h4>Bill To Address</h4>
								<h4>{invdata && invdata?.ownerAddress?.street}</h4>
							</div>
							<div>
								<h4>
									Month: <span>{invdata && invdata?.data[2]}</span>
								</h4>
								<h4>Vehicle Monthly Rental Basis PO</h4>
							</div>
						</div>
					</TableHeading>
					<Table>
						<TableHeaders style={{ gridTemplateColumns: `1fr 4fr 1fr 1fr 1fr` }} headers={billDetailsHeaders} />
						<TableBody TableRow={BillDetailsRow} data={invoices}></TableBody>
						<TableFooter>
							<div>
								<h4>Sub Total</h4>
								<h4>{fixed(total?.totalAmount)}</h4>
							</div>
							<div>
								<h4>GST @ {gst}%</h4>
								<h4>{fixed(total?.gstAmount)}</h4>
							</div>
							<div>
								<h4>Total (Rs)</h4>
								<h4>{Number(total?.billTotal).toFixed(2)}</h4>
							</div>
						</TableFooter>
					</Table>
				</TableContainer>
				<Confirm open={isOpen} setIsOpen={setIsOpen} onPayBill={payBill} invoice={invoices} />
				<div className="actionBtn">
					<button onClick={handleClick}>Send Bill</button>
					{invdata?.status === "unpaid" && (
						<button onClick={onConfirm} className="billpay" disabled={loading}>
							{loading ? <TxtLoader /> : "Pay Bill"}
						</button>
					)}
				</div>
			</main>
		</div>
	);
}

const Confirm = ({ open, setIsOpen, onPayBill, invoice }) => {
	const [transaction, setTransaction] = useState("");
	return (
		<dialog className="confirmBox" open={open}>
			<div>
				<h5>Approve the Payment?? ‼️‼️</h5>
				<input type="text" value={transaction} onChange={(e) => setTransaction(e.target.value)} placeholder="Enter Transaction Id..." />
				<div>
					<button
						onClick={() => {
							if (transaction) {
								onPayBill(invoice, transaction);
								setTransaction("");
								setIsOpen(false);
							} else {
								toast.error("Transaction id is required");
							}
						}}
					>
						Yes
					</button>

					<button onClick={() => setIsOpen(false)}>No, Cancel</button>
				</div>
			</div>
		</dialog>
	);
};
export default BillDetails;
