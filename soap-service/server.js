const express = require("express");
const soap = require("soap");
const cors = require("cors"); // Import the CORS package
const xml = require("fs").readFileSync("./service.wsdl", "utf8");

// Define the service logic
const service = {
  GeometryService: {
    GeometryServiceSoapPort: {
      calculateArea: function (args) {
        const { shape, ...dimensions } = args;
        let area = 0;

        switch (shape) {
          case "square":
            area = dimensions.side * dimensions.side;
            break;
          case "rectangle":
            area = dimensions.length * dimensions.width;
            break;
          case "circle":
            area = Math.PI * dimensions.radius * dimensions.radius;
            break;
          default:
            throw new Error("Invalid shape");
        }

        return { result: area };
      },
    },
  },
};

// Set up the Express server
const app = express();

// Enable CORS for all routes
app.use(cors());

// Start the server
app.listen(8000, () => {
  console.log("SOAP service running on http://localhost:8000");
});

// Create the SOAP server
soap.listen(app, "/geometry", service, xml);
