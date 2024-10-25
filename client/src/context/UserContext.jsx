import { createContext, useEffect, useState } from "react";
import axios from "axios";
axios.defaults.withCredentials = true;

export const UserContext = createContext();

// eslint-disable-next-line react/prop-types
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const getUser = async () => {
      setLoading(true);
      try {
        const resp = await axios.get(import.meta.env.VITE_URL + "/jwt", {
          withCredentials: true,
        });
        console.log("From Context", resp.data);
        setUser(resp.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    getUser();
  }, []);

  return (
    <UserContext.Provider
      value={{ user, setUser, loading, setLoading}}
    >
      {children}
    </UserContext.Provider>
  );
};
