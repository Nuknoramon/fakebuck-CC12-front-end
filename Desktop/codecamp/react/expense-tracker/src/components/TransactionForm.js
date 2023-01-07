import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { TransactionContext } from "../contexts/TransactionContext";
import {
  DELETE_TRANSACTION,
  FETCH_TRANSACTION,
} from "../reducer/transactionReducer";
import validator from "validator";
const INCOME = "INCOME";
const EXPENSE = "EXPENSE";

function TransactionFrom() {
  const [notFoundError, setNotFoundError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [categoryType, setCategoryType] = useState(EXPENSE);
  const [payeeInput, setPayeeInput] = useState("");
  const [amountInput, setAmountInput] = useState("");
  const [dateInput, setDateInput] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  const [expense, setExpense] = useState([]);
  const [income, setIncome] = useState([]);
  const [error, setError] = useState({});

  const { dispatch } = useContext(TransactionContext);
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    if (params.transactionId) {
      axios
        .get("http://localhost:8080/transactions/" + params.transactionId)
        .then((res) => {
          if (res.data.transaction === null) {
            setNotFoundError(true);
          } else {
            // const {
            //   payee,
            //   amount,
            //   date,
            //   category: { id, type },
            // } = res.data.transaction;
            setPayeeInput(res.data.transaction.payee);
            setCategoryType(res.data.transaction.category.type);
            setSelectedCategoryId(res.data.transaction.category.id);
            setAmountInput("" + res.data.transaction.amount);
            setDateInput(res.data.transaction.date.slice(0, 10)); //2021-12-30T00.00.00
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [params.transactionId]);

  useEffect(() => {
    const fetchCategory = async () => {
      const res = await axios.get("http://localhost:8080/categories");
      const resultExpenses = res.data.categories.filter(
        (el) => el.type === EXPENSE
      );
      const resultIncomes = res.data.categories.filter(
        (el) => el.type === INCOME
      );
      setExpense(resultExpenses);
      setIncome(resultIncomes);
      if (categoryType === EXPENSE) {
        setSelectedCategoryId(resultExpenses[0].id);
      } else {
        setSelectedCategoryId(resultIncomes[0].id);
      }
    };
    fetchCategory();
  }, []);

  // const location = useLocation();
  // console.log(location);

  const handleSubmitForm = async (event) => {
    event.preventDefault();
    const inputError = {};
    if (validator.isEmpty(payeeInput)) {
      inputError.payee = "Payee is required";
    }

    if (validator.isEmpty(amountInput)) {
      inputError.amount = "Amount is required";
    } else if (!validator.isNumeric(amountInput)) {
      inputError.amount = "Amount must be numeric";
    } else if (amountInput <= 0) {
      inputError.amount = "Amount must be greater than zero";
    }

    if (validator.isEmpty(dateInput)) {
      inputError.date = "Date is required";
    }

    if (Object.keys(inputError).length > 0) {
      setError(inputError);
    } else {
      setError({});
    }
    try {
      const body = {
        payee: payeeInput,
        categoryId: selectedCategoryId,
        amount: +amountInput,
        date: dateInput,
      };
      if (params.transactionId) {
        await axios.put(
          "http://localhost:8080/transactions/" + params.transactionId,
          body
        );
      } else {
        await axios.post("http://localhost:8080/transactions", body);
      }
      const res = await axios.get("http://localhost:8080/transactions");
      dispatch({
        type: FETCH_TRANSACTION,
        value: { transactions: res.data.transactions },
      });
      navigate("/home");
    } catch (err) {
      console.log(err);
    }
  };

  const handleClickDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(
        "http://localhost:8080/transactions/" + params.transactionId
      );
      dispatch({
        type: DELETE_TRANSACTION,
        value: { id: params.transactionId },
      });
      setLoading(false);
      navigate("/home");
    } catch (err) {
      console.log(err);
    }
  };

  if (notFoundError) return <h1 className="text-white">404 Not Found Error</h1>;
  return (
    <>
      <div className="border bg-white rounded-2 p-3">
        <form className="row g-3" onSubmit={handleSubmitForm}>
          <div className="col-6">
            <input
              type="radio"
              className="btn-check"
              id="cbx-expense"
              name="type"
              checked={categoryType === EXPENSE}
              onChange={() => {
                setCategoryType(EXPENSE);
                setSelectedCategoryId(expense[0].id);
              }}
            />
            <label
              className="btn btn-outline-danger rounded-0 rounded-start"
              htmlFor="cbx-expense"
            >
              Expense
            </label>
            <input
              type="radio"
              className="btn-check"
              id="cbx-income"
              name="type"
              checked={categoryType === INCOME}
              onChange={() => {
                setCategoryType(INCOME);
                setSelectedCategoryId(income[0].id);
              }}
            />
            <label
              className="btn btn-outline-success rounded-0 rounded-end"
              htmlFor="cbx-income"
            >
              Income
            </label>
          </div>

          <div className="col-6 d-flex justify-content-end">
            <i className="fa-solid fa-xmark" role="button"></i>
          </div>

          <div className="col-sm-6">
            <label className="form-label">Payee</label>
            <input
              className={`form-control ${error.payee ? "is-invalid" : ""}`}
              type="text"
              value={payeeInput}
              onChange={(event) => setPayeeInput(event.target.value)}
            />
            {error.payee && (
              <div className="invalid-feedback">{error.payee}</div>
            )}
          </div>

          <div className="col-sm-6">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              value={selectedCategoryId}
              onChange={(event) => setSelectedCategoryId(event.target.value)}
            >
              {(categoryType === EXPENSE ? expense : income).map((el) => (
                <option key={el.id} value={el.id}>
                  {el.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-sm-6">
            <label className="form-label">Amount</label>
            <input
              className={`form-control ${error.amount ? "is-invalid" : ""}`}
              type="text"
              value={amountInput}
              onChange={(event) => setAmountInput(event.target.value)}
            />
            {error.amount && (
              <div className="invalid-feedback">{error.amount}</div>
            )}
          </div>

          <div className="col-sm-6">
            <label className="form-label">Date</label>
            <input
              className={`form-control ${error.date ? "is-invalid" : ""}`}
              type="date"
              value={dateInput}
              onChange={(event) => setDateInput(event.target.value)}
            />
            {error.date && <div className="invalid-feedback">{error.date}</div>}
          </div>

          <div className="col-12">
            <div className="d-grid mt-3">
              <button className="btn btn-primary">Save</button>
            </div>
          </div>
        </form>
      </div>
      {params.transactionId && (
        <div className="d-grid mt-5">
          <button
            className="btn btn-danger"
            onClick={handleClickDelete}
            disabled={loading}
          >
            Delete Transaction
          </button>
        </div>
      )}
    </>
  );
}

export default TransactionFrom;
