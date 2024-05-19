/* eslint-disable react/prop-types */
// import { Filter } from "../pages/InvoiceDetails";
import AdminSidebar from "./AdminSidebar";
import Bar from "./Bar";
// import Table from "./Table";

import { billDetailsHeaders } from "../assets/data/bill";
import { BillDetailsRow, Table, TableBody, TableContainer, TableFooter, TableHeaders, TableHeading } from "./TableHOC";
// import { useNavigate } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { payOwnerBill } from "../redux/actions/invoice.action";
import { toast } from "react-toastify";
import TxtLoader from "./TxtLoader";
import { getGst } from "../redux/actions/setting.action";
import Loader from "./Loader";

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
	// const navigate = useNavigate();
	const { message, error, loading } = useSelector((state) => state.invoice);
	const { gst, loading: gstLoading } = useSelector((state) => state.settings);
	const [owner, setOwner] = useState();
	const [isOpen, setIsOpen] = useState(false);
	const [total, setTotal] = useState([]);
	const [datedata, setDatedata] = useState([]);
	const [ids, setIds] = useState([]);
	const location = useLocation();
	const searchParams = new URLSearchParams(location.search);
	const encodedInvoices = searchParams.get("invoices");
	const encodedOwner = searchParams.get("owner");
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const payBill = (data, transaction) => {
		dispatch(payOwnerBill(data, transaction));
		// alert("payed");
	};
	const onConfirm = () => {
		setIsOpen(true);
	};

	const sendPdf = () => {
		confirm(`Are you sure you want to send`);
		const ownerJson = JSON.stringify(owner);
		const encodedOwner = encodeURIComponent(ownerJson);

		// Navigate to the route with the encoded invoices as a query parameter
		navigate(`/ownerbill?owner=${encodedOwner}`);
	};

	useEffect(() => {
		if (encodedOwner) {
			const decodedOwner = encodedOwner ? JSON.parse(decodeURIComponent(encodedOwner)) : null;
			setOwner(decodedOwner);
		}
	}, [encodedInvoices, encodedOwner]);

	useEffect(() => {
		dispatch(getGst());
	}, []);

	useEffect(() => {
		if (owner) {
			// console.log(owner.bills);
			const data = owner.bills.map((bill, idx) => {
				const totalDays = bill.invoices.reduce((acc, inv) => acc + inv.days, 0);
				// const offroadDays = bill.invoices.reduce((acc, inv) => acc + inv.offroad, 0);
				const model = bill.model;
				const vehicleCount = bill.invoices.reduce((acc, inv) => {
					// Check if the car exists in the accumulator
					if (!acc.includes(inv.car)) {
						// If it doesn't exist, add it to the accumulator
						acc.push(inv.car);
					}
					return acc;
				}, []).length;

				console.log(vehicleCount);

				const from = bill.invoices.reduce((acc, inv) => {
					return acc < new Date(inv.start) ? acc : new Date(inv.start);
				}, bill.invoices[0].start);
				const to = bill.invoices.reduce((acc, inv) => {
					return acc > new Date(inv.end) ? acc : new Date(inv.end);
				}, bill.invoices[0].end);

				const subTotal = bill.invoices.reduce((acc, inv) => {
					return acc + (inv.days - inv.offroad) * inv.rent;
				}, 0);

				const gstAmount = fixed((subTotal * gst) / 100);

				const totalAmount = fixed(subTotal + gstAmount);

				return {
					data: [
						idx + 1,
						`Rental (Hiring Charges) for - ${model} Vehicles on per day basis as per Annexure - 1 Vehicle Count - ${vehicleCount} Nos Period - ${formatDate(
							from
						)} To , ${formatDate(to)}`,
						totalDays,
						"Day",
						totalAmount,
					],
					_id: `Inv-${idx}${new Date()}`,
					model: model,
					count: vehicleCount,
					periodFrom: from,
					periodTo: to,
					totalDayQty: totalDays,
					totalAmount: subTotal,
					length: length,
				};
			});
			setDatedata(data);
			setIds(owner._id);
		}
	}, [owner, gst]);

	useEffect(() => {
		if (owner) {
			console.log(owner.bills);
			// Calculate the sum of totalDayAmount and totalKmAmount for each invoice
			const subtotals = owner.bills.reduce((acc, bill) => {
				return acc + bill.invoices.reduce((acc, inv) => acc + inv.amount, 0);
			}, 0);

			const gstAmount = fixed(subtotals * (gst / 100));

			// Calculate the total of subtotals
			const billTotal = fixed(subtotals + gstAmount);

			// Set the total state
			setTotal({
				subtotals: subtotals,
				totalAmount: subtotals,
				gstAmount: gstAmount,
				billTotal: billTotal,
			});
		}
	}, [owner, gst]);

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

	if (gstLoading) {
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
						<TableHeaders style={{ gridTemplateColumns: `1fr 4fr 1fr 1fr 1fr` }} headers={billDetailsHeaders} />
						<TableBody TableRow={BillDetailsRow} data={datedata}></TableBody>
						<TableFooter>
							<div>
								<h4>Sub Total</h4>
								<h4>{fixed(total?.totalAmount)}</h4>
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
				<div className="actionBtn">
					<button onClick={sendPdf}>Send Bill</button>
					<button onClick={onConfirm} className="billpay" disabled={loading}>
						{loading ? <TxtLoader /> : "Pay Bill"}
					</button>
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
