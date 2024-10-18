"use client";

import { ChevronUp, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

const OrderComponent = ({
  data,
  editMode,
}: {
  data: { id: string; name: string }[] | undefined;
  editMode: boolean;
}) => {
  const [list, setList] = useState(data);

  const onListUp = (listIndex: number) => {
    if (!editMode) return;
    if (listIndex <= 0 || list === undefined) return;
    const newList = [...list]; // Create a shallow copy to avoid mutation
    const item = newList[listIndex];
    if (!item) return; // Check for undefined item
    const previousItem = newList[listIndex - 1];
    if (!previousItem) return; // Additional check for undefined
    newList[listIndex] = previousItem;
    newList[listIndex - 1] = item;
    setList(newList);
  };

  const onListDown = (listIndex: number) => {
    if (!editMode) return;
    if (listIndex >= (list?.length ?? 0) - 1 || list === undefined) return;
    const newList = [...list]; // Create a shallow copy to avoid mutation
    const item = newList[listIndex];
    if (!item) return; // Check for undefined item
    const nextItem = newList[listIndex + 1];
    if (!nextItem) return; // Additional check for undefined
    newList[listIndex] = nextItem;
    newList[listIndex + 1] = item;
    setList(newList);
  };
  useEffect(() => {
    if (!editMode) {
      setList(data);
    }
  }, [data, editMode]);
  if (!list) {
    return null;
  }
  return (
    <div className="flex flex-col gap-2">
      {list.map((i, index) => (
        <div key={i.id} className="flex items-center gap-3 rounded border p-3">
          {editMode && (
            <div>
              <ChevronUp
                className="h-4 w-4 p-0"
                onClick={() => {
                  onListUp(index);
                }}
              />
              <ChevronDown
                className="h-4 w-4 p-0"
                onClick={() => {
                  onListDown(index);
                }}
              />
            </div>
          )}
          <div className="text-lg font-semibold">
            {index + 1} - {i.name}
          </div>
        </div>
      ))}{" "}
    </div>
  );
};

export default OrderComponent;
