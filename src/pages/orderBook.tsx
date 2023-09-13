import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import '../styles/dashboard.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from './loadingSpinner';

interface Order {
  _id: string;
  type: string;
  price: number;
  quantity: number;
}

interface OrderBookProps {}

const apiUrl: string | undefined = process.env.REACT_APP_SERVER_URL;

const OrderBook: React.FC<OrderBookProps> = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<{ type: string; quantity: string; price: string }>({
    type: '',
    quantity: '',
    price: '',
  });
  const [formErrors, setFormErrors] = useState<{ type: string; quantity: string; price: string }>({
    type: '',
    quantity: '',
    price: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      axios
        .get(`${process.env.REACT_APP_SERVER_URL}/auth/isValid`, {
          headers: {
            'Access-Control-Allow-Origin': '*',
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .catch((error) => {
          localStorage.removeItem('accessToken');
          navigate('/login');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    setLoading(true);
    const accessToken = localStorage.getItem('accessToken');
    axios
      .get(`${apiUrl}/order`, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setOrders(response.data);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const executeOrder = (orderId: string) => {
    setLoading(true);
    const accessToken = localStorage.getItem('accessToken');
    axios
      .post(
        `${apiUrl}/order/${orderId}`,
        {},
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then((response) => {
        console.log('Order executed successfully:', response.data);
        window.location.reload();
      })
      .catch((error) => {
        console.error('Error executing order:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const toggleForm = () => {
    setIsFormOpen(!isFormOpen);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    let error = '';
    if (name === 'quantity' || name === 'price') {
      if (!value || isNaN(Number(value)) || Number(value) <= 0) {
        error = 'Please enter a valid number';
      }
    }
    setFormErrors({ ...formErrors, [name]: error });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    for (const key of ['type', 'quantity', 'price']) {
      //@ts-ignore
      if (!formData[key]) {
        setFormErrors({ ...formErrors, [key]: 'This field is required' });
        return;
      }
    }

    placeOrder(formData);
  };

  const placeOrder = (formData: { type: string; quantity: string; price: string }) => {
    setLoading(true);
    const accessToken = localStorage.getItem('accessToken');
    axios
      .post(
        `${apiUrl}/order`,
        {
          type: formData.type,
          quantity: Number(formData.quantity),
          price: Number(formData.price),
        },
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then((response) => {
        console.log('Order placed successfully:', response.data);
        window.location.reload();
      })
      .catch((error) => {
        console.error('Error placing order:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/login');
  };

  return (
    <div className="order-book">
      <button className="button is-danger logout-button" onClick={handleLogout}>
        Logout
      </button>
      <h2>Order Book</h2>
      {loading ? <LoadingSpinner />:<div>
      <button className="button is-primary toggle-button" onClick={toggleForm}>
        Order Form
      </button>
      {isFormOpen && (
        <form onSubmit={handleSubmit} className="order-form">
          <div className="field">
            <label className="label">Type</label>
            <div className="control">
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
              >
                <option value="">Select Type</option>
                <option value="BUY">Buy</option>
                <option value="SELL">Sell</option>
              </select>
            </div>
            {formErrors.type && <p className="error">{formErrors.type}</p>}
          </div>
          <div className="field">
            <label className="label">Quantity</label>
            <div className="control">
              <input
                className="input"
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
              />
            </div>
            {formErrors.quantity && <p className="error">{formErrors.quantity}</p>}
          </div>
          <div className="field">
            <label className="label">Price</label>
            <div className="control">
              <input
                className="input"
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
              />
            </div>
            {formErrors.price && <p className="error">{formErrors.price}</p>}
          </div>
          <button className="button is-primary" type="submit" disabled={!!(formErrors.type || formErrors.quantity || formErrors.price)}>
            Place Order
          </button>
        </form>
      )}
      <table>
        <thead>
          <tr>
            <th>Type</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr key={index}>
              <td>{order.type}</td>
              <td>{order.price}</td>
              <td>{order.quantity}</td>
              <td>
                <button className='execute-order' onClick={() => executeOrder(order._id)}>
                  Execute Order
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
        </div>}
     
    </div>
  );
};

export default OrderBook;
