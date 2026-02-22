import { ShieldCheck, Lock, PenLine } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LockKeyhole } from "lucide-react";
import Navbar from "../Component/Navbar";

export default function LoadingPage() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar/>
    <div className="bg-slate-200 px-3 m-auto">
     
      <div className="mx-auto max-w-4xl pt-2 text-center ">

        {/* Icon */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 ">
          <ShieldCheck className="h-8 w-8 text-indigo-600 " />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-slate-900">
          Your Secure Diary
        </h1>
        
        <p className="mx-auto mt-3 max-w-xl text-slate-600">
          This is your private space. Every diary entry is protected with
          enterprise-grade encryption. Only you can read it.
        </p>

        {/* Action */}
        <div className="mt-8 flex justify-center gap-4">
          <button
            className="flex items-center gap-2 rounded-md bg-cyan-500 px-3 py-3 text-sm font-semibold text-white shadow"
          >
            <PenLine size={16} className=" d-none d-md-block" />
            Write Your First Diary
          </button>


        </div>
          <button
            className="px-2 px-md-6 py-3 text-sm font-semibold text-slate-700 hover:underline"
            onClick={()=> navigate("/login")}
          >
            Click To Login
          </button>


        {/* Trust Section */}
        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
          <TrustCard
            icon={<Lock className="text-indigo-600" />}
            title="Encrypted by Default"
            desc="Your data is encrypted before saving to the database."
          />
          <TrustCard
            icon={<ShieldCheck className="text-indigo-600" />}
            title="Private by Design"
            desc="Only authenticated users can access their own diaries."
          />
          <TrustCard
            icon={<PenLine className="text-indigo-600" />}
            title="Write Freely"
            desc="Unlimited private entries with full control."
          />
          
        </div>
      <div className="flex items-center justify-center bg-slate-200  py-5">
        
      <div className="w-full max-w-xl rounded-xl border border-slate-200 bg-white p-6 text-center">

        {/* Icon */}
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-lg bg-indigo-50">
          <LockKeyhole className="h-7 w-7 text-indigo-600" />
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-slate-900">
          No Diaries Found
        </h2>

        {/* Description */}
        <p className="mt-3 text-slate-600 leading-relaxed">
          You haven’t created any diary entries yet.  
          When you do, each entry will be protected using
          <strong> AES-256 encryption</strong> to keep your
          personal thoughts private.
        </p>

        {/* AES Info Box */}
        <div className="mt-6 rounded-lg bg-slate-50 border border-slate-200 p-4 text-left">
          <p className="text-sm text-slate-700">
            🔐 <strong>Encryption:</strong> Diary content is encrypted before
            being stored. Only you can decrypt and read it.
          </p>
        </div>

        {/* Action */}
        <button
          onClick={() => navigate("/login")}
          className="mt-8 rounded-md bg-cyan-600 px-6 py-3 text-sm font-medium text-white hover:bg-cyan-700"
        >
          Create your first encrypted diary
        </button>
      </div>
    </div>


      </div>
    </div>

    </>
    
  );
}

function TrustCard({ icon, title, desc }) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <div className="mb-3">{icon}</div>
      <h3 className="font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 text-sm text-slate-600">{desc}</p>
    </div>
  );
}


