import React, { useState } from "react";
import axios from "axios";

function App() {
  const [shape, setShape] = useState("");
  const [dimensions, setDimensions] = useState({});
  const [result, setResult] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDimensions({ ...dimensions, [name]: parseFloat(value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const soapRequest = `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:geo="http://example.com/geometry">
         <soapenv:Header/>
         <soapenv:Body>
            <geo:calculateAreaRequest>
               <shape>${shape}</shape>
               ${Object.entries(dimensions)
                 .map(([key, value]) => `<${key}>${value}</${key}>`)
                 .join("")}
            </geo:calculateAreaRequest>
         </soapenv:Body>
      </soapenv:Envelope>
    `;

    try {
      const response = await axios.post(
        "http://localhost:8000/geometry",
        soapRequest,
        {
          headers: { "Content-Type": "text/xml" },
        }
      );

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(response.data, "application/xml");
      const result = xmlDoc.getElementsByTagName("result")[0].textContent;
      setResult(result);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Calculate Area</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Shape:
          <select
            name="shape"
            onChange={(e) => setShape(e.target.value)}
            required
          >
            <option value="">Select Shape</option>
            <option value="square">Square</option>
            <option value="rectangle">Rectangle</option>
            <option value="circle">Circle</option>
          </select>
        </label>
        <br />
        {shape === "square" && (
          <label>
            Side:
            <input type="number" name="side" onChange={handleChange} required />
          </label>
        )}
        {shape === "rectangle" && (
          <>
            <label>
              Length:
              <input
                type="number"
                name="length"
                onChange={handleChange}
                required
              />
            </label>
            <br />
            <label>
              Width:
              <input
                type="number"
                name="width"
                onChange={handleChange}
                required
              />
            </label>
          </>
        )}
        {shape === "circle" && (
          <label>
            Radius:
            <input
              type="number"
              name="radius"
              onChange={handleChange}
              required
            />
          </label>
        )}
        <br />
        <button type="submit">Calculate</button>
      </form>
      {result && <h2>Area: {result}</h2>}
    </div>
  );
}

export default App;
