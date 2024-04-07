"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { Button } from "./ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "./ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { type Noop } from "react-hook-form";

interface Props {
  data: { value: string; label: string }[] | undefined;
  name: string;
  value: string;
  onChange: (...event: unknown[]) => void;
  onBlur?: Noop;
}
export default function ComboBox({
  data,
  name,
  onChange,
  value,
  onBlur,
}: Props) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className=" justify-between"
          disabled={!data}
          name={name}
        >
          {value ? data?.find((d) => d.value === value)?.label : "Seçin"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className=" p-0">
        <Command>
          <CommandInput placeholder="Arama" />
          <CommandEmpty>Sonuç Yok</CommandEmpty>
          <CommandGroup>
            {data?.map((d) => {
              const tick = value === d.value ? "opacity-100" : "opacity-0";
              return (
                <CommandItem
                  key={d.value}
                  value={d.label}
                  onSelect={() => {
                    onChange(d.value === value ? "" : d.value);
                    setOpen(false);
                  }}
                  onBlur={onBlur}
                >
                  <Check className={`mr-2 h-4 w-4 ${tick}`} />
                  {d.label}
                </CommandItem>
              );
            })}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
