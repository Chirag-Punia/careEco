import { Button, Card, CardBody } from "@nextui-org/react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Create Professional Websites in Minutes
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Industry-specific templates that save you time and effort
        </p>
        <Button
          as={Link}
          to="/create"
          size="lg"
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold"
        >
          Start Creating
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <Card className="bg-purple-50">
          <CardBody>
            <h3 className="text-xl font-semibold mb-2">Pharmacy Websites</h3>
            <p className="text-gray-600">
              Complete solution for pharmacies with online ordering and inventory management
            </p>
          </CardBody>
        </Card>

        <Card className="bg-blue-50">
          <CardBody>
            <h3 className="text-xl font-semibold mb-2">Cosmetics Stores</h3>
            <p className="text-gray-600">
              Beautiful templates for cosmetics and beauty products
            </p>
          </CardBody>
        </Card>

        <Card className="bg-indigo-50">
          <CardBody>
            <h3 className="text-xl font-semibold mb-2">Custom Solutions</h3>
            <p className="text-gray-600">
              Tailored websites for your specific industry needs
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}