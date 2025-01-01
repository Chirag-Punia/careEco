import {
  Card,
  Input,
  Select,
  SelectItem,
  Button,
  Textarea,
} from "@nextui-org/react";
import { useForm } from "react-hook-form";

const industries = [
  { value: "pharmacy", label: "Pharmacy" },
  { value: "cosmetics", label: "Cosmetics" },
];

const colorThemes = [
  { value: "purple-blue", label: "Purple & Blue" },
  { value: "green-teal", label: "Green & Teal" },
  { value: "orange-red", label: "Orange & Red" },
];

export default function Generator() {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    data;
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center">Website Generator</h1>

      <Card className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <Input
              label="Business Name"
              placeholder="Enter your business name"
              {...register("businessName")}
              isRequired
            />

            <Select
              label="Industry"
              placeholder="Select your industry"
              {...register("industry")}
              isRequired
            >
              {industries.map((industry) => (
                <SelectItem key={industry.value} value={industry.value}>
                  {industry.label}
                </SelectItem>
              ))}
            </Select>

            <Select
              label="Color Theme"
              placeholder="Choose your color theme"
              {...register("colorTheme")}
              isRequired
            >
              {colorThemes.map((theme) => (
                <SelectItem key={theme.value} value={theme.value}>
                  {theme.label}
                </SelectItem>
              ))}
            </Select>

            <Textarea
              label="Business Description"
              placeholder="Enter a brief description of your business"
              {...register("description")}
              isRequired
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white"
          >
            Generate Website
          </Button>
        </form>
      </Card>
    </div>
  );
}
