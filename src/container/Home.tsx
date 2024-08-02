import Button from "../components/button/Button.tsx";
import { useState, useEffect } from "react";
import Timer from "../components/timer/Timer.tsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "./home.css";
import { Form, ProgressBar } from "react-bootstrap";
import question from "../data/question.json";

const Home = () => {
  interface FormData {
    [key: string]: string;
  }

  const [formData, setFormData] = useState<FormData>(() => {
    const savedFormData = localStorage.getItem("formData");
    return savedFormData ? JSON.parse(savedFormData) : {};
  });

  const [start, setStart] = useState(() => {
    const savedStart = localStorage.getItem("start");
    return savedStart ? JSON.parse(savedStart) : false;
  });

  const [step, setStep] = useState(() => {
    const savedStep = localStorage.getItem("step");
    return savedStep ? parseInt(savedStep, 10) : 0;
  });

  const timeNow = localStorage.getItem("endTime");

  useEffect(() => {
    if (timeNow === null) {
      setStep(12);
    }
  }, [timeNow]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    localStorage.setItem("formData", JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    localStorage.setItem("step", step.toString());
  }, [step]);

  useEffect(() => {
    localStorage.setItem("start", start.toString());
  }, [start]);

  return (
    <div className={"home-container"}>
      {step !== 0 && step !== 12 && (
        <div className={"timer"}>
          <ProgressBar
            now={(step / question.quest.length) * 100}
            className={"progress"}
          />
          <Timer isTick={start} />
          {step !== 11 && `Question ${step} of 10`}
        </div>
      )}

      <div className={"home-content container"}>
        {step === 0 || step === 12 ? (
          <div className={"introduction"}>
            <p>
              {step === 0
                ? "Welcome to our survey! Your feedback is valuable to us. Please take a few moments to answer the following questions."
                : "Thank you for taking the time to complete our survey! Your feedback is greatly appreciated and will help us improve our services."}
            </p>
            <Button
              label={step === 0 ? "Starts" : "Retake Survey"}
              onClick={() => {
                if (step === 0) {
                  setStart(true);
                  setStep(1);
                } else {
                  setStep(0);
                  setFormData({});
                }
              }}
            />
          </div>
        ) : null}
        <div className={"form"}>
          {question.quest.map((e) => {
            if (step === e.step) {
              return (
                <Form.Group controlId="formStep1" key={e.step}>
                  <Form.Label>{e.question}</Form.Label>
                  {e.answer.map((answer) => (
                    <Form.Check
                      id={answer}
                      key={answer}
                      type="radio"
                      name={e.step.toString()}
                      label={answer}
                      value={answer}
                      checked={formData[e.step.toString()] === answer}
                      onChange={handleInputChange}
                      className={"form-radio"}
                    />
                  ))}
                </Form.Group>
              );
            } else {
              return null;
            }
          })}
        </div>
        {step === 11 && <div>Summary</div>}
        <div className={"answer"}>
          {step === 11 &&
            question.quest.map((e, index) => (
              <div className={"answer-content"} key={e.question}>
                <div className={"strip"}>-</div>
                <div className={"answer-summary"}>
                  <p>{e.question}</p>
                  <p>Your answer : {formData[index + 1]}</p>
                </div>
              </div>
            ))}
        </div>
        {step !== 0 && step !== 12 && (
          <Button
            label={step === 11 ? "Submit" : "Next"}
            onClick={() => {
              setStep((prevStep) => prevStep + 1);
            }}
            disabled={step !== 11 ? !formData[step] : false}
          />
        )}
      </div>
    </div>
  );
};

export default Home;
