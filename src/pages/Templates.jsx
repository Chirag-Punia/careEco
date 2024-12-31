import { Card, CardBody, CardFooter, Button, Image } from "@nextui-org/react";

const templates = [
  {
    id: 1,
    name: "Pharmacy Plus",
    image: "https://placehold.co/600x400",
    description: "Modern pharmacy website template with online ordering system",
    industry: "Pharmacy"
  },
  {
    id: 2,
    name: "Beauty Hub",
    image: "https://placehold.co/600x400",
    description: "Elegant cosmetics store template with product showcase",
    industry: "Cosmetics"
  },
 
];

export default function Templates() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 text-center">Website Templates</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card key={template.id} className="hover:shadow-lg transition-shadow">
            <CardBody className="p-0">
              <Image
                src={template.image}
                alt={template.name}
                className="w-full h-48 object-cover"
              />
            </CardBody>
            <CardFooter className="flex flex-col items-start gap-2">
              <h3 className="text-xl font-semibold">{template.name}</h3>
              <p className="text-sm text-gray-600">{template.description}</p>
              <div className="flex justify-between items-center w-full mt-2">
                <span className="text-sm bg-purple-100 text-purple-600 px-2 py-1 rounded">
                  {template.industry}
                </span>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                >
                  Use Template
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}