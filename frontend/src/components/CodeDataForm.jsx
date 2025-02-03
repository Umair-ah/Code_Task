import { useState } from "react";
import axios from "axios";

const CodeDataForm = ({onCodeDataAdded}) => {

  const [showForm, setShowForm] = useState(false)
  const [codeData, setCodeData] = useState({
    user_code: "",
    description: ""
  })

  const handleCodeData = async ()=>{
    try{
      await axios.post("http://localhost:5000/api/code_data/new", codeData)
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

  return(
    <div className="my-4">
      <button className="bg-sky-500 hover:bg-sky-400 text-white transition ease-in duration-300" onClick={()=>{setShowForm(true)}}>
        Add Code Data
      </button>

      {showForm && (
        <div className="flex justify-evenly items-center ">
          <input
            type="text"
            placeholder="user code"
            className="border p-2 my-4"
            value = {codeData.user_code}
            onChange={(e) => {setCodeData({ ...codeData, user_code: e.target.value })}}
          />

          <input
            type="text"
            placeholder="description"
            className="border p-2 my-4"
            value={codeData.description}
            onChange={(e)=>{setCodeData({...codeData, description: e.target.value})}}
          />

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

      )}
    </div>
  )
}


export default CodeDataForm;