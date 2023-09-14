import styles from "./style.module.css";

const Form = ({ spreadSheetData }) => {
  const InputComponent = ({ input }) => {
    return (
      <div className={styles.inputContainer}>
        <label className={styles.inputLabel}>{input}</label>
        <input className={styles.input} type="text" />
      </div>
    );
  };

  return (
    <div className={styles.form}>
      {spreadSheetData?.inputs?.userInputs.map((input, index) => {
        return <InputComponent input={input} key={index} />;
      })}
      {spreadSheetData?.inputs?.sellerInputs.map((input, index) => {
        return <InputComponent input={input} key={index} />;
      })}
    </div>
  );
};

export default Form;
