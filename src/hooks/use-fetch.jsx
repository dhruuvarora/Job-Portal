// import { useSession } from "@clerk/clerk-react";
// import { useState } from "react";

// const useFetch = (cb, options = {}) => {
//   const [data, setData] = useState(undefined);
//   const [loading, setLoading] = useState(null);
//   const [error, setError] = useState(null);
//   const { session } = useSession();

//   const fn = async (...args) => {
//     setLoading(true);
//     setError(null);

//     try {
//       const supabaseAccessToken = await session.getToken({
//         template: "supabase",
//       });

//       const response = await cb(supabaseAccessToken, options, ...args);
//       setData(response);
//       setError(null);
//     } catch (error) {
//       setError(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return { fn, data, loading, error };
// };

// export default useFetch;



import { useSession } from "@clerk/clerk-react";
import { useState, useEffect } from "react";

const useFetch = (cb, options = {}) => {
  const [data, setData] = useState(undefined);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);
  const { session, isLoaded } = useSession(); // <-- make sure session is ready

  const fn = async (...args) => {
    if (!isLoaded || !session) return; // 👈 guard clause

    setLoading(true);
    setError(null);

    try {
      const supabaseAccessToken = await session.getToken({
        template: "supabase",
      });

      const response = await cb(supabaseAccessToken, options, ...args);
      setData(response);
      setError(null);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return { fn, data, loading, error, isLoaded }; // ⬅ you can return isLoaded optionally
};

export default useFetch;
