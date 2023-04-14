import { Layout } from "@/layouts/layout";
import { api } from "@/utils/api";
import { useState } from "react";
import { toast } from "react-hot-toast";
// import { check, x-mark} from "react"
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";

const ShoppingList = () => {
  const [item, setItem] = useState<string>("");

  const new_item = api.shopping.create.useMutation({
    onSuccess: () => {
      toast.success("Item added");
      void items.refetch();
    },
  });
  const items = api.shopping.getAll.useQuery();
  const delete_item = api.shopping.delete.useMutation({
    onSuccess: () => {
      toast.success("Item deleted");
      void items.refetch();
    },
  });

  const update_item = api.shopping.update.useMutation({
    onSuccess: () => {
      toast.success("Item updated");
      void items.refetch();
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    new_item.mutate({ name: item });
    setItem("");
    void items.refetch();
  };

  const deleteItem = (id: string) => {
    delete_item.mutate({ id });
  };

  const updateItem = (id: string, completed: boolean) => {
    update_item.mutate({ id, completed });
  };

  return (
    <Layout>
      <div className="flex justify-center">
        <div className="flex w-full max-w-xl flex-col gap-4">
          <h1 className="text-4xl font-bold">Shopping List</h1>
          <p>Ayo pick this up</p>
          <form onSubmit={(e) => handleSubmit(e)}>
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="New Item"
                className="flex-1 rounded-lg px-4 py-2 shadow-md"
                value={item}
                required
                onChange={(e) => setItem(e.target.value)}
              />
              <button
                type="submit"
                className="rounded-lg bg-purple-500 hover:bg-purple-600 px-4 py-2 text-white shadow-md"
              >
                Add Item
              </button>
            </div>
          </form>
          <div className="bg- flex flex-col rounded-lg bg-white px-2 pt-1 pb-4 shadow-md">
            {items.data &&
              items.data?.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border-b border-slate-400 py-3 mx-2"
                >
                  <p className="flex flex-row items-center ">
                    <span className="px-2">
                    {item.completed ? (
                      <CheckIcon className="flex h-5 w-5" />
                      ) : (
                        <XMarkIcon className="flex h-5 w-5" />
                        )}
                    </span>
                    <span className="">
                    {item.name}
                    </span>
                  </p>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => updateItem(item.id, !item.completed)}
                    >
                      {!item.completed ? (
                        <p className="flex flex-row rounded-md bg-blue-400 hover:bg-blue-500 text-white px-2 text-xs font-semibold">
                          <CheckIcon className="h-4 w-4" />
                          Complete
                        </p>
                      ) : (
                        <p className="rounded-md bg-slate-100 hover:bg-slate-200 px-2 py-1 text-xs font-semibold">
                          Undo
                        </p>
                      )}
                    </button>
                    <button onClick={() => deleteItem(item.id)}>
                      <XMarkIcon className="h-6 w-8 rounded-md bg-red-500 hover:bg-red-600 text-white" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ShoppingList;
