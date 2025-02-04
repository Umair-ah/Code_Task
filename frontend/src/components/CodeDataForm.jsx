import { useState, useEffect } from "react";
import axios from "axios";

const CodeDataForm = ({onCodeDataAdded, tableCodeType}) => {

  const [showForm, setShowForm] = useState(false)
  const [codeData, setCodeData] = useState({
    user_code: "",
    code_type: null,
    description: "",
    linked_code: null,
    sub_code_type: null
  })

  const [linkedCode, setLinkedCode] = useState([])
  const [subCodeType, setSubCodeType] = useState([])

  const handleCodeData = async ()=>{
    try{
      await axios.post(`http://localhost:5000/api/code_data/new`, { ...codeData, code_type: tableCodeType})
      console.log("New code added successfully! Fetching updated data...");
      setShowForm(false)
      setCodeData({
        user_code: "",
        description: ""
      })
      onCodeDataAdded(); 
      
    }catch(err){
      console.log("err is:", err)
    }
  }

  const displayForm = async()=>{
    setShowForm(true);
    try {
      const resultLimitedLinkedType = await axios.get("http://localhost:5000/api/code_types/limited_linked_type")
      const resultCodeType = await axios.get("http://localhost:5000/api/code_types")


      console.log("resultLimitedLinkedType is",resultLimitedLinkedType.data)
      // console.log("resultCodeType is",resultCodeType.data)


      setLinkedCode(resultLimitedLinkedType.data)
      setSubCodeType(resultCodeType.data)
    } catch (error) {
      console.error(error.message)
    }
  }

  return(
    <div className="my-4">
      <button className="bg-sky-500 hover:bg-sky-400 text-white transition ease-in duration-300" onClick={displayForm}>
        Add Code Data
      </button>

      {showForm && (
        <div className="flex flex-col  ">
          <div className="mt-3 flex justify-items-start gap-5">
            <input
              type="text"
              placeholder="user code"
              className="border p-2"
              value = {codeData.user_code}
              onChange={(e) => {setCodeData({ ...codeData, user_code: e.target.value })}}
              />

            <input
              type="hidden"
              name="code_type"
              value={tableCodeType}
              />

            <input
              type="text"
              placeholder="description"
              className="border p-2"
              value={codeData.description}
              onChange={(e)=>{setCodeData({...codeData, description: e.target.value})}}
              />
          </div>

          <div className="mt-3 flex justify-items-start gap-5">
            {/* <input
              type="text"
              placeholder="Linked Code"
              className="border p-2"
              value={codeData.description}
              onChange={(e)=>{setCodeData({...codeData, linked_code: e.target.value})}}
              /> */}

            <select className="border p-2" onChange={(e) => {setCodeData({...codeData, linked_code: e.target.value})}}>
              <option value="">Linked Code (optional)</option>
              {linkedCode.map((row)=>(
                <option value={row.linked_type}>{row.linked_type_description}</option>
              ))}
            </select>


            {/* <input
              type="text"
              placeholder="Sub Code Type (optional)"
              className="border p-2"
              value={codeData.description}
              onChange={(e)=>{setCodeData({...codeData, description: e.target.value})}}
              /> */}

            <select className="border p-2" onChange={(e) => {setCodeData({...codeData, sub_code_type: e.target.value})}}>
              <option value="">Sub Code Type (optional)</option>
              {subCodeType.map((row)=>(
                <option value={row.code_type}>{row.description}</option>
              ))}
            </select>

          </div>

          <div className="flex items-center justify-between gap-2 my-3">
            <button
              className="bg-sky-500 hover:bg-sky-400 transition ease-in duration-300 text-white p-2"
              onClick={handleCodeData}
              >
              Add
            </button> 

          

            <button
              className="bg-red-500 hover:bg-red-400 transition ease-in duration-300 text-white p-2"
              onClick={()=> setShowForm(false)}
              >
              Close
            </button> 
          </div>


        </div>

      )}
    </div>
  )
}


export default CodeDataForm;