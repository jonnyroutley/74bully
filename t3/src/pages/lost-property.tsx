import { Layout } from "@/layouts/layout";

const LostProperty = () => {

  const objects = [1,2,3,4]

  return (
    <Layout>
      <div className="flex justify-center">
        <div className="flex w-full max-w-xl flex-col gap-4">
          <h1 className="font-bold text-4xl">Lost Property</h1>
          <p>Could this be yours? Please collect at your convenience!</p>
          <p className="text-xs">T&Cs apply*</p>
          <div>
            <h2>Add Item</h2>
          </div>
          <div className="flex flex-row gap-4 justify-center flex-wrap">
            {objects.map((object) => (
              <div className="card w-1/3 bg-white flex flex-col flex-grow rounded-md shadow-lg min-h-[200px] p-4 ">
                <div className="flex flex-row items-center justify-between">
                  <h3 className="font-bold text-lg">Item {object}</h3>
                  <p className="font-light text-slate-600 ">12/04/23</p>
                </div>
                <p className="italic">Description of the item</p>
                <p className="text-center mt-8">Photo !</p>
                <p className="mt-auto">Estimated Value: £420.69</p>
              </div>
            ))}

            <p>How about: each photo is just ASCII art of the item, done in plain text P tags</p>
            <p>how</p>
          </div>
          <div className="text-xs">
            <p className="font-bold">*Terms and Conditions:</p>
            <ul className="indent-2 list-decimal list-inside">
              <li>Items will be held for 1 month, after which they will be repossessed by a member of the house</li>
              <li>Withdrawing an item of lost property comes with a handling fee of no less than £100 GBP</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LostProperty;
