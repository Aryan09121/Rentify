/* eslint-disable react/jsx-key */
import { useTable, useSortBy, usePagination } from "react-table";
import { AiOutlineSortAscending, AiOutlineSortDescending } from "react-icons/ai";
// import { useNavigate } from "react-router-dom";

function TableHOC(columns, data, containerClassName, heading, showPagination = false, pageSize = 2, onNavigate) {
	// const navigate = useNavigate();

	return function HOC() {
		const options = {
			columns,
			data,
			initialState: {
				pageSize: pageSize,
			},
		};
		const {
			getTableProps,
			getTableBodyProps,
			headerGroups,
			page,
			prepareRow,
			nextPage,
			previousPage,
			canNextPage,
			canPreviousPage,
			pageCount,
			gotoPage,
			state: { pageIndex },
		} = useTable(options, useSortBy, usePagination);

		return (
			<div className={containerClassName}>
				<h2 className="heading">{heading}</h2>
				<table className="table" {...getTableProps()}>
					<thead>
						{headerGroups.map((headerGroup) => (
							<tr {...headerGroup.getHeaderGroupProps()}>
								{headerGroup.headers.map((column) => (
									<th {...column.getHeaderProps(column.getSortByToggleProps())}>
										{column.render("Header")}
										{column.isSorted && (
											<span>{column.isSortedDesc ? <AiOutlineSortDescending /> : <AiOutlineSortAscending />}</span>
										)}
									</th>
								))}
							</tr>
						))}
					</thead>
					<tbody {...getTableBodyProps()}>
						{page.map((row) => {
							prepareRow(row);
							return (
								<tr {...row.getRowProps} onClick={() => onNavigate(row)}>
									{row.cells.map((cell) => (
										<td {...cell.getCellProps}>{cell.render("Cell")}</td>
									))}
								</tr>
							);
						})}
					</tbody>
				</table>
				{showPagination && (
					<div className="table-pagination">
						<button disabled={!canPreviousPage} onClick={() => gotoPage(0)}>
							Go to First Page
						</button>
						<button disabled={!canPreviousPage} onClick={previousPage}>
							Prev
						</button>
						<span>{`${pageIndex + 1} of ${pageCount}`}</span>
						<button disabled={!canNextPage} onClick={nextPage}>
							Next
						</button>
						<button disabled={!canNextPage} onClick={() => gotoPage(pageCount - 1)}>
							Go to Last Page
						</button>
					</div>
				)}
			</div>
		);
	};
}

export default TableHOC;
