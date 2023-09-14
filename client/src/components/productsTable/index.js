import React, { useState } from "react";
import styles from "./styles.module.css";
import { convertColorToRGBA } from "../../utils";

const ProductsTable = ({ spreadSheetData, setSpreadSheetData }) => {
  const [totalPrice, setTotalPrice] = useState(0);
  const [weeklyPayment, setWeeklyPayment] = useState(0);

  const handleQuantityChange = (e, index) => {
    if (e.target.value < 0) return;

    setSpreadSheetData((prevState) => {
      const updatedProducts = [...prevState.products];
      updatedProducts[index].quantity = e.target.value;
      return { ...prevState, products: updatedProducts };
    });
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    calculateTotalPrice();
  };

  const calculateTotalPrice = () => {
    let price = spreadSheetData.products.reduce((acc, product) => {
      return acc + product.quantity * product.totalPrice;
    }, 0);

    const weeklyPayment = spreadSheetData.products.reduce((acc, product) => {
      return acc + product.quantity * product.weeklyPayment;
    }, 0);

    price = ((weeklyPayment * 156) / 2.2 + price).toFixed(2);
    setTotalPrice(price);
    setWeeklyPayment(weeklyPayment);
  };

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th scope="col">Item Description</th>
          <th scope="col">Quantity</th>
        </tr>
      </thead>
      <tbody className={styles.table}>
        {spreadSheetData?.products?.map((product, index) => {
          const { bgColor, name } = product;

          const rgbaColor = convertColorToRGBA(bgColor);
          return (
            <tr
              key={name}
              className={styles.productContainer}
              style={{ backgroundColor: rgbaColor }}
            >
              <td className={styles.productName}>{name}</td>
              <td className={styles.productQuantity}>
                <input
                  type="number"
                  className={styles.quantityInput}
                  min={0}
                  value={spreadSheetData.products[index].quantity}
                  onChange={(e) => handleQuantityChange(e, index)}
                  placeholder="Enter Quantity"
                  required
                />
              </td>
            </tr>
          );
        })}
        <tr className={styles.productContainer}>
          <td className={styles.productName}>Total</td>
          <td className={styles.productQuantity}>
            <input
              type="string"
              className={styles.quantityInput}
              value={totalPrice}
              placeholder="Click Calculate To calculate Total"
              disabled
            />
          </td>
        </tr>
        <tr className={styles.productContainer}>
          <td className={styles.productName}>Weekly Payment</td>
          <td className={styles.productQuantity}>
            <input
              type="string"
              className={styles.quantityInput}
              value={weeklyPayment}
              placeholder="Click Calculate To calculate Weekly Payment"
              disabled
            />
          </td>
        </tr>
        <tr>
          <td>
            <button
              type="button"
              onClick={window.print}
              className={styles.printBtn}
            >
              Print PDF
            </button>
          </td>
          <td>
            <button
              onClick={(e) => onSubmitHandler(e)}
              className={styles.calculateBtn}
            >
              Calculate Total
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default ProductsTable;
