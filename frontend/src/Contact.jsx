import InputFields from "./Components/InputFields";
import { useState } from "react";
import axios from "axios";
import validator from "email-validator";
import config from "./config";
import FlipLink from "./Components/FlipLink";

export default function Contact() {
  const [inputState, setInputState] = useState(() => ({
    name: "",
    email: "",
    message: "",
  }));
  const [errors, setErrors] = useState(() => ({
    emailError: "",
    nameError: "",
    messageError: "",
    serverError: "",
  }));
  const [btn, setBtn] = useState(() => "Send Message");
  const [isBtnDisabled, setIsBtnDisabled] = useState(() => false);
  const [successMessage, setSuccessMessage] = useState(() => "");
  const sendMessage = async (e) => {
    e.preventDefault();
    let inputErrors = { ...errors, serverError: "" };
    if (inputState.name.length <= 2) {
      inputErrors = {
        ...inputErrors,
        nameError: "Name should be at least 3 characters long",
      };
    } else {
      inputErrors = { ...inputErrors, nameError: "" };
    }
    if (!validator.validate(inputState.email)) {
      inputErrors = { ...inputErrors, emailError: "Email is invalid" };
    } else {
      inputErrors = { ...inputErrors, emailError: "" };
    }
    if (inputState.message.length <= 10) {
      inputErrors = {
        ...inputErrors,
        messageError: "Message should be at least 10 characters long",
      };
    } else {
      inputErrors = { ...inputErrors, messageError: "" };
    }
    setErrors(inputErrors);
    if (
      inputErrors.nameError === "" &&
      inputErrors.emailError === "" &&
      inputErrors.messageError === "" &&
      inputErrors.serverError === ""
    ) {
      setBtn(
        <div>
          <span
            className="spinner-grow spinner-grow-sm"
            role="status"
            aria-hidden="true"
          ></span>
          <span style={{ marginLeft: "6px" }}>Loading...</span>
        </div>
      );
      setIsBtnDisabled(true);
      try {
        await axios.post(
          `${config.backend_url}/contact/new/message`,
          inputState
        );
        setBtn(
          <>
            Message Sent <i className="bi bi-check-lg"></i>
          </>
        );
        setSuccessMessage(
          `We have received your message. We will get in touch with you as soon as possible.`
        );
      } catch (error) {
        setErrors(() => ({
          ...inputErrors,
          serverError: "Unable to send the message due to some server error",
        }));
        setBtn("Send Message");
        setIsBtnDisabled(false);
      }
    }
  };
  return (
    <div className="contact-main-div">
      <div className="container-fluid contact-secondary-div m-background">
        <h2 className="m-secondary-heading">CONTACT OUR TEAM</h2>
        <form>
          <InputFields
            input_className="m-authentication-fields"
            key="name"
            inputState={inputState}
            name="name"
            errorState={errors}
            error="nameError"
            type="text"
            margin="mb-3"
            placeholder="Full Name"
            setInputState={setInputState}
          />
          <InputFields
            input_className="m-authentication-fields"
            key="email"
            inputState={inputState}
            name="email"
            errorState={errors}
            error="emailError"
            type="email"
            margin="mb-3"
            placeholder="Email"
            setInputState={setInputState}
          />
          <div className="form-floating mb-2">
            <textarea
              style={{ height: "100px" }}
              className="form-control m-authentication-fields"
              placeholder="Your Message"
              id="floatingTextarea"
              onChange={(e) =>
                setInputState((prev) => ({ ...prev, message: e.target.value }))
              }
            ></textarea>
            <label for="floatingTextarea" className="m-label">
              Your Message
            </label>
            <span className="error">{errors.messageError}</span>
          </div>
          <span className="error mt-2" style={{ textAlign: "center" }}>
            {errors.serverError}
          </span>
          <span className="success mt-2" style={{ textAlign: "center" }}>
            {successMessage}
          </span>
          {!isBtnDisabled ? (
            <FlipLink
              className="m-get-started-btn"
              buttonText={btn}
              onClick={sendMessage}
              type="submit"
            />
          ) : (
            <button className="m-get-started-btn not-fliplink" disabled={true}>
              {btn}
            </button>
          )}

          <p className="mb-0 mt-2 text-center">
            <strong>Note</strong>: It can take us upto 48 hours to get back to
            you.
          </p>
        </form>
      </div>
    </div>
  );
}
