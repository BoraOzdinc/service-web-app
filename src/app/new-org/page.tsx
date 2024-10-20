"use client";
import { useState } from "react";
import { Button } from "../_components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../_components/ui/card";
import { Input } from "../_components/ui/input";
import { Label } from "../_components/ui/label";
import { useCreateOrg } from "~/utils/useOrg";
import { useRouter } from "next/navigation";

const NewOrg = () => {
  const router = useRouter();
  const [name, setName] = useState<string | undefined>(undefined);
  const createOrg = useCreateOrg();
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>New Organization</CardTitle>
        <CardDescription>Create a new organization</CardDescription>
      </CardHeader>
      <CardContent className="">
        <Label>Organization Name</Label>
        <Input
          placeholder="name..."
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
      </CardContent>
      <CardFooter>
        <Button
          disabled={!name}
          onClick={() => {
            if (name)
              createOrg.mutate(
                { name },
                {
                  onSuccess: (data) => {
                    router.push(`/settings/${data.id}`);
                  },
                },
              );
          }}
        >
          Confirm
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NewOrg;
