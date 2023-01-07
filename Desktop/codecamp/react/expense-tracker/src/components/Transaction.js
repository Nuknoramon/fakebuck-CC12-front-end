import { useNavigate } from "react-router-dom";
import { formatThaiCurrency } from "../utis/currency";
import { formatShortMonthShortYear } from "../utis/date";

function Transaction({ transaction }) {
  const {
    id,
    amount,
    date,
    payee,
    category: { name, type },
  } = transaction;
  const navigate = useNavigate();
  const dateObj = new Date(date);

  return (
    <li
      className={`list-group-item d-flex align-items-center bd-callout ba-callout-${
        type === "EXPENSE" ? "danger" : "success"
      }`}
      onClick={() => navigate("/transaction/" + id, { state: transaction })}
    >
      <div className="d-flex flex-fill" role="button">
        <div className="border border-1 border-dark rounded-2 bg-warning p-2 text-center w-15">
          <p className="p-0 m-0 text-black-50 text-3">
            {formatShortMonthShortYear(dateObj)}
          </p>
          <p className="p-0 m-0">{dateObj.getDate()}</p>
        </div>

        <div className="d-flex justify-content-between align-items-center ps-4 flex-fill">
          <div>
            <p className="mb-1 fw-bold">{payee}</p>
            <p className="mb-0 text-3 text-black-50">{name}</p>
          </div>
          <span className="badge bg-success">{formatThaiCurrency(amount)}</span>
        </div>
      </div>
    </li>
  );
}

export default Transaction;
