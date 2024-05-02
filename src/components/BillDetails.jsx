/* eslint-disable react/prop-types */
// import { Filter } from "../pages/InvoiceDetails";
import AdminSidebar from "./AdminSidebar";
import Bar from "./Bar";
// import Table from "./Table";

import { billDetailsData, billDetailsHeaders } from "../assets/data/bill";
import { BillDetailsRow, Table, TableBody, TableContainer, TableFooter, TableHeaders, TableHeading } from "./TableHOC";
// import { useNavigate } from "react-router-dom";
import { Filter } from "../pages/InvoiceDetails";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { payAllInvoice } from "../redux/actions/invoice.action";
import { toast } from "react-toastify";
import TxtLoader from "./TxtLoader";

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

const gst = 5;

function BillDetails() {
	// const navigate = useNavigate();
	const { message, error, loading } = useSelector((state) => state.invoice);
	const [owner, setOwner] = useState();
	const [isOpen, setIsOpen] = useState(false);
	const [total, setTotal] = useState([]);
	const [invdata, setInvdata] = useState([]);
	const [invoices, setInvoices] = useState([]);
	const [datedata, setDatedata] = useState([]);
	const [kmdata, setKmdata] = useState([]);
	const [ids, setIds] = useState([]);
	const location = useLocation();
	const searchParams = new URLSearchParams(location.search);
	const encodedInvoices = searchParams.get("invoices");
	const encodedOwner = searchParams.get("owner");
	const dispatch = useDispatch();

	const payBill = (data) => {
		dispatch(payAllInvoice(data));
		// alert("payed");
	};
	const onConfirm = () => {
		setIsOpen(true);
	};

	useEffect(() => {
		// Decode the encoded invoices and parse them back to an array
		if (encodedInvoices.length > 0) {
			const decodedInvoices = encodedInvoices ? JSON.parse(decodeURIComponent(encodedInvoices)) : [];
			setInvdata(decodedInvoices);
		}
		if (encodedOwner) {
			const decodedOwner = encodedOwner ? JSON.parse(decodeURIComponent(encodedOwner)) : null;
			setOwner(decodedOwner);
		}
	}, [encodedInvoices, encodedOwner]);

	useEffect(() => {
		if (invdata?.length > 0) {
			const length = invdata?.length;
			const datedata = invdata.map((inv, idx) => {
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
				return {
					data: [
						idx + 1,
						`Rental (Hiring Charges) for - ${inv?.model} Vehicles on per day basis as per Annexure - 1 Vehicle Count - ${inv?.invoice?.length} Nos Period - ${formattedFromDate} To , ${formattedToDate}`,
						totalDayQty,
						"Day",
						inv?.invoice[0].dayRate,
						totalDayAmount,
					],
					_id: `Inv-${idx}${new Date()}`,
					model: inv?.model,
					count: inv?.invoice?.length,
					periodFrom: formattedFromDate,
					periodTo: formattedToDate,
					totalDayQty: totalDayQty,
					totalKmQty: totalKmQty,
					totalDayAmount: totalDayAmount,
					totalKmAmount: totalKmAmount,
					dayRate: inv?.invoice[0].dayRate,
					kmRate: inv?.invoice[0].kmRate,
					length: length,
				};
			});
			const kmdata = invdata.map((inv, idx) => {
				console.log(inv);
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

				return {
					data: [
						length + idx + 1,
						`Minor maintainance charges on ${inv?.model} vehicle on actual per KM reading per basis as per the Annexure-1 vehicle count- ${inv?.invoice?.length} Nos, Period - ${formattedFromDate} To , ${formattedToDate}`,
						totalKmQty,
						"Km",
						inv?.invoice[0].kmRate,
						totalKmAmount.toFixed(2),
					],
					_id: `Inv-${idx}${new Date()}`,
					model: inv?.model,
					count: inv?.invoice?.length,
					periodFrom: formattedFromDate,
					periodTo: formattedToDate,
					totalDayQty: totalDayQty,
					totalKmQty: totalKmQty,
					totalDayAmount: totalDayAmount,
					totalKmAmount: totalKmAmount,
					dayRate: inv?.invoice[0].dayRate,
					kmRate: inv?.invoice[0].kmRate,
					length: length,
				};
			});
			const data = invdata.map((inv, idx) => {
				console.log(inv);
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

				return {
					_id: `Inv-${idx}${new Date()}`,
					model: inv?.model,
					count: inv?.invoice?.length,
					periodFrom: formattedFromDate,
					periodTo: formattedToDate,
					totalDayQty: totalDayQty,
					totalKmQty: totalKmQty,
					totalDayAmount: totalDayAmount,
					totalKmAmount: totalKmAmount,
					dayRate: inv?.invoice[0].dayRate,
					kmRate: inv?.invoice[0].kmRate,
					length: length,
				};
			});
			const invIds = invdata.flatMap((model) => {
				return model.invoice.map((invoice) => invoice._id);
			});
			// console.log(data);
			setDatedata(datedata);
			setKmdata(kmdata);
			setInvoices(data);
			setIds(invIds);
		}
	}, [invdata]);

	useEffect(() => {
		if (invoices.length > 0) {
			console.log(invoices);
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

	useEffect(() => {
		if (error) {
			toast.error(error);
			dispatch({ type: "CLEAR_ERRORS" });
		}
		if (message) {
			toast.success(message);
			dispatch({ type: "CLEAR_MESSAGES" });
		}
	}, [message, error]);

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
								<h4>4157 Washington Ave.Manchester, Kentuchy 39456</h4>
							</div>
							<div>
								<h4>
									Month: <span>Nov 24</span>
								</h4>
								<h4>Vehicle Monthly Rental Basis PO</h4>
							</div>
						</div>
					</TableHeading>
					<Table>
						<TableHeaders style={{ gridTemplateColumns: `1fr 4fr 1fr 1fr 1fr 1fr` }} headers={billDetailsHeaders} />
						<TableBody TableRow={BillDetailsRow} data={datedata}></TableBody>
						<TableBody TableRow={BillDetailsRow} data={kmdata}></TableBody>
						<TableFooter>
							<div>
								<h4>Sub Total</h4>
								<h4>{total?.totalAmount}</h4>
							</div>
							<div>
								<h4>GST @ 5%</h4>
								<h4>{total?.gstAmount}</h4>
							</div>
							<div>
								<h4>Total (Rs)</h4>
								<h4>{Number(total?.billTotal).toFixed(2)}</h4>
							</div>
						</TableFooter>
					</Table>
				</TableContainer>
				<Confirm open={isOpen} setIsOpen={setIsOpen} invoice={ids} onPayBill={payBill} />
				<button onClick={onConfirm} className="billpay" disabled={loading}>
					{loading ? <TxtLoader /> : "Pay Bill"}
				</button>
			</main>
		</div>
	);
}

const Confirm = ({ open, setIsOpen, onPayBill, invoice }) => {
	return (
		<dialog className="confirmBox" open={open}>
			<div>
				<h5>Approve the Payment?? ‼️‼️</h5>
				<div>
					<button
						onClick={() => {
							onPayBill(invoice);
							setIsOpen(false);
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
