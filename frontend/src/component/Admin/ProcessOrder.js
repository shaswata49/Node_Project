import React, { Fragment, useEffect, useState } from "react";
import MetaData from "../layout/MetaData";
import { Link } from "react-router-dom";
import { Typography } from "@material-ui/core";
import SideBar from "./Sidebar";
import {
  getOrderDetails,
  clearErrors,
  updateOrder,
} from "../../actions/orderAction";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../layout/Loader/Loader";
import { useAlert } from "react-alert";
import AccountTreeIcon from "@material-ui/icons/AccountTree";
import { Button } from "@material-ui/core";
import { UPDATE_ORDER_RESET } from "../../constants/orderConstants";
import "./processOrder.css";

const ProcessOrder = ({ history, match }) => {
  const { order, error, loading } = useSelector((state) => state.orderDetails);
  const { updateError, isUpdated } = useSelector((state) => state.order);

  const updateOrderSubmitHandler = (e) => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.set("status", status);

    dispatch(updateOrder(match.params.id, myForm));
  };

  const dispatch = useDispatch();
  const alert = useAlert();

  const [status, setStatus] = useState("");

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (updateError) {
      alert.error(updateError);
      dispatch(clearErrors());
    }
    if (isUpdated) {
      alert.success("Order Updated Successfully");
      dispatch({ type: UPDATE_ORDER_RESET });
    }

    dispatch(getOrderDetails(match.params.id));
  }, [dispatch, alert, error, match.params.id, isUpdated, updateError]);


  return (
    <Fragment>
      <MetaData title="Process Order" />
      <div className="dashboard">
        <SideBar />
        <div className="newProductContainer">
          {loading ? (
            <Loader />
          ) : (
            <div
              className="confirmOrderPage"
              style={{
                display: order.orderStatus === "Delivered" ? "block" : "grid",
              }}
            >
              <div>
                <div className="confirmshippingArea">
                  <Typography>User Info</Typography>
                  <div className="orderDetailsContainerBox">
                    <div>
                      <p>Name:</p>
                      <span>{order.user && order.user.name}</span>
                    </div>
                    <div>
                      <p>Address:</p>
                      <span>{order.orderItems && order.orderItems[0].address}</span>
                    </div>
                    <div>
                      <p>Product Name:</p>
                      <span>{order.orderItems && order.orderItems[0].productname}</span>
                    </div>
                  </div>

                  <Typography>Deliver Details</Typography>
                  <div className="orderDetailsContainerBox">
                    <div>
                      <p>Delivery Date:</p>
                      <span>
                        {order &&
                          order.deliverDetails &&
                          order.deliverDetails.deliveryDate && new Date(order.deliverDetails.deliveryDate).toLocaleDateString()}
                      </span>
                    </div>

                    <div>
                      <p>Pincode:</p>
                      <span>
                        {order &&
                          order.deliverDetails &&
                          order.deliverDetails.pincode}
                      </span>
                    </div>

                    <div>
                      <p>TrackingID:</p>
                      <span>
                        {order &&
                          order.deliverDetails &&
                          order.deliverDetails.trackingID}
                      </span>
                    </div>

                    <div>
                      <p>Order Name:</p>
                      <span>
                        {order &&
                          order.deliverDetails &&
                          order.deliverDetails.orderName}
                      </span>
                    </div>

                    <div>
                      <p>Quantity:</p>
                      <span>
                        {order &&
                          order.orderItems &&
                          order.orderItems[0] &&
                          order.orderItems[0].quantity}
                      </span>
                    </div>

                    <div>
                      <p>Platform:</p>
                      <span>
                        {order &&
                          order.deliverDetails &&
                          order.deliverDetails.platform}
                      </span>
                    </div>


                    <div>
                      <p>Code:</p>
                      <span>
                        {order &&
                          order.deliverDetails &&
                          order.deliverDetails.code}
                      </span>
                    </div>

                    <div>
                      <p>Amount:</p>
                      <span>
                        {order && order.orderItems && order.orderItems[0].price}
                      </span>
                    </div>
                  </div>

                  <Typography>Order Status</Typography>
                  <div className="orderDetailsContainerBox">
                    <div>
                      <p
                        className={
                          order.orderStatus && order.orderStatus === "Delivered"
                            ? "greenColor"
                            : "redColor"
                        }
                      >
                        {order.orderStatus && order.orderStatus}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="confirmCartItems">
                  <Typography>Order Items:</Typography>
                  <div className="confirmCartItemsContainer">
                    {order.orderItems &&
                      order.orderItems.map((item) => (
                        <div key={item.product}>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>{" "}
                          <span>
                          {item.quantity} X ₹({item.price}+{item.profit}) ={" "}
                          <b>₹{(item.price+item.profit) * item.quantity}</b>
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
              {/*  */}
              <div
                style={{
                  display: order.orderStatus === "Delivered" ? "none" : "block",
                }}
              >
                <form
                  className="updateOrderForm"
                  onSubmit={updateOrderSubmitHandler}
                >
                  <h1>Process Order</h1>

                  <div>
                    <AccountTreeIcon />
                    <select onChange={(e) => setStatus(e.target.value)}>
                      <option value="">Choose Category</option>
                      {order.orderStatus === "Processing" && (
                        <option value="Processing">Processing</option>
                      )}

                      {order.orderStatus === "Processing" && (
                        <option value="Delivered">Delivered</option>
                      )}
                    </select>
                  </div>

                  <Button
                    id="createProductBtn"
                    type="submit"
                    disabled={
                      loading ? true : false || status === "" ? true : false
                    }
                  >
                    Process
                  </Button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default ProcessOrder;
