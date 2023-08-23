import { useRef, useState, useEffect } from "react";
export default function Getinput({ labeltext, placeholdertext, idtext, next }) {
  const [value, setValue] = useState("");
  const ref = useRef();

  useEffect(() => {
    next(ref.current.value);
  }, [value]);
  return (
    <div
      className="input"
      style={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <label
        style={{
          color: "black",
          textShadow:
            "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
        }}
      >
        {labeltext}
      </label>
      <input
        type="text"
        className="form-control m-2"
        id={idtext}
        ref={ref}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholdertext}
      />
      <small id="usernameerror" className="text-danger form-text"></small>
    </div>
  );
}
