import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { userLoggedIn } from "../features/auth/authSlice";

export default function useAuthChecked() {
  const dispatch = useDispatch();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const localAuth = localStorage.getItem("auth");
    const auth = JSON.parse(localAuth);

    if (auth?.accessToken && auth?.user) {
      dispatch(
        userLoggedIn({
          accessToken: auth?.accessToken,
          user: auth?.user,
        })
      );
    }
    setAuthChecked(true);
  }, [dispatch]);

  return authChecked;
}
