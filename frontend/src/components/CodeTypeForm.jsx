import { useEffect, useState } from "react";
import axios from "axios";

const CodeTypeForm = ({ onCodeTypeAdded })=>{

  const [showAddForm, setShowAddForm] = useState(false)
  const [newCodeType, setNewCodeType] = useState({
    description: ""
  })


  const handleAddCode = async () => {
    try {
      await axios.post("http://localhost:5000/api/code_types/add", newCodeType);
     
      onCodeTypeAdded();
      setShowAddForm(false);
      setNewCodeType({ description: "" }); 
    } catch (error) {
      console.error("Error adding code type:", error);
    }
  };


  return (
    <div>
      <button onClick={() => setShowAddForm(true)} className="bg-sky-500 hover:bg-sky-400 transition ease-in duration-300 text-white p-2">
         Add Code Type
      </button>

      {showAddForm && (
        <div className="p-4 bg-white shadow-md mt-4">
          <h3 className="text-lg font-bold mb-2">Add Code</h3>
          <input
            type="text"
            placeholder="Description"
            className="border p-2  w-full mb-2"
            value={newCodeType.description}
            onChange={(e) => setNewCodeType({ ...newCodeType, description: e.target.value })}
          />
          <div className="flex justify-between">
            <button
              className="bg-sky-500 hover:bg-sky-400 transition ease-in duration-300 text-white p-2 "
              onClick={handleAddCode}
            >
              Save
            </button>
            <button
              className="bg-red-500 hover:bg-red-400 transition ease-in duration-300 text-white p-2 "
              onClick={() => setShowAddForm(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CodeTypeForm;