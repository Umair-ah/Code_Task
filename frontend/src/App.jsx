import { useEffect, useState } from "react";
import { Pencil, Trash, Search, Check, X, PlusCircle } from "lucide-react";

import axios from "axios";
import CodeTypeForm from './components/CodeTypeForm';
import CodeDataForm from "./components/CodeDataForm";


function App() {
  const [searchCodeType, setSearchCodeType] = useState("");

  const [filteredCodeTypes, setFilteredCodeTypes] = useState([])
  const [codeTypes, setCodeTypes] = useState([]);
  const [codeData, setCodeData] = useState([]);
  const [editingRow, setEditingRow] = useState(null);
  const [editValues, setEditValues] = useState({});

  const [editingTypeRow, setEditingTypeRow] = useState(null);
  const [editingTypeValue, setEditingTypeValue] = useState({})



  useEffect(() => {
    fetchCodeTypes();
    fetchCodeDatas();
  }, []);

  const fetchCodeTypes = async ()=> {
    try{
      const response = await axios.get("http://localhost:5000/api/code_types");
      setCodeTypes(response.data)
      setFilteredCodeTypes(response.data)
    }catch(err){
      console.error(err)
    }
  }

  const fetchCodeDatas = async () => {
    console.log("fetchCodeDatas function called"); 
    try {
      const response = await axios.get("http://localhost:5000/api/code_data");
      setCodeData(response.data)
    } catch (err) {
      console.error("Error fetching code data:", err);
    }
  };
  

  const handleEdit = (index, row) => {
    setEditingRow(index);
    setEditValues({ ...row });
  };

  const handleTypeEdit = (index, row) => {
    setEditingTypeRow(index);
    setEditingTypeValue({...row})
  }

  const handleDelete = async (index, row) => {
    try{
      const response = await axios.delete(`http://localhost:5000/api/code_data/delete/${row.code}`)
      const updatedData = await axios.get("http://localhost:5000/api/code_data")
      setCodeData(updatedData.data)
    } catch(error) {
      console.error("Error is this:", error);
    }
  }

  const handleTypeDelete = async (index, row) => {
    try{
      const response = await axios.delete(`http://localhost:5000/api/code_types/delete/${row.code_type}`)
      const updatedData = await axios.get("http://localhost:5000/api/code_types")
      setCodeTypes(updatedData.data)
      setFilteredCodeTypes(updatedData.data)
    } catch(error) {
      console.error("Error is this:", error);
    }
  }

  const handleChange = (e, field) => {
    setEditValues({ ...editValues, [field]: e.target.value });
  };

  const handleTypeChange = (e, field) => {
    setEditingTypeValue({ ...editingTypeValue, [field]: e.target.value });
    console.log(editingTypeValue)
  };

  const handleSave = async (id) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/code_data/update/${id}`, editValues);
      
      const updatedData = await axios.get("http://localhost:5000/api/code_data")
      setCodeData(updatedData.data);
  
      setEditingRow(null);
    } catch (error) {
      console.error("Error updating code:", error);
    }
  };

  const handleTypeSave = async(id) => {

    try{
      await axios.post(`http://localhost:5000/api/code_types/update/${id}`, editingTypeValue)

      const updatedData = await axios.get("http://localhost:5000/api/code_types")
      setCodeTypes(updatedData.data)
      setFilteredCodeTypes(updatedData.data)


      setEditingTypeRow(null);
      

    }catch(err){
      console.error("Axios Error:", err.response ? err.response.data : err.message);

    }
  }

  const searchQueryCodeType = () => {
    if (!searchCodeType) {
      setFilteredCodeTypes(codeTypes);
      return;
    }
  
    const filtered = codeTypes.filter((item) =>
      item.description.toLowerCase().includes(searchCodeType.toLowerCase())
    );
  
    setFilteredCodeTypes(filtered);
  };

  return (
    <div className="ml-[300px] flex p-4">
  
      <div className=" bg-gray-100 p-4 rounded-lg shadow-lg">
        <div className="flex items-center mb-4">
          <input
            type="text"
            placeholder="Search Code Type"
            className="border p-2  w-full"
            value={searchCodeType}
            onChange={(e) => setSearchCodeType(e.target.value)}
          />
          <button className="ml-2 p-2 bg-sky-500 text-white" onClick={searchQueryCodeType}>
            <Search size={16} />
          </button>
        </div>

        <CodeTypeForm fetchCodeTypes = {fetchCodeTypes} />

        <table className="w-full my-3">
          <thead className="text-sky-500">
            <tr>
              <th className="p-2 text-left">Type</th>
              <th className="p-2 text-left">Description</th>
              <th className="p-2 text-left">Linked Type</th>
            </tr>
          </thead>
          <tbody>
            {filteredCodeTypes.map((row, index) => (
              <tr key={index}>
                { editingTypeRow === index ? (
                <>
                  <td>
                    {row.code_type}
                  </td>

                  <td>
                    <input
                      className="p-2 bg-white"
                      value = {editingTypeValue.description}
                      onChange={(e) => {handleTypeChange(e, "description")}}
                    />
                  </td>

                  <td className="border p-2">
                    <select
                      
                      onChange={(e) => handleTypeChange(e, "linked_type")}
                    >
                      <option value={codeTypes.find((cT)=> cT.code_type == row.linked_type)?. code_type || ''}>{codeTypes.find((cT)=> cT.code_type == row.linked_type)?. description || ''}</option>
                      {codeTypes.map((cT)=>(
                        <option value={cT.code_type}>{cT.description}</option>
                      ))}
                    </select>
                  </td>
                  <td className="p-2 flex gap-2">
                    <button className="p-1 text-green-500" onClick={() => handleTypeSave(row.code_type)}>
                      <Check size={16} />
                    </button>
                    <button className="p-1 text-red-500" onClick={() => setEditingTypeRow(null)}>
                      <X size={16} />
                    </button>
                  </td>
                </>
                ) : (
                <>
                  <td className="border p-2">
                    {row.code_type}
                  </td>
                  <td className="border p-2">
                    {row.description}
                  </td>
                  <td className="border p-2">
                    {codeTypes.find((cT)=> cT.code_type == row.linked_type)?. description || ""}
                  </td>
                  <td className="border p-2 flex gap-2">
                    <button className="p-1 text-sky-500" onClick={() => handleTypeEdit(index, row)}>
                      <Pencil size={16} />
                    </button>
                    <button className="p-1 text-red-500" onClick={() => handleTypeDelete(index, row)}>
                      <Trash size={16} />
                    </button>
                  </td>
                </>
                )
                }
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    
      <div className="flex-1 ml-4 bg-white p-4 rounded-lg shadow-lg">
      <CodeDataForm onCodeDataAdded = {fetchCodeDatas}/>
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2 text-left">User Code</th>
              <th className="border p-2 text-left">Description</th>
              <th className="border p-2 text-left">Linked Code</th>
              <th className="border p-2 text-left">Linked Desc</th>
              <th className="border p-2 text-left">SubType Code</th>
              <th className="border p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {codeData.map((row, index) => (
              <tr key={index} className="border-b hover:bg-gray-100">
                {editingRow === index ? (
                  <>
                    <td className="border p-2">
                      <input type="text" value={editValues.user_code} onChange={(e) => handleChange(e, "user_code")} className="border p-1 rounded w-full" />
                    </td>
                    <td className="border p-2">
                      <input type="text" value={editValues.description} onChange={(e) => handleChange(e, "description")} className="border p-1 rounded w-full" />
                    </td>
                    <td className="border p-2">
                      <input type="text" value={editValues.linked_code} onChange={(e) => handleChange(e, "linked_code")} className="border p-1 rounded w-full" />
                    </td>
                    <td className="border p-2">
                      <input type="text" value={editValues.linked_desc} onChange={(e) => handleChange(e, "linked_desc")} className="border p-1 rounded w-full" />
                    </td>
                
                    <td className="border p-2">
                      <select
                        value={editValues.sub_code_type || ""}
                        onChange={(e) => handleChange(e, "sub_code_type")}
                        className="border p-1 rounded w-full"
                      >
                        <option value="">Select Code Type</option>
                        {codeTypes.map((code) => (
                          <option key={code.code_type} value={code.code_type}>
                            {code.description}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="border p-2 flex gap-2">
                      <button className="p-1 text-green-500" onClick={() => handleSave(row.code)}>
                        <Check size={16} />
                      </button>
                      <button className="p-1 text-red-500" onClick={() => setEditingRow(null)}>
                        <X size={16} />
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="border p-2">{row.user_code}</td>
                    <td className="border p-2">{row.description}</td>
                    <td className="border p-2">{row.linked_code}</td>
                    <td className="border p-2">{row.linked_desc}</td>
                    <td className="border p-2">
                      {codeTypes.find((cT) => cT.code_type == row.sub_code_type)?. description || "N/A"}
                    </td>
                    <td className="border p-2 flex gap-2">
                      <button className="p-1 text-sky-500" onClick={() => handleEdit(index, row)}>
                        <Pencil size={16} />
                      </button>
                      <button className="p-1 text-red-500" onClick={() => handleDelete(index, row)}>
                        <Trash size={16} />
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    

  )
}

export default App;
