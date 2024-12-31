import { Card, CardBody, CardFooter, Button } from "@nextui-org/react";
import { FaEdit, FaTrash } from 'react-icons/fa';

const WebsiteCard = ({ website, onDelete }) => {
  return (
    <Card className="w-full">
      <CardBody>
  <h3 className="text-xl font-semibold mb-2">{website.businessName}</h3>
  <p className="text-gray-600">{website.description}</p>
  <a className="text-blue-600" href={website.websiteUrl}>Visit</a>
  {website.images && website.images.length > 0 && (
    <div className="mt-4">
      <img 
        src={website.images[0]} 
        alt="Website preview" 
        className="w-20 h-20 object-cover rounded-md"
      />
    </div>
  )}
</CardBody>
      <CardFooter className="flex justify-end gap-2">
        <Button
          size="sm"
          variant="bordered"
          startContent={<FaTrash />}
          className="text-red-600"
          onPress={() => onDelete(website._id)}
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WebsiteCard;