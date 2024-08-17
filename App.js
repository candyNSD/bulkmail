import { useState } from "react";
import axios from "axios";
import * as XLSX from 'xlsx';

function App() {
  const [msg, setMsg] = useState("");
  const [status, setStatus] = useState(false);
  const [emailList, setEmailList] = useState([])

  const handlemsg = (e) => {
    setMsg(e.target.value);
  };

  const handlefile = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
        const data = e.target.result; 
        const workbook = XLSX.read(data, { type: "binary" });
        const SheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[SheetName]
        const emailList = XLSX.utils.sheet_to_json(worksheet,{header:'A'})
        const totalEmail = emailList.map((item)=>{return item.A})
        setEmailList(totalEmail)
        
    };

    reader.readAsArrayBuffer(file)
  }

  const send = () => {
    setStatus(true);
    axios.post("http://localhost:5000/sendemail", { msg: msg, emailList:emailList})
    .then((data) => {
      if (data.data === true) {
        alert("Email sent Sucessfully");
        setStatus(false);
      } else {
        alert("failed");
      }
    });
  };

  return (
    <div className="App">
      <div className="bg-blue-950 text-white text-center px-5 py-3">
        <h1 className="text-2xl font-medium px-5 py-3">Bulk Mail</h1>
      </div>

      <div className="bg-blue-800 text-white text-center px-5 py-3">
        <h1 className="text-xl font-medium px-5 py-3">
          we can help your business with sending multiple emails at once
        </h1>
      </div>
      <div className="bg-blue-600 text-white text-center px-5 py-3">
        <h1 className="text-xl font-medium px-5 py-3">Drag and Drop</h1>
      </div>

      <div className="bg-blue-400 flex flex-col items-center text-black px-5 py-3">
        <textarea
          onChange={handlemsg}
          value={msg}
          className="w-[80%] h-32 py-2 outline-none border border-black rounded-md"
          placeholder="Enter the email text...."
        ></textarea>

        <div>
          <input type="file" onChange={handlefile} className="border-4 border-dashed p-4 mt-5 mb-5" />
        </div>
        <p>Total Emails in the file: {emailList.length}</p>
        <button
          onClick={send}
          className="bg-blue-900 p-2 text-white font-medium rounded-md w-fit mt-5 mb-3"
        >
          {status ? "Sending..." : "Send"}
        </button>
      </div>
      <div className="bg-blue-300 text-white text-center px-5 py-3 h-10"></div>
      <div className="bg-blue-200 text-white text-center px-5 py-3 h-10"></div>
    </div>
  );
}

export default App;
