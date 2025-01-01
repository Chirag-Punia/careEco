import { useState } from "react";
import { Card, Button, Input, Textarea, Select, SelectItem } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { generateWebsite } from "../services/api";

const steps = ["Business Info", "Design Preferences", "Products"];

export default function CreateWebsite() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      products: [{ name: "", price: "", description: "", image: null }],
    },
  });
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    console.log("Submitting data:", data);
    try {
      setIsLoading(true);
      
     
      const formData = new FormData();
      
     
      formData.append("businessName", data.businessName);
      formData.append("description", data.description);
      formData.append("colorTheme", data.colorTheme);
      formData.append("layout", data.layout); 
      formData.append("email", data.email);
      formData.append("phone", data.phone);
  
     
      data.products.forEach((product, index) => {
        formData.append(`products[${index}][name]`, product.name);
        formData.append(`products[${index}][price]`, product.price);
        formData.append(`products[${index}][description]`, product.description);
        if (product.image) {
          formData.append("images", product.image);
        }
      });
  
     
      const result = await generateWebsite(formData);
      toast.success(`Website generated successfully! Visit: ${result.websiteUrl}`);
      navigate("/templates");
    } catch (error) {
      toast.error(`Failed to generate website: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const renderFields = () => {
    if (currentStep === 0) {
      return (
        <div className="space-y-4">
          <Input
            label="Business Name"
            placeholder="Enter your business name"
            {...register("businessName", { required: true })}
          />
          <Input
            label="Contact Email"
            type="email"
            placeholder="contact@business.com"
            {...register("email", { required: true })}
          />
          <Input
            label="Phone Number"
            type="tel"
            placeholder="(123) 456-7890"
            {...register("phone", { required: true })}
          />
          <Textarea
            label="Business Description"
            placeholder="Tell us about your business..."
            {...register("description", { required: true })}
          />
        </div>
      );
    }
     else if (currentStep === 1) {
      return (
        <div className="space-y-4">
          <Select
  label="Color Theme"
  placeholder="Choose your color theme"
  {...register("colorTheme", { required: true })}
>
  <SelectItem key="purple-blue">Purple & Blue</SelectItem>
  <SelectItem key="green-teal">Green & Teal</SelectItem>
  <SelectItem key="orange-red">Orange & Red</SelectItem>
</Select>


          <Select
            label="Layout Style"
            placeholder="Choose your layout style"
            {...register("layout", { required: true })}
          >
            <SelectItem key="abcd">Default</SelectItem>
            <SelectItem key="modern">Modern</SelectItem>
            <SelectItem key="classic">Classic</SelectItem>
            <SelectItem key="minimal">Minimal</SelectItem>
          </Select>
        </div>
      );
    } else if (currentStep === 2) {
      const products = watch("products");

      const addProduct = () => {
        const updatedProducts = [...products, { name: "", price: "", description: "", image: null }];
        setValue("products", updatedProducts);
      };

      const handleImageChange = (e, index) => {
        const file = e.target.files[0];
        const updatedProducts = [...products];
        updatedProducts[index].image = file;
        setValue("products", updatedProducts);
      };

      return (
        <div className="space-y-6">
          {products.map((product, index) => (
            <div key={index} className="space-y-4 p-4 border rounded-lg">
              <Input
                label="Product Name"
                placeholder="Enter product name"
                {...register(`products.${index}.name`, { required: true })}
                fullWidth
              />
              <Input
                label="Price"
                type="number"
                placeholder="Enter price"
                {...register(`products.${index}.price`, { required: true })}
                fullWidth
              />
              <Input
                label="Description"
                placeholder="Enter product description"
                {...register(`products.${index}.description`, { required: true })}
                fullWidth
              />
              <Input
                label="Product Image"
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, index)}
                fullWidth
              />
              {product.image && (
                <div className="mt-2">
                  <img
                    src={URL.createObjectURL(product.image)}
                    alt={`Product ${index + 1}`}
                    className="h-20 w-20 object-cover rounded"
                  />
                </div>
              )}
            </div>
          ))}

          <Button
            type="button"
            onPress={addProduct}
            className="w-full bg-gray-100"
          >
            Add Another Product
          </Button>
        </div>
      );
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center">Create Your Website</h1>

      <div className="flex justify-between mb-8">
        {steps.map((step, index) => (
          <div
            key={step}
            className={`flex-1 text-center ${
              index === currentStep ? "text-purple-600 font-bold" : "text-gray-400"
            }`}
          >
            {step}
          </div>
        ))}
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {renderFields()}

          <div className="flex justify-between mt-8">
            <Button
              type="button"
              onPress={prevStep}
              className="bg-gray-100"
              isDisabled={currentStep === 0 || isLoading}
            >
              Previous
            </Button>

            {currentStep === steps.length - 1 ? (
              <Button
                type="submit"
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                isLoading={isLoading}
              >
                Create Website
              </Button>
            ) : (
              <Button
                type="button"
                onPress={nextStep}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                isDisabled={isLoading}
              >
                Next
              </Button>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
}