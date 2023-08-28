import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import url from "./url";
import Postrequest from "./postrequest";
import Getinput from "./input";

function Addtask({ identifier, name1, name2, list, setList, id, setID }) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [isHidden, setIshidden] = useState(null);

  const [description, setDescription] = useState("");

  const Submittask = async (e) => {
    e.preventDefault();
    if (description !== "") {
      const body = { description, name1, name2 };
      Postrequest(`${url}/todo/${identifier}`, body)
        .then((data) => {
          if (data.message === "success") {
            setID(data.id);
            setIshidden(true);
            setDescription("");

            setTimeout(() => {
              setIshidden(null);
            }, 1000);
          } else {
            setIshidden(false);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      handleShow();
    }
  };
  useEffect(() => setID(""));

  return (
    <Form className="text-center mt-1">
      <Form.Group controlId="formBasicEmail">
        <Form.Control
          type="text"
          placeholder="Max 200 characters"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            setIshidden(null);
          }}
        />
      </Form.Group>
      <Button
        variant="dark"
        type="submit"
        onClick={Submittask}
        className="submit"
        style={{ scale: "0.8" }}
      >
        Submit
      </Button>

      {isHidden === true && description === true && (
        <div>
          New chore:{" "}
          <span style={{ color: "blue", fontSize: "1.5em" }}>
            {description}{" "}
          </span>
          added.
        </div>
      )}
      {isHidden === false && <div>Add chore failed. Please try again.</div>}

      <Modal show={show} onHide={handleClose}>
        <Modal.Body className="text-danger ">
          The input cannot be empty.
        </Modal.Body>
      </Modal>
    </Form>
  );
}

export default Addtask;
