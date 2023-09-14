import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { toast } from "react-toastify";
import Form from "../../components/form";
import ProductsTable from "../../components/productsTable";

const Home = () => {
  const [spreadSheetData, setSpreadSheetData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:8080/Freelance_Assignment/server/")
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) {
          throw new Error("Data not found!");
        }
        let finalProducts = data?.products.map((product) => {
          const { name, bgColor, totalPrice, weeklyPayment } = product;
          return {
            name,
            bgColor,
            quantity: 0,
            totalPrice,
            weeklyPayment,
          };
        });

        data.products = finalProducts;
        setSpreadSheetData(data);
      })
      .catch((e) => {
        console.log(e.message);
        toast.error(e.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return "Loading...";

  return (
    <form>
      <div className={styles.formContainer}>
        <Form spreadSheetData={spreadSheetData} />
      </div>
      <div className={styles.tableContainer}>
        <ProductsTable
          spreadSheetData={spreadSheetData}
          setSpreadSheetData={setSpreadSheetData}
        />
      </div>
    </form>
  );
};

export default Home;
